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

type LQTYTokenFunctionNameOrSignature<M extends Modifiers> =
	| 'ONE_YEAR_IN_SECONDS'
	| 'allowance'
	| 'approve'
	| 'balanceOf'
	| 'communityIssuanceAddress'
	| 'decimals'
	| 'decreaseAllowance'
	| 'domainSeparator'
	| 'getDeploymentStartTime'
	| 'getLpRewardsEntitlement'
	| 'increaseAllowance'
	| 'lockupContractFactory'
	| `${M['lqty']}StakingAddress`
	| 'multisigAddress'
	| 'name'
	| 'nonces'
	| 'permit'
	| 'permitTypeHash'
	| `sendTo${Uppercase<M['lqty']>}Staking`
	| 'symbol'
	| 'totalSupply'
	| 'transfer'
	| 'transferFrom'
	| 'version'

type LQTYTokenEventNameOrSignatureOrTopic<M extends Modifiers> =
	| 'Approval'
	| 'CommunityIssuanceAddressSet'
	| `${Uppercase<M['lqty']>}StakingAddressSet`
	| 'LockupContractFactoryAddressSet'
	| 'Transfer'

export interface LQTYTokenInterface<M extends Modifiers> extends Interface {
	getFunction(
		nameOrSignature: LQTYTokenFunctionNameOrSignature<M>
	): FunctionFragment;

	getEvent(
		nameOrSignatureOrTopic: LQTYTokenEventNameOrSignatureOrTopic<M>
	): EventFragment;

