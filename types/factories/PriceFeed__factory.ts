import { Contract, Interface, InterfaceAbi, type ContractRunner } from 'ethers';
import type { PriceFeed, PriceFeedInterface } from '../PriceFeed';
import { modifyAbi, type Modifiers } from '../common';

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
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address'
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address'
			}
		],
		name: 'OwnershipTransferred',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'enum PriceFeed.Status',
				name: 'newStatus',
				type: 'uint8'
			}
		],
		name: 'PriceFeedStatusChanged',
		type: 'event'
	},
	{
		inputs: [],
		name: 'DECIMAL_PRECISION',
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
		inputs: [],
		name: 'ETHUSD_TELLOR_REQ_ID',
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
		inputs: [],
		name: 'MAX_PRICE_DEVIATION_FROM_PREVIOUS_ROUND',
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
		inputs: [],
		name: 'MAX_PRICE_DIFFERENCE_BETWEEN_ORACLES',
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
		inputs: [],
		name: 'NAME',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'TARGET_DIGITS',
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
		inputs: [],
		name: 'TELLOR_DIGITS',
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
		inputs: [],
		name: 'TIMEOUT',
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
		name: 'isOwner',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'lastGoodPrice',
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
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'priceAggregator',
		outputs: [
			{
				internalType: 'contract AggregatorV3Interface',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_priceAggregatorAddress',
				type: 'address'
			},
			{
				internalType: 'address',
				name: '_tellorCallerAddress',
				type: 'address'
			}
		],
		name: 'setAddresses',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'status',
		outputs: [
			{
				internalType: 'enum PriceFeed.Status',
				name: '',
				type: 'uint8'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'tellorCaller',
		outputs: [
			{
				internalType: 'contract ITellorCaller',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

export class PriceFeed__factory {
	static readonly abi = _abi;
	static modifiedAbi(modifiers: Modifiers): InterfaceAbi {
		return modifyAbi(structuredClone(_abi), modifiers);
	}

	static createInterface<M extends Modifiers>(
		modifiers?: M
	): PriceFeedInterface<M> {
		if (!modifiers) return new Interface(_abi) as PriceFeedInterface<M>;

		return new Interface(
			modifyAbi(structuredClone(_abi), modifiers)
		) as PriceFeedInterface<M>;
	}
	static connect<M extends Modifiers>(
		address: string,
		modifiers?: M,
		runner?: ContractRunner | null
	): PriceFeed<M> {
		if (!modifiers)
			return new Contract(
				address,
				_abi,
				runner
			) as unknown as PriceFeed<M>;

		return new Contract(
			address,
			modifyAbi(structuredClone(_abi), modifiers),
			runner
		) as unknown as PriceFeed<M>
	}
}
