import { Contract, Interface, InterfaceAbi, type ContractRunner } from 'ethers';
import type { LQTYStaking, LQTYStakingInterface } from '../LQTYStaking';
import { modifyAbi, type Modifiers } from '../common';

const _abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_activePoolAddress',
				type: 'address'
			}
		],
		name: 'ActivePoolAddressSet',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_borrowerOperationsAddress',
				type: 'address'
			}
		],
		name: 'BorrowerOperationsAddressSet',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_account',
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
				name: '_F_ETH',
				type: 'uint256'
			}
		],
		name: 'F_ETHUpdated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_F_LUSD',
				type: 'uint256'
			}
		],
		name: 'F_LUSDUpdated',
		type: 'event'
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
				indexed: false,
				internalType: 'address',
				name: '_lusdTokenAddress',
				type: 'address'
			}
		],
		name: 'LUSDTokenAddressSet',
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
				indexed: true,
				internalType: 'address',
				name: 'staker',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'newStake',
				type: 'uint256'
			}
		],
		name: 'StakeChanged',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_staker',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_F_ETH',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: '_F_LUSD',
				type: 'uint256'
			}
		],
		name: 'StakerSnapshotsUpdated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'staker',
				type: 'address'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'LUSDGain',
				type: 'uint256'
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'ETHGain',
				type: 'uint256'
			}
		],
		name: 'StakingGainsWithdrawn',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: '_totalLQTYStaked',
				type: 'uint256'
			}
		],
		name: 'TotalLQTYStakedUpdated',
		type: 'event'
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: '_troveManager',
				type: 'address'
			}
		],
		name: 'TroveManagerAddressSet',
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
		name: 'F_ETH',
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
		name: 'F_LUSD',
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
				name: '_user',
				type: 'address'
			}
		],
		name: 'getPendingETHGain',
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
				name: '_user',
				type: 'address'
			}
		],
		name: 'getPendingLUSDGain',
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
				name: '_ETHFee',
				type: 'uint256'
			}
		],
		name: 'increaseF_ETH',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_LUSDFee',
				type: 'uint256'
			}
		],
		name: 'increaseF_LUSD',
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
		name: 'lusdToken',
		outputs: [
			{
				internalType: 'contract ILUSDToken',
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
			},
			{
				internalType: 'address',
				name: '_lusdTokenAddress',
				type: 'address'
			},
			{
				internalType: 'address',
				name: '_troveManagerAddress',
				type: 'address'
			},
			{
				internalType: 'address',
				name: '_borrowerOperationsAddress',
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
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address'
			}
		],
		name: 'snapshots',
		outputs: [
			{
				internalType: 'uint256',
				name: 'F_ETH_Snapshot',
				type: 'uint256'
			},
			{
				internalType: 'uint256',
				name: 'F_LUSD_Snapshot',
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
				name: '_LQTYamount',
				type: 'uint256'
			}
		],
		name: 'stake',
		outputs: [],
		stateMutability: 'nonpayable',
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
		name: 'stakes',
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
		name: 'totalLQTYStaked',
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
		inputs: [
			{
				internalType: 'uint256',
				name: '_LQTYamount',
				type: 'uint256'
			}
		],
		name: 'unstake',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		stateMutability: 'payable',
		type: 'receive'
	}
] as const;

export class LQTYStaking__factory {
	static readonly abi = _abi;
	static modifiedAbi(modifiers: Modifiers): InterfaceAbi {
		return modifyAbi(structuredClone(_abi), modifiers);
	}

	static createInterface<M extends Modifiers>(
		modifiers?: M
	): LQTYStakingInterface<M> {
		if (!modifiers) return new Interface(_abi) as LQTYStakingInterface<M>;

		return new Interface(
			modifyAbi(structuredClone(_abi), modifiers)
		) as LQTYStakingInterface<M>;
	}
	static connect<M extends Modifiers>(
		address: string,
		modifiers?: M,
		runner?: ContractRunner | null
	): LQTYStaking<M> {
		if (!modifiers)
			return new Contract(
				address,
				_abi,
				runner
			) as unknown as LQTYStaking<M>;

		return new Contract(
			address,
			modifyAbi(structuredClone(_abi), modifiers),
			runner
		) as unknown as LQTYStaking<M>
	}
}
