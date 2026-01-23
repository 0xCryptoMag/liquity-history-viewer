import type { Address, PublicClient } from 'viem';
import type { ProtocolName } from '../protocols/protocols';
import type { ReplaceBrandedWordsInStringForAllProtocols } from '../protocols/rebrand';
import type { ExtractUnionValue } from '../utils/helpers';
import { troveManagerOperationEnum } from '../protocols/enums';
import { replaceBrandedWordsInString } from '../protocols/rebrand';
import { getAbiItem } from '../protocols/modify';
import { protocols } from '../protocols/protocols';
import { getCachedState, setCachedState, updateCachedState } from './cache';

export type GlobalState = {
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
	const cachedState = (await getCachedState<
		Omit<GlobalState, 'DECIMAL_PRECISION' | 'SCALE_FACTOR'>
	>(protocol, 'globalState')) ?? {
		frontEnds: [],
		globalP: [],
		globalS: [],
		globalG: [],
		globalScale: [],
		globalEpoch: [],
		globalLTerms: [],
		globalFEth: [],
		globalFLusd: []
	};

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

	// frontEnds
	const frontEndRegisteredAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'FrontEndRegistered'
	);
	const frontEndRegistered = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [frontEndRegisteredAbi],
		eventName: frontEndRegisteredAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.frontEnds.length > 0
				? cachedState.frontEnds[cachedState.frontEnds.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.frontEnds.push(
		...frontEndRegistered.map((e) => {
			return {
				frontEnd: e.args._frontEnd!,
				kickbackRate: e.args._kickbackRate!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// globalP
	const pUpdatedAbi = getAbiItem(protocol, 'stabilityPool', 'P_Updated');
	const pUpdated = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [pUpdatedAbi],
		eventName: pUpdatedAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.globalP.length > 0
				? cachedState.globalP[cachedState.globalP.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.globalP.push(
		...pUpdated.map((e) => {
			return {
				P: e.args._P!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// globalS
	const sUpdatedAbi = getAbiItem(protocol, 'stabilityPool', 'S_Updated');
	const sUpdated = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [sUpdatedAbi],
		eventName: sUpdatedAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.globalS.length > 0
				? cachedState.globalS[cachedState.globalS.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.globalS.push(
		...sUpdated.map((e) => {
			return {
				S: e.args._S!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// globalG
	const gUpdatedAbi = getAbiItem(protocol, 'stabilityPool', 'G_Updated');
	const gUpdated = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [gUpdatedAbi],
		eventName: gUpdatedAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.globalG.length > 0
				? cachedState.globalG[cachedState.globalG.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.globalG.push(
		...gUpdated.map((e) => {
			return {
				G: e.args._G!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// globalScale
	const scaleUpdatedAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'ScaleUpdated'
	);
	const scaleUpdated = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [scaleUpdatedAbi],
		eventName: scaleUpdatedAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.globalScale.length > 0
				? cachedState.globalScale[cachedState.globalScale.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.globalScale.push(
		...scaleUpdated.map((e) => {
			return {
				scale: e.args._currentScale!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// globalEpoch
	const epochUpdatedAbi = getAbiItem(
		protocol,
		'stabilityPool',
		'EpochUpdated'
	);
	const epochUpdated = await client.getContractEvents({
		address: protocols[protocol].stabilityPool,
		abi: [epochUpdatedAbi],
		eventName: epochUpdatedAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.globalEpoch.length > 0
				? cachedState.globalEpoch[cachedState.globalEpoch.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.globalEpoch.push(
		...epochUpdated.map((e) => {
			return {
				epoch: e.args._currentEpoch!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// globalLTerms
	const lTermsUpdatedAbi = getAbiItem(
		protocol,
		'troveManager',
		'LTermsUpdated'
	);
	const lTermsUpdated = await client.getContractEvents({
		address: protocols[protocol].troveManager,
		abi: [lTermsUpdatedAbi],
		eventName: lTermsUpdatedAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.globalLTerms.length > 0
				? cachedState.globalLTerms[cachedState.globalLTerms.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.globalLTerms.push(
		...lTermsUpdated.map((e) => {
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
				timestamp: e.blockTimestamp!
			};
		})
	);

	// globalFEth
	const fEthUpdatedAbi = getAbiItem(protocol, 'lqtyStaking', 'F_ETHUpdated');
	const fEthUpdated = await client.getContractEvents({
		address: protocols[protocol].lqtyStaking,
		abi: [fEthUpdatedAbi],
		eventName: fEthUpdatedAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.globalFEth.length > 0
				? cachedState.globalFEth[cachedState.globalFEth.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.globalFEth.push(
		...fEthUpdated.map((e) => {
			const _fEth = replaceBrandedWordsInString(
				'_F_ETH',
				protocols[protocol].modifiers
			) as ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>;
			const balance = e.args[
				_fEth as keyof typeof e.args
			] as ExtractUnionValue<
				typeof e.args,
				ReplaceBrandedWordsInStringForAllProtocols<'_F_ETH'>
			>;

			return {
				fEth: balance!,
				blockNumber: e.blockNumber,
				transactionIndex: e.transactionIndex,
				timestamp: e.blockTimestamp!
			};
		})
	);

	// globalFLusd
	const fLusdUpdatedAbi = getAbiItem(
		protocol,
		'lqtyStaking',
		'F_LUSDUpdated'
	);
	const fLusdUpdated = await client.getContractEvents({
		address: protocols[protocol].lqtyStaking,
		abi: [fLusdUpdatedAbi],
		eventName: fLusdUpdatedAbi.name,
		// prettier-ignore
		fromBlock:
			cachedState.globalFLusd.length > 0
				? cachedState.globalFLusd[cachedState.globalFLusd.length - 1]!
					.blockNumber + 1n
				: protocols[protocol].deployBlock,
		toBlock: 'latest'
	});
	cachedState.globalFLusd.push(
		...fLusdUpdated.map((e) => {
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
				timestamp: e.blockTimestamp!
			};
		})
	);
	await setCachedState(protocol, 'globalState', cachedState);

	return {
		DECIMAL_PRECISION,
		SCALE_FACTOR,
		...cachedState
	};
}
