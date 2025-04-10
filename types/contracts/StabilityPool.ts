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

type StabilityPoolFunctionNameOrSignature<M extends Modifiers> =
	| 'BORROWING_FEE_FLOOR'
	| 'CCR'
	| 'DECIMAL_PRECISION'
	| `${Uppercase<M['lusd']>}_GAS_COMPENSATION`
	| 'MCR'
	| 'MIN_NET_DEBT'
	| 'NAME'
	| 'P'
	| 'PERCENT_DIVISOR'
	| 'SCALE_FACTOR'
	| '_100pct'
	| 'activePool'
	| 'borrowerOperations'
	| 'communityIssuance'
	| 'currentEpoch'
	| 'currentScale'
	| 'defaultPool'
	| 'depositSnapshots'
	| 'deposits'
	| 'epochToScaleToG'
	| 'epochToScaleToSum'
	| 'frontEndSnapshots'
	| 'frontEndStakes'
	| 'frontEnds'
	| 'getCompoundedFrontEndStake'
	| `getCompounded${Uppercase<M['lusd']>}Deposit`
	| `getDepositor${Uppercase<M['eth']>}Gain`
	| `getDepositor${Uppercase<M['lqty']>}Gain`
	| `get${Uppercase<M['eth']>}`
	| 'getEntireSystemColl'
	| 'getEntireSystemDebt'
	| `getFrontEnd${Uppercase<M['lqty']>}Gain`
	| `getTotal${Uppercase<M['lusd']>}Deposits`
	| 'isOwner'
	| `last${Uppercase<M['eth']>}Error_Offset`
	| `last${Uppercase<M['lqty']>}Error`
	| `last${Uppercase<M['lusd']>}LossError_Offset`
	| `${M['lusd']}Token`
	| 'offset'
	| 'owner'
	| 'priceFeed'
	| 'provideToSP'
	| 'registerFrontEnd'
	| 'setAddresses'
	| `sorted${Capitalize<M['trove']>}s`
	| `${M['trove']}Manager`
	| `withdraw${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`
	| 'withdrawFromSP'

type StabilityPoolEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'ActivePoolAddressChanged'
	| 'BorrowerOperationsAddressChanged'
	| 'CommunityIssuanceAddressChanged'
	| 'DefaultPoolAddressChanged'
	| 'DepositSnapshotUpdated'
	| `${Uppercase<M['eth']>}GainWithdrawn`
	| 'EpochUpdated'
	| `${M['ether']}Sent`
	| 'FrontEndRegistered'
	| 'FrontEndSnapshotUpdated'
	| 'FrontEndStakeChanged'
	| 'FrontEndTagSet'
	| 'G_Updated'
	| `${Uppercase<M['lqty']>}PaidToDepositor`
	| `${Uppercase<M['lqty']>}PaidToFrontEnd`
	| `${Uppercase<M['lusd']>}TokenAddressChanged`
	| 'OwnershipTransferred'
	| 'P_Updated'
	| 'PriceFeedAddressChanged'
	| 'S_Updated'
	| 'ScaleUpdated'
	| `Sorted${Capitalize<M['trove']>}sAddressChanged`
	| `StabilityPool${Uppercase<M['eth']>}BalanceUpdated`
	| `StabilityPool${Uppercase<M['lusd']>}BalanceUpdated`
	| `${Capitalize<M['trove']>}ManagerAddressChanged`
	| 'UserDepositChanged'

