import type { Timeline } from '../../liquity/state/timeline';
import {
	borrowerOperationEnum,
	troveManagerOperationEnum
} from '../../liquity/protocols/enums';
import { formatBigInt, formatTimestamp } from '../utils/helpers';
import type { FilterOperation } from './Filters';

export type TroveRow = Timeline['trove'][number];

export const TROVE_COLUMNS = [
	{ id: 'time', label: 'Time', isBigInt: false as const },
	{ id: 'block', label: 'Block', isBigInt: false as const },
	{ id: 'tx', label: 'Tx', isBigInt: false as const },
	{ id: 'operation', label: 'Operation', isBigInt: false as const },
	{ id: 'trove.coll', label: 'coll', isBigInt: true as const },
	{ id: 'trove.debt', label: 'debt', isBigInt: true as const },
	{ id: 'trove.collSurplus', label: 'collSurplus', isBigInt: true as const },
	{
		id: 'trove.fees',
		label: 'fees',
		isBigInt: true as const,
		isFees: true as const
	},
	{ id: 'trove.lusdGasComp', label: 'lusdGasComp', isBigInt: true as const },
	{ id: 'trove.collPending', label: 'collPending', isBigInt: true as const },
	{ id: 'trove.debtPending', label: 'debtPending', isBigInt: true as const }
] as const;

export const TROVE_OPERATIONS: FilterOperation[] = [
	...borrowerOperationEnum.map((op) => ({ id: op, label: op })),
	...troveManagerOperationEnum.map((op) => ({ id: op, label: op })),
	{
		id: '3rdPartyLiquidationWithEmptyStabilityPool',
		label: '3rd party liq. (empty SP)'
	},
	{ id: 'collSurplusClaimed', label: 'Coll. surplus claimed' }
];

/** Returns cumulative fees per row; never negative. */
export function computeCumulativeFees(
	data: TroveRow[],
	repayLoanFeeBeforePrinciple: boolean
): bigint[] {
	const out: bigint[] = [];
	let sum = 0n;
	for (let i = 0; i < data.length; i++) {
		const e = data[i]!;
		const prevDebt = i > 0 ? data[i - 1]!.debt : 0n;
		sum += e.fees;
		if (i > 0 && e.debt < prevDebt) {
			const repayment = prevDebt - e.debt;
			if (repayLoanFeeBeforePrinciple) {
				const deduct = repayment > sum ? sum : repayment;
				sum -= deduct;
			} else {
				if (e.debt <= sum) {
					const deduct = repayment > sum ? sum : repayment;
					sum -= deduct;
				}
			}
			if (sum < 0n) sum = 0n;
		}
		out.push(sum);
	}
	return out;
}

export type TroveTableBodyProps = {
	slice: TroveRow[];
	filteredData: TroveRow[];
	cumulativeFees: bigint[];
	decimalPrecision: bigint;
	explorerTxUrl: string;
	visibleColumns: Set<string>;
	changeColumns: Set<string>;
	currentPage: number;
	pageSize: number;
	/** When true, coll column shows coll - collPending, debt column shows debt - debtPending */
	applyPendingToTrove?: boolean;
	/** When false, debt column additionally subtracts lusdGasComp */
	debtIncludesLiquidationReserve?: boolean;
};

function collDisplay(row: TroveRow, applyPending: boolean): bigint {
	if (!applyPending) return row.coll;
	const v = row.coll - row.collPending;
	return v < 0n ? 0n : v;
}

function debtDisplay(
	row: TroveRow,
	applyPending: boolean,
	debtIncludesReserve: boolean
): bigint {
	let v = row.debt;
	if (applyPending) v -= row.debtPending;
	if (!debtIncludesReserve) v -= row.lusdGasComp;
	return v < 0n ? 0n : v;
}

export function TroveTableBody({
	slice,
	filteredData,
	cumulativeFees,
	decimalPrecision,
	explorerTxUrl,
	visibleColumns,
	changeColumns,
	currentPage,
	pageSize,
	applyPendingToTrove = false,
	debtIncludesLiquidationReserve = true
}: TroveTableBodyProps) {
	return (
		<>
			{slice.map((e, i) => {
				const globalIndex = (currentPage - 1) * pageSize + i;
				const prev =
					globalIndex > 0 ? filteredData[globalIndex - 1]! : null;
				const cumFees = cumulativeFees[globalIndex] ?? 0n;
				const collVal = collDisplay(e, applyPendingToTrove);
				const debtVal = debtDisplay(
					e,
					applyPendingToTrove,
					debtIncludesLiquidationReserve
				);
				const prevCollVal = prev
					? collDisplay(prev, applyPendingToTrove)
					: null;
				const prevDebtVal = prev
					? debtDisplay(
							prev,
							applyPendingToTrove,
							debtIncludesLiquidationReserve
					  )
					: null;
				return (
					<tr
						key={globalIndex}
						className='border-t border-[#3a3a3a]'
					>
						{visibleColumns.has('time') && (
							<td className='p-2'>
								{formatTimestamp(e.timestamp)}
							</td>
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
						{visibleColumns.has('trove.coll') && (
							<td className='p-2'>
								{changeColumns.has('trove.coll') &&
								prevCollVal !== null
									? formatBigInt(
											collVal - prevCollVal,
											decimalPrecision
									  )
									: formatBigInt(collVal, decimalPrecision)}
							</td>
						)}
						{visibleColumns.has('trove.debt') && (
							<td className='p-2'>
								{changeColumns.has('trove.debt') &&
								prevDebtVal !== null
									? formatBigInt(
											debtVal - prevDebtVal,
											decimalPrecision
									  )
									: formatBigInt(debtVal, decimalPrecision)}
							</td>
						)}
						{visibleColumns.has('trove.collSurplus') && (
							<td className='p-2'>
								{changeColumns.has('trove.collSurplus') && prev
									? formatBigInt(
											e.collSurplus - prev.collSurplus,
											decimalPrecision
									  )
									: formatBigInt(
											e.collSurplus,
											decimalPrecision
									  )}
							</td>
						)}
						{visibleColumns.has('trove.fees') && (
							<td className='p-2'>
								{changeColumns.has('trove.fees')
									? formatBigInt(cumFees, decimalPrecision)
									: formatBigInt(e.fees, decimalPrecision)}
							</td>
						)}
						{visibleColumns.has('trove.lusdGasComp') && (
							<td className='p-2'>
								{changeColumns.has('trove.lusdGasComp') && prev
									? formatBigInt(
											e.lusdGasComp - prev.lusdGasComp,
											decimalPrecision
									  )
									: formatBigInt(
											e.lusdGasComp,
											decimalPrecision
									  )}
							</td>
						)}
						{visibleColumns.has('trove.collPending') && (
							<td className='p-2'>
								{changeColumns.has('trove.collPending') && prev
									? formatBigInt(
											e.collPending - prev.collPending,
											decimalPrecision
									  )
									: formatBigInt(
											e.collPending,
											decimalPrecision
									  )}
							</td>
						)}
						{visibleColumns.has('trove.debtPending') && (
							<td className='p-2'>
								{changeColumns.has('trove.debtPending') && prev
									? formatBigInt(
											e.debtPending - prev.debtPending,
											decimalPrecision
									  )
									: formatBigInt(
											e.debtPending,
											decimalPrecision
									  )}
							</td>
						)}
					</tr>
				);
			})}
		</>
	);
}
