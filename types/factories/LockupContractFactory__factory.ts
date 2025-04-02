import { Contract, Interface, InterfaceAbi, type ContractRunner } from 'ethers';
import type { LockupContractFactory, LockupContractFactoryInterface } from '../LockupContractFactory';
import { modifyAbi, type Modifiers } from '../common';

const _abi = [
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
				indexed: false,
				internalType: 'address',
				name: '_lockupContractAddress',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'address',
				name: '_beneficiary',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_unlockTime',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'address',
				name: '_deployer',
				type: 'address'
			}
		],
		name: 'LockupContractDeployedThroughFactory',
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
		name: 'SECONDS_IN_ONE_YEAR',
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
				internalType: 'address',
				name: '_beneficiary',
				type: 'address'
			},
			{
				internalType: 'uint256',
				name: '_unlockTime',
				type: 'uint256'
			}
		],
		name: 'deployLockupContract',
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
		inputs: [
			{
				internalType: 'address',
				name: '_contractAddress',
				type: 'address'
			}
		],
		name: 'isRegisteredLockup',
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
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		name: 'lockupContractToDeployer',
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
		name: 'lqtyTokenAddress',
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
				name: '_lqtyTokenAddress',
				type: 'address'
			}
		],
		name: 'setLQTYTokenAddress',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
] as const;

export class LockupContractFactory__factory {
	static readonly abi = _abi;
	static modifiedAbi(modifiers: Modifiers): InterfaceAbi {
		return modifyAbi(structuredClone(_abi), modifiers);
	}

	static createInterface<M extends Modifiers>(
		modifiers?: M
	): LockupContractFactoryInterface<M> {
		if (!modifiers) return new Interface(_abi) as LockupContractFactoryInterface<M>;

		return new Interface(
			modifyAbi(structuredClone(_abi), modifiers)
		) as LockupContractFactoryInterface<M>;
	}
	static connect<M extends Modifiers>(
		address: string,
		modifiers?: M,
		runner?: ContractRunner | null
	): LockupContractFactory<M> {
		if (!modifiers)
			return new Contract(
				address,
				_abi,
				runner
			) as unknown as LockupContractFactory<M>;

		return new Contract(
			address,
			modifyAbi(structuredClone(_abi), modifiers),
			runner
		) as unknown as LockupContractFactory<M>
	}
}
