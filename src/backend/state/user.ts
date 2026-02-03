import type { Address, Hash, PublicClient } from 'viem';
import type { ProtocolName } from '../protocols/protocols.js';
import type { ReplaceBrandedWordsInStringForAllProtocols } from '../protocols/rebrand.js';
import type { ExtractUnionValue } from '../utils/helpers.js';
import {
	borrowerOperationEnum,
	troveManagerOperationEnum
} from '../protocols/enums.js';
import { protocols } from '../protocols/protocols.js';
import { replaceBrandedWordsInString } from '../protocols/rebrand.js';
import {
	getCacheAndTransformEvents,
	getCacheAndTransformEventsFromBlockNumbers,
	getBlockNumbersForEvents
} from './events.js';

export type UserState = {
	// Borrower Operations
	userTroveUpdates: {
		coll: bigint;
		debt: bigint;
		stake: bigint;
		operation: (typeof borrowerOperationEnum)[number];
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];

	// Coll Surplus Pool
	collSurplusBalance: {
		surplus: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];

	// Stability Pool
	depositUpdates: {
		deposit: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	PSGSnapshots: {
		P: bigint;
		S: bigint;
		G: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	frontEndTagChanges: {
		frontEndTag: Address;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];

	// Trove Manager
	systemTroveUpdates: {
		debt: bigint;
		coll: bigint;
		stake: bigint;
		operation: (typeof troveManagerOperationEnum)[number];
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	LTermsSnapshots: {
		lEth: bigint;
		lLusd: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];

	// LQTY Staking
	stakeUpdates: {
		stake: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	FTermsSnapshots: {
		fEth: bigint;
		fLusd: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
};

export async function getUserState(
	protocol: ProtocolName,
	userAddress: Address,
	client: PublicClient,
	blockNumberToTimestampMap: Map<bigint, bigint>,
	progress?: (key: string) => void
): Promise<UserState> {
	const latestBlock = await client.getBlockNumber();

	const commonArgs = {
		client,
		protocol,
		latestBlock,
		blockNumberToTimestampMap
	} as const;

	/** ------------------------------------------------------------------------
	 * userTroveUpdates
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving user initiated trove changes');
	const userTroveUpdates = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'borrowerOperations',
		normalItemName: 'TroveUpdated',
		args: {
			_borrower: userAddress
		},
		keyPath: [userAddress, 'userTroveUpdates'],
		transform: (e) => {
			return {
				coll: e.args._coll!,
				debt: e.args._debt!,
				stake: e.args.stake!,
				operation: borrowerOperationEnum[e.args.operation!]!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * collSurplusBalance
	 ------------------------------------------------------------------------ */
	progress?.(
		'Retrieving user coll surplus from redeem to close and certain recovery mode liquidations'
	);
	const collSurplusBalance = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'collSurplusPool',
		normalItemName: 'CollBalanceUpdated',
		args: {
			_account: userAddress
		},
		keyPath: [userAddress, 'collSurplusBalance'],
		transform: (e) => {
			return {
				surplus: e.args._newBalance!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * depositUpdates
	 ------------------------------------------------------------------------ */
	progress?.(
		'Retrieving user stability pool deposit and withdrawal LUSD changes'
	);
	const depositUpdates = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'stabilityPool',
		normalItemName: 'UserDepositChanged',
		args: {
			_depositor: userAddress
		},
		keyPath: [userAddress, 'depositUpdates'],
		transform: (e) => {
			return {
				deposit: e.args._newDeposit!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * PSGSnapshots
	 ------------------------------------------------------------------------ */
	progress?.(
		'Retrieving user stability pool deposit P, S and G accumulator snapshots'
	);
	const PSGSnapshotsBlockNumbers = await getBlockNumbersForEvents(
		{
			protocol,
			keyPath: [userAddress, 'PSGSnapshots']
		},
		{
			array: depositUpdates,
			filter: (lastBlockNumber: bigint) => {
				return (e: UserState['depositUpdates'][number]) => {
					return e.blockNumber > lastBlockNumber;
				};
			}
		}
	);

	const PSGSnapshots = await getCacheAndTransformEventsFromBlockNumbers({
		...commonArgs,
		contract: 'stabilityPool',
		normalItemName: 'DepositSnapshotUpdated',
		args: {
			_depositor: userAddress
		},
		blockNumbers: PSGSnapshotsBlockNumbers,
		blockNumberToTimestampMap,
		keyPath: [userAddress, 'PSGSnapshots'],
		transform: (e) => {
			return {
				P: e.args._P!,
				S: e.args._S!,
				G: e.args._G!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * frontEndTagChanges
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving user stability pool front end tag changes');
	const frontEndTagChangesBlockNumbers = await getBlockNumbersForEvents(
		{
			protocol,
			keyPath: [userAddress, 'frontEndTagChanges']
		},
		{
			array: depositUpdates,
			filter: (lastBlockNumber: bigint) => {
				return (e: UserState['depositUpdates'][number]) => {
					return e.blockNumber > lastBlockNumber;
				};
			}
		}
	);

	const frontEndTagChanges = await getCacheAndTransformEventsFromBlockNumbers(
		{
			...commonArgs,
			contract: 'stabilityPool',
			normalItemName: 'FrontEndTagSet',
			args: {
				_depositor: userAddress
			},
			blockNumbers: frontEndTagChangesBlockNumbers,
			blockNumberToTimestampMap,
			keyPath: [userAddress, 'frontEndTagChanges'],
			transform: (e) => {
				return {
					frontEndTag: e.args._frontEnd!,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.blockTimestamp!,
					transactionHash: e.transactionHash
				};
			}
		}
	);

	/** ------------------------------------------------------------------------
	 * systemTroveUpdates
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving user trove changes from trove manager');
	const systemTroveUpdates = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'troveManager',
		normalItemName: 'TroveUpdated',
		args: {
			_borrower: userAddress
		},
		keyPath: [userAddress, 'systemTroveUpdates'],
		transform: (e) => {
			return {
				debt: e.args._debt!,
				coll: e.args._coll!,
				stake: e.args._stake!,
				operation: troveManagerOperationEnum[e.args._operation!]!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * LTermsSnapshots
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving user trove LTerm snapshots');
	const LTermsSnapshotsBlockNumbers = await getBlockNumbersForEvents(
		{
			protocol,
			keyPath: [userAddress, 'LTermsSnapshots']
		},
		{
			array: systemTroveUpdates,
			filter: (lastBlockNumber: bigint) => {
				return (e: UserState['systemTroveUpdates'][number]) => {
					return (
						e.blockNumber > lastBlockNumber &&
						e.operation === 'applyPendingRewards'
					);
				};
			}
		},
		{
			array: userTroveUpdates,
			filter: (lastBlockNumber: bigint) => {
				return (e: UserState['userTroveUpdates'][number]) => {
					return (
						e.blockNumber > lastBlockNumber &&
						e.operation === 'openTrove'
					);
				};
			}
		}
	);

	const LTermsSnapshots = await getCacheAndTransformEventsFromBlockNumbers({
		...commonArgs,
		contract: 'troveManager',
		normalItemName: 'TroveSnapshotsUpdated',
		blockNumbers: LTermsSnapshotsBlockNumbers,
		blockNumberToTimestampMap,
		keyPath: [userAddress, 'LTermsSnapshots'],
		transform: (e) => {
			const _L_ETH = replaceBrandedWordsInString(
				'_L_ETH',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_L_ETH'>;

			const lEth = e.args[
				_L_ETH as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_L_ETH'>
			>;

			const _L_LUSDDebt = replaceBrandedWordsInString(
				'_L_LUSDDebt',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_L_LUSDDebt'>;
			const lLusd = e.args[
				_L_LUSDDebt as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_L_LUSDDebt'>
			>;

			return {
				lEth: lEth!,
				lLusd: lLusd!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * stakeUpdates
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving user LQTY staking stake changes');
	const stakeUpdates = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'lqtyStaking',
		normalItemName: 'StakeChanged',
		args: {
			staker: userAddress
		},
		keyPath: [userAddress, 'stakeUpdates'],
		transform: (e) => {
			return {
				stake: e.args.newStake!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * FTermsSnapshots
	 ------------------------------------------------------------------------ */
	progress?.(
		'Retrieving user LQTY staking fETH and fLUSD accumulator snapshots'
	);
	const FTermsSnapshotsBlockNumbers = await getBlockNumbersForEvents(
		{
			protocol,
			keyPath: [userAddress, 'FTermsSnapshots']
		},
		{
			array: stakeUpdates,
			filter: (lastBlockNumber: bigint) => {
				return (e: UserState['stakeUpdates'][number]) => {
					return e.blockNumber > lastBlockNumber;
				};
			}
		}
	);

	const FTermsSnapshots = await getCacheAndTransformEventsFromBlockNumbers({
		...commonArgs,
		contract: 'lqtyStaking',
		normalItemName: 'StakerSnapshotsUpdated',
		blockNumbers: FTermsSnapshotsBlockNumbers,
		blockNumberToTimestampMap,
		keyPath: [userAddress, 'FTermsSnapshots'],
		transform: (e) => {
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
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	return {
		userTroveUpdates,
		collSurplusBalance,
		depositUpdates,
		PSGSnapshots,
		frontEndTagChanges,
		systemTroveUpdates,
		LTermsSnapshots,
		stakeUpdates,
		FTermsSnapshots
	};
}
