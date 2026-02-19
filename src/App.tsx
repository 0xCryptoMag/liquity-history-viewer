import { useState, useCallback, type FormEvent } from 'react';
import { isAddress } from 'viem';
import { constructTimeline } from './liquity/state/timeline';
import type { Timeline } from './liquity/state/timeline';
import type { ProtocolName } from './liquity/protocols/protocols';
import { Tab, Tabs } from './components/ui/Tab';
import { TimelineViewer } from './components/timeline/TimelineViewer';
import { CacheManager } from './components/cache/CacheManager';
import { ProtocolSelect } from './components/protocol/ProtocolSelect';
import './index.css';

type Section = 'timeline' | 'cache';

export function App() {
	const [section, setSection] = useState<Section>('timeline');
	const [protocol, setProtocol] = useState<ProtocolName>('liquity');
	const [userAddress, setUserAddress] = useState('');
	const [timeline, setTimeline] = useState<Timeline | null>(null);
	const [decimalPrecision, setDecimalPrecision] = useState<bigint | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadTimeline = useCallback(async () => {
		const address = userAddress.trim();
		if (!isAddress(address)) {
			setError(
				'Invalid address. Please enter a valid Ethereum address (0x followed by 40 hex characters).'
			);
			return;
		}
		setError(null);
		setLoading(true);
		try {
			const result = await constructTimeline(
				protocol,
				address as `0x${string}`,
				(msg) => console.log(msg)
			);
			setTimeline(result.timeline);
			setDecimalPrecision(result.decimalPrecision);
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			setLoading(false);
		}
	}, [protocol, userAddress]);

	const handleSubmitTimeline = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		loadTimeline();
	};

	return (
		<div className='w-full max-w-[1920px] mx-auto px-3 py-4 text-left relative z-10'>
			<h1 className='text-3xl font-bold mb-6'>Liquity History Viewer</h1>

			<div className='mb-6'>
				<Tabs value={section} onChange={setSection}>
					<Tab value='timeline'>Timeline</Tab>
					<Tab value='cache'>Cache</Tab>
				</Tabs>
			</div>

			{section === 'timeline' && (
				<>
					{timeline === null || decimalPrecision === null ? (
						<div className='flex flex-col gap-4'>
							<form onSubmit={handleSubmitTimeline} className='flex flex-col gap-4 max-w-md'>
								<ProtocolSelect
									protocol={protocol}
									onProtocolChange={setProtocol}
									address={userAddress}
									onAddressChange={(a) => {
										setUserAddress(a);
										setError(null);
									}}
									actions={
										<button
											type='submit'
											disabled={loading}
											className='bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded font-mono text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
										>
											{loading ? 'Loading...' : 'Generate'}
										</button>
									}
								/>
							</form>
							{error && (
								<div className='text-red-400 text-sm' role='alert'>
									{error}
								</div>
							)}
						</div>
					) : (
						<TimelineViewer
							timeline={timeline}
							decimalPrecision={decimalPrecision}
							protocol={protocol}
							onProtocolChange={setProtocol}
							protocolSelect={{
								address: userAddress,
								onAddressChange: setUserAddress,
								onSubmit: loadTimeline,
								loading
							}}
						/>
					)}
				</>
			)}

			{section === 'cache' && <CacheManager />}
		</div>
	);
}
