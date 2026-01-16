import type { Address } from 'viem';
import type { ProtocolName } from '../protocols/protocols.js';
import type {
	borrowerOperationEnum,
	troveManagerOperationEnum
} from '../protocols/enums.js';
import { getGlobalState, type GlobalState } from './global.js';
import { getUserState, type UserState } from './user.js';
import { createClient } from '../protocols/client.js';
import { maxUint256 } from 'viem';

type DerivedFrom = 'event' | 'liquidation' | 'redemption';

export type Timeline = {
	// Affected by user actions, redemptions, liquidation of user, liquidation
	// of other troves when stability pool is empty.
	// Redemptions reduce debt and coll at equal value, and if
	trove: {
		coll: bigint;
		debt: bigint;
		stake: bigint;
		feesPaid: bigint;
		accumulatedFees: bigint;
		accumulatedFeesRepaid: bigint;
		operation:
			| (typeof borrowerOperationEnum)[number]
			| (typeof troveManagerOperationEnum)[number]
			| '3rdPartyLiquidationWithEmptyStabilityPool';
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	// Affected by user actions, liquidations when stability pool is not empty,
	// and recieves LQTY emissions on a regulat schedule
	// NOTE: Distributed ETH coll is 99.5% of collateral
	stabilityPool: {
		deposit: bigint;
		pendingETHGain: bigint;
		pendingLQTYGain: bigint;
		pendingLUSDLoss: bigint;
		appliedETHGain: bigint;
		appliedLQTYGain: bigint;
		appliedLUSDLoss: bigint;
		accumulatedETHGain: bigint;
		accumulatedLQTYGain: bigint;
		accumulatedLUSDLoss: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	// Affected by user actions, and rewards are given from redemption fees,
	// and LUSD issuance fees while not in recovery mode
	lqtyStakingPool: {
		stake: bigint;
		pendingETHGain: bigint;
		pendingLUSDGain: bigint;
		appliedETHGain: bigint;
		appliedLUSDGain: bigint;
		accumulatedETHGain: bigint;
		accumulatedLUSDGain: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
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
			...userState.troveUpdatedBorrowerOperations.map((e) => {
				return {
					coll: e.coll,
					debt: e.debt,
					stake: e.stake,
					feesPaid: 0n,
					accumulatedFees: 0n,
					accumulatedFeesRepaid: 0n,
					operation: e.operation,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp,
					derivedFrom: e.derivedFrom
				};
			}),
			...userState.troveUpdatedTroveManager.map((e) => {
				return {
					coll: e.coll,
					debt: e.debt,
					stake: e.stake,
					feesPaid: 0n,
					accumulatedFees: 0n,
					accumulatedFeesRepaid: 0n,
					operation: e.operation,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp,
					derivedFrom: e.derivedFrom
				};
			})
		].sort((a, b) => {
			if (a.blockNumber === b.blockNumber) {
				return a.transactionIndex - b.transactionIndex;
			}
			return Number(a.blockNumber - b.blockNumber);
		}),
		stabilityPool: [
			...userState.userDepositChanged.map((e) => {
				return {
					deposit: e.balance,
					pendingETHGain: 0n,
					pendingLQTYGain: 0n,
					pendingLUSDLoss: 0n,
					appliedETHGain: 0n,
					appliedLQTYGain: 0n,
					appliedLUSDLoss: 0n,
					accumulatedETHGain: 0n,
					accumulatedLQTYGain: 0n,
					accumulatedLUSDLoss: 0n,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp,
					derivedFrom: e.derivedFrom
				};
			})
		],
		lqtyStakingPool: [
			...userState.stakeChanged.map((e) => {
				return {
					stake: e.balance,
					pendingETHGain: 0n,
					pendingLUSDGain: 0n,
					appliedETHGain: 0n,
					appliedLUSDGain: 0n,
					accumulatedETHGain: 0n,
					accumulatedLUSDGain: 0n,
					blockNumber: e.blockNumber,
					transactionIndex: e.transactionIndex,
					timestamp: e.timestamp,
					derivedFrom: e.derivedFrom
				};
			})
		]
	};

	let cachedTotalLusdIndex = 0;
	let cachedTotalStakesIndex = 0;
	let cachedTotalCollIndex = 0;
	let cachedTotalDebtIndex = 0;
	let cachedPriceIndex = 0;

	let cachedUserTroveIndex = 0;
	let cachedUserDepositIndex = 0;

	for (const liquidation of globalState.liquidations) {
		if (liquidation.borrower === userAddress) continue;

		const { event: spBefore, index: totalLusdIndex } =
			getEventForLiquidation(
				liquidation,
				globalState.totalDepositedLUSD,
				cachedTotalLusdIndex,
				true
			);
		cachedTotalLusdIndex = totalLusdIndex;

		const { event: stakesBefore, index: totalStakesIndex } =
			getEventForLiquidation(
				liquidation,
				globalState.totalStakes,
				cachedTotalStakesIndex,
				true
			);
		cachedTotalStakesIndex = totalStakesIndex;

		const { event: totalCollBefore, index: totalCollIndex } =
			getEventForLiquidation(
				liquidation,
				globalState.totalColl,
				cachedTotalCollIndex,
				true
			);
		cachedTotalCollIndex = totalCollIndex;

		const { event: totalDebtBefore, index: totalDebtIndex } =
			getEventForLiquidation(
				liquidation,
				globalState.totalDebt,
				cachedTotalDebtIndex,
				true
			);
		cachedTotalDebtIndex = totalDebtIndex;

		const { event: priceBefore, index: priceIndex } =
			getEventForLiquidation(
				liquidation,
				globalState.prices,
				cachedPriceIndex,
				true
			);
		cachedPriceIndex = priceIndex;

		const { event: troveBefore, index: userTroveIndex } =
			getEventForLiquidation(
				liquidation,
				timeline.trove,
				cachedUserTroveIndex,
				true
			);
		cachedUserTroveIndex = userTroveIndex;

		const { event: depositBefore, index: userDepositIndex } =
			getEventForLiquidation(
				liquidation,
				userState.userDepositChanged,
				cachedUserDepositIndex,
				true
			);
		cachedUserDepositIndex = userDepositIndex;

		if (
			(!troveBefore || troveBefore.coll === 0n) &&
			(!depositBefore || depositBefore.balance === 0n)
		) {
			continue;
		}

		const totalLusdBefore = spBefore?.balance ?? 0n;
		const totalStakesBefore = stakesBefore?.amount ?? 0n;
		const userDepositBefore = depositBefore?.balance ?? 0n;
		const price = priceBefore?.price ?? 0n;
		const totalColl = totalCollBefore?.balance ?? 0n;
		const totalDebt = totalDebtBefore?.balance ?? 0n;

		// Calculate offset vs redistributed
		let {
			debtToOffset,
			collToSendToSP,
			debtToRedistribute,
			collToRedistribute
		}: {
			debtToOffset: bigint;
			collToSendToSP: bigint;
			debtToRedistribute: bigint;
			collToRedistribute: bigint;
		} = {
			debtToOffset: 0n,
			collToSendToSP: 0n,
			debtToRedistribute: 0n,
			collToRedistribute: 0n
		};

		if (liquidation.operation === 'liquidateInNormalMode') {
			const collGasCompensation =
				liquidation.coll / globalState.PERCENT_DIVISOR;
			const collToLiquidate = liquidation.coll - collGasCompensation;

			const {
				debtToOffset: normalDebtToOffset,
				collToSendToSP: normalCollToSendToSP,
				debtToRedistribute: normalDebtToRedistribute,
				collToRedistribute: normalCollToRedistribute
			} = getOffsetAndRedistributionVals(
				liquidation.debt,
				collToLiquidate,
				totalLusdBefore
			);

			debtToOffset = normalDebtToOffset;
			collToSendToSP = normalCollToSendToSP;
			debtToRedistribute = normalDebtToRedistribute;
			collToRedistribute = normalCollToRedistribute;
		} else {
			const eventICR = computeCR(
				liquidation.coll,
				liquidation.debt,
				price
			);
			const TCR = computeCR(totalColl, totalDebt, price);

			if (eventICR <= globalState._100pct) {
				const collGasCompensation =
					liquidation.coll / globalState.PERCENT_DIVISOR;
				const collToLiquidate = liquidation.coll - collGasCompensation;

				debtToOffset = 0n;
				collToSendToSP = 0n;
				debtToRedistribute = liquidation.debt;
				collToRedistribute = collToLiquidate;
			} else if (
				eventICR > globalState._100pct &&
				eventICR <= globalState.MCR
			) {
				const collGasCompensation =
					liquidation.coll / globalState.PERCENT_DIVISOR;
				const collToLiquidate = liquidation.coll - collGasCompensation;

				const {
					debtToOffset: recoveryDebtToOffset,
					collToSendToSP: recoveryCollToSendToSP,
					debtToRedistribute: recoveryDebtToRedistribute,
					collToRedistribute: recoveryCollToRedistribute
				} = getOffsetAndRedistributionVals(
					liquidation.debt,
					collToLiquidate,
					totalLusdBefore
				);

				debtToOffset = recoveryDebtToOffset;
				collToSendToSP = recoveryCollToSendToSP;
				debtToRedistribute = recoveryDebtToRedistribute;
				collToRedistribute = recoveryCollToRedistribute;
			} else if (
				eventICR >= globalState.MCR &&
				eventICR < TCR &&
				liquidation.debt <= totalLusdBefore
			) {
				const {
					debtToOffset: cappedDebtToOffset,
					collToSendToSP: cappedCollToSendToSP,
					debtToRedistribute: cappedDebtToRedistribute,
					collToRedistribute: cappedCollToRedistribute
				} = getCappedOffsetVals(
					liquidation.debt,
					liquidation.coll,
					price,
					globalState.MCR,
					globalState.PERCENT_DIVISOR
				);

				debtToOffset = cappedDebtToOffset;
				collToSendToSP = cappedCollToSendToSP;
				debtToRedistribute = cappedDebtToRedistribute;
				collToRedistribute = cappedCollToRedistribute;
			} else {
				// if (eventICR >= globalState.MCR && eventICR >= globalState.TCR || liquidation.debt > totalLusdBefore)
				debtToOffset = 0n;
				collToSendToSP = 0n;
				debtToRedistribute = 0n;
				collToRedistribute = 0n;
			}
		}

		if (debtToOffset > 0n) {
		}

		if (debtToRedistribute > 0n) {
		}
	}
}

function getEventForLiquidation<
	T extends
		| GlobalState[Exclude<
				keyof GlobalState,
				| 'LUSD_GAS_COMPENSATION'
				| 'PERCENT_DIVISOR'
				| '_100pct'
				| 'MCR'
				| 'CCR'
		  >]
		| UserState[keyof UserState]
		| Timeline[keyof Timeline]
>(
	liquidationEvent: GlobalState['liquidations'][number],
	stateArray: T,
	totalLusdStartIndex: number,
	takeEventInSameTxnIndex: boolean
): {
	event: T[number] | undefined;
	index: number;
} {
	let eventBeforeLiquidation: (typeof stateArray)[number] | undefined;
	let eventInSameTransaction: (typeof stateArray)[number] | undefined;
	let eventInSameTransactionIndex: number | undefined;

	while (totalLusdStartIndex < stateArray.length) {
		const t = stateArray[totalLusdStartIndex]!;

		if (takeEventInSameTxnIndex) {
			const isSameTransaction =
				t.blockNumber === liquidationEvent.blockNumber &&
				t.transactionIndex === liquidationEvent.transactionIndex;

			if (isSameTransaction) {
				eventInSameTransaction = t;
				eventInSameTransactionIndex = totalLusdStartIndex;
				totalLusdStartIndex++;
				continue;
			}

			const isAfter =
				t.blockNumber > liquidationEvent.blockNumber ||
				(t.blockNumber === liquidationEvent.blockNumber &&
					t.transactionIndex > liquidationEvent.transactionIndex);

			if (isAfter) {
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
					event: eventBeforeLiquidation,
					index: eventBeforeLiquidation
						? totalLusdStartIndex - 1
						: totalLusdStartIndex
				};
			}

			eventBeforeLiquidation = t;
			totalLusdStartIndex++;
		} else {
			const isAfterOrEqual =
				t.blockNumber > liquidationEvent.blockNumber ||
				(t.blockNumber === liquidationEvent.blockNumber &&
					t.transactionIndex >= liquidationEvent.transactionIndex);

			if (isAfterOrEqual) {
				if (totalLusdStartIndex > 0) {
					eventBeforeLiquidation =
						stateArray[totalLusdStartIndex - 1];
				}
				break;
			}

			eventBeforeLiquidation = t;
			totalLusdStartIndex++;
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
		event: eventBeforeLiquidation,
		index: eventBeforeLiquidation
			? totalLusdStartIndex - 1
			: totalLusdStartIndex
	};
}

function computeCR(coll: bigint, debt: bigint, price: bigint) {
	if (debt > 0) {
		const newCollRatio = (coll * price) / debt;

		return newCollRatio;
	} else {
		return maxUint256;
	}
}

function getOffsetAndRedistributionVals(
	debt: bigint,
	coll: bigint,
	LUSDInSP: bigint
) {
	if (LUSDInSP > 0n) {
		const debtToOffset = debt - LUSDInSP < 0n ? debt : LUSDInSP;
		const collToSendToSP = (coll * debtToOffset) / debt;
		const debtToRedistribute = debt - debtToOffset;
		const collToRedistribute = coll - collToSendToSP;

		return {
			debtToOffset,
			collToSendToSP,
			debtToRedistribute,
			collToRedistribute
		};
	} else {
		return {
			debtToOffset: 0n,
			collToSendToSP: 0n,
			debtToRedistribute: debt,
			collToRedistribute: coll
		};
	}
}

function getCappedOffsetVals(
	entireDebt: bigint,
	entireColl: bigint,
	price: bigint,
	MCR: bigint,
	PERCENT_DIVISOR: bigint
) {
	const cappedCollPortion = (entireDebt * MCR) / price;
	const collGasCompensation = cappedCollPortion / PERCENT_DIVISOR;

	const debtToOffset = entireDebt;
	const collToSendToSP = cappedCollPortion - collGasCompensation;
	const debtToRedistribute = 0n;
	const collToRedistribute = 0n;

	return {
		debtToOffset,
		collToSendToSP,
		debtToRedistribute,
		collToRedistribute
	};
}
