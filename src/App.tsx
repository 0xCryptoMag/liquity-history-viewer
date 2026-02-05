import { useState, useCallback, type FormEvent } from 'react';
import { isAddress } from 'viem';
import { constructTimeline } from './backend/state/timeline.js';
import type {
	Timeline,
	TimelineOptions as TimelineOptionsType
} from './backend/state/timeline.js';
import {
	protocolNames,
	protocols,
	type ProtocolName
} from './backend/protocols/protocols.js';
import { CacheManager } from './CacheManager';
import './index.css';

function formatBigInt(value: bigint, precision: bigint): string {
	const negative = value < 0n;
	const absValue = negative ? -value : value;
	const intPart = absValue / precision;
	const fracPart = absValue % precision;
	if (fracPart === 0n) {
		const str = intPart.toString();
		return negative ? `-${str}` : str;
	}
	const decimals = precision.toString().length - 1;
	const fracStr = fracPart
		.toString()
		.padStart(decimals, '0')
		.replace(/0+$/, '');
	const result = `${intPart}.${fracStr}`;
	return negative ? `-${result}` : result;
}

function formatTimestamp(timestamp: bigint): string {
	const d = new Date(Number(timestamp) * 1000);
	const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
	const day = d.getUTCDate().toString().padStart(2, '0');
	const year = d.getUTCFullYear();
	const hour = d.getUTCHours();
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const hour12 = hour % 12 || 12;
	const h = hour12.toString().padStart(2, '0');
	const min = d.getUTCMinutes().toString().padStart(2, '0');
	const sec = d.getUTCSeconds().toString().padStart(2, '0');
	return `${month} ${day}, ${year} ${h}:${min}:${sec} ${ampm} UTC`;
}

function serializeTimelineToJson(timeline: Timeline): string {
	return JSON.stringify(
		{
			trove: timeline.trove.map((e) => ({
				...e,
				coll: e.coll.toString(),
				debt: e.debt.toString(),
				stake: e.stake.toString(),
				collPending: e.collPending.toString(),
				debtPending: e.debtPending.toString(),
				blockNumber: e.blockNumber.toString(),
				timestamp: e.timestamp.toString()
			})),
			stabilityPool: timeline.stabilityPool.map((e) => ({
				...e,
				deposit: e.deposit.toString(),
				pendingEthGain: e.pendingEthGain.toString(),
				pendingLusdLoss: e.pendingLusdLoss.toString(),
				pendingLqtyReward: e.pendingLqtyReward.toString(),
				blockNumber: e.blockNumber.toString(),
				timestamp: e.timestamp.toString()
			})),
			lqtyStakingPool: timeline.lqtyStakingPool.map((e) => ({
				...e,
				stake: e.stake.toString(),
				pendingEthGain: e.pendingEthGain.toString(),
				pendingLusdGain: e.pendingLusdGain.toString(),
				blockNumber: e.blockNumber.toString(),
				timestamp: e.timestamp.toString()
			})),
			collateralSurplusPool: timeline.collateralSurplusPool.map((e) => ({
				...e,
				surplus: e.surplus.toString(),
				blockNumber: e.blockNumber.toString(),
				timestamp: e.timestamp.toString()
			}))
		},
		null,
		2
	);
}

