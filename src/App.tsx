import { useState, useCallback, type FormEvent } from 'react';
import { isAddress } from 'viem';
import { constructTimeline } from './backend/state/timeline.js';
import type {
	Timeline,
	TimelineOptions as TimelineOptionsType
} from './backend/state/timeline.js';
import {
	listCacheKeyPathsForDisplay,
	clearCachedStateForBaseKey,
	clearCachedState,
	type DisplayCacheEntry,
	type ListCacheEntriesFilter
} from './backend/state/cache.js';
import {
	protocolNames,
	type ProtocolName
} from './backend/protocols/protocols.js';
import { CacheManager } from './CacheManager';
import './index.css';

const DECIMALS = 18n;

function formatBigInt(value: bigint, decimals: number = 18): string {
	const divisor = 10n ** BigInt(decimals);
	const intPart = value / divisor;
	const fracPart = value % divisor;
	if (fracPart === 0n) return intPart.toString();
	const fracStr = fracPart
		.toString()
		.padStart(decimals, '0')
		.replace(/0+$/, '');
	return `${intPart}.${fracStr}`;
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
				pendingDepositLoss: e.pendingDepositLoss.toString(),
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
		setProgress(null);
		try {
			const result = await constructTimeline(
				protocol,
				address as `0x${string}`,
				options,
				(msg) => setProgress(msg)
			);
			setTimeline(result);
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
		<div className='max-w-7xl mx-auto p-8 text-left relative z-10'>
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

					{timeline && (
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
							<TimelineView timeline={timeline} />
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

function TimelineView({ timeline }: { timeline: Timeline }) {
	const [openStream, setOpenStream] = useState<
		'trove' | 'stabilityPool' | 'lqtyStakingPool' | 'collateralSurplusPool'
	>('trove');
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
						onClick={() => setOpenStream(id)}
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
			{openStream === 'trove' && (
				<div className='overflow-x-auto rounded-lg border border-[#3a3a3a]'>
					<table className='w-full text-sm text-left'>
						<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
							<tr>
								<th className='p-2'>Block</th>
								<th className='p-2'>Time</th>
								<th className='p-2'>Operation</th>
								<th className='p-2'>coll</th>
								<th className='p-2'>debt</th>
								<th className='p-2'>stake</th>
								<th className='p-2'>collPending</th>
								<th className='p-2'>debtPending</th>
							</tr>
						</thead>
						<tbody className='text-[#fbf0df]/90 font-mono'>
							{timeline.trove.map((e, i) => (
								<tr
									key={i}
									className='border-t border-[#3a3a3a]'
								>
									<td className='p-2'>
										{e.blockNumber.toString()}
									</td>
									<td className='p-2'>
										{new Date(
											Number(e.timestamp) * 1000
										).toISOString()}
									</td>
									<td className='p-2'>{e.operation}</td>
									<td className='p-2'>
										{formatBigInt(e.coll)}
									</td>
									<td className='p-2'>
										{formatBigInt(e.debt)}
									</td>
									<td className='p-2'>
										{formatBigInt(e.stake)}
									</td>
									<td className='p-2'>
										{formatBigInt(e.collPending)}
									</td>
									<td className='p-2'>
										{formatBigInt(e.debtPending)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{openStream === 'stabilityPool' && (
				<div className='overflow-x-auto rounded-lg border border-[#3a3a3a]'>
					<table className='w-full text-sm text-left'>
						<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
							<tr>
								<th className='p-2'>Block</th>
								<th className='p-2'>Time</th>
								<th className='p-2'>Operation</th>
								<th className='p-2'>deposit</th>
								<th className='p-2'>pendingEthGain</th>
								<th className='p-2'>pendingDepositLoss</th>
								<th className='p-2'>pendingLqtyReward</th>
							</tr>
						</thead>
						<tbody className='text-[#fbf0df]/90 font-mono'>
							{timeline.stabilityPool.map((e, i) => (
								<tr
									key={i}
									className='border-t border-[#3a3a3a]'
								>
									<td className='p-2'>
										{e.blockNumber.toString()}
									</td>
									<td className='p-2'>
										{new Date(
											Number(e.timestamp) * 1000
										).toISOString()}
									</td>
									<td className='p-2'>{e.operation}</td>
									<td className='p-2'>
										{formatBigInt(e.deposit)}
									</td>
									<td className='p-2'>
										{formatBigInt(e.pendingEthGain)}
									</td>
									<td className='p-2'>
										{formatBigInt(e.pendingDepositLoss)}
									</td>
									<td className='p-2'>
										{formatBigInt(e.pendingLqtyReward)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{openStream === 'lqtyStakingPool' && (
				<div className='overflow-x-auto rounded-lg border border-[#3a3a3a]'>
					<table className='w-full text-sm text-left'>
						<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
							<tr>
								<th className='p-2'>Block</th>
								<th className='p-2'>Time</th>
								<th className='p-2'>Operation</th>
								<th className='p-2'>stake</th>
								<th className='p-2'>pendingEthGain</th>
								<th className='p-2'>pendingLusdGain</th>
							</tr>
						</thead>
						<tbody className='text-[#fbf0df]/90 font-mono'>
							{timeline.lqtyStakingPool.map((e, i) => (
								<tr
									key={i}
									className='border-t border-[#3a3a3a]'
								>
									<td className='p-2'>
										{e.blockNumber.toString()}
									</td>
									<td className='p-2'>
										{new Date(
											Number(e.timestamp) * 1000
										).toISOString()}
									</td>
									<td className='p-2'>{e.operation}</td>
									<td className='p-2'>
										{formatBigInt(e.stake)}
									</td>
									<td className='p-2'>
										{formatBigInt(e.pendingEthGain)}
									</td>
									<td className='p-2'>
										{formatBigInt(e.pendingLusdGain)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{openStream === 'collateralSurplusPool' && (
				<div className='overflow-x-auto rounded-lg border border-[#3a3a3a]'>
					<table className='w-full text-sm text-left'>
						<thead className='bg-[#2a2a2a] text-[#fbf0df]'>
							<tr>
								<th className='p-2'>Block</th>
								<th className='p-2'>Time</th>
								<th className='p-2'>Operation</th>
								<th className='p-2'>surplus</th>
							</tr>
						</thead>
						<tbody className='text-[#fbf0df]/90 font-mono'>
							{timeline.collateralSurplusPool.map((e, i) => (
								<tr
									key={i}
									className='border-t border-[#3a3a3a]'
								>
									<td className='p-2'>
										{e.blockNumber.toString()}
									</td>
									<td className='p-2'>
										{new Date(
											Number(e.timestamp) * 1000
										).toISOString()}
									</td>
									<td className='p-2'>{e.operation}</td>
									<td className='p-2'>
										{formatBigInt(e.surplus)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default App;
