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

type LockupContractFactoryFunctionNameOrSignature<M extends Modifiers> =
	| 'NAME'
	| 'SECONDS_IN_ONE_YEAR'
	| 'deployLockupContract'
	| 'isOwner'
	| 'isRegisteredLockup'
	| 'lockupContractToDeployer'
	| `${M['lqty']}TokenAddress`
	| 'owner'
	| `set${Uppercase<M['lqty']>}TokenAddress`

type LockupContractFactoryEventNameOrSignatureOrTopic<M extends Modifiers> =
	| `${Uppercase<M['lqty']>}TokenAddressSet`
	| 'LockupContractDeployedThroughFactory'
	| 'OwnershipTransferred'

export interface LockupContractFactoryInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: LockupContractFactoryFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: LockupContractFactoryEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'SECONDS_IN_ONE_YEAR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'deployLockupContract', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'isRegisteredLockup', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'lockupContractToDeployer', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `${M['lqty']}TokenAddress`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: `set${Uppercase<M['lqty']>}TokenAddress`, values: [AddressLike]): string;

	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'SECONDS_IN_ONE_YEAR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'deployLockupContract', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isRegisteredLockup', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'lockupContractToDeployer', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lqty']}TokenAddress`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `set${Uppercase<M['lqty']>}TokenAddress`, data: BytesLike): Result;
}

