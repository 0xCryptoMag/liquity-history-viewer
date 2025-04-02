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

type SortedTrovesFunctionNameOrSignature<M extends Modifiers> =
	| 'NAME'
	| 'borrowerOperationsAddress'
	| 'contains'
	| 'data'
	| 'findInsertPosition'
	| 'getFirst'
	| 'getLast'
	| 'getMaxSize'
	| 'getNext'
	| 'getPrev'
	| 'getSize'
	| 'insert'
	| 'isEmpty'
	| 'isFull'
	| 'isOwner'
	| 'owner'
	| 'reInsert'
	| 'remove'
	| 'setParams'
	| `${M['trove']}Manager`
	| 'validInsertPosition'

type SortedTrovesEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'BorrowerOperationsAddressChanged'
	| 'NodeAdded'
	| 'NodeRemoved'
	| 'OwnershipTransferred'
	| `Sorted${Capitalize<M['trove']>}sAddressChanged`
	| `${Capitalize<M['trove']>}ManagerAddressChanged`

export interface SortedTrovesInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: SortedTrovesFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: SortedTrovesEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'borrowerOperationsAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'contains', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'data', values?: undefined): string;
	encodeFunctionData(functionFragment: 'findInsertPosition', values: [BigNumberish, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'getFirst', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getLast', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getMaxSize', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getNext', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'getPrev', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'getSize', values?: undefined): string;
	encodeFunctionData(functionFragment: 'insert', values: [AddressLike, BigNumberish, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'isEmpty', values?: undefined): string;
	encodeFunctionData(functionFragment: 'isFull', values?: undefined): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'reInsert', values: [AddressLike, BigNumberish, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'remove', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'setParams', values: [BigNumberish, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `${M['trove']}Manager`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'validInsertPosition', values: [BigNumberish, AddressLike, AddressLike]): string;

	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'borrowerOperationsAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'contains', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'data', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'findInsertPosition', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getFirst', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getLast', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getMaxSize', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getNext', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getPrev', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getSize', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'insert', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isEmpty', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isFull', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'reInsert', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'remove', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setParams', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['trove']}Manager`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'validInsertPosition', data: BytesLike): Result;
}

export namespace BorrowerOperationsAddressChangedEvent {
	export type InputTuple = [_borrowerOperationsAddress: AddressLike];
	export type OutputTuple = [_borrowerOperationsAddress: string];
	export interface OutputObject {
		_borrowerOperationsAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace NodeAddedEvent {
	export type InputTuple = [_id: AddressLike, _NICR: BigNumberish];
	export type OutputTuple = [_id: string, _NICR: bigint];
	export interface OutputObject {
		_id: string;
		_NICR: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace NodeRemovedEvent {
	export type InputTuple = [_id: AddressLike];
	export type OutputTuple = [_id: string];
	export interface OutputObject {
		_id: string;
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

export namespace SortedTrovesAddressChangedEvent {
	export type InputTuple = [_sortedDoublyLLAddress: AddressLike];
	export type OutputTuple = [_sortedDoublyLLAddress: string];
	export interface OutputObject {
		_sortedDoublyLLAddress: string;
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

type SortedTrovesTypedContractMethods<M extends Modifiers> = {
	NAME: TypedContractMethod<[], [string], 'view'>;
	borrowerOperationsAddress: TypedContractMethod<[], [string], 'view'>;
	contains: TypedContractMethod<[_id: AddressLike], [boolean], 'view'>;
	data: TypedContractMethod<[], [[string, string, bigint, bigint] & {head: string; tail: string; maxSize: bigint; size: bigint;}], 'view'>;
	findInsertPosition: TypedContractMethod<[_NICR: BigNumberish, _prevId: AddressLike, _nextId: AddressLike], [[string, string]], 'view'>;
	getFirst: TypedContractMethod<[], [string], 'view'>;
	getLast: TypedContractMethod<[], [string], 'view'>;
	getMaxSize: TypedContractMethod<[], [bigint], 'view'>;
	getNext: TypedContractMethod<[_id: AddressLike], [string], 'view'>;
	getPrev: TypedContractMethod<[_id: AddressLike], [string], 'view'>;
	getSize: TypedContractMethod<[], [bigint], 'view'>;
	insert: TypedContractMethod<[_id: AddressLike, _NICR: BigNumberish, _prevId: AddressLike, _nextId: AddressLike], [void], 'nonpayable'>;
	isEmpty: TypedContractMethod<[], [boolean], 'view'>;
	isFull: TypedContractMethod<[], [boolean], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	reInsert: TypedContractMethod<[_id: AddressLike, _newNICR: BigNumberish, _prevId: AddressLike, _nextId: AddressLike], [void], 'nonpayable'>;
	remove: TypedContractMethod<[_id: AddressLike], [void], 'nonpayable'>;
	setParams: TypedContractMethod<[_size: BigNumberish, _troveManagerAddress: AddressLike, _borrowerOperationsAddress: AddressLike], [void], 'nonpayable'>;
	validInsertPosition: TypedContractMethod<[_NICR: BigNumberish, _prevId: AddressLike, _nextId: AddressLike], [boolean], 'view'>;
} & {
	[K in `${M['trove']}Manager`]: TypedContractMethod<[], [string], 'view'>;
};

type SortedTrovesTypedContractEventFilters<M extends Modifiers> = {
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

	'NodeAdded(address,uint256)': TypedContractEvent<
		NodeAddedEvent.InputTuple,
		NodeAddedEvent.OutputTuple,
		NodeAddedEvent.OutputObject
	>;
	'NodeAdded': TypedContractEvent<
		NodeAddedEvent.InputTuple,
		NodeAddedEvent.OutputTuple,
		NodeAddedEvent.OutputObject
	>;

	'NodeRemoved(address)': TypedContractEvent<
		NodeRemovedEvent.InputTuple,
		NodeRemovedEvent.OutputTuple,
		NodeRemovedEvent.OutputObject
	>;
	'NodeRemoved': TypedContractEvent<
		NodeRemovedEvent.InputTuple,
		NodeRemovedEvent.OutputTuple,
		NodeRemovedEvent.OutputObject
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

export type SortedTroves<M extends Modifiers> = BaseContract &
	SortedTrovesTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): SortedTroves<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & SortedTroves<M>>;

		interface: SortedTrovesInterface<M>;

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
		): Promise<ThisType<T> & SortedTroves<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & SortedTroves<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & SortedTroves<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & SortedTroves<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;

		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & SortedTroves<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'borrowerOperationsAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'contains'): TypedContractMethod<[_id: AddressLike], [boolean], 'view'>;
		getFunction(nameOrSignature: 'data'): TypedContractMethod<[], [[string, string, bigint, bigint] & {head: string; tail: string; maxSize: bigint; size: bigint;}], 'view'>;
		getFunction(nameOrSignature: 'findInsertPosition'): TypedContractMethod<[_NICR: BigNumberish, _prevId: AddressLike, _nextId: AddressLike], [[string, string]], 'view'>;
		getFunction(nameOrSignature: 'getFirst'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'getLast'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'getMaxSize'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getNext'): TypedContractMethod<[_id: AddressLike], [string], 'view'>;
		getFunction(nameOrSignature: 'getPrev'): TypedContractMethod<[_id: AddressLike], [string], 'view'>;
		getFunction(nameOrSignature: 'getSize'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'insert'): TypedContractMethod<[_id: AddressLike, _NICR: BigNumberish, _prevId: AddressLike, _nextId: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'isEmpty'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: 'isFull'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'reInsert'): TypedContractMethod<[_id: AddressLike, _newNICR: BigNumberish, _prevId: AddressLike, _nextId: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'remove'): TypedContractMethod<[_id: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'setParams'): TypedContractMethod<[_size: BigNumberish, _troveManagerAddress: AddressLike, _borrowerOperationsAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'troveManager'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'validInsertPosition'): TypedContractMethod<[_NICR: BigNumberish, _prevId: AddressLike, _nextId: AddressLike], [boolean], 'view'>;

		getEvent(key: 'BorrowerOperationsAddressChanged'): TypedContractEvent<BorrowerOperationsAddressChangedEvent.InputTuple, BorrowerOperationsAddressChangedEvent.OutputTuple, BorrowerOperationsAddressChangedEvent.OutputObject>;
		getEvent(key: 'NodeAdded'): TypedContractEvent<NodeAddedEvent.InputTuple, NodeAddedEvent.OutputTuple, NodeAddedEvent.OutputObject>;
		getEvent(key: 'NodeRemoved'): TypedContractEvent<NodeRemovedEvent.InputTuple, NodeRemovedEvent.OutputTuple, NodeRemovedEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'SortedTrovesAddressChanged'): TypedContractEvent<SortedTrovesAddressChangedEvent.InputTuple, SortedTrovesAddressChangedEvent.OutputTuple, SortedTrovesAddressChangedEvent.OutputObject>;
		getEvent(key: 'TroveManagerAddressChanged'): TypedContractEvent<TroveManagerAddressChangedEvent.InputTuple, TroveManagerAddressChangedEvent.OutputTuple, TroveManagerAddressChangedEvent.OutputObject>;

		filters: SortedTrovesTypedContractEventFilters<M>;
	};
