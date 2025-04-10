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

type CommunityIssuanceFunctionNameOrSignature<M extends Modifiers> =
	| 'DECIMAL_PRECISION'
	| 'ISSUANCE_FACTOR'
	| `${Uppercase<M['lqty']>}SupplyCap`
	| 'NAME'
	| 'SECONDS_IN_ONE_MINUTE'
	| 'deploymentTime'
	| 'isOwner'
	| `issue${Uppercase<M['lqty']>}`
	| `${M['lqty']}Token`
	| 'owner'
	| `send${Uppercase<M['lqty']>}`
	| 'setAddresses'
	| 'stabilityPoolAddress'
	| `total${Uppercase<M['lqty']>}Issued`;

type CommunityIssuanceEventNameOrSignatureOrTopic<M extends Modifiers> =
	| `${Uppercase<M['lqty']>}TokenAddressSet`
	| 'OwnershipTransferred'
	| 'StabilityPoolAddressSet'
	| `Total${Uppercase<M['lqty']>}IssuedUpdated`;

export interface CommunityIssuanceInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: CommunityIssuanceFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: CommunityIssuanceEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'DECIMAL_PRECISION', values?: undefined): string;
	encodeFunctionData(functionFragment: 'ISSUANCE_FACTOR', values?: undefined): string;
	encodeFunctionData(functionFragment: `${Uppercase<M['lqty']>}SupplyCap`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'SECONDS_IN_ONE_MINUTE', values?: undefined): string;
	encodeFunctionData(functionFragment: 'deploymentTime', values?: undefined): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: `issue${Uppercase<M['lqty']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lqty']}Token`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: `send${Uppercase<M['lqty']>}`, values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'setAddresses', values: [AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'stabilityPoolAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: `total${Uppercase<M['lqty']>}Issued`, values?: undefined): string;

	decodeFunctionResult(functionFragment: 'DECIMAL_PRECISION', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'ISSUANCE_FACTOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${Uppercase<M['lqty']>}SupplyCap`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'SECONDS_IN_ONE_MINUTE', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'deploymentTime', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `issue${Uppercase<M['lqty']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lqty']}Token`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `send${Uppercase<M['lqty']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'stabilityPoolAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `total${Uppercase<M['lqty']>}Issued`, data: BytesLike): Result;
}

