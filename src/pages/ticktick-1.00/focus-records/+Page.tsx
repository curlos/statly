import { useEffect, useRef, useState } from 'react';
import FocusRecordList from './FocusRecordList';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi';
import Pagination from '../../../components/Pagination';
import Navbar from '../../../components/Navbar/Navbar';
import FilterBar from './FilterBar';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from './useUserSettingsContext';
import {
	useGetBeFocusedAppFocusRecordsQuery,
	useGetForestAppFocusRecordsQuery,
	useGetSessionAppFocusRecordsQuery,
	useGetTideAppFocusRecordsQuery,
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
		useGetSessionAppFocusRecordsQuery();
	const { sessionFocusRecords } = fetchedSessionFocusRecords || {};

	// RTK Query - BeFocused App - Focus Records
	const { data: fetchedBeFocusedAppFocusRecords, isLoading: isLoadingGetBeFocusedAppFocusRecords } =
		useGetBeFocusedAppFocusRecordsQuery();
	const { beFocusedAppFocusRecords } = fetchedBeFocusedAppFocusRecords || {};

	// RTK Query - Forest App - Focus Records
	const { data: fetchedForestAppFocusRecords, isLoading: isLoadingGetForestAppFocusRecords } =
		useGetForestAppFocusRecordsQuery();
	const { forestAppFocusRecords } = fetchedForestAppFocusRecords || {};

	// RTK Query - Tide App - Focus Records
	const { data: fetchedTideFocusRecords, isLoading: isLoadingGetTideFocusRecords } = useGetTideAppFocusRecordsQuery();
	const { tideAppFocusRecords } = fetchedTideFocusRecords || {};

	const focusRecordListRef = useRef(null);

	const [totalPages, setTotalPages] = useState(null);

	const allFocusRecordsAreHere =
		focusRecords && sessionFocusRecords && beFocusedAppFocusRecords && forestAppFocusRecords && tideAppFocusRecords;

	const defaultFocusRecords = allFocusRecordsAreHere
		? [
				...focusRecords,
				...sessionFocusRecords,
				...beFocusedAppFocusRecords,
				...forestAppFocusRecords,
				...tideAppFocusRecords,
			]
		: [];

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

	return (
		<div>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<Navbar />

				{allFocusRecordsAreHere && (
					<FilterBar
						{...{
							defaultFocusRecords,
							filteredFocusRecords,
							setFilteredFocusRecords,
							setSortByOptions,
							showFilterSidebar,
							setShowFilterSidebar,
							DEFAULT_SORT_BY_OPTIONS,
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
