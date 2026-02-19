import { useState, useMemo } from 'react';
import type { Timeline } from '../../liquity/state/timeline';
import type { ProtocolName } from '../../liquity/protocols/protocols';
import { protocols } from '../../liquity/protocols/protocols';
import type { TimelineOptions } from './OptionsSelect';
import { TableTitleBar } from './TableTitleBar';
import { PaginationControls, type PageSize } from './PaginationControls';
import { ProtocolSelect } from '../protocol/ProtocolSelect';
import {
	TROVE_COLUMNS,
	TROVE_OPERATIONS,
	computeCumulativeFees,
	TroveTableBody,
	type TroveRow
} from './TroveTableBody';
import {
	STABILITY_POOL_COLUMNS,
	STABILITY_POOL_OPERATIONS,
	StabilityPoolTableBody,
	type StabilityPoolRow
} from './StabilityPoolTableBody';
import {
	STAKING_POOL_COLUMNS,
	STAKING_POOL_OPERATIONS,
	StakingPoolTableBody,
	type StakingPoolRow
} from './StakingPoolTableBody';

const STREAMS = [
	{ id: 'trove' as const, label: 'Trove', title: 'Trove' },
	{
		id: 'stabilityPool' as const,
		label: 'Stability Pool',
		title: 'Stability Pool'
	},
	{
		id: 'lqtyStakingPool' as const,
		label: 'Staking Pool',
		title: 'Staking Pool'
	}
] as const;

type StreamId = (typeof STREAMS)[number]['id'];

const STREAM_OPERATIONS = {
	trove: TROVE_OPERATIONS,
	stabilityPool: STABILITY_POOL_OPERATIONS,
	lqtyStakingPool: STAKING_POOL_OPERATIONS
} as const;

const COLUMN_CONFIGS: Record<
	StreamId,
	readonly {
		id: string;
		label: string;
		isBigInt: boolean;
		isFees?: boolean;
	}[]
> = {
	trove: TROVE_COLUMNS,
	stabilityPool: STABILITY_POOL_COLUMNS,
	lqtyStakingPool: STAKING_POOL_COLUMNS
};

function dateToTimestampStart(dateStr: string): number | null {
	if (!dateStr) return null;
	const d = new Date(dateStr + 'T00:00:00Z');
	return Math.floor(d.getTime() / 1000);
}

function dateToTimestampEnd(dateStr: string): number | null {
	if (!dateStr) return null;
	const d = new Date(dateStr + 'T23:59:59.999Z');
	return Math.floor(d.getTime() / 1000);
}

type Props = {
	timeline: Timeline;
	decimalPrecision: bigint;
	protocol: ProtocolName;
	onProtocolChange: (p: ProtocolName) => void;
	protocolSelect: {
		address: string;
		onAddressChange: (a: string) => void;
		onSubmit: () => void;
		loading: boolean;
	};
};

