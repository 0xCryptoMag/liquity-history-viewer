import { maxUint128, type Address, type Hash, type PublicClient } from 'viem';
import type { ProtocolName } from '../protocols/protocols.js';
import type {
	borrowerOperationEnum,
	troveManagerOperationEnum
} from '../protocols/enums.js';
import { getGlobalState, type GlobalState } from './global.js';
import { getUserState, type UserState } from './user.js';
import { createClient } from '../protocols/client.js';
import { isAfter, isSameTxn, isBefore } from '../utils/helpers.js';
import { getAbiItem } from '../protocols/modify.js';
import { protocols } from '../protocols/protocols.js';

export type TimelineOptions = {
	applyPendingTroveFromEmptyPoolLiquidation?: boolean;
	applyPendingLqtyFrom3rdPartyStabilityPool?: boolean;
	applyPendingStabilityPoolFromLiquidation?: boolean;
	applyPendingEthGainFromRedemption?: boolean;
	applyPendingLusdGainFromDepositFee?: boolean;
};

const defaultTimelineOptions: Required<TimelineOptions> = {
	applyPendingTroveFromEmptyPoolLiquidation: true,
	applyPendingLqtyFrom3rdPartyStabilityPool: false,
	applyPendingStabilityPoolFromLiquidation: true,
	applyPendingEthGainFromRedemption: false,
	applyPendingLusdGainFromDepositFee: false
};

