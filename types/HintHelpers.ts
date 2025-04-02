import type {
	BaseContract,
	BigNumberish,
	BytesLike,
	FunctionFragment,
	Result,
	Interface,
	EventFragment,
	AddressLike,
	ContractRunner,
	ContractMethod,
	Listener
} from 'ethers';
import type {
	TypedContractEvent,
	TypedDeferredTopicFilter,
	TypedEventLog,
	TypedLogDescription,
	TypedListener,
	TypedContractMethod,
	Modifiers
} from './common';

type HintHelpersFunctionNameOrSignature<M extends Modifiers> =
	| 'BORROWING_FEE_FLOOR'
	| 'CCR'
	| 'DECIMAL_PRECISION'
	| `${Uppercase<M['lusd']>}_GAS_COMPENSATION`
	| 'MCR'
	| 'MIN_NET_DEBT'
	| 'NAME'
	| 'PERCENT_DIVISOR'
	| '_100pct'
	| 'activePool'
	| 'computeCR'
	| 'computeNominalCR'
	| 'defaultPool'
	| 'getApproxHint'
	| 'getEntireSystemColl'
	| 'getEntireSystemDebt'
	| 'getRedemptionHints'
	| 'isOwner'
	| 'owner'
	| 'priceFeed'
	| 'setAddresses'
	| `sorted${Capitalize<M['trove']>}s`
	| `${M['trove']}Manager`

type HintHelpersEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'OwnershipTransferred'
	| `Sorted${Capitalize<M['trove']>}sAddressChanged`
	| `${Capitalize<M['trove']>}ManagerAddressChanged`

