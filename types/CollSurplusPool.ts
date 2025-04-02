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

type CollSurplusPoolFunctionNameOrSignature<M extends Modifiers> =
	| 'NAME'
	| 'accountSurplus'
	| 'activePoolAddress'
	| 'borrowerOperationsAddress'
	| 'claimColl'
	| 'getCollateral'
	| `get${Uppercase<M['eth']>}`
	| 'isOwner'
	| 'owner'
	| 'setAddresses'
	| `${M['trove']}ManagerAddress`

type CollSurplusPoolEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'ActivePoolAddressChanged'
	| 'BorrowerOperationsAddressChanged'
	| 'CollBalanceUpdated'
	| `${Capitalize<M['ether']>}Sent`
	| 'OwnershipTransferred'
	| `${Capitalize<M['trove']>}ManagerAddressChanged`

export interface CollSurplusPoolInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: CollSurplusPoolFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: CollSurplusPoolEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'accountSurplus', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'activePoolAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'borrowerOperationsAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'claimColl', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'getCollateral', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `get${Uppercase<M['eth']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'setAddresses', values: [AddressLike, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `${M['trove']}ManagerAddress`, values?: undefined): string;

	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'accountSurplus', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'activePoolAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'borrowerOperationsAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'claimColl', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getCollateral', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Uppercase<M['eth']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
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

export namespace CollBalanceUpdatedEvent {
	export type InputTuple = [_account: AddressLike, _newBalance: BigNumberish];
	export type OutputTuple = [_account: string, _newBalance: bigint];
	export interface OutputObject {
		_account: string;
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

type CollSurplusPoolTypedContractMethods<M extends Modifiers> = {
	NAME: TypedContractMethod<[], [string], 'view'>;
	accountSurplus: TypedContractMethod<[_account: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
	activePoolAddress: TypedContractMethod<[], [string], 'view'>;
	borrowerOperationsAddress: TypedContractMethod<[], [string], 'view'>;
	claimColl: TypedContractMethod<[_account: AddressLike], [void], 'nonpayable'>;
	getCollateral: TypedContractMethod<[_account: AddressLike], [bigint], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	setAddresses: TypedContractMethod<[_borrowerOperationsAddress: AddressLike, _troveManagerAddress: AddressLike, _activePoolAddress: AddressLike], [void], 'nonpayable'>;
} & {
	[K in `get${Uppercase<M['eth']>}`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `${M['trove']}ManagerAddress`]: TypedContractMethod<[], [string], 'view'>;
};

type CollSurplusPoolTypedContractEventFilters<M extends Modifiers> = {
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

	'CollBalanceUpdated(address,uint256)': TypedContractEvent<
		CollBalanceUpdatedEvent.InputTuple,
		CollBalanceUpdatedEvent.OutputTuple,
		CollBalanceUpdatedEvent.OutputObject
	>;
	'CollBalanceUpdated': TypedContractEvent<
		CollBalanceUpdatedEvent.InputTuple,
		CollBalanceUpdatedEvent.OutputTuple,
		CollBalanceUpdatedEvent.OutputObject
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
} & {
	[K in `${Uppercase<M['ether']>}Sent(address,uint256)`]: TypedContractEvent<
		EtherSentEvent.InputTuple,
		EtherSentEvent.OutputTuple,
		EtherSentEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['ether']>}Sent`]: TypedContractEvent<
		EtherSentEvent.InputTuple,
		EtherSentEvent.OutputTuple,
		EtherSentEvent.OutputObject
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

export type CollSurplusPool<M extends Modifiers> = BaseContract &
	CollSurplusPoolTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): CollSurplusPool<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & CollSurplusPool<M>>;

		interface: CollSurplusPoolInterface<M>;

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
		): Promise<ThisType<T> & CollSurplusPool<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & CollSurplusPool<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & CollSurplusPool<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & CollSurplusPool<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;

		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & CollSurplusPool<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'accountSurplus'): TypedContractMethod<[_account: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'activePoolAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'borrowerOperationsAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'claimColl'): TypedContractMethod<[_account: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'getCollateral'): TypedContractMethod<[_account: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `get${Uppercase<M['eth']>}`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_borrowerOperationsAddress: AddressLike, _troveManagerAddress: AddressLike, _activePoolAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `${M['trove']}ManagerAddress`): TypedContractMethod<[], [string], 'view'>;

		getEvent(key: 'ActivePoolAddressChanged'): TypedContractEvent<ActivePoolAddressChangedEvent.InputTuple, ActivePoolAddressChangedEvent.OutputTuple, ActivePoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'BorrowerOperationsAddressChanged'): TypedContractEvent<BorrowerOperationsAddressChangedEvent.InputTuple, BorrowerOperationsAddressChangedEvent.OutputTuple, BorrowerOperationsAddressChangedEvent.OutputObject>;
		getEvent(key: 'CollBalanceUpdated'): TypedContractEvent<CollBalanceUpdatedEvent.InputTuple, CollBalanceUpdatedEvent.OutputTuple, CollBalanceUpdatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['ether']>}Sent`): TypedContractEvent<EtherSentEvent.InputTuple, EtherSentEvent.OutputTuple, EtherSentEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}ManagerAddressChanged`): TypedContractEvent<TroveManagerAddressChangedEvent.InputTuple, TroveManagerAddressChangedEvent.OutputTuple, TroveManagerAddressChangedEvent.OutputObject>;

		filters: CollSurplusPoolTypedContractEventFilters<M>;
	};
