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

export namespace ActivePoolAddressSetEvent {
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

export namespace BorrowerOperationsAddressSetEvent {
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

export namespace EtherSentEvent {
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

export namespace F_ETHUpdatedEvent {
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

export namespace F_LUSDUpdatedEvent {
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

export namespace LQTYTokenAddressSetEvent {
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

export namespace LUSDTokenAddressSetEvent {
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

export namespace StakeChangedEvent {
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

export namespace StakerSnapshotsUpdatedEvent {
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

export namespace StakingGainsWithdrawnEvent {
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

export namespace TotalLQTYStakedUpdatedEvent {
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

export namespace TroveManagerAddressSetEvent {
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
		ActivePoolAddressSetEvent.InputTuple,
		ActivePoolAddressSetEvent.OutputTuple,
		ActivePoolAddressSetEvent.OutputObject
	>;
	'ActivePoolAddressSet': TypedContractEvent<
		ActivePoolAddressSetEvent.InputTuple,
		ActivePoolAddressSetEvent.OutputTuple,
		ActivePoolAddressSetEvent.OutputObject
	>;

	'BorrowerOperationsAddressSet(address)': TypedContractEvent<
		BorrowerOperationsAddressSetEvent.InputTuple,
		BorrowerOperationsAddressSetEvent.OutputTuple,
		BorrowerOperationsAddressSetEvent.OutputObject
	>;
	'BorrowerOperationsAddressSet': TypedContractEvent<
		BorrowerOperationsAddressSetEvent.InputTuple,
		BorrowerOperationsAddressSetEvent.OutputTuple,
		BorrowerOperationsAddressSetEvent.OutputObject
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

	'StakeChanged(address,uint256)': TypedContractEvent<
		StakeChangedEvent.InputTuple,
		StakeChangedEvent.OutputTuple,
		StakeChangedEvent.OutputObject
	>;
	'StakeChanged': TypedContractEvent<
		StakeChangedEvent.InputTuple,
		StakeChangedEvent.OutputTuple,
		StakeChangedEvent.OutputObject
	>;

	'StakerSnapshotsUpdated(address,uint256,uint256)': TypedContractEvent<
		StakerSnapshotsUpdatedEvent.InputTuple,
		StakerSnapshotsUpdatedEvent.OutputTuple,
		StakerSnapshotsUpdatedEvent.OutputObject
	>;
	'StakerSnapshotsUpdated': TypedContractEvent<
		StakerSnapshotsUpdatedEvent.InputTuple,
		StakerSnapshotsUpdatedEvent.OutputTuple,
		StakerSnapshotsUpdatedEvent.OutputObject
	>;

