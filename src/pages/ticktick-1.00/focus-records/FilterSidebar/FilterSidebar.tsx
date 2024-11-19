import { motion } from 'framer-motion';
import Icon from '../../../../components/Icon';
import DateRangeSection from './DateRangeSection';
import OtherSection from './OtherSection';
import ProjectsSection from './ProjectsSection';
import SearchSection from './SearchSection';
import SortBySection from './SortBySection';
import classNames from 'classnames';
import { useSearchParamsCustom } from '../../../../contexts/useSearchParamsContext';
import AppliedFilterItemList from '../AppliedFilterItemList';
import CategoriesSection from './CategoriesSection';
import ShowRecordsFromFocusAppSection from './ShowRecordsFromFocusAppSection';

const FilterSidebar = ({ setIsOpen, sortByOptions, isForModal }) => {
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const { searchParams, updateQueryParams } = useSearchParamsCustom();

	const allPossibleFilterStrings = [
		'task-id',
		'sort-by',
		'search',
		'start-date',
		'end-date',
		'projects',
		'categories',
	];

	const clearAllFilters = () => {
		const emptyFiltersObj = {};

		allPossibleFilterStrings.forEach((filterName) => {
			emptyFiltersObj[filterName] = '';
		});

		updateQueryParams(emptyFiltersObj);
	};

	const atLeastOneFilterApplied = () => {
		return allPossibleFilterStrings.find((filterString) => {
			return searchParams.get(filterString);
		});
	};

	const isAtLeastOneFilterApplied = atLeastOneFilterApplied();

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			exit="hidden"
			variants={sidebarVariants}
			className={classNames(
				'inset-y-0 bg-color-gray-700 p-4 text-white overflow-auto gray-scrollbar',
				isForModal ? 'fixed right-0 w-[85%] max-w-[400px]' : ''
			)}
			onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
		>
			<div className="flex justify-between items-center">
				<h2 className="font-bold text-[18px]">Filter & Sort</h2>
				<div className="flex items-center gap-3">
					{isAtLeastOneFilterApplied && (
						<div
							className="text-color-gray-50 hover:text-color-gray-25 underline cursor-pointer"
							onClick={clearAllFilters}
						>
							Clear All
						</div>
					)}
					<Icon
						name="close"
						fill={0}
						customClass={
							'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer bg-color-gray-600 rounded-2xl p-1'
						}
						onClick={() => setIsOpen(false)}
					/>
				</div>
			</div>

			{isAtLeastOneFilterApplied && (
				<>
					<hr className="border-color-gray-200 my-4" />
					<div>
						<h3 className="text-[16px] font-bold mb-2">APPLIED FILTERS</h3>
						<AppliedFilterItemList />
					</div>
				</>
			)}

			<hr className="border-color-gray-200 my-4" />
			<SearchSection />

			<hr className="border-color-gray-200 my-4" />
			<SortBySection {...{ sortByOptions }} />

			<hr className="border-color-gray-200 my-4" />
			<DateRangeSection />

			<hr className="border-color-gray-200 my-4" />
			<OtherSection />

			<hr className="border-color-gray-200 my-4" />
			<ShowRecordsFromFocusAppSection />

			<hr className="border-color-gray-200 my-4" />
			<ProjectsSection />

			<hr className="border-color-gray-200 my-4" />
			<CategoriesSection />
		</motion.div>
	);
};

export default FilterSidebar;
