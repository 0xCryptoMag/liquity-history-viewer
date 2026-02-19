import { useState, useCallback } from 'react';
import type { ProtocolName } from '../../liquity/protocols/protocols';
import {
	getCacheEntriesSummary,
	listCacheGroups
} from '../../liquity/state/cache';
import { CacheGroup, type CacheGroupRow } from './CacheGroup';
import { ProtocolSelect } from '../protocol/ProtocolSelect';

type GroupData = {
	label: string;
	rows: CacheGroupRow[];
};

function toGroupRows(
	entries: { keyPath: string[]; length?: number }[]
): CacheGroupRow[] {
	return entries
		.map((e) => ({
			endpoint: e.keyPath[e.keyPath.length - 1] ?? '',
			count: e.length ?? 0
		}))
		.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}

export function CacheViewer() {
	const [protocol, setProtocol] = useState<ProtocolName>('liquity');
	const [address, setAddress] = useState('');
	const [groups, setGroups] = useState<GroupData[]>([]);
	const [loading, setLoading] = useState(false);

	const loadGroups = useCallback(async () => {
		setLoading(true);
		try {
			const summary = await getCacheEntriesSummary();
			const forProtocol = summary.filter((s) => s.protocol === protocol);
			const baseKeyFilter = address.trim();
			const uniqueBaseKeys =
				baseKeyFilter === ''
					? [...new Set(forProtocol.map((s) => s.baseKey))]
					: forProtocol
							.filter((s) => s.baseKey === baseKeyFilter)
							.map((s) => s.baseKey)
							.filter((bk, i, arr) => arr.indexOf(bk) === i);

			const groupData: GroupData[] = [];
			for (const baseKey of uniqueBaseKeys) {
				const entries = await listCacheGroups({ protocol, baseKey });
				groupData.push({
					label: baseKey === 'global' ? 'Global' : baseKey,
					rows: toGroupRows(entries)
				});
			}
			groupData.sort((a, b) => a.label.localeCompare(b.label));
			setGroups(groupData);
		} finally {
			setLoading(false);
		}
	}, [protocol, address]);

	const handleSubmit = useCallback(() => {
		loadGroups();
	}, [loadGroups]);

	return (
		<div className='flex flex-col gap-4'>
			<ProtocolSelect
				protocol={protocol}
				onProtocolChange={setProtocol}
				address={address}
				onAddressChange={setAddress}
				actions={
					<button
						type='button'
						onClick={handleSubmit}
						disabled={loading}
						className='bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded font-mono text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{loading ? 'Loading...' : 'Retrieve'}
					</button>
				}
			/>

			<div className='flex flex-col gap-2'>
				<h2 className='text-[#fbf0df] font-semibold text-lg'>
					Cache Groups: {groups.length}
				</h2>
				<div className='flex flex-col gap-2'>
					{groups.map((g) => (
						<CacheGroup
							key={g.label}
							label={g.label}
							rows={g.rows}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
