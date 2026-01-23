import type { Address, PublicClient } from 'viem';
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
	userAddress: Address
) {
	const client = createClient(protocol);

	const globalState = await getGlobalState(protocol, client);
	const userState = await getUserState(protocol, userAddress, client);

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

	spliceTroveEventsFromLTerms(timeline, globalState);
	await spliceStabilityPoolEventsFromPSAndG(
		timeline,
		globalState,
		userState,
		client,
		protocol
	);
	spliceLqtyStakingPoolEventsFromFTerms(timeline, globalState, userState);

	return timeline;
}

function spliceTroveEventsFromLTerms(
	timeline: Timeline,
	globalState: GlobalState
) {
	let cachedTroveIndex = 0;
	let cachedLTermsIndex = 0;
	let cachedTroveUpdate = timeline.trove[0]!;

	// L Terms get updated on liquidations
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
		let firstPortionG = 0n;
		let secondPortionG = 0n;

		if (
			// If a scale change happened between the last deposit and the event
			isAfter(lastScale!, lastDeposit!) &&
			(isSameTxn(lastScale!, G) || isBefore(lastScale!, G))
		) {
			const finalGAtDepositScale = await client.readContract({
				address: protocols[protocol].stabilityPool,
				abi: [getAbiItem(protocol, 'stabilityPool', 'epochToScaleToG')],
				functionName: 'epochToScaleToG',
				args: [lastEpoch!.epoch, lastScale!.scale]
			});

			firstPortionG = finalGAtDepositScale - depositorSnapshot!.G;
			secondPortionG = G!.G / globalState.SCALE_FACTOR;
		} else {
			firstPortionG = G!.G - depositorSnapshot!.G;
			// secondPortionG stays 0n
		}

		const fullLqtyReward =
			(lastDeposit!.deposit * (firstPortionG + secondPortionG)) /
			(depositorSnapshot!.P / globalState.DECIMAL_PRECISION);

		const kickbackRate = globalState.frontEnds.find(
			(e) => e.frontEnd === frontEndTag!.frontEndTag
		)!.kickbackRate;

		lqtyReward =
			(kickbackRate * fullLqtyReward) / globalState.DECIMAL_PRECISION;

		// P and S always update with G, but not all G updates have a P and S
		// updates
		if (isSameTxn(lastP!, G)) {
			/**
			 * ETH Gain
			 */
			let firstPortionS = 0n;
			let secondPortionS = 0n;

			if (
				// If a scale change happened between the last deposit and the liq
				isAfter(lastScale!, lastDeposit!) &&
				(isSameTxn(lastScale!, G) || isBefore(lastScale!, G))
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
					args: [lastEpoch!.epoch, lastScale!.scale]
				});

				firstPortionS = finalSumAtDepositScale - depositorSnapshot!.S;
				secondPortionS = lastS!.S / globalState.SCALE_FACTOR;
			} else {
				firstPortionS = lastS!.S - depositorSnapshot!.S;
				// secondPortion stays 0n
			}

			ethGain =
				(lastDeposit!.deposit * (firstPortionS + secondPortionS)) /
				(depositorSnapshot!.P / globalState.DECIMAL_PRECISION);

			/**
			 * LUSD Loss
			 */
			const scaleDiff = lastScale!.scale - depositorSnapshotScale!.scale;
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

	const refStakeTimeline = [...timeline.lqtyStakingPool];

	for (const fEth of globalState.globalFEth) {
		if (isBefore(fEth, timeline.lqtyStakingPool[0]!)) continue;

		let { event: lastStake, index: lastStakeIndex } = getEventBefore({
			blockNumber: fEth.blockNumber,
			transactionIndex: fEth.transactionIndex,
			stateArray: refStakeTimeline,
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
				blockNumber: fEth.blockNumber,
				transactionIndex: fEth.transactionIndex,
				stateArray: userState.stakerSnapshots,
				startIndex: cachedStakerSnapshotIndex,
				takeEventInSameTxnIndex: false
			});
		cachedStakerSnapshotIndex = lastStakerSnapshotIndex;

		/**
		 * Eth Gain
		 */
		const ethGain =
			(lastStake!.stake * (fEth.fEth - lastStakerSnapshot!.fEth)) /
			globalState.DECIMAL_PRECISION;

		timeline.lqtyStakingPool.splice(lastStakeIndex + 1, 0, {
			stake: lastStake!.stake,
			pendingEthGain: ethGain,
			pendingLusdGain: 0n,
			operation: '3rdPartyRedemptionFeePaid' as const,
			blockNumber: fEth.blockNumber,
			transactionIndex: fEth.transactionIndex,
			timestamp: fEth.timestamp
		});
	}

	for (const fLusd of globalState.globalFLusd) {
		if (isBefore(fLusd, timeline.lqtyStakingPool[0]!)) continue;

		let { event: lastStake, index: lastStakeIndex } = getEventBefore({
			blockNumber: fLusd.blockNumber,
			transactionIndex: fLusd.transactionIndex,
			stateArray: refStakeTimeline,
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
				blockNumber: fLusd.blockNumber,
				transactionIndex: fLusd.transactionIndex,
				stateArray: userState.stakerSnapshots,
				startIndex: cachedStakerSnapshotIndex,
				takeEventInSameTxnIndex: false
			});
		cachedStakerSnapshotIndex = lastStakerSnapshotIndex;

		/**
		 * Lusd Gain
		 */
		const lusdGain =
			(lastStake!.stake * (fLusd.fLusd - lastStakerSnapshot!.fLusd)) /
			globalState.DECIMAL_PRECISION;

		timeline.lqtyStakingPool.splice(lastStakeIndex + 1, 0, {
			stake: lastStake!.stake,
			pendingEthGain: 0n,
			pendingLusdGain: lusdGain,
			operation: '3rdPartyDepositFeePaid' as const,
			blockNumber: fLusd.blockNumber,
			transactionIndex: fLusd.transactionIndex,
			timestamp: fLusd.timestamp
		});
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
				| 'DECIMAL_PRECISION'
				| 'LUSD_GAS_COMPENSATION'
				| 'PERCENT_DIVISOR'
				| '_100pct'
				| 'MCR'
				| 'CCR'
				| 'SCALE_FACTOR'
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
