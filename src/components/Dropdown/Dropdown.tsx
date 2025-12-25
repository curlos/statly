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
		if (isVisible && dropdownRef.current) {
			const dropdownRect = dropdownRef.current.getBoundingClientRect();
			const toggleRect = (toggleRef?.current as HTMLElement | null)?.getBoundingClientRect();
			const adjustments: Record<string, string> = {};

			// Check if dropdown exceeds the bottom of the viewport or if forced to open upward
			const margin = 8; // Small buffer
			if (openUpward || dropdownRect.bottom > window.innerHeight - margin) {
				// Position above the toggle button instead
				const dropdownHeight = dropdownRect.height;
				const toggleTop = toggleRect?.top || 0;
				const spaceAbove = toggleTop;

				if (spaceAbove >= dropdownHeight || openUpward) {
					// Enough space above - position it there (or forced to open upward)
					adjustments.top = 'auto';
					adjustments.bottom = '100%';
					adjustments.marginBottom = '4px';
					adjustments.marginTop = '0';
				} else {
					// Not enough space above - constrain height and add scroll
					adjustments.maxHeight = `${Math.max(spaceAbove, window.innerHeight - dropdownRect.bottom) - margin * 2}px`;
					adjustments.overflowY = 'auto';
				}
			}

			// Only do auto-detection for horizontal positioning if align prop is not provided
			if (!align) {
				// Check if dropdown exceeds the right side of the viewport
				if (dropdownRect.right > window.innerWidth - margin) {
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
