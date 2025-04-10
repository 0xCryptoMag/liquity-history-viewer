import { Contract, Interface, InterfaceAbi, type ContractRunner } from 'ethers';
import type { PriceFeedTestnet, PriceFeedTestnetInterface } from '../PriceFeedTestnet.js';
import { modifyAbi, type Modifiers } from '../common.js';

const _abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_lastGoodPrice',
				type: 'uint256'
			}
		],
		name: 'LastGoodPriceUpdated',
		type: 'event'
	},
	{
		inputs: [],
		name: 'fetchPrice',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getPrice',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'price',
				type: 'uint256'
			}
		],
		name: 'setPrice',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		stateMutability: 'nonpayable',
		type: 'function'
	}
] as const;

export class PriceFeedTestnet__factory {
	static readonly abi = _abi;
	static modifiedAbi(modifiers: Modifiers): InterfaceAbi {
		return modifyAbi(structuredClone(_abi), modifiers);
	}

	static createInterface<M extends Modifiers>(
		modifiers: M
	): PriceFeedTestnetInterface {
		if (modifiers.abisType === 'normal') return new Interface(_abi) as PriceFeedTestnetInterface;

		return new Interface(
			modifyAbi(structuredClone(_abi), modifiers)
		) as PriceFeedTestnetInterface;
	}
	static connect<M extends Modifiers>(
		address: string,
		modifiers: M,
		runner?: ContractRunner | null
	): PriceFeedTestnet {
		if (modifiers.abisType === 'normal')
			return new Contract(
				address,
				_abi,
				runner
			) as unknown as PriceFeedTestnet;

		return new Contract(
			address,
			modifyAbi(structuredClone(_abi), modifiers),
			runner
		) as unknown as PriceFeedTestnet
	}
}
