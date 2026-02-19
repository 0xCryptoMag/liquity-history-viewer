import { useState } from 'react';
import type { ProtocolName } from '../../liquity/protocols/protocols';
import {
	clearCachedState,
	clearCachedStateForBaseKey
} from '../../liquity/state/cache';
import { ProtocolSelect } from '../protocol/ProtocolSelect';

const buttonClass =
	'bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-3 rounded font-mono text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

export function CacheDelete() {
	const [protocol, setProtocol] = useState<ProtocolName>('liquity');
	const [address, setAddress] = useState('');
	const [deleting, setDeleting] = useState(false);
	const [deletingProtocol, setDeletingProtocol] = useState(false);

	const isGlobal = address.trim() === '';

	const handleDelete = async () => {
		setDeleting(true);
		try {
			const baseKey = isGlobal ? 'global' : address.trim();
			await clearCachedStateForBaseKey(protocol, baseKey);
		} finally {
			setDeleting(false);
		}
	};

	const handleDeleteProtocol = async () => {
		setDeletingProtocol(true);
		try {
			await clearCachedState(protocol);
		} finally {
			setDeletingProtocol(false);
		}
	};

	const busy = deleting || deletingProtocol;

	return (
		<ProtocolSelect
			protocol={protocol}
			onProtocolChange={setProtocol}
			address={address}
			onAddressChange={setAddress}
			disabled={busy}
			actions={
				<>
					<button
						type='button'
						onClick={handleDelete}
						disabled={busy}
						className={buttonClass}
					>
						{deleting ? 'Deleting...' : 'Delete'}
					</button>
					<button
						type='button'
						onClick={handleDeleteProtocol}
						disabled={busy}
						className={buttonClass}
					>
						{deletingProtocol
							? 'Deleting Protocol...'
							: 'Delete Protocol'}
					</button>
				</>
			}
		/>
	);
}
