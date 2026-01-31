import { maxUint128, type Address, type PublicClient } from 'viem';
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
		collPending: bigint;
		debtPending: bigint;
		operation:
			| (typeof borrowerOperationEnum)[number]
			| (typeof troveManagerOperationEnum)[number]
			| '3rdPartyLiquidationWithEmptyStabilityPool';
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	stabilityPool: {
		deposit: bigint;
		pendingEthGain: bigint;
		pendingDepositLoss: bigint;
		pendingLqtyReward: bigint;
		operation:
			| 'UserAction'
			| '3rdPartyUserAction'
			| '3rdPartyLiquidationWithStabilityPoolOffset';
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
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
	}[];
	collateralSurplusPool: {
		surplus: bigint;
		operation:
			| 'CollClaimed'
			| 'TroveRedeemedToCloseOrLiquidatedInRecoveryMode';
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
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

	const globalState = await getGlobalState(
		protocol,
		client,
		blockNumberToTimestampMap,
		(key) => progress?.('Global: ' + key)
	);
	const userState = await getUserState(
		protocol,
		userAddress,
		client,
		blockNumberToTimestampMap,
		(key) => progress?.('User: ' + key)
	);

	const timeline: Timeline = {
		trove: [
			...userState.troveBorrowerOperations.map((e) => {
				return {
					coll: e.coll,
					debt: e.debt,
					stake: e.stake,
					collPending: 0n,
					debtPending: 0n,
					operation: e.operation,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp
				};
			}),
			...userState.troveTroveManager.map((e) => {
				return {
					coll: e.coll,
					debt: e.debt,
					stake: e.stake,
					collPending: 0n,
					debtPending: 0n,
					operation: e.operation,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp
				};
			})
		].sort((a, b) => {
			if (a.blockNumber === b.blockNumber) {
				return a.transactionIndex - b.transactionIndex;
			}
			return Number(a.blockNumber - b.blockNumber);
		}),
		stabilityPool: [
			...userState.depositedLusd.map((e) => {
				return {
					deposit: e.deposit,
					pendingEthGain: 0n,
					pendingDepositLoss: 0n,
					pendingLqtyReward: 0n,
					operation: 'UserAction' as const,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp
				};
			})
		],
		lqtyStakingPool: [
			...userState.stakedLqty.map((e) => {
				return {
					stake: e.stake,
					pendingEthGain: 0n,
					pendingLusdGain: 0n,
					operation: 'UserAction' as const,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp
				};
			})
		],
		collateralSurplusPool: [
			...userState.collBalance.map((e) => {
				return {
					surplus: e.surplus,
					operation:
						e.surplus === 0n
							? ('CollClaimed' as const)
							: ('TroveRedeemedToCloseOrLiquidatedInRecoveryMode' as const),
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp
				};
			})
		]
	};

	progress?.('Building timeline…');
	spliceTroveEventsFromLTerms(timeline, globalState);
	await spliceStabilityPoolEventsFromPSAndG(
		timeline,
		globalState,
		userState,
		client,
		protocol
	);
	spliceLqtyStakingPoolEventsFromFTerms(timeline, globalState, userState);

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

	return timeline;
}

