import {
	createContext,
	useContext,
	type Dispatch,
	type SetStateAction,
	type ReactNode,
	type ButtonHTMLAttributes
} from 'react';

type TabsContextValue<T extends string = string> = {
	value: T;
	onChange: Dispatch<SetStateAction<T>>;
};

const TabsContext = createContext<TabsContextValue<any> | null>(null);

type TabsProps<T extends string = string> = {
	value: T;
	onChange: Dispatch<SetStateAction<T>>;
	children: ReactNode;
	className?: string;
};

export function Tabs<T extends string>({
	value,
	onChange,
	children,
	className = ''
}: TabsProps<T>) {
	return (
		<TabsContext.Provider value={{ value, onChange }}>
			<div
				className={`flex gap-2 border-b border-[#3a3a3a] ${className}`.trim()}
				role='tablist'
			>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

type TabProps = {
	value: string;
	children: ReactNode;
	className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'children'>;

export function Tab({
	value,
	children,
	className = '',
	...buttonProps
}: TabProps) {
	const ctx = useContext(TabsContext);
	if (!ctx) {
		throw new Error('Tab must be used within Tabs');
	}
	const { value: activeValue, onChange } = ctx;
	const isActive = activeValue === value;
	return (
		<button
			type='button'
			role='tab'
			aria-selected={isActive}
			onClick={() => onChange(value as typeof activeValue)}
			className={`px-4 py-2 font-semibold rounded-t transition-colors ${
				isActive
					? 'bg-[#fbf0df] text-[#1a1a1a]'
					: 'bg-[#2a2a2a] text-[#fbf0df] hover:bg-[#3a3a3a]'
			} ${className}`.trim()}
			{...buttonProps}
		>
			{children}
		</button>
	);
}