export function TimelineViewer({
	timeline,
	decimalPrecision,
	protocol,
	onProtocolChange,
	protocolSelect
}: Props) {
	const [openStream, setOpenStream] = useState<StreamId>('trove');
	const [streamDropdownOpen, setStreamDropdownOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState<PageSize>(25);
	const [changeColumns, setChangeColumns] = useState<Set<string>>(new Set());
	const [options, setOptions] = useState<TimelineOptions>({
		applyPendingToTrove: false,
		applyPendingToStabilityPool: false,
		repayLoanFeeBeforePrinciple: false,
		debtIncludesLiquidationReserve: false
	});
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [enabledOperations, setEnabledOperations] = useState<Set<string>>(
		() => new Set(STREAM_OPERATIONS[openStream].map((op) => op.id))
	);
	const [optionsPopoverOpen, setOptionsPopoverOpen] = useState(false);
	const [columnsPopoverOpen, setColumnsPopoverOpen] = useState(false);
	const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

	const streamConfig = STREAMS.find((s) => s.id === openStream)!;
	const operations = STREAM_OPERATIONS[openStream];
	const columnsForStream = COLUMN_CONFIGS[openStream];
	const allColumnIds = columnsForStream.map((c) => c.id);
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		() => new Set(allColumnIds)
	);
	const columnLabels = useMemo(
		() => Object.fromEntries(columnsForStream.map((c) => [c.id, c.label])),
		[openStream]
	);

	const filteredData = useMemo(() => {
		const raw =
			openStream === 'trove'
				? timeline.trove
				: openStream === 'stabilityPool'
				? timeline.stabilityPool
				: timeline.lqtyStakingPool;
		const fromTs = dateToTimestampStart(fromDate);
		const toTs = dateToTimestampEnd(toDate);
		return raw.filter((row) => {
			const ts = Number(row.timestamp);
			if (fromTs != null && ts < fromTs) return false;
			if (toTs != null && ts > toTs) return false;
			if (
				enabledOperations.size > 0 &&
				!enabledOperations.has(row.operation)
			)
				return false;
			return true;
		});
	}, [timeline, openStream, fromDate, toDate, enabledOperations]);

	const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
	const currentPage = Math.min(page, totalPages);
	const slice = useMemo(
		() =>
			filteredData.slice(
				(currentPage - 1) * pageSize,
				currentPage * pageSize
			),
		[filteredData, currentPage, pageSize]
	);

	const troveCumulativeFees =
		openStream === 'trove'
			? useMemo(
					() =>
						computeCumulativeFees(
							filteredData as TroveRow[],
							options.repayLoanFeeBeforePrinciple
						),
					[filteredData, options.repayLoanFeeBeforePrinciple]
			  )
			: [];

	const explorerTxUrl = protocols[protocol].chain.blockExplorerTxUrl;

	const toggleChangeColumn = (columnKey: string) => {
		setChangeColumns((prev) => {
			const next = new Set(prev);
			if (next.has(columnKey)) next.delete(columnKey);
			else next.add(columnKey);
			return next;
		});
	};

	const renderHeader = (
		columnKey: string,
		title: string,
		clickable: boolean,
		isFees?: boolean
	) => {
		if (!clickable) {
			return (
				<th
					key={columnKey}
					className='p-2'
				>
					{title}
				</th>
			);
		}
		const isChangeMode = changeColumns.has(columnKey);
		const suffix = isFees ? ' Σ' : ' Δ';
		const displayTitle = isChangeMode ? `${title}${suffix}` : title;
		return (
			<th
				key={columnKey}
				className='p-2 cursor-pointer hover:bg-[#3a3a3a] select-none'
				onClick={() => toggleChangeColumn(columnKey)}
				title={
					isFees
						? 'Click for cumulative fees'
						: 'Click to toggle value vs change'
				}
			>
				{displayTitle}
			</th>
		);
	};

	const currentStreamData =
		openStream === 'trove'
			? timeline.trove
			: openStream === 'stabilityPool'
			? timeline.stabilityPool
			: timeline.lqtyStakingPool;

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<PaginationControls
					page={page}
					setPage={setPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					totalPages={totalPages}
				/>
				<ProtocolSelect
					protocol={protocol}
					onProtocolChange={onProtocolChange}
					address={protocolSelect.address}
					onAddressChange={protocolSelect.onAddressChange}
					actions={
						<button
							type='button'
							onClick={protocolSelect.onSubmit}
							disabled={protocolSelect.loading}
							className='bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded font-mono text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{protocolSelect.loading ? 'Loading...' : 'Generate'}
						</button>
					}
				/>
			</div>

			<div className='w-full rounded-lg border border-[#3a3a3a] overflow-hidden'>
				<TableTitleBar
					options={options}
					onOptionsApply={setOptions}
					optionsPopoverOpen={optionsPopoverOpen}
					onOptionsPopoverOpenChange={setOptionsPopoverOpen}
					streams={STREAMS.map((s) => ({
						id: s.id,
						title: s.title,
						count: timeline[s.id].length
					}))}
					currentStreamId={openStream}
					currentStreamTitle={streamConfig.title}
					currentStreamCount={currentStreamData.length}
					streamDropdownOpen={streamDropdownOpen}
					onStreamDropdownOpenChange={setStreamDropdownOpen}
					onStreamSelect={(streamId) => {
						setOpenStream(streamId as StreamId);
						setPage(1);
						setEnabledOperations(
							() =>
								new Set(
									STREAM_OPERATIONS[streamId as StreamId].map(
										(o) => o.id
									)
								)
						);
						setVisibleColumns(
							new Set(
								COLUMN_CONFIGS[streamId as StreamId].map(
									(c) => c.id
								)
							)
						);
					}}
					allColumnIds={allColumnIds}
					visibleColumns={visibleColumns}
					onVisibleColumnsChange={setVisibleColumns}
					columnLabels={columnLabels}
					columnsPopoverOpen={columnsPopoverOpen}
					onColumnsPopoverOpenChange={setColumnsPopoverOpen}
					operations={operations}
					fromDate={fromDate}
					toDate={toDate}
					enabledOperationIds={enabledOperations}
					onFromDateChange={setFromDate}
					onToDateChange={setToDate}
					onEnabledOperationIdsChange={setEnabledOperations}
					filterPopoverOpen={filterPopoverOpen}
					onFilterPopoverOpenChange={setFilterPopoverOpen}
				/>

				<div className='overflow-x-auto'>
				<table className='w-full text-sm text-left'>
					<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
						<tr>
							{columnsForStream
								.filter((c) => visibleColumns.has(c.id))
								.map((c) =>
									renderHeader(
										c.id,
										c.label,
										c.isBigInt,
										c.isFees
									)
								)}
						</tr>
					</thead>
					<tbody className='text-[#fbf0df]/90 font-mono'>
						{openStream === 'trove' && (
							<TroveTableBody
								slice={slice as TroveRow[]}
								filteredData={filteredData as TroveRow[]}
								cumulativeFees={troveCumulativeFees}
								decimalPrecision={decimalPrecision}
								explorerTxUrl={explorerTxUrl}
								visibleColumns={visibleColumns}
								changeColumns={changeColumns}
								currentPage={currentPage}
								pageSize={pageSize}
								applyPendingToTrove={options.applyPendingToTrove}
								debtIncludesLiquidationReserve={
									options.debtIncludesLiquidationReserve
								}
							/>
						)}
						{openStream === 'stabilityPool' && (
							<StabilityPoolTableBody
								slice={slice as StabilityPoolRow[]}
								filteredData={
									filteredData as StabilityPoolRow[]
								}
								decimalPrecision={decimalPrecision}
								explorerTxUrl={explorerTxUrl}
								visibleColumns={visibleColumns}
								changeColumns={changeColumns}
								currentPage={currentPage}
								pageSize={pageSize}
								applyPendingToStabilityPool={
									options.applyPendingToStabilityPool
								}
							/>
						)}
						{openStream === 'lqtyStakingPool' && (
							<StakingPoolTableBody
								slice={slice as StakingPoolRow[]}
								filteredData={filteredData as StakingPoolRow[]}
								decimalPrecision={decimalPrecision}
								explorerTxUrl={explorerTxUrl}
								visibleColumns={visibleColumns}
								changeColumns={changeColumns}
								currentPage={currentPage}
								pageSize={pageSize}
							/>
						)}
					</tbody>
				</table>
				</div>
			</div>
		</div>
	);
}
