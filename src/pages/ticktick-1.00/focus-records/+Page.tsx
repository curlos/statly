import { useEffect, useRef, useState } from 'react';
import FocusRecordList from './FocusRecordList';
import useMaxHeight from '../../../hooks/useMaxHeight';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi';
import Pagination from '../../../components/Pagination';
import { MAX_SHOWN_FOCUS_RECORDS } from '../../../utils/constants.utils';
import Navbar from '../../../components/Navbar/Navbar';
import FilterBar from './FilterBar';
import { useGetUserSettingsQuery } from '../../../services/resources/userSettingsApi';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';

const Page = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();

	// Query Params
	const searchTextFromUrl = searchParams.get('search') || '';
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const currentPageFromUrl = searchParams.get('page') || 1;

	// RTK Query - TickTick 1.0 - Focus Records
	const { data: fetchedFocusRecords, isLoading: isLoadingGetFocusRecords } =
		useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords } = fetchedFocusRecords || {};

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const topHeaderRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(0);

	const focusRecordListRef = useRef(null);

	const maxHeight = useMaxHeight(headerHeight);

	const [totalPages, setTotalPages] = useState(null);

	const [filteredFocusRecords, setFilteredFocusRecords] = useState(focusRecords);
	const [showCompletedTasks, setShowCompletedTasks] = useState(true);
	const [showTotalFocusDuration, setShowTotalFocusDuration] = useState(true);

	// For Filter Sidebar and Filter Bar
	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	const [sortByOptions, setSortByOptions] = useState(DEFAULT_SORT_BY_OPTIONS);
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

	useEffect(() => {
		if (isLoadingGetUserSettings) {
			return;
		}

		const newShowCompletedTasks = userSettings?.tickTickOne?.pages?.focusRecords?.showCompletedTasks;
		const newShowTotalFocusDuration = userSettings?.tickTickOne?.pages?.focusRecords?.showTotalFocusDuration;

		if (newShowCompletedTasks !== undefined) {
			setShowCompletedTasks(newShowCompletedTasks);
		}

		if (newShowTotalFocusDuration !== undefined) {
			setShowTotalFocusDuration(newShowTotalFocusDuration);
		}
	}, [userSettings]);

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

		const newTotalPages = Math.ceil(filteredFocusRecords.length / MAX_SHOWN_FOCUS_RECORDS);
		setTotalPages(newTotalPages);
	}, [isLoadingGetFocusRecords, filteredFocusRecords]);

	return (
		<div className="max-w-screen min-h-screen max-h-screen bg-color-gray-700">
			<Navbar {...{ topHeaderRef, setHeaderHeight }} />

			<div
				ref={focusRecordListRef}
				className="w-full flex flex-col overflow-scroll gray-scrollbar"
				style={{ maxHeight }}
			>
				<FilterBar
					{...{
						defaultFocusRecords: focusRecords,
						filteredFocusRecords,
						setFilteredFocusRecords,
						showTotalFocusDuration,
						setSortByOptions,
						showFilterSidebar,
						setShowFilterSidebar,
						DEFAULT_SORT_BY_OPTIONS,
					}}
				/>

				<div className="flex-1 flex justify-center">
					<div className="container p-1">
						<FocusRecordList
							{...{
								filteredFocusRecords,
								isLoadingGetFocusRecords,
								sortBy,
								currentPage: currentPageFromUrl,
								showCompletedTasks,
								setShowCompletedTasks,
								showTotalFocusDuration,
								setShowTotalFocusDuration,
								sortByOptions,
								showFilterSidebar,
								setShowFilterSidebar,
								focusRecordListRef,
							}}
						/>
					</div>
				</div>

				{totalPages && totalPages > 0 ? (
					<div className="flex justify-center pt-1 pb-2">
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
