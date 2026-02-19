import { PopOver } from '../ui/PopOver';
import { ColumnVisibility } from './ColumnVisibility';
import { Filters } from './Filters';
import { OptionsSelect, type TimelineOptions } from './OptionsSelect';
import type { FilterOperation } from './Filters';

export type StreamOption = {
	id: string;
	title: string;
	count: number;
};

type TableTitleBarProps = {
	// Options (☰)
	options: TimelineOptions;
	onOptionsApply: (opts: TimelineOptions) => void;
	optionsPopoverOpen: boolean;
	onOptionsPopoverOpenChange: (open: boolean) => void;

	// Stream dropdown
	streams: StreamOption[];
	currentStreamId: string;
	currentStreamTitle: string;
	currentStreamCount: number;
	streamDropdownOpen: boolean;
	onStreamDropdownOpenChange: (open: boolean) => void;
	onStreamSelect: (streamId: string) => void;

	// Column visibility (👁)
	allColumnIds: string[];
	visibleColumns: Set<string>;
	onVisibleColumnsChange: (cols: Set<string>) => void;
	columnLabels: Record<string, string>;
	columnsPopoverOpen: boolean;
	onColumnsPopoverOpenChange: (open: boolean) => void;

	// Filters (🔍)
	operations: FilterOperation[];
	fromDate: string;
	toDate: string;
	enabledOperationIds: Set<string>;
	onFromDateChange: (value: string) => void;
	onToDateChange: (value: string) => void;
	onEnabledOperationIdsChange: (ids: Set<string>) => void;
	filterPopoverOpen: boolean;
	onFilterPopoverOpenChange: (open: boolean) => void;
};

export function TableTitleBar({
	options,
	onOptionsApply,
	optionsPopoverOpen,
	onOptionsPopoverOpenChange,
	streams,
	currentStreamId,
	currentStreamTitle,
	currentStreamCount,
	streamDropdownOpen,
	onStreamDropdownOpenChange,
	onStreamSelect,
	allColumnIds,
	visibleColumns,
	onVisibleColumnsChange,
	columnLabels,
	columnsPopoverOpen,
	onColumnsPopoverOpenChange,
	operations,
	fromDate,
	toDate,
	enabledOperationIds,
	onFromDateChange,
	onToDateChange,
	onEnabledOperationIdsChange,
	filterPopoverOpen,
	onFilterPopoverOpenChange
}: TableTitleBarProps) {
	return (
		<div className='w-full flex items-center justify-between gap-2 px-3 py-2 bg-[#2a2a2a] border-b border-[#3a3a3a]'>
			<div className='flex items-center justify-start flex-1 min-w-0'>
				<PopOver
					open={optionsPopoverOpen}
					onOpenChange={onOptionsPopoverOpenChange}
					trigger={
						<button
							type='button'
							className='p-2 rounded text-[#fbf0df] hover:bg-[#3a3a3a]'
							aria-label='Options'
						>
							☰
						</button>
					}
					placement='bottom-start'
				>
					<OptionsSelect
						initialOptions={options}
						onApply={(opts) => {
							onOptionsApply(opts);
							onOptionsPopoverOpenChange(false);
						}}
					/>
				</PopOver>
			</div>

			<div className='flex items-center justify-center shrink-0'>
				<div className='relative'>
					<button
						type='button'
						onClick={() => onStreamDropdownOpenChange(!streamDropdownOpen)}
						className='px-3 py-1.5 rounded font-medium bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a] flex items-center gap-1'
					>
						{currentStreamTitle} ({currentStreamCount})
						<span className='text-xs'>
							{streamDropdownOpen ? '▲' : '▼'}
						</span>
					</button>
					{streamDropdownOpen && (
						<>
							<div
								className='fixed inset-0 z-40'
								aria-hidden
								onClick={() => onStreamDropdownOpenChange(false)}
							/>
							<div className='absolute top-full left-0 mt-1 z-50 rounded border border-[#3a3a3a] bg-[#2a2a2a] py-1 min-w-40'>
								{streams.map((s) => (
									<button
										key={s.id}
										type='button'
										onClick={() => {
											onStreamSelect(s.id);
											onStreamDropdownOpenChange(false);
										}}
										className={`w-full text-left px-3 py-1.5 text-sm ${
											currentStreamId === s.id
												? 'bg-[#fbf0df] text-[#1a1a1a]'
												: 'text-[#fbf0df] hover:bg-[#3a3a3a]'
										}`}
									>
										{s.title} ({s.count})
									</button>
								))}
							</div>
						</>
					)}
				</div>
			</div>

			<div className='flex items-center justify-end gap-2 flex-1 min-w-0'>
				<PopOver
					open={columnsPopoverOpen}
					onOpenChange={onColumnsPopoverOpenChange}
					trigger={
						<button
							type='button'
							className='p-2 rounded text-[#fbf0df] hover:bg-[#3a3a3a]'
							aria-label='Column visibility'
						>
							👁
						</button>
					}
					placement='bottom-end'
				>
					<ColumnVisibility
						columns={allColumnIds}
						visibleColumns={visibleColumns}
						onVisibleColumnsChange={onVisibleColumnsChange}
						columnLabels={columnLabels}
					/>
				</PopOver>

				<PopOver
					open={filterPopoverOpen}
					onOpenChange={onFilterPopoverOpenChange}
					trigger={
						<button
							type='button'
							className='p-2 rounded text-[#fbf0df] hover:bg-[#3a3a3a]'
							aria-label='Filters'
						>
							🔍
						</button>
					}
					placement='bottom-end'
				>
					<Filters
						operations={operations}
						fromDate={fromDate}
						toDate={toDate}
						enabledOperationIds={enabledOperationIds}
						onFromDateChange={onFromDateChange}
						onToDateChange={onToDateChange}
						onEnabledOperationIdsChange={onEnabledOperationIdsChange}
					/>
				</PopOver>
			</div>
		</div>
	);
}
