import type {
	BaseContract,
	BigNumberish,
	BytesLike,
	FunctionFragment,
	Result,
	Interface,
	EventFragment,
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
	TypedContractMethod
} from './common';

type ActivePoolFunctionNameOrSignature = 'fetchPrice' | 'getPrice' | 'setPrice'

type ActivePoolEventNameOrSignatureOrTopic = 'LastGoodPriceUpdated'

export interface PriceFeedTestnetInterface extends Interface {
	getFunction(
		nameOrSignature: ActivePoolFunctionNameOrSignature
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: ActivePoolEventNameOrSignatureOrTopic
	): EventFragment;

	encodeFunctionData(functionFragment: 'fetchPrice', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getPrice', values?: undefined): string;
	encodeFunctionData(functionFragment: 'setPrice', values: [BigNumberish]): string;

	decodeFunctionResult(functionFragment: 'fetchPrice', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getPrice', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setPrice', data: BytesLike): Result;
}

export namespace LastGoodPriceUpdatedEvent {
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

type ActivePoolTypedContractMethods = {
	fetchPrice: TypedContractMethod<[], [bigint], 'nonpayable'>;
	getPrice: TypedContractMethod<[], [bigint], 'view'>;
	setPrice: TypedContractMethod<[price: BigNumberish], [boolean], 'nonpayable'>;
};

type ActivePoolTypedContractEventFilters = {
	'LastGoodPriceUpdated(uint256)': TypedContractEvent<
		LastGoodPriceUpdatedEvent.InputTuple,
		LastGoodPriceUpdatedEvent.OutputTuple,
		LastGoodPriceUpdatedEvent.OutputObject
	>;
	'LastGoodPriceUpdated': TypedContractEvent<
		LastGoodPriceUpdatedEvent.InputTuple,
		LastGoodPriceUpdatedEvent.OutputTuple,
		LastGoodPriceUpdatedEvent.OutputObject
	>;
};

export type PriceFeedTestnet = BaseContract &
	ActivePoolTypedContractMethods & {
		connect(runner?: ContractRunner | null): PriceFeedTestnet;
		waitForDeployment<T>(): Promise<ThisType<T> & PriceFeedTestnet>;

		interface: PriceFeedTestnetInterface;

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
		): Promise<ThisType<T> & PriceFeedTestnet>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & PriceFeedTestnet>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & PriceFeedTestnet>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & PriceFeedTestnet>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;

		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & PriceFeedTestnet>;



		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'fetchPrice'): TypedContractMethod<[], [bigint], 'nonpayable'>;
		getFunction(nameOrSignature: 'getPrice'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'setPrice'): TypedContractMethod<[price: BigNumberish], [boolean], 'nonpayable'>;

		getEvent(key: 'LastGoodPriceUpdated'): TypedContractEvent<LastGoodPriceUpdatedEvent.InputTuple, LastGoodPriceUpdatedEvent.OutputTuple, LastGoodPriceUpdatedEvent.OutputObject>;

		filters: ActivePoolTypedContractEventFilters;
	};