export interface HintHelpersInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: HintHelpersFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: HintHelpersEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'BORROWING_FEE_FLOOR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'CCR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'DECIMAL_PRECISION', values?: undefined): string;
	encodeFunctionData(functionFragment: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'MCR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'MIN_NET_DEBT', values?: undefined): string;
	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'PERCENT_DIVISOR', values?: undefined): string;
	encodeFunctionData(functionFragment: '_100pct', values?: undefined): string;
	encodeFunctionData(functionFragment: 'activePool', values?: undefined): string;
	encodeFunctionData(functionFragment: 'computeCR', values: [BigNumberish, BigNumberish, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'computeNominalCR', values: [BigNumberish, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'defaultPool', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getApproxHint', values: [BigNumberish, BigNumberish, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'getEntireSystemColl', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getEntireSystemDebt', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getRedemptionHints', values: [BigNumberish, BigNumberish, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'priceFeed', values?: undefined): string;
	encodeFunctionData(functionFragment: 'setAddresses', values: [AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `sorted${Capitalize<M['trove']>}s`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['trove']}Manager`, values?: undefined): string;

	decodeFunctionResult(functionFragment: 'BORROWING_FEE_FLOOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'CCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'DECIMAL_PRECISION', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MIN_NET_DEBT', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'PERCENT_DIVISOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: '_100pct', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'activePool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'computeCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'computeNominalCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'defaultPool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getApproxHint', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getEntireSystemColl', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getEntireSystemDebt', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getRedemptionHints', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'priceFeed', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `sorted${Capitalize<M['trove']>}s`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['trove']}Manager`, data: BytesLike): Result;
}

export namespace OwnershipTransferredEvent {
	export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
	export type OutputTuple = [previousOwner: string, newOwner: string];
	export interface OutputObject {
		previousOwner: string;
		newOwner: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace SortedTrovesAddressChangedEvent {
	export type InputTuple = [_sortedTrovesAddress: AddressLike];
	export type OutputTuple = [_sortedTrovesAddress: string];
	export interface OutputObject {
		_sortedTrovesAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManagerAddressChangedEvent {
	export type InputTuple = [_troveManagerAddress: AddressLike];
	export type OutputTuple = [_troveManagerAddress: string];
	export interface OutputObject {
		_troveManagerAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

type HintHelpersTypedContractMethods<M extends Modifiers> = {
	BORROWING_FEE_FLOOR: TypedContractMethod<[], [bigint], 'view'>;
	CCR: TypedContractMethod<[], [bigint], 'view'>;
	DECIMAL_PRECISION: TypedContractMethod<[], [bigint], 'view'>;
	MCR: TypedContractMethod<[], [bigint], 'view'>;
	MIN_NET_DEBT: TypedContractMethod<[], [bigint], 'view'>;
	NAME: TypedContractMethod<[], [string], 'view'>;
	PERCENT_DIVISOR: TypedContractMethod<[], [bigint], 'view'>;
	_100pct: TypedContractMethod<[], [bigint], 'view'>;
	activePool: TypedContractMethod<[], [string], 'view'>;
	computeCR: TypedContractMethod<[_coll: BigNumberish, _debt: BigNumberish, _price: BigNumberish], [bigint], 'view'>;
	computeNominalCR: TypedContractMethod<[_coll: BigNumberish, _debt: BigNumberish], [bigint], 'view'>;
	defaultPool: TypedContractMethod<[], [string], 'view'>;
	getApproxHint: TypedContractMethod<[ _CR: BigNumberish, _numTrials: BigNumberish, _inputRandomSeed: BigNumberish], [[string, bigint, bigint] & {hintAddress: string; diff: bigint; latestRandomSeed: bigint;}], 'view'>;
	getEntireSystemColl: TypedContractMethod<[], [bigint], 'view'>;
	getEntireSystemDebt: TypedContractMethod<[], [bigint], 'view'>;
	getRedemptionHints: TypedContractMethod<[_LUSDamount: BigNumberish, _price: BigNumberish, _maxIterations: BigNumberish], [[string, bigint, bigint] & {firstRedemptionHint: string; partialRedemptionHintNICR: bigint; truncatedLUSDamount: bigint;}], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	priceFeed: TypedContractMethod<[], [string], 'view'>;
	setAddresses: TypedContractMethod<[_sortedTrovesAddress: AddressLike, _troveManagerAddress: AddressLike], [void], 'nonpayable'>;
} & {
	[K in `${Uppercase<M['lusd']>}_GAS_COMPENSATION`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `sorted${Capitalize<M['trove']>}s`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['trove']}Manager`]: TypedContractMethod<[], [string], 'view'>;
};

type HintHelpersTypedTypedContractEventFilters<M extends Modifiers> = {
	'OwnershipTransferred(address,address)': TypedContractEvent<
		OwnershipTransferredEvent.InputTuple,
		OwnershipTransferredEvent.OutputTuple,
		OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		OwnershipTransferredEvent.InputTuple,
		OwnershipTransferredEvent.OutputTuple,
		OwnershipTransferredEvent.OutputObject
	>;
} & {
	[K in `Sorted${Capitalize<M['trove']>}sAddressChanged(address)`]: TypedContractEvent<
		SortedTrovesAddressChangedEvent.InputTuple,
		SortedTrovesAddressChangedEvent.OutputTuple,
		SortedTrovesAddressChangedEvent.OutputObject
	>;
} & {
	[K in `Sorted${Capitalize<M['trove']>}sAddressChanged`]: TypedContractEvent<
		SortedTrovesAddressChangedEvent.InputTuple,
		SortedTrovesAddressChangedEvent.OutputTuple,
		SortedTrovesAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressChanged(address)`]: TypedContractEvent<
		TroveManagerAddressChangedEvent.InputTuple,
		TroveManagerAddressChangedEvent.OutputTuple,
		TroveManagerAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressChanged`]: TypedContractEvent<
		TroveManagerAddressChangedEvent.InputTuple,
		TroveManagerAddressChangedEvent.OutputTuple,
		TroveManagerAddressChangedEvent.OutputObject
	>;
};

export type HintHelpers<M extends Modifiers> = BaseContract &
	HintHelpersTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): HintHelpers<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & HintHelpers<M>>;

		interface: HintHelpersInterface<M>;

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
		): Promise<ThisType<T> & HintHelpers<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & HintHelpers<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & HintHelpers<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & HintHelpers<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;

		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & HintHelpers<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'BORROWING_FEE_FLOOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'CCR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'DECIMAL_PRECISION'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MCR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MIN_NET_DEBT'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'PERCENT_DIVISOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: '_100pct'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'activePool'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'computeCR'): TypedContractMethod<[_coll: BigNumberish, _debt: BigNumberish, _price: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: 'computeNominalCR'): TypedContractMethod<[_coll: BigNumberish, _debt: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: 'defaultPool'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'getApproxHint'): TypedContractMethod<[_CR: BigNumberish, _numTrials: BigNumberish, _inputRandomSeed: BigNumberish], [[string, bigint, bigint] & {hintAddress: string; diff: bigint; latestRandomSeed: bigint;}], 'view'>;
		getFunction(nameOrSignature: 'getEntireSystemColl'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getEntireSystemDebt'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getRedemptionHints'): TypedContractMethod<[_LUSDamount: BigNumberish, _price: BigNumberish, _maxIterations: BigNumberish], [[string, bigint, bigint] & {firstRedemptionHint: string; partialRedemptionHintNICR: bigint; truncatedLUSDamount: bigint;}], 'view'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'priceFeed'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_sortedTrovesAddress: AddressLike, _troveManagerAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['trove']}Manager`): TypedContractMethod<[], [string], 'view'>;

		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
		getEvent(key: `Sorted${Capitalize<M['trove']>}sAddressChanged`): TypedContractEvent<SortedTrovesAddressChangedEvent.InputTuple, SortedTrovesAddressChangedEvent.OutputTuple, SortedTrovesAddressChangedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}ManagerAddressChanged`): TypedContractEvent<TroveManagerAddressChangedEvent.InputTuple, TroveManagerAddressChangedEvent.OutputTuple, TroveManagerAddressChangedEvent.OutputObject>;

		filters: HintHelpersTypedTypedContractEventFilters<M>;
	};