function spliceTroveEventsFromLTerms(
	timeline: Timeline,
	globalState: GlobalState
) {
	let cachedTroveIndex = 0;
	let cachedLTermsIndex = 0;
	let cachedTroveUpdate = timeline.trove[0]!;

	if (timeline.trove.length === 0) return;

	// L Terms get updated on liquidations when stability pool is empty
	// This is typically 0 since the stability pool is rarely if ever empty
	for (const lAtLiq of globalState.globalLTerms) {
		if (isBefore(lAtLiq, timeline.trove[0]!)) continue;

		let { event: lastTroveUpdate, index: lastTroveIndex } = getEventBefore({
			blockNumber: lAtLiq.blockNumber,
			transactionIndex: lAtLiq.transactionIndex,
			stateArray: timeline.trove,
			startIndex: cachedTroveIndex,
			takeEventInSameTxnIndex: false
		});
		cachedTroveIndex = lastTroveIndex;

		// If last trove update was spliced in from the another liquidation,
		// use the cached trove update, then set cached to the last trove update
		lastTroveUpdate =
			lastTroveUpdate!.operation ===
			'3rdPartyLiquidationWithEmptyStabilityPool'
				? cachedTroveUpdate
				: lastTroveUpdate;
		cachedTroveUpdate = lastTroveUpdate!;

		if (lastTroveUpdate!.coll === 0n) continue;

		/**
		 * Coll & Debt Gain
		 */
		const { event: lastTroveLTerms, index: lastTroveLTermsIndex } =
			getEventBefore({
				blockNumber: lAtLiq.blockNumber,
				transactionIndex: lAtLiq.transactionIndex,
				stateArray: timeline.trove,
				startIndex: cachedLTermsIndex,
				takeEventInSameTxnIndex: false
			});
		cachedLTermsIndex = lastTroveLTermsIndex;

		const ethRewardPerUnitStaked = lAtLiq.lEth - lastTroveLTerms!.coll;
		const pendingEthReward =
			(lastTroveUpdate!.stake * ethRewardPerUnitStaked) /
			globalState.DECIMAL_PRECISION;

		const lusdRewardPerUnitStaked = lAtLiq.lLusd - lastTroveLTerms!.debt;
		const pendingLusdReward =
			(lastTroveUpdate!.stake * lusdRewardPerUnitStaked) /
			globalState.DECIMAL_PRECISION;

		if (pendingEthReward > timeline.trove[lastTroveIndex]!.collPending) {
			timeline.trove.splice(lastTroveIndex + 1, 0, {
				coll: lastTroveUpdate!.coll,
				debt: lastTroveUpdate!.debt,
				stake: lastTroveUpdate!.stake,
				collPending: pendingEthReward,
				debtPending: pendingLusdReward,
				operation: '3rdPartyLiquidationWithEmptyStabilityPool',
				blockNumber: lAtLiq.blockNumber,
				transactionIndex: lAtLiq.transactionIndex,
				timestamp: lAtLiq.timestamp
			});
		}
	}
}

