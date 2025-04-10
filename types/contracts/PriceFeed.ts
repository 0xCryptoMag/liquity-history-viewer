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
} from './common.js';

type PriceFeedFunctionNameOrSignature<M extends Modifiers> =
	| 'DECIMAL_PRECISION'
	| `${Uppercase<M['eth']>}USD_TELLOR_REQ_ID`
	| 'MAX_PRICE_DEVIATION_FROM_PREVIOUS_ROUND'
	| 'MAX_PRICE_DIFFERENCE_BETWEEN_ORACLES'
	| 'NAME'
	| 'TARGET_DIGITS'
	| 'TELLOR_DIGITS'
	| 'TIMEOUT'
	| 'fetchPrice'
	| 'isOwner'
	| 'lastGoodPrice'
	| 'owner'
	| 'priceAggregator'
	| 'setAddresses'
	| 'status'
	| 'tellorCaller'

type PriceFeedEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'LastGoodPriceUpdated'
	| 'OwnershipTransferred'
	| 'PriceFeedStatusChanged'

export interface PriceFeedInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: PriceFeedFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: PriceFeedEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'DECIMAL_PRECISION', values?: undefined): string;
	encodeFunctionData(functionFragment: `${Uppercase<M['eth']>}USD_TELLOR_REQ_ID`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'MAX_PRICE_DEVIATION_FROM_PREVIOUS_ROUND', values?: undefined): string;
	encodeFunctionData(functionFragment: 'MAX_PRICE_DIFFERENCE_BETWEEN_ORACLES', values?: undefined): string;
	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'TARGET_DIGITS', values?: undefined): string;
	encodeFunctionData(functionFragment: 'TELLOR_DIGITS', values?: undefined): string;
	encodeFunctionData(functionFragment: 'TIMEOUT', values?: undefined): string;
	encodeFunctionData(functionFragment: 'fetchPrice', values?: undefined): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'lastGoodPrice', values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'priceAggregator', values?: undefined): string;
	encodeFunctionData(functionFragment: 'setAddresses', values: [AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'status', values?: undefined): string;
	encodeFunctionData(functionFragment: 'tellorCaller', values?: undefined): string;

	decodeFunctionResult(functionFragment: 'DECIMAL_PRECISION', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${Uppercase<M['eth']>}USD_TELLOR_REQ_ID`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MAX_PRICE_DEVIATION_FROM_PREVIOUS_ROUND', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MAX_PRICE_DIFFERENCE_BETWEEN_ORACLES', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'TARGET_DIGITS', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'TELLOR_DIGITS', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'TIMEOUT', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'fetchPrice', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'lastGoodPrice', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'priceAggregator', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'status', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'tellorCaller', data: BytesLike): Result;
}

export namespace PriceFeed_LastGoodPriceUpdatedEvent {
	export type InputTuple = [_lastGoodPrice: BigNumberish];
	export type OutputTuple = [_lastGoodPrice: bigint];
	export interface OutputObject {
		_lastGoodPrice: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace PriceFeed_OwnershipTransferredEvent {
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

export namespace PriceFeed_PriceFeedStatusChangedEvent {
	export type InputTuple = [newStatus: BigNumberish];
	export type OutputTuple = [newStatus: bigint];
	export interface OutputObject {
		newStatus: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

type PriceFeedTypedContractMethods<M extends Modifiers> = {
	DECIMAL_PRECISION: TypedContractMethod<[], [bigint], 'view'>;
	MAX_PRICE_DEVIATION_FROM_PREVIOUS_ROUND: TypedContractMethod<[], [bigint], 'view'>;
	MAX_PRICE_DIFFERENCE_BETWEEN_ORACLES: TypedContractMethod<[], [bigint], 'view'>;
	NAME: TypedContractMethod<[], [string], 'view'>;
	TARGET_DIGITS: TypedContractMethod<[], [bigint], 'view'>;
	TELLOR_DIGITS: TypedContractMethod<[], [bigint], 'view'>;
	TIMEOUT: TypedContractMethod<[], [bigint], 'view'>;
	fetchPrice: TypedContractMethod<[], [bigint], 'nonpayable'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	lastGoodPrice: TypedContractMethod<[], [bigint], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	priceAggregator: TypedContractMethod<[], [string], 'view'>;
	setAddresses: TypedContractMethod<[_priceAggregatorAddress: AddressLike, _tellorCallerAddress: AddressLike], [void], 'nonpayable'>;
	status: TypedContractMethod<[], [bigint], 'view'>;
	tellorCaller: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${Uppercase<M['eth']>}USD_TELLOR_REQ_ID`]: TypedContractMethod<[], [bigint], 'view'>;
};

