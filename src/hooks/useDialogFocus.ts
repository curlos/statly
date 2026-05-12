import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [role="button"]';

// Track the last focused element globally so modals can restore focus correctly
// even when the trigger lost focus before the modal appeared (e.g. a button
// disabled during an async operation) or lives inside another dialog.
// prev is captured before el.focus() fires, so it correctly points to the
// element that was active immediately before this modal opened.
let lastFocusedElement: HTMLElement | null = null;

if (typeof document !== 'undefined') {
	document.addEventListener('focus', (e: FocusEvent) => {
		const target = e.target as HTMLElement;
		// Only track elements in the natural tab order (tabIndex >= 0).
		// Elements with tabIndex=-1 are programmatic-only containers (modals, dialogs)
		// and should not overwrite the intended return-focus target.
		if (target !== document.body && target.tabIndex >= 0) {
			lastFocusedElement = target;
		}
	}, true);
}

export function useDialogFocus<T extends HTMLElement = HTMLDivElement>(active = true, onClose?: () => void) {
	const ref = useRef<T>(null);

	// Needed to stop React from bitching about onClose needing to be included in the dependency array.
	const onCloseRef = useRef(onClose);
	useEffect(() => { onCloseRef.current = onClose; });

	useEffect(() => {
		if (!active) return;

		// "el" will be the modal that took this hook's returned ref and attached it to itself, the modal.
		const el = ref.current;
		if (!el) return;

		// If a modal container is currently active (nested modal scenario), restore to it
		// directly — the global lastFocusedElement would point to something behind it.
		// Otherwise prefer lastFocusedElement over document.activeElement so focus
		// restores correctly even when the trigger was disabled during an async operation.
		const activeEl = document.activeElement as HTMLElement | null;
		const isModalContainer = activeEl?.tabIndex === -1 && activeEl?.getAttribute('aria-modal') === 'true';
		const prev = isModalContainer ? activeEl : (lastFocusedElement ?? activeEl);
		el.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				// If focus is inside a nested popup, let that element handle Escape first.
				const focused = document.activeElement;
				const nestedPopup = focused?.closest('[role="listbox"], [role="menu"], [role="combobox"], [role="dialog"]');
				if (nestedPopup && nestedPopup !== el) return;

				e.preventDefault();
				e.stopPropagation();
				onCloseRef.current?.();
				return;
			}

			if (e.key !== 'Tab') return;

			// Get all possible focusable elements in the modal.
			// Radio buttons: only the checked one (or first) in each name-group is in the
			// browser's tab order — the rest are arrow-key only. Filter accordingly so the
			// boundary check correctly identifies the last tab stop.
			const allFocusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
			const seenRadioGroups = new Map<string, HTMLInputElement>();
			for (const elem of allFocusable) {
				if (elem instanceof HTMLInputElement && elem.type === 'radio' && elem.name) {
					const existing = seenRadioGroups.get(elem.name);
					if (!existing || elem.checked) {
						seenRadioGroups.set(elem.name, elem);
					}
				}
			}
			const focusable = allFocusable.filter(elem => {
				if (elem instanceof HTMLInputElement && elem.type === 'radio' && elem.name) {
					return seenRadioGroups.get(elem.name) === elem;
				}
				return true;
			});
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			// -1 means focus is on a tabIndex=-1 element (non-tabbable) inside the dialog
			const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);

			// If we're pressing SHIFT + TAB, we must be going backwards (last to first) and thus if we get to the first element or the modal itself, wrap around to the last element.
			if (e.shiftKey) {
				if (currentIndex === 0 || currentIndex === -1 || document.activeElement === el) {
					e.preventDefault();
					last.focus();
				}
			// If we're pressing only TAB, we must be going forwards (first to last) and thus if we get to the last element or the modal itself, wrap around to the first element.
			} else {
				if (currentIndex === focusable.length - 1 || currentIndex === -1 || document.activeElement === el) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		// Add a listener that will only handle ESCAPE, TAB, or SHIFT + TAB.
		el.addEventListener('keydown', handleKeyDown);

		// Once the modal is closed, React will run this cleanup callback to re-focus on the button that the modal was opened from.
		// If prev was removed from the DOM (e.g. an async action unmounted its component),
		// fall back to whatever other open modal dialog is still present.
		return () => {
			el.removeEventListener('keydown', handleKeyDown);
			if (prev?.isConnected) {
				prev.focus();
			} else {
				const remaining = Array.from(document.querySelectorAll<HTMLElement>('[aria-modal="true"]'))
					.filter(m => m !== el);
				remaining.at(-1)?.focus();
			}
		};
	}, [active]);

	return ref;
}
