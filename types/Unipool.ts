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

type UnipoolFunctionNameOrSignature<M extends Modifiers> =
	| 'NAME'
	| 'balanceOf'
	| 'claimReward'
	| 'duration'
	| 'earned'
	| 'isOwner'
	| 'lastTimeRewardApplicable'
	| 'lastUpdateTime'
	| `${M['lqty']}Token`
	| 'owner'
	| 'periodFinish'
	| 'rewardPerToken'
	| 'rewardPerTokenStored'
	| 'rewardRate'
	| 'rewards'
	| 'setParams'
	| 'stake'
	| 'totalSupply'
	| 'uniToken'
	| 'userRewardPerTokenPaid'
	| 'withdraw'
	| 'withdrawAndClaim'

type UnipoolEventNameOrSignatureOrTopic<M extends Modifiers> =
	| `${Uppercase<M['lqty']>}TokenAddressChanged`
	| 'OwnershipTransferred'
	| 'RewardAdded'
	| 'RewardPaid'
	| 'Staked'
	| 'UniTokenAddressChanged'
	| 'Withdrawn'

export interface UnipoolInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: UnipoolFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: UnipoolEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'balanceOf', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'claimReward', values?: undefined): string;
	encodeFunctionData(functionFragment: 'duration', values?: undefined): string;
	encodeFunctionData(functionFragment: 'earned', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'lastTimeRewardApplicable', values?: undefined): string;
	encodeFunctionData(functionFragment: 'lastUpdateTime', values?: undefined): string;
	encodeFunctionData(functionFragment: 'lqtyToken', values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'periodFinish', values?: undefined): string;
	encodeFunctionData(functionFragment: 'rewardPerToken', values?: undefined): string;
	encodeFunctionData(functionFragment: 'rewardPerTokenStored', values?: undefined): string;
	encodeFunctionData(functionFragment: 'rewardRate', values?: undefined): string;
	encodeFunctionData(functionFragment: 'rewards', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'setParams', values: [AddressLike, AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'stake', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
	encodeFunctionData(functionFragment: 'uniToken', values?: undefined): string;
	encodeFunctionData(functionFragment: 'userRewardPerTokenPaid', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'withdraw', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'withdrawAndClaim', values?: undefined): string;

	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'claimReward', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'duration', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'earned', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'lastTimeRewardApplicable', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'lastUpdateTime', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'lqtyToken', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'periodFinish', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'rewardPerToken', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'rewardPerTokenStored', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'rewardRate', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'rewards', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setParams', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'stake', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'uniToken', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'userRewardPerTokenPaid', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'withdrawAndClaim', data: BytesLike): Result;
}

export namespace LQTYTokenAddressChangedEvent {
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

export namespace RewardAddedEvent {
	export type InputTuple = [reward: BigNumberish];
	export type OutputTuple = [reward: bigint];
	export interface OutputObject {
		reward: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace RewardPaidEvent {
	export type InputTuple = [user: AddressLike, reward: BigNumberish];
	export type OutputTuple = [user: string, reward: bigint];
	export interface OutputObject {
		user: string;
		reward: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StakedEvent {
	export type InputTuple = [user: AddressLike, amount: BigNumberish];
	export type OutputTuple = [user: string, amount: bigint];
	export interface OutputObject {
		user: string;
		amount: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace UniTokenAddressChangedEvent {
	export type InputTuple = [_uniTokenAddress: AddressLike];
	export type OutputTuple = [_uniTokenAddress: string];
	export interface OutputObject {
		_uniTokenAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawnEvent {
	export type InputTuple = [user: AddressLike, amount: BigNumberish];
	export type OutputTuple = [user: string, amount: bigint];
	export interface OutputObject {
		user: string;
		amount: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

type UnipoolTypedContractMethods<M extends Modifiers> = {
	NAME: TypedContractMethod<[], [string], 'view'>;
	balanceOf: TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
	claimReward: TypedContractMethod<[], [void], 'nonpayable'>;
	duration: TypedContractMethod<[], [bigint], 'view'>;
	earned: TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	lastTimeRewardApplicable: TypedContractMethod<[], [bigint], 'view'>;
	lastUpdateTime: TypedContractMethod<[], [bigint], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	periodFinish: TypedContractMethod<[], [bigint], 'view'>;
	rewardPerToken: TypedContractMethod<[], [bigint], 'view'>;
	rewardPerTokenStored: TypedContractMethod<[], [bigint], 'view'>;
	rewardRate: TypedContractMethod<[], [bigint], 'view'>;
	rewards: TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;
	setParams: TypedContractMethod<[_lqtyTokenAddress: AddressLike, _uniTokenAddress: AddressLike, _duration: BigNumberish], [void], 'nonpayable'>;
	stake: TypedContractMethod<[amount: BigNumberish], [void], 'nonpayable'>;
	totalSupply: TypedContractMethod<[], [bigint], 'view'>;
	uniToken: TypedContractMethod<[], [string], 'view'>;
	userRewardPerTokenPaid: TypedContractMethod< [arg0: AddressLike], [bigint], 'view'>;
	withdraw: TypedContractMethod<[amount: BigNumberish], [void], 'nonpayable'>;
	withdrawAndClaim: TypedContractMethod<[], [void], 'nonpayable'>;
} & {
	lqtyToken: TypedContractMethod<[], [string], 'view'>;
};

type UnipoolTypedContractEventFilters<M extends Modifiers> = {
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

	'RewardAdded(uint256)': TypedContractEvent<
		RewardAddedEvent.InputTuple,
		RewardAddedEvent.OutputTuple,
		RewardAddedEvent.OutputObject
	>;
	'RewardAdded': TypedContractEvent<
		RewardAddedEvent.InputTuple,
		RewardAddedEvent.OutputTuple,
		RewardAddedEvent.OutputObject
	>;

	'RewardPaid(address,uint256)': TypedContractEvent<
		RewardPaidEvent.InputTuple,
		RewardPaidEvent.OutputTuple,
		RewardPaidEvent.OutputObject
	>;
	'RewardPaid': TypedContractEvent<
		RewardPaidEvent.InputTuple,
		RewardPaidEvent.OutputTuple,
		RewardPaidEvent.OutputObject
	>;

	'Staked(address,uint256)': TypedContractEvent<
		StakedEvent.InputTuple,
		StakedEvent.OutputTuple,
		StakedEvent.OutputObject
	>;
	'Staked': TypedContractEvent<
		StakedEvent.InputTuple,
		StakedEvent.OutputTuple,
		StakedEvent.OutputObject
	>;

	'UniTokenAddressChanged(address)': TypedContractEvent<
		UniTokenAddressChangedEvent.InputTuple,
		UniTokenAddressChangedEvent.OutputTuple,
		UniTokenAddressChangedEvent.OutputObject
	>;
	'UniTokenAddressChanged': TypedContractEvent<
		UniTokenAddressChangedEvent.InputTuple,
		UniTokenAddressChangedEvent.OutputTuple,
		UniTokenAddressChangedEvent.OutputObject
	>;

	'Withdrawn(address,uint256)': TypedContractEvent<
		WithdrawnEvent.InputTuple,
		WithdrawnEvent.OutputTuple,
		WithdrawnEvent.OutputObject
	>;
	'Withdrawn': TypedContractEvent<
		WithdrawnEvent.InputTuple,
		WithdrawnEvent.OutputTuple,
		WithdrawnEvent.OutputObject
	>;
} & {
	[K in`${Uppercase<M['lqty']>}TokenAddressChanged(address)`]: TypedContractEvent<
		LQTYTokenAddressChangedEvent.InputTuple,
		LQTYTokenAddressChangedEvent.OutputTuple,
		LQTYTokenAddressChangedEvent.OutputObject
	>;
} & {
	[K in`${Uppercase<M['lqty']>}TokenAddressChanged`]: TypedContractEvent<
		LQTYTokenAddressChangedEvent.InputTuple,
		LQTYTokenAddressChangedEvent.OutputTuple,
		LQTYTokenAddressChangedEvent.OutputObject
	>;
};


export type Unipool<M extends Modifiers> = BaseContract &
	UnipoolTypedContractMethods<M> & {
	connect(runner?: ContractRunner | null): Unipool<M>;
	waitForDeployment<T>(): Promise<ThisType<T> & Unipool<M>>;

	interface: UnipoolInterface<M>;

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
	): Promise<ThisType<T> & Unipool<M>>;
	on<TCEvent extends TypedContractEvent, T>(
		filter: TypedDeferredTopicFilter<TCEvent>,
		listener: TypedListener<TCEvent>
	): Promise<ThisType<T> & Unipool<M>>;

	once<TCEvent extends TypedContractEvent, T>(
		event: TCEvent,
		listener: TypedListener<TCEvent>
	): Promise<ThisType<T> & Unipool<M>>;
	once<TCEvent extends TypedContractEvent, T>(
		filter: TypedDeferredTopicFilter<TCEvent>,
		listener: TypedListener<TCEvent>
	): Promise<ThisType<T> & Unipool<M>>;

	listeners<TCEvent extends TypedContractEvent>(
		event: TCEvent
	): Promise<Array<TypedListener<TCEvent>>>;
	listeners(eventName?: string): Promise<Array<Listener>>;

	removeAllListeners<TCEvent extends TypedContractEvent, T>(
		event?: TCEvent
	): Promise<ThisType<T> & Unipool<M>>;

	getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
	getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
	getFunction(nameOrSignature: 'balanceOf'): TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
	getFunction(nameOrSignature: 'claimReward'): TypedContractMethod<[], [void], 'nonpayable'>;
	getFunction(nameOrSignature: 'duration'): TypedContractMethod<[], [bigint], 'view'>;
	getFunction(nameOrSignature: 'earned'): TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
	getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
	getFunction(nameOrSignature: 'lastTimeRewardApplicable'): TypedContractMethod<[], [bigint], 'view'>;
	getFunction(nameOrSignature: 'lastUpdateTime'): TypedContractMethod<[], [bigint], 'view'>;
	getFunction(nameOrSignature: 'lqtyToken'): TypedContractMethod<[], [string], 'view'>;
	getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
	getFunction(nameOrSignature: 'periodFinish'): TypedContractMethod<[], [bigint], 'view'>;
	getFunction(nameOrSignature: 'rewardPerToken'): TypedContractMethod<[], [bigint], 'view'>;
	getFunction(nameOrSignature: 'rewardPerTokenStored'): TypedContractMethod<[], [bigint], 'view'>;
	getFunction(nameOrSignature: 'rewardRate'): TypedContractMethod<[], [bigint], 'view'>;
	getFunction(nameOrSignature: 'rewards'): TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;
	getFunction(nameOrSignature: 'setParams'): TypedContractMethod<[_lqtyTokenAddress: AddressLike, _uniTokenAddress: AddressLike, _duration: BigNumberish], [void], 'nonpayable'>;
	getFunction(nameOrSignature: 'stake'): TypedContractMethod<[amount: BigNumberish], [void], 'nonpayable'>;
	getFunction(nameOrSignature: 'totalSupply'): TypedContractMethod<[], [bigint], 'view'>;
	getFunction(nameOrSignature: 'uniToken'): TypedContractMethod<[], [string], 'view'>;
	getFunction(nameOrSignature: 'userRewardPerTokenPaid'): TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;
	getFunction(nameOrSignature: 'withdraw'): TypedContractMethod<[amount: BigNumberish], [void], 'nonpayable'>;
	getFunction(nameOrSignature: 'withdrawAndClaim'): TypedContractMethod<[], [void], 'nonpayable'>;

	getEvent(key: 'LQTYTokenAddressChanged'): TypedContractEvent<LQTYTokenAddressChangedEvent.InputTuple, LQTYTokenAddressChangedEvent.OutputTuple, LQTYTokenAddressChangedEvent.OutputObject>;
	getEvent(key: 'OwnershipTransferred'): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
	getEvent(key: 'RewardAdded'): TypedContractEvent<RewardAddedEvent.InputTuple, RewardAddedEvent.OutputTuple, RewardAddedEvent.OutputObject>;
	getEvent(key: 'RewardPaid'): TypedContractEvent<RewardPaidEvent.InputTuple, RewardPaidEvent.OutputTuple, RewardPaidEvent.OutputObject>;
	getEvent(key: 'Staked'): TypedContractEvent< StakedEvent.InputTuple, StakedEvent.OutputTuple, StakedEvent.OutputObject>;
	getEvent(key: 'UniTokenAddressChanged'): TypedContractEvent<UniTokenAddressChangedEvent.InputTuple, UniTokenAddressChangedEvent.OutputTuple, UniTokenAddressChangedEvent.OutputObject>;
	getEvent(key: 'Withdrawn'): TypedContractEvent<WithdrawnEvent.InputTuple, WithdrawnEvent.OutputTuple, WithdrawnEvent.OutputObject>;

	filters: UnipoolTypedContractEventFilters<M>;
}
