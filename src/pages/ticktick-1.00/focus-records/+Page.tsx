import { useEffect, useRef, useState } from 'react';
import GroupedFocusRecordList from './GroupedFocusRecordList';
import TopHeader from './TopHeader';
import useMaxHeight from '../../../hooks/useMaxHeight';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi';
import { usePageContext } from 'vike-react/usePageContext';
import Pagination from '../../../components/Pagination';
import { MAX_SHOWN_FOCUS_RECORDS } from '../../../utils/constants.utils';
import SidebarButtonAndModal from '../../../components/SidebarModal/SidebarButtonAndModal';

const Page = () => {
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;
	const queryParams = new URLSearchParams(location.search);
	const taskIdToFilterBy = queryParams.get('taskId');
	const defaultSortedBy = queryParams.get('sortBy') || 'Newest';
	const defaultSearchText = queryParams.get('search') || '';

	// RTK Query - TickTick 1.0 - Focus Records
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingGetFocusRecords,
		error: errorGetFocusRecords,
	} = useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords } = fetchedFocusRecords || {};

	const topHeaderRef = useRef(null);
	const [headerHeight, setHeaderHeight] = useState(0);

	const focusRecordListRef = useRef(null);
	const [groupedBy, setGroupedBy] = useState('No Group');
	const [sortedBy, setSortedBy] = useState(defaultSortedBy);
	const [searchText, setSearchText] = useState(defaultSearchText);

	const maxHeight = useMaxHeight(headerHeight);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(null);

	const [filteredFocusRecords, setFilteredFocusRecords] = useState(focusRecords);

	useEffect(() => {
		// Scroll to the top of the focus records whenever you go to a new page.
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [currentPage, groupedBy, sortedBy, searchText]);

	useEffect(() => {
		setCurrentPage(1);
	}, [groupedBy, sortedBy, searchText]);

	useEffect(() => {
		if (isLoadingGetFocusRecords || !filteredFocusRecords) {
			return;
		}

		const newTotalPages = Math.ceil(filteredFocusRecords.length / MAX_SHOWN_FOCUS_RECORDS);
		setTotalPages(newTotalPages);
	}, [isLoadingGetFocusRecords, filteredFocusRecords]);

	useEffect(() => {
		if (!taskIdToFilterBy) {
			setFilteredFocusRecords(focusRecords);
		} else {
			const taskIdToFilterByStr = String(taskIdToFilterBy);
			const focusRecordsThatContainTaskId = focusRecords?.filter((focusRecord) => {
				if (!focusRecord.tasks || focusRecord.tasks.length === 0) {
					return false;
				}

				const { tasks } = focusRecord;

				return tasks.find((task) => String(task.taskId) === taskIdToFilterByStr);
			});

			setFilteredFocusRecords(focusRecordsThatContainTaskId || []);
		}
	}, [focusRecords, taskIdToFilterBy]);

	return (
		<div className="flex max-w-screen min-h-screen max-h-screen bg-color-gray-700">
			<div className="w-full flex flex-col overflow-scroll gray-scrollbar">
				<TopHeader
					{...{
						topHeaderRef,
						headerHeight,
						setHeaderHeight,
						groupedBy,
						setGroupedBy,
						sortedBy,
						setSortedBy,
						currentPage,
						setCurrentPage,
						totalPages,
						defaultFocusRecords: focusRecords,
						filteredFocusRecords,
						setFilteredFocusRecords,
						focusRecordListRef,
						defaultSortedBy,
						searchText,
						setSearchText,
					}}
				/>

				<div ref={focusRecordListRef} className="flex-1 flex justify-center" style={{ maxHeight }}>
					<div className="container p-1">
						<GroupedFocusRecordList
							{...{
								filteredFocusRecords,
								isLoadingGetFocusRecords,
								groupedBy,
								sortedBy,
								currentPage,
								setCurrentPage,
								totalPages,
								setTotalPages,
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
