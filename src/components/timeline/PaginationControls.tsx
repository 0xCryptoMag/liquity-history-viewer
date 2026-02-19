import { useState } from 'react';

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

type Props = {
	page: number;
	setPage: (n: number | ((p: number) => number)) => void;
	pageSize: PageSize;
	setPageSize: (n: PageSize) => void;
	totalPages: number;
};

export function PaginationControls({
	page,
	setPage,
	pageSize,
	setPageSize,
	totalPages
}: Props) {
	const currentPage = Math.min(page, Math.max(1, totalPages));
	const [goToInput, setGoToInput] = useState('');
	const [goToFocused, setGoToFocused] = useState(false);

	const handleGoToPage = () => {
		const n = parseInt(goToInput, 10);
		if (!Number.isNaN(n)) {
			setPage(Math.max(1, Math.min(totalPages, n)));
			setGoToInput('');
		}
	};

	return (
		<div className='flex flex-wrap items-center gap-4'>
			<span className='text-[#fbf0df]/80 text-sm'>Per page:</span>
			{PAGE_SIZE_OPTIONS.map((n) => (
				<button
					key={n}
					type='button'
					onClick={() => {
						setPageSize(n);
						setPage(1);
					}}
					className={`px-2 py-1 rounded text-sm font-medium ${
						pageSize === n
							? 'bg-[#fbf0df] text-[#1a1a1a]'
							: 'bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a]'
					}`}
				>
					{n}
				</button>
			))}
			<span className='text-[#fbf0df]/80 text-sm'>
				Page {currentPage} of {totalPages}
			</span>
			<button
				type='button'
				onClick={() => setPage((p) => Math.max(1, p - 1))}
				disabled={currentPage <= 1}
				className='px-2 py-1 rounded text-sm font-medium bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed'
			>
				Prev
			</button>
			<button
				type='button'
				onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
				disabled={currentPage >= totalPages}
				className='px-2 py-1 rounded text-sm font-medium bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed'
			>
				Next
			</button>
			<span className='text-[#fbf0df]/80 text-sm'>Go to page:</span>
			<input
				type='number'
				min={1}
				max={totalPages}
				value={goToInput}
				onChange={(e) => setGoToInput(e.target.value)}
				onFocus={() => setGoToFocused(true)}
				onBlur={() => setGoToFocused(false)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleGoToPage();
				}}
				placeholder={goToFocused ? '' : String(currentPage)}
				className='w-16 bg-[#2a2a2a] text-[#fbf0df] border border-[#3a3a3a] rounded px-2 py-1 text-sm font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
				aria-label='Page number'
			/>
			<button
				type='button'
				onClick={handleGoToPage}
				className='px-2 py-1 rounded text-sm font-medium bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a]'
			>
				Go
			</button>
		</div>
	);
}
