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

type LQTYStakingFunctionNameOrSignature<M extends Modifiers> =
	| 'DECIMAL_PRECISION'
	| `F_${Uppercase<M['eth']>}`
	| `F_${Uppercase<M['lusd']>}`
	| 'NAME'
	| 'activePoolAddress'
	| 'borrowerOperationsAddress'
	| `getPending${Uppercase<M['eth']>}Gain`
	| `getPending${Uppercase<M['lusd']>}Gain`
	| `increaseF_${Uppercase<M['eth']>}`
	| `increaseF_${Uppercase<M['lusd']>}`
	| 'isOwner'
	| `${M['lqty']}Token`
	| `${M['lusd']}Token`
	| 'owner'
	| 'setAddresses'
	| 'snapshots'
	| 'stake'
	| 'stakes'
	| `total${Uppercase<M['lqty']>}Staked`
	| `${M['trove']}ManagerAddress`
	| 'unstake'

type LQTYStakingEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'ActivePoolAddressSet'
	| 'BorrowerOperationsAddressSet'
	| `${Capitalize<M['ether']>}Sent`
	| `F_${Uppercase<M['eth']>}Updated`
	| `F_${Uppercase<M['lusd']>}Updated`
	| `${Uppercase<M['lqty']>}TokenAddressSet`
	| `${Uppercase<M['lusd']>}TokenAddressSet`
	| 'OwnershipTransferred'
	| 'StakeChanged'
	| 'StakerSnapshotsUpdated'
	| 'StakingGainsWithdrawn'
	| `Total${Uppercase<M['lqty']>}StakedUpdated`
	| `${Capitalize<M['trove']>}ManagerAddressSet`


export interface LQTYStakingInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: LQTYStakingFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: LQTYStakingEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'DECIMAL_PRECISION', values?: undefined): string;
	encodeFunctionData(functionFragment: `F_${Uppercase<M['eth']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: `F_${Uppercase<M['lusd']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'activePoolAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'borrowerOperationsAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: `getPending${Uppercase<M['eth']>}Gain`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `getPending${Uppercase<M['lusd']>}Gain`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `increaseF_${Uppercase<M['eth']>}`, values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: `increaseF_${Uppercase<M['lusd']>}`, values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lqty']}Token`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lusd']}Token`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'setAddresses', values: [ AddressLike, AddressLike, AddressLike, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'snapshots', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'stake', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'stakes', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `total${Uppercase<M['lqty']>}Staked`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['trove']}ManagerAddress`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'unstake', values: [BigNumberish]): string;

	decodeFunctionResult(functionFragment: 'DECIMAL_PRECISION', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `F_${Uppercase<M['eth']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `F_${Uppercase<M['lusd']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'activePoolAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'borrowerOperationsAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `getPending${Uppercase<M['eth']>}Gain`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `getPending${Uppercase<M['lusd']>}Gain`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `increaseF_${Uppercase<M['eth']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `increaseF_${Uppercase<M['lusd']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lqty']}Token`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lusd']}Token`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'snapshots', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'stake', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'stakes', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `total${Uppercase<M['lqty']>}Staked`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['trove']}ManagerAddress`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'unstake', data: BytesLike): Result;
}

