import type { Timeline } from '../../liquity/state/timeline';
import { formatBigInt, formatTimestamp } from '../utils/helpers';
import type { FilterOperation } from './Filters';

export type StakingPoolRow = Timeline['lqtyStakingPool'][number];

export const STAKING_POOL_COLUMNS = [
	{ id: 'time', label: 'Time', isBigInt: false as const },
	{ id: 'block', label: 'Block', isBigInt: false as const },
	{ id: 'tx', label: 'Tx', isBigInt: false as const },
	{ id: 'operation', label: 'Operation', isBigInt: false as const },
	{ id: 'lqtyStakingPool.stake', label: 'stake', isBigInt: true as const },
	{ id: 'lqtyStakingPool.pendingEthGain', label: 'pendingEthGain', isBigInt: true as const },
	{ id: 'lqtyStakingPool.pendingLusdGain', label: 'pendingLusdGain', isBigInt: true as const }
] as const;

export const STAKING_POOL_OPERATIONS: FilterOperation[] = [
	{ id: 'UserAction', label: 'User action' },
	{ id: '3rdPartyRedemptionFeePaid', label: '3rd party redemption fee' },
	{ id: '3rdPartyDepositFeePaid', label: '3rd party deposit fee' }
];

export type StakingPoolTableBodyProps = {
	slice: StakingPoolRow[];
	filteredData: StakingPoolRow[];
	decimalPrecision: bigint;
	explorerTxUrl: string;
	visibleColumns: Set<string>;
	changeColumns: Set<string>;
	currentPage: number;
	pageSize: number;
};

export function StakingPoolTableBody({
	slice,
	filteredData,
	decimalPrecision,
	explorerTxUrl,
	visibleColumns,
	changeColumns,
	currentPage,
	pageSize
}: StakingPoolTableBodyProps) {
	return (
		<>
			{slice.map((e, i) => {
				const globalIndex = (currentPage - 1) * pageSize + i;
				const prev = globalIndex > 0 ? filteredData[globalIndex - 1]! : null;
				return (
					<tr key={globalIndex} className='border-t border-[#3a3a3a]'>
						{visibleColumns.has('time') && (
							<td className='p-2'>{formatTimestamp(e.timestamp)}</td>
						)}
						{visibleColumns.has('block') && (
							<td className='p-2'>{e.blockNumber.toString()}</td>
						)}
						{visibleColumns.has('tx') && (
							<td className='p-2'>
								{e.transactionHash ? (
									<a
										href={`${explorerTxUrl}${e.transactionHash}`}
										target='_blank'
										rel='noopener noreferrer'
										className='text-[#7eb8da] hover:underline break-all'
									>
										{e.transactionHash.slice(0, 10)}…
									</a>
								) : (
									'—'
								)}
							</td>
						)}
						{visibleColumns.has('operation') && (
							<td className='p-2'>{e.operation}</td>
						)}
						{visibleColumns.has('lqtyStakingPool.stake') && (
							<td className='p-2'>
								{changeColumns.has('lqtyStakingPool.stake') && prev
									? formatBigInt(e.stake - prev.stake, decimalPrecision)
									: formatBigInt(e.stake, decimalPrecision)}
							</td>
						)}
						{visibleColumns.has('lqtyStakingPool.pendingEthGain') && (
							<td className='p-2'>
								{changeColumns.has('lqtyStakingPool.pendingEthGain') && prev
									? formatBigInt(e.pendingEthGain - prev.pendingEthGain, decimalPrecision)
									: formatBigInt(e.pendingEthGain, decimalPrecision)}
							</td>
						)}
						{visibleColumns.has('lqtyStakingPool.pendingLusdGain') && (
							<td className='p-2'>
								{changeColumns.has('lqtyStakingPool.pendingLusdGain') && prev
									? formatBigInt(e.pendingLusdGain - prev.pendingLusdGain, decimalPrecision)
									: formatBigInt(e.pendingLusdGain, decimalPrecision)}
							</td>
						)}
					</tr>
				);
			})}
		</>
	);
}
