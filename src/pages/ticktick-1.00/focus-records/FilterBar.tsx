import { useEffect, useState } from 'react';
import Icon from '../../../components/Icon';
import Fuse from 'fuse.js';
import { debounce } from '../../../utils/helpers.utils';
import { usePageContext } from 'vike-react/usePageContext';
import AppliedFilterItemList from './AppliedFilterItemList';
import ModalFilterSidebar from './ModalFilterSidebar/ModalFilterSidebar';
import { getFormattedShortMonthDay, isTimeBetween } from '../../../utils/date.utils';
import { useSearchParamsCustom } from '../../../hooks/useSearchParamsCustom';

const FilterBar = ({
	groupedBy,
	setGroupedBy,
	searchText,
	setSearchText,
	defaultFocusRecords,
	filteredFocusRecords,
	setFilteredFocusRecords,
	focusRecordListRef,
	showCompletedTasks,
	setShowCompletedTasks,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}) => {
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;
	const queryParams = new URLSearchParams(location.search);
	const taskIdToFilterBy = queryParams.get('task-id');

	const GROUP_BY_OPTIONS = ['Date', 'Task', 'Project', 'No Group'];
	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	const [sortByOptions, setSortByOptions] = useState(DEFAULT_SORT_BY_OPTIONS);
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

	useFilterFocusRecords({
		taskIdToFilterBy,
		startDate,
		endDate,
		filteredFocusRecords,
		setFilteredFocusRecords,
		defaultFocusRecords,
		searchText,
		setSortByOptions,
		DEFAULT_SORT_BY_OPTIONS,
		focusRecordListRef,
		groupedBy,
	});

	return (
		<div>
			<div className="flex justify-between items-center pb-5 container">
				<div className="flex justify-between items-center gap-3 w-full">
					<h2 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
						Focus Records ({(filteredFocusRecords?.length || 0).toLocaleString()})
					</h2>

					<div className="text-[16px] cursor-pointer">
						<div
							className="flex items-center gap-2 rounded-3xl border border-color-gray-200 px-4 py-1"
							onClick={() => setShowFilterSidebar(true)}
						>
							<div>Filter</div>
							<Icon
								name="page_info"
								fill={0}
								customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
							/>
						</div>
					</div>
				</div>
			</div>

			<AppliedFilterItemList
				{...{
					groupedBy,
					setGroupedBy,
					searchText,
					setSearchText,
					taskIdToFilterBy,
					startDate,
					setStartDate,
					endDate,
					setEndDate,
				}}
			/>

			<ModalFilterSidebar
				{...{
					isOpen: showFilterSidebar,
					setIsOpen: setShowFilterSidebar,
					searchText,
					setSearchText,
					groupedBy,
					setGroupedBy,
					sortByOptions,
					GROUP_BY_OPTIONS,
					showCompletedTasks,
					setShowCompletedTasks,
					startDate,
					setStartDate,
					endDate,
					setEndDate,
				}}
			/>
		</div>
	);
};

const useFilterFocusRecords = ({
	taskIdToFilterBy,
	startDate,
	endDate,
	setFilteredFocusRecords,
	defaultFocusRecords,
	searchText,
	setSortByOptions,
	DEFAULT_SORT_BY_OPTIONS,
}) => {
	const { updateQueryParams } = useSearchParamsCustom();

	const fuse = new Fuse(defaultFocusRecords, {
		includeScore: true,
		isCaseSensitive: false,
		findAllMatches: false,
		threshold: 0.3, // Lower threshold for stricter matches
		location: 0,
		distance: 100, // Lower distance to prefer closer matches
		minMatchCharLength: 3, // Increase min match character length for longer matches
		keys: [
			{ name: 'tasks.title', weight: 1 },
			{ name: 'note', weight: 1 },
			{ name: 'tasks.projectName', weight: 0.5 },
		],
	});

	const filterBySearch = () => {
		if (searchText.trim() === '') {
			setSortByOptions(DEFAULT_SORT_BY_OPTIONS);
			updateQueryParams({ 'sort-by': '' });
		} else {
			const mostRelevantSortByOption = 'Most Relevant';
			setSortByOptions([mostRelevantSortByOption, ...DEFAULT_SORT_BY_OPTIONS]);
			updateQueryParams({ 'sort-by': mostRelevantSortByOption });
		}

		setFilteredFocusRecords(getFilteredFocusRecords());
		updateQueryParams({ search: searchText });
	};

	const handleDebouncedSearch = debounce(filterBySearch, 1000);

	useEffect(() => {
		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [searchText, defaultFocusRecords]);

	const focusRecordContainsTaskId = (focusRecord) => {
		if (!taskIdToFilterBy) {
			return true;
		}

		const taskIdToFilterByStr = String(taskIdToFilterBy);

		if (!focusRecord.tasks || focusRecord.tasks.length === 0) {
			return false;
		}

		const { tasks } = focusRecord;

		return tasks.find((task) => String(task.taskId) === taskIdToFilterByStr);
	};

	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('November 2, 2020'))} - ${getFormattedShortMonthDay(new Date())}`;
	const currentDateRangeString = `${getFormattedShortMonthDay(startDate)} - ${getFormattedShortMonthDay(endDate)}`;
	const includesAllDates = firstDayToTodayString === currentDateRangeString;

	const focusRecordInDateRange = (focusRecord) => {
		if (includesAllDates) {
			return true;
		}

		const { startTime } = focusRecord;
		const startTimeDate = new Date(startTime);

		return isTimeBetween(startTimeDate, startDate, endDate);
	};

	useEffect(() => {
		if (defaultFocusRecords) {
			const newFilteredFocusRecords = getFilteredFocusRecords();
			setFilteredFocusRecords(newFilteredFocusRecords);
		}
	}, [defaultFocusRecords, taskIdToFilterBy, startDate, endDate]);

	const getFilteredFocusRecords = () => {
		let searchedItems;

		if (searchText.trim() === '') {
			// If searchText is empty, consider all focus records as the searched result.
			searchedItems = defaultFocusRecords.map((focusRecord) => ({ item: focusRecord }));
		} else {
			// When searchText is not empty, perform the search using Fuse.js
			searchedItems = fuse.search(searchText);
		}

		const searchedItemsFocusRecords = searchedItems.map((result) => result.item);

		const newFilteredFocusRecords = searchedItemsFocusRecords.filter(
			(focusRecord) => focusRecordContainsTaskId(focusRecord) && focusRecordInDateRange(focusRecord)
		);

		return newFilteredFocusRecords;
	};
};

export default FilterBar;
