import type { Address, PublicClient } from 'viem';
import type { ProtocolName } from '../protocols/protocols.js';
import type { GlobalState } from './global.js';
import type { ReplaceBrandedWordsInStringForAllProtocols } from '../protocols/rebrand.js';
import type { ExtractUnionValue } from '../utils/helpers.js';
import {
	borrowerOperationEnum,
	troveManagerOperationEnum
} from '../protocols/enums.js';
import { getCachedState, setCachedState } from './cache.js';
import { getAbiItem } from '../protocols/modify.js';
import { protocols } from '../protocols/protocols.js';
import { replaceBrandedWordsInString } from '../protocols/rebrand.js';

type DerivedFrom = 'event' | 'liquidation' | 'redemption';

export type UserState = {
	troveUpdatedBorrowerOperations: {
		coll: bigint;
		debt: bigint;
		stake: bigint;
		operation: (typeof borrowerOperationEnum)[number];
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	collBalanceUpdated: {
		balance: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	stakeChanged: {
		balance: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	stakingGainsWithdrawn: {
		ETHGain: bigint;
		LUSDGain: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	userDepositChanged: {
		balance: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	ETHGainWithdrawn: {
		ethGain: bigint;
		lusdLoss: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	LQTYPaidToDepositor: {
		amount: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	troveUpdatedTroveManager: {
		debt: bigint;
		coll: bigint;
		stake: bigint;
		operation: (typeof troveManagerOperationEnum)[number];
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
};

export async function getUserState(
	protocol: ProtocolName,
	userAddress: Address,
	client: PublicClient
) {
	const cachedState = (await getCachedState<UserState>(
		protocol,
		userAddress
	)) ?? {
		troveUpdatedBorrowerOperations: [],
		collBalanceUpdated: [],
		stakeChanged: [],
		stakingGainsWithdrawn: [],
		userDepositChanged: [],
		ETHGainWithdrawn: [],
		LQTYPaidToDepositor: [],
		troveUpdatedTroveManager: []
	};

	// Trove updated
	const troveUpdatedBorrowerOperationsAbi = getAbiItem(
		protocol,
		'borrowerOperations',
		'TroveUpdated'
	);
	// prettier-ignore
	const troveUpdatedBorrowerOperations = await client.getContractEvents({
		address: protocols[protocol].borrowerOperations,
		abi: [troveUpdatedBorrowerOperationsAbi],
		eventName: troveUpdatedBorrowerOperationsAbi.name,
		args: {
			_borrower: userAddress
		},
		fromBlock:
			cachedState.troveUpdatedBorrowerOperations.length > 0
				? cachedState.troveUpdatedBorrowerOperations[
					cachedState.troveUpdatedBorrowerOperations.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.troveUpdatedBorrowerOperations.push(
		...troveUpdatedBorrowerOperations.reduce<
			{
				coll: bigint;
				debt: bigint;
				stake: bigint;
				operation: (typeof borrowerOperationEnum)[number];
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _debt = e.args._debt;
			const _coll = e.args._coll;
			const stake = e.args.stake;
			const operation = borrowerOperationEnum[e.args.operation!];

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				debt: _debt!,
				coll: _coll!,
				stake: stake!,
				operation: operation!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// Coll surplus pool balance updated
	const collBalanceUpdatedAbi = getAbiItem(
		protocol,
		'collSurplusPool',
		'CollBalanceUpdated'
	);
	// prettier-ignore
	const collBalanceUpdated = await client.getContractEvents({
		address: protocols[protocol].collSurplusPool,
		abi: [collBalanceUpdatedAbi],
		eventName: collBalanceUpdatedAbi.name,
		args: {
			_account: userAddress
		},
		fromBlock:
			cachedState.collBalanceUpdated.length > 0
				? cachedState.collBalanceUpdated[
					cachedState.collBalanceUpdated.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.collBalanceUpdated.push(
		...collBalanceUpdated.reduce<
			{
				balance: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _newBalance = e.args._newBalance;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				balance: _newBalance!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// LQTY stake
	const stakeChangedAbi = getAbiItem(protocol, 'lqtyStaking', 'StakeChanged');
	// prettier-ignore
	const stakeChanged = await client.getContractEvents({
		address: protocols[protocol].lqtyStaking,
		abi: [stakeChangedAbi],
		eventName: stakeChangedAbi.name,
		args: {
			staker: userAddress
		},
		fromBlock:
			cachedState.stakeChanged.length > 0
				? cachedState.stakeChanged[cachedState.stakeChanged.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.stakeChanged.push(
		...stakeChanged.reduce<
			{
				balance: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const newStake = e.args.newStake;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				balance: newStake!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// LQTY staking gains withdrawn
	const stakingGainsWithdrawnAbi = getAbiItem(
		protocol,
		'lqtyStaking',
		'StakingGainsWithdrawn'
	);
	// prettier-ignore
	const stakingGainsWithdrawn = await client.getContractEvents({
		address: protocols[protocol].lqtyStaking,
		abi: [stakingGainsWithdrawnAbi],
		eventName: stakingGainsWithdrawnAbi.name,
		args: {
			staker: userAddress
		},
		fromBlock:
			cachedState.stakingGainsWithdrawn.length > 0
				? cachedState.stakingGainsWithdrawn[
					cachedState.stakingGainsWithdrawn.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.stakingGainsWithdrawn.push(
		...stakingGainsWithdrawn.reduce<
			{
				ETHGain: bigint;
				LUSDGain: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const ETHGain = replaceBrandedWordsInString(
				'ETHGain',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'ETHGain'>;

			const ethGain = e.args[
				ETHGain as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'ETHGain'>
			>;

			const LUSDGain = replaceBrandedWordsInString(
				'LUSDGain',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'LUSDGain'>;

			const lusdGain = e.args[
				LUSDGain as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'LUSDGain'>
			>;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				ETHGain: ethGain!,
				LUSDGain: lusdGain!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// LUSD deposited
	const userDepositChangedAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'UserDepositChanged'
	);
	// prettier-ignore
	const userDepositChanged = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [userDepositChangedAbi],
		eventName: userDepositChangedAbi.name,
		args: {
			_depositor: userAddress
		},
		fromBlock:
			cachedState.userDepositChanged.length > 0
				? cachedState.userDepositChanged[
					cachedState.userDepositChanged.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.userDepositChanged.push(
		...userDepositChanged.reduce<
			{
				balance: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _newDeposit = e.args._newDeposit;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				balance: _newDeposit!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// ETH gained
	const ETHGainWithdrawnAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'ETHGainWithdrawn'
	);
	// prettier-ignore
	const ETHGainWithdrawn = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [ETHGainWithdrawnAbi],
		eventName: ETHGainWithdrawnAbi.name,
		args: {
			_depositor: userAddress
		},
		fromBlock:
			cachedState.ETHGainWithdrawn.length > 0
				? cachedState.ETHGainWithdrawn[
					cachedState.ETHGainWithdrawn.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.ETHGainWithdrawn.push(
		...ETHGainWithdrawn.reduce<
			{
				ethGain: bigint;
				lusdLoss: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _ETH = replaceBrandedWordsInString(
				'_ETH',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_ETH'>;

			const eth = e.args[
				_ETH as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_ETH'>
			>;

			const _LUSDLoss = replaceBrandedWordsInString(
				'_LUSDLoss',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_LUSDLoss'>;

			const lusd = e.args[
				_LUSDLoss as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_LUSDLoss'>
			>;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				ethGain: eth!,
				lusdLoss: lusd!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// LQTY gained
	const LQTYPaidToDepositorAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'LQTYPaidToDepositor'
	);
	// prettier-ignore
	const LQTYPaidToDepositor = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [LQTYPaidToDepositorAbi],
		eventName: LQTYPaidToDepositorAbi.name,
		args: {
			_depositor: userAddress
		},
		fromBlock:
			cachedState.LQTYPaidToDepositor.length > 0
				? cachedState.LQTYPaidToDepositor[
					cachedState.LQTYPaidToDepositor.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.LQTYPaidToDepositor.push(
		...LQTYPaidToDepositor.reduce<
			{
				amount: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _LQTY = replaceBrandedWordsInString(
				'_LQTY',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_LQTY'>;

			const lqty = e.args[
				_LQTY as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_LQTY'>
			>;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				amount: lqty!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// Trove updated
	const troveUpdatedAbiTroveManager = getAbiItem(
		protocol,
		'troveManager',
		'TroveUpdated'
	);
	// prettier-ignore
	const troveUpdatedTroveManager = await client.getContractEvents({
		address: protocols[protocol].troveManager,
		abi: [troveUpdatedAbiTroveManager],
		eventName: troveUpdatedAbiTroveManager.name,
		args: {
			_borrower: userAddress
		},
		fromBlock:
			cachedState.troveUpdatedTroveManager.length > 0
				? cachedState.troveUpdatedTroveManager[
					cachedState.troveUpdatedTroveManager.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.troveUpdatedTroveManager.push(
		...troveUpdatedTroveManager.reduce<
			{
				debt: bigint;
				coll: bigint;
				stake: bigint;
				operation: (typeof troveManagerOperationEnum)[number];
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _debt = e.args._debt;
			const _coll = e.args._coll;
			const stake = e.args._stake;
			const operation = troveManagerOperationEnum[e.args._operation!];

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				debt: _debt!,
				coll: _coll!,
				stake: stake!,
				operation: operation!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	await setCachedState(protocol, userAddress, cachedState);

	return cachedState;
}