type PriceFeedTypedContractEventFilters = {
	'LastGoodPriceUpdated(uint256)': TypedContractEvent<
		PriceFeed_LastGoodPriceUpdatedEvent.InputTuple,
		PriceFeed_LastGoodPriceUpdatedEvent.OutputTuple,
		PriceFeed_LastGoodPriceUpdatedEvent.OutputObject
	>;
	'LastGoodPriceUpdated': TypedContractEvent<
		PriceFeed_LastGoodPriceUpdatedEvent.InputTuple,
		PriceFeed_LastGoodPriceUpdatedEvent.OutputTuple,
		PriceFeed_LastGoodPriceUpdatedEvent.OutputObject
	>;

	'OwnershipTransferred(address,address)': TypedContractEvent<
		PriceFeed_OwnershipTransferredEvent.InputTuple,
		PriceFeed_OwnershipTransferredEvent.OutputTuple,
		PriceFeed_OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		PriceFeed_OwnershipTransferredEvent.InputTuple,
		PriceFeed_OwnershipTransferredEvent.OutputTuple,
		PriceFeed_OwnershipTransferredEvent.OutputObject
	>;

	'PriceFeedStatusChanged(uint8)': TypedContractEvent<
		PriceFeed_PriceFeedStatusChangedEvent.InputTuple,
		PriceFeed_PriceFeedStatusChangedEvent.OutputTuple,
		PriceFeed_PriceFeedStatusChangedEvent.OutputObject
	>;
	'PriceFeedStatusChanged': TypedContractEvent<
		PriceFeed_PriceFeedStatusChangedEvent.InputTuple,
		PriceFeed_PriceFeedStatusChangedEvent.OutputTuple,
		PriceFeed_PriceFeedStatusChangedEvent.OutputObject
	>;
};

export type PriceFeed<M extends Modifiers> = BaseContract &
	PriceFeedTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): PriceFeed<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & PriceFeed<M>>;

		interface: PriceFeedInterface<M>;

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
		): Promise<ThisType<T> & PriceFeed<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & PriceFeed<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & PriceFeed<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & PriceFeed<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;
		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & PriceFeed<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'DECIMAL_PRECISION'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `${Uppercase<M['eth']>}USD_TELLOR_REQ_ID`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MAX_PRICE_DEVIATION_FROM_PREVIOUS_ROUND'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MAX_PRICE_DIFFERENCE_BETWEEN_ORACLES'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'TARGET_DIGITS'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'TELLOR_DIGITS'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'TIMEOUT'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'fetchPrice'): TypedContractMethod<[], [bigint], 'nonpayable'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: 'lastGoodPrice'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'priceAggregator'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_priceAggregatorAddress: AddressLike, _tellorCallerAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'status'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'tellorCaller'): TypedContractMethod<[], [string], 'view'>;

		getEvent(key: 'LastGoodPriceUpdated'): TypedContractEvent<PriceFeed_LastGoodPriceUpdatedEvent.InputTuple, PriceFeed_LastGoodPriceUpdatedEvent.OutputTuple, PriceFeed_LastGoodPriceUpdatedEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<PriceFeed_OwnershipTransferredEvent.InputTuple, PriceFeed_OwnershipTransferredEvent.OutputTuple, PriceFeed_OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'PriceFeedStatusChanged'): TypedContractEvent<PriceFeed_PriceFeedStatusChangedEvent.InputTuple, PriceFeed_PriceFeedStatusChangedEvent.OutputTuple, PriceFeed_PriceFeedStatusChangedEvent.OutputObject>;

		filters: PriceFeedTypedContractEventFilters;
	};
