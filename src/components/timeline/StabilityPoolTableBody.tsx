import type { Timeline } from '../../liquity/state/timeline';
import { formatBigInt, formatTimestamp } from '../utils/helpers';
import type { FilterOperation } from './Filters';

export type StabilityPoolRow = Timeline['stabilityPool'][number];

export const STABILITY_POOL_COLUMNS = [
	{ id: 'time', label: 'Time', isBigInt: false as const },
	{ id: 'block', label: 'Block', isBigInt: false as const },
	{ id: 'tx', label: 'Tx', isBigInt: false as const },
	{ id: 'operation', label: 'Operation', isBigInt: false as const },
	{ id: 'stabilityPool.deposit', label: 'deposit', isBigInt: true as const },
	{ id: 'stabilityPool.pendingEthGain', label: 'pendingEthGain', isBigInt: true as const },
	{ id: 'stabilityPool.pendingLusdLoss', label: 'pendingDepositLoss', isBigInt: true as const },
	{ id: 'stabilityPool.pendingLqtyReward', label: 'pendingLqtyReward', isBigInt: true as const },
	{ id: 'stabilityPool.lqtyPaidOut', label: 'lqtyPaidOut', isBigInt: true as const }
] as const;

export const STABILITY_POOL_OPERATIONS: FilterOperation[] = [
	{ id: 'UserAction', label: 'User action' },
	{ id: '3rdPartyUserAction', label: '3rd party user action' },
	{ id: '3rdPartyLiquidationWithStabilityPoolOffset', label: '3rd party liq. (SP offset)' }
];

export type StabilityPoolTableBodyProps = {
	slice: StabilityPoolRow[];
	filteredData: StabilityPoolRow[];
	decimalPrecision: bigint;
	explorerTxUrl: string;
	visibleColumns: Set<string>;
	changeColumns: Set<string>;
	currentPage: number;
	pageSize: number;
	/** When true, deposit column shows deposit - pendingLusdLoss */
	applyPendingToStabilityPool?: boolean;
};

function depositDisplay(
	row: StabilityPoolRow,
	applyPending: boolean
): bigint {
	if (!applyPending) return row.deposit;
	const v = row.deposit - row.pendingLusdLoss;
	return v < 0n ? 0n : v;
}

export function StabilityPoolTableBody({
	slice,
	filteredData,
	decimalPrecision,
	explorerTxUrl,
	visibleColumns,
	changeColumns,
	currentPage,
	pageSize,
	applyPendingToStabilityPool = false
}: StabilityPoolTableBodyProps) {
	return (
		<>
			{slice.map((e, i) => {
				const globalIndex = (currentPage - 1) * pageSize + i;
				const prev = globalIndex > 0 ? filteredData[globalIndex - 1]! : null;
				const depositVal = depositDisplay(e, applyPendingToStabilityPool);
				const prevDepositVal = prev
					? depositDisplay(prev, applyPendingToStabilityPool)
					: null;
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
						{visibleColumns.has('stabilityPool.deposit') && (
							<td className='p-2'>
								{changeColumns.has('stabilityPool.deposit') && prevDepositVal !== null
									? formatBigInt(depositVal - prevDepositVal, decimalPrecision)
									: formatBigInt(depositVal, decimalPrecision)}
							</td>
						)}
						{visibleColumns.has('stabilityPool.pendingEthGain') && (
							<td className='p-2'>
								{changeColumns.has('stabilityPool.pendingEthGain') && prev
									? formatBigInt(e.pendingEthGain - prev.pendingEthGain, decimalPrecision)
									: formatBigInt(e.pendingEthGain, decimalPrecision)}
							</td>
						)}
						{visibleColumns.has('stabilityPool.pendingLusdLoss') && (
							<td className='p-2'>
								{changeColumns.has('stabilityPool.pendingLusdLoss') && prev
									? formatBigInt(e.pendingLusdLoss - prev.pendingLusdLoss, decimalPrecision)
									: formatBigInt(e.pendingLusdLoss, decimalPrecision)}
							</td>
						)}
						{visibleColumns.has('stabilityPool.pendingLqtyReward') && (
							<td className='p-2'>
								{changeColumns.has('stabilityPool.pendingLqtyReward') && prev
									? formatBigInt(e.pendingLqtyReward - prev.pendingLqtyReward, decimalPrecision)
									: formatBigInt(e.pendingLqtyReward, decimalPrecision)}
							</td>
						)}
						{visibleColumns.has('stabilityPool.lqtyPaidOut') && (
							<td className='p-2'>
								{changeColumns.has('stabilityPool.lqtyPaidOut') && prev
									? formatBigInt(e.lqtyPaidOut - prev.lqtyPaidOut, decimalPrecision)
									: formatBigInt(e.lqtyPaidOut, decimalPrecision)}
							</td>
						)}
					</tr>
				);
			})}
		</>
	);
}
