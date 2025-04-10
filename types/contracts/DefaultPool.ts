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

type DefaultPoolFunctionNameOrSignature<M extends Modifiers> =
	| 'NAME'
	| 'activePoolAddress'
	| `decrease${Uppercase<M['lusd']>}Debt`
	| `get${Uppercase<M['eth']>}`
	| `get${Uppercase<M['lusd']>}Debt`
	| `increase${Uppercase<M['lusd']>}Debt`
	| 'isOwner'
	| 'owner'
	| `send${Uppercase<M['eth']>}ToActivePool`
	| 'setAddresses'
	| `${M['trove']}ManagerAddress`;

type DefaultPoolEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'ActivePoolAddressChanged'
	| 'DefaultPoolAddressChanged'
	| `DefaultPool${Uppercase<M['eth']>}BalanceUpdated`
	| `DefaultPool${Uppercase<M['lusd']>}DebtUpdated`
	| `${Uppercase<M['eth']>}BalanceUpdated`
	| `${Capitalize<M['ether']>}Sent`
	| `${Uppercase<M['lusd']>}BalanceUpdated`
	| 'OwnershipTransferred'
	| 'StabilityPoolAddressChanged'
	| `${Capitalize<M['trove']>}ManagerAddressChanged`;

export interface DefaultPoolInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: DefaultPoolFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: DefaultPoolEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'activePoolAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: `decrease${Uppercase<M['lusd']>}Debt`, values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: `get${Uppercase<M['eth']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: `get${Uppercase<M['lusd']>}Debt`, values?: undefined): string;
	encodeFunctionData(functionFragment: `increase${Uppercase<M['lusd']>}Debt`, values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: `send${Uppercase<M['eth']>}ToActivePool`, values: [BigNumberish]): string
	encodeFunctionData(functionFragment: 'setAddresses', values: [AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `${M['trove']}ManagerAddress`, values?: undefined): string;

	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'activePoolAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `decrease${Uppercase<M['lusd']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Uppercase<M['eth']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Uppercase<M['lusd']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `increase${Uppercase<M['lusd']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `send${Uppercase<M['eth']>}ToActivePool`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['trove']}ManagerAddress`, data: BytesLike): Result;
}

