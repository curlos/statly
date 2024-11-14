import { useEffect, useRef, useState } from 'react';
import GroupedFocusRecordList from './GroupedFocusRecordList';
import useMaxHeight from '../../../hooks/useMaxHeight';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi';
import { usePageContext } from 'vike-react/usePageContext';
import Pagination from '../../../components/Pagination';
import { MAX_SHOWN_FOCUS_RECORDS } from '../../../utils/constants.utils';
import Navbar from '../../../components/Navbar/Navbar';
import FilterBar from './FilterBar';
import { useGetUserSettingsQuery } from '../../../services/resources/userSettingsApi';

const Page = () => {
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;
	const queryParams = new URLSearchParams(location.search);

	// Query Params
	const sortBy = queryParams.get('sort-by') || 'Newest';
	const searchTextFromUrl = queryParams.get('search') || '';
	const startDateUrlStr = queryParams.get('start-date');
	const endDateUrlStr = queryParams.get('end-date');

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
	const [groupedBy, setGroupedBy] = useState('No Group');
	const [searchText, setSearchText] = useState(searchTextFromUrl);

	// Filter by Date Range
	const [startDate, setStartDate] = useState(
		startDateUrlStr ? new Date(startDateUrlStr) : new Date('November 2, 2020')
	);
	const [endDate, setEndDate] = useState(endDateUrlStr ? new Date(endDateUrlStr) : new Date());

	const maxHeight = useMaxHeight(headerHeight);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(null);

	const [filteredFocusRecords, setFilteredFocusRecords] = useState(focusRecords);
	const [showCompletedTasks, setShowCompletedTasks] = useState(true);

	useEffect(() => {
		if (isLoadingGetUserSettings) {
			return;
		}

		const newShowCompletedTasks = userSettings?.tickTickOne?.pages?.focusRecords?.showCompletedTasks;

		if (newShowCompletedTasks !== undefined) {
			setShowCompletedTasks(newShowCompletedTasks);
		}
	}, [userSettings]);

	useEffect(() => {
		focusRecordListRef?.current?.scrollTo(0, 0);
		setCurrentPage(1);
	}, [filteredFocusRecords, groupedBy, sortBy, searchText]);

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
						groupedBy,
						setGroupedBy,
						sortBy,
						currentPage,
						setCurrentPage,
						totalPages,
						defaultFocusRecords: focusRecords,
						filteredFocusRecords,
						setFilteredFocusRecords,
						focusRecordListRef,
						searchText,
						setSearchText,
						showCompletedTasks,
						setShowCompletedTasks,
						startDate,
						setStartDate,
						endDate,
						setEndDate,
					}}
				/>

				<div className="flex-1 flex justify-center">
					<div className="container p-1">
						<GroupedFocusRecordList
							{...{
								filteredFocusRecords,
								isLoadingGetFocusRecords,
								groupedBy,
								sortBy,
								currentPage,
								setCurrentPage,
								totalPages,
								setTotalPages,
								showCompletedTasks,
							}}
						/>
					</div>
				</div>

				{totalPages && totalPages > 0 ? (
					<div className="flex justify-center pt-1 pb-2">
						<Pagination
							total={totalPages}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							totalPages={totalPages}
						/>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default Page;
