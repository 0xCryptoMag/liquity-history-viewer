import type { ReplaceBrandedWordsInString, Modifiers } from './rebrand.js';
import type {
	AbiParameter,
	AbiEventParameter,
	AbiFunction,
	AbiEvent,
	Abi
} from 'abitype';
import type {
	LiquityAbi,
	LiquityAbiMap,
	LiquityContractName
} from '../abis/index.js';
import type { ProtocolName } from './protocols.js';
import {
	activePoolAbi,
	borrowerOperationsAbi,
	collSurplusPoolAbi,
	defaultPoolAbi,
	gasPoolAbi,
	lqtyStakingAbi,
	lqtyTokenAbi,
	lusdTokenAbi,
	priceFeedAbi,
	sortedTrovesAbi,
	stabilityPoolAbi,
	troveManagerAbi
} from '../abis/index.js';
import { replaceBrandedWordsInString } from './rebrand.js';
import { protocols } from './protocols.js';

//prettier-ignore
type ModifyAbiParams<
	P extends readonly AbiParameter[],
	M extends Modifiers
> = P extends readonly [infer first, ...infer rest]
	? readonly [
		first extends { name: infer N }
			? N extends string
				? Omit<first, 'name'> & {
					name: ReplaceBrandedWordsInString<N, M>;
				}
				: never
			: never,
		...(rest extends readonly AbiParameter[]
			? ModifyAbiParams<rest, M>
			: readonly []
		)
	]
	: readonly [];

// prettier-ignore
type ModifyAbiEventParams<
	P extends readonly AbiEventParameter[],
	M extends Modifiers
> = P extends readonly [infer first, ...infer rest]
	? readonly [
		first extends { name: infer N }
			? N extends string
				? Omit<first, 'name'> & {
					name: ReplaceBrandedWordsInString<N, M>;
				}
				: never
			: never,
		...(rest extends readonly AbiEventParameter[]
			? ModifyAbiEventParams<rest, M>
			: readonly []
		)
	]
	: readonly [];

// prettier-ignore
type ModifyAbiItem<
	I extends AbiFunction | AbiEvent,
	M extends Modifiers
> = I extends AbiFunction
	? Omit<I, 'name' | 'inputs' | 'outputs'> & {
		name: ReplaceBrandedWordsInString<I['name'], M>;
		inputs: ModifyAbiParams<I['inputs'], M>;
		outputs: ModifyAbiParams<I['outputs'], M>;
	}
	: Omit<I, 'name' | 'inputs' | 'outputs'> & {
		name: ReplaceBrandedWordsInString<I['name'], M>;
		inputs: ModifyAbiEventParams<I['inputs'], M>;
	};

// prettier-ignore
type ModifyAbi<A extends Abi, M extends Modifiers> = {
	readonly [K in keyof A]: A[K] extends AbiFunction | AbiEvent
		? ModifyAbiItem<A[K], M>
		: A[K];
};

export function modifyAbi<A extends LiquityAbi, M extends Modifiers>(
	abi: A,
	modifiers: M
): ModifyAbi<A, M> {
	return abi.map((item: LiquityAbi[number]) => {
		const result = { ...item } as Record<string, unknown>;

		if ('name' in item && typeof item.name === 'string') {
			result.name = replaceBrandedWordsInString(item.name, modifiers);
		}

		if ('inputs' in item && Array.isArray(item.inputs)) {
			result.inputs = item.inputs.map((input: unknown) => {
				if (
					input &&
					typeof input === 'object' &&
					'name' in input &&
					typeof input.name === 'string'
				) {
					return {
						...input,
						name: replaceBrandedWordsInString(input.name, modifiers)
					};
				}
				return input;
			});
		}

		if ('outputs' in item && Array.isArray(item.outputs)) {
			result.outputs = item.outputs.map((output: unknown) => {
				if (
					output &&
					typeof output === 'object' &&
					'name' in output &&
					typeof output.name === 'string'
				) {
					return {
						...output,
						name: replaceBrandedWordsInString(
							output.name,
							modifiers
						)
					};
				}
				return output;
			});
		}

		return result as LiquityAbi[number];
	}) as ModifyAbi<A, M>;
}

export type AllAbiItemNames<A extends LiquityAbi> =
	A extends readonly (infer item)[]
		? item extends { name: infer N }
			? N extends string
				? N
				: never
			: never
		: never;

// prettier-ignore
type FindAbiItemByContractAndName<
	C extends LiquityContractName,
	N extends AllAbiItemNames<LiquityAbiMap[C]>,
	M extends Modifiers
> = Extract<LiquityAbiMap[C][number], { name: N }> extends infer originalItem
	? [originalItem] extends [{ name: N }]
		? [originalItem] extends [never]
			? never
			: [originalItem] extends [AbiFunction]
				? ModifyAbiItem<originalItem, M>
				: [originalItem] extends [AbiEvent]
					? ModifyAbiItem<originalItem, M>
					: never
		: never
	: never;

