import { Contract, Interface, InterfaceAbi, type ContractRunner } from 'ethers';
import type { MultiTroveGetter, MultiTroveGetterInterface } from '../MultiTroveGetter.js';
import { modifyAbi, type Modifiers } from '../common.js';

const _abi = [
	{
		inputs: [
			{
				internalType: 'contract TroveManager',
				name: '_troveManager',
				type: 'address'
			},
			{
				internalType: 'contract ISortedTroves',
				name: '_sortedTroves',
				type: 'address'
			}
		],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
	{
		inputs: [
			{
				internalType: 'int256',
				name: '_startIdx',
				type: 'int256'
			},
			{
				internalType: 'uint256',
				name: '_count',
				type: 'uint256'
			}
		],
		name: 'getMultipleSortedTroves',
		outputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'owner',
						type: 'address'
					},
					{
						internalType: 'uint256',
						name: 'debt',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'coll',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'stake',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'snapshotETH',
						type: 'uint256'
					},
					{
						internalType: 'uint256',
						name: 'snapshotLUSDDebt',
						type: 'uint256'
					}
				],
				internalType: 'struct MultiTroveGetter.CombinedTroveData[]',
				name: '_troves',
				type: 'tuple[]'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'sortedTroves',
		outputs: [
			{
				internalType: 'contract ISortedTroves',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'troveManager',
		outputs: [
			{
				internalType: 'contract TroveManager',
				name: '',
				type: 'address'
			}
		],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

export class MultiTroveGetter__factory {
	static readonly abi = _abi;
	static modifiedAbi(modifiers: Modifiers): InterfaceAbi {
		return modifyAbi(structuredClone(_abi), modifiers);
	}

	static createInterface<M extends Modifiers>(
		modifiers: M
	): MultiTroveGetterInterface<M> {
		if (modifiers.abisType === 'normal') return new Interface(_abi) as MultiTroveGetterInterface<M>;

		return new Interface(
			modifyAbi(structuredClone(_abi), modifiers)
		) as MultiTroveGetterInterface<M>;
	}
	static connect<M extends Modifiers>(
		address: string,
		modifiers: M,
		runner?: ContractRunner | null
	): MultiTroveGetter<M> {
		if (modifiers.abisType === 'normal')
			return new Contract(
				address,
				_abi,
				runner
			) as unknown as MultiTroveGetter<M>;

		return new Contract(
			address,
			modifyAbi(structuredClone(_abi), modifiers),
			runner
		) as unknown as MultiTroveGetter<M>
	}
}
