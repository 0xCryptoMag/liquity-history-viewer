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

export declare namespace BorrowerOperations {
	export type BorrowerOperationEnum = [
		openTrove: bigint,
		closeTrove: bigint,
		adjustTrove: bigint
	] & {
		openTrove: bigint;
		closeTrove: bigint;
		adjustTrove: bigint;
	};
}

type BorrowerOperationsFunctionNameOrSignature<M extends Modifiers> =
	| 'BORROWING_FEE_FLOOR'
	| 'CCR'
	| 'DECIMAL_PRECISION'
	| `${Uppercase<M['lusd']>}_GAS_COMPENSATION`
	| 'MCR'
	| 'MIN_NET_DEBT'
	| 'NAME'
	| 'PERCENT_DIVISOR'
	| '_100pct'
	| 'activePool'
	| 'addColl'
	| `adjust${Capitalize<M['trove']>}`
	| 'claimCollateral'
	| `close${Capitalize<M['trove']>}`
	| 'defaultPool'
	| 'getCompositeDebt'
	| 'getEntireSystemColl'
	| 'getEntireSystemDebt'
	| 'isOwner'
	| `${M['lqty']}Staking`
	| `${M['lqty']}StakingAddress`
	| `${M['lusd']}Token`
	| `move${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`
	| `open${Capitalize<M['trove']>}`
	| 'owner'
	| 'priceFeed'
	| `repay${Uppercase<M['lusd']>}`
	| 'setAddresses'
	| `sorted${Capitalize<M['trove']>}s`
	| `${M['trove']}Manager`
	| 'withdrawColl'
	| `withdraw${Uppercase<M['lusd']>}`;

type BorrowerOperationsEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'ActivePoolAddressChanged'
	| 'CollSurplusPoolAddressChanged'
	| 'DefaultPoolAddressChanged'
	| 'GasPoolAddressChanged'
	| `${Uppercase<M['lqty']>}StakingAddressChanged`
	| `${Uppercase<M['lusd']>}BorrowingFeePaid`
	| `${Uppercase<M['lusd']>}TokenAddressChanged`
	| 'OwnershipTransferred'
	| 'PriceFeedAddressChanged'
	| `Sorted${Capitalize<M['trove']>}sAddressChanged`
	| 'StabilityPoolAddressChanged'
	| `${Capitalize<M['trove']>}Created`
	| `${Capitalize<M['trove']>}ManagerAddressChanged`
	| `${Capitalize<M['trove']>}Updated`;