function findItemInAbiByName<A extends Abi, N extends string>(
	abi: A,
	name: N
): Extract<A[number], { name: N }> | undefined {
	return abi.find((item) => 'name' in item && item.name === name) as
		| Extract<A[number], { name: N }>
		| undefined;
}

function getModifiedAbis<P extends ProtocolName>(
	protocol: P
): {
	activePool: ModifyAbi<
		typeof activePoolAbi,
		(typeof protocols)[P]['modifiers']
	>;
	borrowerOperations: ModifyAbi<
		typeof borrowerOperationsAbi,
		(typeof protocols)[P]['modifiers']
	>;
	collSurplusPool: ModifyAbi<
		typeof collSurplusPoolAbi,
		(typeof protocols)[P]['modifiers']
	>;
	defaultPool: ModifyAbi<
		typeof defaultPoolAbi,
		(typeof protocols)[P]['modifiers']
	>;
	gasPool: ModifyAbi<typeof gasPoolAbi, (typeof protocols)[P]['modifiers']>;
	lqtyStaking: ModifyAbi<
		typeof lqtyStakingAbi,
		(typeof protocols)[P]['modifiers']
	>;
	lqtyToken: ModifyAbi<
		typeof lqtyTokenAbi,
		(typeof protocols)[P]['modifiers']
	>;
	lusdToken: ModifyAbi<
		typeof lusdTokenAbi,
		(typeof protocols)[P]['modifiers']
	>;
	priceFeed: ModifyAbi<
		typeof priceFeedAbi,
		(typeof protocols)[P]['modifiers']
	>;
	sortedTroves: ModifyAbi<
		typeof sortedTrovesAbi,
		(typeof protocols)[P]['modifiers']
	>;
	stabilityPool: ModifyAbi<
		typeof stabilityPoolAbi,
		(typeof protocols)[P]['modifiers']
	>;
	troveManager: ModifyAbi<
		typeof troveManagerAbi,
		(typeof protocols)[P]['modifiers']
	>;
} {
	const { modifiers } = protocols[protocol];
	type SpecificModifiers = (typeof protocols)[P]['modifiers'];

	return {
		activePool: modifyAbi(activePoolAbi, modifiers as SpecificModifiers),
		borrowerOperations: modifyAbi(
			borrowerOperationsAbi,
			modifiers as SpecificModifiers
		),
		collSurplusPool: modifyAbi(
			collSurplusPoolAbi,
			modifiers as SpecificModifiers
		),
		defaultPool: modifyAbi(defaultPoolAbi, modifiers as SpecificModifiers),
		gasPool: modifyAbi(gasPoolAbi, modifiers as SpecificModifiers),
		lqtyStaking: modifyAbi(lqtyStakingAbi, modifiers as SpecificModifiers),
		lqtyToken: modifyAbi(lqtyTokenAbi, modifiers as SpecificModifiers),
		lusdToken: modifyAbi(lusdTokenAbi, modifiers as SpecificModifiers),
		priceFeed: modifyAbi(priceFeedAbi, modifiers as SpecificModifiers),
		sortedTroves: modifyAbi(
			sortedTrovesAbi,
			modifiers as SpecificModifiers
		),
		stabilityPool: modifyAbi(
			stabilityPoolAbi,
			modifiers as SpecificModifiers
		),
		troveManager: modifyAbi(troveManagerAbi, modifiers as SpecificModifiers)
	};
}

type AllProtocolAbiItems<
	C extends LiquityContractName,
	N extends AllAbiItemNames<LiquityAbiMap[C]>
> = {
	[P in ProtocolName]: FindAbiItemByContractAndName<
		C,
		N,
		(typeof protocols)[P]['modifiers']
	>;
}[ProtocolName];

// prettier-ignore
export type GetAbiItem<
	P extends ProtocolName,
	C extends LiquityContractName,
	N extends AllAbiItemNames<LiquityAbiMap[C]>
> = [P] extends [ProtocolName]
	? ProtocolName extends P
		? AllProtocolAbiItems<C, N>
		: FindAbiItemByContractAndName<C, N, (typeof protocols)[P]['modifiers']>
	: AllProtocolAbiItems<C, N>;

// prettier-ignore
export function getAbiItem<
	P extends ProtocolName,
	C extends LiquityContractName,
	N extends AllAbiItemNames<LiquityAbiMap[C]>
>(
	protocol: P,
	contract: C,
	normalItemName: N
): GetAbiItem<P, C, N>
{
	type SpecificModifiers = (typeof protocols)[P]['modifiers'];
	const modifiers = protocols[protocol].modifiers as SpecificModifiers;

	const modifiedName = replaceBrandedWordsInString(normalItemName, modifiers);

	const item = findItemInAbiByName(
		getModifiedAbis(protocol)[contract],
		modifiedName
	);
	if (item) {
		return item as ReturnType<typeof getAbiItem<P, C, N>>;
	}

	throw new Error(
		`ABI item "${modifiedName}" (original: "${normalItemName}")` +
			`not found in contract "${contract}" for protocol "${protocol}"`
	);
}
