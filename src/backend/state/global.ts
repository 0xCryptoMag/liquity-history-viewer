import type { Address, PublicClient } from 'viem';
import type { ProtocolName } from '../protocols/protocols.js';
import type { ReplaceBrandedWordsInStringForAllProtocols } from '../protocols/rebrand.js';
import type { ExtractUnionValue } from '../utils/helpers.js';
import { replaceBrandedWordsInString } from '../protocols/rebrand.js';
import { getAbiItem } from '../protocols/modify.js';
import { protocols } from '../protocols/protocols.js';
import {
	getCachedArrayLength,
	getCachedArrayRange,
	appendCachedArray,
	setCachedState,
	getCachedState
} from './cache.js';
import { getContractEventsGenerator } from './events.js';

export type GlobalState = {
	// Constans
	DECIMAL_PRECISION: bigint;
	SCALE_FACTOR: bigint;

	// Stability Pool
	frontEnds: {
		frontEnd: Address;
		kickbackRate: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	globalP: {
		P: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	globalS: {
		S: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	globalG: {
		G: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	globalScale: {
		scale: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	globalEpoch: {
		epoch: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];

	// Trove Manager
	globalLTerms: {
		lEth: bigint;
		lLusd: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];

	// LQTY Staking
	globalFEth: {
		fEth: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
	globalFLusd: {
		fLusd: bigint;
		blockNumber: bigint;
		transactionIndex: number;
		timestamp: bigint;
	}[];
};

export async function getGlobalState(
	protocol: ProtocolName,
	client: PublicClient
): Promise<GlobalState> {
	const { deployBlock } = protocols[protocol];

	// DECIMAL_PRECISION
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

	// SCALE_FACTOR
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

	// frontEnds
	{
		const cachedFrontEndsLength = await getCachedArrayLength(protocol, [
			'global',
			'frontEnds'
		]);

		const cachedFrontEnds = await getCachedArrayRange<
			GlobalState['frontEnds'][number]
		>(protocol, ['global', 'frontEnds'], cachedFrontEndsLength - 1);

		const frontEnds = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'FrontEndRegistered',
			fromBlock:
				cachedFrontEnds.length > 0
					? cachedFrontEnds[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of frontEnds) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					frontEnd: i.args._frontEnd!,
					kickbackRate: i.args._kickbackRate!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, ['global', 'frontEnds'], arr);
		}
	}

	// globalP
	{
		const cachedGlobalPLength = await getCachedArrayLength(protocol, [
			'global',
			'globalP'
		]);

		const cachedGlobalP = await getCachedArrayRange<
			GlobalState['globalP'][number]
		>(protocol, ['global', 'globalP'], cachedGlobalPLength - 1);

		const globalP = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'P_Updated',
			fromBlock:
				cachedGlobalP.length > 0
					? cachedGlobalP[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of globalP) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					P: i.args._P!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, ['global', 'globalP'], arr);
		}
	}

	// globalS
	{
		const cachedGlobalSLength = await getCachedArrayLength(protocol, [
			'global',
			'globalS'
		]);

		const cachedGlobalS = await getCachedArrayRange<
			GlobalState['globalS'][number]
		>(protocol, ['global', 'globalS'], cachedGlobalSLength - 1);

		const globalS = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'S_Updated',
			fromBlock:
				cachedGlobalS.length > 0
					? cachedGlobalS[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of globalS) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					S: i.args._S!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, ['global', 'globalS'], arr);
		}
	}

	// globalG
	{
		const cachedGlobalGLength = await getCachedArrayLength(protocol, [
			'global',
			'globalG'
		]);

		const cachedGlobalG = await getCachedArrayRange<
			GlobalState['globalG'][number]
		>(protocol, ['global', 'globalG'], cachedGlobalGLength - 1);

		const globalG = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'G_Updated',
			fromBlock:
				cachedGlobalG.length > 0
					? cachedGlobalG[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest',
			blockChunkSize: 10_000n
		});

		for await (const e of globalG) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					G: i.args._G!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, ['global', 'globalG'], arr);
		}
	}

	// globalScale
	{
		const cachedGlobalScaleLength = await getCachedArrayLength(protocol, [
			'global',
			'globalScale'
		]);

		const cachedGlobalScale = await getCachedArrayRange<
			GlobalState['globalScale'][number]
		>(protocol, ['global', 'globalScale'], cachedGlobalScaleLength - 1);

		const globalScale = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'ScaleUpdated',
			fromBlock:
				cachedGlobalScale.length > 0
					? cachedGlobalScale[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of globalScale) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					scale: i.args._currentScale!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, ['global', 'globalScale'], arr);
		}
	}

	// globalEpoch
	{
		const cachedGlobalEpochLength = await getCachedArrayLength(protocol, [
			'global',
			'globalEpoch'
		]);

		const cachedGlobalEpoch = await getCachedArrayRange<
			GlobalState['globalEpoch'][number]
		>(protocol, ['global', 'globalEpoch'], cachedGlobalEpochLength - 1);

		const globalEpoch = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'EpochUpdated',
			fromBlock:
				cachedGlobalEpoch.length > 0
					? cachedGlobalEpoch[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of globalEpoch) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				return {
					epoch: i.args._currentEpoch!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, ['global', 'globalEpoch'], arr);
		}
	}

	// globalLTerms
	{
		const cachedGlobalLTermsLength = await getCachedArrayLength(protocol, [
			'global',
			'globalLTerms'
		]);

		const cachedGlobalLTerms = await getCachedArrayRange<
			GlobalState['globalLTerms'][number]
		>(protocol, ['global', 'globalLTerms'], cachedGlobalLTermsLength - 1);

		const globalLTerms = getContractEventsGenerator({
			client,
			protocol,
			contract: 'troveManager',
			normalItemName: 'LTermsUpdated',
			fromBlock:
				cachedGlobalLTerms.length > 0
					? cachedGlobalLTerms[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of globalLTerms) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				const _L_ETH = replaceBrandedWordsInString(
					'_L_ETH',
					protocols[protocol].modifiers
				) as ReplaceBrandedWordsInStringForAllProtocols<'_L_ETH'>;

				const lEth = i.args[
					_L_ETH as keyof typeof i.args
				] as ExtractUnionValue<
					typeof i.args,
					ReplaceBrandedWordsInStringForAllProtocols<'_L_ETH'>
				>;

				const _L_LUSDDebt = replaceBrandedWordsInString(
					'_L_LUSDDebt',
					protocols[protocol].modifiers
				) as ReplaceBrandedWordsInStringForAllProtocols<'_L_LUSDDebt'>;
				const lLusd = i.args[
					_L_LUSDDebt as keyof typeof i.args
				] as ExtractUnionValue<
					typeof i.args,
					ReplaceBrandedWordsInStringForAllProtocols<'_L_LUSDDebt'>
				>;

				return {
					lEth: lEth!,
					lLusd: lLusd!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, ['global', 'globalLTerms'], arr);
		}
	}

	// globalFEth
	{
		const globalFEthLength = await getCachedArrayLength(protocol, [
			'global',
			'globalFEth'
		]);

		const cachedGlobalFEth = await getCachedArrayRange<
			GlobalState['globalFEth'][number]
		>(protocol, ['global', 'globalFEth'], globalFEthLength);

		const globalFEth = getContractEventsGenerator({
			client,
			protocol,
			contract: 'lqtyStaking',
			normalItemName: 'F_ETHUpdated',
			fromBlock:
				cachedGlobalFEth.length > 0
					? cachedGlobalFEth[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of globalFEth) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				const _fEth = replaceBrandedWordsInString(
					'_F_ETH',
					protocols[protocol].modifiers
				) as ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>;
				const fEth = i.args[
					_fEth as keyof typeof i.args
				] as ExtractUnionValue<
					typeof i.args,
					ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>
				>;

				return {
					fEth: fEth!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, ['global', 'globalFEth'], arr);
		}
	}

	// globalFLusd
	{
		const cachedGlobalFLusdLength = await getCachedArrayLength(protocol, [
			'global',
			'globalFLusd'
		]);

		const cachedGlobalFLusd = await getCachedArrayRange<
			GlobalState['globalFLusd'][number]
		>(protocol, ['global', 'globalFLusd'], cachedGlobalFLusdLength - 1);

		const globalFLusd = getContractEventsGenerator({
			client,
			protocol,
			contract: 'lqtyStaking',
			normalItemName: 'F_LUSDUpdated',
			fromBlock:
				cachedGlobalFLusd.length > 0
					? cachedGlobalFLusd[0]!.blockNumber + 1n
					: deployBlock,
			toBlock: 'latest'
		});

		for await (const e of globalFLusd) {
			if (e === null) break;
			if (e instanceof Error) throw e;

			const arr = e.map((i) => {
				const _fLusd = replaceBrandedWordsInString(
					'_F_LUSD',
					protocols[protocol].modifiers
				) as ReplaceBrandedWordsInStringForAllProtocols<'_F_LUSD'>;
				const balance = i.args[
					_fLusd as keyof typeof i.args
				] as ExtractUnionValue<
					typeof i.args,
					ReplaceBrandedWordsInStringForAllProtocols<'_F_LUSD'>
				>;

				return {
					fLusd: balance!,
					blockNumber: i.blockNumber,
					transactionIndex: i.transactionIndex,
					timestamp: i.blockTimestamp!
				};
			});

			await appendCachedArray(protocol, ['global', 'globalFLusd'], arr);
		}
	}

	return {
		DECIMAL_PRECISION,
		SCALE_FACTOR,
		frontEnds: (await getCachedState<GlobalState['frontEnds']>(protocol, [
			'global',
			'frontEnds'
		]))!,
		globalP: (await getCachedState<GlobalState['globalP']>(protocol, [
			'global',
			'globalP'
		]))!,
		globalS: (await getCachedState<GlobalState['globalS']>(protocol, [
			'global',
			'globalS'
		]))!,
		globalG: (await getCachedState<GlobalState['globalG']>(protocol, [
			'global',
			'globalG'
		]))!,
		globalScale: (await getCachedState<GlobalState['globalScale']>(
			protocol,
			['global', 'globalScale']
		))!,
		globalEpoch: (await getCachedState<GlobalState['globalEpoch']>(
			protocol,
			['global', 'globalEpoch']
		))!,
		globalLTerms: (await getCachedState<GlobalState['globalLTerms']>(
			protocol,
			['global', 'globalLTerms']
		))!,
		globalFEth: (await getCachedState<GlobalState['globalFEth']>(protocol, [
			'global',
			'globalFEth'
		]))!,
		globalFLusd: (await getCachedState<GlobalState['globalFLusd']>(
			protocol,
			['global', 'globalFLusd']
		))!
	};
}
