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

type TroveManagerFunctionNameOrSignature<M extends Modifiers> =
	| 'BETA'
	| 'BOOTSTRAP_PERIOD'
	| 'BORROWING_FEE_FLOOR'
	| 'CCR'
	| 'DECIMAL_PRECISION'
	| `${Uppercase<M['lusd']>}_GAS_COMPENSATION`
	| `L_${Uppercase<M['eth']>}`
	| `L_${Uppercase<M['lusd']>}Debt`
	| 'MAX_BORROWING_FEE'
	| 'MCR'
	| 'MINUTE_DECAY_FACTOR'
	| 'MIN_NET_DEBT'
	| 'NAME'
	| 'PERCENT_DIVISOR'
	| 'REDEMPTION_FEE_FLOOR'
	| 'SECONDS_IN_ONE_MINUTE'
	| `${Capitalize<M['trove']>}Owners`
	| `${Capitalize<M['trove']>}s`
	| '_100pct'
	| 'activePool'
	| `add${Capitalize<M['trove']>}OwnerToArray`
	| 'applyPendingRewards'
	| 'baseRate'
	| `batchLiquidate${Capitalize<M['trove']>}s`
	| 'borrowerOperationsAddress'
	| 'checkRecoveryMode'
	| `close${Capitalize<M['trove']>}`
	| 'decayBaseRateFromBorrowing'
	| `decrease${Capitalize<M['trove']>}Coll`
	| `decrease${Capitalize<M['trove']>}Debt`
	| 'defaultPool'
	| 'getBorrowingFee'
	| 'getBorrowingFeeWithDecay'
	| 'getBorrowingRate'
	| 'getBorrowingRateWithDecay'
	| 'getCurrentICR'
	| 'getEntireDebtAndColl'
	| 'getEntireSystemColl'
	| 'getEntireSystemDebt'
	| 'getNominalICR'
	| `getPending${Uppercase<M['eth']>}Reward`
	| `getPending${Uppercase<M['lusd']>}DebtReward`
	| 'getRedemptionFeeWithDecay'
	| 'getRedemptionRate'
	| 'getRedemptionRateWithDecay'
	| 'getTCR'
	| `get${Capitalize<M['trove']>}Coll`
	| `get${Capitalize<M['trove']>}Debt`
	| `get${Capitalize<M['trove']>}From${Capitalize<M['trove']>}OwnersArray`
	| `get${Capitalize<M['trove']>}OwnersCount`
	| `get${Capitalize<M['trove']>}Stake`
	| `get${Capitalize<M['trove']>}Status`
	| 'hasPendingRewards'
	| `increase${Capitalize<M['trove']>}Coll`
	| `increase${Capitalize<M['trove']>}Debt`
	| 'isOwner'
	| `last${Uppercase<M['eth']>}Error_Redistribution`
	| 'lastFeeOperationTime'
	| `last${Uppercase<M['lusd']>}DebtError_Redistribution`
	| 'liquidate'
	| `liquidate${Capitalize<M['trove']>}s`
	| `${M['lqty']}Staking`
	| `${M['lqty']}Token`
	| `${M['lusd']}Token`
	| 'owner'
	| 'priceFeed'
	| 'redeemCollateral'
	| 'removeStake'
	| 'rewardSnapshots'
	| 'setAddresses'
	| `set${Capitalize<M['trove']>}Status`
	| `sorted${Capitalize<M['trove']>}s`
	| 'stabilityPool'
	| 'totalCollateralSnapshot'
	| 'totalStakes'
	| 'totalStakesSnapshot'
	| 'updateStakeAndTotalStakes'
	| `update${Capitalize<M['trove']>}RewardSnapshots`

type TroveManagerEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'ActivePoolAddressChanged'
	| 'BaseRateUpdated'
	| 'BorrowerOperationsAddressChanged'
	| 'CollSurplusPoolAddressChanged'
	| 'DefaultPoolAddressChanged'
	| 'GasPoolAddressChanged'
	| `${Uppercase<M['lqty']>}StakingAddressChanged`
	| `${Uppercase<M['lqty']>}TokenAddressChanged`
	| 'LTermsUpdated'
	| `${Uppercase<M['lusd']>}TokenAddressChanged`
	| 'LastFeeOpTimeUpdated'
	| 'Liquidation'
	| 'OwnershipTransferred'
	| 'PriceFeedAddressChanged'
	| 'Redemption'
	| `Sorted${Capitalize<M['trove']>}sAddressChanged`
	| 'StabilityPoolAddressChanged'
	| 'SystemSnapshotsUpdated'
	| 'TotalStakesUpdated'
	| `${Capitalize<M['trove']>}IndexUpdated`
	| `${Capitalize<M['trove']>}Liquidated`
	| `${Capitalize<M['trove']>}SnapshotsUpdated`
	| `${Capitalize<M['trove']>}Updated`


