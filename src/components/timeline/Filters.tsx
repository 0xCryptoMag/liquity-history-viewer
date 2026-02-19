import { Toggle } from '../ui/Toggle';

export type FilterOperation = {
	id: string;
	label: string;
};

type Props = {
	operations: FilterOperation[];
	fromDate: string;
	toDate: string;
	enabledOperationIds: Set<string>;
	onFromDateChange: (value: string) => void;
	onToDateChange: (value: string) => void;
	onEnabledOperationIdsChange: (ids: Set<string>) => void;
	className?: string;
};

const inputClass =
	'bg-[#2a2a2a] text-[#fbf0df] border border-[#3a3a3a] rounded px-2 py-1.5 text-sm font-mono';

export function Filters({
	operations,
	fromDate,
	toDate,
	enabledOperationIds,
	onFromDateChange,
	onToDateChange,
	onEnabledOperationIdsChange,
	className = ''
}: Props) {
	const toggleOperation = (id: string, checked: boolean) => {
		const next = new Set(enabledOperationIds);
		if (checked) {
			next.add(id);
		} else {
			next.delete(id);
		}
		onEnabledOperationIdsChange(next);
	};

	return (
		<div
			className={`flex flex-col gap-4 ${className}`.trim()}
			role='group'
			aria-label='Timeline filters'
		>
			<div className='flex flex-wrap items-center gap-4'>
				<label className='text-[#fbf0df]/80 text-sm shrink-0'>
					From
					<input
						type='date'
						value={fromDate}
						onChange={(e) => onFromDateChange(e.target.value)}
						className={`${inputClass} ml-2`}
						aria-label='Filter from date'
					/>
				</label>
				<label className='text-[#fbf0df]/80 text-sm shrink-0'>
					To
					<input
						type='date'
						value={toDate}
						onChange={(e) => onToDateChange(e.target.value)}
						className={`${inputClass} ml-2`}
						aria-label='Filter to date'
					/>
				</label>
			</div>
			<div className='flex flex-wrap items-center gap-x-6 gap-y-2'>
				<span className='text-[#fbf0df]/80 text-sm w-full sm:w-auto'>
					Operations
				</span>
				{operations.map((op) => (
					<Toggle
						key={op.id}
						id={`filter-op-${op.id}`}
						label={op.label}
						checked={enabledOperationIds.has(op.id)}
						onChange={(checked) => toggleOperation(op.id, checked)}
						className='text-[#fbf0df]/90'
					/>
				))}
			</div>
		</div>
	);
}
