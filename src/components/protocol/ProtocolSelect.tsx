import type { ReactNode } from 'react';
import type { ProtocolName } from '../../liquity/protocols/protocols';
import { protocolNames } from '../../liquity/protocols/protocols';

type Props = {
	protocol: ProtocolName;
	onProtocolChange: (p: ProtocolName) => void;
	address: string;
	onAddressChange: (a: string) => void;
	/** Optional action buttons (e.g. Generate, Refresh) rendered to the right of the protocol dropdown. */
	actions?: ReactNode;
	disabled?: boolean;
};

export function ProtocolSelect({
	protocol,
	onProtocolChange,
	address,
	onAddressChange,
	actions,
	disabled = false
}: Props) {
	return (
		<div className='flex flex-col gap-2'>
			<div className='flex items-center gap-2'>
				<label
					htmlFor='protocol-select'
					className='text-[#fbf0df] font-medium shrink-0'
				>
					Protocol
				</label>
				<select
					id='protocol-select'
					value={protocol}
					onChange={(e) =>
						onProtocolChange(e.target.value as ProtocolName)
					}
					className='bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-2 rounded font-mono cursor-pointer text-sm min-w-0'
					disabled={disabled}
				>
					{protocolNames.map((name) => (
						<option key={name} value={name}>
							{name}
						</option>
					))}
				</select>
				{actions != null && (
					<div className='flex items-center gap-2 shrink-0'>
						{actions}
					</div>
				)}
			</div>
			<input
				type='text'
				value={address}
				onChange={(e) => onAddressChange(e.target.value)}
				placeholder='0x....'
				className='bg-[#fbf0df] text-[#1a1a1a] py-1.5 px-2 rounded font-mono text-sm placeholder:text-[#1a1a1a]/50 w-full'
				disabled={disabled}
			/>
		</div>
	);
}
