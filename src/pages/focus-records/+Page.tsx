import { useEffect, useRef, useState } from 'react';
import FocusRecordList from './FocusRecordList';
import Pagination from '../../components/Pagination';
import Navbar from '../../components/Navbar/Navbar';
import FilterBar from './FilterBar';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from './useUserSettingsContext';
import { getFormattedDuration } from '../../utils/focus-apps/helpers.utils';
import { getFormattedShortMonthDay } from '../../utils/date.utils';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useGetFocusRecordsQuery } from '../../services/resources/documentsFocusRecordsApi';

const Page = () => {
	return <FocusRecordsPage />;
};

const FocusRecordsPage = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();

	// Query Params
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const currentPageFromUrl = searchParams.get('page') || 1;
	const taskIdFromUrl = searchParams.get('task-id');
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';
	const categoriesFromUrl = searchParams.get('categories') || '';
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';

	const {
		focusRecordsPageSettings: {
			maxFocusRecordsPerPage,
			showTotalFocusDuration,
			filterOutUnrelatedTasksWhenTaskIdIsApplied,
			showTaskAncestors,
			taskIdIncludeFocusRecordsFromSubtasks,
		},
	} = useUserSettingsContext();

	const { data: fetchedFocusRecords, isLoading, isFetching } = useGetFocusRecordsQuery({
		page: Number(currentPageFromUrl) - 1,
		// 'sort-by': sortBy,
		// 'start-date': startDateFromUrl,
		// 'end-date': endDateFromUrl,
		'projects-ticktick': projectsFromUrl,
		// 'task-id': taskIdFromUrl,
		// 'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
		// 'search': searchTextFromUrl
	});

	const { data: focusRecords, total, totalPages, totalDuration, onlyTasksDuration, ancestorTasksById } = fetchedFocusRecords || {};

	const focusRecordListRef = useRef(null);

	// For Filter Sidebar and Filter Bar
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	const sortByOptions = searchTextFromUrl ? ['Most Relevant', ...DEFAULT_SORT_BY_OPTIONS] : DEFAULT_SORT_BY_OPTIONS
	
	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [sortBy, searchTextFromUrl, taskIdFromUrl, projectsFromUrl]);

	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [currentPageFromUrl]);

	const getFilterBarHeaderContent = () => {
		// TODO: Will need this in a moment.
		// const filterByTaskId = filterOutUnrelatedTasksWhenTaskIdIsApplied ? taskIdFromUrl : false;

		return (
			<h2 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
				Focus Records ({(total)?.toLocaleString()})
				{showTotalFocusDuration && ` - ${getFormattedDuration(totalDuration, false)}`}
			</h2>
		);
	};

	const themeContext = useThemeContext();
	const { selectedLoaderCardImage } = themeContext;

	return (
		<div>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<Navbar />

				<FilterBar
					{...{
						isFetching,
						showFilterSidebar,
						setShowFilterSidebar,
						headerContent: getFilterBarHeaderContent(),
					}}
				/>

				<div className="w-full flex flex-col">
					<div className="flex-1 flex justify-center bg-color-gray-700">
						<div className="container p-1">
							<FocusRecordList
								{...{
									isFetching,
									focusRecords,
									sortBy,
									currentPage: currentPageFromUrl,
									sortByOptions,
									showFilterSidebar,
									setShowFilterSidebar,
									focusRecordListRef,
								}}
							/>
						</div>
					</div>

					{totalPages && totalPages > 0 ? (
						<div className="flex justify-center pt-1 pb-2 bg-color-gray-700">
							<Pagination
								total={totalPages}
								currentPage={!currentPageFromUrl ? 1 : Number(currentPageFromUrl)}
								setCurrentPage={(value) => {
									updateQueryParams({ page: value === 1 ? '' : value });
								}}
								totalPages={totalPages}
							/>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default Page;
