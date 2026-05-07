import React, { useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown/Dropdown';
import { DropdownProps } from '../interfaces/interfaces';
import classNames from 'classnames';
import CustomInput from './CustomInput';
import useWindowSize from '../hooks/useWindowSize';
import { useThemeContext } from '../contexts/useThemeContext';

interface PaginationProps {
	total: number; // Total number of pages
	currentPage: number; // Current page number
	setCurrentPage: (page: number) => void; // Function to call when a new page is selected
	totalPages: number;
	compactView?: boolean; // If true, shows fewer page numbers (7 max on desktop, 5 on <992px, 3 on <768px)
}

const Pagination: React.FC<PaginationProps> = ({ total, currentPage, setCurrentPage, totalPages, compactView = false }) => {
	const { chosenColorObj } = useThemeContext();
	const { width } = useWindowSize();

	const [numPagesToShow, setNumPagesToShow] = useState(compactView ? 7 : 9); // Maximum number of pages to display in the paginator

	useEffect(() => {
		if (!width) return;

		if (compactView) {
			// Compact view: max 7 on desktop, 5 on <992px, 3 on <768px, 2 on 576-620px
			if (width < 768) {
				setNumPagesToShow(1);
			} else {
				setNumPagesToShow(3);
			}
		} else {
			// Default view: max 9 on desktop
			if (width < 400) {
				setNumPagesToShow(1);
			} else if (width < 576) {
				setNumPagesToShow(3);
			} else if (width < 768) {
				setNumPagesToShow(5);
			} else if (width < 992) {
				setNumPagesToShow(7);
			} else {
				setNumPagesToShow(9);
			}
		}
	}, [width, compactView]);

	// Generate the list of page numbers to display
	const getPages = (): number[] => {
		const pages: number[] = [];
		const halfWay = Math.floor(numPagesToShow / 2);

		let lowerBound = currentPage - halfWay;
		let upperBound = currentPage + halfWay;

		// Adjust bounds if the current page is close to either end
		if (lowerBound < 1) {
			upperBound = Math.min(numPagesToShow, total);
			lowerBound = 1;
		}
		if (upperBound > total) {
			upperBound = total;
			lowerBound = Math.max(total - numPagesToShow + 1, 1);
		}

		for (let i = lowerBound; i <= upperBound; i++) {
			pages.push(i);
		}
		return pages;
	};

	const pages = getPages();

	return (
		<div className="flex items-center space-x-1 sm:space-x-2">
			<button
				className={classNames(
					'p-2 rounded',
					currentPage === 1 ? 'cursor-not-allowed opacity-50' : chosenColorObj.hover.bgColorHalfOpacity
				)}
				disabled={currentPage === 1}
				onClick={() => setCurrentPage(1)}
			>
				{'<<'}
			</button>
			<button
				className={classNames(
					'p-1 sm:p-2 rounded',
					currentPage === 1 ? 'cursor-not-allowed opacity-50' : chosenColorObj.hover.bgColorHalfOpacity
				)}
				disabled={currentPage === 1}
				onClick={() => setCurrentPage(currentPage - 1)}
			>
				{'<'}
			</button>
			{currentPage > numPagesToShow / 2 + 1 && pages[0] !== 1 && (
				<>
					<button className="px-2 py-1" onClick={() => setCurrentPage(1)}>
						1
					</button>
					{currentPage > numPagesToShow / 2 + 2 && (
						<InBetweenPages {...{ currentPage, setCurrentPage, totalPages }} />
					)}
				</>
			)}
			{pages.map((page) =>
				page === currentPage ? (
					<button
						key={page}
						className={classNames('px-2 py-1 rounded text-white', chosenColorObj.bgColor)}
						onClick={() => setCurrentPage(page)}
					>
						{page}
					</button>
				) : (
					<button
						key={page}
						className={classNames('px-2 py-1 rounded', chosenColorObj.hover.bgColorHalfOpacity)}
						onClick={() => setCurrentPage(page)}
					>
						{page}
					</button>
				)
			)}
			{currentPage < total - numPagesToShow / 2 && pages[pages.length - 1] !== total && (
				<>
					{currentPage < total - numPagesToShow / 2 - 1 && (
						<InBetweenPages {...{ currentPage, setCurrentPage, totalPages }} />
					)}
					<button className="px-2 py-1" onClick={() => setCurrentPage(total)}>
						{total}
					</button>
				</>
			)}
			<button
				className={classNames(
					'p-2 rounded',
					currentPage === total ? 'cursor-not-allowed opacity-50' : chosenColorObj.hover.bgColorHalfOpacity
				)}
				disabled={currentPage === total}
				onClick={() => setCurrentPage(currentPage + 1)}
			>
				{'>'}
			</button>
			<button
				className={classNames(
					`p-2 rounded`,
					currentPage === total ? 'cursor-not-allowed opacity-50' : chosenColorObj.hover.bgColorHalfOpacity
				)}
				disabled={currentPage === total}
				onClick={() => setCurrentPage(total)}
			>
				{'>>'}
			</button>
		</div>
	);
};

interface InBetweenPagesProps {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	totalPages: number;
}

const InBetweenPages: React.FC<InBetweenPagesProps> = ({ currentPage, setCurrentPage, totalPages }) => {
	const drodpownCustomPageNumberRef = useRef(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);

	return (
		<div className="relative">
			<span
				ref={drodpownCustomPageNumberRef}
				onClick={() => setIsDropdownVisible(!isDropdownVisible)}
				className="px-2 py-1 cursor-pointer"
			>
				...
			</span>

			<DropdownCustomPageNumber
				toggleRef={drodpownCustomPageNumberRef}
				isVisible={isDropdownVisible}
				setIsVisible={setIsDropdownVisible}
				{...{ currentPage, setCurrentPage, totalPages }}
			/>
		</div>
	);
};

interface DropdownCustomPageNumberProps extends DropdownProps {
	currentPage: number;
	setCurrentPage: (page: number) => void;
	totalPages: number;
}

const DropdownCustomPageNumber: React.FC<DropdownCustomPageNumberProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	customClasses,
	currentPage,
	setCurrentPage,
	totalPages,
}) => {
	const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

	useEffect(() => {
		setLocalCurrentPage(currentPage);
	}, [currentPage]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsVisible(false);

		const pageNumber = Number(localCurrentPage);

		if (currentPage === pageNumber) {
			return;
		}

		setCurrentPage(pageNumber);
	};

	const { chosenColorObj, nextDarkestColorObj } = useThemeContext();

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('shadow-2xl border border-color-gray-100 rounded-lg', customClasses)}
			openUpward={true}
		>
			<form onSubmit={handleSubmit} className="p-2 w-[80px]">
				<CustomInput
					value={localCurrentPage}
					setValue={setLocalCurrentPage as React.Dispatch<React.SetStateAction<string | number>>}
					type="number"
					min={1}
					max={totalPages}
					required={true}
				/>
				<button
					type="submit"
					className={classNames(
						'mt-2 w-full rounded-md py-1 cursor-pointer p-3',
						chosenColorObj.bgColor,
						(nextDarkestColorObj || chosenColorObj).hover.bgColor
					)}
				>
					Ok
				</button>
			</form>
		</Dropdown>
	);
};

export default Pagination;
