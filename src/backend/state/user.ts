import type { Address, PublicClient } from 'viem';
import type { ProtocolName } from '../protocols/protocols.js';
import type { ReplaceBrandedWordsInStringForAllProtocols } from '../protocols/rebrand.js';
import type { ExtractUnionValue } from '../utils/helpers.js';
import {
	borrowerOperationEnum,
	troveManagerOperationEnum
} from '../protocols/enums.js';
import {
	appendCachedArray,
	getCachedArrayRange,
	getCachedArrayLength,
	getCachedState
} from './cache.js';
import { protocols } from '../protocols/protocols.js';
import { replaceBrandedWordsInString } from '../protocols/rebrand.js';
import { getContractEventsGenerator } from './events.js';

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
	const { deployBlock } = protocols[protocol];

	// troveBorrowerOperations
	{
		const cachedTroveBorrowerOperationsLength = await getCachedArrayLength(
			protocol,
			[userAddress, 'troveBorrowerOperations']
		);

		const cachedTroveBorrowerOperations = await getCachedArrayRange<
			UserState['troveBorrowerOperations'][number]
		>(
			protocol,
			[userAddress, 'troveBorrowerOperations'],
			cachedTroveBorrowerOperationsLength - 1
		);

		const troveBorrowerOperations = getContractEventsGenerator({
			client,
			protocol,
			contract: 'borrowerOperations',
			normalItemName: 'TroveUpdated',
			fromBlock:
				cachedTroveBorrowerOperations.length > 0
					? cachedTroveBorrowerOperations[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of troveBorrowerOperations) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					coll: i.args._coll!,
					debt: i.args._debt!,
					stake: i.args.stake!,
					operation: borrowerOperationEnum[i.args.operation!]!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(
				protocol,
				[userAddress, 'troveBorrowerOperations'],
				arr
			);
		}
	}

	// collBalance
	{
		const cachedCollBalanceLength = await getCachedArrayLength(protocol, [
			userAddress,
			'collBalance'
		]);

		const cachedCollBalance = await getCachedArrayRange<
			UserState['collBalance'][number]
		>(protocol, [userAddress, 'collBalance'], cachedCollBalanceLength - 1);

		const collBalance = getContractEventsGenerator({
			client,
			protocol,
			contract: 'collSurplusPool',
			normalItemName: 'CollBalanceUpdated',
			fromBlock:
				cachedCollBalance.length > 0
					? cachedCollBalance[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of collBalance) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					surplus: i.args._newBalance!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(
				protocol,
				[userAddress, 'collBalance'],
				arr
			);
		}
	}

	// depositorSnapshots
	{
		const cachedDepositorSnapshotsLength = await getCachedArrayLength(
			protocol,
			[userAddress, 'depositorSnapshots']
		);

		const cachedDepositorSnapshots = await getCachedArrayRange<
			UserState['depositorSnapshots'][number]
		>(
			protocol,
			[userAddress, 'depositorSnapshots'],
			cachedDepositorSnapshotsLength - 1
		);

		const depositorSnapshots = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'DepositSnapshotUpdated',
			fromBlock:
				cachedDepositorSnapshots.length > 0
					? cachedDepositorSnapshots[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of depositorSnapshots) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					P: i.args._P!,
					S: i.args._S!,
					G: i.args._G!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(
				protocol,
				[userAddress, 'depositorSnapshots'],
				arr
			);
		}
	}

	// depositedLusd
	{
		const cachedDepositedLusdLength = await getCachedArrayLength(protocol, [
			userAddress,
			'depositedLusd'
		]);

		const cachedDepositedLusd = await getCachedArrayRange<
			UserState['depositedLusd'][number]
		>(
			protocol,
			[userAddress, 'depositedLusd'],
			cachedDepositedLusdLength - 1
		);

		const depositedLusd = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'UserDepositChanged',
			fromBlock:
				cachedDepositedLusd.length > 0
					? cachedDepositedLusd[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of depositedLusd) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					deposit: i.args._newDeposit!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(
				protocol,
				[userAddress, 'depositedLusd'],
				arr
			);
		}
	}

	// frontEndTag
	{
		const cachedFrontEndTagLength = await getCachedArrayLength(protocol, [
			userAddress,
			'frontEndTag'
		]);

		const cachedFrontEndTag = await getCachedArrayRange<
			UserState['frontEndTag'][number]
		>(protocol, [userAddress, 'frontEndTag'], cachedFrontEndTagLength - 1);

		const frontEndTag = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'FrontEndTagSet',
			fromBlock:
				cachedFrontEndTag.length > 0
					? cachedFrontEndTag[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of frontEndTag) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					frontEndTag: i.args._frontEnd!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(
				protocol,
				[userAddress, 'frontEndTag'],
				arr
			);
		}
	}

	// troveTroveManager
	{
		const cachedTroveTroveManagerLength = await getCachedArrayLength(
			protocol,
			[userAddress, 'troveTroveManager']
		);

		const cachedTroveTroveManager = await getCachedArrayRange<
			UserState['troveTroveManager'][number]
		>(
			protocol,
			[userAddress, 'troveTroveManager'],
			cachedTroveTroveManagerLength - 1
		);

		const troveTroveManager = getContractEventsGenerator({
			client,
			protocol,
			contract: 'troveManager',
			normalItemName: 'TroveUpdated',
			fromBlock:
				cachedTroveTroveManager.length > 0
					? cachedTroveTroveManager[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of troveTroveManager) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					debt: i.args._debt!,
					coll: i.args._coll!,
					stake: i.args._stake!,
					operation: troveManagerOperationEnum[i.args._operation!]!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(
				protocol,
				[userAddress, 'troveTroveManager'],
				arr
			);
		}
	}

	// stakedLqty
	{
		const cachedStakedLqtyLength = await getCachedArrayLength(protocol, [
			userAddress,
			'stakedLqty'
		]);

		const cachedStakedLqty = await getCachedArrayRange<
			UserState['stakedLqty'][number]
		>(protocol, [userAddress, 'stakedLqty'], cachedStakedLqtyLength - 1);

		const stakeChanged = getContractEventsGenerator({
			client,
			protocol,
			contract: 'lqtyStaking',
			normalItemName: 'StakeChanged',
			fromBlock:
				cachedStakedLqty.length > 0
					? cachedStakedLqty[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of stakeChanged) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					stake: i.args.newStake!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, [userAddress, 'stakedLqty'], arr);
		}
	}

	// stakerSnapshots
	{
		const cachedStakerSnapshotsLength = await getCachedArrayLength(
			protocol,
			[userAddress, 'stakerSnapshots']
		);

		const cachedStakerSnapshots = await getCachedArrayRange<
			UserState['stakerSnapshots'][number]
		>(
			protocol,
			[userAddress, 'stakerSnapshots'],
			cachedStakerSnapshotsLength - 1
		);

		const stakerSnapshots = getContractEventsGenerator({
			client,
			protocol,
			contract: 'lqtyStaking',
			normalItemName: 'StakerSnapshotsUpdated',
			fromBlock:
				cachedStakerSnapshots.length > 0
					? cachedStakerSnapshots[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of stakerSnapshots) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e
				.filter((i) => i.args._staker === userAddress)
				.map((i) => {
					const _F_ETH = replaceBrandedWordsInString(
						'_F_ETH',
						protocols[protocol].modifiers
					) as ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>;

					const fEth = i.args[
						_F_ETH as keyof typeof i.args
					] as ExtractUnionValue<
						typeof i.args,
						ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>
					>;

					const _F_LUSD = replaceBrandedWordsInString(
						'_F_LUSD',
						protocols[protocol].modifiers
					) as ReplaceBrandedWordsInStringForAllProtocols<'_F_LUSD'>;

					const fLusd = i.args[
						_F_LUSD as keyof typeof i.args
					] as ExtractUnionValue<
						typeof i.args,
						ReplaceBrandedWordsInStringForAllProtocols<'_F_LUSD'>
					>;

					return {
						fEth: fEth!,
						fLusd: fLusd!,
						blockNumber: i.blockNumber,
						transactionIndex: i.transactionIndex,
						timestamp: i.blockTimestamp!
					};
				});

			await appendCachedArray(
				protocol,
				[userAddress, 'stakerSnapshots'],
				arr
			);
		}
	}

	return {
		troveBorrowerOperations: (await getCachedState<
			UserState['troveBorrowerOperations']
		>(protocol, [userAddress, 'troveBorrowerOperations']))!,
		collBalance: (await getCachedState<UserState['collBalance']>(protocol, [
			userAddress,
			'collBalance'
		]))!,
		depositorSnapshots: (await getCachedState<
			UserState['depositorSnapshots']
		>(protocol, [userAddress, 'depositorSnapshots']))!,
		depositedLusd: (await getCachedState<UserState['depositedLusd']>(
			protocol,
			[userAddress, 'depositedLusd']
		))!,
		frontEndTag: (await getCachedState<UserState['frontEndTag']>(protocol, [
			userAddress,
			'frontEndTag'
		]))!,
		troveTroveManager: (await getCachedState<
			UserState['troveTroveManager']
		>(protocol, [userAddress, 'troveTroveManager']))!,
		stakedLqty: (await getCachedState<UserState['stakedLqty']>(protocol, [
			userAddress,
			'stakedLqty'
		]))!,
		stakerSnapshots: (await getCachedState<UserState['stakerSnapshots']>(
			protocol,
			[userAddress, 'stakerSnapshots']
		))!
	};
}
