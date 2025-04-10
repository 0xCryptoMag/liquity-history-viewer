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

type ActivePoolFunctionNameOrSignature<M extends Modifiers> =
	| 'NAME'
	| 'borrowerOperationsAddress'
	| `decrease${Uppercase<M['lusd']>}Debt`
	| 'defaultPoolAddress'
	| `get${Uppercase<M['eth']>}`
	| `get${Uppercase<M['lusd']>}Debt`
	| `increase${Uppercase<M['lusd']>}Debt`
	| 'isOwner'
	| 'owner'
	| `send${Uppercase<M['eth']>}`
	| 'setAddresses'
	| 'stabilityPoolAddress'
	| `${M['trove']}ManagerAddress`;

type ActivePoolEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'ActivePoolAddressChanged'
	| `ActivePool${Uppercase<M['eth']>}BalanceUpdated`
	| `ActivePool${Uppercase<M['lusd']>}DebtUpdated`
	| 'BorrowerOperationsAddressChanged'
	| 'DefaultPoolAddressChanged'
	| `${Uppercase<M['eth']>}BalanceUpdated`
	| `${Capitalize<M['ether']>}Sent`
	| `${Uppercase<M['lusd']>}BalanceUpdated`
	| 'OwnershipTransferred'
	| 'StabilityPoolAddressChanged'
	| `${Capitalize<M['trove']>}ManagerAddressChanged`;


export interface ActivePoolInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: ActivePoolFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: ActivePoolEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'borrowerOperationsAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: `decrease${Uppercase<M['lusd']>}Debt`, values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'defaultPoolAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: `get${Uppercase<M['eth']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: `get${Uppercase<M['lusd']>}Debt`, values?: undefined): string;
	encodeFunctionData(functionFragment: `increase${Uppercase<M['lusd']>}Debt`, values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: `send${Uppercase<M['eth']>}`, values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'setAddresses', values: [AddressLike, AddressLike, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'stabilityPoolAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['trove']}ManagerAddress`, values?: undefined): string;

	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'borrowerOperationsAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `decrease${Uppercase<M['lusd']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'defaultPoolAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Uppercase<M['eth']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Uppercase<M['lusd']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `increase${Uppercase<M['lusd']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `send${Uppercase<M['eth']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'stabilityPoolAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['trove']}ManagerAddress`, data: BytesLike): Result;
}