function downloadTimelineJson(timeline: Timeline) {
	const blob = new Blob([serializeTimelineToJson(timeline)], {
		type: 'application/json'
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'timeline.json';
	a.click();
	URL.revokeObjectURL(url);
}

const defaultOptions: Required<TimelineOptionsType> = {
	applyPendingTroveFromEmptyPoolLiquidation: true,
	applyPendingLqtyFrom3rdPartyStabilityPool: false,
	applyPendingStabilityPoolFromLiquidation: true,
	applyPendingEthGainFromRedemption: false,
	applyPendingLusdGainFromDepositFee: false
};

export function App() {
	const [section, setSection] = useState<'timeline' | 'cache'>('timeline');
	const [refreshCacheKey, setRefreshCacheKey] = useState(0);
	const [protocol, setProtocol] = useState<ProtocolName>('liquity');
	const [userAddress, setUserAddress] = useState('');
	const [options, setOptions] =
		useState<Required<TimelineOptionsType>>(defaultOptions);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState<string | null>(null);
	const [timeline, setTimeline] = useState<Timeline | null>(null);
	const [decimalPrecision, setDecimalPrecision] = useState<bigint | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);

	const refreshCacheList = useCallback(() => {
		setRefreshCacheKey((k) => k + 1);
	}, []);

	const handleLoadTimeline = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const address = userAddress.trim();
		if (!isAddress(address)) {
			setError(
				'Invalid address. Please enter a valid Ethereum address (0x followed by 40 hex characters).'
			);
			return;
		}
		setLoading(true);
		setError(null);
		setTimeline(null);
		setDecimalPrecision(null);
		setProgress(null);
		try {
			const result = await constructTimeline(
				protocol,
				address as `0x${string}`,
				options,
				(msg) => setProgress(msg)
			);
			setTimeline(result.timeline);
			setDecimalPrecision(result.decimalPrecision);
			setProgress(null);
			refreshCacheList();
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			setError(progress ? `Failed during ${progress}: ${msg}` : msg);
		} finally {
			setProgress(null);
			setLoading(false);
		}
	};

	return (
		<div className='w-full max-w-[1920px] mx-auto px-3 py-4 text-left relative z-10'>
			<h1 className='text-3xl font-bold mb-6'>Liquity History Viewer</h1>

			<div className='flex gap-2 mb-6 border-b border-[#3a3a3a]'>
				<button
					type='button'
					onClick={() => setSection('timeline')}
					className={`px-4 py-2 font-semibold rounded-t transition-colors ${
						section === 'timeline'
							? 'bg-[#fbf0df] text-[#1a1a1a]'
							: 'bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a]'
					}`}
				>
					Timeline
				</button>
				<button
					type='button'
					onClick={() => setSection('cache')}
					className={`px-4 py-2 font-semibold rounded-t transition-colors ${
						section === 'cache'
							? 'bg-[#fbf0df] text-[#1a1a1a]'
							: 'bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a]'
					}`}
				>
					Cache
				</button>
			</div>

			{section === 'timeline' && (
				<div className='flex flex-col gap-6'>
					<form
						onSubmit={handleLoadTimeline}
						className='flex flex-col gap-4 bg-[#1a1a1a] p-4 rounded-xl border-2 border-[#fbf0df]'
					>
						<div className='flex flex-col gap-2'>
							<label
								htmlFor='protocol'
								className='text-[#fbf0df] font-semibold'
							>
								Protocol
							</label>
							<select
								id='protocol'
								value={protocol}
								onChange={(e) =>
									setProtocol(e.target.value as ProtocolName)
								}
								className='bg-[#fbf0df] text-[#1a1a1a] py-2 px-3 rounded-lg font-mono cursor-pointer'
								disabled={loading}
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
								htmlFor='address'
								className='text-[#fbf0df] font-semibold'
							>
								Address
							</label>
							<input
								id='address'
								type='text'
								value={userAddress}
								onChange={(e) => {
									setUserAddress(e.target.value);
									setError(null);
								}}
								placeholder='0x...'
								className='bg-[#fbf0df] text-[#1a1a1a] py-2 px-3 rounded-lg font-mono placeholder:text-[#1a1a1a]/50'
								disabled={loading}
							/>
						</div>
						<div className='flex flex-col gap-2'>
							<span className='text-[#fbf0df] font-semibold'>
								Timeline options
							</span>
							<label className='flex items-center gap-2 text-[#fbf0df]/90'>
								<input
									type='checkbox'
									checked={
										options.applyPendingTroveFromEmptyPoolLiquidation
									}
									onChange={(e) =>
										setOptions((o) => ({
											...o,
											applyPendingTroveFromEmptyPoolLiquidation:
												e.target.checked
										}))
									}
									disabled={loading}
								/>
								applyPendingTroveFromEmptyPoolLiquidation
							</label>
							<label className='flex items-center gap-2 text-[#fbf0df]/90'>
								<input
									type='checkbox'
									checked={
										options.applyPendingLqtyFrom3rdPartyStabilityPool
									}
									onChange={(e) =>
										setOptions((o) => ({
											...o,
											applyPendingLqtyFrom3rdPartyStabilityPool:
												e.target.checked
										}))
									}
									disabled={loading}
								/>
								applyPendingLqtyFrom3rdPartyStabilityPool
							</label>
							<label className='flex items-center gap-2 text-[#fbf0df]/90'>
								<input
									type='checkbox'
									checked={
										options.applyPendingStabilityPoolFromLiquidation
									}
									onChange={(e) =>
										setOptions((o) => ({
											...o,
											applyPendingStabilityPoolFromLiquidation:
												e.target.checked
										}))
									}
									disabled={loading}
								/>
								applyPendingStabilityPoolFromLiquidation
							</label>
							<label className='flex items-center gap-2 text-[#fbf0df]/90'>
								<input
									type='checkbox'
									checked={
										options.applyPendingEthGainFromRedemption
									}
									onChange={(e) =>
										setOptions((o) => ({
											...o,
											applyPendingEthGainFromRedemption:
												e.target.checked
										}))
									}
									disabled={loading}
								/>
								applyPendingEthGainFromRedemption
							</label>
							<label className='flex items-center gap-2 text-[#fbf0df]/90'>
								<input
									type='checkbox'
									checked={
										options.applyPendingLusdGainFromDepositFee
									}
									onChange={(e) =>
										setOptions((o) => ({
											...o,
											applyPendingLusdGainFromDepositFee:
												e.target.checked
										}))
									}
									disabled={loading}
								/>
								applyPendingLusdGainFromDepositFee
							</label>
						</div>
						<button
							type='submit'
							disabled={loading}
							className='bg-[#fbf0df] text-[#1a1a1a] px-6 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed'
						>
							Load timeline
						</button>
						{progress !== null && (
							<p className='text-[#fbf0df]/80 text-sm flex items-center gap-2'>
								<span className='inline-block w-4 h-4 border-2 border-[#fbf0df] border-t-transparent rounded-full animate-spin' />
								Current: {progress}
							</p>
						)}
					</form>

					{error && (
						<div className='bg-red-900/30 border-2 border-red-500 rounded-xl p-4 text-red-200'>
							{error}
						</div>
					)}

					{timeline && decimalPrecision !== null && (
						<div className='flex flex-col gap-4'>
							<div className='flex justify-end'>
								<button
									type='button'
									onClick={() =>
										downloadTimelineJson(timeline)
									}
									className='bg-[#3a3a3a] text-[#fbf0df] border border-[#4a4a4a] px-4 py-2 rounded-lg font-semibold hover:bg-[#4a4a4a]'
								>
									Download timeline (JSON)
								</button>
							</div>
							<TimelineView
								timeline={timeline}
								decimalPrecision={decimalPrecision}
								protocol={protocol}
							/>
						</div>
					)}
				</div>
			)}

			{section === 'cache' && (
				<CacheManager
					protocol={protocol}
					onProtocolChange={setProtocol}
					refreshTrigger={refreshCacheKey}
				/>
			)}
		</div>
	);
}

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

