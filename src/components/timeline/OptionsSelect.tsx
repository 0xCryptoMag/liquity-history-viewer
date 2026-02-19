import { useState } from 'react';
import { Toggle } from '../ui/Toggle.js';

export type TimelineOptions = {
	applyPendingToTrove: boolean;
	applyPendingToStabilityPool: boolean;
	repayLoanFeeBeforePrinciple: boolean;
	debtIncludesLiquidationReserve: boolean;
};

type OptionsSelectProps = {
	/** Initial option values */
	initialOptions?: Partial<TimelineOptions>;
	/** Called when the user clicks Apply with the current option values */
	onApply?: (options: TimelineOptions) => void;
};

const defaultOptions: TimelineOptions = {
	applyPendingToTrove: false,
	applyPendingToStabilityPool: false,
	repayLoanFeeBeforePrinciple: false,
	debtIncludesLiquidationReserve: false
};

export function OptionsSelect({ initialOptions, onApply }: OptionsSelectProps) {
	const [options, setOptions] = useState<TimelineOptions>({
		...defaultOptions,
		...initialOptions
	});

	const updateOption = <K extends keyof TimelineOptions>(
		key: K,
		value: TimelineOptions[K]
	) => {
		setOptions((prev) => ({ ...prev, [key]: value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onApply?.(options);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col gap-3'
		>
			<div className='flex flex-col gap-2'>
				<Toggle
					id='apply-pending-to-trove'
					checked={options.applyPendingToTrove}
					onChange={(checked) =>
						updateOption('applyPendingToTrove', checked)
					}
					label='Apply pending to trove balances'
				/>
				<Toggle
					id='apply-pending-to-stability-pool'
					checked={options.applyPendingToStabilityPool}
					onChange={(checked) =>
						updateOption('applyPendingToStabilityPool', checked)
					}
					label='Apply pending to stability pool balances'
				/>
				<Toggle
					id='repay-loan-fee-before-principle'
					checked={options.repayLoanFeeBeforePrinciple}
					onChange={(checked) =>
						updateOption('repayLoanFeeBeforePrinciple', checked)
					}
					label='Repay loan fee before principle'
				/>
				<Toggle
					id='debt-includes-liquidation-reserve'
					checked={options.debtIncludesLiquidationReserve}
					onChange={(checked) =>
						updateOption('debtIncludesLiquidationReserve', checked)
					}
					label='Debt includes liquidation reserve'
				/>
			</div>
			<button
				type='submit'
				className='self-start px-3 py-1.5 rounded font-medium bg-[#fbf0df] text-[#1a1a1a] hover:bg-[#ebe0cf]'
			>
				Apply
			</button>
		</form>
	);
}
