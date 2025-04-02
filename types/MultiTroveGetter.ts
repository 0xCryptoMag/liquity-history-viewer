import type {
	BaseContract,
	BigNumberish,
	BytesLike,
	FunctionFragment,
	Result,
	Interface,
	AddressLike,
	ContractRunner,
	ContractMethod,
	Listener
} from 'ethers';
import type {
	TypedContractEvent,
	TypedDeferredTopicFilter,
	TypedEventLog,
	TypedListener,
	TypedContractMethod,
	Modifiers
} from './common';

type ActivePoolFunctionNameOrSignature<M extends Modifiers> =
	| `getMultipleSorted${Capitalize<M['trove']>}s`
	| `sorted${Capitalize<M['trove']>}`
	| `${M['trove']}Manager`


export declare namespace MultiTroveGetter {
	export type CombinedTroveDataStruct = {
		owner: AddressLike;
		debt: BigNumberish;
		coll: BigNumberish;
		stake: BigNumberish;
		snapshotETH: BigNumberish;
		snapshotLUSDDebt: BigNumberish;
	};

	export type CombinedTroveDataStructOutput = [
		owner: string,
		debt: bigint,
		coll: bigint,
		stake: bigint,
		snapshotETH: bigint,
		snapshotLUSDDebt: bigint
	] & {
		owner: string;
		debt: bigint;
		coll: bigint;
		stake: bigint;
		snapshotETH: bigint;
		snapshotLUSDDebt: bigint;
	};
}

export interface MultiTroveGetterInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: ActivePoolFunctionNameOrSignature<M>
	): FunctionFragment;

	encodeFunctionData(functionFragment: `getMultipleSorted${Capitalize<M['trove']>}s`, values: [BigNumberish, BigNumberish]): string;
	encodeFunctionData(functionFragment: `sorted${Capitalize<M['trove']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['trove']}Manager`, values?: undefined): string;

	decodeFunctionResult(functionFragment: `getMultipleSorted${Capitalize<M['trove']>}s`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `sorted${Capitalize<M['trove']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['trove']}Manager`, data: BytesLike): Result;
}

type MultiTroveGetterTypedContractMethods<M extends Modifiers> = {
	[K in `getMultipleSorted${Capitalize<M['trove']>}s`]: TypedContractMethod<[_startIdx: BigNumberish, _count: BigNumberish], [MultiTroveGetter.CombinedTroveDataStructOutput[]], 'view'>;
} & {
	[K in `sorted${Capitalize<M['trove']>}`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['trove']}Manager`]: TypedContractMethod<[], [string], 'view'>;
}


export type MultiTroveGetter<M extends Modifiers> = BaseContract &
	MultiTroveGetterTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): MultiTroveGetter<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & MultiTroveGetter<M>>;

		interface: MultiTroveGetterInterface<M>;

		queryFilter<TCEvent extends TypedContractEvent>(
			event: TCEvent,
			fromBlockOrBlockhash?: string | number | undefined,
			toBlock?: string | number | undefined
		): Promise<Array<TypedEventLog<TCEvent>>>;
		queryFilter<TCEvent extends TypedContractEvent>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			fromBlockOrBlockhash?: string | number | undefined,
			toBlock?: string | number | undefined
		): Promise<Array<TypedEventLog<TCEvent>>>;

		on<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & MultiTroveGetter<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & MultiTroveGetter<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & MultiTroveGetter<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & MultiTroveGetter<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;

		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & MultiTroveGetter<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'getMultipleSortedTroves'): TypedContractMethod<[_startIdx: BigNumberish, _count: BigNumberish], [MultiTroveGetter.CombinedTroveDataStructOutput[]], 'view'>;
		getFunction(nameOrSignature: 'sortedTroves'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'troveManager'): TypedContractMethod<[], [string], 'view'>;

		filters: {};
	};
