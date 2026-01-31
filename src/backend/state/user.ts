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
	readCachedArray,
	getCachedState,
	setCachedState
} from './cache.js';
import { protocols } from '../protocols/protocols.js';
import { replaceBrandedWordsInString } from '../protocols/rebrand.js';
import { getContractEventsGenerator, getBlockTimestamps } from './events.js';

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
	client: PublicClient,
	blockNumberToTimestampMap: Map<bigint, bigint>,
	progress?: (key: string) => void
): Promise<UserState> {
	const { deployBlock } = protocols[protocol];

	const latestBlock = await client.getBlockNumber();

	// troveBorrowerOperations
	progress?.('Retrieving user initiated trove changes');
	{
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			userAddress,
			'troveBorrowerOperations',
			'lastFetchedBlock'
		]);

		const troveBorrowerOperations = getContractEventsGenerator({
			client,
			protocol,
			contract: 'borrowerOperations',
			normalItemName: 'TroveUpdated',
			args: {
				_borrower: userAddress
			},
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n
		});

		for await (const e of troveBorrowerOperations) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			await getBlockTimestamps({
				client,
				blockNumberToTimestampMap,
				events: e.events
			});

			const arr = e.events.map((i) => {
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
			await setCachedState(
				protocol,
				[userAddress, 'troveBorrowerOperations', 'lastFetchedBlock'],
				e.lastFetchedBlock
			);
		}
	}

	// collBalance
	progress?.(
		'Retrieving user coll surplus from redeem to close and certain recovery mode liquidations'
	);
	{
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			userAddress,
			'collBalance',
			'lastFetchedBlock'
		]);

		const collBalance = getContractEventsGenerator({
			client,
			protocol,
			contract: 'collSurplusPool',
			normalItemName: 'CollBalanceUpdated',
			args: {
				_account: userAddress
			},
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n
		});

		for await (const e of collBalance) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			await getBlockTimestamps({
				client,
				blockNumberToTimestampMap,
				events: e.events
			});

			const arr = e.events.map((i) => {
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
			await setCachedState(
				protocol,
				[userAddress, 'collBalance', 'lastFetchedBlock'],
				e.lastFetchedBlock
			);
		}
	}

	// depositorSnapshots
	progress?.(
		'Retrieving user stability pool deposit P, S and G accumulator snapshots'
	);
	{
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			userAddress,
			'depositorSnapshots',
			'lastFetchedBlock'
		]);

		const depositorSnapshots = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'DepositSnapshotUpdated',
			args: {
				_depositor: userAddress
			},
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n
		});

		for await (const e of depositorSnapshots) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			await getBlockTimestamps({
				client,
				blockNumberToTimestampMap,
				events: e.events
			});

			const arr = e.events.map((i) => {
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
			await setCachedState(
				protocol,
				[userAddress, 'depositorSnapshots', 'lastFetchedBlock'],
				e.lastFetchedBlock
			);
		}
	}

	// depositedLusd
	progress?.(
		'Retrieving user stability pool deposit and withdrawal LUSD changes'
	);
	{
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			userAddress,
			'depositedLusd',
			'lastFetchedBlock'
		]);

		const depositedLusd = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'UserDepositChanged',
			args: {
				_depositor: userAddress
			},
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n
		});

		for await (const e of depositedLusd) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			await getBlockTimestamps({
				client,
				blockNumberToTimestampMap,
				events: e.events
			});

			const arr = e.events.map((i) => {
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
			await setCachedState(
				protocol,
				[userAddress, 'depositedLusd', 'lastFetchedBlock'],
				e.lastFetchedBlock
			);
		}
	}

	// frontEndTag
	progress?.('Retrieving user stability pool front end tag changes');
	{
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			userAddress,
			'frontEndTag',
			'lastFetchedBlock'
		]);

		const frontEndTag = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'FrontEndTagSet',
			args: {
				_depositor: userAddress
			},
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n
		});

		for await (const e of frontEndTag) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			await getBlockTimestamps({
				client,
				blockNumberToTimestampMap,
				events: e.events
			});

			const arr = e.events.map((i) => {
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
			await setCachedState(
				protocol,
				[userAddress, 'frontEndTag', 'lastFetchedBlock'],
				e.lastFetchedBlock
			);
		}
	}

	// troveTroveManager
	progress?.('Retrieving user trove changes from trove manager');
	{
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			userAddress,
			'troveTroveManager',
			'lastFetchedBlock'
		]);

		const troveTroveManager = getContractEventsGenerator({
			client,
			protocol,
			contract: 'troveManager',
			normalItemName: 'TroveUpdated',
			args: {
				_borrower: userAddress
			},
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n
		});

		for await (const e of troveTroveManager) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			await getBlockTimestamps({
				client,
				blockNumberToTimestampMap,
				events: e.events
			});

			const arr = e.events.map((i) => {
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
			await setCachedState(
				protocol,
				[userAddress, 'troveTroveManager', 'lastFetchedBlock'],
				e.lastFetchedBlock
			);
		}
	}

	// stakedLqty
	progress?.('Retrieving user LQTY staking stake changes');
	{
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			userAddress,
			'stakedLqty',
			'lastFetchedBlock'
		]);

		const stakeChanged = getContractEventsGenerator({
			client,
			protocol,
			contract: 'lqtyStaking',
			normalItemName: 'StakeChanged',
			args: {
				staker: userAddress
			},
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n
		});

		for await (const e of stakeChanged) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			await getBlockTimestamps({
				client,
				blockNumberToTimestampMap,
				events: e.events
			});

			const arr = e.events.map((i) => {
				return {
					stake: i.args.newStake!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, [userAddress, 'stakedLqty'], arr);
			await setCachedState(
				protocol,
				[userAddress, 'stakedLqty', 'lastFetchedBlock'],
				e.lastFetchedBlock
			);
		}
	}

	// stakerSnapshots
	progress?.(
		'Retrieving user LQTY staking fETH and fLUSD accumulator snapshots'
	);
	{
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			userAddress,
			'stakerSnapshots',
			'lastFetchedBlock'
		]);

		const stakerSnapshots = getContractEventsGenerator({
			client,
			protocol,
			contract: 'lqtyStaking',
			normalItemName: 'StakerSnapshotsUpdated',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n
		});

		for await (const e of stakerSnapshots) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			await getBlockTimestamps({
				client,
				blockNumberToTimestampMap,
				events: e.events
			});

			const arr = e.events
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
			await setCachedState(
				protocol,
				[userAddress, 'stakerSnapshots', 'lastFetchedBlock'],
				e.lastFetchedBlock
			);
		}
	}

	const troveBorrowerOperations = await readCachedArray<
		UserState['troveBorrowerOperations'][number]
	>(protocol, [userAddress, 'troveBorrowerOperations']);
	const collBalance = await readCachedArray<UserState['collBalance'][number]>(
		protocol,
		[userAddress, 'collBalance']
	);
	const depositorSnapshots = await readCachedArray<
		UserState['depositorSnapshots'][number]
	>(protocol, [userAddress, 'depositorSnapshots']);
	const depositedLusd = await readCachedArray<
		UserState['depositedLusd'][number]
	>(protocol, [userAddress, 'depositedLusd']);
	const frontEndTag = await readCachedArray<UserState['frontEndTag'][number]>(
		protocol,
		[userAddress, 'frontEndTag']
	);
	const troveTroveManager = await readCachedArray<
		UserState['troveTroveManager'][number]
	>(protocol, [userAddress, 'troveTroveManager']);
	const stakedLqty = await readCachedArray<UserState['stakedLqty'][number]>(
		protocol,
		[userAddress, 'stakedLqty']
	);
	const stakerSnapshots = await readCachedArray<
		UserState['stakerSnapshots'][number]
	>(protocol, [userAddress, 'stakerSnapshots']);

	return {
		troveBorrowerOperations,
		collBalance,
		depositorSnapshots,
		depositedLusd,
		frontEndTag,
		troveTroveManager,
		stakedLqty,
		stakerSnapshots
	};
}
