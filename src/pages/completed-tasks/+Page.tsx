import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import FilterBar from '../focus-records/FilterBar';
import Pagination from '../../components/Pagination';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import CompletedTaskList from './CompletedTaskList';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useGetDaysWithCompletedTasksQuery } from '../../services/resources/documentsTasksApi';
import { getFormattedShortMonthDay } from '../../utils/date.utils';

const Page = () => {
	// For Filter Sidebar and Filter Bar
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const {
		completedTasksPageSettings: { maxDaysPerPage, taskIdIncludeCompletedTasksFromSubtasks },
	} = useUserSettingsContext();

	// Query Params
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';
	const projectsTodoistFromUrl = searchParams.get('projects-todoist') || '';
	const toDoListAppsFromUrl = searchParams.get('to-do-list-apps') || '';
	const taskIdFromUrl = searchParams.get('task-id') || '';
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const currentPageFromUrl = searchParams.get('page') || 1;

	// const { filteredDaysWithCompletedTasks, sortByOptions, allCompletedTasksAreHere } = useFilterCompletedTasks();
	const { data: fetchedDaysWithCompletedTasks, isLoading, isFetching } = useGetDaysWithCompletedTasksQuery({
		page: Number(currentPageFromUrl) - 1,
		'sort-by': sortBy,
		'start-date': startDateFromUrl,
		'end-date': endDateFromUrl,
		'projects-ticktick': projectsFromUrl,
		'projects-todoist': projectsTodoistFromUrl,
		'max-days-per-page': maxDaysPerPage,
		'to-do-list-apps': toDoListAppsFromUrl,
		'task-id': taskIdFromUrl,
		'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
		'search': searchTextFromUrl
	});
	const { totalPages, data: daysWithCompletedTasks, ancestorTasksById } = fetchedDaysWithCompletedTasks || {}

	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Completed Tasks: Most-Least', 'Completed Tasks: Least-Most'];
	const sortByOptions = searchTextFromUrl ? ['Most Relevant', ...DEFAULT_SORT_BY_OPTIONS] : DEFAULT_SORT_BY_OPTIONS

	const getFilterBarHeaderContent = () => {
		return (
			<h2 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
				Completed Tasks {!isLoading && `(${(fetchedDaysWithCompletedTasks?.totalTasks).toLocaleString()})`}
			</h2>
		);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [fetchedDaysWithCompletedTasks, sortBy, searchTextFromUrl, taskIdFromUrl, projectsFromUrl]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [currentPageFromUrl]);

	return (
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
						<CompletedTaskList
							{...{
								daysWithCompletedTasks,
								ancestorTasksById,
								isFetching,
								sortBy,
								currentPage: currentPageFromUrl,
								sortByOptions,
								showFilterSidebar,
								setShowFilterSidebar,
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
	);
};

export default Page;
