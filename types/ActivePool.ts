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

export namespace ActivePoolAddressChangedEvent {
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

export namespace ActivePoolETHBalanceUpdatedEvent {
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

export namespace ActivePoolLUSDDebtUpdatedEvent {
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

export namespace BorrowerOperationsAddressChangedEvent {
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

export namespace DefaultPoolAddressChangedEvent {
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

export namespace ETHBalanceUpdatedEvent {
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

export namespace EtherSentEvent {
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

export namespace LUSDBalanceUpdatedEvent {
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

export namespace StabilityPoolAddressChangedEvent {
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

export namespace TroveManagerAddressChangedEvent {
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
		ActivePoolAddressChangedEvent.InputTuple,
		ActivePoolAddressChangedEvent.OutputTuple,
		ActivePoolAddressChangedEvent.OutputObject
	>;
	'ActivePoolAddressChanged': TypedContractEvent<
		ActivePoolAddressChangedEvent.InputTuple,
		ActivePoolAddressChangedEvent.OutputTuple,
		ActivePoolAddressChangedEvent.OutputObject
	>;

	'BorrowerOperationsAddressChanged(address)': TypedContractEvent<
		BorrowerOperationsAddressChangedEvent.InputTuple,
		BorrowerOperationsAddressChangedEvent.OutputTuple,
		BorrowerOperationsAddressChangedEvent.OutputObject
	>;
	'BorrowerOperationsAddressChanged': TypedContractEvent<
		BorrowerOperationsAddressChangedEvent.InputTuple,
		BorrowerOperationsAddressChangedEvent.OutputTuple,
		BorrowerOperationsAddressChangedEvent.OutputObject
	>;

	'DefaultPoolAddressChanged(address)': TypedContractEvent<
		DefaultPoolAddressChangedEvent.InputTuple,
		DefaultPoolAddressChangedEvent.OutputTuple,
		DefaultPoolAddressChangedEvent.OutputObject
	>;
	'DefaultPoolAddressChanged': TypedContractEvent<
		DefaultPoolAddressChangedEvent.InputTuple,
		DefaultPoolAddressChangedEvent.OutputTuple,
		DefaultPoolAddressChangedEvent.OutputObject
	>;

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

	'StabilityPoolAddressChanged(address)': TypedContractEvent<
		StabilityPoolAddressChangedEvent.InputTuple,
		StabilityPoolAddressChangedEvent.OutputTuple,
		StabilityPoolAddressChangedEvent.OutputObject
	>;
	'StabilityPoolAddressChanged': TypedContractEvent<
		StabilityPoolAddressChangedEvent.InputTuple,
		StabilityPoolAddressChangedEvent.OutputTuple,
		StabilityPoolAddressChangedEvent.OutputObject
	>;
} & {
	[K in `ActivePool${Uppercase<M['eth']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		ActivePoolETHBalanceUpdatedEvent.InputTuple,
		ActivePoolETHBalanceUpdatedEvent.OutputTuple,
		ActivePoolETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `ActivePool${Uppercase<M['eth']>}BalanceUpdated`]: TypedContractEvent<
		ActivePoolETHBalanceUpdatedEvent.InputTuple,
		ActivePoolETHBalanceUpdatedEvent.OutputTuple,
		ActivePoolETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `ActivePool${Uppercase<M['lusd']>}DebtUpdated(uint256)`]: TypedContractEvent<
		ActivePoolLUSDDebtUpdatedEvent.InputTuple,
		ActivePoolLUSDDebtUpdatedEvent.OutputTuple,
		ActivePoolLUSDDebtUpdatedEvent.OutputObject
	>;
} & {
	[K in `ActivePool${Uppercase<M['lusd']>}DebtUpdated`]: TypedContractEvent<
		ActivePoolLUSDDebtUpdatedEvent.InputTuple,
		ActivePoolLUSDDebtUpdatedEvent.OutputTuple,
		ActivePoolLUSDDebtUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['eth']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		ActivePoolETHBalanceUpdatedEvent.InputTuple,
		ActivePoolETHBalanceUpdatedEvent.OutputTuple,
		ActivePoolETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['eth']>}BalanceUpdated`]: TypedContractEvent<
		ActivePoolETHBalanceUpdatedEvent.InputTuple,
		ActivePoolETHBalanceUpdatedEvent.OutputTuple,
		ActivePoolETHBalanceUpdatedEvent.OutputObject
	>;
} &{
	[K in `${Capitalize<M['ether']>}Sent(address,uint256)`]: TypedContractEvent<
		EtherSentEvent.InputTuple,
		EtherSentEvent.OutputTuple,
		EtherSentEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['ether']>}Sent`]: TypedContractEvent<
		EtherSentEvent.InputTuple,
		EtherSentEvent.OutputTuple,
		EtherSentEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		LUSDBalanceUpdatedEvent.InputTuple,
		LUSDBalanceUpdatedEvent.OutputTuple,
		LUSDBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}BalanceUpdated`]: TypedContractEvent<
		LUSDBalanceUpdatedEvent.InputTuple,
		LUSDBalanceUpdatedEvent.OutputTuple,
		LUSDBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${M['trove']}ManagerAddressChanged(address)`]: TypedContractEvent<
		TroveManagerAddressChangedEvent.InputTuple,
		TroveManagerAddressChangedEvent.OutputTuple,
		TroveManagerAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${M['trove']}ManagerAddressChanged`]: TypedContractEvent<
		TroveManagerAddressChangedEvent.InputTuple,
		TroveManagerAddressChangedEvent.OutputTuple,
		TroveManagerAddressChangedEvent.OutputObject
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

