import { useState } from 'react';

export type CacheGroupRow = {
	endpoint: string;
	count: number;
};

type Props = {
	label: string;
	rows: CacheGroupRow[];
};

export function CacheGroup({ label, rows }: Props) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className='rounded-lg border border-[#3a3a3a] overflow-hidden'>
			<button
				type='button'
				onClick={() => setExpanded((e) => !e)}
				className='w-full flex items-center gap-2 px-3 py-2 text-left bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a] font-medium'
				aria-expanded={expanded}
			>
				<span
					className='text-[#fbf0df]/70 shrink-0'
					aria-hidden
				>
					{expanded ? '▼' : '▶'}
				</span>
				<span
					className='font-mono truncate'
					title={label}
				>
					{label}
				</span>
			</button>
			{expanded && (
				<div className='border-t border-[#3a3a3a] bg-[#1a1a1a]'>
					{rows.length > 0 ? (
						<div className='overflow-x-auto'>
							<table className='w-full text-sm text-left'>
								<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
									<tr>
										<th className='p-2 font-medium'>
											Keypath
										</th>
										<th className='p-2 font-medium'>
											Entries
										</th>
									</tr>
								</thead>
								<tbody className='text-[#fbf0df]/90 font-mono'>
									{rows.map(({ endpoint, count }) => (
										<tr
											key={endpoint}
											className='border-t border-[#3a3a3a]'
										>
											<td className='p-2'>{endpoint}</td>
											<td className='p-2'>
												{count.toLocaleString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className='px-3 py-4 text-[#fbf0df]/70 text-sm'>
							No array entries
						</div>
					)}
				</div>
			)}
		</div>
	);
}