async function spliceStabilityPoolEventsFromPSAndG(
	timeline: Timeline,
	globalState: GlobalState,
	userState: UserState,
	client: PublicClient,
	protocol: ProtocolName
) {
	let cachedDepositIndex = 0;
	let cachedDeposit = timeline.stabilityPool[0]!;
	let cachedSnapshotIndex = 0;
	let cachedSnapshotScaleIndex = 0;
	let cachedFrontEndTagIndex = 0;
	let cachedPIndex = 0;
	let cachedSIndex = 0;
	let cachedScaleIndex = 0;
	let cachedEpochIndex = 0;

	let cachedGAtEpochAndScale = await client.readContract({
		address: protocols[protocol].stabilityPool,
		abi: [getAbiItem(protocol, 'stabilityPool', 'epochToScaleToG')],
		functionName: 'epochToScaleToG',
		args: [0n, 0n]
	});
	let cachedEpochAndScale = {
		epoch: 0n,
		scale: 0n
	};

	if (timeline.stabilityPool.length === 0) return;

	for (const G of globalState.globalG) {
		if (isBefore(G, timeline.stabilityPool[0]!)) continue;

		let { event: lastDeposit, index: lastDepositIndex } = getEventBefore({
			blockNumber: G.blockNumber,
			transactionIndex: G.transactionIndex,
			stateArray: timeline.stabilityPool,
			startIndex: cachedDepositIndex,
			takeEventInSameTxnIndex: false
		});
		cachedDepositIndex = lastDepositIndex;

		// If last deposit update was spliced in from the another deposit,
		// use the cached deposit update, then set cached to the last deposit update
		lastDeposit =
			lastDeposit!.operation !== 'UserAction'
				? cachedDeposit
				: lastDeposit;
		cachedDeposit = lastDeposit!;

		if (lastDeposit!.deposit === 0n) continue;

		const { event: depositorSnapshot, index: depositorSnapshotIndex } =
			getEventBefore({
				blockNumber: G.blockNumber,
				transactionIndex: G.transactionIndex,
				stateArray: userState.depositorSnapshots,
				startIndex: cachedSnapshotIndex,
				takeEventInSameTxnIndex: false
			});
		cachedSnapshotIndex = depositorSnapshotIndex;

		const {
			event: depositorSnapshotScale,
			index: depositorSnapshotScaleIndex
		} = getEventBefore({
			blockNumber: depositorSnapshot!.blockNumber,
			transactionIndex: depositorSnapshot!.transactionIndex,
			stateArray: globalState.globalScale,
			startIndex: cachedSnapshotScaleIndex,
			takeEventInSameTxnIndex: false
		});
		cachedSnapshotScaleIndex = depositorSnapshotScaleIndex;

		const { event: frontEndTag, index: frontEndTagIndex } = getEventBefore({
			blockNumber: G.blockNumber,
			transactionIndex: G.transactionIndex,
			stateArray: userState.frontEndTag,
			startIndex: cachedFrontEndTagIndex,
			takeEventInSameTxnIndex: false
		});
		cachedFrontEndTagIndex = frontEndTagIndex;

		const { event: lastP, index: lastPIndex } = getEventBefore({
			blockNumber: G.blockNumber,
			transactionIndex: G.transactionIndex,
			stateArray: globalState.globalP,
			startIndex: cachedPIndex,
			takeEventInSameTxnIndex: true
		});
		cachedPIndex = lastPIndex;

		const { event: lastS, index: lastSIndex } = getEventBefore({
			blockNumber: G.blockNumber,
			transactionIndex: G.transactionIndex,
			stateArray: globalState.globalS,
			startIndex: cachedSIndex,
			takeEventInSameTxnIndex: true
		});
		cachedSIndex = lastSIndex;

		const { event: lastScale, index: lastScaleIndex } = getEventBefore({
			blockNumber: G.blockNumber,
			transactionIndex: G.transactionIndex,
			stateArray: globalState.globalScale,
			startIndex: cachedScaleIndex,
			takeEventInSameTxnIndex: false
		});
		cachedScaleIndex = lastScaleIndex;

		const { event: lastEpoch, index: lastEpochIndex } = getEventBefore({
			blockNumber: G.blockNumber,
			transactionIndex: G.transactionIndex,
			stateArray: globalState.globalEpoch,
			startIndex: cachedEpochIndex,
			takeEventInSameTxnIndex: false
		});
		cachedEpochIndex = lastEpochIndex;

		let lqtyReward = lastDeposit!.pendingLqtyReward;
		let ethGain = lastDeposit!.pendingEthGain;
		let lusdLoss = lastDeposit!.pendingDepositLoss;

		/**
		 * LQTY Reward
		 */
		// Every time G is updated, the pending lqty reward changes, but isn't
		// applied until the user deposits or withdraws. Everytime a 3rd party
		// user (not the depositor) deposits or withdraws or when a liquidation
		// happens, G is updated
		let firstPortionG = 0n;
		let secondPortionG = 0n;

		if (
			// If a scale change happened between the last deposit and the event
			// scale changes are extremely rare and epochs almost impossible,
			// but add the logic for completeness
			lastScale &&
			isAfter(lastScale, lastDeposit!) &&
			(isSameTxn(lastScale, G) || isBefore(lastScale, G))
		) {
			// If the epoch changed we use the previous epoch or 0n if never changed
			const epochToUse =
				lastEpoch &&
				isAfter(lastEpoch, lastDeposit!) &&
				(isSameTxn(lastEpoch, G) || isBefore(lastEpoch, G))
					? lastEpoch.epoch - 1n
					: lastEpoch?.epoch ?? 0n;

			const scaleToUse =
				lastEpoch &&
				isAfter(lastEpoch, lastDeposit!) &&
				(isSameTxn(lastEpoch, G) || isBefore(lastEpoch, G))
					? maxUint128 - 1n
					: lastScale.scale - 1n;

			const finalGAtDepositScale = await (async () => {
				if (
					(lastEpoch?.epoch ?? 0n) === cachedEpochAndScale.epoch &&
					lastScale.scale === cachedEpochAndScale.scale
				) {
					return cachedGAtEpochAndScale;
				} else {
					cachedEpochAndScale = {
						epoch: lastEpoch?.epoch ?? 0n,
						scale: lastScale.scale
					};

					return await client.readContract({
						address: protocols[protocol].stabilityPool,
						abi: [
							getAbiItem(
								protocol,
								'stabilityPool',
								'epochToScaleToG'
							)
						],
						functionName: 'epochToScaleToG',
						args: [epochToUse, scaleToUse]
					});
				}
			})();

			firstPortionG = finalGAtDepositScale - depositorSnapshot!.G;
			secondPortionG = G.G / globalState.SCALE_FACTOR;
		} else {
			firstPortionG = G.G - depositorSnapshot!.G;
			// secondPortionG stays 0n
		}

		const fullLqtyReward =
			(lastDeposit!.deposit * (firstPortionG + secondPortionG)) /
			depositorSnapshot!.P /
			globalState.DECIMAL_PRECISION;

		const kickbackRate =
			globalState.frontEnds.find(
				(e) => e.frontEnd === frontEndTag!.frontEndTag
			)?.kickbackRate ?? globalState.DECIMAL_PRECISION;

		lqtyReward =
			(kickbackRate * fullLqtyReward) / globalState.DECIMAL_PRECISION;

		// P and S always update with every liquidation, meaning it always
		// updates with G. But not all G updates have a P and S updates
		if (isSameTxn(lastP!, G)) {
			/**
			 * ETH Gain
			 */
			let firstPortionS = 0n;
			let secondPortionS = 0n;

			if (
				// If a scale change happened between the last deposit and the liq
				lastScale &&
				isAfter(lastScale, lastDeposit!) &&
				(isSameTxn(lastScale, G) || isBefore(lastScale, G))
			) {
				const finalSumAtDepositScale = await client.readContract({
					address: protocols[protocol].stabilityPool,
					abi: [
						getAbiItem(
							protocol,
							'stabilityPool',
							'epochToScaleToSum'
						)
					],
					functionName: 'epochToScaleToSum',
					args: [lastEpoch?.epoch ?? 0n, lastScale.scale]
				});

				firstPortionS = finalSumAtDepositScale - depositorSnapshot!.S;
				secondPortionS = lastS!.S / globalState.SCALE_FACTOR;
			} else {
				firstPortionS = lastS!.S - depositorSnapshot!.S;
				// secondPortion stays 0n
			}

			ethGain =
				(lastDeposit!.deposit * (firstPortionS + secondPortionS)) /
				depositorSnapshot!.P /
				globalState.DECIMAL_PRECISION;

			/**
			 * LUSD Loss
			 */
			const scaleDiff =
				(lastScale?.scale ?? 0n) -
				(depositorSnapshotScale?.scale ?? 0n);
			let compoundedStake = 0n;

			if (scaleDiff === 0n) {
				compoundedStake = lastDeposit!.deposit;
			} else if (scaleDiff === 1n) {
				compoundedStake =
					(lastDeposit!.deposit * depositorSnapshot!.P) /
					depositorSnapshot!.P /
					globalState.SCALE_FACTOR;
			} else {
				// if scaleDiff >= 2
				compoundedStake = 0n;
			}

			if (compoundedStake < lastDeposit!.deposit) compoundedStake = 0n;

			lusdLoss = lastDeposit!.deposit - compoundedStake;

			if (
				ethGain >
				timeline.stabilityPool[lastDepositIndex]!.pendingEthGain
			) {
				timeline.stabilityPool.splice(lastDepositIndex + 1, 0, {
					deposit: lastDeposit!.deposit,
					pendingEthGain: ethGain,
					pendingDepositLoss: lusdLoss,
					pendingLqtyReward: lqtyReward,
					operation:
						'3rdPartyLiquidationWithStabilityPoolOffset' as const,
					blockNumber: G.blockNumber,
					transactionIndex: G.transactionIndex,
					timestamp: G.timestamp
				});
			}
		} else {
			if (
				lqtyReward >
				timeline.stabilityPool[lastDepositIndex]!.pendingLqtyReward
			) {
				timeline.stabilityPool.splice(lastDepositIndex + 1, 0, {
					deposit: lastDeposit!.deposit,
					pendingEthGain: 0n,
					pendingDepositLoss: lusdLoss,
					pendingLqtyReward: lqtyReward,
					operation: '3rdPartyUserAction' as const,
					blockNumber: G.blockNumber,
					transactionIndex: G.transactionIndex,
					timestamp: G.timestamp
				});
			}
		}
	}
}

