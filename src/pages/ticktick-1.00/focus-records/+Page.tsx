import { useEffect, useRef, useState } from 'react';
import FocusRecordList from './FocusRecordList';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi';
import Pagination from '../../../components/Pagination';
import Navbar from '../../../components/Navbar/Navbar';
import FilterBar from './FilterBar';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from './useUserSettingsContext';
import useSticky from '../../../hooks/useSticky';
import {
	useGetSessionFocusRecordsQuery,
	useGetTodoistAllCompletedTasksQuery,
	useGetTodoistAllTasksByIdQuery,
} from '../../../services/resources/oldFocusAppsApi';

const Page = () => {
	return <FocusRecordsPage />;
};

const FocusRecordsPage = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();

	// Query Params
	const searchTextFromUrl = searchParams.get('search') || '';
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const taskIdFromUrl = searchParams.get('task-id');
	const projectsFromUrl = searchParams.get('projects');
	const currentPageFromUrl = searchParams.get('page') || 1;

	const { maxFocusRecordsPerPage } = useUserSettingsContext();

	// RTK Query - TickTick 1.0 - Focus Records
	const { data: fetchedFocusRecords, isLoading: isLoadingGetFocusRecords } =
		useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords } = fetchedFocusRecords || {};

	// RTK Query - Session App - Focus Records
	const { data: fetchedSessionFocusRecords, isLoading: isLoadingGetSessionFocusRecords } =
		useGetSessionFocusRecordsQuery();
	const { sessionFocusRecords } = fetchedSessionFocusRecords || {};

	// RTK Query - Todoist - All Completed Tasks
	const { data: fetchedTodoistAllTasksById } = useGetTodoistAllTasksByIdQuery();
	const { todoistAllTasksById } = fetchedTodoistAllTasksById || {};

	console.log(todoistAllTasksById);

	const focusRecordListRef = useRef(null);

	const [totalPages, setTotalPages] = useState(null);

	const defaultFocusRecords = focusRecords && sessionFocusRecords ? [...focusRecords, ...sessionFocusRecords] : [];

	const [filteredFocusRecords, setFilteredFocusRecords] = useState(defaultFocusRecords);

	// For Filter Sidebar and Filter Bar
	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	const [sortByOptions, setSortByOptions] = useState(DEFAULT_SORT_BY_OPTIONS);
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [filteredFocusRecords, sortBy, searchTextFromUrl, taskIdFromUrl, projectsFromUrl]);

	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [currentPageFromUrl]);

	useEffect(() => {
		if (isLoadingGetFocusRecords || !filteredFocusRecords) {
			return;
		}

		const newTotalPages = Math.ceil(filteredFocusRecords.length / maxFocusRecordsPerPage);
		setTotalPages(newTotalPages);
	}, [isLoadingGetFocusRecords, filteredFocusRecords, maxFocusRecordsPerPage]);

	const scrollableRef = useRef(null); // Reference to the scrollable container
	const stickyRef = useRef(null); // Reference to the sticky element

	const offsetY = maxFocusRecordsPerPage < 10 || !filteredFocusRecords || filteredFocusRecords.length < 10 ? 0 : 50;

	// TODO: offsetY should be set to 50 in the future but causing annoying issues at the moment so setting to 0.
	const isFilterBarSticky = useSticky(scrollableRef, stickyRef, true, 0); // Pass both refs to the hook

	return (
		<div ref={scrollableRef}>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<Navbar />

				{!isLoadingGetFocusRecords && !isLoadingGetSessionFocusRecords && (
					<FilterBar
						{...{
							// Passing in "sessionFocusRecords" for now to get this to work BUT later on should combine with TickTick 1.0 Focus Records.
							// TODO: Bring back TickTick 1.0 Focus Records after I'm done testing this with Session App Focus Records.
							defaultFocusRecords,
							filteredFocusRecords,
							setFilteredFocusRecords,
							setSortByOptions,
							showFilterSidebar,
							setShowFilterSidebar,
							DEFAULT_SORT_BY_OPTIONS,
							stickyRef,
							isFilterBarSticky,
						}}
					/>
				)}

				<div className="w-full flex flex-col">
					<div className="flex-1 flex justify-center bg-color-gray-700">
						<div className="container p-1">
							<FocusRecordList
								{...{
									filteredFocusRecords,
									isLoadingGetFocusRecords:
										isLoadingGetFocusRecords || isLoadingGetSessionFocusRecords,
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
