import { Contract, Interface, InterfaceAbi, type ContractRunner } from 'ethers';
import type { CommunityIssuance, CommunityIssuanceInterface } from '../CommunityIssuance';
import { modifyAbi, type Modifiers } from '../common';

const _abi = [
	{
		inputs: [],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_lqtyTokenAddress',
				type: 'address'
			}
		],
		name: 'LQTYTokenAddressSet',
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
				name: '_stabilityPoolAddress',
				type: 'address'
			}
		],
		name: 'StabilityPoolAddressSet',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_totalLQTYIssued',
				type: 'uint256'
			}
		],
		name: 'TotalLQTYIssuedUpdated',
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
		name: 'ISSUANCE_FACTOR',
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
		name: 'LQTYSupplyCap',
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
		name: 'SECONDS_IN_ONE_MINUTE',
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
		name: 'deploymentTime',
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
		name: 'issueLQTY',
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
		name: 'lqtyToken',
		outputs: [
			{
				internalType: 'contract ILQTYToken',
				name: '',
				type: 'address'
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
				name: '_account',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '_LQTYamount',
				type: 'uint256'
			}
		],
		name: 'sendLQTY',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_lqtyTokenAddress',
				type: 'address'
			},
			{
				internalType: 'address',
				name: '_stabilityPoolAddress',
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
		name: 'stabilityPoolAddress',
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
		name: 'totalLQTYIssued',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256'
			}
		],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

export class CommunityIssuance__factory {
	static readonly abi = _abi;
	static modifiedAbi(modifiers: Modifiers): InterfaceAbi {
		return modifyAbi(structuredClone(_abi), modifiers);
	}

	static createInterface<M extends Modifiers>(
		modifiers?: M
	): CommunityIssuanceInterface<M> {
		if (!modifiers) return new Interface(_abi) as CommunityIssuanceInterface<M>;

		return new Interface(
			modifyAbi(structuredClone(_abi), modifiers)
		) as CommunityIssuanceInterface<M>;
	}
	static connect<M extends Modifiers>(
		address: string,
		modifiers?: M,
		runner?: ContractRunner | null
	): CommunityIssuance<M> {
		if (!modifiers)
			return new Contract(
				address,
				_abi,
				runner
			) as unknown as CommunityIssuance<M>

		return new Contract(
			address,
			modifyAbi(structuredClone(_abi), modifiers),
			runner
		) as unknown as CommunityIssuance<M>;
	}
}
