import type { Address, PublicClient } from 'viem';
import type { ProtocolName } from '../protocols/protocols';
import type { ReplaceBrandedWordsInStringForAllProtocols } from '../protocols/rebrand';
import type { ExtractUnionValue } from '../utils/helpers';
import { troveManagerOperationEnum } from '../protocols/enums';
import { replaceBrandedWordsInString } from '../protocols/rebrand';
import { getAbiItem } from '../protocols/modify';
import { protocols } from '../protocols/protocols';
import { getCachedState, setCachedState, updateCachedState } from './cache';

type DerivedFrom = 'event' | 'liquidation' | 'redemption';

export type GlobalState = {
	LUSD_GAS_COMPENSATION: bigint;
	PERCENT_DIVISOR: bigint;
	_100pct: bigint;
	MCR: bigint;
	CCR: bigint;

	totalColl: {
		balance: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number; // 0 indexed
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	totalDebt: {
		balance: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	totalStakes: {
		amount: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	totalStakedLQTY: {
		balance: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	totalDepositedLUSD: {
		balance: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	liquidations: {
		borrower: Address;
		coll: bigint;
		debt: bigint;
		operation: (typeof troveManagerOperationEnum)[1 | 2];
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	// Used only for tracking fees, redemptions on user tracked by TroveUpdated
	redemptions: {
		attemptedLUSDAmount: bigint;
		actualLUSDAmount: bigint;
		ETHSent: bigint;
		ETHFee: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	LUSDBorrowingFeePaid: {
		LUSDFee: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
	prices: {
		price: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		nthEventInTxn: number;
		timestamp: bigint;
		derivedFrom: DerivedFrom;
	}[];
};

export async function getGlobalState(
	protocol: ProtocolName,
	client: PublicClient
): Promise<GlobalState> {
	const cachedState = (await getCachedState<
		Omit<
			GlobalState,
			| 'LUSD_GAS_COMPENSATION'
			| 'PERCENT_DIVISOR'
			| '_100pct'
			| 'MCR'
			| 'CCR'
		>
	>(protocol, 'globalState')) ?? {
		totalColl: [],
		totalDebt: [],
		totalStakes: [],
		totalStakedLQTY: [],
		totalDepositedLUSD: [],
		liquidations: [],
		redemptions: [],
		LUSDBorrowingFeePaid: [],
		prices: []
	};

	// LUSD Gas Compensation
	const LUSD_GAS_COMPENSATIONAbi = getAbiItem(
		protocol,
		'troveManager',
		'LUSD_GAS_COMPENSATION'
	);
	// prettier-ignore
	const LUSD_GAS_COMPENSATION = await client.readContract({
		address: protocols[protocol].troveManager,
		abi: [LUSD_GAS_COMPENSATIONAbi],
		functionName: 'LUSD_GAS_COMPENSATION'
	});

	// PERCENT_DIVISOR
	const PERCENT_DIVISORAbi = getAbiItem(
		protocol,
		'troveManager',
		'PERCENT_DIVISOR'
	);
	const PERCENT_DIVISOR = await client.readContract({
		address: protocols[protocol].troveManager,
		abi: [PERCENT_DIVISORAbi],
		functionName: 'PERCENT_DIVISOR'
	});

	// _100pct
	const _100pctAbi = getAbiItem(protocol, 'troveManager', '_100pct');
	const _100pct = await client.readContract({
		address: protocols[protocol].troveManager,
		abi: [_100pctAbi],
		functionName: '_100pct'
	});

	// MCR
	const MCRAbi = getAbiItem(protocol, 'troveManager', 'MCR');
	const MCR = await client.readContract({
		address: protocols[protocol].troveManager,
		abi: [MCRAbi],
		functionName: 'MCR'
	});

	// CCR
	const CCRAbi = getAbiItem(protocol, 'troveManager', 'CCR');
	const CCR = await client.readContract({
		address: protocols[protocol].troveManager,
		abi: [CCRAbi],
		functionName: 'CCR'
	});

	// ETH Coll
	const activePoolETHBalanceUpdatedAbi = getAbiItem(
		protocol,
		'activePool',
		'ActivePoolETHBalanceUpdated'
	);
	// prettier-ignore
	const activePoolETHBalanceUpdated = await client.getContractEvents({
		address: protocols[protocol].activePool,
		abi: [activePoolETHBalanceUpdatedAbi],
		eventName: activePoolETHBalanceUpdatedAbi.name,
		fromBlock:
			cachedState.totalColl.length > 0
				? cachedState.totalColl[cachedState.totalColl.length - 1]!
			.blockNumber + 1n
		: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.totalColl.push(
		...activePoolETHBalanceUpdated.reduce<
			{
				balance: bigint;
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

			const balance = e.args[
				_ETH as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_ETH'>
			>;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				balance: balance!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// LUSD Debt
	const activePoolLUSDDebtUpdatedAbi = getAbiItem(
		protocol,
		'activePool',
		'ActivePoolLUSDDebtUpdated'
	);
	// prettier-ignore
	const activePoolLUSDDebtUpdated = await client.getContractEvents({
		address: protocols[protocol].activePool,
		abi: [activePoolLUSDDebtUpdatedAbi],
		eventName: activePoolLUSDDebtUpdatedAbi.name,
		fromBlock:
			cachedState.totalDebt.length > 0
				? cachedState.totalDebt[cachedState.totalDebt.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.totalDebt.push(
		...activePoolLUSDDebtUpdated.reduce<
			{
				balance: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _LUSDDebt = replaceBrandedWordsInString(
				'_LUSDDebt',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_LUSDDebt'>;

			const balance = e.args[
				_LUSDDebt as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_LUSDDebt'>
			>;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				balance: balance!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// Total Stakes
	const totalStakesUpdatedAbi = getAbiItem(
		protocol,
		'troveManager',
		'TotalStakesUpdated'
	);
	// prettier-ignore
	const totalStakesUpdated = await client.getContractEvents({
		address: protocols[protocol].troveManager,
		abi: [totalStakesUpdatedAbi],
		eventName: totalStakesUpdatedAbi.name,
		fromBlock:
			cachedState.totalStakes.length > 0
				? cachedState.totalStakes[cachedState.totalStakes.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.totalStakes.push(
		...totalStakesUpdated.reduce<
			{
				amount: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _totalStakes = e.args._newTotalStakes;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				amount: _totalStakes!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// LQTY Staked
	const totalLQTYStakedUpdatedAbi = getAbiItem(
		protocol,
		'lqtyStaking',
		'TotalLQTYStakedUpdated'
	);
	// prettier-ignore
	const totalLQTYStakedUpdated = await client.getContractEvents({
		address: protocols[protocol].lqtyStaking,
		abi: [totalLQTYStakedUpdatedAbi],
		eventName: totalLQTYStakedUpdatedAbi.name,
		fromBlock:
			cachedState.totalStakedLQTY.length > 0
				? cachedState.totalStakedLQTY[
					cachedState.totalStakedLQTY.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.totalStakedLQTY.push(
		...totalLQTYStakedUpdated.reduce<
			{
				balance: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _totalLQTYStaked = replaceBrandedWordsInString(
				'_totalLQTYStaked',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_totalLQTYStaked'>;

			const balance = e.args[
				_totalLQTYStaked as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_totalLQTYStaked'>
			>;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				balance: balance!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// LUSD Deposited
	const stabilityPoolLUSDBalanceUpdatedAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'StabilityPoolLUSDBalanceUpdated'
	);
	// prettier-ignore
	const stabilityPoolLUSDBalanceUpdated = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [stabilityPoolLUSDBalanceUpdatedAbi],
		eventName: stabilityPoolLUSDBalanceUpdatedAbi.name,
		fromBlock:
			cachedState.totalDepositedLUSD.length > 0
				? cachedState.totalDepositedLUSD[
					cachedState.totalDepositedLUSD.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.totalDepositedLUSD.push(
		...stabilityPoolLUSDBalanceUpdated.reduce<
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

	// Liquidations
	const liquidationsAbi = getAbiItem(
		protocol,
		'troveManager',
		'TroveLiquidated'
	);
	// prettier-ignore
	const liquidations = await client.getContractEvents({
		address: protocols[protocol].troveManager,
		abi: [liquidationsAbi],
		eventName: liquidationsAbi.name,
		fromBlock:
			cachedState.liquidations.length > 0
				? cachedState.liquidations[cachedState.liquidations.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.liquidations.push(
		...liquidations.reduce<
			{
				borrower: Address;
				coll: bigint;
				debt: bigint;
				operation: (typeof troveManagerOperationEnum)[1 | 2];
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const borrower = e.args._borrower;
			const coll = e.args._coll;
			const debt = e.args._debt;
			const operation =
				troveManagerOperationEnum[e.args._operation! as 1 | 2];

			const prevLiquidation = acc[acc.length - 1];
			const nthEventInTxn =
				prevLiquidation?.transactionIndex === e.transactionIndex &&
				prevLiquidation?.blockNumber === e.blockNumber
					? prevLiquidation.nthEventInTxn + 1
					: 0;

			acc.push({
				borrower: borrower!,
				coll: coll!,
				debt: debt!,
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

	// Redemptions
	const redemptionsAbi = getAbiItem(protocol, 'troveManager', 'Redemption');
	// prettier-ignore
	const redemptions = await client.getContractEvents({
		address: protocols[protocol].troveManager,
		abi: [redemptionsAbi],
		eventName: redemptionsAbi.name,
		fromBlock:
			cachedState.redemptions.length > 0
				? cachedState.redemptions[cachedState.redemptions.length - 1]!
				.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.redemptions.push(
		...redemptions.reduce<
			{
				attemptedLUSDAmount: bigint;
				actualLUSDAmount: bigint;
				ETHSent: bigint;
				ETHFee: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _attemptedLUSDAmount = replaceBrandedWordsInString(
				'_attemptedLUSDAmount',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_attemptedLUSDAmount'>;

			const attemptedLUSD = e.args[
				_attemptedLUSDAmount as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_attemptedLUSDAmount'>
			>;

			const _actualLUSDAmount = replaceBrandedWordsInString(
				'_actualLUSDAmount',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_actualLUSDAmount'>;

			const actualLUSD = e.args[
				_actualLUSDAmount as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_actualLUSDAmount'>
			>;

			const _ETHSent = replaceBrandedWordsInString(
				'_ETHSent',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_ETHSent'>;

			const ethSent = e.args[
				_ETHSent as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_ETHSent'>
			>;

			const _ETHFee = replaceBrandedWordsInString(
				'_ETHFee',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_ETHFee'>;

			const ethFee = e.args[
				_ETHFee as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_ETHFee'>
			>;

			const prevRedemption = acc[acc.length - 1];
			const nthEventInTxn =
				prevRedemption?.transactionIndex === e.transactionIndex &&
				prevRedemption?.blockNumber === e.blockNumber
					? prevRedemption.nthEventInTxn + 1
					: 0;

			acc.push({
				attemptedLUSDAmount: attemptedLUSD!,
				actualLUSDAmount: actualLUSD!,
				ETHSent: ethSent!,
				ETHFee: ethFee!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// LUSD Borrowing fee paid
	const LUSDBorrowingFeePaidAbi = getAbiItem(
		protocol,
		'borrowerOperations',
		'LUSDBorrowingFeePaid'
	);
	// prettier-ignore
	const LUSDBorrowingFeePaid = await client.getContractEvents({
		address: protocols[protocol].borrowerOperations,
		abi: [LUSDBorrowingFeePaidAbi],
		eventName: LUSDBorrowingFeePaidAbi.name,
		fromBlock:
			cachedState.LUSDBorrowingFeePaid.length > 0
				? cachedState.LUSDBorrowingFeePaid[
					cachedState.LUSDBorrowingFeePaid.length - 1
				]!.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.LUSDBorrowingFeePaid.push(
		...LUSDBorrowingFeePaid.reduce<
			{
				LUSDFee: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const _LUSDFee = replaceBrandedWordsInString(
				'_LUSDFee',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_LUSDFee'>;

			const fee = e.args[
				_LUSDFee as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_LUSDFee'>
			>;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				LUSDFee: fee!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	// Last Good Price
	const lastGoodPriceUpdatedAbi = getAbiItem(
		protocol,
		'priceFeed',
		'LastGoodPriceUpdated'
	);
	// prettier-ignore
	const lastGoodPriceUpdated = await client.getContractEvents({
		address: protocols[protocol].priceFeed,
		abi: [lastGoodPriceUpdatedAbi],
		eventName: lastGoodPriceUpdatedAbi.name,
		fromBlock:
			cachedState.prices.length > 0
				? cachedState.prices[cachedState.prices.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.prices.push(
		...lastGoodPriceUpdated.reduce<
			{
				price: bigint;
				blockNumber: bigint;
				transactionIndex: number;
				nthEventInTxn: number;
				timestamp: bigint;
				derivedFrom: DerivedFrom;
			}[]
		>((acc, e) => {
			const price = e.args._lastGoodPrice;

			const prevEvent = acc[acc.length - 1];
			const nthEventInTxn =
				prevEvent?.transactionIndex === e.transactionIndex &&
				prevEvent?.blockNumber === e.blockNumber
					? prevEvent.nthEventInTxn + 1
					: 0;

			acc.push({
				price: price!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				nthEventInTxn,
				timestamp: e.blockTimestamp!,
				derivedFrom: 'event'
			});

			return acc;
		}, [])
	);

	await setCachedState(protocol, 'globalState', cachedState);

	return {
		LUSD_GAS_COMPENSATION,
		PERCENT_DIVISOR,
		_100pct,
		MCR,
		CCR,
		...cachedState
	};
}