export interface TroveManagerInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: TroveManagerFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: TroveManagerEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'BETA', values?: undefined): string;
	encodeFunctionData(functionFragment: 'BOOTSTRAP_PERIOD', values?: undefined): string;
	encodeFunctionData(functionFragment: 'BORROWING_FEE_FLOOR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'CCR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'DECIMAL_PRECISION', values?: undefined): string;
	encodeFunctionData(functionFragment: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`, values?: undefined): string;
	encodeFunctionData(functionFragment: `L_${Uppercase<M['eth']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: `L_${Uppercase<M['lusd']>}Debt`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'MAX_BORROWING_FEE', values?: undefined): string;
	encodeFunctionData(functionFragment: 'MCR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'MINUTE_DECAY_FACTOR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'MIN_NET_DEBT', values?: undefined): string;
	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'PERCENT_DIVISOR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'REDEMPTION_FEE_FLOOR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'SECONDS_IN_ONE_MINUTE', values?: undefined): string;
	encodeFunctionData(functionFragment: `${Capitalize<M['trove']>}Owners`, values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: `${Capitalize<M['trove']>}s`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: '_100pct', values?: undefined): string;
	encodeFunctionData(functionFragment: 'activePool', values?: undefined): string;
	encodeFunctionData(functionFragment: `add${Capitalize<M['trove']>}OwnerToArray`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'applyPendingRewards', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'baseRate', values?: undefined): string;
	encodeFunctionData(functionFragment: `batchLiquidate${Capitalize<M['trove']>}s`, values: [AddressLike[]]): string;
	encodeFunctionData(functionFragment: 'borrowerOperationsAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'checkRecoveryMode', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: `close${Capitalize<M['trove']>}`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'decayBaseRateFromBorrowing', values?: undefined): string;
	encodeFunctionData(functionFragment: `decrease${Capitalize<M['trove']>}Coll`, values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: `decrease${Capitalize<M['trove']>}Debt`, values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'defaultPool', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getBorrowingFee', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'getBorrowingFeeWithDecay', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'getBorrowingRate', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getBorrowingRateWithDecay', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getCurrentICR', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'getEntireDebtAndColl', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'getEntireSystemColl', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getEntireSystemDebt', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getNominalICR', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `getPending${Uppercase<M['eth']>}Reward`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `getPending${Uppercase<M['lusd']>}DebtReward`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'getRedemptionFeeWithDecay', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'getRedemptionRate', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getRedemptionRateWithDecay', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getTCR', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: `get${Capitalize<M['trove']>}Coll`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `get${Capitalize<M['trove']>}Debt`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `get${Capitalize<M['trove']>}From${Capitalize<M['trove']>}OwnersArray`, values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: `get${Capitalize<M['trove']>}OwnersCount`, values?: undefined): string;
	encodeFunctionData(functionFragment: `get${Capitalize<M['trove']>}Stake`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `get${Capitalize<M['trove']>}Status`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'hasPendingRewards', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `increase${Capitalize<M['trove']>}Coll`, values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: `increase${Capitalize<M['trove']>}Debt`, values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: `last${Uppercase<M['eth']>}Error_Redistribution`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'lastFeeOperationTime', values?: undefined): string;
	encodeFunctionData(functionFragment: `last${Uppercase<M['lusd']>}DebtError_Redistribution`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'liquidate', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `liquidate${Capitalize<M['trove']>}s`, values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: `${M['lqty']}Staking`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lqty']}Token`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lusd']}Token`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'priceFeed', values?: undefined): string;
	encodeFunctionData(functionFragment: 'redeemCollateral', values: [ BigNumberish, AddressLike, AddressLike, AddressLike, BigNumberish, BigNumberish, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'removeStake', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'rewardSnapshots', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'setAddresses', values: [ AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `set${Capitalize<M['trove']>}Status`, values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: `sorted${Capitalize<M['trove']>}s`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'stabilityPool', values?: undefined): string;
	encodeFunctionData(functionFragment: 'totalCollateralSnapshot', values?: undefined): string;
	encodeFunctionData(functionFragment: 'totalStakes', values?: undefined): string;
	encodeFunctionData(functionFragment: 'totalStakesSnapshot', values?: undefined): string;
	encodeFunctionData(functionFragment: 'updateStakeAndTotalStakes', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `update${Capitalize<M['trove']>}RewardSnapshots`, values: [AddressLike]): string;

	decodeFunctionResult(functionFragment: 'BETA', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'BOOTSTRAP_PERIOD', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'BORROWING_FEE_FLOOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'CCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'DECIMAL_PRECISION', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `L_${Uppercase<M['eth']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `L_${Uppercase<M['lusd']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MAX_BORROWING_FEE', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MINUTE_DECAY_FACTOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MIN_NET_DEBT', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'PERCENT_DIVISOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'REDEMPTION_FEE_FLOOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'SECONDS_IN_ONE_MINUTE', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${Capitalize<M['trove']>}Owners`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${Capitalize<M['trove']>}s`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: '_100pct', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'activePool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `add${Capitalize<M['trove']>}OwnerToArray`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'applyPendingRewards', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'baseRate', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `batchLiquidate${Capitalize<M['trove']>}s`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'borrowerOperationsAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'checkRecoveryMode', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `close${Capitalize<M['trove']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'decayBaseRateFromBorrowing', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `decrease${Capitalize<M['trove']>}Coll`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `decrease${Capitalize<M['trove']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'defaultPool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getBorrowingFee', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getBorrowingFeeWithDecay', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getBorrowingRate', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getBorrowingRateWithDecay', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getCurrentICR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getEntireDebtAndColl', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getEntireSystemColl', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getEntireSystemDebt', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getNominalICR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `getPending${Uppercase<M['eth']>}Reward`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `getPending${Uppercase<M['lusd']>}DebtReward`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getRedemptionFeeWithDecay', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getRedemptionRate', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getRedemptionRateWithDecay', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getTCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Capitalize<M['trove']>}Coll`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Capitalize<M['trove']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Capitalize<M['trove']>}From${Capitalize<M['trove']>}OwnersArray`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Capitalize<M['trove']>}OwnersCount`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Capitalize<M['trove']>}Stake`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Capitalize<M['trove']>}Status`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'hasPendingRewards', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `increase${Capitalize<M['trove']>}Coll`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `increase${Capitalize<M['trove']>}Debt`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `last${Uppercase<M['eth']>}Error_Redistribution`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'lastFeeOperationTime', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `last${Uppercase<M['lusd']>}DebtError_Redistribution`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'liquidate', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `liquidate${Capitalize<M['trove']>}s`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lqty']}Staking`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lqty']}Token`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lusd']}Token`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'priceFeed', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'redeemCollateral', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'removeStake', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'rewardSnapshots', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `set${Capitalize<M['trove']>}Status`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `sorted${Capitalize<M['trove']>}s`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'stabilityPool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'totalCollateralSnapshot', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'totalStakes', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'totalStakesSnapshot', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'updateStakeAndTotalStakes', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `update${Capitalize<M['trove']>}RewardSnapshots`, data: BytesLike): Result;
}

