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

export type UserState = {
	// Borrower Operations
	troveBorrowerOperations: {
		coll: bigint;
		debt: bigint;
		stake: bigint;
		operation: (typeof borrowerOperationEnum)[number];
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];

	// Coll Surplus Pool
	collBalance: {
		surplus: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];

	// Stability Pool
	depositorSnapshots: {
		P: bigint;
		S: bigint;
		G: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	depositedLusd: {
		deposit: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	frontEndTag: {
		frontEndTag: Address;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];

	// Trove Manager
	troveTroveManager: {
		debt: bigint;
		coll: bigint;
		stake: bigint;
		operation: (typeof troveManagerOperationEnum)[number];
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];

	// LQTY Staking
	stakedLqty: {
		stake: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	stakerSnapshots: {
		// staker not indexed, filter for it
		fEth: bigint;
		fLusd: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
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
		troveBorrowerOperations: [],
		collBalance: [],
		depositorSnapshots: [],
		depositedLusd: [],
		frontEndTag: [],
		troveTroveManager: [],
		stakedLqty: [],
		stakerSnapshots: []
	};

	// troveBorrowerOperations
	const troveUpdatedBorrowerOperationsAbi = getAbiItem(
		protocol,
		'borrowerOperations',
		'TroveUpdated'
	);
	const troveUpdatedBorrowerOperations = await client.getContractEvents({
		address: protocols[protocol].borrowerOperations,
		abi: [troveUpdatedBorrowerOperationsAbi],
		eventName: troveUpdatedBorrowerOperationsAbi.name,
		args: {
			_borrower: userAddress
		},
		// prettier-ignore
		fromBlock:
			cachedState.troveBorrowerOperations.length > 0
				? cachedState.troveBorrowerOperations[
					cachedState.troveBorrowerOperations.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.troveBorrowerOperations.push(
		...troveUpdatedBorrowerOperations.map((e) => {
			return {
				coll: e.args._coll!,
				debt: e.args._debt!,
				stake: e.args.stake!,
				operation: borrowerOperationEnum[e.args.operation!]!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// collBalance
	const collBalanceUpdatedAbi = getAbiItem(
		protocol,
		'collSurplusPool',
		'CollBalanceUpdated'
	);
	const collBalanceUpdated = await client.getContractEvents({
		address: protocols[protocol].collSurplusPool,
		abi: [collBalanceUpdatedAbi],
		eventName: collBalanceUpdatedAbi.name,
		args: {
			_account: userAddress
		},
		// prettier-ignore
		fromBlock:
			cachedState.collBalance.length > 0
				? cachedState.collBalance[
					cachedState.collBalance.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.collBalance.push(
		...collBalanceUpdated.map((e) => {
			return {
				surplus: e.args._newBalance!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// depositorSnapshots
	const depositorSnapshotsAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'DepositSnapshotUpdated'
	);
	const depositorSnapshots = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [depositorSnapshotsAbi],
		eventName: depositorSnapshotsAbi.name,
		args: {
			_depositor: userAddress
		},
		// prettier-ignore
		fromBlock:
			cachedState.depositorSnapshots.length > 0
				? cachedState.depositorSnapshots[
					cachedState.depositorSnapshots.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.depositorSnapshots.push(
		...depositorSnapshots.map((e) => {
			return {
				P: e.args._P!,
				S: e.args._S!,
				G: e.args._G!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// depositedLusd
	const userDepositChangedAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'UserDepositChanged'
	);
	const userDepositChanged = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [userDepositChangedAbi],
		eventName: userDepositChangedAbi.name,
		args: {
			_depositor: userAddress
		},
		// prettier-ignore
		fromBlock:
			cachedState.depositedLusd.length > 0
				? cachedState.depositedLusd[
					cachedState.depositedLusd.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.depositedLusd.push(
		...userDepositChanged.map((e) => {
			return {
				deposit: e.args._newDeposit!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// frontEndTag
	const frontEndTagUpdatedAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'FrontEndTagSet'
	);
	const frontEndTagUpdated = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [frontEndTagUpdatedAbi],
		eventName: frontEndTagUpdatedAbi.name,
		args: {
			_depositor: userAddress
		},
		// prettier-ignore
		fromBlock:
			cachedState.frontEndTag.length > 0
				? cachedState.frontEndTag[cachedState.frontEndTag.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.frontEndTag.push(
		...frontEndTagUpdated.map((e) => {
			return {
				frontEndTag: e.args._frontEnd!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// troveTroveManager
	const troveUpdatedAbiTroveManager = getAbiItem(
		protocol,
		'troveManager',
		'TroveUpdated'
	);
	const troveUpdatedTroveManager = await client.getContractEvents({
		address: protocols[protocol].troveManager,
		abi: [troveUpdatedAbiTroveManager],
		eventName: troveUpdatedAbiTroveManager.name,
		args: {
			_borrower: userAddress
		},
		// prettier-ignore
		fromBlock:
			cachedState.troveTroveManager.length > 0
				? cachedState.troveTroveManager[
					cachedState.troveTroveManager.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.troveTroveManager.push(
		...troveUpdatedTroveManager.map((e) => {
			return {
				debt: e.args._debt!,
				coll: e.args._coll!,
				stake: e.args._stake!,
				operation: troveManagerOperationEnum[e.args._operation!]!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// stakedLqty
	const stakeChangedAbi = getAbiItem(protocol, 'lqtyStaking', 'StakeChanged');
	const stakeChanged = await client.getContractEvents({
		address: protocols[protocol].lqtyStaking,
		abi: [stakeChangedAbi],
		eventName: stakeChangedAbi.name,
		args: {
			staker: userAddress
		},
		// prettier-ignore
		fromBlock:
			cachedState.stakedLqty.length > 0
				? cachedState.stakedLqty[cachedState.stakedLqty.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.stakedLqty.push(
		...stakeChanged.map((e) => {
			return {
				stake: e.args.newStake!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// stakerSnapshots
	const stakerSnapshotsAbi = getAbiItem(
		protocol,
		'lqtyStaking',
		'StakerSnapshotsUpdated'
	);
	const stakerSnapshots = await client.getContractEvents({
		address: protocols[protocol].lqtyStaking,
		abi: [stakerSnapshotsAbi],
		eventName: stakerSnapshotsAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.stakerSnapshots.length > 0
				? cachedState.stakerSnapshots[cachedState.stakerSnapshots.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.stakerSnapshots.push(
		...stakerSnapshots
			.filter((e) => e.args._staker === userAddress)
			.map((e) => {
				const _F_ETH = replaceBrandedWordsInString(
					'_F_ETH',
					protocols[protocol].modifiers
				) as ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>;

				const fEth = e.args[
					_F_ETH as keyof typeof e.args
				] as ExtractUnionValue<
					typeof e.args,
					ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>
				>;

				const _F_LUSD = replaceBrandedWordsInString(
					'_F_LUSD',
					protocols[protocol].modifiers
				) as ReplaceBrandedWordsInStringForAllProtocols<'_F_LUSD'>;

				const fLusd = e.args[
					_F_LUSD as keyof typeof e.args
				] as ExtractUnionValue<
					typeof e.args,
					ReplaceBrandedWordsInStringForAllProtocols<'_F_LUSD'>
				>;

				return {
					fEth: fEth!,
					fLusd: fLusd!,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.blockTimestamp!
				};
			})
	);

	await setCachedState(protocol, userAddress, cachedState);

	return cachedState;
}
