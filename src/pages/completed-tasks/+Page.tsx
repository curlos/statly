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