		getEvent(key: 'ActivePoolAddressChanged'): TypedContractEvent<ActivePoolAddressChangedEvent.InputTuple, ActivePoolAddressChangedEvent.OutputTuple, ActivePoolAddressChangedEvent.OutputObject>;
		getEvent(key: `ActivePool${Uppercase<M['eth']>}BalanceUpdated`): TypedContractEvent<ActivePoolETHBalanceUpdatedEvent.InputTuple, ActivePoolETHBalanceUpdatedEvent.OutputTuple, ActivePoolETHBalanceUpdatedEvent.OutputObject>;
		getEvent(key: `ActivePool${Uppercase<M['lusd']>}DebtUpdated`): TypedContractEvent<ActivePoolLUSDDebtUpdatedEvent.InputTuple, ActivePoolLUSDDebtUpdatedEvent.OutputTuple, ActivePoolLUSDDebtUpdatedEvent.OutputObject>;
		getEvent(key: 'BorrowerOperationsAddressChanged'): TypedContractEvent<BorrowerOperationsAddressChangedEvent.InputTuple, BorrowerOperationsAddressChangedEvent.OutputTuple, BorrowerOperationsAddressChangedEvent.OutputObject>;
		getEvent(key: 'DefaultPoolAddressChanged'): TypedContractEvent<DefaultPoolAddressChangedEvent.InputTuple, DefaultPoolAddressChangedEvent.OutputTuple, DefaultPoolAddressChangedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['eth']>}BalanceUpdated`): TypedContractEvent<ETHBalanceUpdatedEvent.InputTuple, ETHBalanceUpdatedEvent.OutputTuple, ETHBalanceUpdatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['ether']>}Sent`): TypedContractEvent<EtherSentEvent.InputTuple, EtherSentEvent.OutputTuple, EtherSentEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['lusd']>}BalanceUpdated`): TypedContractEvent<LUSDBalanceUpdatedEvent.InputTuple, LUSDBalanceUpdatedEvent.OutputTuple, LUSDBalanceUpdatedEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'StabilityPoolAddressChanged'): TypedContractEvent<StabilityPoolAddressChangedEvent.InputTuple, StabilityPoolAddressChangedEvent.OutputTuple, StabilityPoolAddressChangedEvent.OutputObject>;
		getEvent(key: `${M['trove']}ManagerAddressChanged`): TypedContractEvent<TroveManagerAddressChangedEvent.InputTuple, TroveManagerAddressChangedEvent.OutputTuple, TroveManagerAddressChangedEvent.OutputObject>;

		filters: ActivePoolTypedContractEventFilters<M>;
	};
