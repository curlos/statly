import { useEffect, useRef, useState } from 'react';
import FocusRecordList from './FocusRecordList';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi';
import Pagination from '../../../components/Pagination';
import Navbar from '../../../components/Navbar/Navbar';
import FilterBar from './FilterBar';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { UserSettingsProvider, useUserSettingsContext } from './useUserSettingsContext';
import useSticky from '../../../hooks/useSticky';

const Page = () => {
	return (
		<UserSettingsProvider>
			<FocusRecordsPage />
		</UserSettingsProvider>
	);
};

const FocusRecordsPage = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();

	// Query Params
	const searchTextFromUrl = searchParams.get('search') || '';
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const currentPageFromUrl = searchParams.get('page') || 1;

	const { maxFocusRecordsPerPage } = useUserSettingsContext();

	// RTK Query - TickTick 1.0 - Focus Records
	const { data: fetchedFocusRecords, isLoading: isLoadingGetFocusRecords } =
		useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords } = fetchedFocusRecords || {};

	const focusRecordListRef = useRef(null);

	const [totalPages, setTotalPages] = useState(null);

	const [filteredFocusRecords, setFilteredFocusRecords] = useState(focusRecords);

	// For Filter Sidebar and Filter Bar
	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	const [sortByOptions, setSortByOptions] = useState(DEFAULT_SORT_BY_OPTIONS);
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
		updateQueryParams({ page: '' });
	}, [filteredFocusRecords, sortBy, searchTextFromUrl]);

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
	const isFilterBarSticky = useSticky(scrollableRef, stickyRef, true); // Pass both refs to the hook

	return (
		<div ref={scrollableRef}>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<Navbar />

				<FilterBar
					{...{
						defaultFocusRecords: focusRecords,
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

				<div className="w-full flex flex-col">
					<div className="flex-1 flex justify-center bg-color-gray-700">
						<div className="container p-1">
							<FocusRecordList
								{...{
									filteredFocusRecords,
									isLoadingGetFocusRecords,
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
