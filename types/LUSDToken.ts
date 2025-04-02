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

type LUSDTokenFunctionNameOrSignature<M extends Modifiers> =
	| 'allowance'
	| 'approve'
	| 'balanceOf'
	| 'borrowerOperationsAddress'
	| 'burn'
	| 'decimals'
	| 'decreaseAllowance'
	| 'domainSeparator'
	| 'increaseAllowance'
	| 'mint'
	| 'name'
	| 'nonces'
	| 'permit'
	| 'permitTypeHash'
	| 'returnFromPool'
	| 'sendToPool'
	| 'stabilityPoolAddress'
	| 'symbol'
	| 'totalSupply'
	| 'transfer'
	| 'transferFrom'
	| `${M['trove']}ManagerAddress`
	| 'version'

type LUSDTokenEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'Approval'
	| 'BorrowerOperationsAddressChanged'
	| `${Uppercase<M['lusd']>}TokenBalanceUpdated`
	| 'StabilityPoolAddressChanged'
	| 'Transfer'
	| `${Capitalize<M['trove']>}ManagerAddressChanged`


export interface LUSDTokenInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: LUSDTokenFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: LUSDTokenEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'allowance', values: [AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'approve', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'balanceOf', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'borrowerOperationsAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'burn', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
	encodeFunctionData(functionFragment: 'decreaseAllowance', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'domainSeparator', values?: undefined): string;
	encodeFunctionData(functionFragment: 'increaseAllowance', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'mint', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'name', values?: undefined): string;
	encodeFunctionData(functionFragment: 'nonces', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'permit', values: [ AddressLike, AddressLike, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike]): string;
	encodeFunctionData(functionFragment: 'permitTypeHash', values?: undefined): string;
	encodeFunctionData(functionFragment: 'returnFromPool', values: [AddressLike, AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'sendToPool', values: [AddressLike, AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'stabilityPoolAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
	encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
	encodeFunctionData(functionFragment: 'transfer', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'transferFrom', values: [AddressLike, AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'troveManagerAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'version', values?: undefined): string;

	decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'borrowerOperationsAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'burn', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'decreaseAllowance', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'domainSeparator', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'increaseAllowance', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'mint', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'nonces', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'permit', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'permitTypeHash', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'returnFromPool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'sendToPool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'stabilityPoolAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'troveManagerAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'version', data: BytesLike): Result;
}

export namespace ApprovalEvent {
	export type InputTuple = [owner: AddressLike, spender: AddressLike, value: BigNumberish];
	export type OutputTuple = [owner: string, spender: string, value: bigint];
	export interface OutputObject {
		owner: string;
		spender: string;
		value: bigint;
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

export namespace LUSDTokenBalanceUpdatedEvent {
	export type InputTuple = [_user: AddressLike, _amount: BigNumberish];
	export type OutputTuple = [_user: string, _amount: bigint];
	export interface OutputObject {
		_user: string;
		_amount: bigint;
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

export namespace TransferEvent {
	export type InputTuple = [from: AddressLike, to: AddressLike, value: BigNumberish];
	export type OutputTuple = [from: string, to: string, value: bigint];
	export interface OutputObject {
		from: string;
		to: string;
		value: bigint;
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

type LUSDTokenTypedContractMethods<M extends Modifiers> = {
	allowance: TypedContractMethod<[owner: AddressLike, spender: AddressLike], [bigint], 'view'>;
	approve: TypedContractMethod<[spender: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
	balanceOf: TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
	borrowerOperationsAddress: TypedContractMethod<[], [string], 'view'>;
	burn: TypedContractMethod<[_account: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
	decimals: TypedContractMethod<[], [bigint], 'view'>;
	decreaseAllowance: TypedContractMethod<[spender: AddressLike, subtractedValue: BigNumberish], [boolean], 'nonpayable'>;
	domainSeparator: TypedContractMethod<[], [string], 'view'>;
	increaseAllowance: TypedContractMethod<[spender: AddressLike, addedValue: BigNumberish], [boolean], 'nonpayable'>;
	mint: TypedContractMethod<[_account: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
	name: TypedContractMethod<[], [string], 'view'>;
	nonces: TypedContractMethod<[owner: AddressLike], [bigint], 'view'>;
	permit: TypedContractMethod<[owner: AddressLike, spender: AddressLike, amount: BigNumberish, deadline: BigNumberish, v: BigNumberish, r: BytesLike, s: BytesLike], [void], 'nonpayable'>;
	permitTypeHash: TypedContractMethod<[], [string], 'view'>;
	returnFromPool: TypedContractMethod<[_poolAddress: AddressLike, _receiver: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
	sendToPool: TypedContractMethod<[_sender: AddressLike, _poolAddress: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
	stabilityPoolAddress: TypedContractMethod<[], [string], 'view'>;
	symbol: TypedContractMethod<[], [string], 'view'>;
	totalSupply: TypedContractMethod<[], [bigint], 'view'>;
	transfer: TypedContractMethod<[recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
	transferFrom: TypedContractMethod<[sender: AddressLike, recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
	version: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['trove']}ManagerAddress`]: TypedContractMethod<[], [string], 'view'>;
};

type LUSDTokenTypedContractEventFilters<M extends Modifiers> = {
	'Approval(address,address,uint256)': TypedContractEvent<
		ApprovalEvent.InputTuple,
		ApprovalEvent.OutputTuple,
		ApprovalEvent.OutputObject
	>;
	'Approval': TypedContractEvent<
		ApprovalEvent.InputTuple,
		ApprovalEvent.OutputTuple,
		ApprovalEvent.OutputObject
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

	'Transfer(address,address,uint256)': TypedContractEvent<
		TransferEvent.InputTuple,
		TransferEvent.OutputTuple,
		TransferEvent.OutputObject
	>;
	'Transfer': TypedContractEvent<
		TransferEvent.InputTuple,
		TransferEvent.OutputTuple,
		TransferEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenBalanceUpdated(address,uint256)`]: TypedContractEvent<
		LUSDTokenBalanceUpdatedEvent.InputTuple,
		LUSDTokenBalanceUpdatedEvent.OutputTuple,
		LUSDTokenBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenBalanceUpdated`]: TypedContractEvent<
		LUSDTokenBalanceUpdatedEvent.InputTuple,
		LUSDTokenBalanceUpdatedEvent.OutputTuple,
		LUSDTokenBalanceUpdatedEvent.OutputObject
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

export type LUSDToken<M extends Modifiers> = BaseContract &
	LUSDTokenTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): LUSDToken<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & LUSDToken<M>>;

		interface: LUSDTokenInterface<M>;

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
		): Promise<ThisType<T> & LUSDToken<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & LUSDToken<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & LUSDToken<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & LUSDToken<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;

		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & LUSDToken<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'allowance'): TypedContractMethod<[owner: AddressLike, spender: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'approve'): TypedContractMethod<[spender: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'balanceOf'): TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'borrowerOperationsAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'burn'): TypedContractMethod<[_account: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'decimals'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'decreaseAllowance'): TypedContractMethod<[spender: AddressLike, subtractedValue: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'domainSeparator'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'increaseAllowance'): TypedContractMethod<[spender: AddressLike, addedValue: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'mint'): TypedContractMethod<[_account: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'name'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'nonces'): TypedContractMethod<[owner: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'permit'): TypedContractMethod<[owner: AddressLike, spender: AddressLike, amount: BigNumberish, deadline: BigNumberish, v: BigNumberish, r: BytesLike, s: BytesLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'permitTypeHash'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'returnFromPool'): TypedContractMethod<[_poolAddress: AddressLike, _receiver: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'sendToPool'): TypedContractMethod<[_sender: AddressLike, _poolAddress: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'stabilityPoolAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'symbol'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'totalSupply'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'transfer'): TypedContractMethod<[recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'transferFrom'): TypedContractMethod<[sender: AddressLike, recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: `${M['trove']}ManagerAddress`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'version'): TypedContractMethod<[], [string], 'view'>;

		getEvent(key: 'Approval'): TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
		getEvent(key: 'BorrowerOperationsAddressChanged'): TypedContractEvent<BorrowerOperationsAddressChangedEvent.InputTuple, BorrowerOperationsAddressChangedEvent.OutputTuple, BorrowerOperationsAddressChangedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lusd']>}TokenBalanceUpdated`): TypedContractEvent<LUSDTokenBalanceUpdatedEvent.InputTuple, LUSDTokenBalanceUpdatedEvent.OutputTuple, LUSDTokenBalanceUpdatedEvent.OutputObject>;
		getEvent(key: 'StabilityPoolAddressChanged'): TypedContractEvent<StabilityPoolAddressChangedEvent.InputTuple, StabilityPoolAddressChangedEvent.OutputTuple, StabilityPoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'Transfer'): TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}ManagerAddressChanged`): TypedContractEvent<TroveManagerAddressChangedEvent.InputTuple, TroveManagerAddressChangedEvent.OutputTuple, TroveManagerAddressChangedEvent.OutputObject>;

		filters: LUSDTokenTypedContractEventFilters<M>;
	};
