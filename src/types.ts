import { ethers } from 'ethers';
import { getContract } from './helpers.js';

/** A list of deployed contracts used by Liquity */
const contractNames = [
	'TroveManager',
	'BorrowerOperations',
	'ActivePool',
	'DefaultPool',
	'StabilityPool',
	'GasPool',
	'CollSurplusPool',
	'PriceFeed',
	'SortedTroves',
	'LQTYStaking',
	'LUSDToken',
	'LQTYToken'
] as const;
export type ContractName = (typeof contractNames)[number];
export type Address = string;

/**
 * This is meant to differentiate Liquity forks that rebranded the names of
 * variables and functions in their own codebase
 */
export type AbiType = 'normal' | 'modified';


export interface ProtocolConfig {
	TroveManager: Address;
	BorrowerOperations: Address;
	ActivePool: Address;
	DefaultPool: Address;
	StabilityPool: Address;
	GasPool: Address;
	CollSurplusPool: Address;
	PriceFeed: Address;
	SortedTroves: Address;
	LQTYStaking: Address;
	LUSDToken: Address;
	LQTYToken: Address;
	Collateral: Address | '';
	deployBlock: number;
	abisType: AbiType;
	modifiers?: Modifiers;
}
export interface ProtocolConfigs {
	[protocolName: string]: ProtocolConfig;
}
export interface ChainConfig {
	weth: Address;
	rpc: string;
	protocols: ProtocolConfigs;
}
export interface Config {
	[networkName: string]: ChainConfig;
}

/**
 * An instantiation of a Liquity fork's contracts, provider, and deployment
 * block. Instantiated by an async static factory method Protocol.create()
 */
export class Protocol {
	private constructor(
		public provider:
			| ethers.JsonRpcProvider
			| ethers.WebSocketProvider,
		public troveManager: ethers.Contract,
		public borrowerOperations: ethers.Contract,
		public activePool: ethers.Contract,
		public defaultPool: ethers.Contract,
		public stabilityPool: ethers.Contract,
		public gasPool: ethers.Contract,
		public collSurplusPool: ethers.Contract,
		public priceFeed: ethers.Contract,
		public sortedTroves: ethers.Contract,
		public lqtyStaking: ethers.Contract,
		public lusdToken: ethers.Contract,
		public lqtyToken: ethers.Contract,
		public collateral: ethers.Contract | null,
		public deployBlock: number
	) {}

	/**
	 * The factory method to instantiate a Protocol
	 */
	public static async create(
		protocolConfig: ProtocolConfig,
		rpcUrl: string
	): Promise<Protocol> {
		// Create the provider
		const provider = rpcUrl.includes('wss')
			? new ethers.WebSocketProvider(rpcUrl)
			: new ethers.JsonRpcProvider(rpcUrl);

		// Create all protocol contracts
		const contracts: Record<ContractName[number], ethers.Contract> = {};

		for (const name of contractNames) {
			contracts[name] = await getContract(
				name,
				protocolConfig[name],
				protocolConfig.abisType,
				provider
			);
		}

		// Create collateral contract if it exists
		const erc20Abi = (
			await import(
				'@openzeppelin/contracts/build/contracts/IERC20.json',
				{ with: { type: 'json' } }
			)
		).default.abi;

		const collateral = protocolConfig.Collateral
			? new ethers.Contract(protocolConfig.Collateral, erc20Abi, provider)
			: null;

		return new Protocol(
			provider,
			contracts.TroveManager,
			contracts.BorrowerOperations,
			contracts.ActivePool,
			contracts.DefaultPool,
			contracts.StabilityPool,
			contracts.GasPool,
			contracts.CollSurplusPool,
			contracts.PriceFeed,
			contracts.SortedTroves,
			contracts.LQTYStaking,
			contracts.LUSDToken,
			contracts.LQTYToken,
			collateral,
			protocolConfig.deployBlock
		);
	}
}

export interface TroveUpdatedEvent {
	borrower: Address;
	debt: bigint;
	coll: bigint;
	stake: bigint;
	operation: bigint;
}
export interface TroveLiquidatedEvent {
	borrower: Address;
	debt: bigint;
	coll: bigint;
	operation: bigint;
}
export interface StabilityPoolLUSDBalanceUpdatedEvent {
	newBalance: bigint;
}
export interface UserDepositChangedEvent {
	depositor: Address;
	newDeposit: bigint;
}
export interface LiquidationEvent {
	liquidatedDebt: bigint;
	liquidatedColl: bigint;
	collGasCompensation: bigint;
	LUSDGasCompensation: bigint;
}
export interface CollBalanceUpdatedEvent {
	account: Address;
	newBalance: bigint;
}

export interface QueryPayload {}
