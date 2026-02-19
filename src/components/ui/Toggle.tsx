import type { ChangeEvent } from 'react';

export type ToggleProps = {
	/** Whether the toggle is on */
	checked: boolean;
	/** Called when the user toggles; receives the new value */
	onChange: (checked: boolean) => void;
	/** Optional label (rendered to the right of the toggle) */
	label?: string;
	/** Optional id for the input (useful when label is present) */
	id?: string;
	/** When true, the toggle cannot be changed */
	disabled?: boolean;
	/** Optional title/tooltip */
	title?: string;
	/** Additional class names for the wrapper */
	className?: string;
};

/**
 * Reusable on/off toggle (switch). Controlled component: pass `checked` and `onChange`.
 */
export function Toggle({
	checked,
	onChange,
	label,
	id,
	disabled = false,
	title,
	className = ''
}: ToggleProps) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.checked);
	};

	const inputId =
		id ??
		(label
			? `toggle-${label.replace(/\s+/g, '-').toLowerCase()}`
			: undefined);

	return (
		<label
			className={`inline-flex items-center gap-2 cursor-pointer select-none ${
				disabled ? 'opacity-60 cursor-not-allowed' : ''
			} ${className}`}
			title={title}
			htmlFor={inputId}
		>
			<span className='relative inline-block w-10 h-6 shrink-0'>
				<input
					id={inputId}
					type='checkbox'
					role='switch'
					aria-checked={checked}
					checked={checked}
					onChange={handleChange}
					disabled={disabled}
					className='peer sr-only'
				/>
				<span
					className={`block w-full h-full rounded-full transition-colors duration-200 ${
						checked ? 'bg-[#fbf0df]' : 'bg-[#3a3a3a]'
					}`}
				/>
				<span
					className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-[#242424] transition-transform duration-200 peer-checked:translate-x-4`}
					aria-hidden
				/>
			</span>
			{label != null && (
				<span className='text-sm text-[rgba(255,255,255,0.87)]'>
					{label}
				</span>
			)}
		</label>
	);
}
