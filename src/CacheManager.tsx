import { useState, useEffect, useCallback, type FormEvent } from 'react';
import {
	clearCachedState,
	clearCachedStateForBaseKey,
	getCachedArrayLength,
	getCachedArrayRange,
	getCachedState,
	getCacheEntriesSummary,
	listCacheEntries,
	type CacheEntrySummary,
	type CacheEntryRow
} from './backend/state/cache.js';
import {
	protocolNames,
	type ProtocolName
} from './backend/protocols/protocols.js';

export function CacheManager() {
	const [protocol, setProtocol] = useState<ProtocolName>('liquity');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [cacheInfo, setCacheInfo] = useState<{
		globalP: number;
		globalS: number;
		globalG: number;
	} | null>(null);
	const [checkingCache, setCheckingCache] = useState(false);
	const [userAddressToClear, setUserAddressToClear] = useState('');
	const [clearingUser, setClearingUser] = useState(false);

	const [entriesSummary, setEntriesSummary] = useState<
		CacheEntrySummary[] | null
	>(null);
	const [entriesList, setEntriesList] = useState<CacheEntryRow[] | null>(
		null
	);
	const [loadingEntries, setLoadingEntries] = useState(false);
	const [entriesFilterBaseKey, setEntriesFilterBaseKey] = useState('');

	/** Group key path -> { index input string, last fetched value } for "Get value at index" */
	type PathGroup = {
		protocol: string;
		baseKey: string;
		path: string[];
		pathDisplay: string;
		count: number;
		isArray: boolean;
		groupKey: string;
	};
	const [entryIndexInputs, setEntryIndexInputs] = useState<
		Record<string, string>
	>({});
	const [fetchedValues, setFetchedValues] = useState<
		Record<string, { index: number; value: unknown }>
	>({});
	const [fetchingGroupKey, setFetchingGroupKey] = useState<string | null>(
		null
	);

	const checkCache = useCallback(async () => {
		setCheckingCache(true);
		setError(null);
		try {
			const [globalP, globalS, globalG] = await Promise.all([
				getCachedArrayLength(protocol, ['global', 'globalP']),
				getCachedArrayLength(protocol, ['global', 'globalS']),
				getCachedArrayLength(protocol, ['global', 'globalG'])
			]);
			setCacheInfo({ globalP, globalS, globalG });
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : String(err);
			setError(`Failed to check cache: ${errorMessage}`);
		} finally {
			setCheckingCache(false);
		}
	}, [protocol]);

	useEffect(() => {
		checkCache();
	}, [checkCache]);

	const handleClear = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);
		setCacheInfo(null);

		try {
			await clearCachedState(protocol);
			setSuccess(
				`Successfully cleared all cached state for protocol: ${protocol}`
			);

			// Recheck cache to verify it's empty
			await checkCache();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : String(err);
			console.error('❌ Error clearing cache:', err);
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const loadEntriesSummary = useCallback(async () => {
		setLoadingEntries(true);
		setError(null);
		setEntriesList(null);
		try {
			const summary = await getCacheEntriesSummary();
			setEntriesSummary(summary);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : String(err);
			setError(`Failed to load entries: ${errorMessage}`);
		} finally {
			setLoadingEntries(false);
		}
	}, []);

	const loadEntriesList = useCallback(
		async (filterProtocol?: ProtocolName, filterBaseKey?: string) => {
			setLoadingEntries(true);
			setError(null);
			setFetchedValues({});
			setEntryIndexInputs({});
			try {
				const filter =
					filterProtocol || filterBaseKey
						? {
								...(filterProtocol && {
									protocol: filterProtocol
								}),
								...(filterBaseKey?.trim() && {
									baseKey: filterBaseKey.trim()
								})
						  }
						: undefined;
				const list = await listCacheEntries(filter);
				setEntriesList(list);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : String(err);
				setError(`Failed to load entries: ${errorMessage}`);
			} finally {
				setLoadingEntries(false);
			}
		},
		[]
	);

	function groupEntriesByPath(rows: CacheEntryRow[]): PathGroup[] {
		const map = new Map<
			string,
			{
				protocol: string;
				baseKey: string;
				path: string[];
				count: number;
				isArray: boolean;
			}
		>();
		for (const row of rows) {
			const groupKey = `${row.protocol}\0${row.baseKey}\0${row.pathStr}`;
			const existing = map.get(groupKey);
			if (!existing) {
				map.set(groupKey, {
					protocol: row.protocol,
					baseKey: row.baseKey,
					path: row.path,
					count: 1,
					isArray: row.isArrayItem
				});
			} else {
				existing.count++;
			}
		}
		return Array.from(map.entries()).map(([groupKey, g]) => ({
			...g,
			groupKey,
			pathDisplay:
				g.path.length > 0
					? `${g.baseKey} → ${g.path.join(' → ')}`
					: g.baseKey
		}));
	}

	const pathGroups =
		entriesList !== null ? groupEntriesByPath(entriesList) : [];

	async function handleGetValueAtIndex(group: PathGroup) {
		const raw = entryIndexInputs[group.groupKey] ?? '0';
		const index = Math.floor(Number(raw));
		if (Number.isNaN(index) || index < 0 || index >= group.count) {
			setError(
				`Index must be between 0 and ${group.count - 1} for this path`
			);
			return;
		}
		setFetchingGroupKey(group.groupKey);
		setError(null);
		try {
			const key: string[] = [group.baseKey, ...group.path];
			const value = group.isArray
				? (
						await getCachedArrayRange(
							group.protocol as ProtocolName,
							key,
							index,
							index + 1
						)
				  )[0] ?? null
				: await getCachedState(group.protocol as ProtocolName, key);
			setFetchedValues((prev) => ({
				...prev,
				[group.groupKey]: { index, value }
			}));
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : String(err);
			setError(`Failed to get value: ${errorMessage}`);
		} finally {
			setFetchingGroupKey(null);
		}
	}

	/** Recursively convert { $bigint: "..." } to BigInt so display shows numbers. */
	function deserializeBigIntForDisplay(value: unknown): unknown {
		if (value === null || value === undefined) return value;
		if (
			typeof value === 'object' &&
			value !== null &&
			'$bigint' in value &&
			typeof (value as { $bigint: unknown }).$bigint === 'string'
		) {
			return BigInt((value as { $bigint: string }).$bigint);
		}
		if (Array.isArray(value)) {
			return value.map(deserializeBigIntForDisplay);
		}
		if (typeof value === 'object' && value !== null) {
			return Object.fromEntries(
				Object.entries(value).map(([k, v]) => [
					k,
					deserializeBigIntForDisplay(v)
				])
			);
		}
		return value;
	}

	function stringifyValue(value: unknown): string {
		const deserialized = deserializeBigIntForDisplay(value);
		if (deserialized === null) return 'null';
		if (deserialized === undefined) return 'undefined';
		try {
			return JSON.stringify(
				deserialized,
				(_, v) => (typeof v === 'bigint' ? v.toString() : v),
				2
			);
		} catch {
			return String(deserialized);
		}
	}

	const handleClearUser = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const address = userAddressToClear.trim();
		if (!address) {
			setError('Enter a user address');
			return;
		}
		setClearingUser(true);
		setError(null);
		setSuccess(null);
		try {
			const deleted = await clearCachedStateForBaseKey(protocol, address);
			setSuccess(
				`Cleared ${deleted} cached entries for ${address} (${protocol})`
			);
			await checkCache();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : String(err);
			setError(errorMessage);
		} finally {
			setClearingUser(false);
		}
	};

	return (
		<div className='mt-8 mx-auto w-full max-w-4xl text-left flex flex-col gap-4'>
			<h2 className='text-2xl font-bold mb-4'>Cache Manager</h2>

			<form
				onSubmit={handleClear}
				className='flex flex-col gap-4 bg-[#1a1a1a] p-4 rounded-xl border-2 border-[#fbf0df]'
			>
				<div className='flex flex-col gap-2'>
					<label
						htmlFor='cache-protocol'
						className='text-[#fbf0df] font-semibold'
					>
						Protocol:
					</label>
					<select
						id='cache-protocol'
						value={protocol}
						onChange={(e) =>
							setProtocol(e.target.value as ProtocolName)
						}
						className='bg-[#fbf0df] text-[#1a1a1a] py-2 px-3 rounded-lg font-mono cursor-pointer hover:bg-[#f3d5a3] transition-colors'
						disabled={loading || checkingCache}
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

				{cacheInfo !== null && (
					<div className='bg-[#2a2a2a] p-3 rounded-lg border border-[#3a3a3a]'>
						<p className='text-[#fbf0df] font-semibold mb-2'>
							Cache Status:
						</p>
						<ul className='text-[#fbf0df]/80 text-sm space-y-1 font-mono'>
							<li>globalP: {cacheInfo.globalP} entries</li>
							<li>globalS: {cacheInfo.globalS} entries</li>
							<li>globalG: {cacheInfo.globalG} entries</li>
						</ul>
					</div>
				)}

				<div className='flex gap-2'>
					<button
						type='button'
						onClick={checkCache}
						disabled={loading || checkingCache}
						className='bg-[#3a3a3a] text-[#fbf0df] border-2 border-[#4a4a4a] px-4 py-2 rounded-lg font-semibold transition-all duration-100 hover:bg-[#4a4a4a] hover:border-[#5a5a5a] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{checkingCache ? 'Checking...' : 'Refresh Cache Info'}
					</button>

					<button
						type='submit'
						disabled={loading || checkingCache}
						className='bg-red-600 text-white border-0 px-6 py-2 rounded-lg font-bold transition-all duration-100 hover:bg-red-700 hover:-translate-y-px cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex-1'
					>
						{loading ? 'Clearing...' : 'Clear Cache'}
					</button>
				</div>
			</form>

			{error && (
				<div className='bg-red-900/30 border-2 border-red-500 rounded-xl p-4 text-red-200'>
					<strong>Error:</strong> {error}
				</div>
			)}

			{success && (
				<div className='bg-green-900/30 border-2 border-green-500 rounded-xl p-4 text-green-200'>
					<strong>Success:</strong> {success}
				</div>
			)}

			<form
				onSubmit={handleClearUser}
				className='flex flex-col gap-4 bg-[#1a1a1a] p-4 rounded-xl border-2 border-[#fbf0df] mt-6'
			>
				<h3 className='text-xl font-bold text-[#fbf0df]'>
					Clear user cache
				</h3>
				<p className='text-[#fbf0df]/80 text-sm'>
					Delete all cached entries for a specific user address in the
					selected protocol.
				</p>
				<div className='flex flex-col gap-2'>
					<label
						htmlFor='user-address-clear'
						className='text-[#fbf0df] font-semibold'
					>
						User address:
					</label>
					<input
						id='user-address-clear'
						type='text'
						value={userAddressToClear}
						onChange={(e) => setUserAddressToClear(e.target.value)}
						placeholder='0x...'
						className='bg-[#fbf0df] text-[#1a1a1a] py-2 px-3 rounded-lg font-mono placeholder:text-[#1a1a1a]/50'
						disabled={clearingUser}
					/>
				</div>
				<button
					type='submit'
					disabled={clearingUser || !userAddressToClear.trim()}
					className='bg-amber-600 text-white border-0 px-6 py-2 rounded-lg font-bold transition-all duration-100 hover:bg-amber-700 hover:-translate-y-px cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 w-fit'
				>
					{clearingUser ? 'Clearing...' : 'Clear user cache'}
				</button>
			</form>

			<section className='flex flex-col gap-4 bg-[#1a1a1a] p-4 rounded-xl border-2 border-[#fbf0df] mt-6'>
				<h3 className='text-xl font-bold text-[#fbf0df]'>
					View entries
				</h3>
				<p className='text-[#fbf0df]/80 text-sm'>
					Inspect what is stored in the cache: summary by protocol +
					base key, or a full key list with optional filter.
				</p>
				<div className='flex flex-wrap gap-2 items-end'>
					<button
						type='button'
						onClick={loadEntriesSummary}
						disabled={loadingEntries}
						className='bg-[#3a3a3a] text-[#fbf0df] border-2 border-[#4a4a4a] px-4 py-2 rounded-lg font-semibold hover:bg-[#4a4a4a] cursor-pointer disabled:opacity-50'
					>
						{loadingEntries ? 'Loading...' : 'Load summary'}
					</button>
					<div className='flex flex-wrap gap-2 items-center'>
						<label className='text-[#fbf0df] text-sm'>
							Protocol:
						</label>
						<select
							value={protocol}
							onChange={(e) =>
								setProtocol(e.target.value as ProtocolName)
							}
							className='bg-[#2a2a2a] text-[#fbf0df] py-1.5 px-2 rounded border border-[#4a4a4a] font-mono text-sm'
							disabled={loadingEntries}
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
						<label className='text-[#fbf0df] text-sm'>
							Base key (optional):
						</label>
						<input
							type='text'
							value={entriesFilterBaseKey}
							onChange={(e) =>
								setEntriesFilterBaseKey(e.target.value)
							}
							placeholder='e.g. global or 0x...'
							className='bg-[#2a2a2a] text-[#fbf0df] py-1.5 px-2 rounded border border-[#4a4a4a] font-mono text-sm w-48'
							disabled={loadingEntries}
						/>
						<button
							type='button'
							onClick={() =>
								loadEntriesList(
									protocol,
									entriesFilterBaseKey.trim() || undefined
								)
							}
							disabled={loadingEntries}
							className='bg-[#3a3a3a] text-[#fbf0df] border-2 border-[#4a4a4a] px-4 py-2 rounded-lg font-semibold hover:bg-[#4a4a4a] cursor-pointer disabled:opacity-50'
						>
							{loadingEntries ? 'Loading...' : 'Load key list'}
						</button>
					</div>
				</div>

				{entriesSummary !== null && (
					<div className='overflow-x-auto'>
						<p className='text-[#fbf0df] font-semibold mb-2'>
							Summary ({entriesSummary.length} groups)
						</p>
						<table className='w-full text-left text-sm border border-[#3a3a3a] rounded-lg overflow-hidden'>
							<thead>
								<tr className='bg-[#2a2a2a] text-[#fbf0df]'>
									<th className='p-2 font-semibold'>
										Protocol
									</th>
									<th className='p-2 font-semibold'>
										Base key
									</th>
									<th className='p-2 font-semibold'>
										Entries
									</th>
									<th className='p-2 font-semibold w-24'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='text-[#fbf0df]/90 font-mono'>
								{entriesSummary.map((row) => (
									<tr
										key={`${row.protocol}\0${row.baseKey}`}
										className='border-t border-[#3a3a3a] hover:bg-[#2a2a2a]'
									>
										<td className='p-2'>{row.protocol}</td>
										<td className='p-2 break-all max-w-xs'>
											{row.baseKey}
										</td>
										<td className='p-2'>
											{row.entryCount}
										</td>
										<td className='p-2'>
											<button
												type='button'
												onClick={() =>
													loadEntriesList(
														row.protocol as ProtocolName,
														row.baseKey
													)
												}
												disabled={loadingEntries}
												className='text-amber-400 hover:underline text-xs disabled:opacity-50'
											>
												Show keys
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{pathGroups.length > 0 && (
					<div className='overflow-x-auto'>
						<p className='text-[#fbf0df] font-semibold mb-2'>
							Key paths ({pathGroups.length} paths,{' '}
							{entriesList?.length ?? 0} total entries)
						</p>
						<table className='w-full text-left text-sm border border-[#3a3a3a] rounded-lg overflow-hidden'>
							<thead>
								<tr className='bg-[#2a2a2a] text-[#fbf0df]'>
									<th className='p-2 font-semibold'>
										Key path
									</th>
									<th className='p-2 font-semibold w-20'>
										Entries
									</th>
									<th className='p-2 font-semibold'>
										Index (0 to count−1)
									</th>
									<th className='p-2 font-semibold w-24'>
										Get value
									</th>
									<th className='p-2 font-semibold'>Value</th>
								</tr>
							</thead>
							<tbody className='text-[#fbf0df]/90 font-mono'>
								{pathGroups.map((group) => {
									const fetched =
										fetchedValues[group.groupKey];
									const indexStr =
										entryIndexInputs[group.groupKey] ?? '0';
									const isFetching =
										fetchingGroupKey === group.groupKey;
									return (
										<tr
											key={group.groupKey}
											className='border-t border-[#3a3a3a] hover:bg-[#2a2a2a] align-top'
										>
											<td className='p-2 break-all max-w-xs'>
												{group.pathDisplay}
											</td>
											<td className='p-2'>
												{group.count}
											</td>
											<td className='p-2'>
												{group.isArray &&
												group.count > 1 ? (
													<input
														type='number'
														min={0}
														max={group.count - 1}
														value={indexStr}
														onChange={(e) =>
															setEntryIndexInputs(
																(prev) => ({
																	...prev,
																	[group.groupKey]:
																		e.target
																			.value
																})
															)
														}
														className='w-20 bg-[#2a2a2a] text-[#fbf0df] py-1 px-2 rounded border border-[#4a4a4a]'
														disabled={isFetching}
													/>
												) : (
													<span className='text-[#fbf0df]/60'>
														—
													</span>
												)}
											</td>
											<td className='p-2'>
												<button
													type='button'
													onClick={() =>
														handleGetValueAtIndex(
															group
														)
													}
													disabled={isFetching}
													className='bg-[#3a3a3a] text-[#fbf0df] border border-[#4a4a4a] px-2 py-1 rounded text-xs hover:bg-[#4a4a4a] disabled:opacity-50'
												>
													{isFetching
														? '…'
														: 'Get value'}
												</button>
											</td>
											<td className='p-2 max-w-md'>
												{fetched !== undefined ? (
													<pre className='text-xs bg-[#1a1a1a] p-2 rounded overflow-x-auto whitespace-pre-wrap break-all border border-[#3a3a3a]'>
														{stringifyValue(
															fetched.value
														)}
													</pre>
												) : (
													<span className='text-[#fbf0df]/50'>
														—
													</span>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</div>
	);
}