export namespace DefaultPool_ActivePoolAddressChangedEvent {
	export type InputTuple = [_newActivePoolAddress: AddressLike];
	export type OutputTuple = [_newActivePoolAddress: string];
	export interface OutputObject {
		_newActivePoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultPool_DefaultPoolAddressChangedEvent {
	export type InputTuple = [_newDefaultPoolAddress: AddressLike];
	export type OutputTuple = [_newDefaultPoolAddress: string];
	export interface OutputObject {
		_newDefaultPoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultPool_DefaultPoolETHBalanceUpdatedEvent {
	export type InputTuple = [_ETH: BigNumberish];
	export type OutputTuple = [_ETH: bigint];
	export interface OutputObject {
		_ETH: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultPool_DefaultPoolLUSDDebtUpdatedEvent {
	export type InputTuple = [_LUSDDebt: BigNumberish];
	export type OutputTuple = [_LUSDDebt: bigint];
	export interface OutputObject {
		_LUSDDebt: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultPool_ETHBalanceUpdatedEvent {
	export type InputTuple = [_newBalance: BigNumberish];
	export type OutputTuple = [_newBalance: bigint];
	export interface OutputObject {
		_newBalance: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultPool_EtherSentEvent {
	export type InputTuple = [_to: AddressLike, _amount: BigNumberish];
	export type OutputTuple = [_to: string, _amount: bigint];
	export interface OutputObject {
		_to: string;
		_amount: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultPool_LUSDBalanceUpdatedEvent {
	export type InputTuple = [_newBalance: BigNumberish];
	export type OutputTuple = [_newBalance: bigint];
	export interface OutputObject {
		_newBalance: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultPool_OwnershipTransferredEvent {
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

export namespace DefaultPool_StabilityPoolAddressChangedEvent {
	export type InputTuple = [_newStabilityPoolAddress: AddressLike];
	export type OutputTuple = [_newStabilityPoolAddress: string];
	export interface OutputObject {
		_newStabilityPoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultPool_TroveManagerAddressChangedEvent {
	export type InputTuple = [_newTroveManagerAddress: AddressLike];
	export type OutputTuple = [_newTroveManagerAddress: string];
	export interface OutputObject {
		_newTroveManagerAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

type DefaultPoolTypedContractMethods<M extends Modifiers> = {
	NAME: TypedContractMethod<[], [string], 'view'>;
	activePoolAddress: TypedContractMethod<[], [string], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	setAddresses: TypedContractMethod<[_troveManagerAddress: AddressLike, _activePoolAddress: AddressLike], [void], 'nonpayable'>;
} & {
	[K in `decrease${Uppercase<M['lusd']>}Debt`]: TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `get${Uppercase<M['eth']>}`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `get${Uppercase<M['lusd']>}Debt`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `increase${Uppercase<M['lusd']>}Debt`]: TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `send${Uppercase<M['eth']>}ToActivePool`]: TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `${M['trove']}ManagerAddress`]: TypedContractMethod<[], [string], 'view'>;
};

type DefaultPoolTypedContractEventFilters<M extends Modifiers> = {
	'ActivePoolAddressChanged(address)': TypedContractEvent<
		DefaultPool_ActivePoolAddressChangedEvent.InputTuple,
		DefaultPool_ActivePoolAddressChangedEvent.OutputTuple,
		DefaultPool_ActivePoolAddressChangedEvent.OutputObject
	>;
	'ActivePoolAddressChanged': TypedContractEvent<
		DefaultPool_ActivePoolAddressChangedEvent.InputTuple,
		DefaultPool_ActivePoolAddressChangedEvent.OutputTuple,
		DefaultPool_ActivePoolAddressChangedEvent.OutputObject
	>;

	'DefaultPoolAddressChanged(address)': TypedContractEvent<
		DefaultPool_DefaultPoolAddressChangedEvent.InputTuple,
		DefaultPool_DefaultPoolAddressChangedEvent.OutputTuple,
		DefaultPool_DefaultPoolAddressChangedEvent.OutputObject
	>;
	'DefaultPoolAddressChanged': TypedContractEvent<
		DefaultPool_DefaultPoolAddressChangedEvent.InputTuple,
		DefaultPool_DefaultPoolAddressChangedEvent.OutputTuple,
		DefaultPool_DefaultPoolAddressChangedEvent.OutputObject
	>;

	'OwnershipTransferred(address,address)': TypedContractEvent<
		DefaultPool_OwnershipTransferredEvent.InputTuple,
		DefaultPool_OwnershipTransferredEvent.OutputTuple,
		DefaultPool_OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		DefaultPool_OwnershipTransferredEvent.InputTuple,
		DefaultPool_OwnershipTransferredEvent.OutputTuple,
		DefaultPool_OwnershipTransferredEvent.OutputObject
	>;

	'StabilityPoolAddressChanged(address)': TypedContractEvent<
		DefaultPool_StabilityPoolAddressChangedEvent.InputTuple,
		DefaultPool_StabilityPoolAddressChangedEvent.OutputTuple,
		DefaultPool_StabilityPoolAddressChangedEvent.OutputObject
	>;
	'StabilityPoolAddressChanged': TypedContractEvent<
		DefaultPool_StabilityPoolAddressChangedEvent.InputTuple,
		DefaultPool_StabilityPoolAddressChangedEvent.OutputTuple,
		DefaultPool_StabilityPoolAddressChangedEvent.OutputObject
	>;
} & {
	[K in `DefaultPool${Uppercase<M['eth']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		DefaultPool_DefaultPoolETHBalanceUpdatedEvent.InputTuple,
		DefaultPool_DefaultPoolETHBalanceUpdatedEvent.OutputTuple,
		DefaultPool_DefaultPoolETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `DefaultPool${Uppercase<M['eth']>}BalanceUpdated`]: TypedContractEvent<
		DefaultPool_DefaultPoolETHBalanceUpdatedEvent.InputTuple,
		DefaultPool_DefaultPoolETHBalanceUpdatedEvent.OutputTuple,
		DefaultPool_DefaultPoolETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `DefaultPool${Uppercase<M['lusd']>}DebtUpdated(uint256)`]: TypedContractEvent<
		DefaultPool_DefaultPoolLUSDDebtUpdatedEvent.InputTuple,
		DefaultPool_DefaultPoolLUSDDebtUpdatedEvent.OutputTuple,
		DefaultPool_DefaultPoolLUSDDebtUpdatedEvent.OutputObject
	>;
} & {
	[K in `DefaultPool${Uppercase<M['lusd']>}DebtUpdated`]: TypedContractEvent<
		DefaultPool_DefaultPoolLUSDDebtUpdatedEvent.InputTuple,
		DefaultPool_DefaultPoolLUSDDebtUpdatedEvent.OutputTuple,
		DefaultPool_DefaultPoolLUSDDebtUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['eth']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		DefaultPool_ETHBalanceUpdatedEvent.InputTuple,
		DefaultPool_ETHBalanceUpdatedEvent.OutputTuple,
		DefaultPool_ETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['eth']>}BalanceUpdated`]: TypedContractEvent<
		DefaultPool_ETHBalanceUpdatedEvent.InputTuple,
		DefaultPool_ETHBalanceUpdatedEvent.OutputTuple,
		DefaultPool_ETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['ether']>}Sent(address,uint256)`]: TypedContractEvent<
		DefaultPool_EtherSentEvent.InputTuple,
		DefaultPool_EtherSentEvent.OutputTuple,
		DefaultPool_EtherSentEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['ether']>}Sent`]: TypedContractEvent<
		DefaultPool_EtherSentEvent.InputTuple,
		DefaultPool_EtherSentEvent.OutputTuple,
		DefaultPool_EtherSentEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		DefaultPool_LUSDBalanceUpdatedEvent.InputTuple,
		DefaultPool_LUSDBalanceUpdatedEvent.OutputTuple,
		DefaultPool_LUSDBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}BalanceUpdated`]: TypedContractEvent<
		DefaultPool_LUSDBalanceUpdatedEvent.InputTuple,
		DefaultPool_LUSDBalanceUpdatedEvent.OutputTuple,
		DefaultPool_LUSDBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressChanged(address)`]: TypedContractEvent<
		DefaultPool_TroveManagerAddressChangedEvent.InputTuple,
		DefaultPool_TroveManagerAddressChangedEvent.OutputTuple,
		DefaultPool_TroveManagerAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressChanged(address)`]: TypedContractEvent<
		DefaultPool_TroveManagerAddressChangedEvent.InputTuple,
		DefaultPool_TroveManagerAddressChangedEvent.OutputTuple,
		DefaultPool_TroveManagerAddressChangedEvent.OutputObject
	>;
};

export type DefaultPool<M extends Modifiers> = BaseContract &
	DefaultPoolTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): DefaultPool<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & DefaultPool<M>>;

		interface: DefaultPoolInterface<M>;

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
		): Promise<ThisType<T> & DefaultPool<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & DefaultPool<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & DefaultPool<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & DefaultPool<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;
		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & DefaultPool<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'activePoolAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `decrease${Uppercase<M['lusd']>}Debt`): TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `get${Uppercase<M['eth']>}`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `get${Uppercase<M['lusd']>}Debt`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `increase${Uppercase<M['lusd']>}Debt`): TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `send${Uppercase<M['eth']>}ToActivePool`): TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_troveManagerAddress: AddressLike, _activePoolAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `${M['trove']}ManagerAddress`): TypedContractMethod<[], [string], 'view'>;

		getEvent(key: 'ActivePoolAddressChanged'): TypedContractEvent<DefaultPool_ActivePoolAddressChangedEvent.InputTuple, DefaultPool_ActivePoolAddressChangedEvent.OutputTuple, DefaultPool_ActivePoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'DefaultPoolAddressChanged'): TypedContractEvent<DefaultPool_DefaultPoolAddressChangedEvent.InputTuple, DefaultPool_DefaultPoolAddressChangedEvent.OutputTuple, DefaultPool_DefaultPoolAddressChangedEvent.OutputObject>;
		getEvent(key: `DefaultPool${Uppercase<M['eth']>}BalanceUpdated`): TypedContractEvent<DefaultPool_DefaultPoolETHBalanceUpdatedEvent.InputTuple, DefaultPool_DefaultPoolETHBalanceUpdatedEvent.OutputTuple, DefaultPool_DefaultPoolETHBalanceUpdatedEvent.OutputObject>;
		getEvent(key: `DefaultPool${Uppercase<M['lusd']>}DebtUpdated`): TypedContractEvent<DefaultPool_DefaultPoolLUSDDebtUpdatedEvent.InputTuple, DefaultPool_DefaultPoolLUSDDebtUpdatedEvent.OutputTuple, DefaultPool_DefaultPoolLUSDDebtUpdatedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['eth']>}BalanceUpdated`): TypedContractEvent<DefaultPool_ETHBalanceUpdatedEvent.InputTuple, DefaultPool_ETHBalanceUpdatedEvent.OutputTuple, DefaultPool_ETHBalanceUpdatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['ether']>}Sent`): TypedContractEvent<DefaultPool_EtherSentEvent.InputTuple, DefaultPool_EtherSentEvent.OutputTuple, DefaultPool_EtherSentEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lusd']>}BalanceUpdated`): TypedContractEvent<DefaultPool_LUSDBalanceUpdatedEvent.InputTuple, DefaultPool_LUSDBalanceUpdatedEvent.OutputTuple, DefaultPool_LUSDBalanceUpdatedEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<DefaultPool_OwnershipTransferredEvent.InputTuple, DefaultPool_OwnershipTransferredEvent.OutputTuple, DefaultPool_OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'StabilityPoolAddressChanged'): TypedContractEvent<DefaultPool_StabilityPoolAddressChangedEvent.InputTuple, DefaultPool_StabilityPoolAddressChangedEvent.OutputTuple, DefaultPool_StabilityPoolAddressChangedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}ManagerAddressChanged`): TypedContractEvent<DefaultPool_TroveManagerAddressChangedEvent.InputTuple, DefaultPool_TroveManagerAddressChangedEvent.OutputTuple, DefaultPool_TroveManagerAddressChangedEvent.OutputObject>;

		filters: DefaultPoolTypedContractEventFilters<M>;
	};
