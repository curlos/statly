import { useEffect, useRef, useState } from 'react';
import FocusRecordList from './FocusRecordList';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import Pagination from '../../../components/Pagination';
import Navbar from '../../../components/Navbar/Navbar';
import FilterBar from './FilterBar';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from './useUserSettingsContext';
import { getFocusDurationFromArray } from '../../../utils/focus-apps/focusRecords.utils';
import { getFormattedDuration } from '../../../utils/focus-apps/helpers.utils';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { useFilterFocusRecords } from './useFilterFocusRecords';
import { useThemeContext } from '../../../contexts/useThemeContext';

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

	const {
		focusRecordsPageSettings: {
			maxFocusRecordsPerPage,
			showTotalFocusDuration,
			filterOutUnrelatedTasksWhenTaskIdIsApplied,
			showTaskAncestors,
			taskIdIncludeFocusRecordsFromSubtasks,
		},
	} = useUserSettingsContext();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { ancestorTasksById } = fetchedTasks || {};

	const focusRecordListRef = useRef(null);
	const [totalPages, setTotalPages] = useState(null);

	// For Filter Sidebar and Filter Bar
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

	const { filteredFocusRecords, isLoadingGetFocusRecords, sortByOptions, allFocusRecordsAreHere } =
		useFilterFocusRecords();

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

	const getFilterBarHeaderContent = () => {
		const filterByTaskId = filterOutUnrelatedTasksWhenTaskIdIsApplied ? taskIdFromUrl : false;

		const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
		const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());

		const startDateFromUrlDate = new Date(startDateFromUrl);
		const endDateFromUrlDate = new Date(endDateFromUrl);

		const totalFocusDuration = getFocusDurationFromArray({
			focusRecords: filteredFocusRecords,
			onlyTasks: true,
			taskId: filterByTaskId,
			ancestorTasksById,
			showTaskAncestors,
			taskIdIncludeFocusRecordsFromSubtasks,
			startDate: startDateFromUrlDate,
			endDate: endDateFromUrlDate,
		});

		return (
			<h2 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
				Focus Records ({(filteredFocusRecords?.length || 0).toLocaleString()})
				{showTotalFocusDuration && ` - ${getFormattedDuration(totalFocusDuration, false)}`}
			</h2>
		);
	};

	const themeContext = useThemeContext();
	const { selectedLoaderCardImage } = themeContext;

	return (
		<div>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<Navbar />

				{allFocusRecordsAreHere && (
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
							{isLoadingGetFocusRecords ? (
								<div className="flex w-full h-full bg-color-gray-700 flex items-center justify-center">
									<div>
										<img src={selectedLoaderCardImage} className="h-[175px] animate-pulse" />
									</div>
								</div>
							) : (
								<FocusRecordList
									{...{
										filteredFocusRecords,
										sortBy,
										currentPage: currentPageFromUrl,
										sortByOptions,
										showFilterSidebar,
										setShowFilterSidebar,
										focusRecordListRef,
									}}
								/>
							)}
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