function spliceLqtyStakingPoolEventsFromFTerms(
	timeline: Timeline,
	globalState: GlobalState,
	userState: UserState
) {
	let cachedStakeIndex = 0;
	let cachedStake = timeline.lqtyStakingPool[0]!;
	let cachedStakerSnapshotIndex = 0;

	const globalEvents = [
		...globalState.globalFEth,
		...globalState.globalFLusd
	].sort((a, b) => {
		if (a.blockNumber === b.blockNumber) {
			return a.transactionIndex - b.transactionIndex;
		}
		return Number(a.blockNumber - b.blockNumber);
	});

	// For the staking pool, the stake never changes except for user actions.
	// What we track here are pending rewards. eth gains (fETH) are accumulated
	// when a redemption happens and redemption fees are paid. lusd gains
	// (fLUSD) are accumulated when a deposit happens and deposit fees are paid.
	// Gains are not applied until a user action happens
	for (const f of globalEvents) {
		if (isBefore(f, timeline.lqtyStakingPool[0]!)) continue;

		let { event: lastStake, index: lastStakeIndex } = getEventBefore({
			blockNumber: f.blockNumber,
			transactionIndex: f.transactionIndex,
			stateArray: timeline.lqtyStakingPool,
			startIndex: cachedStakeIndex,
			takeEventInSameTxnIndex: false
		});
		cachedStakeIndex = lastStakeIndex;

		// If last stake update was spliced in from the another stake,
		// use the cached stake update, then set cached to the last stake update
		lastStake =
			lastStake!.operation !== 'UserAction' ? cachedStake : lastStake;
		cachedStake = lastStake!;

		if (lastStake!.stake === 0n) continue;

		const { event: lastStakerSnapshot, index: lastStakerSnapshotIndex } =
			getEventBefore({
				blockNumber: f.blockNumber,
				transactionIndex: f.transactionIndex,
				stateArray: userState.stakerSnapshots,
				startIndex: cachedStakerSnapshotIndex,
				takeEventInSameTxnIndex: false
			});
		cachedStakerSnapshotIndex = lastStakerSnapshotIndex;

		if ('fEth' in f) {
			/**
			 * Eth Gain
			 */
			const ethGain =
				(lastStake!.stake * (f.fEth - lastStakerSnapshot!.fEth)) /
				globalState.DECIMAL_PRECISION;

			timeline.lqtyStakingPool.splice(lastStakeIndex + 1, 0, {
				stake: lastStake!.stake,
				pendingEthGain: ethGain,
				pendingLusdGain:
					timeline.lqtyStakingPool[lastStakeIndex]!.pendingLusdGain,
				operation: '3rdPartyRedemptionFeePaid' as const,
				blockNumber: f.blockNumber,
				transactionIndex: f.transactionIndex,
				timestamp: f.timestamp
			});
		} else {
			// if 'fLusd' in f
			/**
			 * Lusd Gain
			 */
			const lusdGain =
				(lastStake!.stake * (f.fLusd - lastStakerSnapshot!.fLusd)) /
				globalState.DECIMAL_PRECISION;

			timeline.lqtyStakingPool.splice(lastStakeIndex + 1, 0, {
				stake: lastStake!.stake,
				pendingEthGain:
					timeline.lqtyStakingPool[lastStakeIndex]!.pendingEthGain,
				pendingLusdGain: lusdGain,
				operation: '3rdPartyDepositFeePaid' as const,
				blockNumber: f.blockNumber,
				transactionIndex: f.transactionIndex,
				timestamp: f.timestamp
			});
		}
	}

	for (let i = 0; i < timeline.lqtyStakingPool.length; i++) {
		const e = timeline.lqtyStakingPool[i]!;

		if (e.operation === 'UserAction') {
			continue;
		} else if (e.operation === '3rdPartyRedemptionFeePaid') {
			e.pendingLusdGain =
				timeline.lqtyStakingPool[i - 1]!.pendingLusdGain;
		} else {
			// if operation is 3rdPartyDepositFeePaid
			e.pendingEthGain = timeline.lqtyStakingPool[i - 1]!.pendingEthGain;
		}
	}
}

