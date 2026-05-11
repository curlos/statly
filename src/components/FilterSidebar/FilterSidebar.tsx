import { motion } from 'framer-motion';
import { useDialogFocus } from '../../hooks/useDialogFocus';
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
	const panelRef = useDialogFocus(isForModal, () => setIsOpen(false));
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

	const sharedMotionProps = {
		initial: 'hidden' as const,
		animate: 'visible' as const,
		exit: 'hidden' as const,
		variants: useSlidingMotion ? sidebarVariants : undefined,
		onClick: (e: React.MouseEvent) => e.stopPropagation(),
	};

	const baseClassName = classNames(
		'inset-y-0 bg-color-gray-700 text-white overflow-auto gray-scrollbar p-4',
		isForModal ? 'fixed right-0 w-[85%] max-w-[400px]' : ''
	);

	const innerContent = (
		<>
			<div className="flex justify-between items-center">
				<h2 id="filter-dialog-title" className="font-bold text-[18px]">{isFocusRecordsOrCompletedTasksPage ? 'Filter & Sort' : 'Filter'}</h2>
				<div className="flex items-center gap-3">
					{isAtLeastOneFilterApplied && (
						<button
							type="button"
							className="text-color-gray-25 hover:text-color-gray-25 underline cursor-pointer bg-transparent border-0 p-0"
							onClick={clearAllFilters}
						>
							Clear All
						</button>
					)}
					<button
						type="button"
						aria-label="Close filter panel"
						className="bg-transparent border-0 p-0 cursor-pointer"
						onClick={() => setIsOpen(false)}
					>
						<Icon
							name="close"
							fill={0}
							customClass={'text-color-gray-50 !text-[22px] hover:text-white bg-color-gray-600 rounded-2xl p-1'}
						/>
					</button>
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
		</>
	);

	if (isForModal) {
		return (
			<motion.dialog
				ref={panelRef as unknown as React.RefObject<HTMLDialogElement>}
				open
				tabIndex={-1}
				aria-labelledby="filter-dialog-title"
				{...sharedMotionProps}
				aria-modal="true"
				className={baseClassName + ' border-0 m-0 left-auto h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50'}
			>
				{innerContent}
			</motion.dialog>
		);
	}

	return (
		<motion.div ref={panelRef} {...sharedMotionProps} className={baseClassName}>
			{innerContent}
		</motion.div>
	);
};

export default FilterSidebar;
