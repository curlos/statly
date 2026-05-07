import { motion } from 'framer-motion';
import Icon from '../Icon';
import DateRangeSection from './DateRangeSection';
import SearchSection from './SearchSection';
import SortBySection from './SortBySection';
import classNames from 'classnames';
import { useSearchParamsCustom } from '../../contexts/useSearchParamsContext';
import AppliedFilterItemList from '../../pages/focus-records/AppliedFilterItemList';
import CategoriesSection from './CategoriesSection';
import ShowRecordsFromFocusAppSection from './ShowRecordsFromFocusAppSection';
import ShowDaysFromToDoListAppSection from './ShowDaysFromToDoListAppSection';
import ProjectsTickTickSection from './ProjectsTickTickSection';
import ProjectsTodoistSection from './ProjectsTodoistSection';
import ShowRecordsFromEmotionSection from './ShowRecordsFromEmotionSection';
import GeneralFocusRecordsFilters from './GeneralFocusRecordsFilters';

interface FilterSidebarProps {
	setIsOpen: (isOpen: boolean) => void;
	sortByOptions?: string[];
	isForModal: boolean;
	page: string;
	useSlidingMotion?: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ setIsOpen, sortByOptions, isForModal, page, useSlidingMotion = true }) => {
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
		'interval-start-date',
		'interval-end-date',
		'projects',
		'projects-todoist',
		'categories',
		'date-interval',
		'emotions',
		'focus-apps',
		'to-do-list-apps',
		'general'
	];

	switch (page) {
		case 'focus-records-page':
			allPossibleFilterStrings.push('categories', 'focus-apps', 'emotions');
			break;
		case 'completed-tasks-page':
			allPossibleFilterStrings.push('to-do-list-apps', 'projects-todoist');
			break;
		case 'medals':
		case 'challenges':
		case 'stats':
			allPossibleFilterStrings.push('categories', 'focus-apps', 'to-do-list-apps', 'projects-todoist', 'emotions');
			break;
	}

	const clearAllFilters = () => {
		const emptyFiltersObj: Record<string, string> = {};

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

	const isFocusRecordsOrCompletedTasksPage = page === 'focus-records-page' || page === 'completed-tasks-page';

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			exit="hidden"
			variants={useSlidingMotion ? sidebarVariants : undefined}
			className={classNames(
				'inset-y-0 bg-color-gray-700 text-white overflow-auto gray-scrollbar p-4',
				isForModal ? 'fixed right-0 w-[85%] max-w-[400px]' : ''
			)}
			onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
		>
			<div className="flex justify-between items-center">
				<h2 className="font-bold text-[18px]">{isFocusRecordsOrCompletedTasksPage ? 'Filter & Sort' : 'Filter'}</h2>
				<div className="flex items-center gap-3">
					{isAtLeastOneFilterApplied && (
						<div
							className="text-color-gray-25 hover:text-color-gray-25 underline cursor-pointer"
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
					<hr className="border-color-gray-100 my-4" />
					<div>
						<h3 className="text-[16px] font-bold mb-2">APPLIED FILTERS</h3>
						<AppliedFilterItemList />
					</div>
				</>
			)}

			<hr className="border-color-gray-100 my-4" />
			<SearchSection />

			{isFocusRecordsOrCompletedTasksPage && sortByOptions && (
				<>
					<hr className="border-color-gray-100 my-4" />
					<SortBySection sortByOptions={sortByOptions} />
				</>
			)}

			<hr className="border-color-gray-100 my-4" />
			<DateRangeSection />

			{page !== 'completed-tasks-page' && (
				<>
					<ShowRecordsFromFocusAppSection />
				</>
			)}

			{page !== 'focus-records-page' && page !== 'focus-time-goal-page' && (
				<>
					<ShowDaysFromToDoListAppSection />
				</>
			)}

			<ProjectsTickTickSection page={page} />

			{page !== 'focus-records-page' && (
				<>
					<ProjectsTodoistSection />
				</>
			)}

			{page !== 'completed-tasks-page' && (
				<>
					<CategoriesSection />
				</>
			)}

			{page !== 'completed-tasks-page' && (
				<>
					<hr className="border-color-gray-100 my-4" />
					<ShowRecordsFromEmotionSection />
				</>
			)}

			{page !== 'completed-tasks-page' && (
				<>
					<hr className="border-color-gray-100 my-4" />
					<GeneralFocusRecordsFilters />
				</>
			)}
		</motion.div>
	);
};

export default FilterSidebar;
