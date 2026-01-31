import { useState, useEffect, useCallback, type FormEvent } from 'react';
import {
	clearCachedState,
	clearCachedStateForBaseKey,
	listCacheKeyPathsForDisplay,
	type DisplayCacheEntry,
	type ListCacheEntriesFilter
} from './backend/state/cache.js';
import {
	protocolNames,
	type ProtocolName
} from './backend/protocols/protocols.js';

type CacheManagerProps = {
	protocol: ProtocolName;
	onProtocolChange: (protocol: ProtocolName) => void;
	refreshTrigger: number;
};

export function CacheManager({
	protocol,
	onProtocolChange,
	refreshTrigger
}: CacheManagerProps) {
	const [baseKeyFilter, setBaseKeyFilter] = useState('');
	const [entries, setEntries] = useState<DisplayCacheEntry[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [deleteAddress, setDeleteAddress] = useState('');
	const [deleteGlobalConfirm, setDeleteGlobalConfirm] = useState(false);
	const [deleteProtocolConfirm, setDeleteProtocolConfirm] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const loadEntries = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const filter: ListCacheEntriesFilter = { protocol };
			if (baseKeyFilter.trim()) filter.baseKey = baseKeyFilter.trim();
			const list = await listCacheKeyPathsForDisplay(filter);
			setEntries(list);
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setError(`Failed to load cache list: ${msg}`);
		} finally {
			setLoading(false);
		}
	}, [protocol, baseKeyFilter]);

	useEffect(() => {
		loadEntries();
	}, [loadEntries, refreshTrigger]);

	const handleDeleteForAddress = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const address = deleteAddress.trim();
		if (!address) {
			setError('Enter an address');
			return;
		}
		setDeleting(true);
		setError(null);
		setSuccess(null);
		try {
			await clearCachedStateForBaseKey(protocol, address);
			setSuccess(`Cleared cache for address ${address}`);
			setDeleteAddress('');
			await loadEntries();
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setError(msg);
		} finally {
			setDeleting(false);
		}
	};

	const handleDeleteGlobal = async () => {
		if (!deleteGlobalConfirm) return;
		setDeleting(true);
		setError(null);
		setSuccess(null);
		try {
			await clearCachedStateForBaseKey(protocol, 'global');
			setSuccess(`Cleared global cache for protocol ${protocol}`);
			setDeleteGlobalConfirm(false);
			await loadEntries();
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setError(msg);
		} finally {
			setDeleting(false);
		}
	};

	const handleDeleteProtocol = async () => {
		if (!deleteProtocolConfirm) return;
		setDeleting(true);
		setError(null);
		setSuccess(null);
		try {
			await clearCachedState(protocol);
			setSuccess(`Cleared all cache for protocol ${protocol}`);
			setDeleteProtocolConfirm(false);
			await loadEntries();
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setError(msg);
		} finally {
			setDeleting(false);
		}
	};

	function keyPathDisplay(entry: DisplayCacheEntry): string {
		const parts = [entry.baseKey, ...entry.keyPath];
		return parts.join('.');
	}

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-2'>
				<label
					htmlFor='cache-protocol'
					className='text-[#fbf0df] font-semibold'
				>
					Protocol
				</label>
				<select
					id='cache-protocol'
					value={protocol}
					onChange={(e) =>
						onProtocolChange(e.target.value as ProtocolName)
					}
					className='bg-[#fbf0df] text-[#1a1a1a] py-2 px-3 rounded-lg font-mono cursor-pointer'
					disabled={loading || deleting}
				>
					{protocolNames.map((name) => (
						<option
							key={name}
							value={name}
						>
							{name}
						</option>
					))}
				</select>
			</div>
			<div className='flex flex-col gap-2'>
				<label
					htmlFor='cache-basekey'
					className='text-[#fbf0df] font-semibold'
				>
					Base key filter (optional)
				</label>
				<input
					id='cache-basekey'
					type='text'
					value={baseKeyFilter}
					onChange={(e) => setBaseKeyFilter(e.target.value)}
					placeholder='e.g. global or 0x...'
					className='bg-[#fbf0df] text-[#1a1a1a] py-2 px-3 rounded-lg font-mono placeholder:text-[#1a1a1a]/50'
					disabled={loading || deleting}
				/>
			</div>
			<button
				type='button'
				onClick={loadEntries}
				disabled={loading || deleting}
				className='bg-[#3a3a3a] text-[#fbf0df] border-2 border-[#4a4a4a] px-4 py-2 rounded-lg font-semibold w-fit disabled:opacity-50'
			>
				{loading ? 'Loading...' : 'Refresh list'}
			</button>

			{error && (
				<div className='bg-red-900/30 border-2 border-red-500 rounded-xl p-4 text-red-200'>
					{error}
				</div>
			)}
			{success && (
				<div className='bg-green-900/30 border-2 border-green-500 rounded-xl p-4 text-green-200'>
					{success}
				</div>
			)}

			{entries !== null && (
				<div className='rounded-lg border border-[#3a3a3a] overflow-hidden'>
					<p className='text-[#fbf0df] font-semibold p-2 bg-[#2a2a2a]'>
						Cache key paths ({entries.length})
					</p>
					<ul className='divide-y divide-[#3a3a3a] max-h-96 overflow-y-auto'>
						{entries.map((entry, i) => (
							<li
								key={i}
								className='flex items-center justify-between gap-4 p-2 text-[#fbf0df]/90 font-mono text-sm hover:bg-[#2a2a2a]'
							>
								<span className='break-all'>
									{keyPathDisplay(entry)}
								</span>
								<span className='text-[#fbf0df]/70 shrink-0'>
									{entry.isArray
										? `array (${entry.length ?? 0})`
										: 'exists'}
								</span>
							</li>
						))}
						{entries.length === 0 && (
							<li className='p-4 text-[#fbf0df]/60'>
								No cache entries
							</li>
						)}
					</ul>
				</div>
			)}

			<div className='flex flex-col gap-4 mt-4'>
				<h3 className='text-xl font-bold text-[#fbf0df]'>
					Delete cache
				</h3>

				<form
					onSubmit={handleDeleteForAddress}
					className='flex flex-wrap items-end gap-2'
				>
					<div className='flex flex-col gap-1'>
						<label
							htmlFor='delete-address'
							className='text-[#fbf0df] text-sm'
						>
							Delete for address
						</label>
						<input
							id='delete-address'
							type='text'
							value={deleteAddress}
							onChange={(e) => setDeleteAddress(e.target.value)}
							placeholder='0x...'
							className='bg-[#fbf0df] text-[#1a1a1a] py-2 px-3 rounded-lg font-mono w-64'
							disabled={deleting}
						/>
					</div>
					<button
						type='submit'
						disabled={deleting || !deleteAddress.trim()}
						className='bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50'
					>
						{deleting ? 'Deleting...' : 'Delete for address'}
					</button>
				</form>

				<div className='flex flex-wrap items-center gap-2'>
					<button
						type='button'
						onClick={() => setDeleteGlobalConfirm(true)}
						disabled={deleting}
						className='bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50'
					>
						Delete global
					</button>
					{deleteGlobalConfirm && (
						<>
							<span className='text-[#fbf0df]/80'>Confirm?</span>
							<button
								type='button'
								onClick={handleDeleteGlobal}
								disabled={deleting}
								className='bg-red-600 text-white px-3 py-1 rounded font-medium'
							>
								Yes
							</button>
							<button
								type='button'
								onClick={() => setDeleteGlobalConfirm(false)}
								className='bg-[#3a3a3a] text-[#fbf0df] px-3 py-1 rounded'
							>
								Cancel
							</button>
						</>
					)}
				</div>

				<div className='flex flex-wrap items-center gap-2'>
					<button
						type='button'
						onClick={() => setDeleteProtocolConfirm(true)}
						disabled={deleting}
						className='bg-red-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50'
					>
						Delete whole protocol
					</button>
					{deleteProtocolConfirm && (
						<>
							<span className='text-[#fbf0df]/80'>Confirm?</span>
							<button
								type='button'
								onClick={handleDeleteProtocol}
								disabled={deleting}
								className='bg-red-700 text-white px-3 py-1 rounded font-medium'
							>
								Yes
							</button>
							<button
								type='button'
								onClick={() => setDeleteProtocolConfirm(false)}
								className='bg-[#3a3a3a] text-[#fbf0df] px-3 py-1 rounded'
							>
								Cancel
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
