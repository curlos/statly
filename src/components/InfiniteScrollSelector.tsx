import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { useThemeContext } from '../contexts/useThemeContext';

interface InfiniteScrollSelectorProps<T extends string | number> {
	items: T[];
	unit?: string;
	selectedValue: T;
	setSelectedValue: React.Dispatch<React.SetStateAction<T>>;
}

const InfiniteScrollSelector = <T extends string | number>({ items, unit, selectedValue, setSelectedValue }: InfiniteScrollSelectorProps<T>) => {
	const { chosenColorObj } = useThemeContext();

	const scrollRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const scrollElement = scrollRef.current;
		if (!scrollElement) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = scrollElement;
			if (scrollTop + clientHeight >= scrollHeight) {
				// At bottom, reset to the middle
				scrollElement.scrollTop = scrollHeight / 3;
			} else if (scrollTop <= 0) {
				// At top, reset to the middle
				scrollElement.scrollTop = scrollHeight / 3 - clientHeight;
			}
		};

		// Add event listener
		scrollElement.addEventListener('scroll', handleScroll);

		// Calculate the middle and the index of the selected item in the middle third
		const itemsCopy = [...items, ...items, ...items]; // Triple the items
		const middleThirdStart = items.length; // Start of the middle third
		const selectedIndex = itemsCopy.indexOf(selectedValue, middleThirdStart); // Find index in the middle third
		const firstChild = scrollElement.firstChild?.firstChild as HTMLElement | null;
		const itemHeight = firstChild?.offsetHeight || 0; // Assuming each item has the same height

		// Scroll to the selected item
		if (selectedIndex >= 0 && itemHeight > 0) {
			const scrollTarget = itemHeight * selectedIndex;
			scrollElement.scrollTop = scrollTarget - scrollElement.clientHeight / 2 + itemHeight / 2;
		}

		// Remove event listener on cleanup
		return () => {
			if (scrollElement) {
				scrollElement.removeEventListener('scroll', handleScroll);
			}
		};
	}, [items, selectedValue]); // Depend on items and selectedValue to update scroll position when they change

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const currentIndex = items.indexOf(selectedValue);
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setSelectedValue(items[(currentIndex + 1) % items.length]);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setSelectedValue(items[(currentIndex - 1 + items.length) % items.length]);
		}
	};

	return (
		<div
			className="overflow-auto gray-scrollbar h-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
			ref={scrollRef}
			role="spinbutton"
			aria-label={unit}
			aria-valuenow={items.indexOf(selectedValue) + 1}
			aria-valuetext={String(selectedValue)}
			aria-valuemin={1}
			aria-valuemax={items.length}
			tabIndex={0}
			onKeyDown={handleKeyDown}
		>
			<div>
				{[...items, ...items, ...items].map((item, index) => (
					<div
						key={`${unit}-${index}`}
						aria-hidden="true"
						className={classNames(
							'text-center py-2 rounded cursor-pointer',
							selectedValue === item
								? chosenColorObj.bgColor
								: `bg-transparent ${chosenColorObj.hover.bgColorHalfOpacity}`
						)}
						onClick={() => setSelectedValue(item)}
					>
						{item}
					</div>
				))}
			</div>
		</div>
	);
};

export default InfiniteScrollSelector;
