import { Contract, Interface, InterfaceAbi, type ContractRunner } from 'ethers';
import type { DefaultPool, DefaultPoolInterface } from '../DefaultPool';
import { modifyAbi, type Modifiers } from '../common';

const _abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_newActivePoolAddress',
				type: 'address'
			}
		],
		name: 'ActivePoolAddressChanged',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_newDefaultPoolAddress',
				type: 'address'
			}
		],
		name: 'DefaultPoolAddressChanged',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_ETH',
				type: 'uint256'
			}
		],
		name: 'DefaultPoolETHBalanceUpdated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_LUSDDebt',
				type: 'uint256'
			}
		],
		name: 'DefaultPoolLUSDDebtUpdated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_newBalance',
				type: 'uint256'
			}
		],
		name: 'ETHBalanceUpdated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_to',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'EtherSent',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_newBalance',
				type: 'uint256'
			}
		],
		name: 'LUSDBalanceUpdated',
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
				internalType: 'address',
				name: '_newStabilityPoolAddress',
				type: 'address'
			}
		],
		name: 'StabilityPoolAddressChanged',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_newTroveManagerAddress',
				type: 'address'
			}
		],
		name: 'TroveManagerAddressChanged',
		type: 'event'
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
		name: 'activePoolAddress',
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
		inputs: [
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'decreaseLUSDDebt',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'getETH',
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
		name: 'getLUSDDebt',
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
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'increaseLUSDDebt',
		outputs: [],
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
		inputs: [
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'sendETHToActivePool',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_troveManagerAddress',
				type: 'address'
			},
			{
				internalType: 'address',
				name: '_activePoolAddress',
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
		name: 'troveManagerAddress',
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
		stateMutability: 'payable',
		type: 'receive'
	}
] as const;

export class DefaultPool__factory {
	static readonly abi = _abi;
	static modifiedAbi(modifiers: Modifiers): InterfaceAbi {
		return modifyAbi(structuredClone(_abi), modifiers);
	}

	static createInterface<M extends Modifiers>(
		modifiers?: M
	): DefaultPoolInterface<M> {
		if (!modifiers) return new Interface(_abi) as DefaultPoolInterface<M>;

		return new Interface(
			modifyAbi(structuredClone(_abi), modifiers)
		) as DefaultPoolInterface<M>;
	}
	static connect<M extends Modifiers>(
		address: string,
		modifiers: M,
		runner?: ContractRunner | null
	): DefaultPool<M> {
		if (!modifiers)
			return new Contract(
				address,
				_abi,
				runner
			) as unknown as DefaultPool<M>;

		return new Contract(
			address,
			modifyAbi(structuredClone(_abi),
			modifiers
		), runner) as unknown as DefaultPool<M>;
	}
}
