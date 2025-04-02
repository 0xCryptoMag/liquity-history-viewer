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
	TypedContractMethod
} from './common';

type IERC20FunctionNameOrSignature =
	| 'allowance'
	| 'approve'
	| 'balanceOf'
	| 'totalSupply'
	| 'transfer'
	| 'transferFrom';

type IERC20EventNameOrSignatureOrTopic = 'Approval' | 'Transfer'

export interface IERC20Interface extends Interface {
	getFunction(
		nameOrSignature: IERC20FunctionNameOrSignature
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: IERC20EventNameOrSignatureOrTopic
	): EventFragment;

	encodeFunctionData(functionFragment: 'allowance', values: [AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'approve', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'balanceOf', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
	encodeFunctionData(functionFragment: 'transfer', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'transferFrom', values: [AddressLike, AddressLike, BigNumberish]): string;

	decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
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

type IERC20TypedContractMethods = {
	allowance: TypedContractMethod<[owner: AddressLike, spender: AddressLike], [bigint], 'view'>;
	approve: TypedContractMethod<[spender: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
	balanceOf: TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
	totalSupply: TypedContractMethod<[], [bigint], 'view'>;
	transfer: TypedContractMethod<[recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
	transferFrom: TypedContractMethod<[sender: AddressLike, recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
};

type IERC20TypedContractEventFilters = {
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
}

export type IERC20 = BaseContract &
	IERC20TypedContractMethods & {
		connect(runner?: ContractRunner | null): IERC20;
		waitForDeployment<T>(): Promise<ThisType<T> & IERC20>;

		interface: IERC20Interface;

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
		): Promise<ThisType<T> & IERC20>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & IERC20>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & IERC20>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & IERC20>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;

		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & IERC20>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'allowance'): TypedContractMethod<[owner: AddressLike, spender: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'approve'): TypedContractMethod<[spender: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'balanceOf'): TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'totalSupply'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'transfer'): TypedContractMethod<[recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'transferFrom'): TypedContractMethod<[sender: AddressLike, recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;

		getEvent(key: 'Approval'): TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
		getEvent(key: 'Transfer'): TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;

		filters: IERC20TypedContractEventFilters;
	};
