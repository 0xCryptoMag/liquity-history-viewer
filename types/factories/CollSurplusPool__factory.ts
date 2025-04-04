import { Contract, Interface, InterfaceAbi, type ContractRunner } from 'ethers';
import type { CollSurplusPool, CollSurplusPoolInterface } from '../CollSurplusPool';
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
				name: '_newBorrowerOperationsAddress',
				type: 'address'
			}
		],
		name: 'BorrowerOperationsAddressChanged',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: '_account',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_newBalance',
				type: 'uint256'
			}
		],
		name: 'CollBalanceUpdated',
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
		inputs: [
			{
				internalType: 'address',
				name: '_account',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '_amount',
				type: 'uint256'
			}
		],
		name: 'accountSurplus',
		outputs: [],
		stateMutability: 'nonpayable',
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
		inputs: [],
		name: 'borrowerOperationsAddress',
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
				internalType: 'address',
				name: '_account',
				type: 'address'
			}
		],
		name: 'claimColl',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_account',
				type: 'address'
			}
		],
		name: 'getCollateral',
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
				internalType: 'address',
				name: '_borrowerOperationsAddress',
				type: 'address'
			},
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

export class CollSurplusPool__factory {
	static readonly abi = _abi;
	static modifiedAbi(modifiers: Modifiers): InterfaceAbi {
		return modifyAbi(structuredClone(_abi), modifiers);
	}

	static createInterface<M extends Modifiers>(
		modifiers?: M
	): CollSurplusPoolInterface<M> {
		if (!modifiers) return new Interface(_abi) as CollSurplusPoolInterface<M>;

		return new Interface(
			modifyAbi(structuredClone(_abi), modifiers)
		) as CollSurplusPoolInterface<M>;
	}
	static connect<M extends Modifiers>(
		address: string,
		modifiers?: M,
		runner?: ContractRunner | null
	): CollSurplusPool<M> {
		if (!modifiers)
			return new Contract(
				address,
				_abi,
				runner
			) as unknown as CollSurplusPool<M>;

		return new Contract(
			address,
			modifyAbi(structuredClone(_abi), modifiers),
			runner
		) as unknown as CollSurplusPool<M>;
	}
}
