import React, { useEffect, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import { DropdownProps } from '../../interfaces/interfaces';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

interface BaseDropdownProps extends DropdownProps {
	children: React.ReactNode;
	positionAdjustment?: string;
}

const Dropdown: React.FC<BaseDropdownProps> = ({
	children,
	isVisible,
	setIsVisible,
	customClasses,
	positionAdjustment,
	toggleRef,
	customStyling,
	innerClickElemRefs,
	addedAdditionalMargin,
	parentElemRef,
}) => {
	const dropdownRef = useRef<HTMLDivElement>(null);

	useOutsideClick(dropdownRef, toggleRef, innerClickElemRefs, () => {
		setIsVisible(false);
	});

	useEffect(() => {
		if (isVisible && dropdownRef.current) {
			const dropdownRect = dropdownRef.current.getBoundingClientRect();
			const toggleRect = toggleRef?.current?.getBoundingClientRect();
			const adjustments: Record<string, string> = {};

			// Find the closest scrollable parent container
			const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
				let parent = element?.parentElement;
				while (parent) {
					const style = window.getComputedStyle(parent);
					const overflow = style.overflow + style.overflowY + style.overflowX;
					if (overflow.includes('auto') || overflow.includes('scroll')) {
						return parent;
					}
					parent = parent.parentElement;
				}
				return null;
			};

			const scrollableParent = findScrollableParent(dropdownRef.current);

			// Determine the effective viewport (either scrollable parent or window)
			let effectiveBottom = window.innerHeight;
			let effectiveTop = 0;

			if (scrollableParent) {
				const scrollableRect = scrollableParent.getBoundingClientRect();
				// Use the minimum of scrollableRect.bottom and window.innerHeight
				// because the scrollable container might extend beyond the viewport
				effectiveBottom = Math.min(scrollableRect.bottom, window.innerHeight);
				effectiveTop = Math.max(scrollableRect.top, 0);
			}

			// Calculate available space above and below the toggle button
			const toggleBottom = toggleRect?.bottom || 0;
			const toggleTop = toggleRect?.top || 0;
			const spaceBelow = effectiveBottom - toggleBottom;
			const spaceAbove = toggleTop - effectiveTop;
			const dropdownHeight = dropdownRect.height;

			// Calculate where the dropdown bottom would be if opened below
			// Add small margin (4px from mt-[4px] in the className)
			const dropdownMargin = 4;
			const potentialDropdownBottom = toggleBottom + dropdownMargin + dropdownHeight;

			// Check if dropdown would be fully visible if opened below (without scrolling)
			const wouldBeFullyVisibleBelow = potentialDropdownBottom <= effectiveBottom;
			const doesntFitBelow = dropdownHeight > spaceBelow;

			// If dropdown doesn't fit below OR wouldn't be fully visible below
			if (doesntFitBelow || !wouldBeFullyVisibleBelow) {
				// Check if there's enough space above to show it there instead
				const enoughSpaceAbove = spaceAbove >= dropdownHeight;
				const moreSpaceAbove = spaceAbove > spaceBelow;

				// Prefer above if there's enough space OR if there's more space above
				if (enoughSpaceAbove || moreSpaceAbove) {
					// Position above the toggle button
					const paddingAboveRelativeButton = 20;
					const requiredMarginTop = -(
						dropdownRect.height +
						(toggleRect?.height || 0) +
						paddingAboveRelativeButton +
						(addedAdditionalMargin?.marginTop ? addedAdditionalMargin?.marginTop : 0)
					);
					adjustments.marginTop = `${requiredMarginTop}px`;

					// If dropdown is taller than available space above, constrain it
					if (dropdownRect.height > spaceAbove) {
						adjustments.marginTop = `${-spaceAbove}px`;
						adjustments.maxHeight = `${spaceAbove - 20}px`;
						adjustments.overflowY = 'auto';
					}
				} else {
					// Keep it below but constrain height if needed
					if (dropdownHeight > spaceBelow) {
						adjustments.maxHeight = `${spaceBelow - 20}px`;
						adjustments.overflowY = 'auto';
					}
				}
			}

			// Check if dropdown exceeds the right side of the viewport
			if (dropdownRect.right > window.innerWidth) {
				adjustments.right = '0px'; // Align right edge with the toggle element or adjust as necessary
				adjustments.left = 'auto'; // Reset left positioning if right adjustment is made
			} else if (parentElemRef) {
				// TODO: This is specifically for the Habit Details Calendar Tooltips on the Habit Details Modal. THis needs to work for everything though. Focus Records Add Task Modal should have a similar bug that needs to be fixed where the dropdown is being cut off by the parent container since it's in a modal.

				// Check if the dropdown has a parent container that wraps it and if it exceeds the position of that parent container. Will need to set it to a right value of the parent container I think. Need to test this out. pretty annoying to encounter this for Tooltips.
				const parentElemRect = parentElemRef?.current.getBoundingClientRect();
				// console.log(parentElemRect);

				if (dropdownRect.right > parentElemRect.right) {
					adjustments.left = `-${dropdownRect.width - 32}px`;
				}
			}

			// Apply styles directly to adjust the dropdown's positioning
			Object.assign(dropdownRef.current.style, adjustments);
		}
	}, [isVisible]);

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
						'absolute top-full left-0 z-50 text-white bg-color-gray-600 rounded-lg text-[14px] mt-[4px]',
						positionAdjustment || '',
						customClasses || ''
					)}
					style={customStyling || {}}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Dropdown;
