import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { useGetTodoistAllCompletedTasksQuery } from '../../../services/resources/oldFocusAppsApi';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import FilterBar from '../focus-records/FilterBar';
import Pagination from '../../../components/Pagination';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import CompletedTaskList from './CompletedTaskList';
import { useFilterCompletedTasks } from './useFilterCompletedTasks';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';

const getCompletedTasksByDate = (completedTasksGroupedByDate) => {
	return Object.keys(completedTasksGroupedByDate).map((dateStr) => {
		const completedTasksForDay = completedTasksGroupedByDate[dateStr];

		return {
			dateStr,
			completedTasksForDay,
		};
	});
};

const Page = () => {
	// For Filter Sidebar and Filter Bar
	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Completed Tasks: Most-Least', 'Completed Tasks: Least-Most'];
	const [sortByOptions, setSortByOptions] = useState(DEFAULT_SORT_BY_OPTIONS);
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const {
		completedTasksPageSettings: { maxDaysPerPage },
	} = useUserSettingsContext();

	// Query Params
	const searchTextFromUrl = searchParams.get('search') || '';
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const taskIdFromUrl = searchParams.get('task-id');
	const projectsFromUrl = searchParams.get('projects');
	const currentPageFromUrl = searchParams.get('page') || 1;

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { completedTasksGroupedByDate } = fetchedTasks || {};

	// RTK Query - Todoist - All Completed Tasks
	const { data: fetchedTodoistAllCompletedTasks } = useGetTodoistAllCompletedTasksQuery();
	const { todoistCompletedTasksGroupedByDate } = fetchedTodoistAllCompletedTasks || {};

	const allCompletedTasksAreHere = completedTasksGroupedByDate && todoistCompletedTasksGroupedByDate;

	const [totalPages, setTotalPages] = useState(null);

	const defaultDaysWithCompletedTasks = allCompletedTasksAreHere
		? getCompletedTasksByDate(completedTasksGroupedByDate)
		: [];
	const [filteredDaysWithCompletedTasks, setFilteredDaysWithCompletedTasks] = useState(defaultDaysWithCompletedTasks);

	const getFilterBarHeaderContent = () => {
		return (
			<h2 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
				Completed Tasks ({getNumOfCompletedTasks().toLocaleString()})
			</h2>
		);
	};

	const getNumOfCompletedTasks = () => {
		let numOfCompletedTasks = 0;

		filteredDaysWithCompletedTasks.forEach((dayWithCompletedTasks) => {
			const { completedTasksForDay } = dayWithCompletedTasks;
			numOfCompletedTasks += completedTasksForDay.length;
		});

		return numOfCompletedTasks;
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [filteredDaysWithCompletedTasks, sortBy, searchTextFromUrl, taskIdFromUrl, projectsFromUrl]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [currentPageFromUrl]);

	useEffect(() => {
		if (!allCompletedTasksAreHere) {
			return;
		}

		const newTotalPages = Math.ceil(filteredDaysWithCompletedTasks.length / maxDaysPerPage);
		setTotalPages(newTotalPages);
	}, [allCompletedTasksAreHere, filteredDaysWithCompletedTasks, maxDaysPerPage]);

	useFilterCompletedTasks({
		setFilteredDaysWithCompletedTasks,
		defaultDaysWithCompletedTasks,
		setSortByOptions,
		DEFAULT_SORT_BY_OPTIONS,
	});

	return (
		<div className="max-w-screen min-h-screen bg-color-gray-700">
			<Navbar />

			{allCompletedTasksAreHere && (
				<FilterBar
					{...{
						showFilterSidebar,
						setShowFilterSidebar,
						headerContent: getFilterBarHeaderContent(),
					}}
				/>
			)}

			<div className="w-full flex flex-col">
				<div className="flex-1 flex justify-center bg-color-gray-700">
					<div className="container p-1">
						<CompletedTaskList
							{...{
								filteredDaysWithCompletedTasks,
								allCompletedTasksAreHere,
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