export interface BorrowerOperationsInterface<M extends Modifiers>
	extends Interface {
	getFunction(
		nameOrSignature: BorrowerOperationsFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: BorrowerOperationsEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'BORROWING_FEE_FLOOR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'CCR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'DECIMAL_PRECISION', values?: undefined): string;
	encodeFunctionData(functionFragment: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'MCR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'MIN_NET_DEBT', values?: undefined): string;
	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'PERCENT_DIVISOR', values?: undefined): string;
	encodeFunctionData(functionFragment: '_100pct', values?: undefined): string;
	encodeFunctionData(functionFragment: 'activePool', values?: undefined): string;
	encodeFunctionData(functionFragment: 'addColl', values: [AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `adjust${Capitalize<M['trove']>}`, values: [BigNumberish, BigNumberish, BigNumberish, boolean, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'claimCollateral', values?: undefined): string;
	encodeFunctionData(functionFragment: `close${Capitalize<M['trove']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'defaultPool', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getCompositeDebt', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'getEntireSystemColl', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getEntireSystemDebt', values?: undefined): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lqty']}Staking`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lqty']}StakingAddress`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lusd']}Token`, values?: undefined): string;
	encodeFunctionData(functionFragment: `move${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`, values: [AddressLike, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `open${Capitalize<M['trove']>}`, values: [BigNumberish, BigNumberish, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'priceFeed', values?: undefined): string;
	encodeFunctionData(functionFragment: `repay${Uppercase<M['lusd']>}`, values: [BigNumberish, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'setAddresses',values: [ AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `sorted${Capitalize<M['trove']>}s`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['trove']}Manager`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'withdrawColl', values: [BigNumberish, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `withdraw${Uppercase<M['lusd']>}`, values: [BigNumberish, BigNumberish, AddressLike, AddressLike]): string;

	decodeFunctionResult(functionFragment: 'BORROWING_FEE_FLOOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'CCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'DECIMAL_PRECISION', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MIN_NET_DEBT', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'PERCENT_DIVISOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: '_100pct', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'activePool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'addColl', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `adjust${Capitalize<M['trove']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'claimCollateral', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `close${Capitalize<M['trove']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'defaultPool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getCompositeDebt', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getEntireSystemColl', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getEntireSystemDebt', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lqty']}Staking`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lqty']}StakingAddress`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lusd']}Token`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `move${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `open${Capitalize<M['trove']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'priceFeed', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `repay${Uppercase<M['lusd']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `sorted${Capitalize<M['trove']>}s`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['trove']}Manager`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'withdrawColl', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `withdraw${Uppercase<M['lusd']>}`, data: BytesLike): Result;
}

export namespace BorrowerOperations_ActivePoolAddressChangedEvent {
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

export namespace BorrowerOperations_CollSurplusPoolAddressChangedEvent {
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

export namespace BorrowerOperations_DefaultPoolAddressChangedEvent {
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

export namespace BorrowerOperations_GasPoolAddressChangedEvent {
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

export namespace BorrowerOperations_LQTYStakingAddressChangedEvent {
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

export namespace BorrowerOperations_LUSDBorrowingFeePaidEvent {
	export type InputTuple = [_borrower: AddressLike, _LUSDFee: BigNumberish];
	export type OutputTuple = [_borrower: string, _LUSDFee: bigint];
	export interface OutputObject {
		_borrower: string;
		_LUSDFee: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace BorrowerOperations_LUSDTokenAddressChangedEvent {
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

export namespace BorrowerOperations_OwnershipTransferredEvent {
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

export namespace BorrowerOperations_PriceFeedAddressChangedEvent {
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

export namespace BorrowerOperations_SortedTrovesAddressChangedEvent {
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

export namespace BorrowerOperations_StabilityPoolAddressChangedEvent {
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

export namespace BorrowerOperations_TroveCreatedEvent {
	export type InputTuple = [_borrower: AddressLike, arrayIndex: BigNumberish];
	export type OutputTuple = [_borrower: string, arrayIndex: bigint];
	export interface OutputObject {
		_borrower: string;
		arrayIndex: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace BorrowerOperations_TroveManagerAddressChangedEvent {
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

export namespace BorrowerOperations_TroveUpdatedEvent {
	export type InputTuple = [_borrower: AddressLike, _debt: BigNumberish, _coll: BigNumberish, stake: BigNumberish, operation: BigNumberish];
	export type OutputTuple = [_borrower: string, _debt: bigint, _coll: bigint, stake: bigint, operation: bigint];
	export interface OutputObject {
		_borrower: string;
		_debt: bigint;
		_coll: bigint;
		stake: bigint;
		operation: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

type BorrowerOperationsTypedContractMethods<M extends Modifiers> = {
	BORROWING_FEE_FLOOR: TypedContractMethod<[], [bigint], 'view'>;
	CCR: TypedContractMethod<[], [bigint], 'view'>;
	DECIMAL_PRECISION: TypedContractMethod<[], [bigint], 'view'>;
	MCR: TypedContractMethod<[], [bigint], 'view'>;
	MIN_NET_DEBT: TypedContractMethod<[], [bigint], 'view'>;
	NAME: TypedContractMethod<[], [string], 'view'>;
	PERCENT_DIVISOR: TypedContractMethod<[], [bigint], 'view'>;
	_100pct: TypedContractMethod<[], [bigint], 'view'>;
	activePool: TypedContractMethod<[], [string], 'view'>;
	addColl: TypedContractMethod<[_upperHint: AddressLike, _lowerHint: AddressLike], [void], 'payable'>;
	claimCollateral: TypedContractMethod<[], [void], 'nonpayable'>;
	defaultPool: TypedContractMethod<[], [string], 'view'>;
	getCompositeDebt: TypedContractMethod<[_debt: BigNumberish], [bigint], 'view'>;
	getEntireSystemColl: TypedContractMethod<[], [bigint], 'view'>;
	getEntireSystemDebt: TypedContractMethod<[], [bigint], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	priceFeed: TypedContractMethod<[], [string], 'view'>;
	setAddresses: TypedContractMethod<[_troveManagerAddress: AddressLike, _activePoolAddress: AddressLike, _defaultPoolAddress: AddressLike, _stabilityPoolAddress: AddressLike, _gasPoolAddress: AddressLike, _collSurplusPoolAddress: AddressLike, _priceFeedAddress: AddressLike, _sortedTrovesAddress: AddressLike, _lusdTokenAddress: AddressLike, _lqtyStakingAddress: AddressLike], [void], 'nonpayable'>;
	withdrawColl: TypedContractMethod<[ _collWithdrawal: BigNumberish, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'nonpayable'>;
} & {
	[K in `${Uppercase<M['lusd']>}_GAS_COMPENSATION`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `adjust${M['trove']}`]: TypedContractMethod<[_maxFeePercentage: BigNumberish, _collWithdrawal: BigNumberish, _LUSDChange: BigNumberish, _isDebtIncrease: boolean, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'payable'>;
} & {
	[K in `close${Capitalize<M['trove']>}`]: TypedContractMethod<[], [void], 'nonpayable'>;
} & {
	[K in `${M['lqty']}Staking`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['lqty']}StakingAddress`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['lusd']}Token`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `move${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`]: TypedContractMethod<[_borrower: AddressLike, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'payable'>;
} & {
	[K in `open${Capitalize<M['trove']>}`]: TypedContractMethod<[_maxFeePercentage: BigNumberish, _LUSDAmount: BigNumberish, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'payable'>;
} & {
	[K in `repay${Uppercase<M['lusd']>}`]: TypedContractMethod<[_LUSDAmount: BigNumberish, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'nonpayable'>;
} & {
	[K in `sorted${Capitalize<M['trove']>}`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['trove']}Manager`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `withdraw${Uppercase<M['lusd']>}`]: TypedContractMethod<[_maxFeePercentage: BigNumberish, _LUSDAmount: BigNumberish, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'nonpayable'>;
}

type BorrowerOperationsTypedContractEventFilters<M extends Modifiers> = {
	'ActivePoolAddressChanged(address)': TypedContractEvent<
		BorrowerOperations_ActivePoolAddressChangedEvent.InputTuple,
		BorrowerOperations_ActivePoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_ActivePoolAddressChangedEvent.OutputObject
	>;
	'ActivePoolAddressChanged': TypedContractEvent<
		BorrowerOperations_ActivePoolAddressChangedEvent.InputTuple,
		BorrowerOperations_ActivePoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_ActivePoolAddressChangedEvent.OutputObject
	>;

	'CollSurplusPoolAddressChanged(address)': TypedContractEvent<
		BorrowerOperations_CollSurplusPoolAddressChangedEvent.InputTuple,
		BorrowerOperations_CollSurplusPoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_CollSurplusPoolAddressChangedEvent.OutputObject
	>;
	'CollSurplusPoolAddressChanged': TypedContractEvent<
		BorrowerOperations_CollSurplusPoolAddressChangedEvent.InputTuple,
		BorrowerOperations_CollSurplusPoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_CollSurplusPoolAddressChangedEvent.OutputObject
	>;

	'DefaultPoolAddressChanged(address)': TypedContractEvent<
		BorrowerOperations_DefaultPoolAddressChangedEvent.InputTuple,
		BorrowerOperations_DefaultPoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_DefaultPoolAddressChangedEvent.OutputObject
	>;
	'DefaultPoolAddressChanged': TypedContractEvent<
		BorrowerOperations_DefaultPoolAddressChangedEvent.InputTuple,
		BorrowerOperations_DefaultPoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_DefaultPoolAddressChangedEvent.OutputObject
	>;

	'GasPoolAddressChanged(address)': TypedContractEvent<
		BorrowerOperations_GasPoolAddressChangedEvent.InputTuple,
		BorrowerOperations_GasPoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_GasPoolAddressChangedEvent.OutputObject
	>;
	'GasPoolAddressChanged': TypedContractEvent<
		BorrowerOperations_GasPoolAddressChangedEvent.InputTuple,
		BorrowerOperations_GasPoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_GasPoolAddressChangedEvent.OutputObject
	>;

	'OwnershipTransferred(address,address)': TypedContractEvent<
		BorrowerOperations_OwnershipTransferredEvent.InputTuple,
		BorrowerOperations_OwnershipTransferredEvent.OutputTuple,
		BorrowerOperations_OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		BorrowerOperations_OwnershipTransferredEvent.InputTuple,
		BorrowerOperations_OwnershipTransferredEvent.OutputTuple,
		BorrowerOperations_OwnershipTransferredEvent.OutputObject
	>;

	'PriceFeedAddressChanged(address)': TypedContractEvent<
		BorrowerOperations_PriceFeedAddressChangedEvent.InputTuple,
		BorrowerOperations_PriceFeedAddressChangedEvent.OutputTuple,
		BorrowerOperations_PriceFeedAddressChangedEvent.OutputObject
	>;
	'PriceFeedAddressChanged': TypedContractEvent<
		BorrowerOperations_PriceFeedAddressChangedEvent.InputTuple,
		BorrowerOperations_PriceFeedAddressChangedEvent.OutputTuple,
		BorrowerOperations_PriceFeedAddressChangedEvent.OutputObject
	>;

	'StabilityPoolAddressChanged(address)': TypedContractEvent<
		BorrowerOperations_StabilityPoolAddressChangedEvent.InputTuple,
		BorrowerOperations_StabilityPoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_StabilityPoolAddressChangedEvent.OutputObject
	>;
	'StabilityPoolAddressChanged': TypedContractEvent<
		BorrowerOperations_StabilityPoolAddressChangedEvent.InputTuple,
		BorrowerOperations_StabilityPoolAddressChangedEvent.OutputTuple,
		BorrowerOperations_StabilityPoolAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}StakingAddressChanged(address)`]: TypedContractEvent<
		BorrowerOperations_LQTYStakingAddressChangedEvent.InputTuple,
		BorrowerOperations_LQTYStakingAddressChangedEvent.OutputTuple,
		BorrowerOperations_LQTYStakingAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}StakingAddressChanged`]: TypedContractEvent<
		BorrowerOperations_LQTYStakingAddressChangedEvent.InputTuple,
		BorrowerOperations_LQTYStakingAddressChangedEvent.OutputTuple,
		BorrowerOperations_LQTYStakingAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}BorrowingFeePaid(address,uint256)`]: TypedContractEvent<
		BorrowerOperations_LUSDBorrowingFeePaidEvent.InputTuple,
		BorrowerOperations_LUSDBorrowingFeePaidEvent.OutputTuple,
		BorrowerOperations_LUSDBorrowingFeePaidEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}BorrowingFeePaid`]: TypedContractEvent<
		BorrowerOperations_LUSDBorrowingFeePaidEvent.InputTuple,
		BorrowerOperations_LUSDBorrowingFeePaidEvent.OutputTuple,
		BorrowerOperations_LUSDBorrowingFeePaidEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressChanged(address)`]: TypedContractEvent<
		BorrowerOperations_LUSDTokenAddressChangedEvent.InputTuple,
		BorrowerOperations_LUSDTokenAddressChangedEvent.OutputTuple,
		BorrowerOperations_LUSDTokenAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressChanged`]: TypedContractEvent<
		BorrowerOperations_LUSDTokenAddressChangedEvent.InputTuple,
		BorrowerOperations_LUSDTokenAddressChangedEvent.OutputTuple,
		BorrowerOperations_LUSDTokenAddressChangedEvent.OutputObject
	>;
} & {
	[K in `Sorted${Capitalize<M['trove']>}AddressChanged(address)`]: TypedContractEvent<
		BorrowerOperations_SortedTrovesAddressChangedEvent.InputTuple,
		BorrowerOperations_SortedTrovesAddressChangedEvent.OutputTuple,
		BorrowerOperations_SortedTrovesAddressChangedEvent.OutputObject
	>;
} & {
	[K in `Sorted${Capitalize<M['trove']>}AddressChanged`]: TypedContractEvent<
		BorrowerOperations_SortedTrovesAddressChangedEvent.InputTuple,
		BorrowerOperations_SortedTrovesAddressChangedEvent.OutputTuple,
		BorrowerOperations_SortedTrovesAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['trove']>}Created(address,uint256)`]: TypedContractEvent<
		BorrowerOperations_TroveCreatedEvent.InputTuple,
		BorrowerOperations_TroveCreatedEvent.OutputTuple,
		BorrowerOperations_TroveCreatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['trove']>}Created`]: TypedContractEvent<
		BorrowerOperations_TroveCreatedEvent.InputTuple,
		BorrowerOperations_TroveCreatedEvent.OutputTuple,
		BorrowerOperations_TroveCreatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['trove']>}ManagerAddressChanged(address)`]: TypedContractEvent<
		BorrowerOperations_TroveManagerAddressChangedEvent.InputTuple,
		BorrowerOperations_TroveManagerAddressChangedEvent.OutputTuple,
		BorrowerOperations_TroveManagerAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['trove']>}ManagerAddressChanged`]: TypedContractEvent<
		BorrowerOperations_TroveManagerAddressChangedEvent.InputTuple,
		BorrowerOperations_TroveManagerAddressChangedEvent.OutputTuple,
		BorrowerOperations_TroveManagerAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['trove']>}Updated(address,uint256,uint256,uint256,uint8)`]: TypedContractEvent<
		BorrowerOperations_TroveUpdatedEvent.InputTuple,
		BorrowerOperations_TroveUpdatedEvent.OutputTuple,
		BorrowerOperations_TroveUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['trove']>}Updated`]: TypedContractEvent<
		BorrowerOperations_TroveUpdatedEvent.InputTuple,
		BorrowerOperations_TroveUpdatedEvent.OutputTuple,
		BorrowerOperations_TroveUpdatedEvent.OutputObject
	>;
};
		

export type BorrowerOperations<M extends Modifiers> = BaseContract &
	BorrowerOperationsTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): BorrowerOperations<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & BorrowerOperations<M>>;

		interface: BorrowerOperationsInterface<M>;

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
		): Promise<ThisType<T> & BorrowerOperations<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & BorrowerOperations<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & BorrowerOperations<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & BorrowerOperations<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;
		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & BorrowerOperations<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'BORROWING_FEE_FLOOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'CCR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'DECIMAL_PRECISION'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MCR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MIN_NET_DEBT'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'PERCENT_DIVISOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: '_100pct'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'activePool'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'addColl'): TypedContractMethod<[_upperHint: AddressLike, _lowerHint: AddressLike], [void], 'payable'>;
		getFunction(nameOrSignature: `adjust${M['trove']}`): TypedContractMethod<[_maxFeePercentage: BigNumberish, _collWithdrawal: BigNumberish, _LUSDChange: BigNumberish, _isDebtIncrease: boolean, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'payable'>;
		getFunction(nameOrSignature: 'claimCollateral'): TypedContractMethod<[], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `close${Capitalize<M['trove']>}`): TypedContractMethod<[], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'defaultPool'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'getCompositeDebt'): TypedContractMethod<[_debt: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getEntireSystemColl'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getEntireSystemDebt'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: `${M['lqty']}Staking`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['lqty']}StakingAddress`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['lusd']}Token`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `move${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`): TypedContractMethod<[_borrower: AddressLike, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'payable'>;
		getFunction(nameOrSignature: `open${Capitalize<M['trove']>}`): TypedContractMethod<[_maxFeePercentage: BigNumberish, _LUSDAmount: BigNumberish, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'payable'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'priceFeed'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `repay${Uppercase<M['lusd']>}`): TypedContractMethod<[_LUSDAmount: BigNumberish, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_troveManagerAddress: AddressLike, _activePoolAddress: AddressLike, _defaultPoolAddress: AddressLike, _stabilityPoolAddress: AddressLike, _gasPoolAddress: AddressLike, _collSurplusPoolAddress: AddressLike, _priceFeedAddress: AddressLike, _sortedTrovesAddress: AddressLike, _lusdTokenAddress: AddressLike, _lqtyStakingAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `sorted${Capitalize<M['trove']>}s`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['trove']}Manager`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'withdrawColl'): TypedContractMethod<[_collWithdrawal: BigNumberish, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `withdraw${Uppercase<M['lusd']>}`): TypedContractMethod<[_maxFeePercentage: BigNumberish, _LUSDAmount: BigNumberish, _upperHint: AddressLike, _lowerHint: AddressLike], [void], 'nonpayable'>;

		getEvent(key: 'ActivePoolAddressChanged'): TypedContractEvent<BorrowerOperations_ActivePoolAddressChangedEvent.InputTuple, BorrowerOperations_ActivePoolAddressChangedEvent.OutputTuple, BorrowerOperations_ActivePoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'CollSurplusPoolAddressChanged'): TypedContractEvent<BorrowerOperations_CollSurplusPoolAddressChangedEvent.InputTuple, BorrowerOperations_CollSurplusPoolAddressChangedEvent.OutputTuple, BorrowerOperations_CollSurplusPoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'DefaultPoolAddressChanged'): TypedContractEvent<BorrowerOperations_DefaultPoolAddressChangedEvent.InputTuple, BorrowerOperations_DefaultPoolAddressChangedEvent.OutputTuple, BorrowerOperations_DefaultPoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'GasPoolAddressChanged'): TypedContractEvent<BorrowerOperations_GasPoolAddressChangedEvent.InputTuple, BorrowerOperations_GasPoolAddressChangedEvent.OutputTuple, BorrowerOperations_GasPoolAddressChangedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lqty']>}StakingAddressChanged`): TypedContractEvent<BorrowerOperations_LQTYStakingAddressChangedEvent.InputTuple, BorrowerOperations_LQTYStakingAddressChangedEvent.OutputTuple, BorrowerOperations_LQTYStakingAddressChangedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lusd']>}BorrowingFeePaid`): TypedContractEvent<BorrowerOperations_LUSDBorrowingFeePaidEvent.InputTuple, BorrowerOperations_LUSDBorrowingFeePaidEvent.OutputTuple, BorrowerOperations_LUSDBorrowingFeePaidEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lusd']>}TokenAddressChanged`): TypedContractEvent<BorrowerOperations_LUSDTokenAddressChangedEvent.InputTuple, BorrowerOperations_LUSDTokenAddressChangedEvent.OutputTuple, BorrowerOperations_LUSDTokenAddressChangedEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<BorrowerOperations_OwnershipTransferredEvent.InputTuple, BorrowerOperations_OwnershipTransferredEvent.OutputTuple, BorrowerOperations_OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'PriceFeedAddressChanged'): TypedContractEvent<BorrowerOperations_PriceFeedAddressChangedEvent.InputTuple, BorrowerOperations_PriceFeedAddressChangedEvent.OutputTuple, BorrowerOperations_PriceFeedAddressChangedEvent.OutputObject>;
		getEvent(key: `Sorted${Capitalize<M['trove']>}sAddressChanged`): TypedContractEvent<BorrowerOperations_SortedTrovesAddressChangedEvent.InputTuple, BorrowerOperations_SortedTrovesAddressChangedEvent.OutputTuple, BorrowerOperations_SortedTrovesAddressChangedEvent.OutputObject>;
		getEvent(key: 'StabilityPoolAddressChanged'): TypedContractEvent<BorrowerOperations_StabilityPoolAddressChangedEvent.InputTuple, BorrowerOperations_StabilityPoolAddressChangedEvent.OutputTuple, BorrowerOperations_StabilityPoolAddressChangedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}Created`): TypedContractEvent<BorrowerOperations_TroveCreatedEvent.InputTuple, BorrowerOperations_TroveCreatedEvent.OutputTuple, BorrowerOperations_TroveCreatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}ManagerAddressChanged`): TypedContractEvent<BorrowerOperations_TroveManagerAddressChangedEvent.InputTuple, BorrowerOperations_TroveManagerAddressChangedEvent.OutputTuple, BorrowerOperations_TroveManagerAddressChangedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}Updated`): TypedContractEvent<BorrowerOperations_TroveUpdatedEvent.InputTuple, BorrowerOperations_TroveUpdatedEvent.OutputTuple, BorrowerOperations_TroveUpdatedEvent.OutputObject>;

		filters: BorrowerOperationsTypedContractEventFilters<M>
	};