	'StakingGainsWithdrawn(address,uint256,uint256)': TypedContractEvent<
		StakingGainsWithdrawnEvent.InputTuple,
		StakingGainsWithdrawnEvent.OutputTuple,
		StakingGainsWithdrawnEvent.OutputObject
	>;
	'StakingGainsWithdrawn': TypedContractEvent<
		StakingGainsWithdrawnEvent.InputTuple,
		StakingGainsWithdrawnEvent.OutputTuple,
		StakingGainsWithdrawnEvent.OutputObject
	>;
} & {
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
	[K in `F_${Uppercase<M['eth']>}Updated(uint256)`]: TypedContractEvent<
		F_ETHUpdatedEvent.InputTuple,
		F_ETHUpdatedEvent.OutputTuple,
		F_ETHUpdatedEvent.OutputObject
	>;
} & {
	[K in `F_${Uppercase<M['eth']>}Updated`]: TypedContractEvent<
		F_ETHUpdatedEvent.InputTuple,
		F_ETHUpdatedEvent.OutputTuple,
		F_ETHUpdatedEvent.OutputObject
	>;
} & {
	[K in `F_${Uppercase<M['lusd']>}Updated(uint256)`]: TypedContractEvent<
		F_LUSDUpdatedEvent.InputTuple,
		F_LUSDUpdatedEvent.OutputTuple,
		F_LUSDUpdatedEvent.OutputObject
	>;
} & {
	[K in `F_${Uppercase<M['lusd']>}Updated`]: TypedContractEvent<
		F_LUSDUpdatedEvent.InputTuple,
		F_LUSDUpdatedEvent.OutputTuple,
		F_LUSDUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}TokenAddressSet(address)`]: TypedContractEvent<
		LQTYTokenAddressSetEvent.InputTuple,
		LQTYTokenAddressSetEvent.OutputTuple,
		LQTYTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}TokenAddressSet`]: TypedContractEvent<
		LQTYTokenAddressSetEvent.InputTuple,
		LQTYTokenAddressSetEvent.OutputTuple,
		LQTYTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressSet(address)`]: TypedContractEvent<
		LUSDTokenAddressSetEvent.InputTuple,
		LUSDTokenAddressSetEvent.OutputTuple,
		LUSDTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressSet`]: TypedContractEvent<
		LUSDTokenAddressSetEvent.InputTuple,
		LUSDTokenAddressSetEvent.OutputTuple,
		LUSDTokenAddressSetEvent.OutputObject
	>;
} & {
	[K in `Total${Uppercase<M['lqty']>}StakedUpdated(uint256)`]: TypedContractEvent<
		TotalLQTYStakedUpdatedEvent.InputTuple,
		TotalLQTYStakedUpdatedEvent.OutputTuple,
		TotalLQTYStakedUpdatedEvent.OutputObject
	>;
} & {
	[K in `Total${Uppercase<M['lqty']>}StakedUpdated`]: TypedContractEvent<
		TotalLQTYStakedUpdatedEvent.InputTuple,
		TotalLQTYStakedUpdatedEvent.OutputTuple,
		TotalLQTYStakedUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressSet(address)`]: TypedContractEvent<
		TroveManagerAddressSetEvent.InputTuple,
		TroveManagerAddressSetEvent.OutputTuple,
		TroveManagerAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressSet`]: TypedContractEvent<
		TroveManagerAddressSetEvent.InputTuple,
		TroveManagerAddressSetEvent.OutputTuple,
		TroveManagerAddressSetEvent.OutputObject
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
		getFunction(nameOrSignature: 'F_ETH'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'F_LUSD'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'activePoolAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'borrowerOperationsAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'getPendingETHGain'): TypedContractMethod<[_user: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getPendingLUSDGain'): TypedContractMethod<[_user: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'increaseF_ETH'): TypedContractMethod<[_ETHFee: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'increaseF_LUSD'): TypedContractMethod<[_LUSDFee: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: 'lqtyToken'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'lusdToken'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_lqtyTokenAddress: AddressLike, _lusdTokenAddress: AddressLike, _troveManagerAddress: AddressLike, _borrowerOperationsAddress: AddressLike, _activePoolAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'snapshots'): TypedContractMethod<[arg0: AddressLike], [[bigint, bigint] & {F_ETH_Snapshot: bigint; F_LUSD_Snapshot: bigint;}], 'view'>;
		getFunction(nameOrSignature: 'stake'): TypedContractMethod<[_LQTYamount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'stakes'): TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'totalLQTYStaked'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'troveManagerAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'unstake'): TypedContractMethod<[_LQTYamount: BigNumberish], [void], 'nonpayable'>;

		getEvent(key: 'ActivePoolAddressSet'): TypedContractEvent<ActivePoolAddressSetEvent.InputTuple, ActivePoolAddressSetEvent.OutputTuple, ActivePoolAddressSetEvent.OutputObject>;
		getEvent(key: 'BorrowerOperationsAddressSet'): TypedContractEvent<BorrowerOperationsAddressSetEvent.InputTuple, BorrowerOperationsAddressSetEvent.OutputTuple, BorrowerOperationsAddressSetEvent.OutputObject>;
		getEvent(key: 'EtherSent'): TypedContractEvent<EtherSentEvent.InputTuple, EtherSentEvent.OutputTuple, EtherSentEvent.OutputObject>;
		getEvent(key: 'F_ETHUpdated'): TypedContractEvent<F_ETHUpdatedEvent.InputTuple, F_ETHUpdatedEvent.OutputTuple, F_ETHUpdatedEvent.OutputObject>;
		getEvent(key: 'F_LUSDUpdated'): TypedContractEvent<F_LUSDUpdatedEvent.InputTuple, F_LUSDUpdatedEvent.OutputTuple, F_LUSDUpdatedEvent.OutputObject>;
		getEvent(key: 'LQTYTokenAddressSet'): TypedContractEvent<LQTYTokenAddressSetEvent.InputTuple, LQTYTokenAddressSetEvent.OutputTuple, LQTYTokenAddressSetEvent.OutputObject>;
		getEvent(key: 'LUSDTokenAddressSet'): TypedContractEvent<LUSDTokenAddressSetEvent.InputTuple, LUSDTokenAddressSetEvent.OutputTuple, LUSDTokenAddressSetEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'StakeChanged'): TypedContractEvent<StakeChangedEvent.InputTuple, StakeChangedEvent.OutputTuple, StakeChangedEvent.OutputObject>;
		getEvent(key: 'StakerSnapshotsUpdated'): TypedContractEvent<StakerSnapshotsUpdatedEvent.InputTuple, StakerSnapshotsUpdatedEvent.OutputTuple, StakerSnapshotsUpdatedEvent.OutputObject>;
		getEvent(key: 'StakingGainsWithdrawn'): TypedContractEvent<StakingGainsWithdrawnEvent.InputTuple, StakingGainsWithdrawnEvent.OutputTuple, StakingGainsWithdrawnEvent.OutputObject>;
		getEvent(key: 'TotalLQTYStakedUpdated'): TypedContractEvent<TotalLQTYStakedUpdatedEvent.InputTuple, TotalLQTYStakedUpdatedEvent.OutputTuple, TotalLQTYStakedUpdatedEvent.OutputObject>;
		getEvent(key: 'TroveManagerAddressSet'): TypedContractEvent<TroveManagerAddressSetEvent.InputTuple, TroveManagerAddressSetEvent.OutputTuple, TroveManagerAddressSetEvent.OutputObject>;

		filters: LQTYStakingTypedContractEventFilters<M>;
	};