function PaginationControls({
	page,
	setPage,
	pageSize,
	setPageSize,
	totalPages
}: {
	page: number;
	setPage: (n: number | ((p: number) => number)) => void;
	pageSize: 25 | 50 | 100;
	setPageSize: (n: 25 | 50 | 100) => void;
	totalPages: number;
}) {
	const currentPage = Math.min(page, Math.max(1, totalPages));
	const [goToInput, setGoToInput] = useState('');

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
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleGoToPage();
				}}
				placeholder={String(currentPage)}
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

function TimelineView({
	timeline,
	decimalPrecision,
	protocol
}: {
	timeline: Timeline;
	decimalPrecision: bigint;
	protocol: ProtocolName;
}) {
	const [openStream, setOpenStream] = useState<
		'trove' | 'stabilityPool' | 'lqtyStakingPool' | 'collateralSurplusPool'
	>('trove');
	const [pageSize, setPageSize] = useState<25 | 50 | 100>(25);
	const [page, setPage] = useState(1);
	const [changeColumns, setChangeColumns] = useState<Set<string>>(new Set());

	const toggleColumnChange = (columnKey: string) => {
		setChangeColumns((prev) => {
			const next = new Set(prev);
			if (next.has(columnKey)) {
				next.delete(columnKey);
			} else {
				next.add(columnKey);
			}
			return next;
		});
	};

	const renderColumnHeader = (
		columnKey: string,
		title: string,
		clickable: boolean = true
	) => {
		const isChangeMode = changeColumns.has(columnKey);
		const displayTitle = isChangeMode ? `${title} Δ` : title;

		if (!clickable) {
			return <th className='p-2'>{displayTitle}</th>;
		}

		return (
			<th
				className='p-2 cursor-pointer hover:bg-[#3a3a3a] select-none'
				onClick={() => toggleColumnChange(columnKey)}
				title='Click to toggle between value and change'
			>
				{displayTitle}
			</th>
		);
	};

	const streams = [
		{ id: 'trove' as const, label: 'Trove', data: timeline.trove },
		{
			id: 'stabilityPool' as const,
			label: 'Stability Pool',
			data: timeline.stabilityPool
		},
		{
			id: 'lqtyStakingPool' as const,
			label: 'LQTY Staking Pool',
			data: timeline.lqtyStakingPool
		},
		{
			id: 'collateralSurplusPool' as const,
			label: 'Collateral Surplus Pool',
			data: timeline.collateralSurplusPool
		}
	];

	return (
		<div className='flex flex-col gap-2'>
			<div className='flex gap-2 flex-wrap'>
				{streams.map(({ id, label, data }) => (
					<button
						key={id}
						type='button'
						onClick={() => {
							setOpenStream(id);
							setPage(1);
						}}
						className={`px-3 py-1.5 rounded font-medium ${
							openStream === id
								? 'bg-[#fbf0df] text-[#1a1a1a]'
								: 'bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a]'
						}`}
					>
						{label} ({data.length})
					</button>
				))}
			</div>
			{openStream === 'trove' &&
				(() => {
					const data = timeline.trove;
					const explorerTxUrl =
						protocols[protocol].chain.blockExplorerTxUrl;
					const totalPages = Math.max(
						1,
						Math.ceil(data.length / pageSize)
					);
					const currentPage = Math.min(page, totalPages);
					const slice = data.slice(
						(currentPage - 1) * pageSize,
						currentPage * pageSize
					);
					return (
						<div className='flex flex-col gap-2'>
							<PaginationControls
								page={page}
								setPage={setPage}
								pageSize={pageSize}
								setPageSize={setPageSize}
								totalPages={totalPages}
							/>
							<div className='overflow-x-auto rounded-lg border border-[#3a3a3a]'>
								<table className='w-full text-sm text-left'>
									<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
										<tr>
											{renderColumnHeader(
												'',
												'Time',
												false
											)}
											{renderColumnHeader(
												'',
												'Block',
												false
											)}
											{renderColumnHeader(
												'',
												'Tx',
												false
											)}
											{renderColumnHeader(
												'',
												'Operation',
												false
											)}
											{renderColumnHeader(
												'trove.coll',
												'coll'
											)}
											{renderColumnHeader(
												'trove.debt',
												'debt'
											)}
											{renderColumnHeader(
												'trove.collPending',
												'collPending'
											)}
											{renderColumnHeader(
												'trove.debtPending',
												'debtPending'
											)}
										</tr>
									</thead>
									<tbody className='text-[#fbf0df]/90 font-mono'>
										{slice.map((e, i) => {
											const globalIndex =
												(currentPage - 1) * pageSize +
												i;
											const prevColl =
												globalIndex > 0
													? data[globalIndex - 1]!
															.coll
													: 0n;
											const prevDebt =
												globalIndex > 0
													? data[globalIndex - 1]!
															.debt
													: 0n;
											const prevCollPending =
												globalIndex > 0
													? data[globalIndex - 1]!
															.collPending
													: 0n;
											const prevDebtPending =
												globalIndex > 0
													? data[globalIndex - 1]!
															.debtPending
													: 0n;

											const showCollChange =
												changeColumns.has('trove.coll');
											const showDebtChange =
												changeColumns.has('trove.debt');
											const showCollPendingChange =
												changeColumns.has(
													'trove.collPending'
												);
											const showDebtPendingChange =
												changeColumns.has(
													'trove.debtPending'
												);

											return (
												<tr
													key={globalIndex}
													className='border-t border-[#3a3a3a]'
												>
													<td className='p-2'>
														{formatTimestamp(
															e.timestamp
														)}
													</td>
													<td className='p-2'>
														{e.blockNumber.toString()}
													</td>
													<td className='p-2'>
														{e.transactionHash ? (
															<a
																href={`${explorerTxUrl}${e.transactionHash}`}
																target='_blank'
																rel='noopener noreferrer'
																className='text-[#7eb8da] hover:underline break-all'
															>
																{e.transactionHash.slice(
																	0,
																	10
																)}
																…
															</a>
														) : (
															'—'
														)}
													</td>
													<td className='p-2'>
														{e.operation}
													</td>
													<td className='p-2'>
														{showCollChange
															? prevColl !== null
																? formatBigInt(
																		e.coll -
																			prevColl,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.coll,
																	decimalPrecision
															  )}
													</td>
													<td className='p-2'>
														{showDebtChange
															? prevDebt !== null
																? formatBigInt(
																		e.debt -
																			prevDebt,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.debt,
																	decimalPrecision
															  )}
													</td>
													<td className='p-2'>
														{showCollPendingChange
															? prevCollPending !==
															  null
																? formatBigInt(
																		e.collPending -
																			prevCollPending,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.collPending,
																	decimalPrecision
															  )}
													</td>
													<td className='p-2'>
														{showDebtPendingChange
															? prevDebtPending !==
															  null
																? formatBigInt(
																		e.debtPending -
																			prevDebtPending,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.debtPending,
																	decimalPrecision
															  )}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					);
				})()}
			{openStream === 'stabilityPool' &&
				(() => {
					const data = timeline.stabilityPool;
					const explorerTxUrl =
						protocols[protocol].chain.blockExplorerTxUrl;
					const totalPages = Math.max(
						1,
						Math.ceil(data.length / pageSize)
					);
					const currentPage = Math.min(page, totalPages);
					const slice = data.slice(
						(currentPage - 1) * pageSize,
						currentPage * pageSize
					);
					return (
						<div className='flex flex-col gap-2'>
							<PaginationControls
								page={page}
								setPage={setPage}
								pageSize={pageSize}
								setPageSize={setPageSize}
								totalPages={totalPages}
							/>
							<div className='overflow-x-auto rounded-lg border border-[#3a3a3a]'>
								<table className='w-full text-sm text-left'>
									<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
										<tr>
											{renderColumnHeader(
												'',
												'Time',
												false
											)}
											{renderColumnHeader(
												'',
												'Block',
												false
											)}
											{renderColumnHeader(
												'',
												'Tx',
												false
											)}
											{renderColumnHeader(
												'',
												'Operation',
												false
											)}
											{renderColumnHeader(
												'stabilityPool.deposit',
												'deposit'
											)}
											{renderColumnHeader(
												'stabilityPool.pendingEthGain',
												'pendingEthGain'
											)}
											{renderColumnHeader(
												'stabilityPool.pendingLusdLoss',
												'pendingDepositLoss'
											)}
											{renderColumnHeader(
												'stabilityPool.pendingLqtyReward',
												'pendingLqtyReward'
											)}
										</tr>
									</thead>
									<tbody className='text-[#fbf0df]/90 font-mono'>
										{slice.map((e, i) => {
											const globalIndex =
												(currentPage - 1) * pageSize +
												i;
											const prevDeposit =
												globalIndex > 0
													? data[globalIndex - 1]!
															.deposit
													: 0n;
											const prevPendingEthGain =
												globalIndex > 0
													? data[globalIndex - 1]!
															.pendingEthGain
													: 0n;
											const prevPendingLusdLoss =
												globalIndex > 0
													? data[globalIndex - 1]!
															.pendingLusdLoss
													: 0n;
											const prevPendingLqtyReward =
												globalIndex > 0
													? data[globalIndex - 1]!
															.pendingLqtyReward
													: 0n;

											const showDepositChange =
												changeColumns.has(
													'stabilityPool.deposit'
												);
											const showPendingEthGainChange =
												changeColumns.has(
													'stabilityPool.pendingEthGain'
												);
											const showPendingLusdLossChange =
												changeColumns.has(
													'stabilityPool.pendingLusdLoss'
												);
											const showPendingLqtyRewardChange =
												changeColumns.has(
													'stabilityPool.pendingLqtyReward'
												);

											return (
												<tr
													key={globalIndex}
													className='border-t border-[#3a3a3a]'
												>
													<td className='p-2'>
														{formatTimestamp(
															e.timestamp
														)}
													</td>
													<td className='p-2'>
														{e.blockNumber.toString()}
													</td>
													<td className='p-2'>
														{e.transactionHash ? (
															<a
																href={`${explorerTxUrl}${e.transactionHash}`}
																target='_blank'
																rel='noopener noreferrer'
																className='text-[#7eb8da] hover:underline break-all'
															>
																{e.transactionHash.slice(
																	0,
																	10
																)}
																…
															</a>
														) : (
															'—'
														)}
													</td>
													<td className='p-2'>
														{e.operation}
													</td>
													<td className='p-2'>
														{showDepositChange
															? prevDeposit !==
															  null
																? formatBigInt(
																		e.deposit -
																			prevDeposit,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.deposit,
																	decimalPrecision
															  )}
													</td>
													<td className='p-2'>
														{showPendingEthGainChange
															? prevPendingEthGain !==
															  null
																? formatBigInt(
																		e.pendingEthGain -
																			prevPendingEthGain,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.pendingEthGain,
																	decimalPrecision
															  )}
													</td>
													<td className='p-2'>
														{showPendingLusdLossChange
															? prevPendingLusdLoss !==
															  null
																? formatBigInt(
																		e.pendingLusdLoss -
																			prevPendingLusdLoss,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.pendingLusdLoss,
																	decimalPrecision
															  )}
													</td>
													<td className='p-2'>
														{showPendingLqtyRewardChange
															? prevPendingLqtyReward !==
															  null
																? formatBigInt(
																		e.pendingLqtyReward -
																			prevPendingLqtyReward,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.pendingLqtyReward,
																	decimalPrecision
															  )}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					);
				})()}
			{openStream === 'lqtyStakingPool' &&
				(() => {
					const data = timeline.lqtyStakingPool;
					const explorerTxUrl =
						protocols[protocol].chain.blockExplorerTxUrl;
					const totalPages = Math.max(
						1,
						Math.ceil(data.length / pageSize)
					);
					const currentPage = Math.min(page, totalPages);
					const slice = data.slice(
						(currentPage - 1) * pageSize,
						currentPage * pageSize
					);
					return (
						<div className='flex flex-col gap-2'>
							<PaginationControls
								page={page}
								setPage={setPage}
								pageSize={pageSize}
								setPageSize={setPageSize}
								totalPages={totalPages}
							/>
							<div className='overflow-x-auto rounded-lg border border-[#3a3a3a]'>
								<table className='w-full text-sm text-left'>
									<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
										<tr>
											{renderColumnHeader(
												'',
												'Time',
												false
											)}
											{renderColumnHeader(
												'',
												'Block',
												false
											)}
											{renderColumnHeader(
												'',
												'Tx',
												false
											)}
											{renderColumnHeader(
												'',
												'Operation',
												false
											)}
											{renderColumnHeader(
												'lqtyStakingPool.stake',
												'stake'
											)}
											{renderColumnHeader(
												'lqtyStakingPool.pendingEthGain',
												'pendingEthGain'
											)}
											{renderColumnHeader(
												'lqtyStakingPool.pendingLusdGain',
												'pendingLusdGain'
											)}
										</tr>
									</thead>
									<tbody className='text-[#fbf0df]/90 font-mono'>
										{slice.map((e, i) => {
											const globalIndex =
												(currentPage - 1) * pageSize +
												i;
											const prevStake =
												globalIndex > 0
													? data[globalIndex - 1]!
															.stake
													: 0n;
											const prevPendingEthGain =
												globalIndex > 0
													? data[globalIndex - 1]!
															.pendingEthGain
													: 0n;
											const prevPendingLusdGain =
												globalIndex > 0
													? data[globalIndex - 1]!
															.pendingLusdGain
													: 0n;

											const showStakeChange =
												changeColumns.has(
													'lqtyStakingPool.stake'
												);
											const showPendingEthGainChange =
												changeColumns.has(
													'lqtyStakingPool.pendingEthGain'
												);
											const showPendingLusdGainChange =
												changeColumns.has(
													'lqtyStakingPool.pendingLusdGain'
												);

											return (
												<tr
													key={globalIndex}
													className='border-t border-[#3a3a3a]'
												>
													<td className='p-2'>
														{formatTimestamp(
															e.timestamp
														)}
													</td>
													<td className='p-2'>
														{e.blockNumber.toString()}
													</td>
													<td className='p-2'>
														{e.transactionHash ? (
															<a
																href={`${explorerTxUrl}${e.transactionHash}`}
																target='_blank'
																rel='noopener noreferrer'
																className='text-[#7eb8da] hover:underline break-all'
															>
																{e.transactionHash.slice(
																	0,
																	10
																)}
																…
															</a>
														) : (
															'—'
														)}
													</td>
													<td className='p-2'>
														{e.operation}
													</td>
													<td className='p-2'>
														{showStakeChange
															? prevStake !== null
																? formatBigInt(
																		e.stake -
																			prevStake,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.stake,
																	decimalPrecision
															  )}
													</td>
													<td className='p-2'>
														{showPendingEthGainChange
															? prevPendingEthGain !==
															  null
																? formatBigInt(
																		e.pendingEthGain -
																			prevPendingEthGain,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.pendingEthGain,
																	decimalPrecision
															  )}
													</td>
													<td className='p-2'>
														{showPendingLusdGainChange
															? prevPendingLusdGain !==
															  null
																? formatBigInt(
																		e.pendingLusdGain -
																			prevPendingLusdGain,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.pendingLusdGain,
																	decimalPrecision
															  )}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					);
				})()}
			{openStream === 'collateralSurplusPool' &&
				(() => {
					const data = timeline.collateralSurplusPool;
					const explorerTxUrl =
						protocols[protocol].chain.blockExplorerTxUrl;
					const totalPages = Math.max(
						1,
						Math.ceil(data.length / pageSize)
					);
					const currentPage = Math.min(page, totalPages);
					const slice = data.slice(
						(currentPage - 1) * pageSize,
						currentPage * pageSize
					);
					return (
						<div className='flex flex-col gap-2'>
							<PaginationControls
								page={page}
								setPage={setPage}
								pageSize={pageSize}
								setPageSize={setPageSize}
								totalPages={totalPages}
							/>
							<div className='overflow-x-auto rounded-lg border border-[#3a3a3a]'>
								<table className='w-full text-sm text-left'>
									<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
										<tr>
											{renderColumnHeader(
												'',
												'Time',
												false
											)}
											{renderColumnHeader(
												'',
												'Block',
												false
											)}
											{renderColumnHeader(
												'',
												'Tx',
												false
											)}
											{renderColumnHeader(
												'',
												'Operation',
												false
											)}
											{renderColumnHeader(
												'collateralSurplusPool.surplus',
												'surplus'
											)}
										</tr>
									</thead>
									<tbody className='text-[#fbf0df]/90 font-mono'>
										{slice.map((e, i) => {
											const globalIndex =
												(currentPage - 1) * pageSize +
												i;
											const prevSurplus =
												globalIndex > 0
													? data[globalIndex - 1]!
															.surplus
													: 0n;

											const showSurplusChange =
												changeColumns.has(
													'collateralSurplusPool.surplus'
												);

											return (
												<tr
													key={globalIndex}
													className='border-t border-[#3a3a3a]'
												>
													<td className='p-2'>
														{formatTimestamp(
															e.timestamp
														)}
													</td>
													<td className='p-2'>
														{e.blockNumber.toString()}
													</td>
													<td className='p-2'>
														{e.transactionHash ? (
															<a
																href={`${explorerTxUrl}${e.transactionHash}`}
																target='_blank'
																rel='noopener noreferrer'
																className='text-[#7eb8da] hover:underline break-all'
															>
																{e.transactionHash.slice(
																	0,
																	10
																)}
																…
															</a>
														) : (
															'—'
														)}
													</td>
													<td className='p-2'>
														{e.operation}
													</td>
													<td className='p-2'>
														{showSurplusChange
															? prevSurplus !==
															  null
																? formatBigInt(
																		e.surplus -
																			prevSurplus,
																		decimalPrecision
																  )
																: '—'
															: formatBigInt(
																	e.surplus,
																	decimalPrecision
															  )}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					);
				})()}
		</div>
	);
}

export default App;
