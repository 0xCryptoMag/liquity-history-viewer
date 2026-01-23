import { useState, type FormEvent } from 'react';
import { constructTimeline } from './backend/state/timeline.js';
import { protocolNames, type ProtocolName } from './backend/protocols/protocols.js';
import type { Timeline } from './backend/state/timeline.js';

export function TimelineTester() {
	const [protocol, setProtocol] = useState<ProtocolName>('liquity');
	const [userAddress, setUserAddress] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<Timeline | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setResult(null);

		try {
			// Validate address
			if (!userAddress || !userAddress.startsWith('0x') || userAddress.length !== 42) {
				throw new Error('Invalid address. Must be a valid Ethereum address (0x followed by 40 hex characters)');
			}

			console.log('🚀 Calling constructTimeline with:', { protocol, userAddress });
			console.time('constructTimeline');

			const timeline = await constructTimeline(protocol, userAddress as `0x${string}`);

			console.timeEnd('constructTimeline');
			console.log('✅ Timeline constructed:', timeline);
			console.log('📊 Timeline stats:', {
				troveEvents: timeline.trove.length,
				stabilityPoolEvents: timeline.stabilityPool.length,
				lqtyStakingPoolEvents: timeline.lqtyStakingPool.length
			});

			setResult(timeline);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.error('❌ Error constructing timeline:', err);
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	// Helper to convert bigint values to strings for JSON display
	const formatTimelineForDisplay = (timeline: Timeline) => {
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
				}))
			},
			null,
			2
		);
	};

	return (
		<div className='mt-8 mx-auto w-full max-w-4xl text-left flex flex-col gap-4'>
			<h2 className='text-2xl font-bold mb-4'>Timeline Constructor Tester</h2>
			
			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-4 bg-[#1a1a1a] p-4 rounded-xl border-2 border-[#fbf0df]'
			>
				<div className='flex flex-col gap-2'>
					<label htmlFor='protocol' className='text-[#fbf0df] font-semibold'>
						Protocol:
					</label>
					<select
						id='protocol'
						value={protocol}
						onChange={(e) => setProtocol(e.target.value as ProtocolName)}
						className='bg-[#fbf0df] text-[#1a1a1a] py-2 px-3 rounded-lg font-mono cursor-pointer hover:bg-[#f3d5a3] transition-colors'
						disabled={loading}
					>
						{protocolNames.map((name) => (
							<option key={name} value={name}>
								{name}
							</option>
						))}
					</select>
				</div>

				<div className='flex flex-col gap-2'>
					<label htmlFor='address' className='text-[#fbf0df] font-semibold'>
						User Address:
					</label>
					<input
						id='address'
						type='text'
						value={userAddress}
						onChange={(e) => setUserAddress(e.target.value)}
						placeholder='0x...'
						className='bg-[#fbf0df] text-[#1a1a1a] py-2 px-3 rounded-lg font-mono placeholder-[#1a1a1a]/40 focus:outline-none focus:ring-2 focus:ring-[#f3d5a3]'
						disabled={loading}
					/>
				</div>

				<button
					type='submit'
					disabled={loading || !userAddress}
					className='bg-[#fbf0df] text-[#1a1a1a] border-0 px-6 py-2 rounded-lg font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0'
				>
					{loading ? 'Loading...' : 'Construct Timeline'}
				</button>
			</form>

			{error && (
				<div className='bg-red-900/30 border-2 border-red-500 rounded-xl p-4 text-red-200'>
					<strong>Error:</strong> {error}
				</div>
			)}

			{result && (
				<div className='flex flex-col gap-4'>
					<div className='bg-green-900/30 border-2 border-green-500 rounded-xl p-4 text-green-200'>
						<strong>✅ Success!</strong> Timeline constructed. Check console for detailed logs.
						<div className='mt-2 text-sm'>
							<p>Trove events: {result.trove.length}</p>
							<p>Stability Pool events: {result.stabilityPool.length}</p>
							<p>LQTY Staking Pool events: {result.lqtyStakingPool.length}</p>
						</div>
					</div>

					<div className='flex flex-col gap-2'>
						<label className='text-[#fbf0df] font-semibold'>
							Timeline Data (JSON):
						</label>
						<textarea
							readOnly
							value={formatTimelineForDisplay(result)}
							className='w-full min-h-[300px] bg-[#1a1a1a] border-2 border-[#fbf0df] rounded-xl p-3 text-[#fbf0df] font-mono text-xs resize-y focus:border-[#f3d5a3] overflow-auto'
						/>
					</div>
				</div>
			)}
		</div>
	);
}