export namespace LQTYStaking_ActivePoolAddressSetEvent {
	export type InputTuple = [_activePoolAddress: AddressLike];
	export type OutputTuple = [_activePoolAddress: string];
	export interface OutputObject {
		_activePoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStaking_BorrowerOperationsAddressSetEvent {
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

export namespace LQTYStaking_EtherSentEvent {
	export type InputTuple = [_account: AddressLike, _amount: BigNumberish];
	export type OutputTuple = [_account: string, _amount: bigint];
	export interface OutputObject {
		_account: string;
		_amount: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStaking_F_ETHUpdatedEvent {
	export type InputTuple = [_F_ETH: BigNumberish];
	export type OutputTuple = [_F_ETH: bigint];
	export interface OutputObject {
		_F_ETH: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStaking_F_LUSDUpdatedEvent {
	export type InputTuple = [_F_LUSD: BigNumberish];
	export type OutputTuple = [_F_LUSD: bigint];
	export interface OutputObject {
		_F_LUSD: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStaking_LQTYTokenAddressSetEvent {
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

export namespace LQTYStaking_LUSDTokenAddressSetEvent {
	export type InputTuple = [_lusdTokenAddress: AddressLike];
	export type OutputTuple = [_lusdTokenAddress: string];
	export interface OutputObject {
		_lusdTokenAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStaking_OwnershipTransferredEvent {
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

export namespace LQTYStaking_StakeChangedEvent {
	export type InputTuple = [staker: AddressLike, newStake: BigNumberish];
	export type OutputTuple = [staker: string, newStake: bigint];
	export interface OutputObject {
		staker: string;
		newStake: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStaking_StakerSnapshotsUpdatedEvent {
	export type InputTuple = [_staker: AddressLike, _F_ETH: BigNumberish, _F_LUSD: BigNumberish];
	export type OutputTuple = [_staker: string, _F_ETH: bigint, _F_LUSD: bigint];
	export interface OutputObject {
		_staker: string;
		_F_ETH: bigint;
		_F_LUSD: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStaking_StakingGainsWithdrawnEvent {
	export type InputTuple = [staker: AddressLike, LUSDGain: BigNumberish, ETHGain: BigNumberish];
	export type OutputTuple = [staker: string, LUSDGain: bigint, ETHGain: bigint];
	export interface OutputObject {
		staker: string;
		LUSDGain: bigint;
		ETHGain: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStaking_TotalLQTYStakedUpdatedEvent {
	export type InputTuple = [_totalLQTYStaked: BigNumberish];
	export type OutputTuple = [_totalLQTYStaked: bigint];
	export interface OutputObject {
		_totalLQTYStaked: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStaking_TroveManagerAddressSetEvent {
	export type InputTuple = [_troveManager: AddressLike];
	export type OutputTuple = [_troveManager: string];
	export interface OutputObject {
		_troveManager: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

type LQTYStakingTypedContractMethods<M extends Modifiers> = {
	DECIMAL_PRECISION: TypedContractMethod<[], [bigint], 'view'>;
	NAME: TypedContractMethod<[], [string], 'view'>;
	activePoolAddress: TypedContractMethod<[], [string], 'view'>;
	borrowerOperationsAddress: TypedContractMethod<[], [string], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	setAddresses: TypedContractMethod<[_lqtyTokenAddress: AddressLike, _lusdTokenAddress: AddressLike, _troveManagerAddress: AddressLike, _borrowerOperationsAddress: AddressLike, _activePoolAddress: AddressLike], [void], 'nonpayable'>;
	snapshots: TypedContractMethod<[arg0: AddressLike], [[bigint, bigint] & { F_ETH_Snapshot: bigint; F_LUSD_Snapshot: bigint;}], 'view'>;
	stake: TypedContractMethod<[_LQTYamount: BigNumberish], [void], 'nonpayable'>;
	stakes: TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;
	unstake: TypedContractMethod<[_LQTYamount: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `F_${Uppercase<M['eth']>}`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `F_${Uppercase<M['lusd']>}`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `getPending${Uppercase<M['eth']>}Gain`]: TypedContractMethod<[_user: AddressLike], [bigint], 'view'>;
} & {
	[K in `getPending${Uppercase<M['lusd']>}Gain`]: TypedContractMethod<[_user: AddressLike], [bigint], 'view'>;
} & {
	[K in `increaseF_${Uppercase<M['eth']>}`]: TypedContractMethod<[_ETHFee: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `increaseF_${Uppercase<M['lusd']>}`]: TypedContractMethod<[_LUSDFee: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `${M['lqty']}Token`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['lusd']}Token`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `total${Uppercase<M['lqty']>}Staked`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `${M['trove']}ManagerAddress`]: TypedContractMethod<[], [string], 'view'>;
};

type LQTYStakingTypedContractEventFilters<M extends Modifiers> = {
	'ActivePoolAddressSet(address)': TypedContractEvent<
		LQTYStaking_ActivePoolAddressSetEvent.InputTuple,
		LQTYStaking_ActivePoolAddressSetEvent.OutputTuple,
		LQTYStaking_ActivePoolAddressSetEvent.OutputObject
	>;
	'ActivePoolAddressSet': TypedContractEvent<
		LQTYStaking_ActivePoolAddressSetEvent.InputTuple,
		LQTYStaking_ActivePoolAddressSetEvent.OutputTuple,
		LQTYStaking_ActivePoolAddressSetEvent.OutputObject
	>;

	'BorrowerOperationsAddressSet(address)': TypedContractEvent<
		LQTYStaking_BorrowerOperationsAddressSetEvent.InputTuple,
		LQTYStaking_BorrowerOperationsAddressSetEvent.OutputTuple,
		LQTYStaking_BorrowerOperationsAddressSetEvent.OutputObject
	>;
	'BorrowerOperationsAddressSet': TypedContractEvent<
		LQTYStaking_BorrowerOperationsAddressSetEvent.InputTuple,
		LQTYStaking_BorrowerOperationsAddressSetEvent.OutputTuple,
		LQTYStaking_BorrowerOperationsAddressSetEvent.OutputObject
	>;

	'OwnershipTransferred(address,address)': TypedContractEvent<
		LQTYStaking_OwnershipTransferredEvent.InputTuple,
		LQTYStaking_OwnershipTransferredEvent.OutputTuple,
		LQTYStaking_OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		LQTYStaking_OwnershipTransferredEvent.InputTuple,
		LQTYStaking_OwnershipTransferredEvent.OutputTuple,
		LQTYStaking_OwnershipTransferredEvent.OutputObject
	>;

	'StakeChanged(address,uint256)': TypedContractEvent<
		LQTYStaking_StakeChangedEvent.InputTuple,
		LQTYStaking_StakeChangedEvent.OutputTuple,
		LQTYStaking_StakeChangedEvent.OutputObject
	>;
	'StakeChanged': TypedContractEvent<
		LQTYStaking_StakeChangedEvent.InputTuple,
		LQTYStaking_StakeChangedEvent.OutputTuple,
		LQTYStaking_StakeChangedEvent.OutputObject
	>;

	'StakerSnapshotsUpdated(address,uint256,uint256)': TypedContractEvent<
		LQTYStaking_StakerSnapshotsUpdatedEvent.InputTuple,
		LQTYStaking_StakerSnapshotsUpdatedEvent.OutputTuple,
		LQTYStaking_StakerSnapshotsUpdatedEvent.OutputObject
	>;
	'StakerSnapshotsUpdated': TypedContractEvent<
		LQTYStaking_StakerSnapshotsUpdatedEvent.InputTuple,
		LQTYStaking_StakerSnapshotsUpdatedEvent.OutputTuple,
		LQTYStaking_StakerSnapshotsUpdatedEvent.OutputObject
	>;

	'StakingGainsWithdrawn(address,uint256,uint256)': TypedContractEvent<
		LQTYStaking_StakingGainsWithdrawnEvent.InputTuple,
		LQTYStaking_StakingGainsWithdrawnEvent.OutputTuple,
		LQTYStaking_StakingGainsWithdrawnEvent.OutputObject
	>;
	'StakingGainsWithdrawn': TypedContractEvent<
		LQTYStaking_StakingGainsWithdrawnEvent.InputTuple,
		LQTYStaking_StakingGainsWithdrawnEvent.OutputTuple,
		LQTYStaking_StakingGainsWithdrawnEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['ether']>}Sent(address,uint256)`]: TypedContractEvent<
		LQTYStaking_EtherSentEvent.InputTuple,
		LQTYStaking_EtherSentEvent.OutputTuple,
		LQTYStaking_EtherSentEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['ether']>}Sent`]: TypedContractEvent<
		LQTYStaking_EtherSentEvent.InputTuple,
		LQTYStaking_EtherSentEvent.OutputTuple,
		LQTYStaking_EtherSentEvent.OutputObject
	>;
} & {
	[K in `F_${Uppercase<M['eth']>}Updated(uint256)`]: TypedContractEvent<
		LQTYStaking_F_ETHUpdatedEvent.InputTuple,
		LQTYStaking_F_ETHUpdatedEvent.OutputTuple,
		LQTYStaking_F_ETHUpdatedEvent.OutputObject
	>;
} & {
	[K in `F_${Uppercase<M['eth']>}Updated`]: TypedContractEvent<
		LQTYStaking_F_ETHUpdatedEvent.InputTuple,
		LQTYStaking_F_ETHUpdatedEvent.OutputTuple,
		LQTYStaking_F_ETHUpdatedEvent.OutputObject
	>;
} & {
	[K in `F_${Uppercase<M['lusd']>}Updated(uint256)`]: TypedContractEvent<
		LQTYStaking_F_LUSDUpdatedEvent.InputTuple,
		LQTYStaking_F_LUSDUpdatedEvent.OutputTuple,
		LQTYStaking_F_LUSDUpdatedEvent.OutputObject
	>;
} & {
	[K in `F_${Uppercase<M['lusd']>}Updated`]: TypedContractEvent<
		LQTYStaking_F_LUSDUpdatedEvent.InputTuple,
		LQTYStaking_F_LUSDUpdatedEvent.OutputTuple,
		LQTYStaking_F_LUSDUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}TokenAddressSet(address)`]: TypedContractEvent<
		LQTYStaking_LQTYTokenAddressSetEvent.InputTuple,
		LQTYStaking_LQTYTokenAddressSetEvent.OutputTuple,
		LQTYStaking_LQTYTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}TokenAddressSet`]: TypedContractEvent<
		LQTYStaking_LQTYTokenAddressSetEvent.InputTuple,
		LQTYStaking_LQTYTokenAddressSetEvent.OutputTuple,
		LQTYStaking_LQTYTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressSet(address)`]: TypedContractEvent<
		LQTYStaking_LUSDTokenAddressSetEvent.InputTuple,
		LQTYStaking_LUSDTokenAddressSetEvent.OutputTuple,
		LQTYStaking_LUSDTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressSet`]: TypedContractEvent<
		LQTYStaking_LUSDTokenAddressSetEvent.InputTuple,
		LQTYStaking_LUSDTokenAddressSetEvent.OutputTuple,
		LQTYStaking_LUSDTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `Total${Uppercase<M['lqty']>}StakedUpdated(uint256)`]: TypedContractEvent<
		LQTYStaking_TotalLQTYStakedUpdatedEvent.InputTuple,
		LQTYStaking_TotalLQTYStakedUpdatedEvent.OutputTuple,
		LQTYStaking_TotalLQTYStakedUpdatedEvent.OutputObject
	>;
} & {
	[K in `Total${Uppercase<M['lqty']>}StakedUpdated`]: TypedContractEvent<
		LQTYStaking_TotalLQTYStakedUpdatedEvent.InputTuple,
		LQTYStaking_TotalLQTYStakedUpdatedEvent.OutputTuple,
		LQTYStaking_TotalLQTYStakedUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressSet(address)`]: TypedContractEvent<
		LQTYStaking_TroveManagerAddressSetEvent.InputTuple,
		LQTYStaking_TroveManagerAddressSetEvent.OutputTuple,
		LQTYStaking_TroveManagerAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressSet`]: TypedContractEvent<
		LQTYStaking_TroveManagerAddressSetEvent.InputTuple,
		LQTYStaking_TroveManagerAddressSetEvent.OutputTuple,
		LQTYStaking_TroveManagerAddressSetEvent.OutputObject
	>;
};

export type LQTYStaking<M extends Modifiers> = BaseContract &
	LQTYStakingTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): LQTYStaking<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & LQTYStaking<M>>;

		interface: LQTYStakingInterface<M>;

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
		): Promise<ThisType<T> & LQTYStaking<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & LQTYStaking<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & LQTYStaking<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & LQTYStaking<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;
		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & LQTYStaking<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'DECIMAL_PRECISION'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `F_${Uppercase<M['eth']>}`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `F_${Uppercase<M['lusd']>}`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'activePoolAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'borrowerOperationsAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `getPending${Uppercase<M['eth']>}Gain`): TypedContractMethod<[_user: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `getPending${Uppercase<M['lusd']>}Gain`): TypedContractMethod<[_user: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `increaseF_${Uppercase<M['eth']>}`): TypedContractMethod<[_ETHFee: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `increaseF_${Uppercase<M['lusd']>}`): TypedContractMethod<[_LUSDFee: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: `${M['lqty']}Token`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['lusd']}Token`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_lqtyTokenAddress: AddressLike, _lusdTokenAddress: AddressLike, _troveManagerAddress: AddressLike, _borrowerOperationsAddress: AddressLike, _activePoolAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'snapshots'): TypedContractMethod<[arg0: AddressLike], [[bigint, bigint] & {F_ETH_Snapshot: bigint; F_LUSD_Snapshot: bigint;}], 'view'>;
		getFunction(nameOrSignature: 'stake'): TypedContractMethod<[_LQTYamount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'stakes'): TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `total${Uppercase<M['lqty']>}Staked`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `${M['trove']}ManagerAddress`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'unstake'): TypedContractMethod<[_LQTYamount: BigNumberish], [void], 'nonpayable'>;

		getEvent(key: 'ActivePoolAddressSet'): TypedContractEvent<LQTYStaking_ActivePoolAddressSetEvent.InputTuple, LQTYStaking_ActivePoolAddressSetEvent.OutputTuple, LQTYStaking_ActivePoolAddressSetEvent.OutputObject>;
		getEvent(key: 'BorrowerOperationsAddressSet'): TypedContractEvent<LQTYStaking_BorrowerOperationsAddressSetEvent.InputTuple, LQTYStaking_BorrowerOperationsAddressSetEvent.OutputTuple, LQTYStaking_BorrowerOperationsAddressSetEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['ether']>}Sent`): TypedContractEvent<LQTYStaking_EtherSentEvent.InputTuple, LQTYStaking_EtherSentEvent.OutputTuple, LQTYStaking_EtherSentEvent.OutputObject>;
		getEvent(key: `F_${Uppercase<M['eth']>}Updated`): TypedContractEvent<LQTYStaking_F_ETHUpdatedEvent.InputTuple, LQTYStaking_F_ETHUpdatedEvent.OutputTuple, LQTYStaking_F_ETHUpdatedEvent.OutputObject>;
		getEvent(key: `F_${Uppercase<M['lusd']>}Updated`): TypedContractEvent<LQTYStaking_F_LUSDUpdatedEvent.InputTuple, LQTYStaking_F_LUSDUpdatedEvent.OutputTuple, LQTYStaking_F_LUSDUpdatedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lqty']>}TokenAddressSet`): TypedContractEvent<LQTYStaking_LQTYTokenAddressSetEvent.InputTuple, LQTYStaking_LQTYTokenAddressSetEvent.OutputTuple, LQTYStaking_LQTYTokenAddressSetEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lusd']>}TokenAddressSet`): TypedContractEvent<LQTYStaking_LUSDTokenAddressSetEvent.InputTuple, LQTYStaking_LUSDTokenAddressSetEvent.OutputTuple, LQTYStaking_LUSDTokenAddressSetEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<LQTYStaking_OwnershipTransferredEvent.InputTuple, LQTYStaking_OwnershipTransferredEvent.OutputTuple, LQTYStaking_OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'StakeChanged'): TypedContractEvent<LQTYStaking_StakeChangedEvent.InputTuple, LQTYStaking_StakeChangedEvent.OutputTuple, LQTYStaking_StakeChangedEvent.OutputObject>;
		getEvent(key: 'StakerSnapshotsUpdated'): TypedContractEvent<LQTYStaking_StakerSnapshotsUpdatedEvent.InputTuple, LQTYStaking_StakerSnapshotsUpdatedEvent.OutputTuple, LQTYStaking_StakerSnapshotsUpdatedEvent.OutputObject>;
		getEvent(key: 'StakingGainsWithdrawn'): TypedContractEvent<LQTYStaking_StakingGainsWithdrawnEvent.InputTuple, LQTYStaking_StakingGainsWithdrawnEvent.OutputTuple, LQTYStaking_StakingGainsWithdrawnEvent.OutputObject>;
		getEvent(key: `Total${Uppercase<M['lqty']>}StakedUpdated`): TypedContractEvent<LQTYStaking_TotalLQTYStakedUpdatedEvent.InputTuple, LQTYStaking_TotalLQTYStakedUpdatedEvent.OutputTuple, LQTYStaking_TotalLQTYStakedUpdatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}ManagerAddressSet`): TypedContractEvent<LQTYStaking_TroveManagerAddressSetEvent.InputTuple, LQTYStaking_TroveManagerAddressSetEvent.OutputTuple, LQTYStaking_TroveManagerAddressSetEvent.OutputObject>;

		filters: LQTYStakingTypedContractEventFilters<M>;
	};
