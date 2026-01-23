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
	subject: { blockNumber: bigint; transactionIndex: number; },
	reference: { blockNumber: bigint; transactionIndex: number; }
) {
	if (subject.blockNumber < reference.blockNumber) return true;
	if (subject.blockNumber > reference.blockNumber) return false;
	return subject.transactionIndex < reference.transactionIndex;
}

export function isSameTxn(
	subject: { blockNumber: bigint; transactionIndex: number; },
	reference: { blockNumber: bigint; transactionIndex: number; }
) {
	return subject.blockNumber === reference.blockNumber &&
		subject.transactionIndex === reference.transactionIndex;
}

export function isAfter(
	subject: { blockNumber: bigint; transactionIndex: number; },
	reference: { blockNumber: bigint; transactionIndex: number; }
) {
	if (subject.blockNumber > reference.blockNumber) return true;
	if (subject.blockNumber < reference.blockNumber) return false;
	return subject.transactionIndex > reference.transactionIndex;
}