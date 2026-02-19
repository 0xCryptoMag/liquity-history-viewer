import type { ProtocolName } from '../protocols/protocols.js';
import type { LiquityContractName } from '../abis/index.js';
import type { LiquityAbiMap } from '../abis/index.js';
import type { AllAbiItemNames, GetAbiItem } from '../protocols/modify.js';
import type {
	Address,
	ContractEventArgs,
	ContractEventName,
	GetContractEventsReturnType,
	PublicClient
} from 'viem';
import { getAbiItem } from '../protocols/modify.js';
import { protocols } from '../protocols/protocols.js';
import {
	appendCachedArray,
	getCachedArrayLength,
	getCachedArrayRange,
	getCachedState,
	readCachedArray,
	setCachedState
} from './cache.js';
import type { GlobalState } from './global.js';
import type { UserState } from './user.js';

// prettier-ignore
export async function* getContractEventsGenerator<
	P extends ProtocolName,
	C extends LiquityContractName & keyof (typeof protocols)[P],
	N extends AllAbiItemNames<LiquityAbiMap[C]>
>({
	client,
	protocol,
	contract,
	normalItemName,
	args,
	fromBlock,
	toBlock,
	blockChunkSize,
}: {
	client: PublicClient;
	protocol: P;
	contract: C;
	normalItemName: N;
	args?: ContractEventArgs<readonly [GetAbiItem<P, C, N>]>;
	fromBlock: bigint;
	toBlock: bigint;
	blockChunkSize?: bigint;
}) {
	const abiItem = getAbiItem(protocol, contract, normalItemName);

	const chunkSize =
		blockChunkSize === undefined ? toBlock - fromBlock + 1n : blockChunkSize;

	for (let chunkFrom = fromBlock; chunkFrom <= toBlock; chunkFrom += chunkSize) {
		const chunkTo =
			chunkFrom + chunkSize - 1n > toBlock ? toBlock : chunkFrom + chunkSize - 1n;

		try {
			const chunkedEvents = await client.getContractEvents({
				address: protocols[protocol][contract],
				abi: [abiItem],
				eventName: (abiItem as { name: string }).name as ContractEventName<
					readonly [GetAbiItem<P, C, N>]
				>,
				args: args as ContractEventArgs<readonly [GetAbiItem<P, C, N>]>,
				fromBlock: chunkFrom,
				toBlock: chunkTo
			});

			yield {
				events: chunkedEvents,
				lastFetchedBlock: chunkTo
			};
		} catch (err) {
			return err;
		}
	}

	return null;
}

export async function getBlockTimestamps({
	client,
	blockNumberToTimestampMap,
	events
}: {
	client: PublicClient;
	blockNumberToTimestampMap: Map<bigint, bigint>;
	events: {
		blockNumber: bigint;
		blockTimestamp?: bigint | undefined;
	}[];
}) {
	const uniqueBlockNumbers = new Set<bigint>();

	for (const e of events) {
		if (e.blockTimestamp === undefined) {
			uniqueBlockNumbers.add(e.blockNumber);
		}
	}

	const missingBlockNumbers: bigint[] = [];

	for (const blockNumber of uniqueBlockNumbers) {
		if (!blockNumberToTimestampMap.has(blockNumber)) {
			missingBlockNumbers.push(blockNumber);
		}
	}

	if (missingBlockNumbers.length > 0) {
		missingBlockNumbers.sort((a, b) => (a < b ? -1 : 1));

		const batchRequests = missingBlockNumbers.map((bn) => {
			return client
				.getBlock({
					blockNumber: bn,
					includeTransactions: false
				})
				.then((block) => ({ bn, timestamp: block.timestamp }));
		});

		const batchResponses = await Promise.all(batchRequests);

		for (const { bn, timestamp } of batchResponses) {
			blockNumberToTimestampMap.set(bn, timestamp);
		}
	}

	for (const e of events) {
		if (e.blockTimestamp === undefined) {
			e.blockTimestamp = blockNumberToTimestampMap.get(e.blockNumber)!;
		}
	}
}

type CachedArrayElement<
	K0 extends 'global' | Address,
	K1 extends string
> = K0 extends 'global'
	? GlobalState[Extract<K1, keyof GlobalState>] extends readonly (infer E)[]
		? E
		: never
	: UserState[Extract<K1, keyof UserState>] extends readonly (infer E)[]
	? E
	: never;

export async function getCacheAndTransformEvents<
	P extends ProtocolName,
	C extends LiquityContractName,
	N extends AllAbiItemNames<LiquityAbiMap[C]>,
	T extends unknown,
	K0 extends 'global' | Address,
	K1 extends K0 extends 'global'
		? Exclude<keyof GlobalState, 'DECIMAL_PRECISION' | 'SCALE_FACTOR'>
		: keyof UserState
