import {
	useRef,
	useState,
	useEffect,
	useLayoutEffect,
	useCallback,
	cloneElement,
	isValidElement,
	type ReactElement,
	type ReactNode
} from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE_SELECTOR =
	'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
	return Array.from(
		container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
	);
}

export type PopOverProps = {
	/** Whether the popover is open */
	open: boolean;
	/** Called when the popover should open or close */
	onOpenChange: (open: boolean) => void;
	/** The element that opens the popover (single React element; ref and onClick are merged in) */
	trigger: ReactElement;
	/** Popover panel content */
	children: ReactNode;
	/** Optional class for the panel wrapper */
	className?: string;
	/** Optional id for the panel (for aria-labelledby from trigger) */
	id?: string;
	/** Placement relative to trigger */
	placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
	/** Gap in px between trigger and panel */
	gap?: number;
};

/**
 * Reusable popover: click-outside and Escape close; focus is trapped and returned to trigger.
 * Renders panel in a portal, positioned relative to the trigger.
 */
export function PopOver({
	open,
	onOpenChange,
	trigger,
	children,
	className = '',
	id,
	placement = 'bottom-start',
	gap = 4
}: PopOverProps) {
	const triggerRef = useRef<HTMLElement | null>(null);
	const panelRef = useRef<HTMLDivElement | null>(null);
	const [position, setPosition] = useState({ top: 0, left: 0 });
	const previousActiveElementRef = useRef<HTMLElement | null>(null);

	const updatePosition = useCallback(() => {
		const el = triggerRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const g = gap;
		switch (placement) {
			case 'bottom-start':
				setPosition({ top: rect.bottom + g, left: rect.left });
				break;
			case 'bottom-end':
				setPosition({ top: rect.bottom + g, left: rect.right });
				break;
			case 'top-start':
				setPosition({ top: rect.top - g, left: rect.left });
				break;
			case 'top-end':
				setPosition({ top: rect.top - g, left: rect.right });
				break;
		}
	}, [placement, gap]);

	// Position panel when open (and on resize/scroll so it stays aligned)
	useLayoutEffect(() => {
		if (!open) return;
		updatePosition();
		const onUpdate = () => updatePosition();
		window.addEventListener('scroll', onUpdate, true);
		window.addEventListener('resize', onUpdate);
		return () => {
			window.removeEventListener('scroll', onUpdate, true);
			window.removeEventListener('resize', onUpdate);
		};
	}, [open, updatePosition]);

	// Click outside: close when mousedown happens outside trigger and panel
	useEffect(() => {
		if (!open) return;
		const onMouseDown = (e: MouseEvent) => {
			const target = e.target as Node;
			if (
				triggerRef.current?.contains(target) ||
				panelRef.current?.contains(target)
			) {
				return;
			}
			onOpenChange(false);
		};
		document.addEventListener('mousedown', onMouseDown);
		return () => document.removeEventListener('mousedown', onMouseDown);
	}, [open, onOpenChange]);

	// Escape: close on Escape key
	useEffect(() => {
		if (!open) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			e.preventDefault();
			onOpenChange(false);
		};
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [open, onOpenChange]);

	// Focus: save active element when opening, focus first focusable in panel, restore on close
	useEffect(() => {
		if (open) {
			previousActiveElementRef.current =
				document.activeElement as HTMLElement | null;
			// Focus after paint so panel is in DOM
			const t = setTimeout(() => {
				const panel = panelRef.current;
				if (!panel) return;
				const focusable = getFocusableElements(panel);
				if (focusable.length > 0) {
					focusable[0]!.focus();
				} else {
					panel.focus();
				}
			}, 0);
			return () => clearTimeout(t);
		} else {
			previousActiveElementRef.current?.focus?.();
			previousActiveElementRef.current = null;
		}
	}, [open]);

	// Focus trap: keep Tab/Shift+Tab inside panel
	useEffect(() => {
		if (!open) return;
		const panel = panelRef.current;
		if (!panel) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Tab') return;
			const focusable = getFocusableElements(panel);
			if (focusable.length === 0) return;

			const first = focusable[0]!;
			const last = focusable[focusable.length - 1]!;
			const active = document.activeElement as HTMLElement | null;

			if (e.shiftKey) {
				if (active === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (active === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		panel.addEventListener('keydown', onKeyDown);
		return () => panel.removeEventListener('keydown', onKeyDown);
	}, [open]);

	const triggerWithRefAndClick = isValidElement(trigger)
		? cloneElement(trigger, {
				ref: (el: HTMLElement | null) => {
					triggerRef.current = el;
					const r = (trigger as ReactElement & { ref?: unknown }).ref;
					if (typeof r === 'function') r(el);
					else if (r != null)
						(r as React.RefObject<HTMLElement | null>).current = el;
				},
				onClick: (e: React.MouseEvent) => {
					(
						trigger.props as {
							onClick?: (e: React.MouseEvent) => void;
						}
					).onClick?.(e);
					onOpenChange(!open);
				}
		  } as Record<string, unknown>)
		: trigger;

	const { top: t, left: l } = position;
	// prettier-ignore
	const style: React.CSSProperties =
		placement === 'bottom-start'
			? { top: t, left: l }
			: placement === 'bottom-end'
				? { top: t, left: l, transform: 'translateX(-100%)' }
				: placement === 'top-start'
					? {
							bottom:
								typeof window !== 'undefined'
									? window.innerHeight - t
									: 0,
							left: l
					}
					: {
							bottom:
								typeof window !== 'undefined'
									? window.innerHeight - t
									: 0,
							left: l,
							transform: 'translateX(-100%)'
					};

	const panel = open ? (
		<div
			ref={panelRef}
			id={id}
			role='dialog'
			aria-modal='true'
			tabIndex={-1}
			className={`absolute z-50 min-w-32 rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] p-2 shadow-lg outline-none ${className}`}
			style={{
				position: 'fixed',
				...style
			}}
		>
			{children}
		</div>
	) : null;

	return (
		<>
			{triggerWithRefAndClick}
			{open && panel != null ? createPortal(panel, document.body) : null}
		</>
	);
}
