import type { ProtocolName } from '../protocols/protocols.js';
import type { LiquityContractName } from '../abis/index.js';
import type { LiquityAbiMap } from '../abis/index.js';
import type { AllAbiItemNames, GetAbiItem } from '../protocols/modify.js';
import type { GetContractEventsReturnType, PublicClient } from 'viem';
import type { GlobalState } from './global.js';
import { getAbiItem } from '../protocols/modify.js';
import { protocols } from '../protocols/protocols.js';
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
	fromBlock,
	toBlock,
	blockChunkSize,
}: {
	client: PublicClient;
	protocol: P;
	contract: C;
	normalItemName: N;
	fromBlock: bigint;
	toBlock: bigint | 'latest';
	blockChunkSize?: bigint;
}) {
	const abiItem = getAbiItem(protocol, contract, normalItemName);

	const to = await (async () => {
		if (typeof toBlock === 'bigint') return toBlock;
		return await client.getBlockNumber();
	})();

	const chunkSize =
		blockChunkSize === undefined ? to - fromBlock + 1n : blockChunkSize;

	for (let chunkFrom = fromBlock; chunkFrom <= to; chunkFrom += chunkSize) {
		const chunkTo =
			chunkFrom + chunkSize - 1n > to ? to : chunkFrom + chunkSize - 1n;

		try {
			const chunkedEvents = await client.getContractEvents({
				address: protocols[protocol][contract],
				abi: [abiItem],
				eventName: abiItem,
				fromBlock: chunkFrom,
				toBlock: chunkTo
			});
			
			yield chunkedEvents;
		} catch (err) {
			return err;
		}
	}

	return null;
}
