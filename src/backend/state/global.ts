import type { Address, Hash, PublicClient } from 'viem';
import type { ProtocolName } from '../protocols/protocols.js';
import type { ReplaceBrandedWordsInStringForAllProtocols } from '../protocols/rebrand.js';
import type { ExtractUnionValue } from '../utils/helpers.js';
import { replaceBrandedWordsInString } from '../protocols/rebrand.js';
import { getAbiItem } from '../protocols/modify.js';
import { protocols } from '../protocols/protocols.js';
import { setCachedState } from './cache.js';
import { getCacheAndTransformEvents } from './events.js';

export type GlobalState = {
	// Constants
	DECIMAL_PRECISION: bigint;
	SCALE_FACTOR: bigint;
	LUSD_GAS_COMPENSATION: bigint;

	// Stability Pool
	frontEndsRegistered: {
		frontEnd: Address;
		kickbackRate: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	P: {
		P: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	S: {
		S: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	G: {
		G: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	scale: {
		scale: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	epoch: {
		epoch: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];

	// Trove Manager
	LTerms: {
		lEth: bigint;
		lLusd: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];

	// LQTY Staking
	FEth: {
		fEth: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
	FLusd: {
		fLusd: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
		transactionHash: Hash;
	}[];
};

export async function getGlobalState(
	protocol: ProtocolName,
	client: PublicClient,
	blockNumberToTimestampMap: Map<bigint, bigint>,
	progress?: (key: string) => void
): Promise<GlobalState> {
	const latestBlock = await client.getBlockNumber();

	const commonArgs = {
		client,
		protocol,
		latestBlock,
		blockNumberToTimestampMap
	} as const;

	progress?.('Retrieving protocol constants');
	/** ------------------------------------------------------------------------
	 * DECIMAL_PRECISION
	 ------------------------------------------------------------------------ */
	const DECIMAL_PRECISIONAbi = getAbiItem(
		protocol,
		'troveManager',
		'DECIMAL_PRECISION'
	);
	const DECIMAL_PRECISION = await client.readContract({
		address: protocols[protocol].troveManager,
		abi: [DECIMAL_PRECISIONAbi],
		functionName: 'DECIMAL_PRECISION'
	});
	await setCachedState(
		protocol,
		['global', 'DECIMAL_PRECISION'],
		DECIMAL_PRECISION
	);

	/** ------------------------------------------------------------------------
	 * SCALE_FACTOR
	 ------------------------------------------------------------------------ */
	const SCALE_FACTORAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'SCALE_FACTOR'
	);
	const SCALE_FACTOR = await client.readContract({
		address: protocols[protocol].stabilityPool,
		abi: [SCALE_FACTORAbi],
		functionName: 'SCALE_FACTOR'
	});
	await setCachedState(protocol, ['global', 'SCALE_FACTOR'], SCALE_FACTOR);

	/** ------------------------------------------------------------------------
	 * LUSD_GAS_COMPENSATION
	 ------------------------------------------------------------------------ */
	const LUSD_GAS_COMPENSATIONAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'LUSD_GAS_COMPENSATION'
	);
	const LUSD_GAS_COMPENSATION = await client.readContract({
		address: protocols[protocol].stabilityPool,
		abi: [LUSD_GAS_COMPENSATIONAbi],
		functionName: 'LUSD_GAS_COMPENSATION'
	});
	await setCachedState(
		protocol,
		['global', 'LUSD_GAS_COMPENSATION'],
		LUSD_GAS_COMPENSATION
	);

	/** ------------------------------------------------------------------------
	 * frontEndsRegistered
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving registered front ends and kickback rates');
	const frontEndsRegistered = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'stabilityPool',
		normalItemName: 'FrontEndRegistered',
		keyPath: ['global', 'frontEndsRegistered'],
		transform: (e) => {
			return {
				frontEnd: e.args._frontEnd!,
				kickbackRate: e.args._kickbackRate!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * P
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving stability pool P (Product) accumulator changes');
	const P = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'stabilityPool',
		normalItemName: 'P_Updated',
		keyPath: ['global', 'P'],
		transform: (e) => {
			return {
				P: e.args._P!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * S
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving stability pool S (Sum) accumulator changes');
	const S = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'stabilityPool',
		normalItemName: 'S_Updated',
		keyPath: ['global', 'S'],
		transform: (e) => {
			return {
				S: e.args._S!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * G
	 ------------------------------------------------------------------------ */
	progress?.(
		'Retrieving stability pool G (Sum of LQTY gain) accumulator changes'
	);
	const G = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'stabilityPool',
		normalItemName: 'G_Updated',
		keyPath: ['global', 'G'],
		transform: (e) => {
			return {
				G: e.args._G!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * scale
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving stability pool scale changes');
	const scale = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'stabilityPool',
		normalItemName: 'ScaleUpdated',
		keyPath: ['global', 'scale'],
		transform: (e) => {
			return {
				scale: e.args._currentScale!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * epoch
	 ------------------------------------------------------------------------ */
	progress?.('Retrieving stability pool epoch changes');
	const epoch = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'stabilityPool',
		normalItemName: 'EpochUpdated',
		keyPath: ['global', 'epoch'],
		transform: (e) => {
			return {
				epoch: e.args._currentEpoch!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * LTerms
	 ------------------------------------------------------------------------ */
	progress?.(
		'Retrieving trove manager L_ETH and L_LUSDDebt (coefficient Sums) accumulator changes'
	);
	const LTerms = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'troveManager',
		normalItemName: 'LTermsUpdated',
		keyPath: ['global', 'LTerms'],
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
	 * FEth
	 ------------------------------------------------------------------------ */
	progress?.(
		'Retrieving LQTY staking fETH (ETH fee Sum) accumulator changes'
	);
	const FEth = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'lqtyStaking',
		normalItemName: 'F_ETHUpdated',
		keyPath: ['global', 'FEth'],
		transform: (e) => {
			const _fEth = replaceBrandedWordsInString(
				'_F_ETH',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>;
			const fEth = e.args[
				_fEth as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>
			>;

			return {
				fEth: fEth!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	/** ------------------------------------------------------------------------
	 * FLusd
	 ------------------------------------------------------------------------ */
	progress?.(
		'Retrieving LQTY staking fLUSD (LUSD fee Sum) accumulator changes'
	);
	const FLusd = await getCacheAndTransformEvents({
		...commonArgs,
		contract: 'lqtyStaking',
		normalItemName: 'F_LUSDUpdated',
		keyPath: ['global', 'FLusd'],
		transform: (e) => {
			const _fLusd = replaceBrandedWordsInString(
				'_F_LUSD',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_F_LUSD'>;
			const balance = e.args[
				_fLusd as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_F_LUSD'>
			>;

			return {
				fLusd: balance!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!,
				transactionHash: e.transactionHash
			};
		}
	});

	return {
		DECIMAL_PRECISION,
		SCALE_FACTOR,
		LUSD_GAS_COMPENSATION,
		frontEndsRegistered,
		P,
		S,
		G,
		scale,
		epoch,
		LTerms,
		FEth,
		FLusd
	};
}