>({
	client,
	protocol,
	contract,
	normalItemName,
	args,
	latestBlock,
	blockNumberToTimestampMap,
	keyPath,
	transform
}: {
	client: PublicClient;
	protocol: P;
	contract: C;
	normalItemName: N;
	args?: ContractEventArgs<readonly [GetAbiItem<P, C, N>]>;
	latestBlock: bigint;
	blockNumberToTimestampMap: Map<bigint, bigint>;
	keyPath: [K0, K1];
	transform: (
		event: GetContractEventsReturnType<
			readonly [GetAbiItem<P, C, N>]
		>[number]
	) => T;
}) {
	const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
		...keyPath,
		'lastFetchedBlock'
	]);

	const eventsGenerator = getContractEventsGenerator({
		client,
		protocol,
		contract,
		normalItemName,
		args,
		fromBlock:
			cachedLastFetchedBlock === null
				? protocols[protocol].deployBlock
				: cachedLastFetchedBlock + 1n,
		toBlock: latestBlock,
		blockChunkSize: 75_000n
	});

	for await (const e of eventsGenerator) {
		if (e === null) break;
		if (e instanceof Error) throw e;

		await getBlockTimestamps({
			client,
			blockNumberToTimestampMap,
			events: e.events
		});

		const arr = e.events.map(transform);

		await appendCachedArray(protocol, keyPath, arr);
		await setCachedState(
			protocol,
			[...keyPath, 'lastFetchedBlock'],
			e.lastFetchedBlock
		);
	}

	const transformedEvents = await readCachedArray<CachedArrayElement<K0, K1>>(
		protocol,
		keyPath
	);

	return transformedEvents;
}

type ArrayAndFilter<T extends { blockNumber: bigint }> = {
	array: T[];
	filter: (lastBlockNumber: bigint) => (e: T) => boolean;
};

export async function getBlockNumbersForEvents<
	T extends { blockNumber: bigint }[]
>(
	{
		protocol,
		keyPath
	}: {
		protocol: ProtocolName;
		keyPath: string[];
	},
	...arraysAndFilters: { [K in keyof T]: ArrayAndFilter<T[K]> }
) {
	const cachedArrayLength = await getCachedArrayLength(protocol, keyPath);

	const lastCachedItem = await getCachedArrayRange<T[number]>(
		protocol,
		keyPath,
		cachedArrayLength - 1
	);

	const blockNumbers = (
		arraysAndFilters as ArrayAndFilter<T[number]>[]
	).reduce((acc: bigint[], { array, filter }) => {
		const blockNumbers = array
			.filter(filter(lastCachedItem[0]?.blockNumber ?? 0n))
			.map((e) => e.blockNumber);

		acc.push(...blockNumbers);

		return acc;
	}, []);

	const sortedUniqueBlockNumbers = Array.from(
		new Set(blockNumbers.sort((a, b) => (a < b ? -1 : 1)))
	);

	return sortedUniqueBlockNumbers;
}

export async function getCacheAndTransformEventsFromBlockNumbers<
	P extends ProtocolName,
	C extends LiquityContractName,
	N extends AllAbiItemNames<LiquityAbiMap[C]>,
	T extends unknown,
	K0 extends 'global' | Address,
	K1 extends K0 extends 'global'
		? Exclude<keyof GlobalState, 'DECIMAL_PRECISION' | 'SCALE_FACTOR'>
		: keyof UserState
>({
	client,
	protocol,
	contract,
	normalItemName,
	args,
	blockNumbers,
	blockNumberToTimestampMap,
	keyPath,
	transform
}: {
	client: PublicClient;
	protocol: P;
	contract: C;
	normalItemName: N;
	args?: ContractEventArgs<readonly [GetAbiItem<P, C, N>]>;
	blockNumbers: bigint[];
	blockNumberToTimestampMap: Map<bigint, bigint>;
	keyPath: [K0, K1];
	transform: (
		event: GetContractEventsReturnType<
			readonly [GetAbiItem<P, C, N>]
		>[number]
	) => T;
}) {
	const abiItem = getAbiItem(protocol, contract, normalItemName);

	const batchRequests = blockNumbers.map((bn) => {
		return client.getContractEvents({
			address: protocols[protocol][contract],
			abi: [abiItem],
			eventName: (abiItem as { name: string }).name as ContractEventName<
				readonly [GetAbiItem<P, C, N>]
			>,
			args: args as ContractEventArgs<readonly [GetAbiItem<P, C, N>]>,
			fromBlock: bn,
			toBlock: bn
		});
	});

	// Grab the first event form the response. For instance,
	// TroveSnapshotsUpdated may have multiple events that do not correlate to
	// the user trove (like redemption ops where the user's trove is affected,
	// but so do a lot of other troves), however they all have the same LTerm
	// accumulator values so we can just take e[0]
	// @TODO: If an event does not conform to the above, fix this assumption
	const events = (await Promise.all(batchRequests))
		.map((e) => e[0]!)
		.filter((e) => e !== undefined);

	await getBlockTimestamps({
		client,
		blockNumberToTimestampMap,
		events
	});

	const arr = events.map(transform);

	await appendCachedArray(protocol, keyPath, arr);

	const transformedEvents = await readCachedArray<CachedArrayElement<K0, K1>>(
		protocol,
		keyPath
	);

	return transformedEvents;
}