export namespace CommunityIssuance_LQTYTokenAddressSetEvent {
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

export namespace CommunityIssuance_OwnershipTransferredEvent {
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

export namespace CommunityIssuance_StabilityPoolAddressSetEvent {
	export type InputTuple = [_stabilityPoolAddress: AddressLike];
	export type OutputTuple = [_stabilityPoolAddress: string];
	export interface OutputObject {
		_stabilityPoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace CommunityIssuance_TotalLQTYIssuedUpdatedEvent {
	export type InputTuple = [_totalLQTYIssued: BigNumberish];
	export type OutputTuple = [_totalLQTYIssued: bigint];
	export interface OutputObject {
		_totalLQTYIssued: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

type CommunityIssuanceTypedContractMethods<M extends Modifiers> = {
	DECIMAL_PRECISION: TypedContractMethod<[], [bigint], 'view'>;
	ISSUANCE_FACTOR: TypedContractMethod<[], [bigint], 'view'>;
	NAME: TypedContractMethod<[], [string], 'view'>;
	SECONDS_IN_ONE_MINUTE: TypedContractMethod<[], [bigint], 'view'>;
	deploymentTime: TypedContractMethod<[], [bigint], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	setAddresses: TypedContractMethod<[_lqtyTokenAddress: AddressLike, _stabilityPoolAddress: AddressLike], [void], 'nonpayable'>;
	stabilityPoolAddress: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${Uppercase<M['lqty']>}SupplyCap`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `issue${Uppercase<M['lqty']>}`]: TypedContractMethod<[], [bigint], 'nonpayable'>;
} & {
	[K in `${M['lqty']}Token`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `send${Uppercase<M['lqty']>}`]: TypedContractMethod<[_account: AddressLike, _LQTYamount: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `total${Uppercase<M['lqty']>}Issued`]: TypedContractMethod<[], [bigint], 'view'>;
};

type CommunityIssuanceTypedContractEventFilters<M extends Modifiers> = {
	'OwnershipTransferred(address,address)': TypedContractEvent<
		CommunityIssuance_OwnershipTransferredEvent.InputTuple,
		CommunityIssuance_OwnershipTransferredEvent.OutputTuple,
		CommunityIssuance_OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		CommunityIssuance_OwnershipTransferredEvent.InputTuple,
		CommunityIssuance_OwnershipTransferredEvent.OutputTuple,
		CommunityIssuance_OwnershipTransferredEvent.OutputObject
	>;

	'StabilityPoolAddressSet(address)': TypedContractEvent<
		CommunityIssuance_StabilityPoolAddressSetEvent.InputTuple,
		CommunityIssuance_StabilityPoolAddressSetEvent.OutputTuple,
		CommunityIssuance_StabilityPoolAddressSetEvent.OutputObject
	>;
	'StabilityPoolAddressSet': TypedContractEvent<
		CommunityIssuance_StabilityPoolAddressSetEvent.InputTuple,
		CommunityIssuance_StabilityPoolAddressSetEvent.OutputTuple,
		CommunityIssuance_StabilityPoolAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}TokenAddressSet(address)`]: TypedContractEvent<
		CommunityIssuance_LQTYTokenAddressSetEvent.InputTuple,
		CommunityIssuance_LQTYTokenAddressSetEvent.OutputTuple,
		CommunityIssuance_LQTYTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}TokenAddressSet`]: TypedContractEvent<
		CommunityIssuance_LQTYTokenAddressSetEvent.InputTuple,
		CommunityIssuance_LQTYTokenAddressSetEvent.OutputTuple,
		CommunityIssuance_LQTYTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `Total${Uppercase<M['lqty']>}IssuedUpdated(uint256)`]: TypedContractEvent<
		CommunityIssuance_TotalLQTYIssuedUpdatedEvent.InputTuple,
		CommunityIssuance_TotalLQTYIssuedUpdatedEvent.OutputTuple,
		CommunityIssuance_TotalLQTYIssuedUpdatedEvent.OutputObject
	>;
} & {
	[K in `Total${Uppercase<M['lqty']>}IssuedUpdated`]: TypedContractEvent<
		CommunityIssuance_TotalLQTYIssuedUpdatedEvent.InputTuple,
		CommunityIssuance_TotalLQTYIssuedUpdatedEvent.OutputTuple,
		CommunityIssuance_TotalLQTYIssuedUpdatedEvent.OutputObject
	>;
};

export type CommunityIssuance<M extends Modifiers> = BaseContract &
	CommunityIssuanceTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): CommunityIssuance<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & CommunityIssuance<M>>;

		interface: CommunityIssuanceInterface<M>;

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
		): Promise<ThisType<T> & CommunityIssuance<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & CommunityIssuance<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & CommunityIssuance<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & CommunityIssuance<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;
		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & CommunityIssuance<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'DECIMAL_PRECISION'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'ISSUANCE_FACTOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `${Uppercase<M['lqty']>}SupplyCap`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'SECONDS_IN_ONE_MINUTE'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'deploymentTime'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: `issue${Uppercase<M['lqty']>}`): TypedContractMethod<[], [bigint], 'nonpayable'>;
		getFunction(nameOrSignature: `${M['lqty']}Token`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `send${Uppercase<M['lqty']>}`): TypedContractMethod<[_account: AddressLike, _LQTYamount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_lqtyTokenAddress: AddressLike, _stabilityPoolAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'stabilityPoolAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `total${Uppercase<M['lqty']>}Issued`): TypedContractMethod<[], [bigint], 'view'>;

		getEvent(key: `${Uppercase<M['lqty']>}TokenAddressSet`): TypedContractEvent<CommunityIssuance_LQTYTokenAddressSetEvent.InputTuple, CommunityIssuance_LQTYTokenAddressSetEvent.OutputTuple, CommunityIssuance_LQTYTokenAddressSetEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<CommunityIssuance_OwnershipTransferredEvent.InputTuple, CommunityIssuance_OwnershipTransferredEvent.OutputTuple, CommunityIssuance_OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'StabilityPoolAddressSet'): TypedContractEvent<CommunityIssuance_StabilityPoolAddressSetEvent.InputTuple, CommunityIssuance_StabilityPoolAddressSetEvent.OutputTuple, CommunityIssuance_StabilityPoolAddressSetEvent.OutputObject>;
		getEvent(key: `Total${Uppercase<M['lqty']>}IssuedUpdated`): TypedContractEvent<CommunityIssuance_TotalLQTYIssuedUpdatedEvent.InputTuple, CommunityIssuance_TotalLQTYIssuedUpdatedEvent.OutputTuple, CommunityIssuance_TotalLQTYIssuedUpdatedEvent.OutputObject>;

		filters: CommunityIssuanceTypedContractEventFilters<M>;
	};
