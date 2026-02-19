import { Toggle } from '../ui/Toggle.js';

type ColumnVisibilityProps = {
	/** All column identifiers to show toggles for */
	columns: string[];
	/** Set of column identifiers that are currently visible */
	visibleColumns: Set<string>;
	/** Called when the user toggles a column's visibility */
	onVisibleColumnsChange: (visibleColumns: Set<string>) => void;
	/** Optional display names: columnId -> label (defaults to columnId) */
	columnLabels?: Record<string, string>;
	/** Optional class for the wrapper */
	className?: string;
};

/**
 * Renders a list of toggles to show/hide columns. Controlled: pass visibleColumns and onVisibleColumnsChange.
 */
export function ColumnVisibility({
	columns,
	visibleColumns,
	onVisibleColumnsChange,
	columnLabels,
	className = ''
}: ColumnVisibilityProps) {
	const setVisible = (columnId: string, visible: boolean) => {
		const next = new Set(visibleColumns);
		if (visible) {
			next.add(columnId);
		} else {
			next.delete(columnId);
		}
		onVisibleColumnsChange(next);
	};

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{columns.map((columnId) => (
				<Toggle
					key={columnId}
					id={`col-vis-${columnId}`}
					checked={visibleColumns.has(columnId)}
					onChange={(checked) => setVisible(columnId, checked)}
					label={columnLabels?.[columnId] ?? columnId}
				/>
			))}
		</div>
	);
}
