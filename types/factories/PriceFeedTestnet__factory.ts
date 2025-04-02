import { Contract, Interface, type ContractRunner } from 'ethers';
import type { PriceFeedTestnet, PriceFeedTestnetInterface } from '../PriceFeedTestnet';

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
	static createInterface(): PriceFeedTestnetInterface {
		return new Interface(_abi) as PriceFeedTestnetInterface;
	}
	static connect(
		address: string,
		runner?: ContractRunner | null
	): PriceFeedTestnet {
		return new Contract(
			address,
			_abi,
			runner
		) as unknown as PriceFeedTestnet;
	}
}
