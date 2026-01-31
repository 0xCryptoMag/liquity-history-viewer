import type { ProtocolName } from '../protocols/protocols.js';
import type { LiquityContractName } from '../abis/index.js';
import type { LiquityAbiMap } from '../abis/index.js';
import type { AllAbiItemNames, GetAbiItem } from '../protocols/modify.js';
import type {
	ContractEventArgs,
	GetContractEventsReturnType,
	PublicClient
} from 'viem';
import type { GlobalState } from './global.js';
import { getAbiItem } from '../protocols/modify.js';
import { protocols } from '../protocols/protocols.js';
import type { UserState } from './user.js';
import { setCachedState } from './cache.js';

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
				eventName: abiItem,
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
