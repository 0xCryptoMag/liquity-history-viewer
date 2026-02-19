import { useRef, useState } from 'react';
import type { ProtocolName } from '../../liquity/protocols/protocols';
import {
	exportGlobalCache,
	exportUserCache,
	importGlobalCache,
	importUserCache
} from '../../liquity/state/cache';
import { ProtocolSelect } from '../protocol/ProtocolSelect';

const buttonClass =
	'bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded font-mono text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

export function CacheImportExport() {
	const [protocol, setProtocol] = useState<ProtocolName>('liquity');
	const [address, setAddress] = useState('');
	const [exporting, setExporting] = useState(false);
	const [importing, setImporting] = useState(false);
	const importInputRef = useRef<HTMLInputElement>(null);

	const isGlobal = address.trim() === '';

	const handleExport = async () => {
		setExporting(true);
		try {
			const json = isGlobal
				? await exportGlobalCache(protocol)
				: await exportUserCache(protocol, address.trim());
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = isGlobal
				? `${protocol}-global-cache.json`
				: `${protocol}-user-${address.trim().slice(0, 10)}-cache.json`;
			a.click();
			URL.revokeObjectURL(url);
		} finally {
			setExporting(false);
		}
	};

	const handleImportClick = () => {
		importInputRef.current?.click();
	};

	const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const addr = address.trim();
		if (!isGlobal && !addr) return;
		setImporting(true);
		try {
			const json = await file.text();
			if (isGlobal) {
				await importGlobalCache(protocol, json);
			} else {
				await importUserCache(protocol, addr, json);
			}
		} finally {
			setImporting(false);
			e.target.value = '';
		}
	};

	return (
		<div className='flex flex-col gap-2'>
			<input
				ref={importInputRef}
				type='file'
				accept='.json,application/json'
				className='hidden'
				onChange={handleImportFile}
				aria-hidden
			/>
			<ProtocolSelect
				protocol={protocol}
				onProtocolChange={setProtocol}
				address={address}
				onAddressChange={setAddress}
				actions={
					<>
						<button
							type='button'
							onClick={handleImportClick}
							disabled={importing}
							className={buttonClass}
						>
							{importing ? 'Importing...' : 'Import'}
						</button>
						<button
							type='button'
							onClick={handleExport}
							disabled={exporting}
							className={buttonClass}
						>
							{exporting ? 'Exporting...' : 'Export'}
						</button>
					</>
				}
			/>
		</div>
	);
}