export namespace LockupContractFactory_LQTYTokenAddressSetEvent {
	export type InputTuple = [_lqtyTokenAddress: AddressLike];
	export type OutputTuple = [_lqtyTokenAddress: string];
	export interface OutputObject {
		_lqtyTokenAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LockupContractFactory_LockupContractDeployedThroughFactoryEvent {
	export type InputTuple = [_lockupContractAddress: AddressLike, _beneficiary: AddressLike, _unlockTime: BigNumberish, _deployer: AddressLike];
	export type OutputTuple = [_lockupContractAddress: string, _beneficiary: string, _unlockTime: bigint, _deployer: string];
	export interface OutputObject {
		_lockupContractAddress: string;
		_beneficiary: string;
		_unlockTime: bigint;
		_deployer: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LockupContractFactory_OwnershipTransferredEvent {
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

type LockupContractFactoryTypedContractMethods<M extends Modifiers> = {
	NAME: TypedContractMethod<[], [string], 'view'>;
	SECONDS_IN_ONE_YEAR: TypedContractMethod<[], [bigint], 'view'>;
	deployLockupContract: TypedContractMethod<[_beneficiary: AddressLike, _unlockTime: BigNumberish], [void], 'nonpayable'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	isRegisteredLockup: TypedContractMethod<[_contractAddress: AddressLike], [boolean], 'view'>;
	lockupContractToDeployer: TypedContractMethod<[arg0: AddressLike], [string], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['lqty']}TokenAddress`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `set${Uppercase<M['lqty']>}TokenAddress`]: TypedContractMethod<[_lqtyTokenAddress: AddressLike], [void], 'nonpayable'>;
};

type LockupContractFactoryTypedContractEventFilters<M extends Modifiers> = {
	'LockupContractDeployedThroughFactory(address,address,uint256,address)': TypedContractEvent<
		LockupContractFactory_LockupContractDeployedThroughFactoryEvent.InputTuple,
		LockupContractFactory_LockupContractDeployedThroughFactoryEvent.OutputTuple,
		LockupContractFactory_LockupContractDeployedThroughFactoryEvent.OutputObject
	>;
	'LockupContractDeployedThroughFactory': TypedContractEvent<
		LockupContractFactory_LockupContractDeployedThroughFactoryEvent.InputTuple,
		LockupContractFactory_LockupContractDeployedThroughFactoryEvent.OutputTuple,
		LockupContractFactory_LockupContractDeployedThroughFactoryEvent.OutputObject
	>;

	'OwnershipTransferred(address,address)': TypedContractEvent<
		LockupContractFactory_OwnershipTransferredEvent.InputTuple,
		LockupContractFactory_OwnershipTransferredEvent.OutputTuple,
		LockupContractFactory_OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		LockupContractFactory_OwnershipTransferredEvent.InputTuple,
		LockupContractFactory_OwnershipTransferredEvent.OutputTuple,
		LockupContractFactory_OwnershipTransferredEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}okenAddressSet(address)`]: TypedContractEvent<
		LockupContractFactory_LQTYTokenAddressSetEvent.InputTuple,
		LockupContractFactory_LQTYTokenAddressSetEvent.OutputTuple,
		LockupContractFactory_LQTYTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}okenAddressSet`]: TypedContractEvent<
		LockupContractFactory_LQTYTokenAddressSetEvent.InputTuple,
		LockupContractFactory_LQTYTokenAddressSetEvent.OutputTuple,
		LockupContractFactory_LQTYTokenAddressSetEvent.OutputObject
	>;
};

export type LockupContractFactory<M extends Modifiers> = BaseContract &
	LockupContractFactoryTypedContractMethods<M> & {
	connect(runner?: ContractRunner | null): LockupContractFactory<M>;
	waitForDeployment<T>(): Promise<ThisType<T> & LockupContractFactory<M>>;

	interface: LockupContractFactoryInterface<M>;

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
	): Promise<ThisType<T> & LockupContractFactory<M>>;
	on<TCEvent extends TypedContractEvent, T>(
		filter: TypedDeferredTopicFilter<TCEvent>,
		listener: TypedListener<TCEvent>
	): Promise<ThisType<T> & LockupContractFactory<M>>;

	once<TCEvent extends TypedContractEvent, T>(
		event: TCEvent,
		listener: TypedListener<TCEvent>
	): Promise<ThisType<T> & LockupContractFactory<M>>;
	once<TCEvent extends TypedContractEvent, T>(
		filter: TypedDeferredTopicFilter<TCEvent>,
		listener: TypedListener<TCEvent>
	): Promise<ThisType<T> & LockupContractFactory<M>>;

	listeners<TCEvent extends TypedContractEvent>(
		event: TCEvent
	): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;
	removeAllListeners<TCEvent extends TypedContractEvent, T>(
		event?: TCEvent
	): Promise<ThisType<T> & LockupContractFactory<M>>;

	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
	getFunction(nameOrSignature: 'SECONDS_IN_ONE_YEAR'): TypedContractMethod<[], [bigint], 'view'>;
	getFunction(nameOrSignature: 'deployLockupContract'): TypedContractMethod<[_beneficiary: AddressLike, _unlockTime: BigNumberish], [void], 'nonpayable'>;
	getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
	getFunction(nameOrSignature: 'isRegisteredLockup'): TypedContractMethod<[_contractAddress: AddressLike], [boolean], 'view'>;
	getFunction(nameOrSignature: 'lockupContractToDeployer'): TypedContractMethod<[arg0: AddressLike], [string], 'view'>;
	getFunction(nameOrSignature: `${M['lqty']}TokenAddress`): TypedContractMethod<[], [string], 'view'>;
	getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
	getFunction(nameOrSignature: `set${Uppercase<M['lqty']>}TokenAddress`): TypedContractMethod<[_lqtyTokenAddress: AddressLike], [void], 'nonpayable'>;

	getEvent(key: 'LQTYTokenAddressSet'): TypedContractEvent<LockupContractFactory_LQTYTokenAddressSetEvent.InputTuple, LockupContractFactory_LQTYTokenAddressSetEvent.OutputTuple, LockupContractFactory_LQTYTokenAddressSetEvent.OutputObject>;
	getEvent(key: 'LockupContractDeployedThroughFactory'): TypedContractEvent<LockupContractFactory_LockupContractDeployedThroughFactoryEvent.InputTuple, LockupContractFactory_LockupContractDeployedThroughFactoryEvent.OutputTuple, LockupContractFactory_LockupContractDeployedThroughFactoryEvent.OutputObject>;
	getEvent(key: 'OwnershipTransferred'): TypedContractEvent<LockupContractFactory_OwnershipTransferredEvent.InputTuple, LockupContractFactory_OwnershipTransferredEvent.OutputTuple, LockupContractFactory_OwnershipTransferredEvent.OutputObject>;

	filters: LockupContractFactoryTypedContractEventFilters<M>;
}