export namespace ActivePool_ActivePoolAddressChangedEvent {
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

export namespace ActivePool_ActivePoolETHBalanceUpdatedEvent {
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

export namespace ActivePool_ActivePoolLUSDDebtUpdatedEvent {
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

export namespace ActivePool_BorrowerOperationsAddressChangedEvent {
	export type InputTuple = [_newBorrowerOperationsAddress: AddressLike];
	export type OutputTuple = [_newBorrowerOperationsAddress: string];
	export interface OutputObject {
		_newBorrowerOperationsAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace ActivePool_DefaultPoolAddressChangedEvent {
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

export namespace ActivePool_ETHBalanceUpdatedEvent {
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

export namespace ActivePool_EtherSentEvent {
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

export namespace ActivePool_LUSDBalanceUpdatedEvent {
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

export namespace ActivePool_OwnershipTransferredEvent {
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

export namespace ActivePool_StabilityPoolAddressChangedEvent {
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

export namespace ActivePool_TroveManagerAddressChangedEvent {
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

type ActivePoolTypedContractMethods<M extends Modifiers> = {
	NAME: TypedContractMethod<[], [string], 'view'>;
	borrowerOperationsAddress: TypedContractMethod<[], [string], 'view'>;
	defaultPoolAddress: TypedContractMethod<[], [bigint], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	setAddresses: TypedContractMethod<[_borrowerOperationsAddress: AddressLike, _troveManagerAddress: AddressLike, _stabilityPoolAddress: AddressLike, _defaultPoolAddress: AddressLike], [void], 'nonpayable'>;
	stabilityPoolAddress: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `decrease${Uppercase<M['lusd']>}Debt`]: TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `get${Uppercase<M['eth']>}`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `get${Uppercase<M['lusd']>}Debt`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `increase${Uppercase<M['lusd']>}Debt`]: TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `send${Uppercase<M['eth']>}`]: TypedContractMethod<[_account: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `${M['trove']}ManagerAddress`]: TypedContractMethod<[], [string], 'view'>;
};

type ActivePoolTypedContractEventFilters<M extends Modifiers> = {
	'ActivePoolAddressChanged(address)': TypedContractEvent<
		ActivePool_ActivePoolAddressChangedEvent.InputTuple,
		ActivePool_ActivePoolAddressChangedEvent.OutputTuple,
		ActivePool_ActivePoolAddressChangedEvent.OutputObject
	>;
	'ActivePoolAddressChanged': TypedContractEvent<
		ActivePool_ActivePoolAddressChangedEvent.InputTuple,
		ActivePool_ActivePoolAddressChangedEvent.OutputTuple,
		ActivePool_ActivePoolAddressChangedEvent.OutputObject
	>;

	'BorrowerOperationsAddressChanged(address)': TypedContractEvent<
		ActivePool_BorrowerOperationsAddressChangedEvent.InputTuple,
		ActivePool_BorrowerOperationsAddressChangedEvent.OutputTuple,
		ActivePool_BorrowerOperationsAddressChangedEvent.OutputObject
	>;
	'BorrowerOperationsAddressChanged': TypedContractEvent<
		ActivePool_BorrowerOperationsAddressChangedEvent.InputTuple,
		ActivePool_BorrowerOperationsAddressChangedEvent.OutputTuple,
		ActivePool_BorrowerOperationsAddressChangedEvent.OutputObject
	>;

	'DefaultPoolAddressChanged(address)': TypedContractEvent<
		ActivePool_DefaultPoolAddressChangedEvent.InputTuple,
		ActivePool_DefaultPoolAddressChangedEvent.OutputTuple,
		ActivePool_DefaultPoolAddressChangedEvent.OutputObject
	>;
	'DefaultPoolAddressChanged': TypedContractEvent<
		ActivePool_DefaultPoolAddressChangedEvent.InputTuple,
		ActivePool_DefaultPoolAddressChangedEvent.OutputTuple,
		ActivePool_DefaultPoolAddressChangedEvent.OutputObject
	>;

	'OwnershipTransferred(address,address)': TypedContractEvent<
		ActivePool_OwnershipTransferredEvent.InputTuple,
		ActivePool_OwnershipTransferredEvent.OutputTuple,
		ActivePool_OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		ActivePool_OwnershipTransferredEvent.InputTuple,
		ActivePool_OwnershipTransferredEvent.OutputTuple,
		ActivePool_OwnershipTransferredEvent.OutputObject
	>;

	'StabilityPoolAddressChanged(address)': TypedContractEvent<
		ActivePool_StabilityPoolAddressChangedEvent.InputTuple,
		ActivePool_StabilityPoolAddressChangedEvent.OutputTuple,
		ActivePool_StabilityPoolAddressChangedEvent.OutputObject
	>;
	'StabilityPoolAddressChanged': TypedContractEvent<
		ActivePool_StabilityPoolAddressChangedEvent.InputTuple,
		ActivePool_StabilityPoolAddressChangedEvent.OutputTuple,
		ActivePool_StabilityPoolAddressChangedEvent.OutputObject
	>;
} & {
	[K in `ActivePool${Uppercase<M['eth']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		ActivePool_ActivePoolETHBalanceUpdatedEvent.InputTuple,
		ActivePool_ActivePoolETHBalanceUpdatedEvent.OutputTuple,
		ActivePool_ActivePoolETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `ActivePool${Uppercase<M['eth']>}BalanceUpdated`]: TypedContractEvent<
		ActivePool_ActivePoolETHBalanceUpdatedEvent.InputTuple,
		ActivePool_ActivePoolETHBalanceUpdatedEvent.OutputTuple,
		ActivePool_ActivePoolETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `ActivePool${Uppercase<M['lusd']>}DebtUpdated(uint256)`]: TypedContractEvent<
		ActivePool_ActivePoolLUSDDebtUpdatedEvent.InputTuple,
		ActivePool_ActivePoolLUSDDebtUpdatedEvent.OutputTuple,
		ActivePool_ActivePoolLUSDDebtUpdatedEvent.OutputObject
	>;
} & {
	[K in `ActivePool${Uppercase<M['lusd']>}DebtUpdated`]: TypedContractEvent<
		ActivePool_ActivePoolLUSDDebtUpdatedEvent.InputTuple,
		ActivePool_ActivePoolLUSDDebtUpdatedEvent.OutputTuple,
		ActivePool_ActivePoolLUSDDebtUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['eth']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		ActivePool_ETHBalanceUpdatedEvent.InputTuple,
		ActivePool_ETHBalanceUpdatedEvent.OutputTuple,
		ActivePool_ETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['eth']>}BalanceUpdated`]: TypedContractEvent<
		ActivePool_ETHBalanceUpdatedEvent.InputTuple,
		ActivePool_ETHBalanceUpdatedEvent.OutputTuple,
		ActivePool_ETHBalanceUpdatedEvent.OutputObject
	>;
} &{
	[K in `${Capitalize<M['ether']>}Sent(address,uint256)`]: TypedContractEvent<
		ActivePool_EtherSentEvent.InputTuple,
		ActivePool_EtherSentEvent.OutputTuple,
		ActivePool_EtherSentEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['ether']>}Sent`]: TypedContractEvent<
		ActivePool_EtherSentEvent.InputTuple,
		ActivePool_EtherSentEvent.OutputTuple,
		ActivePool_EtherSentEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		ActivePool_LUSDBalanceUpdatedEvent.InputTuple,
		ActivePool_LUSDBalanceUpdatedEvent.OutputTuple,
		ActivePool_LUSDBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}BalanceUpdated`]: TypedContractEvent<
		ActivePool_LUSDBalanceUpdatedEvent.InputTuple,
		ActivePool_LUSDBalanceUpdatedEvent.OutputTuple,
		ActivePool_LUSDBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${M['trove']}ManagerAddressChanged(address)`]: TypedContractEvent<
		ActivePool_TroveManagerAddressChangedEvent.InputTuple,
		ActivePool_TroveManagerAddressChangedEvent.OutputTuple,
		ActivePool_TroveManagerAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${M['trove']}ManagerAddressChanged`]: TypedContractEvent<
		ActivePool_TroveManagerAddressChangedEvent.InputTuple,
		ActivePool_TroveManagerAddressChangedEvent.OutputTuple,
		ActivePool_TroveManagerAddressChangedEvent.OutputObject
	>;
};

export type ActivePool<M extends Modifiers> = BaseContract &
	ActivePoolTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): ActivePool<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & ActivePool<M>>;

