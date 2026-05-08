import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import FilterBar from '../focus-records/FilterBar';
import Pagination from '../../components/Pagination';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import CompletedTaskList from './CompletedTaskList';
import { useDaysWithCompletedTasksQuery } from './useDaysWithCompletedTasksQuery';

const Page = () => {
	// For Filter Sidebar and Filter Bar
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);
	const { updateQueryParams } = useSearchParamsContext();
	const {
		fetchedDaysWithCompletedTasks,
		totalPages,
		daysWithCompletedTasks,
		ancestorTasksById,
		isLoading,
		isFetching,
		searchTextFromUrl,
		projectsFromUrl,
		taskIdFromUrl,
		sortBy,
		currentPageFromUrl
	} = useDaysWithCompletedTasksQuery();

	const sortByOptions = ['Newest', 'Oldest', 'Completed Tasks: Most-Least', 'Completed Tasks: Least-Most']

	const getFilterBarHeaderContent = () => {
		return (
			<h2 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
				Completed Tasks {!isLoading && `(${(fetchedDaysWithCompletedTasks?.totalTasks)?.toLocaleString() || 0})`}
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
		<div className="max-w-screen min-h-screen bg-color-gray-700 pb-10">
			<Navbar page="completed-tasks-page" />

			<main id="main-content" tabIndex={-1} className="outline-none">
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
								daysWithCompletedTasks: daysWithCompletedTasks || [],
								ancestorTasksById: ancestorTasksById || {},
								isFetching,
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
								updateQueryParams({ page: value === 1 ? '' : String(value) });
							}}
							totalPages={totalPages}
						/>
					</div>
				) : null}
			</div>
			</main>
		</div>
	);
};

export default Page;
