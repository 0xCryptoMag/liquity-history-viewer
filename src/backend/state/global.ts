import type { Address, PublicClient } from 'viem';
import type { ProtocolName } from '../protocols/protocols.js';
import type { ReplaceBrandedWordsInStringForAllProtocols } from '../protocols/rebrand.js';
import type { ExtractUnionValue } from '../utils/helpers.js';
import { replaceBrandedWordsInString } from '../protocols/rebrand.js';
import { getAbiItem } from '../protocols/modify.js';
import { protocols } from '../protocols/protocols.js';
import {
	appendCachedArray,
	setCachedState,
	readCachedArray,
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

	const latestBlock = await client.getBlockNumber();

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
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			'global',
			'frontEnds',
			'lastFetchedBlock'
		]);

		const frontEnds = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'FrontEndRegistered',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n,
			keyPath: ['global', 'frontEnds']
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
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			'global',
			'globalP',
			'lastFetchedBlock'
		]);

		const globalP = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'P_Updated',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n,
			keyPath: ['global', 'globalP']
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
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			'global',
			'globalS',
			'lastFetchedBlock'
		]);

		const globalS = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'S_Updated',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n,
			keyPath: ['global', 'globalS']
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
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			'global',
			'globalG',
			'lastFetchedBlock'
		]);

		const globalG = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'G_Updated',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n,
			keyPath: ['global', 'globalG']
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
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			'global',
			'globalScale',
			'lastFetchedBlock'
		]);

		const globalScale = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'ScaleUpdated',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n,
			keyPath: ['global', 'globalScale']
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
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			'global',
			'globalEpoch',
			'lastFetchedBlock'
		]);

		const globalEpoch = getContractEventsGenerator({
			client,
			protocol,
			contract: 'stabilityPool',
			normalItemName: 'EpochUpdated',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n,
			keyPath: ['global', 'globalEpoch']
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
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			'global',
			'globalLTerms',
			'lastFetchedBlock'
		]);

		const globalLTerms = getContractEventsGenerator({
			client,
			protocol,
			contract: 'troveManager',
			normalItemName: 'LTermsUpdated',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n,
			keyPath: ['global', 'globalLTerms']
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
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			'global',
			'globalFEth',
			'lastFetchedBlock'
		]);

		const globalFEth = getContractEventsGenerator({
			client,
			protocol,
			contract: 'lqtyStaking',
			normalItemName: 'F_ETHUpdated',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n,
			keyPath: ['global', 'globalFEth']
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
		const cachedLastFetchedBlock = await getCachedState<bigint>(protocol, [
			'global',
			'globalFLusd',
			'lastFetchedBlock'
		]);

		const globalFLusd = getContractEventsGenerator({
			client,
			protocol,
			contract: 'lqtyStaking',
			normalItemName: 'F_LUSDUpdated',
			fromBlock:
				cachedLastFetchedBlock === null
					? deployBlock
					: cachedLastFetchedBlock + 1n,
			toBlock: latestBlock,
			blockChunkSize: 75_000n,
			keyPath: ['global', 'globalFLusd']
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

	const frontEnds = await readCachedArray<GlobalState['frontEnds'][number]>(
		protocol,
		['global', 'frontEnds']
	);
	const globalP = await readCachedArray<GlobalState['globalP'][number]>(
		protocol,
		['global', 'globalP']
	);
	const globalS = await readCachedArray<GlobalState['globalS'][number]>(
		protocol,
		['global', 'globalS']
	);
	const globalG = await readCachedArray<GlobalState['globalG'][number]>(
		protocol,
		['global', 'globalG']
	);
	const globalScale = await readCachedArray<
		GlobalState['globalScale'][number]
	>(protocol, ['global', 'globalScale']);
	const globalEpoch = await readCachedArray<
		GlobalState['globalEpoch'][number]
	>(protocol, ['global', 'globalEpoch']);
	const globalLTerms = await readCachedArray<
		GlobalState['globalLTerms'][number]
	>(protocol, ['global', 'globalLTerms']);
	const globalFEth = await readCachedArray<GlobalState['globalFEth'][number]>(
		protocol,
		['global', 'globalFEth']
	);
	const globalFLusd = await readCachedArray<
		GlobalState['globalFLusd'][number]
	>(protocol, ['global', 'globalFLusd']);

	return {
		DECIMAL_PRECISION,
		SCALE_FACTOR,
		frontEnds,
		globalP,
		globalS,
		globalG,
		globalScale,
		globalEpoch,
		globalLTerms,
		globalFEth,
		globalFLusd
	};
}