function getEventBefore<
	T extends
		| GlobalState[Exclude<
				keyof GlobalState,
				'DECIMAL_PRECISION' | 'SCALE_FACTOR'
		  >]
		| UserState[keyof UserState]
		| Timeline[keyof Timeline]
>({
	blockNumber,
	transactionIndex,
	stateArray,
	startIndex,
	takeEventInSameTxnIndex
}: {
	blockNumber: bigint;
	transactionIndex: number;
	stateArray: T;
	startIndex: number;
	takeEventInSameTxnIndex: boolean;
}): {
	event: T[number] | undefined;
	index: number;
} {
	let eventBefore: (typeof stateArray)[number] | undefined;
	let eventInSameTransaction: (typeof stateArray)[number] | undefined;
	let eventInSameTransactionIndex: number | undefined;

	while (startIndex < stateArray.length) {
		const t = stateArray[startIndex]!;

		if (takeEventInSameTxnIndex) {
			if (isSameTxn(t, { blockNumber, transactionIndex })) {
				eventInSameTransaction = t;
				eventInSameTransactionIndex = startIndex;
				startIndex++;
				continue;
			}

			if (isAfter(t, { blockNumber, transactionIndex })) {
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
			if (
				isAfter(t, { blockNumber, transactionIndex }) ||
				isSameTxn(t, { blockNumber, transactionIndex })
			) {
				if (startIndex > 0) {
					eventBefore = stateArray[startIndex - 1];
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
