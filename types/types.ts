import { ethers } from 'ethers';
import { factories } from './contracts/index.js';
import type {
	ActivePool,
	BorrowerOperations,
	Collateral,
	CollSurplusPool,
	DefaultPool,
	LQTYStaking,
	LQTYToken,
	LUSDToken,
	PriceFeed,
	SortedTroves,
	StabilityPool,
	TroveManager
} from './contracts/index.js';
import type { Modifiers, PartialModifiers, TypedContractEvent, TypedEventLog } from './contracts/common.js';
import { TroveManager_TroveUpdatedEvent } from './contracts/TroveManager.js';
import { BorrowerOperations_TroveUpdatedEvent } from './contracts/BorrowerOperations.js';
import { CollSurplusPool_CollBalanceUpdatedEvent } from './contracts/CollSurplusPool.js';

/** A list of deployed contracts used by Liquity */
type ContractName =
	| 'TroveManager'
	| 'BorrowerOperations'
	| 'ActivePool'
	| 'DefaultPool'
	| 'StabilityPool'
	| 'CollSurplusPool'
	| 'PriceFeed'
	| 'SortedTroves'
	| 'LQTYStaking'
	| 'LUSDToken'
	| 'LQTYToken'
	| 'Collateral';

type ContractFactory = {
	[K in ContractName as `${K}__factory`]: (typeof factories)[`${K}__factory`];
}[`${ContractName}__factory`];

type ContractInstance<M extends Modifiers> = {
	TroveManager: TroveManager<M>;
	BorrowerOperations: BorrowerOperations<M>;
	ActivePool: ActivePool<M>;
	DefaultPool: DefaultPool<M>;
	StabilityPool: StabilityPool<M>;
	CollSurplusPool: CollSurplusPool<M>;
	PriceFeed: PriceFeed<M>;
	SortedTroves: SortedTroves<M>;
	LQTYStaking: LQTYStaking<M>;
	LUSDToken: LUSDToken<M>;
	LQTYToken: LQTYToken<M>;
	Collateral: Collateral;
}[ContractName];

export type ProtocolConfig = {
	TroveManager: string;
	BorrowerOperations: string;
	ActivePool: string;
	DefaultPool: string;
	StabilityPool: string;
	GasPool: string;
	CollSurplusPool: string;
	PriceFeed: string;
	SortedTroves: string;
	LQTYStaking: string;
	LUSDToken: string;
	LQTYToken: string;
	Collateral: string | '';
	deployBlock: number;
	modifiers: PartialModifiers;
}
export type ChainProtocolConfigs = {
	[protocolName: string]: ProtocolConfig;
}
export type ChainConfig = {
	weth: string;
	rpc: string;
	protocols: ChainProtocolConfigs;
}
export type Config = {
	[networkName: string]: ChainConfig;
}

/**
 * An instantiation of a Liquity fork's contracts, provider, and deployment
 * block. Instantiated by an async static factory method Protocol.create()
 */
export class Protocol<M extends Modifiers> {
	private constructor(
		public provider:
			| ethers.JsonRpcProvider
			| ethers.WebSocketProvider,
		public troveManager: TroveManager<M>,
		public borrowerOperations: BorrowerOperations<M>,
		public activePool: ActivePool<M>,
		public defaultPool: DefaultPool<M>,
		public stabilityPool: StabilityPool<M>,
		public collSurplusPool: CollSurplusPool<M>,
		public priceFeed: PriceFeed<M>,
		public sortedTroves: SortedTroves<M>,
		public lqtyStaking: LQTYStaking<M>,
		public lusdToken: LUSDToken<M>,
		public lqtyToken: LQTYToken<M>,
		public collateral: Collateral | null,
		public deployBlock: number
	) {}