	encodeFunctionData(functionFragment: 'ONE_YEAR_IN_SECONDS', values?: undefined): string;
	encodeFunctionData(functionFragment: 'allowance', values: [AddressLike, AddressLike]): string;
	encodeFunctionData(functionFragment: 'approve', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'balanceOf', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'communityIssuanceAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'decimals', values?: undefined): string;
	encodeFunctionData(functionFragment: 'decreaseAllowance', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'domainSeparator', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getDeploymentStartTime', values?: undefined): string;
	encodeFunctionData(functionFragment: 'getLpRewardsEntitlement', values?: undefined): string;
	encodeFunctionData(functionFragment: 'increaseAllowance', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'lockupContractFactory', values?: undefined): string;
	encodeFunctionData(functionFragment: `${M['lqty']}StakingAddress`, values?: undefined): string;
	encodeFunctionData(functionFragment: 'multisigAddress', values?: undefined): string;
	encodeFunctionData(functionFragment: 'name', values?: undefined): string;
	encodeFunctionData(functionFragment: 'nonces', values: [AddressLike]): string;
	encodeFunctionData(functionFragment: 'permit', values: [ AddressLike, AddressLike, BigNumberish, BigNumberish, BigNumberish, BytesLike, BytesLike]): string;
	encodeFunctionData(functionFragment: 'permitTypeHash', values?: undefined): string;
	encodeFunctionData(functionFragment: `sendTo${Uppercase<M['lqty']>}Staking`, values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'symbol', values?: undefined): string;
	encodeFunctionData(functionFragment: 'totalSupply', values?: undefined): string;
	encodeFunctionData(functionFragment: 'transfer', values: [AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'transferFrom', values: [AddressLike, AddressLike, BigNumberish]): string;
	encodeFunctionData(functionFragment: 'version', values?: undefined): string;

	decodeFunctionResult(functionFragment: 'ONE_YEAR_IN_SECONDS', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'allowance', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'communityIssuanceAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'decimals', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'decreaseAllowance', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'domainSeparator', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getDeploymentStartTime', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'getLpRewardsEntitlement', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'increaseAllowance', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'lockupContractFactory', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `${M['lqty']}StakingAddress`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'multisigAddress', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'nonces', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'permit', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'permitTypeHash', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: `sendTo${Uppercase<M['lqty']>}Staking`, data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'symbol', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'totalSupply', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'transfer', data: BytesLike): Result;
	decodeFunctionResult(functionFragment: 'transferFrom', data: BytesLike): Result;
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

export namespace CommunityIssuanceAddressSetEvent {
	export type InputTuple = [_communityIssuanceAddress: AddressLike];
	export type OutputTuple = [_communityIssuanceAddress: string];
	export interface OutputObject {
		_communityIssuanceAddress: string;
	}
	export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
	export type Filter = TypedDeferredTopicFilter<Event>;
	export type Log = TypedEventLog<Event>;
	export type LogDescription = TypedLogDescription<Event>;
}

export namespace LQTYStakingAddressSetEvent {
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

export namespace LockupContractFactoryAddressSetEvent {
	export type InputTuple = [_lockupContractFactoryAddress: AddressLike];
	export type OutputTuple = [_lockupContractFactoryAddress: string];
	export interface OutputObject {
		_lockupContractFactoryAddress: string;
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

type LQTYTokenTypedContractMethods<M extends Modifiers> = {
	ONE_YEAR_IN_SECONDS: TypedContractMethod<[], [bigint], 'view'>;
	allowance: TypedContractMethod<[owner: AddressLike, spender: AddressLike], [bigint], 'view'>;
	approve: TypedContractMethod<[spender: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
	balanceOf: TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
	communityIssuanceAddress: TypedContractMethod<[], [string], 'view'>;
	decimals: TypedContractMethod<[], [bigint], 'view'>;
	decreaseAllowance: TypedContractMethod<[spender: AddressLike, subtractedValue: BigNumberish], [boolean], 'nonpayable'>;
	domainSeparator: TypedContractMethod<[], [string], 'view'>;
	getDeploymentStartTime: TypedContractMethod<[], [bigint], 'view'>;
	getLpRewardsEntitlement: TypedContractMethod<[], [bigint], 'view'>;
	increaseAllowance: TypedContractMethod<[spender: AddressLike, addedValue: BigNumberish], [boolean], 'nonpayable'>;
	lockupContractFactory: TypedContractMethod<[], [string], 'view'>;
	multisigAddress: TypedContractMethod<[], [string], 'view'>;
	name: TypedContractMethod<[], [string], 'view'>;
	nonces: TypedContractMethod<[owner: AddressLike], [bigint], 'view'>;
	permit: TypedContractMethod<[owner: AddressLike, spender: AddressLike, amount: BigNumberish, deadline: BigNumberish, v: BigNumberish, r: BytesLike, s: BytesLike], [void], 'nonpayable'>;
	permitTypeHash: TypedContractMethod<[], [string], 'view'>;
	symbol: TypedContractMethod<[], [string], 'view'>;
	totalSupply: TypedContractMethod<[], [bigint], 'view'>;
	transfer: TypedContractMethod<[recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
	transferFrom: TypedContractMethod<[sender: AddressLike, recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
	version: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `${M['lqty']}StakingAddress`]: TypedContractMethod<[], [string], 'view'>;
} & {
	[K in `sendTo${Uppercase<M['lqty']>}Staking`]: TypedContractMethod<[_sender: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
};

type LQTYTokenTypedContractEventFilters<M extends Modifiers> = {
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

	'CommunityIssuanceAddressSet(address)': TypedContractEvent<
		CommunityIssuanceAddressSetEvent.InputTuple,
		CommunityIssuanceAddressSetEvent.OutputTuple,
		CommunityIssuanceAddressSetEvent.OutputObject
	>;
	'CommunityIssuanceAddressSet': TypedContractEvent<
		CommunityIssuanceAddressSetEvent.InputTuple,
		CommunityIssuanceAddressSetEvent.OutputTuple,
		CommunityIssuanceAddressSetEvent.OutputObject
	>;

	'LockupContractFactoryAddressSet(address)': TypedContractEvent<
		LockupContractFactoryAddressSetEvent.InputTuple,
		LockupContractFactoryAddressSetEvent.OutputTuple,
		LockupContractFactoryAddressSetEvent.OutputObject
	>;
	'LockupContractFactoryAddressSet': TypedContractEvent<
		LockupContractFactoryAddressSetEvent.InputTuple,
		LockupContractFactoryAddressSetEvent.OutputTuple,
		LockupContractFactoryAddressSetEvent.OutputObject
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
	[K in `${Uppercase<M['lqty']>}StakingAddressSet(address)`]: TypedContractEvent<
		LQTYStakingAddressSetEvent.InputTuple,
		LQTYStakingAddressSetEvent.OutputTuple,
		LQTYStakingAddressSetEvent.OutputObject
	>;
} & {
	[K in `${Uppercase<M['lqty']>}StakingAddressSet`]: TypedContractEvent<
		LQTYStakingAddressSetEvent.InputTuple,
		LQTYStakingAddressSetEvent.OutputTuple,
		LQTYStakingAddressSetEvent.OutputObject
	>;
};

export type LQTYToken<M extends Modifiers> = BaseContract &
	LQTYTokenTypedContractMethods<M> & {
		connect(runner?: ContractRunner | null): LQTYToken<M>;
		waitForDeployment<T>(): Promise<ThisType<T> & LQTYToken<M>>;

		interface: LQTYTokenInterface<M>;

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
		): Promise<ThisType<T> & LQTYToken<M>>;
		on<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & LQTYToken<M>>;

		once<TCEvent extends TypedContractEvent, T>(
			event: TCEvent,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & LQTYToken<M>>;
		once<TCEvent extends TypedContractEvent, T>(
			filter: TypedDeferredTopicFilter<TCEvent>,
			listener: TypedListener<TCEvent>
		): Promise<ThisType<T> & LQTYToken<M>>;

		listeners<TCEvent extends TypedContractEvent>(
			event: TCEvent
		): Promise<Array<TypedListener<TCEvent>>>;
		listeners(eventName?: string): Promise<Array<Listener>>;

		removeAllListeners<TCEvent extends TypedContractEvent, T>(
			event?: TCEvent
		): Promise<ThisType<T> & LQTYToken<M>>;

		getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
		getFunction(nameOrSignature: 'ONE_YEAR_IN_SECONDS'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'allowance'): TypedContractMethod<[owner: AddressLike, spender: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'approve'): TypedContractMethod<[spender: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'balanceOf'): TypedContractMethod<[account: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'communityIssuanceAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'decimals'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'decreaseAllowance'): TypedContractMethod<[spender: AddressLike, subtractedValue: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'domainSeparator'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'getDeploymentStartTime'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'getLpRewardsEntitlement'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'increaseAllowance'): TypedContractMethod<[spender: AddressLike, addedValue: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'lockupContractFactory'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `${M['lqty']}StakingAddress`): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'multisigAddress'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'name'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'nonces'): TypedContractMethod<[owner: AddressLike], [bigint], 'view'>;
		getFunction(nameOrSignature: 'permit'): TypedContractMethod<[owner: AddressLike, spender: AddressLike, amount: BigNumberish, deadline: BigNumberish, v: BigNumberish, r: BytesLike, s: BytesLike], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'permitTypeHash'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: `sendTo${Uppercase<M['lqty']>}Staking`): TypedContractMethod<[_sender: AddressLike, _amount: BigNumberish], [void], 'nonpayable'>;
		getFunction(nameOrSignature: 'symbol'): TypedContractMethod<[], [string], 'view'>;
		getFunction(nameOrSignature: 'totalSupply'): TypedContractMethod<[], [bigint], 'view'>;
		getFunction(nameOrSignature: 'transfer'): TypedContractMethod<[recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'transferFrom'): TypedContractMethod<[sender: AddressLike, recipient: AddressLike, amount: BigNumberish], [boolean], 'nonpayable'>;
		getFunction(nameOrSignature: 'version'): TypedContractMethod<[], [string], 'view'>;

		getEvent(key: 'Approval'): TypedContractEvent<ApprovalEvent.InputTuple, ApprovalEvent.OutputTuple, ApprovalEvent.OutputObject>;
		getEvent(key: 'CommunityIssuanceAddressSet'): TypedContractEvent<CommunityIssuanceAddressSetEvent.InputTuple, CommunityIssuanceAddressSetEvent.OutputTuple, CommunityIssuanceAddressSetEvent.OutputObject>;
		getEvent(key: `${Uppercase<M['lqty']>}StakingAddressSet`): TypedContractEvent<LQTYStakingAddressSetEvent.InputTuple, LQTYStakingAddressSetEvent.OutputTuple, LQTYStakingAddressSetEvent.OutputObject>;
		getEvent(key: 'LockupContractFactoryAddressSet'): TypedContractEvent<LockupContractFactoryAddressSetEvent.InputTuple, LockupContractFactoryAddressSetEvent.OutputTuple, LockupContractFactoryAddressSetEvent.OutputObject>;
		getEvent(key: 'Transfer'): TypedContractEvent<TransferEvent.InputTuple, TransferEvent.OutputTuple, TransferEvent.OutputObject>;

		filters: LQTYTokenTypedContractEventFilters<M>;
	};
