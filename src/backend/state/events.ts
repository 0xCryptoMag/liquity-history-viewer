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
	keyPath
}: {
	client: PublicClient;
	protocol: P;
	contract: C;
	normalItemName: N;
	args?: ContractEventArgs<readonly [GetAbiItem<P, C, N>]>;
	fromBlock: bigint;
	toBlock: bigint;
	blockChunkSize?: bigint;
	keyPath: string[];
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

			await setCachedState(
				protocol,
				[...keyPath, 'lastFetchedBlock'],
				chunkTo
			);

			yield chunkedEvents;
		} catch (err) {
			return err;
		}
	}

	return null;
}