	/**
	 * The factory method to instantiate a Protocol
	 */
	public static async create(
		protocolConfig: ProtocolConfig,
		rpcUrl: string
	): Promise<Protocol<Modifiers>> {
		// Create the provider
		const provider = rpcUrl.includes('wss')
			? new ethers.WebSocketProvider(rpcUrl)
			: new ethers.JsonRpcProvider(rpcUrl);

		// Create all protocol contracts
		const modifiers: Modifiers = {
			abisType: protocolConfig.modifiers.abisType || 'modified',
			eth: protocolConfig.modifiers.eth || 'eth',
			ether: protocolConfig.modifiers.ether || 'ether',
			lqty: protocolConfig.modifiers.lqty || 'lqty',
			lusd: protocolConfig.modifiers.lusd || 'lusd',
			trove: protocolConfig.modifiers.trove || 'trove'
		};

		const contracts: Record<
			ContractName,
			ContractInstance<typeof modifiers>
		> = {} as Record<
			ContractName,
			ContractInstance<typeof modifiers>
		>;

		for (const contractName in protocolConfig) {
			const nonLoopedProps = [
				'Collateral',
				'deployBlock',
				'modifiers',
				'gasPool'
			];
			if (nonLoopedProps.includes(contractName)) continue;

			const name = contractName as ContractName;
			const factoryKey = `${name}__factory` as const;
			const contractFactory = factories[factoryKey] as ContractFactory

			contracts[name] = contractFactory.connect(
				protocolConfig[name],
				modifiers,
				provider
			)
		}

		const IERC20 = protocolConfig.Collateral
			? factories.Collateral__factory.connect(
				protocolConfig.Collateral,
				modifiers,
				provider
			) as Collateral: null

		return new Protocol(
			provider,
			contracts.TroveManager as TroveManager<typeof modifiers>,
			contracts.BorrowerOperations as BorrowerOperations<typeof modifiers>,
			contracts.ActivePool as ActivePool<typeof modifiers>,
			contracts.DefaultPool as DefaultPool<typeof modifiers>,
			contracts.StabilityPool as StabilityPool<typeof modifiers>,
			contracts.CollSurplusPool as CollSurplusPool<typeof modifiers>,
			contracts.PriceFeed as PriceFeed<typeof modifiers>,
			contracts.SortedTroves as SortedTroves<typeof modifiers>,
			contracts.LQTYStaking as LQTYStaking<typeof modifiers>,
			contracts.LUSDToken as LUSDToken<typeof modifiers>,
			contracts.LQTYToken as LQTYToken<typeof modifiers>,
			IERC20,
			protocolConfig.deployBlock
		);
	}
}

export type QueryPayload<P extends Protocol<Modifiers>> = {
	troveManagerTroveUpdated: Array<TypedEventLog<TypedContractEvent<
		TroveManager_TroveUpdatedEvent.InputTuple,
		TroveManager_TroveUpdatedEvent.OutputTuple,
		TroveManager_TroveUpdatedEvent.OutputObject
	>>>;
	borrowerOperationsTroveUpdated: Array<TypedEventLog<TypedContractEvent<
		BorrowerOperations_TroveUpdatedEvent.InputTuple,
		BorrowerOperations_TroveUpdatedEvent.OutputTuple,
		BorrowerOperations_TroveUpdatedEvent.OutputObject
	>>>;
	collateralSurplusCollUpdatedBalance: Array<TypedEventLog<TypedContractEvent<
		CollSurplusPool_CollBalanceUpdatedEvent.InputTuple,
		CollSurplusPool_CollBalanceUpdatedEvent.OutputTuple,
		CollSurplusPool_CollBalanceUpdatedEvent.OutputObject
	>>>;
	combinedTroveUpdated: Array<TypedEventLog<
		TypedContractEvent<
			TroveManager_TroveUpdatedEvent.InputTuple,
			TroveManager_TroveUpdatedEvent.OutputTuple,
			TroveManager_TroveUpdatedEvent.OutputObject
		>
		| TypedContractEvent<
			BorrowerOperations_TroveUpdatedEvent.InputTuple,
			BorrowerOperations_TroveUpdatedEvent.OutputTuple,
			BorrowerOperations_TroveUpdatedEvent.OutputObject
		>
	>>;
}
