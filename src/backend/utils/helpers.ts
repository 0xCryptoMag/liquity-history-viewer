import type { ProtocolName } from '../protocols/protocols.js';
import type { LiquityContractName } from '../abis/index.js';
import type { LiquityAbiMap } from '../abis/index.js';
import type { AllAbiItemNames } from '../protocols/modify.js';
import type { PublicClient } from 'viem';
import { getAbiItem } from '../protocols/modify.js';
import { protocols } from '../protocols/protocols.js';

// Helper type to extract value from union args using union key
// This distributes over both unions to find matching key-value pairs
// Returns the union of all values where any key from Key exists in any Args member
export type ExtractUnionValue<
	Args extends Record<string, unknown>,
	Key extends string
> = Args extends infer U
	? U extends Record<string, unknown>
		? Key extends infer K
			? K extends string
				? K extends keyof U
					? U[K]
					: never
				: never
			: never
		: never
	: never;

// Prettify type helper - makes complex types more readable by expanding them
// Useful for making intersection types, mapped types, and other complex types display nicely
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export function isBefore(
	subject: { blockNumber: bigint; transactionIndex: number },
	reference: { blockNumber: bigint; transactionIndex: number }
) {
	if (subject.blockNumber < reference.blockNumber) return true;
	if (subject.blockNumber > reference.blockNumber) return false;
	return subject.transactionIndex < reference.transactionIndex;
}

export function isSameTxn(
	subject: { blockNumber: bigint; transactionIndex: number },
	reference: { blockNumber: bigint; transactionIndex: number }
) {
	return (
		subject.blockNumber === reference.blockNumber &&
		subject.transactionIndex === reference.transactionIndex
	);
}

export function isAfter(
	subject: { blockNumber: bigint; transactionIndex: number },
	reference: { blockNumber: bigint; transactionIndex: number }
) {
	if (subject.blockNumber > reference.blockNumber) return true;
	if (subject.blockNumber < reference.blockNumber) return false;
	return subject.transactionIndex > reference.transactionIndex;
}

export async function getContractEvents<
	P extends ProtocolName,
	C extends LiquityContractName & keyof (typeof protocols)[P],
	N extends AllAbiItemNames<LiquityAbiMap[C]>
>({
	client,
	protocol,
	contract,
	normalItemName,
	fromBlock,
	toBlock
}: {
	client: PublicClient;
	protocol: P;
	contract: C;
	normalItemName: N;
	fromBlock: bigint;
	toBlock: bigint | 'latest';
}) {
	const abiItem = getAbiItem(protocol, contract, normalItemName);

	try {
		return await client.getContractEvents({
			address: protocols[protocol][contract],
			abi: [abiItem],
			eventName: abiItem,
			fromBlock: fromBlock,
			toBlock: toBlock
		});
	} catch (error) {
		return null;
	}
}