export interface StabilityPoolInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: StabilityPoolFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: StabilityPoolEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'BORROWING_FEE_FLOOR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'CCR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'DECIMAL_PRECISION', values?: undefined): string;
	encodeFunctionData(functionFragment: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'MCR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'MIN_NET_DEBT', values?: undefined): string;
	encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
	encodeFunctionData(functionFragment: 'P', values?: undefined): string;
	encodeFunctionData(functionFragment: 'PERCENT_DIVISOR', values?: undefined): string;
	encodeFunctionData(functionFragment: 'SCALE_FACTOR', values?: undefined): string;
	encodeFunctionData(functionFragment: '_100pct', values?: undefined): string;
	encodeFunctionData(functionFragment: 'activePool', values?: undefined): string;
	encodeFunctionData(functionFragment: 'borrowerOperations', values?: undefined): string;
	encodeFunctionData(functionFragment: 'communityIssuance', values?: undefined): string;
	encodeFunctionData(functionFragment: 'currentEpoch', values?: undefined): string;
	encodeFunctionData(functionFragment: 'currentScale', values?: undefined): string;
	encodeFunctionData(functionFragment: 'defaultPool', values?: undefined): string;
	encodeFunctionData(functionFragment: 'depositSnapshots', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'deposits', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'epochToScaleToG', values: [BigNumberish, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'epochToScaleToSum', values: [BigNumberish, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'frontEndSnapshots', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'frontEndStakes', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'frontEnds', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'getCompoundedFrontEndStake', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `getCompounded${Uppercase<M['lusd']>}Deposit`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `getDepositor${Uppercase<M['eth']>}Gain`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `getDepositor${Uppercase<M['lqty']>}Gain`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `get${Uppercase<M['eth']>}`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'getEntireSystemColl', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getEntireSystemDebt', values?: undefined): string;
	encodeFunctionData(functionFragment: `getFrontEnd${Uppercase<M['lqty']>}Gain`, values: [AddressLike]): string;
	encodeFunctionData(functionFragment: `getTotal${Uppercase<M['lusd']>}Deposits`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'isOwner', values?: undefined): string;
	encodeFunctionData(functionFragment: `last${Uppercase<M['eth']>}Error_Offset`, values?: undefined): string;
	encodeFunctionData(functionFragment: `last${Uppercase<M['lqty']>}Error`, values?: undefined): string;
	encodeFunctionData(functionFragment: `last${Uppercase<M['lusd']>}LossError_Offset`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lusd']}Token`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'offset', values: [BigNumberish, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
	encodeFunctionData(functionFragment: 'priceFeed', values?: undefined): string;
	encodeFunctionData(functionFragment: 'provideToSP', values: [BigNumberish, AddressLike]): string;
	encodeFunctionData(functionFragment: 'registerFrontEnd', values: [BigNumberish]): string;
	encodeFunctionData(functionFragment: 'setAddresses', values: [ AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: `sorted${Capitalize<M['trove']>}s`, values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['trove']}Manager`, values?: undefined): string;
	encodeFunctionData(functionFragment: `withdraw${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`, values: [AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'withdrawFromSP', values: [BigNumberish]): string;

	decodeFunctionResult(functionFragment: 'BORROWING_FEE_FLOOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'CCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'DECIMAL_PRECISION', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MCR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'MIN_NET_DEBT', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'P', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'PERCENT_DIVISOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'SCALE_FACTOR', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: '_100pct', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'activePool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'borrowerOperations', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'communityIssuance', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'currentEpoch', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'currentScale', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'defaultPool', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'depositSnapshots', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'deposits', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'epochToScaleToG', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'epochToScaleToSum', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'frontEndSnapshots', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'frontEndStakes', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'frontEnds', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getCompoundedFrontEndStake', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `getCompounded${Uppercase<M['lusd']>}Deposit`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `getDepositor${Uppercase<M['eth']>}Gain`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `getDepositor${Uppercase<M['lqty']>}Gain`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `get${Uppercase<M['eth']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getEntireSystemColl', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getEntireSystemDebt', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `getFrontEnd${Uppercase<M['lqty']>}Gain`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `getTotal${Uppercase<M['lusd']>}Deposits`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `last${Uppercase<M['eth']>}Error_Offset`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `last${Uppercase<M['lqty']>}Error`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `last${Uppercase<M['lusd']>}LossError_Offset`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lusd']}Token`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'offset', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'priceFeed', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'provideToSP', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'registerFrontEnd', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'setAddresses', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `sorted${Capitalize<M['trove']>}s`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['trove']}Manager`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `withdraw${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'withdrawFromSP', data: BytesLike): Result;
}

export namespace StabilityPool_ActivePoolAddressChangedEvent {
	export type InputTuple = [_newActivePoolAddress: AddressLike];
	export type OutputTuple = [_newActivePoolAddress: string];
	export interface OutputObject {
		_newActivePoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_BorrowerOperationsAddressChangedEvent {
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

export namespace StabilityPool_CommunityIssuanceAddressChangedEvent {
	export type InputTuple = [_newCommunityIssuanceAddress: AddressLike];
	export type OutputTuple = [_newCommunityIssuanceAddress: string];
	export interface OutputObject {
		_newCommunityIssuanceAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_DefaultPoolAddressChangedEvent {
	export type InputTuple = [_newDefaultPoolAddress: AddressLike];
	export type OutputTuple = [_newDefaultPoolAddress: string];
	export interface OutputObject {
		_newDefaultPoolAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_DepositSnapshotUpdatedEvent {
	export type InputTuple = [_depositor: AddressLike, _P: BigNumberish, _S: BigNumberish, _G: BigNumberish];
	export type OutputTuple = [_depositor: string, _P: bigint, _S: bigint, _G: bigint];
	export interface OutputObject {
		_depositor: string;
		_P: bigint;
		_S: bigint;
		_G: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_ETHGainWithdrawnEvent {
	export type InputTuple = [_depositor: AddressLike, _ETH: BigNumberish, _LUSDLoss: BigNumberish];
	export type OutputTuple = [_depositor: string, _ETH: bigint, _LUSDLoss: bigint];
	export interface OutputObject {
		_depositor: string;
		_ETH: bigint;
		_LUSDLoss: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_EpochUpdatedEvent {
	export type InputTuple = [_currentEpoch: BigNumberish];
	export type OutputTuple = [_currentEpoch: bigint];
	export interface OutputObject {
		_currentEpoch: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_EtherSentEvent {
	export type InputTuple = [_to: AddressLike, _amount: BigNumberish];
	export type OutputTuple = [_to: string, _amount: bigint];
	export interface OutputObject {
		_to: string;
		_amount: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_FrontEndRegisteredEvent {
	export type InputTuple = [_frontEnd: AddressLike, _kickbackRate: BigNumberish];
	export type OutputTuple = [_frontEnd: string, _kickbackRate: bigint];
	export interface OutputObject {
		_frontEnd: string;
		_kickbackRate: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_FrontEndSnapshotUpdatedEvent {
	export type InputTuple = [_frontEnd: AddressLike, _P: BigNumberish, _G: BigNumberish];
	export type OutputTuple = [_frontEnd: string, _P: bigint, _G: bigint];
	export interface OutputObject {
		_frontEnd: string;
		_P: bigint;
		_G: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_FrontEndStakeChangedEvent {
	export type InputTuple = [_frontEnd: AddressLike, _newFrontEndStake: BigNumberish, _depositor: AddressLike];
	export type OutputTuple = [_frontEnd: string, _newFrontEndStake: bigint, _depositor: string];
	export interface OutputObject {
		_frontEnd: string;
		_newFrontEndStake: bigint;
		_depositor: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_FrontEndTagSetEvent {
	export type InputTuple = [_depositor: AddressLike, _frontEnd: AddressLike];
	export type OutputTuple = [_depositor: string, _frontEnd: string];
	export interface OutputObject {
		_depositor: string;
		_frontEnd: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_G_UpdatedEvent {
	export type InputTuple = [_G: BigNumberish, _epoch: BigNumberish, _scale: BigNumberish];
	export type OutputTuple = [_G: bigint, _epoch: bigint, _scale: bigint];
	export interface OutputObject {
		_G: bigint;
		_epoch: bigint;
		_scale: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_LQTYPaidToDepositorEvent {
	export type InputTuple = [_depositor: AddressLike, _LQTY: BigNumberish];
	export type OutputTuple = [_depositor: string, _LQTY: bigint];
	export interface OutputObject {
		_depositor: string;
		_LQTY: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_LQTYPaidToFrontEndEvent {
	export type InputTuple = [_frontEnd: AddressLike, _LQTY: BigNumberish];
	export type OutputTuple = [_frontEnd: string, _LQTY: bigint];
	export interface OutputObject {
		_frontEnd: string;
		_LQTY: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_LUSDTokenAddressChangedEvent {
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

export namespace StabilityPool_OwnershipTransferredEvent {
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

export namespace StabilityPool_P_UpdatedEvent {
	export type InputTuple = [_P: BigNumberish];
	export type OutputTuple = [_P: bigint];
	export interface OutputObject {
		_P: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_PriceFeedAddressChangedEvent {
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

export namespace StabilityPool_S_UpdatedEvent {
	export type InputTuple = [_S: BigNumberish, _epoch: BigNumberish, _scale: BigNumberish];
	export type OutputTuple = [_S: bigint, _epoch: bigint, _scale: bigint];
	export interface OutputObject {
		_S: bigint;
		_epoch: bigint;
		_scale: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_ScaleUpdatedEvent {
	export type InputTuple = [_currentScale: BigNumberish];
	export type OutputTuple = [_currentScale: bigint];
	export interface OutputObject {
		_currentScale: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_SortedTrovesAddressChangedEvent {
	export type InputTuple = [_newSortedTrovesAddress: AddressLike];
	export type OutputTuple = [_newSortedTrovesAddress: string];
	export interface OutputObject {
		_newSortedTrovesAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_StabilityPoolETHBalanceUpdatedEvent {
	export type InputTuple = [_newBalance: BigNumberish];
	export type OutputTuple = [_newBalance: bigint];
	export interface OutputObject {
		_newBalance: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent {
	export type InputTuple = [_newBalance: BigNumberish];
	export type OutputTuple = [_newBalance: bigint];
	export interface OutputObject {
		_newBalance: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace StabilityPool_TroveManagerAddressChangedEvent {
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

export namespace StabilityPool_UserDepositChangedEvent {
	export type InputTuple = [_depositor: AddressLike, _newDeposit: BigNumberish];
	export type OutputTuple = [_depositor: string, _newDeposit: bigint];
	export interface OutputObject {
		_depositor: string;
		_newDeposit: bigint;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

type StabilityPoolTypedContractMethods<M extends Modifiers> = {
	BORROWING_FEE_FLOOR: TypedContractMethod<[], [bigint], 'view'>;
	CCR: TypedContractMethod<[], [bigint], 'view'>;
	DECIMAL_PRECISION: TypedContractMethod<[], [bigint], 'view'>;
	MCR: TypedContractMethod<[], [bigint], 'view'>;
	MIN_NET_DEBT: TypedContractMethod<[], [bigint], 'view'>;
	NAME: TypedContractMethod<[], [string], 'view'>;
	P: TypedContractMethod<[], [bigint], 'view'>;
	PERCENT_DIVISOR: TypedContractMethod<[], [bigint], 'view'>;
	SCALE_FACTOR: TypedContractMethod<[], [bigint], 'view'>;
	_100pct: TypedContractMethod<[], [bigint], 'view'>;
	activePool: TypedContractMethod<[], [string], 'view'>;
	borrowerOperations: TypedContractMethod<[], [string], 'view'>;
	communityIssuance: TypedContractMethod<[], [string], 'view'>;
	currentEpoch: TypedContractMethod<[], [bigint], 'view'>;
	currentScale: TypedContractMethod<[], [bigint], 'view'>;
	defaultPool: TypedContractMethod<[], [string], 'view'>;
	depositSnapshots: TypedContractMethod<[arg0: AddressLike], [[bigint, bigint, bigint, bigint, bigint] & {S: bigint; P: bigint; G: bigint; scale: bigint; epoch: bigint;}], 'view'>;
	deposits: TypedContractMethod<[arg0: AddressLike], [[bigint, string] & { initialValue: bigint; frontEndTag: string }], 'view'>;
	epochToScaleToG: TypedContractMethod<[arg0: BigNumberish, arg1: BigNumberish], [bigint], 'view'>;
	epochToScaleToSum: TypedContractMethod<[arg0: BigNumberish, arg1: BigNumberish], [bigint], 'view'>;
	frontEndSnapshots: TypedContractMethod<[arg0: AddressLike], [[bigint, bigint, bigint, bigint, bigint] & {S: bigint; P: bigint; G: bigint; scale: bigint; epoch: bigint;}], 'view'>;
	frontEndStakes: TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;
	frontEnds: TypedContractMethod<[arg0: AddressLike], [[bigint, boolean] & { kickbackRate: bigint; registered: boolean }], 'view'>;
	getCompoundedFrontEndStake: TypedContractMethod<[_frontEnd: AddressLike], [bigint], 'view'>;
	getEntireSystemColl: TypedContractMethod<[], [bigint], 'view'>;
	getEntireSystemDebt: TypedContractMethod<[], [bigint], 'view'>;
	isOwner: TypedContractMethod<[], [boolean], 'view'>;
	offset: TypedContractMethod<[_debtToOffset: BigNumberish, _collToAdd: BigNumberish], [void], 'nonpayable'>;
	owner: TypedContractMethod<[], [string], 'view'>;
	priceFeed: TypedContractMethod<[], [string], 'view'>;
	provideToSP: TypedContractMethod<[_amount: BigNumberish, _frontEndTag: AddressLike], [void], 'nonpayable'>;
	registerFrontEnd: TypedContractMethod<[_kickbackRate: BigNumberish], [void], 'nonpayable'>;
	setAddresses: TypedContractMethod<[_borrowerOperationsAddress: AddressLike, _troveManagerAddress: AddressLike, _activePoolAddress: AddressLike, _lusdTokenAddress: AddressLike, _sortedTrovesAddress: AddressLike, _priceFeedAddress: AddressLike, _communityIssuanceAddress: AddressLike], [void], 'nonpayable'>;
	withdrawFromSP: TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;
} & {
	[K in `${Uppercase<M['lusd']>}_GAS_COMPENSATION`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `getCompounded${Uppercase<M['lusd']>}Deposit`]: TypedContractMethod<[_depositor: AddressLike], [bigint], 'view'>;
} & {
	[K in `getDepositor${Uppercase<M['eth']>}Gain`]: TypedContractMethod<[_depositor: AddressLike], [bigint], 'view'>;
} & {
	[K in `getDepositor${Uppercase<M['lqty']>}Gain`]: TypedContractMethod<[_depositor: AddressLike], [bigint], 'view'>;
} & {
	[K in `get${Uppercase<M['eth']>}`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `getFrontEnd${Uppercase<M['lqty']>}Gain`]: TypedContractMethod<[_frontEnd: AddressLike], [bigint], 'view'>;
} & {
	[K in `getTotal${Uppercase<M['lusd']>}Deposits`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `last${Uppercase<M['eth']>}Error_Offset`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `last${Uppercase<M['lqty']>}Error`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `last${Uppercase<M['lusd']>}LossError_Offset`]: TypedContractMethod<[], [bigint], 'view'>;
} & {
	[K in `${M['lusd']}Token`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `sorted${Capitalize<M['trove']>}s`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['trove']}Manager`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `withdraw${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`]: TypedContractMethod<[_upperHint: AddressLike, _lowerHint: AddressLike], [void], 'nonpayable'>;
};

type StabilityPoolTypedContractEventFilters<M extends Modifiers> = {
	'ActivePoolAddressChanged(address)': TypedContractEvent<
		StabilityPool_ActivePoolAddressChangedEvent.InputTuple,
		StabilityPool_ActivePoolAddressChangedEvent.OutputTuple,
		StabilityPool_ActivePoolAddressChangedEvent.OutputObject
	>;
	'ActivePoolAddressChanged': TypedContractEvent<
		StabilityPool_ActivePoolAddressChangedEvent.InputTuple,
		StabilityPool_ActivePoolAddressChangedEvent.OutputTuple,
		StabilityPool_ActivePoolAddressChangedEvent.OutputObject
	>;

	'BorrowerOperationsAddressChanged(address)': TypedContractEvent<
		StabilityPool_BorrowerOperationsAddressChangedEvent.InputTuple,
		StabilityPool_BorrowerOperationsAddressChangedEvent.OutputTuple,
		StabilityPool_BorrowerOperationsAddressChangedEvent.OutputObject
	>;
	'BorrowerOperationsAddressChanged': TypedContractEvent<
		StabilityPool_BorrowerOperationsAddressChangedEvent.InputTuple,
		StabilityPool_BorrowerOperationsAddressChangedEvent.OutputTuple,
		StabilityPool_BorrowerOperationsAddressChangedEvent.OutputObject
	>;

	'CommunityIssuanceAddressChanged(address)': TypedContractEvent<
		StabilityPool_CommunityIssuanceAddressChangedEvent.InputTuple,
		StabilityPool_CommunityIssuanceAddressChangedEvent.OutputTuple,
		StabilityPool_CommunityIssuanceAddressChangedEvent.OutputObject
	>;
	'CommunityIssuanceAddressChanged': TypedContractEvent<
		StabilityPool_CommunityIssuanceAddressChangedEvent.InputTuple,
		StabilityPool_CommunityIssuanceAddressChangedEvent.OutputTuple,
		StabilityPool_CommunityIssuanceAddressChangedEvent.OutputObject
	>;

	'DefaultPoolAddressChanged(address)': TypedContractEvent<
		StabilityPool_DefaultPoolAddressChangedEvent.InputTuple,
		StabilityPool_DefaultPoolAddressChangedEvent.OutputTuple,
		StabilityPool_DefaultPoolAddressChangedEvent.OutputObject
	>;
	'DefaultPoolAddressChanged': TypedContractEvent<
		StabilityPool_DefaultPoolAddressChangedEvent.InputTuple,
		StabilityPool_DefaultPoolAddressChangedEvent.OutputTuple,
		StabilityPool_DefaultPoolAddressChangedEvent.OutputObject
	>;

	'DepositSnapshotUpdated(address,uint256,uint256,uint256)': TypedContractEvent<
		StabilityPool_DepositSnapshotUpdatedEvent.InputTuple,
		StabilityPool_DepositSnapshotUpdatedEvent.OutputTuple,
		StabilityPool_DepositSnapshotUpdatedEvent.OutputObject
	>;
	'DepositSnapshotUpdated': TypedContractEvent<
		StabilityPool_DepositSnapshotUpdatedEvent.InputTuple,
		StabilityPool_DepositSnapshotUpdatedEvent.OutputTuple,
		StabilityPool_DepositSnapshotUpdatedEvent.OutputObject
	>;

	'EpochUpdated(uint128)': TypedContractEvent<
		StabilityPool_EpochUpdatedEvent.InputTuple,
		StabilityPool_EpochUpdatedEvent.OutputTuple,
		StabilityPool_EpochUpdatedEvent.OutputObject
	>;
	'EpochUpdated': TypedContractEvent<
		StabilityPool_EpochUpdatedEvent.InputTuple,
		StabilityPool_EpochUpdatedEvent.OutputTuple,
		StabilityPool_EpochUpdatedEvent.OutputObject
	>;

	'FrontEndRegistered(address,uint256)': TypedContractEvent<
		StabilityPool_FrontEndRegisteredEvent.InputTuple,
		StabilityPool_FrontEndRegisteredEvent.OutputTuple,
		StabilityPool_FrontEndRegisteredEvent.OutputObject
	>;
	'FrontEndRegistered': TypedContractEvent<
		StabilityPool_FrontEndRegisteredEvent.InputTuple,
		StabilityPool_FrontEndRegisteredEvent.OutputTuple,
		StabilityPool_FrontEndRegisteredEvent.OutputObject
	>;

	'FrontEndSnapshotUpdated(address,uint256,uint256)': TypedContractEvent<
		StabilityPool_FrontEndSnapshotUpdatedEvent.InputTuple,
		StabilityPool_FrontEndSnapshotUpdatedEvent.OutputTuple,
		StabilityPool_FrontEndSnapshotUpdatedEvent.OutputObject
	>;
	'FrontEndSnapshotUpdated': TypedContractEvent<
		StabilityPool_FrontEndSnapshotUpdatedEvent.InputTuple,
		StabilityPool_FrontEndSnapshotUpdatedEvent.OutputTuple,
		StabilityPool_FrontEndSnapshotUpdatedEvent.OutputObject
	>;

	'FrontEndStakeChanged(address,uint256,address)': TypedContractEvent<
		StabilityPool_FrontEndStakeChangedEvent.InputTuple,
		StabilityPool_FrontEndStakeChangedEvent.OutputTuple,
		StabilityPool_FrontEndStakeChangedEvent.OutputObject
	>;
	'FrontEndStakeChanged': TypedContractEvent<
		StabilityPool_FrontEndStakeChangedEvent.InputTuple,
		StabilityPool_FrontEndStakeChangedEvent.OutputTuple,
		StabilityPool_FrontEndStakeChangedEvent.OutputObject
	>;

	'FrontEndTagSet(address,address)': TypedContractEvent<
		StabilityPool_FrontEndTagSetEvent.InputTuple,
		StabilityPool_FrontEndTagSetEvent.OutputTuple,
		StabilityPool_FrontEndTagSetEvent.OutputObject
	>;
	'FrontEndTagSet': TypedContractEvent<
		StabilityPool_FrontEndTagSetEvent.InputTuple,
		StabilityPool_FrontEndTagSetEvent.OutputTuple,
		StabilityPool_FrontEndTagSetEvent.OutputObject
	>;

	'G_Updated(uint256,uint128,uint128)': TypedContractEvent<
		StabilityPool_G_UpdatedEvent.InputTuple,
		StabilityPool_G_UpdatedEvent.OutputTuple,
		StabilityPool_G_UpdatedEvent.OutputObject
	>;
	'G_Updated': TypedContractEvent<
		StabilityPool_G_UpdatedEvent.InputTuple,
		StabilityPool_G_UpdatedEvent.OutputTuple,
		StabilityPool_G_UpdatedEvent.OutputObject
	>;

	'OwnershipTransferred(address,address)': TypedContractEvent<
		StabilityPool_OwnershipTransferredEvent.InputTuple,
		StabilityPool_OwnershipTransferredEvent.OutputTuple,
		StabilityPool_OwnershipTransferredEvent.OutputObject
	>;
	'OwnershipTransferred': TypedContractEvent<
		StabilityPool_OwnershipTransferredEvent.InputTuple,
		StabilityPool_OwnershipTransferredEvent.OutputTuple,
		StabilityPool_OwnershipTransferredEvent.OutputObject
	>;

	'P_Updated(uint256)': TypedContractEvent<
		StabilityPool_P_UpdatedEvent.InputTuple,
		StabilityPool_P_UpdatedEvent.OutputTuple,
		StabilityPool_P_UpdatedEvent.OutputObject
	>;
	'P_Updated': TypedContractEvent<
		StabilityPool_P_UpdatedEvent.InputTuple,
		StabilityPool_P_UpdatedEvent.OutputTuple,
		StabilityPool_P_UpdatedEvent.OutputObject
	>;

	'PriceFeedAddressChanged(address)': TypedContractEvent<
		StabilityPool_PriceFeedAddressChangedEvent.InputTuple,
		StabilityPool_PriceFeedAddressChangedEvent.OutputTuple,
		StabilityPool_PriceFeedAddressChangedEvent.OutputObject
	>;
	'PriceFeedAddressChanged': TypedContractEvent<
		StabilityPool_PriceFeedAddressChangedEvent.InputTuple,
		StabilityPool_PriceFeedAddressChangedEvent.OutputTuple,
		StabilityPool_PriceFeedAddressChangedEvent.OutputObject
	>;

	'S_Updated(uint256,uint128,uint128)': TypedContractEvent<
		StabilityPool_S_UpdatedEvent.InputTuple,
		StabilityPool_S_UpdatedEvent.OutputTuple,
		StabilityPool_S_UpdatedEvent.OutputObject
	>;
	'S_Updated': TypedContractEvent<
		StabilityPool_S_UpdatedEvent.InputTuple,
		StabilityPool_S_UpdatedEvent.OutputTuple,
		StabilityPool_S_UpdatedEvent.OutputObject
	>;

	'ScaleUpdated(uint128)': TypedContractEvent<
		StabilityPool_ScaleUpdatedEvent.InputTuple,
		StabilityPool_ScaleUpdatedEvent.OutputTuple,
		StabilityPool_ScaleUpdatedEvent.OutputObject
	>;
	'ScaleUpdated': TypedContractEvent<
		StabilityPool_ScaleUpdatedEvent.InputTuple,
		StabilityPool_ScaleUpdatedEvent.OutputTuple,
		StabilityPool_ScaleUpdatedEvent.OutputObject
	>;

	'UserDepositChanged(address,uint256)': TypedContractEvent<
		StabilityPool_UserDepositChangedEvent.InputTuple,
		StabilityPool_UserDepositChangedEvent.OutputTuple,
		StabilityPool_UserDepositChangedEvent.OutputObject
	>;
	'UserDepositChanged': TypedContractEvent<
		StabilityPool_UserDepositChangedEvent.InputTuple,
		StabilityPool_UserDepositChangedEvent.OutputTuple,
		StabilityPool_UserDepositChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['eth']>}GainWithdrawn(address,uint256,uint256)`]: TypedContractEvent<
		StabilityPool_ETHGainWithdrawnEvent.InputTuple,
		StabilityPool_ETHGainWithdrawnEvent.OutputTuple,
		StabilityPool_ETHGainWithdrawnEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['eth']>}GainWithdrawn`]: TypedContractEvent<
		StabilityPool_ETHGainWithdrawnEvent.InputTuple,
		StabilityPool_ETHGainWithdrawnEvent.OutputTuple,
		StabilityPool_ETHGainWithdrawnEvent.OutputObject
	>;
} & {
	[K in `${M['ether']}Sent(address,uint256)`]: TypedContractEvent<
		StabilityPool_EtherSentEvent.InputTuple,
		StabilityPool_EtherSentEvent.OutputTuple,
		StabilityPool_EtherSentEvent.OutputObject
	>;
} & {
	[K in `${M['ether']}Sent`]: TypedContractEvent<
		StabilityPool_EtherSentEvent.InputTuple,
		StabilityPool_EtherSentEvent.OutputTuple,
		StabilityPool_EtherSentEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}PaidToDepositor(address,uint256)`]: TypedContractEvent<
		StabilityPool_LQTYPaidToDepositorEvent.InputTuple,
		StabilityPool_LQTYPaidToDepositorEvent.OutputTuple,
		StabilityPool_LQTYPaidToDepositorEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}PaidToDepositor`]: TypedContractEvent<
		StabilityPool_LQTYPaidToDepositorEvent.InputTuple,
		StabilityPool_LQTYPaidToDepositorEvent.OutputTuple,
		StabilityPool_LQTYPaidToDepositorEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}PaidToFrontEnd(address,uint256)`]: TypedContractEvent<
		StabilityPool_LQTYPaidToFrontEndEvent.InputTuple,
		StabilityPool_LQTYPaidToFrontEndEvent.OutputTuple,
		StabilityPool_LQTYPaidToFrontEndEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}PaidToFrontEnd`]: TypedContractEvent<
		StabilityPool_LQTYPaidToFrontEndEvent.InputTuple,
		StabilityPool_LQTYPaidToFrontEndEvent.OutputTuple,
		StabilityPool_LQTYPaidToFrontEndEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressChanged(address)`]: TypedContractEvent<
		StabilityPool_LUSDTokenAddressChangedEvent.InputTuple,
		StabilityPool_LUSDTokenAddressChangedEvent.OutputTuple,
		StabilityPool_LUSDTokenAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lusd']>}TokenAddressChanged`]: TypedContractEvent<
		StabilityPool_LUSDTokenAddressChangedEvent.InputTuple,
		StabilityPool_LUSDTokenAddressChangedEvent.OutputTuple,
		StabilityPool_LUSDTokenAddressChangedEvent.OutputObject
	>;
} & {
	[K in `Sorted${Capitalize<M['trove']>}sAddressChanged(address)`]: TypedContractEvent<
		StabilityPool_SortedTrovesAddressChangedEvent.InputTuple,
		StabilityPool_SortedTrovesAddressChangedEvent.OutputTuple,
		StabilityPool_SortedTrovesAddressChangedEvent.OutputObject
	>;
} & {
	[K in `Sorted${Capitalize<M['trove']>}sAddressChanged`]: TypedContractEvent<
		StabilityPool_SortedTrovesAddressChangedEvent.InputTuple,
		StabilityPool_SortedTrovesAddressChangedEvent.OutputTuple,
		StabilityPool_SortedTrovesAddressChangedEvent.OutputObject
	>;
} & {
	[K in `StabilityPool${Uppercase<M['eth']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		StabilityPool_StabilityPoolETHBalanceUpdatedEvent.InputTuple,
		StabilityPool_StabilityPoolETHBalanceUpdatedEvent.OutputTuple,
		StabilityPool_StabilityPoolETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `StabilityPool${Uppercase<M['eth']>}BalanceUpdated`]: TypedContractEvent<
		StabilityPool_StabilityPoolETHBalanceUpdatedEvent.InputTuple,
		StabilityPool_StabilityPoolETHBalanceUpdatedEvent.OutputTuple,
		StabilityPool_StabilityPoolETHBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `StabilityPool${Uppercase<M['lusd']>}BalanceUpdated(uint256)`]: TypedContractEvent<
		StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent.InputTuple,
		StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent.OutputTuple,
		StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `StabilityPool${Uppercase<M['lusd']>}BalanceUpdated`]: TypedContractEvent<
		StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent.InputTuple,
		StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent.OutputTuple,
		StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressChanged(address)`]: TypedContractEvent<
		StabilityPool_TroveManagerAddressChangedEvent.InputTuple,
		StabilityPool_TroveManagerAddressChangedEvent.OutputTuple,
		StabilityPool_TroveManagerAddressChangedEvent.OutputObject
	>;
} & {
	[K in `${Capitalize<M['trove']>}ManagerAddressChanged`]: TypedContractEvent<
		StabilityPool_TroveManagerAddressChangedEvent.InputTuple,
		StabilityPool_TroveManagerAddressChangedEvent.OutputTuple,
		StabilityPool_TroveManagerAddressChangedEvent.OutputObject
	>;
};

export type StabilityPool<M extends Modifiers> = BaseContract &
	StabilityPoolTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): StabilityPool<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & StabilityPool<M>>;

		interface: StabilityPoolInterface<M>;

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
		): Promise<ThisType<T> & StabilityPool<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & StabilityPool<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & StabilityPool<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & StabilityPool<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;
		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & StabilityPool<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'BORROWING_FEE_FLOOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'CCR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'DECIMAL_PRECISION'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `${Uppercase<M['lusd']>}_GAS_COMPENSATION`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MCR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'MIN_NET_DEBT'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'P'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'PERCENT_DIVISOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'SCALE_FACTOR'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: '_100pct'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'activePool'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'borrowerOperations'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'communityIssuance'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'currentEpoch'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'currentScale'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'defaultPool'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'depositSnapshots'): TypedContractMethod<[arg0: AddressLike], [[bigint, bigint, bigint, bigint, bigint] & {S: bigint; P: bigint; G: bigint; scale: bigint; epoch: bigint;}], 'view'>;
		getFunction(nameOrSignature: 'deposits'): TypedContractMethod<[arg0: AddressLike], [[bigint, string] & { initialValue: bigint; frontEndTag: string }], 'view'>;
		getFunction(nameOrSignature: 'epochToScaleToG'): TypedContractMethod<[arg0: BigNumberish, arg1: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: 'epochToScaleToSum'): TypedContractMethod<[arg0: BigNumberish, arg1: BigNumberish], [bigint], 'view'>;
		getFunction(nameOrSignature: 'frontEndSnapshots'): TypedContractMethod<[arg0: AddressLike], [[bigint, bigint, bigint, bigint, bigint] & {S: bigint; P: bigint; G: bigint; scale: bigint; epoch: bigint;}], 'view'>;
		getFunction(nameOrSignature: 'frontEndStakes'): TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'frontEnds'): TypedContractMethod<[arg0: AddressLike], [[bigint, boolean] & { kickbackRate: bigint; registered: boolean }], 'view'>;
		getFunction(nameOrSignature: 'getCompoundedFrontEndStake'): TypedContractMethod<[_frontEnd: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `getCompounded${Uppercase<M['lusd']>}Deposit`): TypedContractMethod<[_depositor: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `getDepositor${Uppercase<M['eth']>}Gain`): TypedContractMethod<[_depositor: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `getDepositor${Uppercase<M['lqty']>}Gain`): TypedContractMethod<[_depositor: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `get${Uppercase<M['eth']>}`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getEntireSystemColl'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getEntireSystemDebt'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `getFrontEnd${Uppercase<M['lqty']>}Gain`): TypedContractMethod<[_frontEnd: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: `getTotal${Uppercase<M['lusd']>}Deposits`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'isOwner'): TypedContractMethod<[], [boolean], 'view'>;
		getFunction(nameOrSignature: `last${Uppercase<M['eth']>}Error_Offset`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `last${Uppercase<M['lqty']>}Error`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `last${Uppercase<M['lusd']>}LossError_Offset`): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: `${M['lusd']}Token`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'offset'): TypedContractMethod<[_debtToOffset: BigNumberish, _collToAdd: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'owner'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'priceFeed'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'provideToSP'): TypedContractMethod<[_amount: BigNumberish, _frontEndTag: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'registerFrontEnd'): TypedContractMethod<[_kickbackRate: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'setAddresses'): TypedContractMethod<[_borrowerOperationsAddress: AddressLike, _troveManagerAddress: AddressLike, _activePoolAddress: AddressLike, _lusdTokenAddress: AddressLike, _sortedTrovesAddress: AddressLike, _priceFeedAddress: AddressLike, _communityIssuanceAddress: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: `sorted${Capitalize<M['trove']>}s`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['trove']}Manager`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `withdraw${Uppercase<M['eth']>}GainTo${Capitalize<M['trove']>}`): TypedContractMethod<[_upperHint: AddressLike, _lowerHint: AddressLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'withdrawFromSP'): TypedContractMethod<[_amount: BigNumberish], [void], 'nonpayable'>;

		getEvent(key: 'ActivePoolAddressChanged'): TypedContractEvent<StabilityPool_ActivePoolAddressChangedEvent.InputTuple, StabilityPool_ActivePoolAddressChangedEvent.OutputTuple, StabilityPool_ActivePoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'BorrowerOperationsAddressChanged'): TypedContractEvent<StabilityPool_BorrowerOperationsAddressChangedEvent.InputTuple, StabilityPool_BorrowerOperationsAddressChangedEvent.OutputTuple, StabilityPool_BorrowerOperationsAddressChangedEvent.OutputObject>;
		getEvent(key: 'CommunityIssuanceAddressChanged'): TypedContractEvent<StabilityPool_CommunityIssuanceAddressChangedEvent.InputTuple, StabilityPool_CommunityIssuanceAddressChangedEvent.OutputTuple, StabilityPool_CommunityIssuanceAddressChangedEvent.OutputObject>;
		getEvent(key: 'DefaultPoolAddressChanged'): TypedContractEvent<StabilityPool_DefaultPoolAddressChangedEvent.InputTuple, StabilityPool_DefaultPoolAddressChangedEvent.OutputTuple, StabilityPool_DefaultPoolAddressChangedEvent.OutputObject>;
		getEvent(key: 'DepositSnapshotUpdated'): TypedContractEvent<StabilityPool_DepositSnapshotUpdatedEvent.InputTuple, StabilityPool_DepositSnapshotUpdatedEvent.OutputTuple, StabilityPool_DepositSnapshotUpdatedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['eth']>}GainWithdrawn`): TypedContractEvent<StabilityPool_ETHGainWithdrawnEvent.InputTuple, StabilityPool_ETHGainWithdrawnEvent.OutputTuple, StabilityPool_ETHGainWithdrawnEvent.OutputObject>;
		getEvent(key: 'EpochUpdated'): TypedContractEvent<StabilityPool_EpochUpdatedEvent.InputTuple, StabilityPool_EpochUpdatedEvent.OutputTuple, StabilityPool_EpochUpdatedEvent.OutputObject>;
		getEvent(key: `${M['ether']}Sent`): TypedContractEvent<StabilityPool_EtherSentEvent.InputTuple, StabilityPool_EtherSentEvent.OutputTuple, StabilityPool_EtherSentEvent.OutputObject>;
		getEvent(key: 'FrontEndRegistered'): TypedContractEvent<StabilityPool_FrontEndRegisteredEvent.InputTuple, StabilityPool_FrontEndRegisteredEvent.OutputTuple, StabilityPool_FrontEndRegisteredEvent.OutputObject>;
		getEvent(key: 'FrontEndSnapshotUpdated'): TypedContractEvent<StabilityPool_FrontEndSnapshotUpdatedEvent.InputTuple, StabilityPool_FrontEndSnapshotUpdatedEvent.OutputTuple, StabilityPool_FrontEndSnapshotUpdatedEvent.OutputObject>;
		getEvent(key: 'FrontEndStakeChanged'): TypedContractEvent<StabilityPool_FrontEndStakeChangedEvent.InputTuple, StabilityPool_FrontEndStakeChangedEvent.OutputTuple, StabilityPool_FrontEndStakeChangedEvent.OutputObject>;
		getEvent(key: 'FrontEndTagSet'): TypedContractEvent<StabilityPool_FrontEndTagSetEvent.InputTuple, StabilityPool_FrontEndTagSetEvent.OutputTuple, StabilityPool_FrontEndTagSetEvent.OutputObject>;
		getEvent(key: 'G_Updated'): TypedContractEvent<StabilityPool_G_UpdatedEvent.InputTuple, StabilityPool_G_UpdatedEvent.OutputTuple, StabilityPool_G_UpdatedEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lqty']>}PaidToDepositor`): TypedContractEvent<StabilityPool_LQTYPaidToDepositorEvent.InputTuple, StabilityPool_LQTYPaidToDepositorEvent.OutputTuple, StabilityPool_LQTYPaidToDepositorEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lqty']>}PaidToFrontEnd`): TypedContractEvent<StabilityPool_LQTYPaidToFrontEndEvent.InputTuple, StabilityPool_LQTYPaidToFrontEndEvent.OutputTuple, StabilityPool_LQTYPaidToFrontEndEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lusd']>}TokenAddressChanged`): TypedContractEvent<StabilityPool_LUSDTokenAddressChangedEvent.InputTuple, StabilityPool_LUSDTokenAddressChangedEvent.OutputTuple, StabilityPool_LUSDTokenAddressChangedEvent.OutputObject>;
		getEvent(key: 'OwnershipTransferred'): TypedContractEvent<StabilityPool_OwnershipTransferredEvent.InputTuple, StabilityPool_OwnershipTransferredEvent.OutputTuple, StabilityPool_OwnershipTransferredEvent.OutputObject>;
		getEvent(key: 'P_Updated'): TypedContractEvent<StabilityPool_P_UpdatedEvent.InputTuple, StabilityPool_P_UpdatedEvent.OutputTuple, StabilityPool_P_UpdatedEvent.OutputObject>;
		getEvent(key: 'PriceFeedAddressChanged'): TypedContractEvent<StabilityPool_PriceFeedAddressChangedEvent.InputTuple, StabilityPool_PriceFeedAddressChangedEvent.OutputTuple, StabilityPool_PriceFeedAddressChangedEvent.OutputObject>;
		getEvent(key: 'S_Updated'): TypedContractEvent<StabilityPool_S_UpdatedEvent.InputTuple, StabilityPool_S_UpdatedEvent.OutputTuple, StabilityPool_S_UpdatedEvent.OutputObject>;
		getEvent(key: 'ScaleUpdated'): TypedContractEvent<StabilityPool_ScaleUpdatedEvent.InputTuple, StabilityPool_ScaleUpdatedEvent.OutputTuple, StabilityPool_ScaleUpdatedEvent.OutputObject>;
		getEvent(key: `Sorted${Capitalize<M['trove']>}sAddressChanged`): TypedContractEvent<StabilityPool_SortedTrovesAddressChangedEvent.InputTuple, StabilityPool_SortedTrovesAddressChangedEvent.OutputTuple, StabilityPool_SortedTrovesAddressChangedEvent.OutputObject>;
		getEvent(key: `StabilityPool${Uppercase<M['eth']>}BalanceUpdated`): TypedContractEvent<StabilityPool_StabilityPoolETHBalanceUpdatedEvent.InputTuple, StabilityPool_StabilityPoolETHBalanceUpdatedEvent.OutputTuple, StabilityPool_StabilityPoolETHBalanceUpdatedEvent.OutputObject>;
		getEvent(key: `StabilityPool${Uppercase<M['lusd']>}BalanceUpdated`): TypedContractEvent<StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent.InputTuple, StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent.OutputTuple, StabilityPool_StabilityPoolLUSDBalanceUpdatedEvent.OutputObject>;
		getEvent(key: `${Capitalize<M['trove']>}ManagerAddressChanged`): TypedContractEvent<StabilityPool_TroveManagerAddressChangedEvent.InputTuple, StabilityPool_TroveManagerAddressChangedEvent.OutputTuple, StabilityPool_TroveManagerAddressChangedEvent.OutputObject>;
		getEvent(key: 'UserDepositChanged'): TypedContractEvent<StabilityPool_UserDepositChangedEvent.InputTuple, StabilityPool_UserDepositChangedEvent.OutputTuple, StabilityPool_UserDepositChangedEvent.OutputObject>;

		filters: StabilityPoolTypedContractEventFilters<M>;
	};