export namespace TroveManager_ActivePoolAddressChangedEvent {
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

export namespace TroveManager_BaseRateUpdatedEvent {
	export type InputTuple = [_baseRate: BigNumberish];
	export type OutputTuple = [_baseRate: bigint];
	export interface OutputObject {
		_baseRate: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_BorrowerOperationsAddressChangedEvent {
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

export namespace TroveManager_CollSurplusPoolAddressChangedEvent {
	export type InputTuple = [_collSurplusPoolAddress: AddressLike];
	export type OutputTuple = [_collSurplusPoolAddress: string];
	export interface OutputObject {
		_collSurplusPoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_DefaultPoolAddressChangedEvent {
	export type InputTuple = [_defaultPoolAddress: AddressLike];
	export type OutputTuple = [_defaultPoolAddress: string];
	export interface OutputObject {
		_defaultPoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_GasPoolAddressChangedEvent {
	export type InputTuple = [_gasPoolAddress: AddressLike];
	export type OutputTuple = [_gasPoolAddress: string];
	export interface OutputObject {
		_gasPoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_LQTYStakingAddressChangedEvent {
	export type InputTuple = [_lqtyStakingAddress: AddressLike];
	export type OutputTuple = [_lqtyStakingAddress: string];
	export interface OutputObject {
		_lqtyStakingAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_LQTYTokenAddressChangedEvent {
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

export namespace TroveManager_LTermsUpdatedEvent {
	export type InputTuple = [_L_ETH: BigNumberish, _L_LUSDDebt: BigNumberish];
	export type OutputTuple = [_L_ETH: bigint, _L_LUSDDebt: bigint];
	export interface OutputObject {
		_L_ETH: bigint;
		_L_LUSDDebt: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_LUSDTokenAddressChangedEvent {
	export type InputTuple = [_newLUSDTokenAddress: AddressLike];
	export type OutputTuple = [_newLUSDTokenAddress: string];
	export interface OutputObject {
		_newLUSDTokenAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_LastFeeOpTimeUpdatedEvent {
	export type InputTuple = [_lastFeeOpTime: BigNumberish];
	export type OutputTuple = [_lastFeeOpTime: bigint];
	export interface OutputObject {
		_lastFeeOpTime: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_LiquidationEvent {
	export type InputTuple = [_liquidatedDebt: BigNumberish, _liquidatedColl: BigNumberish, _collGasCompensation: BigNumberish, _LUSDGasCompensation: BigNumberish];
	export type OutputTuple = [_liquidatedDebt: bigint, _liquidatedColl: bigint, _collGasCompensation: bigint, _LUSDGasCompensation: bigint
	];
	export interface OutputObject {
		_liquidatedDebt: bigint;
		_liquidatedColl: bigint;
		_collGasCompensation: bigint;
		_LUSDGasCompensation: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_OwnershipTransferredEvent {
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

export namespace TroveManager_PriceFeedAddressChangedEvent {
	export type InputTuple = [_newPriceFeedAddress: AddressLike];
	export type OutputTuple = [_newPriceFeedAddress: string];
	export interface OutputObject {
		_newPriceFeedAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_RedemptionEvent {
	export type InputTuple = [_attemptedLUSDAmount: BigNumberish, _actualLUSDAmount: BigNumberish, _ETHSent: BigNumberish, _ETHFee: BigNumberish];
	export type OutputTuple = [_attemptedLUSDAmount: bigint, _actualLUSDAmount: bigint, _ETHSent: bigint, _ETHFee: bigint];
	export interface OutputObject {
		_attemptedLUSDAmount: bigint;
		_actualLUSDAmount: bigint;
		_ETHSent: bigint;
		_ETHFee: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_SortedTrovesAddressChangedEvent {
	export type InputTuple = [_sortedTrovesAddress: AddressLike];
	export type OutputTuple = [_sortedTrovesAddress: string];
	export interface OutputObject {
		_sortedTrovesAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_StabilityPoolAddressChangedEvent {
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

export namespace TroveManager_SystemSnapshotsUpdatedEvent {
	export type InputTuple = [_totalStakesSnapshot: BigNumberish, _totalCollateralSnapshot: BigNumberish];
	export type OutputTuple = [_totalStakesSnapshot: bigint, _totalCollateralSnapshot: bigint];
	export interface OutputObject {
		_totalStakesSnapshot: bigint;
		_totalCollateralSnapshot: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_TotalStakesUpdatedEvent {
	export type InputTuple = [_newTotalStakes: BigNumberish];
	export type OutputTuple = [_newTotalStakes: bigint];
	export interface OutputObject {
		_newTotalStakes: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_TroveIndexUpdatedEvent {
	export type InputTuple = [_borrower: AddressLike, _newIndex: BigNumberish];
	export type OutputTuple = [_borrower: string, _newIndex: bigint];
	export interface OutputObject {
		_borrower: string;
		_newIndex: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_TroveLiquidatedEvent {
	export type InputTuple = [_borrower: AddressLike, _debt: BigNumberish, _coll: BigNumberish, _operation: BigNumberish];
	export type OutputTuple = [_borrower: string, _debt: bigint, _coll: bigint, _operation: bigint];
	export interface OutputObject {
		_borrower: string;
		_debt: bigint;
		_coll: bigint;
		_operation: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_TroveSnapshotsUpdatedEvent {
	export type InputTuple = [_L_ETH: BigNumberish, _L_LUSDDebt: BigNumberish];
	export type OutputTuple = [_L_ETH: bigint, _L_LUSDDebt: bigint];
	export interface OutputObject {
		_L_ETH: bigint;
		_L_LUSDDebt: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace TroveManager_TroveUpdatedEvent {
	export type InputTuple = [_borrower: AddressLike, _debt: BigNumberish, _coll: BigNumberish, _stake: BigNumberish, _operation: BigNumberish];
	export type OutputTuple = [_borrower: string, _debt: bigint, _coll: bigint, _stake: bigint, _operation: bigint];
	export interface OutputObject {
		_borrower: string;
		_debt: bigint;
		_coll: bigint;
		_stake: bigint;
		_operation: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

type TroveManagerTypedContractMethods<M extends Modifiers> = {
	BETA: TypedContractMethod<[], [bigint], 'view'>;
	BOOTSTRAP_PERIOD: TypedContractMethod<[], [bigint], 'view'>;
	BORROWING_FEE_FLOOR: TypedContractMethod<[], [bigint], 'view'>;
	CCR: TypedContractMethod<[], [bigint], 'view'>;
	DECIMAL_PRECISION: TypedContractMethod<[], [bigint], 'view'>;
	MAX_BORROWING_FEE: TypedContractMethod<[], [bigint], 'view'>;
	MCR: TypedContractMethod<[], [bigint], 'view'>;
	MINUTE_DECAY_FACTOR: TypedContractMethod<[], [bigint], 'view'>;
	MIN_NET_DEBT: TypedContractMethod<[], [bigint], 'view'>;
	NAME: TypedContractMethod<[], [string], 'view'>;
	PERCENT_DIVISOR: TypedContractMethod<[], [bigint], 'view'>;
	REDEMPTION_FEE_FLOOR: TypedContractMethod<[], [bigint], 'view'>;
	SECONDS_IN_ONE_MINUTE: TypedContractMethod<[], [bigint], 'view'>;
	_100pct: TypedContractMethod<[], [bigint], 'view'>;
	activePool: TypedContractMethod<[], [string], 'view'>;
	applyPendingRewards: TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;
	baseRate: TypedContractMethod<[], [bigint], 'view'>;
	borrowerOperationsAddress: TypedContractMethod<[], [string], 'view'>;
	checkRecoveryMode: TypedContractMethod<[_price: BigNumberish], [boolean], 'view'>;
	decayBaseRateFromBorrowing: TypedContractMethod<[], [void], 'nonpayable'>;
	defaultPool: TypedContractMethod<[], [string], 'view'>;
	getBorrowingFee: TypedContractMethod<[_LUSDDebt: BigNumberish], [bigint], 'view'>;
	getBorrowingFeeWithDecay: TypedContractMethod<[_LUSDDebt: BigNumberish], [bigint], 'view'>;
	getBorrowingRate: TypedContractMethod<[], [bigint], 'view'>;
	getBorrowingRateWithDecay: TypedContractMethod<[], [bigint], 'view'>;
	getCurrentICR: TypedContractMethod<[_borrower: AddressLike, _price: BigNumberish], [bigint], 'view'>;
	getEntireDebtAndColl: TypedContractMethod<[_borrower: AddressLike], [[bigint, bigint, bigint, bigint] & {debt: bigint; coll: bigint; pendingLUSDDebtReward: bigint; pendingETHReward: bigint;}], 'view'>;
	getEntireSystemColl: TypedContractMethod<[], [bigint], 'view'>;
	getEntireSystemDebt: TypedContractMethod<[], [bigint], 'view'>;
	getNominalICR: TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
	getRedemptionFeeWithDecay: TypedContractMethod<[_ETHDrawn: BigNumberish], [bigint], 'view'>;
	getRedemptionRate: TypedContractMethod<[], [bigint], 'view'>;
	getRedemptionRateWithDecay: TypedContractMethod<[], [bigint], 'view'>;
	getTCR: TypedContractMethod<[_price: BigNumberish], [bigint], 'view'>;
	hasPendingRewards: TypedContractMethod<[_borrower: AddressLike], [boolean], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	lastFeeOperationTime: TypedContractMethod<[], [bigint], 'view'>;
	liquidate: TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	priceFeed: TypedContractMethod<[], [string], 'view'>;
	redeemCollateral: TypedContractMethod<[_LUSDamount: BigNumberish, _firstRedemptionHint: AddressLike, _upperPartialRedemptionHint: AddressLike, _lowerPartialRedemptionHint: AddressLike, _partialRedemptionHintNICR: BigNumberish, _maxIterations: BigNumberish, _maxFeePercentage: BigNumberish], [void], 'nonpayable'>;
	removeStake: TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;
	rewardSnapshots: TypedContractMethod<[arg0: AddressLike], [[bigint, bigint] & { ETH: bigint; LUSDDebt: bigint }], 'view'>;
	setAddresses: TypedContractMethod<[_borrowerOperationsAddress: AddressLike, _activePoolAddress: AddressLike, _defaultPoolAddress: AddressLike, _stabilityPoolAddress: AddressLike, _gasPoolAddress: AddressLike, _collSurplusPoolAddress: AddressLike, _priceFeedAddress: AddressLike, _lusdTokenAddress: AddressLike, _sortedTrovesAddress: AddressLike, _lqtyTokenAddress: AddressLike, _lqtyStakingAddress: AddressLike], [void], 'nonpayable'>;
	stabilityPool: TypedContractMethod<[], [string], 'view'>;
	totalCollateralSnapshot: TypedContractMethod<[], [bigint], 'view'>;
	totalStakes: TypedContractMethod<[], [bigint], 'view'>;
	totalStakesSnapshot: TypedContractMethod<[], [bigint], 'view'>;
	updateStakeAndTotalStakes: TypedContractMethod<[_borrower: AddressLike], [bigint], 'nonpayable'>;
} & {
	[K in `${Uppercase<M['lusd']>}_GAS_COMPENSATION`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `L_${Uppercase<M['eth']>}`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `L_${Uppercase<M['lusd']>}Debt`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `${Capitalize<M['trove']>}Owners`]: TypedContractMethod<[arg0: BigNumberish], [string], 'view'>;
} & {
	[K in `${Capitalize<M['trove']>}s`]: TypedContractMethod<[arg0: AddressLike], [[bigint, bigint, bigint, bigint, bigint] & {debt: bigint; coll: bigint; stake: bigint; status: bigint; arrayIndex: bigint;} ], 'view'>;
} & {
	[K in `add${Capitalize<M['trove']>}OwnerToArray`]: TypedContractMethod<[_borrower: AddressLike], [bigint], 'nonpayable'>;
} & {
	[K in `batchLiquidate${Capitalize<M['trove']>}s`]: TypedContractMethod<[_troveArray: AddressLike[]], [void], 'nonpayable'>;
} & {
	[K in `close${Capitalize<M['trove']>}`]: TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;
} & {
	[K in `decrease${Capitalize<M['trove']>}Coll`]: TypedContractMethod<[_borrower: AddressLike, _collDecrease: BigNumberish], [bigint], 'nonpayable'>;
} & {
	[K in `decrease${Capitalize<M['trove']>}Debt`]: TypedContractMethod<[_borrower: AddressLike, _debtDecrease: BigNumberish], [bigint], 'nonpayable'>;
} & {
	[K in `getPending${Uppercase<M['eth']>}Reward`]: TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
} & {
	[K in `getPending${Uppercase<M['lusd']>}DebtReward`]: TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
} & {
	[K in `get${Capitalize<M['trove']>}Coll`]: TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
} & {
	[K in `get${Capitalize<M['trove']>}Debt`]: TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
} & {
	[K in `get${Capitalize<M['trove']>}From${Capitalize<M['trove']>}OwnersArray`]: TypedContractMethod<[_index: BigNumberish], [string], 'view'>;
} & {
	[K in `get${Capitalize<M['trove']>}OwnersCount`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `get${Capitalize<M['trove']>}Stake`]: TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
} & {
	[K in `get${Capitalize<M['trove']>}Status`]: TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
} & {
	[K in `increase${Capitalize<M['trove']>}Coll`]: TypedContractMethod<[_borrower: AddressLike, _collIncrease: BigNumberish], [bigint], 'nonpayable'>;
} & {
	[K in `increase${Capitalize<M['trove']>}Debt`]: TypedContractMethod<[_borrower: AddressLike, _debtIncrease: BigNumberish], [bigint], 'nonpayable'>;
} & {
	[K in `last${Uppercase<M['eth']>}Error_Redistribution`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `last${Uppercase<M['lusd']>}DebtError_Redistribution`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `liquidate${Capitalize<M['trove']>}s`]: TypedContractMethod<[_n: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `${M['lqty']}Staking`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['lqty']}Token`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['lusd']}Token`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `set${Capitalize<M['trove']>}Status`]: TypedContractMethod<[_borrower: AddressLike, _num: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `sorted${Capitalize<M['trove']>}s`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `update${Capitalize<M['trove']>}RewardSnapshots`]: TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;
};

type TroveManagerTypedContractEventFilters<M extends Modifiers> = {
	'ActivePoolAddressChanged(address)': TypedContractEvent<
		TroveManager_ActivePoolAddressChangedEvent.InputTuple,
		TroveManager_ActivePoolAddressChangedEvent.OutputTuple,
		TroveManager_ActivePoolAddressChangedEvent.OutputObject
	>;
	'ActivePoolAddressChanged': TypedContractEvent<
		TroveManager_ActivePoolAddressChangedEvent.InputTuple,
		TroveManager_ActivePoolAddressChangedEvent.OutputTuple,
		TroveManager_ActivePoolAddressChangedEvent.OutputObject
	>;

	'BaseRateUpdated(uint256)': TypedContractEvent<
		TroveManager_BaseRateUpdatedEvent.InputTuple,
		TroveManager_BaseRateUpdatedEvent.OutputTuple,
		TroveManager_BaseRateUpdatedEvent.OutputObject
	>;
	'BaseRateUpdated': TypedContractEvent<
		TroveManager_BaseRateUpdatedEvent.InputTuple,
		TroveManager_BaseRateUpdatedEvent.OutputTuple,
		TroveManager_BaseRateUpdatedEvent.OutputObject
	>;

	'BorrowerOperationsAddressChanged(address)': TypedContractEvent<
		TroveManager_BorrowerOperationsAddressChangedEvent.InputTuple,
		TroveManager_BorrowerOperationsAddressChangedEvent.OutputTuple,
		TroveManager_BorrowerOperationsAddressChangedEvent.OutputObject
	>;
	'BorrowerOperationsAddressChanged': TypedContractEvent<
		TroveManager_BorrowerOperationsAddressChangedEvent.InputTuple,
		TroveManager_BorrowerOperationsAddressChangedEvent.OutputTuple,
		TroveManager_BorrowerOperationsAddressChangedEvent.OutputObject
	>;

	'CollSurplusPoolAddressChanged(address)': TypedContractEvent<
		TroveManager_CollSurplusPoolAddressChangedEvent.InputTuple,
		TroveManager_CollSurplusPoolAddressChangedEvent.OutputTuple,
		TroveManager_CollSurplusPoolAddressChangedEvent.OutputObject
	>;
	'CollSurplusPoolAddressChanged': TypedContractEvent<
		TroveManager_CollSurplusPoolAddressChangedEvent.InputTuple,
		TroveManager_CollSurplusPoolAddressChangedEvent.OutputTuple,
		TroveManager_CollSurplusPoolAddressChangedEvent.OutputObject
	>;

	'DefaultPoolAddressChanged(address)': TypedContractEvent<
		TroveManager_DefaultPoolAddressChangedEvent.InputTuple,
		TroveManager_DefaultPoolAddressChangedEvent.OutputTuple,
		TroveManager_DefaultPoolAddressChangedEvent.OutputObject
	>;
	'DefaultPoolAddressChanged': TypedContractEvent<
		TroveManager_DefaultPoolAddressChangedEvent.InputTuple,
		TroveManager_DefaultPoolAddressChangedEvent.OutputTuple,
		TroveManager_DefaultPoolAddressChangedEvent.OutputObject
	>;

	'GasPoolAddressChanged(address)': TypedContractEvent<
		TroveManager_GasPoolAddressChangedEvent.InputTuple,
		TroveManager_GasPoolAddressChangedEvent.OutputTuple,
		TroveManager_GasPoolAddressChangedEvent.OutputObject
	>;
	'GasPoolAddressChanged': TypedContractEvent<
		TroveManager_GasPoolAddressChangedEvent.InputTuple,
		TroveManager_GasPoolAddressChangedEvent.OutputTuple,
		TroveManager_GasPoolAddressChangedEvent.OutputObject
	>;

	'LTermsUpdated(uint256,uint256)': TypedContractEvent<
		TroveManager_LTermsUpdatedEvent.InputTuple,
		TroveManager_LTermsUpdatedEvent.OutputTuple,
		TroveManager_LTermsUpdatedEvent.OutputObject
	>;
	'LTermsUpdated': TypedContractEvent<
		TroveManager_LTermsUpdatedEvent.InputTuple,
		TroveManager_LTermsUpdatedEvent.OutputTuple,
		TroveManager_LTermsUpdatedEvent.OutputObject
	>;

	'LastFeeOpTimeUpdated(uint256)': TypedContractEvent<
		TroveManager_LastFeeOpTimeUpdatedEvent.InputTuple,
		TroveManager_LastFeeOpTimeUpdatedEvent.OutputTuple,
		TroveManager_LastFeeOpTimeUpdatedEvent.OutputObject
	>;
	'LastFeeOpTimeUpdated': TypedContractEvent<
		TroveManager_LastFeeOpTimeUpdatedEvent.InputTuple,
		TroveManager_LastFeeOpTimeUpdatedEvent.OutputTuple,
		TroveManager_LastFeeOpTimeUpdatedEvent.OutputObject
	>;

	'Liquidation(uint256,uint256,uint256,uint256)': TypedContractEvent<
		TroveManager_LiquidationEvent.InputTuple,
		TroveManager_LiquidationEvent.OutputTuple,
		TroveManager_LiquidationEvent.OutputObject
	>;
	'Liquidation': TypedContractEvent<
		TroveManager_LiquidationEvent.InputTuple,
		TroveManager_LiquidationEvent.OutputTuple,
		TroveManager_LiquidationEvent.OutputObject
	>;

	'OwnershipTransferred(address,address)': TypedContractEvent<
		TroveManager_OwnershipTransferredEvent.InputTuple,
		TroveManager_OwnershipTransferredEvent.OutputTuple,
		TroveManager_OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		TroveManager_OwnershipTransferredEvent.InputTuple,
		TroveManager_OwnershipTransferredEvent.OutputTuple,
		TroveManager_OwnershipTransferredEvent.OutputObject
	>;

	'PriceFeedAddressChanged(address)': TypedContractEvent<
		TroveManager_PriceFeedAddressChangedEvent.InputTuple,
		TroveManager_PriceFeedAddressChangedEvent.OutputTuple,
		TroveManager_PriceFeedAddressChangedEvent.OutputObject
	>;
	'PriceFeedAddressChanged': TypedContractEvent<
		TroveManager_PriceFeedAddressChangedEvent.InputTuple,
		TroveManager_PriceFeedAddressChangedEvent.OutputTuple,
		TroveManager_PriceFeedAddressChangedEvent.OutputObject
	>;

	'Redemption(uint256,uint256,uint256,uint256)': TypedContractEvent<
		TroveManager_RedemptionEvent.InputTuple,
		TroveManager_RedemptionEvent.OutputTuple,
		TroveManager_RedemptionEvent.OutputObject
	>;
	'Redemption': TypedContractEvent<
		TroveManager_RedemptionEvent.InputTuple,
		TroveManager_RedemptionEvent.OutputTuple,
		TroveManager_RedemptionEvent.OutputObject
	>;

	'StabilityPoolAddressChanged(address)': TypedContractEvent<
		TroveManager_StabilityPoolAddressChangedEvent.InputTuple,
		TroveManager_StabilityPoolAddressChangedEvent.OutputTuple,
		TroveManager_StabilityPoolAddressChangedEvent.OutputObject
	>;
	'StabilityPoolAddressChanged': TypedContractEvent<
		TroveManager_StabilityPoolAddressChangedEvent.InputTuple,
		TroveManager_StabilityPoolAddressChangedEvent.OutputTuple,
		TroveManager_StabilityPoolAddressChangedEvent.OutputObject
	>;

	'SystemSnapshotsUpdated(uint256,uint256)': TypedContractEvent<
		TroveManager_SystemSnapshotsUpdatedEvent.InputTuple,
		TroveManager_SystemSnapshotsUpdatedEvent.OutputTuple,
		TroveManager_SystemSnapshotsUpdatedEvent.OutputObject
	>;
	'SystemSnapshotsUpdated': TypedContractEvent<
		TroveManager_SystemSnapshotsUpdatedEvent.InputTuple,
		TroveManager_SystemSnapshotsUpdatedEvent.OutputTuple,
		TroveManager_SystemSnapshotsUpdatedEvent.OutputObject
	>;

	'TotalStakesUpdated(uint256)': TypedContractEvent<
		TroveManager_TotalStakesUpdatedEvent.InputTuple,
		TroveManager_TotalStakesUpdatedEvent.OutputTuple,
		TroveManager_TotalStakesUpdatedEvent.OutputObject
	>;
	'TotalStakesUpdated': TypedContractEvent<
		TroveManager_TotalStakesUpdatedEvent.InputTuple,
		TroveManager_TotalStakesUpdatedEvent.OutputTuple,
		TroveManager_TotalStakesUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}StakingAddressChanged(address)`]: TypedContractEvent<
		TroveManager_LQTYStakingAddressChangedEvent.InputTuple,
		TroveManager_LQTYStakingAddressChangedEvent.OutputTuple,
		TroveManager_LQTYStakingAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}StakingAddressChanged`]: TypedContractEvent<
		TroveManager_LQTYStakingAddressChangedEvent.InputTuple,
		TroveManager_LQTYStakingAddressChangedEvent.OutputTuple,
		TroveManager_LQTYStakingAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}TokenAddressChanged(address)`]: TypedContractEvent<
		TroveManager_LQTYTokenAddressChangedEvent.InputTuple,
		TroveManager_LQTYTokenAddressChangedEvent.OutputTuple,
		TroveManager_LQTYTokenAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}TokenAddressChanged`]: TypedContractEvent<
		TroveManager_LQTYTokenAddressChangedEvent.InputTuple,
		TroveManager_LQTYTokenAddressChangedEvent.OutputTuple,
		TroveManager_LQTYTokenAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressChanged(address)`]: TypedContractEvent<
		TroveManager_LUSDTokenAddressChangedEvent.InputTuple,
		TroveManager_LUSDTokenAddressChangedEvent.OutputTuple,
		TroveManager_LUSDTokenAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressChanged`]: TypedContractEvent<
		TroveManager_LUSDTokenAddressChangedEvent.InputTuple,
		TroveManager_LUSDTokenAddressChangedEvent.OutputTuple,
		TroveManager_LUSDTokenAddressChangedEvent.OutputObject
	>;
} & {
	[K in `Sorted${Capitalize<M['trove']>}sAddressChanged(address)`]: TypedContractEvent<
		TroveManager_SortedTrovesAddressChangedEvent.InputTuple,
		TroveManager_SortedTrovesAddressChangedEvent.OutputTuple,
		TroveManager_SortedTrovesAddressChangedEvent.OutputObject
	>;
} & {
	[K in `Sorted${Capitalize<M['trove']>}sAddressChanged`]: TypedContractEvent<
		TroveManager_SortedTrovesAddressChangedEvent.InputTuple,
		TroveManager_SortedTrovesAddressChangedEvent.OutputTuple,
		TroveManager_SortedTrovesAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}IndexUpdated(address,uint256)`]: TypedContractEvent<
		TroveManager_TroveIndexUpdatedEvent.InputTuple,
		TroveManager_TroveIndexUpdatedEvent.OutputTuple,
		TroveManager_TroveIndexUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}IndexUpdated`]: TypedContractEvent<
		TroveManager_TroveIndexUpdatedEvent.InputTuple,
		TroveManager_TroveIndexUpdatedEvent.OutputTuple,
		TroveManager_TroveIndexUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}Liquidated(address,uint256,uint256,uint8)`]: TypedContractEvent<
		TroveManager_TroveLiquidatedEvent.InputTuple,
		TroveManager_TroveLiquidatedEvent.OutputTuple,
		TroveManager_TroveLiquidatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}Liquidated`]: TypedContractEvent<
		TroveManager_TroveLiquidatedEvent.InputTuple,
		TroveManager_TroveLiquidatedEvent.OutputTuple,
		TroveManager_TroveLiquidatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}SnapshotsUpdated(uint256,uint256)`]: TypedContractEvent<
		TroveManager_TroveSnapshotsUpdatedEvent.InputTuple,
		TroveManager_TroveSnapshotsUpdatedEvent.OutputTuple,
		TroveManager_TroveSnapshotsUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}SnapshotsUpdated`]: TypedContractEvent<
		TroveManager_TroveSnapshotsUpdatedEvent.InputTuple,
		TroveManager_TroveSnapshotsUpdatedEvent.OutputTuple,
		TroveManager_TroveSnapshotsUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}Updated(address,uint256,uint256,uint256,uint8)`]: TypedContractEvent<
		TroveManager_TroveUpdatedEvent.InputTuple,
		TroveManager_TroveUpdatedEvent.OutputTuple,
		TroveManager_TroveUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}Updated`]: TypedContractEvent<
		TroveManager_TroveUpdatedEvent.InputTuple,
		TroveManager_TroveUpdatedEvent.OutputTuple,
		TroveManager_TroveUpdatedEvent.OutputObject
	>;
};

export type TroveManager<M extends Modifiers> = BaseContract &
	TroveManagerTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): TroveManager<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & TroveManager<M>>;

		interface: TroveManagerInterface<M>;

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
		): Promise<ThisType<T> & TroveManager<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & TroveManager<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & TroveManager<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & TroveManager<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;
		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & TroveManager<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'BETA'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'BOOTSTRAP_PERIOD'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'BORROWING_FEE_FLOOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'CCR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'DECIMAL_PRECISION'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `L_${Uppercase<M['eth']>}`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `L_${Uppercase<M['lusd']>}Debt`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MAX_BORROWING_FEE'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MCR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MINUTE_DECAY_FACTOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MIN_NET_DEBT'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'PERCENT_DIVISOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'REDEMPTION_FEE_FLOOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'SECONDS_IN_ONE_MINUTE'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `${Capitalize<M['trove']>}Owners`): TypedContractMethod<[arg0: BigNumberish], [string], 'view'>;
		getFunction(nameOrSignature: `${Capitalize<M['trove']>}s`): TypedContractMethod<[arg0: AddressLike], [[bigint, bigint, bigint, bigint, bigint] & {debt: bigint; coll: bigint; stake: bigint; status: bigint; arrayIndex: bigint;}], 'view'>;
		getFunction(nameOrSignature: '_100pct'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'activePool'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `add${Capitalize<M['trove']>}OwnerToArray`): TypedContractMethod<[_borrower: AddressLike], [bigint], 'nonpayable'>;
		getFunction(nameOrSignature: 'applyPendingRewards'): TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'baseRate'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `batchLiquidate${Capitalize<M['trove']>}s`): TypedContractMethod<[_troveArray: AddressLike[]], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'borrowerOperationsAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'checkRecoveryMode'): TypedContractMethod<[_price: BigNumberish], [boolean], 'view'>;
		getFunction(nameOrSignature: `close${Capitalize<M['trove']>}`): TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'decayBaseRateFromBorrowing'): TypedContractMethod<[], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `decrease${Capitalize<M['trove']>}Coll`): TypedContractMethod<[_borrower: AddressLike, _collDecrease: BigNumberish], [bigint], 'nonpayable'>;
		getFunction(nameOrSignature: `decrease${Capitalize<M['trove']>}Debt`): TypedContractMethod<[_borrower: AddressLike, _debtDecrease: BigNumberish], [bigint], 'nonpayable'>;
		getFunction(nameOrSignature: 'defaultPool'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'getBorrowingFee'): TypedContractMethod<[_LUSDDebt: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getBorrowingFeeWithDecay'): TypedContractMethod<[_LUSDDebt: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getBorrowingRate'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getBorrowingRateWithDecay'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getCurrentICR'): TypedContractMethod<[_borrower: AddressLike, _price: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getEntireDebtAndColl'): TypedContractMethod<[_borrower: AddressLike], [[bigint, bigint, bigint, bigint] & {debt: bigint; coll: bigint; pendingLUSDDebtReward: bigint; pendingETHReward: bigint;}], 'view'>;
		getFunction(nameOrSignature: 'getEntireSystemColl'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getEntireSystemDebt'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getNominalICR'): TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `getPending${Uppercase<M['eth']>}Reward`): TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `getPending${Uppercase<M['lusd']>}DebtReward`): TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getRedemptionFeeWithDecay'): TypedContractMethod<[_ETHDrawn: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getRedemptionRate'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getRedemptionRateWithDecay'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getTCR'): TypedContractMethod<[_price: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: `get${Capitalize<M['trove']>}Coll`): TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `get${Capitalize<M['trove']>}Debt`): TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `get${Capitalize<M['trove']>}From${Capitalize<M['trove']>}OwnersArray`): TypedContractMethod<[_index: BigNumberish], [string], 'view'>;
		getFunction(nameOrSignature: `get${Capitalize<M['trove']>}OwnersCount`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `get${Capitalize<M['trove']>}Stake`): TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `get${Capitalize<M['trove']>}Status`): TypedContractMethod<[_borrower: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'hasPendingRewards'): TypedContractMethod<[_borrower: AddressLike], [boolean], 'view'>;
		getFunction(nameOrSignature: `increase${Capitalize<M['trove']>}Coll`): TypedContractMethod<[_borrower: AddressLike, _collIncrease: BigNumberish], [bigint], 'nonpayable'>;
		getFunction(nameOrSignature: `increase${Capitalize<M['trove']>}Debt`): TypedContractMethod<[_borrower: AddressLike, _debtIncrease: BigNumberish], [bigint], 'nonpayable'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: `last${Uppercase<M['eth']>}Error_Redistribution`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'lastFeeOperationTime'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `last${Uppercase<M['lusd']>}DebtError_Redistribution`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'liquidate'): TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `liquidate${Capitalize<M['trove']>}s`): TypedContractMethod<[_n: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `${M['lqty']}Staking`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['lqty']}Token`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['lusd']}Token`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'priceFeed'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'redeemCollateral'): TypedContractMethod<[_LUSDamount: BigNumberish, _firstRedemptionHint: AddressLike, _upperPartialRedemptionHint: AddressLike, _lowerPartialRedemptionHint: AddressLike, _partialRedemptionHintNICR: BigNumberish, _maxIterations: BigNumberish, _maxFeePercentage: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'removeStake'): TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'rewardSnapshots'): TypedContractMethod<[arg0: AddressLike], [[bigint, bigint] & { ETH: bigint; LUSDDebt: bigint }], 'view'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_borrowerOperationsAddress: AddressLike, _activePoolAddress: AddressLike, _defaultPoolAddress: AddressLike, _stabilityPoolAddress: AddressLike, _gasPoolAddress: AddressLike, _collSurplusPoolAddress: AddressLike, _priceFeedAddress: AddressLike, _lusdTokenAddress: AddressLike, _sortedTrovesAddress: AddressLike, _lqtyTokenAddress: AddressLike, _lqtyStakingAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `set${Capitalize<M['trove']>}Status`): TypedContractMethod<[_borrower: AddressLike, _num: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `sorted${Capitalize<M['trove']>}s`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'stabilityPool'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'totalCollateralSnapshot'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'totalStakes'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'totalStakesSnapshot'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'updateStakeAndTotalStakes'): TypedContractMethod<[_borrower: AddressLike], [bigint], 'nonpayable'>;
		getFunction(nameOrSignature: `update${Capitalize<M['trove']>}RewardSnapshots`): TypedContractMethod<[_borrower: AddressLike], [void], 'nonpayable'>;

		getEvent(key: 'ActivePoolAddressChanged'): TypedContractEvent<TroveManager_ActivePoolAddressChangedEvent.InputTuple, TroveManager_ActivePoolAddressChangedEvent.OutputTuple, TroveManager_ActivePoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'BaseRateUpdated'): TypedContractEvent<TroveManager_BaseRateUpdatedEvent.InputTuple, TroveManager_BaseRateUpdatedEvent.OutputTuple, TroveManager_BaseRateUpdatedEvent.OutputObject>;
		getEvent(key: 'BorrowerOperationsAddressChanged'): TypedContractEvent<TroveManager_BorrowerOperationsAddressChangedEvent.InputTuple, TroveManager_BorrowerOperationsAddressChangedEvent.OutputTuple, TroveManager_BorrowerOperationsAddressChangedEvent.OutputObject>;
		getEvent(key: 'CollSurplusPoolAddressChanged'): TypedContractEvent<TroveManager_CollSurplusPoolAddressChangedEvent.InputTuple, TroveManager_CollSurplusPoolAddressChangedEvent.OutputTuple, TroveManager_CollSurplusPoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'DefaultPoolAddressChanged'): TypedContractEvent<TroveManager_DefaultPoolAddressChangedEvent.InputTuple, TroveManager_DefaultPoolAddressChangedEvent.OutputTuple, TroveManager_DefaultPoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'GasPoolAddressChanged'): TypedContractEvent<TroveManager_GasPoolAddressChangedEvent.InputTuple, TroveManager_GasPoolAddressChangedEvent.OutputTuple, TroveManager_GasPoolAddressChangedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lqty']>}StakingAddressChanged`): TypedContractEvent<TroveManager_LQTYStakingAddressChangedEvent.InputTuple, TroveManager_LQTYStakingAddressChangedEvent.OutputTuple, TroveManager_LQTYStakingAddressChangedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lqty']>}TokenAddressChanged`): TypedContractEvent<TroveManager_LQTYTokenAddressChangedEvent.InputTuple, TroveManager_LQTYTokenAddressChangedEvent.OutputTuple, TroveManager_LQTYTokenAddressChangedEvent.OutputObject>;
		getEvent(key: 'LTermsUpdated'): TypedContractEvent<TroveManager_LTermsUpdatedEvent.InputTuple, TroveManager_LTermsUpdatedEvent.OutputTuple, TroveManager_LTermsUpdatedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lusd']>}TokenAddressChanged`): TypedContractEvent<TroveManager_LUSDTokenAddressChangedEvent.InputTuple, TroveManager_LUSDTokenAddressChangedEvent.OutputTuple, TroveManager_LUSDTokenAddressChangedEvent.OutputObject>;
		getEvent(key: 'LastFeeOpTimeUpdated'): TypedContractEvent<TroveManager_LastFeeOpTimeUpdatedEvent.InputTuple, TroveManager_LastFeeOpTimeUpdatedEvent.OutputTuple, TroveManager_LastFeeOpTimeUpdatedEvent.OutputObject>;
		getEvent(key: 'Liquidation'): TypedContractEvent<TroveManager_LiquidationEvent.InputTuple, TroveManager_LiquidationEvent.OutputTuple, TroveManager_LiquidationEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<TroveManager_OwnershipTransferredEvent.InputTuple, TroveManager_OwnershipTransferredEvent.OutputTuple, TroveManager_OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'PriceFeedAddressChanged'): TypedContractEvent<TroveManager_PriceFeedAddressChangedEvent.InputTuple, TroveManager_PriceFeedAddressChangedEvent.OutputTuple, TroveManager_PriceFeedAddressChangedEvent.OutputObject>;
		getEvent(key: 'Redemption'): TypedContractEvent<TroveManager_RedemptionEvent.InputTuple, TroveManager_RedemptionEvent.OutputTuple, TroveManager_RedemptionEvent.OutputObject>;
		getEvent(key: `Sorted${Capitalize<M['trove']>}sAddressChanged`): TypedContractEvent<TroveManager_SortedTrovesAddressChangedEvent.InputTuple, TroveManager_SortedTrovesAddressChangedEvent.OutputTuple, TroveManager_SortedTrovesAddressChangedEvent.OutputObject>;
		getEvent(key: 'StabilityPoolAddressChanged'): TypedContractEvent<TroveManager_StabilityPoolAddressChangedEvent.InputTuple, TroveManager_StabilityPoolAddressChangedEvent.OutputTuple, TroveManager_StabilityPoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'SystemSnapshotsUpdated'): TypedContractEvent<TroveManager_SystemSnapshotsUpdatedEvent.InputTuple, TroveManager_SystemSnapshotsUpdatedEvent.OutputTuple, TroveManager_SystemSnapshotsUpdatedEvent.OutputObject>;
		getEvent(key: 'TotalStakesUpdated'): TypedContractEvent<TroveManager_TotalStakesUpdatedEvent.InputTuple, TroveManager_TotalStakesUpdatedEvent.OutputTuple, TroveManager_TotalStakesUpdatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}IndexUpdated`): TypedContractEvent<TroveManager_TroveIndexUpdatedEvent.InputTuple, TroveManager_TroveIndexUpdatedEvent.OutputTuple, TroveManager_TroveIndexUpdatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}Liquidated`): TypedContractEvent<TroveManager_TroveLiquidatedEvent.InputTuple, TroveManager_TroveLiquidatedEvent.OutputTuple, TroveManager_TroveLiquidatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}SnapshotsUpdated`): TypedContractEvent<TroveManager_TroveSnapshotsUpdatedEvent.InputTuple, TroveManager_TroveSnapshotsUpdatedEvent.OutputTuple, TroveManager_TroveSnapshotsUpdatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}Updated`): TypedContractEvent<TroveManager_TroveUpdatedEvent.InputTuple, TroveManager_TroveUpdatedEvent.OutputTuple, TroveManager_TroveUpdatedEvent.OutputObject>;

		filters: TroveManagerTypedContractEventFilters<M>;
	};
