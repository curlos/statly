import React, { useEffect, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { DropdownProps } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

interface BaseDropdownProps extends DropdownProps {
	children: React.ReactNode;
	positionAdjustment?: string;
	openUpward?: boolean;
}

const Dropdown: React.FC<BaseDropdownProps> = ({
	children,
	isVisible,
	setIsVisible,
	customClasses,
	positionAdjustment,
	toggleRef,
	innerClickElemRefs,
	parentElemRef,
	align,
	openUpward = false,
}) => {
	const dropdownRef = useRef<HTMLDivElement>(null);

	useOutsideClick(dropdownRef, toggleRef, innerClickElemRefs, () => {
		setIsVisible(false);
	});

	useEffect(() => {
		if (!isVisible) return;
		const el = dropdownRef.current;
		if (!el) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				setIsVisible(false);
				(toggleRef?.current as HTMLElement | null)?.focus();
				return;
			}
			if (e.key === 'Tab') {
				const focusable = Array.from(el.querySelectorAll<HTMLElement>(
					'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
				));
				if (e.shiftKey && document.activeElement === focusable[0]) {
					e.preventDefault();
					setIsVisible(false);
					(toggleRef?.current as HTMLElement | null)?.focus();
				} else if (!e.shiftKey && document.activeElement === focusable[focusable.length - 1]) {
					setIsVisible(false);
				}
			}
		};

		el.addEventListener('keydown', handleKeyDown);
		return () => el.removeEventListener('keydown', handleKeyDown);
	}, [isVisible, setIsVisible, toggleRef]);

	useEffect(() => {
		if (isVisible && dropdownRef.current) {
			const dropdownRect = dropdownRef.current.getBoundingClientRect();
			const toggleRect = (toggleRef?.current as HTMLElement | null)?.getBoundingClientRect();
			const adjustments: Record<string, string> = {};

			// Check if dropdown exceeds the bottom of the viewport or if forced to open upward
			// Use visualViewport for Safari/mobile to account for dynamic UI bars
			const viewportHeight = window.visualViewport?.height || window.innerHeight;
			const margin = 8; // Small buffer
			if (openUpward || dropdownRect.bottom > viewportHeight - margin) {
				// Position above the toggle button instead
				const dropdownHeight = dropdownRect.height;
				const toggleTop = toggleRect?.top || 0;
				const spaceAbove = toggleTop;

				// Always position above when there's no space below
				adjustments.top = 'auto';
				adjustments.bottom = '100%';
				adjustments.marginBottom = '4px';
				adjustments.marginTop = '0';

				// If dropdown is taller than space above, constrain it and make it scrollable
				if (dropdownHeight > spaceAbove - margin) {
					adjustments.maxHeight = `${spaceAbove - margin * 2}px`;
					adjustments.overflowY = 'auto';
				}
			}

			// Only do auto-detection for horizontal positioning if align prop is not provided
			if (!align) {
				// Check if dropdown exceeds the right side of the viewport
				const viewportWidth = window.visualViewport?.width || window.innerWidth;
				if (dropdownRect.right > viewportWidth - margin) {
					adjustments.right = '0';
					adjustments.left = 'auto';
				}

				// Handle parent container constraints if specified
				if (parentElemRef?.current) {
					const parentElemRect = parentElemRef.current.getBoundingClientRect();
					if (dropdownRect.right > parentElemRect.right) {
						adjustments.left = `-${dropdownRect.width - 32}px`;
					}
				}
			}

			// Apply styles directly to adjust the dropdown's positioning
			Object.assign(dropdownRef.current.style, adjustments);
		}
	}, [isVisible, toggleRef, parentElemRef, align, openUpward]);

	// Animation variants
	const variants = {
		hidden: {
			opacity: 0,
			scale: 0.95,
			transition: {
				duration: 0.2,
			},
		},
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.2,
			},
		},
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					ref={dropdownRef}
					initial="hidden"
					animate="visible"
					exit="hidden"
					variants={variants}
					className={classNames(
						'absolute top-full z-50 text-white bg-color-gray-600 rounded-lg text-[14px] mt-[4px]',
						align === 'right' ? 'right-0' : 'left-0',
						positionAdjustment || '',
						customClasses || ''
					)}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Dropdown;