export type Timeline = {
	trove: {
		coll: bigint;
		debt: bigint;
		stake: bigint;
		fees: bigint;
		lusdGasComp: bigint;
		collPending: bigint;
		debtPending: bigint;
		operation:
			| (typeof borrowerOperationEnum)[number]
			| (typeof troveManagerOperationEnum)[number]
			| '3rdPartyLiquidationWithEmptyStabilityPool';
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	stabilityPool: {
		deposit: bigint;
		pendingEthGain: bigint;
		pendingLusdLoss: bigint;
		pendingLqtyReward: bigint;
		operation:
			| 'UserAction'
			| '3rdPartyUserAction'
			| '3rdPartyLiquidationWithStabilityPoolOffset';
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	lqtyStakingPool: {
		stake: bigint;
		pendingEthGain: bigint;
		pendingLusdGain: bigint;
		operation:
			| 'UserAction'
			| '3rdPartyRedemptionFeePaid'
			| '3rdPartyDepositFeePaid';
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	collateralSurplusPool: {
		surplus: bigint;
		operation:
			| 'CollClaimed'
			| 'TroveRedeemedToCloseOrLiquidatedInRecoveryMode';
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
};

export async function constructTimeline(
	protocol: ProtocolName,
	userAddress: Address,
	options?: TimelineOptions,
	progress?: (message: string) => void
) {
	const client = createClient(protocol);
	const opts = { ...defaultTimelineOptions, ...options };

	// no need to cache blockNumber to timestamp, once a protocol is synced,
	// the timestamp is cached with the event
	const blockNumberToTimestampMap = new Map<bigint, bigint>();

	const global = await getGlobalState(
		protocol,
		client,
		blockNumberToTimestampMap,
		(key) => progress?.('Global: ' + key)
	);
	const user = await getUserState(
		protocol,
		userAddress,
		client,
		blockNumberToTimestampMap,
		(key) => progress?.('User: ' + key)
	);

	// Start with user state changes
	const timeline: Timeline = {
		trove: [
			...user.userTroveUpdates.map((e) => {
				return {
					coll: e.coll,
					debt: e.debt,
					stake: e.stake,
					fees: 0n,
					lusdGasComp:
						e.coll > 0n ? global.LUSD_GAS_COMPENSATION : 0n,
					collPending: 0n,
					debtPending: 0n,
					operation: e.operation,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp,
					transactionHash: e.transactionHash
				};
			}),
			...user.systemTroveUpdates.map((e) => {
				return {
					coll: e.coll,
					debt: e.debt,
					stake: e.stake,
					fees: 0n,
					lusdGasComp:
						e.coll > 0n ? global.LUSD_GAS_COMPENSATION : 0n,
					collPending: 0n,
					debtPending: 0n,
					operation: e.operation,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp,
					transactionHash: e.transactionHash
				};
			})
		].sort((a, b) => {
			if (a.blockNumber === b.blockNumber) {
				return a.transactionIndex - b.transactionIndex;
			}
			return Number(a.blockNumber - b.blockNumber);
		}),
		stabilityPool: [
			...user.depositUpdates.map((e) => {
				return {
					deposit: e.deposit,
					pendingEthGain: 0n,
					pendingLusdLoss: 0n,
					pendingLqtyReward: 0n,
					operation: 'UserAction' as const,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp,
					transactionHash: e.transactionHash
				};
			})
		],
		lqtyStakingPool: [
			...user.stakeUpdates.map((e) => {
				return {
					stake: e.stake,
					pendingEthGain: 0n,
					pendingLusdGain: 0n,
					operation: 'UserAction' as const,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp,
					transactionHash: e.transactionHash
				};
			})
		],
		collateralSurplusPool: [
			...user.collSurplusBalance.map((e) => {
				return {
					surplus: e.surplus,
					operation:
						e.surplus === 0n
							? ('CollClaimed' as const)
							: ('TroveRedeemedToCloseOrLiquidatedInRecoveryMode' as const),
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp,
					transactionHash: e.transactionHash
				};
			})
		]
	};

	// Then apply global state changes
	progress?.('Building timeline…');
	spliceTroveEventsFromLTerms(timeline, global, user);
	await spliceStabilityPoolEventsFromPSAndG(
		timeline,
		global,
		user,
		client,
		protocol
	);
	spliceLqtyStakingPoolEventsFromFTerms(timeline, global, user);

	// Post-pass: filter entries by options
	if (!opts.applyPendingTroveFromEmptyPoolLiquidation) {
		timeline.trove = timeline.trove.filter(
			(e) => e.operation !== '3rdPartyLiquidationWithEmptyStabilityPool'
		);
	}
	if (!opts.applyPendingLqtyFrom3rdPartyStabilityPool) {
		timeline.stabilityPool = timeline.stabilityPool.filter(
			(e) => e.operation !== '3rdPartyUserAction'
		);
	}
	if (!opts.applyPendingStabilityPoolFromLiquidation) {
		timeline.stabilityPool = timeline.stabilityPool.filter(
			(e) => e.operation !== '3rdPartyLiquidationWithStabilityPoolOffset'
		);
	}
	if (!opts.applyPendingEthGainFromRedemption) {
		timeline.lqtyStakingPool = timeline.lqtyStakingPool.filter(
			(e) => e.operation !== '3rdPartyRedemptionFeePaid'
		);
	}
	if (!opts.applyPendingLusdGainFromDepositFee) {
		timeline.lqtyStakingPool = timeline.lqtyStakingPool.filter(
			(e) => e.operation !== '3rdPartyDepositFeePaid'
		);
	}

	return {
		timeline,
		decimalPrecision: global.DECIMAL_PRECISION,
		lusdGasCompensation: global.LUSD_GAS_COMPENSATION
	};
}

function spliceTroveEventsFromLTerms(
	timeline: Timeline,
	global: GlobalState,
	user: UserState
) {
	if (timeline.trove.length === 0) return;

	const cachedTrove = { event: timeline.trove[0]!, index: 0 };
	let cachedLTermSnapshotIndex = 0;
	let cachedborrowingFeesIndex = 0;

	// L Terms get updated on liquidations when stability pool is empty
	// This is typically 0 since the stability pool is rarely if ever empty
	for (const globalLTerms of global.LTerms) {
		if (isBefore(globalLTerms, timeline.trove[0]!)) continue;

		const lastTrove = getEventBeforComparator({
			comparator: globalLTerms,
			eventArray: timeline.trove,
			startIndex: cachedTrove.index,
			takeEventInSameTxnIndex: false
		});
		cachedTrove.index = lastTrove.index;

		// If last trove update was spliced in from the another liquidation,
		// use the cached trove update, then set cached to the last trove update
		lastTrove.event =
			lastTrove.event!.operation ===
			'3rdPartyLiquidationWithEmptyStabilityPool'
				? cachedTrove.event
				: lastTrove.event;
		cachedTrove.event = lastTrove.event!;

		if (lastTrove.event!.coll === 0n) continue;

		const lastLTermsSnapshot = getEventBeforComparator({
			comparator: globalLTerms,
			eventArray: user.LTermsSnapshots,
			startIndex: cachedLTermSnapshotIndex,
			takeEventInSameTxnIndex: false
		});
		cachedLTermSnapshotIndex = lastLTermsSnapshot.index;

		const lastborrowingFees = getEventBeforComparator({
			comparator: globalLTerms,
			eventArray: user.borrowingFees,
			startIndex: cachedborrowingFeesIndex,
			takeEventInSameTxnIndex: true
		});
		cachedborrowingFeesIndex = lastborrowingFees.index;

		/**
		 * Coll Gain
		 */
		const ethRewardPerUnitStaked =
			globalLTerms.lEth - lastLTermsSnapshot.event!.lEth;
		const pendingEthReward =
			(lastTrove.event!.stake * ethRewardPerUnitStaked) /
			global.DECIMAL_PRECISION;

		/**
		 * Debt Gain
		 */
		const lusdRewardPerUnitStaked =
			globalLTerms.lLusd - lastLTermsSnapshot.event!.lLusd;
		const pendingLusdReward =
			(lastTrove.event!.stake * lusdRewardPerUnitStaked) /
			global.DECIMAL_PRECISION;

		timeline.trove.splice(lastTrove.index + 1, 0, {
			coll: lastTrove.event!.coll,
			debt: lastTrove.event!.debt,
			stake: lastTrove.event!.stake,
			fees: 0n,
			lusdGasComp: global.LUSD_GAS_COMPENSATION,
			collPending: pendingEthReward,
			debtPending: pendingLusdReward,
			operation: '3rdPartyLiquidationWithEmptyStabilityPool',
			blockNumber: globalLTerms.blockNumber,
			transactionIndex: globalLTerms.transactionIndex,
			timestamp: globalLTerms.timestamp,
			transactionHash: globalLTerms.transactionHash
		});
	}
}

async function spliceStabilityPoolEventsFromPSAndG(
	timeline: Timeline,
	global: GlobalState,
	user: UserState,
	client: PublicClient,
	protocol: ProtocolName
) {
	if (timeline.stabilityPool.length === 0) return;

	const cachedDeposit = { event: timeline.stabilityPool[0]!, index: 0 };
	let cachedPSGSnapshotIndex = 0;
	let cachedScaleSnapshotIndex = 0;
	let cachedEpochSnapshotIndex = 0;
	let cachedFrontEndTagIndex = 0;
	let cachedGlobalScaleIndex = 0;
	let cachedGlobalEpochIndex = 0;

	// If a scale change ever happened, we start with the final S/G value at the
	// first scale and epoch. If a scale change never happened, this figure
	// never gets used
	let cachedGAtEpochAndScale = await client.readContract({
		address: protocols[protocol].stabilityPool,
		abi: [getAbiItem(protocol, 'stabilityPool', 'epochToScaleToG')],
		functionName: 'epochToScaleToG',
		args: [0n, 0n]
	});
	let cachedSAtEpochAndScale = await client.readContract({
		address: protocols[protocol].stabilityPool,
		abi: [getAbiItem(protocol, 'stabilityPool', 'epochToScaleToSum')],
		functionName: 'epochToScaleToSum',
		args: [0n, 0n]
	});
	let cachedEpochAndScale = {
		epoch: 0n,
		scale: 0n
	};

	type PItem = (typeof global.P)[number];
	type SItem = (typeof global.S)[number];
	type GItem = (typeof global.G)[number];

	const psgByKey = new Map<
		string,
		{ p: PItem | null; s: SItem | null; g: GItem | null }
	>();

	function key(blockNumber: bigint, transactionIndex: number) {
		return `${blockNumber}-${transactionIndex}`;
	}

	for (const item of global.P) {
		const k = key(item.blockNumber, item.transactionIndex);
		const existing = psgByKey.get(k) ?? {
			p: null as PItem | null,
			s: null as SItem | null,
			g: null as GItem | null
		};
		existing.p = item;
		psgByKey.set(k, existing);
	}
	for (const item of global.S) {
		const k = key(item.blockNumber, item.transactionIndex);
		const existing = psgByKey.get(k) ?? {
			p: null as PItem | null,
			s: null as SItem | null,
			g: null as GItem | null
		};
		existing.s = item;
		psgByKey.set(k, existing);
	}
	for (const item of global.G) {
		const k = key(item.blockNumber, item.transactionIndex);
		const existing = psgByKey.get(k) ?? {
			p: null as PItem | null,
			s: null as SItem | null,
			g: null as GItem | null
		};
		existing.g = item;
		psgByKey.set(k, existing);
	}

	/** When P is non-null, S is non-null (same tx). When P is null, only G can be set (e.g. user deposit). */
	type PSGItem =
		| [PItem, SItem, GItem]
		| [PItem, SItem, null]
		| [null, null, GItem];

	const PSG: PSGItem[] = Array.from(psgByKey.entries())
		.sort(([keyA], [keyB]) => {
			const [blockStrA, txStrA] = keyA.split('-');
			const [blockStrB, txStrB] = keyB.split('-');
			const blockA = BigInt(blockStrA ?? 0);
			const blockB = BigInt(blockStrB ?? 0);
			const txA = Number(txStrA ?? 0);
			const txB = Number(txStrB ?? 0);
			if (blockA !== blockB) return blockA < blockB ? -1 : 1;
			return txA - txB;
		})
		.map(([_, v]) => [v.p, v.s, v.g]) as PSGItem[];

	for (const globalPSG of PSG) {
		const [globalP, globalS, globalG] = globalPSG;
		if (isBefore(globalG ?? globalP, timeline.stabilityPool[0]!)) continue;

		const lastDeposit = getEventBeforComparator({
			comparator: globalG ?? globalP,
			eventArray: timeline.stabilityPool,
			startIndex: cachedDeposit.index,
			takeEventInSameTxnIndex: true
		});
		cachedDeposit.index = lastDeposit.index;

		// If last deposit update was spliced in from the another deposit,
		// use the cached deposit update, then set cached to the last deposit update
		lastDeposit.event =
			lastDeposit.event!.operation !== 'UserAction'
				? cachedDeposit.event
				: lastDeposit.event;
		cachedDeposit.event = lastDeposit.event!;

		if (lastDeposit.event!.deposit === 0n) continue;

		const lastPSGSnapshot = getEventBeforComparator({
			comparator: globalG ?? globalP,
			eventArray: user.PSGSnapshots,
			startIndex: cachedPSGSnapshotIndex,
			takeEventInSameTxnIndex: true
		});
		cachedPSGSnapshotIndex = lastPSGSnapshot.index;

		const lastScaleSnapshot = getEventBeforComparator({
			comparator: lastDeposit.event!,
			eventArray: global.scale,
			startIndex: cachedScaleSnapshotIndex,
			takeEventInSameTxnIndex: false
		});
		cachedScaleSnapshotIndex = lastScaleSnapshot.index;

		const lastEpochSnapshot = getEventBeforComparator({
			comparator: lastDeposit.event!,
			eventArray: global.epoch,
			startIndex: cachedEpochSnapshotIndex,
			takeEventInSameTxnIndex: false
		});
		cachedEpochSnapshotIndex = lastEpochSnapshot.index;

		const lastFrontEndTag = getEventBeforComparator({
			comparator: globalG ?? globalP,
			eventArray: user.frontEndTagChanges,
			startIndex: cachedFrontEndTagIndex,
			takeEventInSameTxnIndex: false
		});
		cachedFrontEndTagIndex = lastFrontEndTag.index;

		const lastGlobalScale = getEventBeforComparator({
			comparator: globalG ?? globalP,
			eventArray: global.scale,
			startIndex: cachedGlobalScaleIndex,
			takeEventInSameTxnIndex: false
		});
		cachedGlobalScaleIndex = lastGlobalScale.index;

		const lastGlobalEpoch = getEventBeforComparator({
			comparator: globalG ?? globalP,
			eventArray: global.epoch,
			startIndex: cachedGlobalEpochIndex,
			takeEventInSameTxnIndex: false
		});
		cachedGlobalEpochIndex = lastGlobalEpoch.index;

		let lqtyReward = lastDeposit.event!.pendingLqtyReward;
		let ethGain = timeline.stabilityPool[lastDeposit.index]!.pendingEthGain;
		let lusdLoss =
			timeline.stabilityPool[lastDeposit.index]!.pendingLusdLoss;

		if (globalP) {
			/** ----------------------------------------------------------------
			 * ETH Gain
			 ---------------------------------------------------------------- */
			// Everytime P and S update, the pending ETH gain and LUSD loss
			// changes. P and S update whenever a liquidation happens, and most
			// times G will update as well, but that is not guaranteed
			let firstPortionS = 0n;
			let secondPortionS = 0n;

			// If a scale change happened between the last deposit and the liq
			if (lastScaleSnapshot.event !== lastGlobalScale.event) {
				const finalSAtDepositScale = await (async () => {
					// If we compare against the deposit snapshots, then the
					// final SS will not be re-retrieved until next deposit. So
					// use the global values as the test
					const cachedScaleSameAsGlobal =
						(lastGlobalScale.event?.scale ?? 0n) ===
						cachedEpochAndScale.scale;

					if (cachedScaleSameAsGlobal) {
						return cachedGAtEpochAndScale;
					} else {
						cachedEpochAndScale = {
							epoch: lastGlobalEpoch.event?.epoch ?? 0n,
							scale: lastGlobalScale.event!.scale
						};

						cachedSAtEpochAndScale = await client.readContract({
							address: protocols[protocol].stabilityPool,
							abi: [
								getAbiItem(
									protocol,
									'stabilityPool',
									'epochToScaleToSum'
								)
							],
							functionName: 'epochToScaleToSum',
							args: [
								lastGlobalEpoch.event?.epoch ?? 0n,
								lastGlobalScale.event?.scale ?? 0n
							]
						});

						return cachedSAtEpochAndScale;
					}
				})();

				firstPortionS = finalSAtDepositScale - lastPSGSnapshot.event!.S;
				secondPortionS = globalS.S / global.SCALE_FACTOR;
			} else {
				firstPortionS = globalS.S - lastPSGSnapshot.event!.S;
				// secondPortion stays 0n
			}

			ethGain =
				(lastDeposit.event!.deposit *
					(firstPortionS + secondPortionS)) /
				lastPSGSnapshot.event!.P /
				global.DECIMAL_PRECISION;

			/** ----------------------------------------------------------------
			 * LUSD Loss
			 --------------------------------------------------------------- */
			const scaleDiff =
				(lastGlobalScale.event?.scale ?? 0n) -
				(lastScaleSnapshot.event?.scale ?? 0n);

			let compoundedStake = 0n;

			if (scaleDiff === 0n) {
				compoundedStake =
					(lastDeposit.event!.deposit * globalP.P) /
					lastPSGSnapshot.event!.P;
			} else if (
				scaleDiff === 1n ||
				// If the epoch changed, scale will go back to 0
				scaleDiff === maxUint128 * -1n
			) {
				compoundedStake =
					(lastDeposit.event!.deposit * globalP.P) /
					lastPSGSnapshot.event!.P /
					global.SCALE_FACTOR;
			} else {
				// if scaleDiff >= 2
				compoundedStake = 0n;
			}

			if (
				compoundedStake <
				lastDeposit.event!.deposit / global.SCALE_FACTOR
			) {
				compoundedStake = 0n;
			}

			lusdLoss = lastDeposit.event!.deposit - compoundedStake;
		}

		if (globalG) {
			/** ----------------------------------------------------------------
		 	 * LQTY Reward
			 ---------------------------------------------------------------- */
			// Every time G is updated, the pending lqty reward changes, but
			// isn't applied until the user deposits or withdraws. Everytime a
			// 3rd party user deposits or withdraws or when a liquidation
			// happens G is updated
			let firstPortionG = 0n;
			let secondPortionG = 0n;

			// If a scale change happened between the last deposit and the event
			// scale changes are extremely rare and epochs virtually impossible, but
			// add the logic for completeness
			if (lastScaleSnapshot.event !== lastGlobalScale.event) {
				const finalGAtDepositScale = await (async () => {
					// If we compare against the deposit snapshots, then the final
					// G will not be re-retrieved until next deposit. So use the
					// global values as the test
					const cachedScaleSameAsGlobal =
						(lastGlobalScale.event?.scale ?? 0n) ===
						cachedEpochAndScale.scale;

					if (cachedScaleSameAsGlobal) {
						return cachedGAtEpochAndScale;
					} else {
						cachedEpochAndScale = {
							epoch: lastGlobalEpoch.event?.epoch ?? 0n,
							scale: lastGlobalScale.event!.scale
						};

						cachedGAtEpochAndScale = await client.readContract({
							address: protocols[protocol].stabilityPool,
							abi: [
								getAbiItem(
									protocol,
									'stabilityPool',
									'epochToScaleToG'
								)
							],
							functionName: 'epochToScaleToG',
							args: [
								lastGlobalEpoch.event?.epoch ?? 0n,
								lastGlobalScale.event?.scale ?? 0n
							]
						});

						return cachedGAtEpochAndScale;
					}
				})();

				firstPortionG = finalGAtDepositScale - lastPSGSnapshot.event!.G;
				secondPortionG = globalG.G / global.SCALE_FACTOR;
			} else {
				firstPortionG = globalG.G - lastPSGSnapshot.event!.G;
				// secondPortionG stays 0n
			}

			const fullLqtyReward =
				(lastDeposit.event!.deposit *
					(firstPortionG + secondPortionG)) /
				lastPSGSnapshot.event!.P /
				global.DECIMAL_PRECISION;

			// Find the kickback rate of the matching front end tag, else use 100%
			const kickbackRate =
				global.frontEndsRegistered.find(
					(e) => e.frontEnd === lastFrontEndTag.event!.frontEndTag
				)?.kickbackRate ?? global.DECIMAL_PRECISION;

			lqtyReward =
				(kickbackRate * fullLqtyReward) / global.DECIMAL_PRECISION;
		}

		timeline.stabilityPool.splice(lastDeposit.index + 1, 0, {
			deposit: lastDeposit.event!.deposit,
			pendingEthGain: ethGain,
			pendingLusdLoss: lusdLoss,
			pendingLqtyReward: lqtyReward,
			operation: globalP
				? ('3rdPartyLiquidationWithStabilityPoolOffset' as const)
				: ('3rdPartyUserAction' as const),
			blockNumber: globalG ? globalG.blockNumber : globalP.blockNumber,
			transactionIndex: globalG
				? globalG.transactionIndex
				: globalP.transactionIndex,
			timestamp: globalG ? globalG.timestamp : globalP.timestamp,
			transactionHash: globalG
				? globalG.transactionHash
				: globalP.transactionHash
		});
	}
}

function spliceLqtyStakingPoolEventsFromFTerms(
	timeline: Timeline,
	global: GlobalState,
	user: UserState
) {
	if (timeline.lqtyStakingPool.length === 0) return;

	const cachedStake = { event: timeline.lqtyStakingPool[0]!, index: 0 };
	let cachedStakerSnapshotIndex = 0;

	const globalFTerms = [...global.FEth, ...global.FLusd].sort((a, b) => {
		if (a.blockNumber === b.blockNumber) {
			return a.transactionIndex - b.transactionIndex;
		}
		return a.blockNumber < b.blockNumber ? -1 : 1;
	});

	// For the staking pool, the stake never changes except for user actions.
	// What we track here are pending rewards. eth gains (fETH) are accumulated
	// when a redemption happens and redemption fees are paid. lusd gains
	// (fLUSD) are accumulated when a deposit happens and deposit fees are paid.
	// Gains are not applied until a user action happens
	for (const f of globalFTerms) {
		if (isBefore(f, timeline.lqtyStakingPool[0]!)) continue;

		let lastStake = getEventBeforComparator({
			comparator: f,
			eventArray: timeline.lqtyStakingPool,
			startIndex: cachedStake.index,
			takeEventInSameTxnIndex: false
		});
		cachedStake.index = lastStake.index;

		// If last stake update was spliced in from the another stake,
		// use the cached stake update, then set cached to the last stake update
		lastStake.event =
			lastStake.event!.operation !== 'UserAction'
				? cachedStake.event
				: lastStake.event;
		cachedStake.event = lastStake.event!;

		if (lastStake.event!.stake === 0n) continue;

		const lastStakerSnapshot = getEventBeforComparator({
			comparator: f,
			eventArray: user.FTermsSnapshots,
			startIndex: cachedStakerSnapshotIndex,
			takeEventInSameTxnIndex: false
		});
		cachedStakerSnapshotIndex = lastStakerSnapshot.index;

		if ('fEth' in f) {
			/** ----------------------------------------------------------------
			 * Eth Gain
			 ---------------------------------------------------------------- */
			const ethGain =
				(lastStake.event!.stake *
					(f.fEth - lastStakerSnapshot.event!.fEth)) /
				global.DECIMAL_PRECISION;

			timeline.lqtyStakingPool.splice(lastStake.index + 1, 0, {
				stake: lastStake.event!.stake,
				pendingEthGain: ethGain,
				pendingLusdGain:
					timeline.lqtyStakingPool[lastStake.index]!.pendingLusdGain,
				operation: '3rdPartyRedemptionFeePaid' as const,
				blockNumber: f.blockNumber,
				transactionIndex: f.transactionIndex,
				timestamp: f.timestamp,
				transactionHash: f.transactionHash
			});
		} else {
			// if 'fLusd' in f
			/** ----------------------------------------------------------------
			 * Lusd Gain
			 ---------------------------------------------------------------- */
			const lusdGain =
				(lastStake.event!.stake *
					(f.fLusd - lastStakerSnapshot.event!.fLusd)) /
				global.DECIMAL_PRECISION;

			timeline.lqtyStakingPool.splice(lastStake.index + 1, 0, {
				stake: lastStake.event!.stake,
				pendingEthGain:
					timeline.lqtyStakingPool[lastStake.index]!.pendingEthGain,
				pendingLusdGain: lusdGain,
				operation: '3rdPartyDepositFeePaid' as const,
				blockNumber: f.blockNumber,
				transactionIndex: f.transactionIndex,
				timestamp: f.timestamp,
				transactionHash: f.transactionHash
			});
		}
	}
}

// prettier-ignore
type StateArray = (
	| GlobalState[Exclude<
		keyof GlobalState,
		'DECIMAL_PRECISION' | 'SCALE_FACTOR' | 'LUSD_GAS_COMPENSATION'
	>]
	| UserState[keyof UserState]
	| Timeline[keyof Timeline]
)

function getEventBeforComparator<T extends StateArray>({
	comparator,
	eventArray,
	startIndex,
	takeEventInSameTxnIndex
}: {
	comparator: StateArray[number];
	eventArray: T;
	startIndex: number;
	takeEventInSameTxnIndex: boolean;
}): {
	event: T[number] | undefined;
	index: number;
} {
	let eventBefore: StateArray[number] | undefined;
	let eventInSameTransaction: StateArray[number] | undefined;
	let eventInSameTransactionIndex: number | undefined;

	while (startIndex < eventArray.length) {
		const t = eventArray[startIndex]!;

		if (takeEventInSameTxnIndex) {
			if (isSameTxn(t, comparator)) {
				eventInSameTransaction = t;
				eventInSameTransactionIndex = startIndex;
				startIndex++;
				continue;
			}

			if (isAfter(t, comparator)) {
				if (
					eventInSameTransaction !== undefined &&
					eventInSameTransactionIndex !== undefined
				) {
					return {
						event: eventInSameTransaction,
						index: eventInSameTransactionIndex
					};
				}
				return {
					event: eventBefore,
					index: eventBefore ? startIndex - 1 : startIndex
				};
			}

			eventBefore = t;
			startIndex++;
		} else {
			if (isAfter(t, comparator) || isSameTxn(t, comparator)) {
				if (startIndex > 0) {
					eventBefore = eventArray[startIndex - 1];
				}
				break;
			}

			eventBefore = t;
			startIndex++;
		}
	}

	if (
		takeEventInSameTxnIndex &&
		eventInSameTransaction !== undefined &&
		eventInSameTransactionIndex !== undefined
	) {
		return {
			event: eventInSameTransaction,
			index: eventInSameTransactionIndex
		};
	}

	return {
		event: eventBefore,
		index: eventBefore ? startIndex - 1 : startIndex
	};
}
