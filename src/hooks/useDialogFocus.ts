import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
		
		// For a modal to be opened, the user must be focused on a button to open it. Store this button element in "prev" to re-focus on it later on once the modal is closed.
		const prev = document.activeElement as HTMLElement | null;
		el.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				onCloseRef.current?.();
				return;
			}

			if (e.key !== 'Tab') return;
			
			// Get all possible focusable elements in the modal.
			const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
			if (focusable.length === 0) return;

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			
			// If we're pressing SHIFT + TAB, we must be going backwards (last to first) and thus if we get to the first element or the modal itself, wrap around to the last element.
			if (e.shiftKey) {
				if (document.activeElement === first || document.activeElement === el) {
					e.preventDefault();
					last.focus();
				}
			// If we're pressing only TAB, we must be going forwards (first to last) and thus if we get to the last element or the modal itself, wrap around to the first element.
			} else {
				if (document.activeElement === last || document.activeElement === el) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		
		// Add a listener that will only handle ESCAPE, TAB, or SHIFT + TAB.
		el.addEventListener('keydown', handleKeyDown);

		// Once the modal is closed, React will run this cleanup callback to re-focus on the button that the modal was opened from.
		return () => {
			el.removeEventListener('keydown', handleKeyDown);
			prev?.focus();
		};
	}, [active]);

	return ref;
}