		interface: ActivePoolInterface<M>;

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
		): Promise<ThisType<T> & ActivePool<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & ActivePool<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & ActivePool<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & ActivePool<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;
		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & ActivePool<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'borrowerOperationsAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `decrease${Uppercase<M['lusd']>}Debt`): TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'defaultPoolAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `get${Uppercase<M['eth']>}`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `get${Uppercase<M['lusd']>}Debt`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `increase${Uppercase<M['lusd']>}Debt`): TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `send${Uppercase<M['eth']>}`): TypedContractMethod<[_account: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_borrowerOperationsAddress: AddressLike, _troveManagerAddress: AddressLike, _stabilityPoolAddress: AddressLike, _defaultPoolAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'stabilityPoolAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['trove']}ManagerAddress`): TypedContractMethod<[], [string], 'view'>;

		getEvent(key: 'ActivePoolAddressChanged'): TypedContractEvent<ActivePool_ActivePoolAddressChangedEvent.InputTuple, ActivePool_ActivePoolAddressChangedEvent.OutputTuple, ActivePool_ActivePoolAddressChangedEvent.OutputObject>;
		getEvent(key: `ActivePool${Uppercase<M['eth']>}BalanceUpdated`): TypedContractEvent<ActivePool_ActivePoolETHBalanceUpdatedEvent.InputTuple, ActivePool_ActivePoolETHBalanceUpdatedEvent.OutputTuple, ActivePool_ActivePoolETHBalanceUpdatedEvent.OutputObject>;
		getEvent(key: `ActivePool${Uppercase<M['lusd']>}DebtUpdated`): TypedContractEvent<ActivePool_ActivePoolLUSDDebtUpdatedEvent.InputTuple, ActivePool_ActivePoolLUSDDebtUpdatedEvent.OutputTuple, ActivePool_ActivePoolLUSDDebtUpdatedEvent.OutputObject>;
		getEvent(key: 'BorrowerOperationsAddressChanged'): TypedContractEvent<ActivePool_BorrowerOperationsAddressChangedEvent.InputTuple, ActivePool_BorrowerOperationsAddressChangedEvent.OutputTuple, ActivePool_BorrowerOperationsAddressChangedEvent.OutputObject>;
		getEvent(key: 'DefaultPoolAddressChanged'): TypedContractEvent<ActivePool_DefaultPoolAddressChangedEvent.InputTuple, ActivePool_DefaultPoolAddressChangedEvent.OutputTuple, ActivePool_DefaultPoolAddressChangedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['eth']>}BalanceUpdated`): TypedContractEvent<ActivePool_ETHBalanceUpdatedEvent.InputTuple, ActivePool_ETHBalanceUpdatedEvent.OutputTuple, ActivePool_ETHBalanceUpdatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['ether']>}Sent`): TypedContractEvent<ActivePool_EtherSentEvent.InputTuple, ActivePool_EtherSentEvent.OutputTuple, ActivePool_EtherSentEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['lusd']>}BalanceUpdated`): TypedContractEvent<ActivePool_LUSDBalanceUpdatedEvent.InputTuple, ActivePool_LUSDBalanceUpdatedEvent.OutputTuple, ActivePool_LUSDBalanceUpdatedEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<ActivePool_OwnershipTransferredEvent.InputTuple, ActivePool_OwnershipTransferredEvent.OutputTuple, ActivePool_OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'StabilityPoolAddressChanged'): TypedContractEvent<ActivePool_StabilityPoolAddressChangedEvent.InputTuple, ActivePool_StabilityPoolAddressChangedEvent.OutputTuple, ActivePool_StabilityPoolAddressChangedEvent.OutputObject>;
		getEvent(key: `${M['trove']}ManagerAddressChanged`): TypedContractEvent<ActivePool_TroveManagerAddressChangedEvent.InputTuple, ActivePool_TroveManagerAddressChangedEvent.OutputTuple, ActivePool_TroveManagerAddressChangedEvent.OutputObject>;

		filters: ActivePoolTypedContractEventFilters<M>;
	};
