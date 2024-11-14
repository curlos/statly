import Fuse from 'fuse.js';
import { useEffect } from 'react';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay, isTimeBetween } from '../../../utils/date.utils';
import { debounce } from '../../../utils/helpers.utils';

export const useFilterFocusRecords = ({
	taskIdToFilterBy,
	startDate,
	endDate,
	setFilteredFocusRecords,
	defaultFocusRecords,
	searchTextFromUrl,
	setSortByOptions,
	DEFAULT_SORT_BY_OPTIONS,
}) => {
	const { updateQueryParams } = useSearchParamsContext();

	// console.log(startDate);
	// console.log(endDate);

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
		if (searchTextFromUrl.trim() === '') {
			setSortByOptions(DEFAULT_SORT_BY_OPTIONS);
			updateQueryParams({ 'sort-by': '' });
		} else {
			const mostRelevantSortByOption = 'Most Relevant';
			setSortByOptions([mostRelevantSortByOption, ...DEFAULT_SORT_BY_OPTIONS]);
			updateQueryParams({ 'sort-by': mostRelevantSortByOption });
		}

		setFilteredFocusRecords(getFilteredFocusRecords());
		updateQueryParams({ search: searchTextFromUrl });
	};

	const handleDebouncedSearch = debounce(filterBySearch, 1000);

	useEffect(() => {
		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [searchTextFromUrl, defaultFocusRecords]);

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

		if (searchTextFromUrl.trim() === '') {
			// If searchText is empty, consider all focus records as the searched result.
			searchedItems = defaultFocusRecords.map((focusRecord) => ({ item: focusRecord }));
		} else {
			// When searchText is not empty, perform the search using Fuse.js
			searchedItems = fuse.search(searchTextFromUrl);
		}

		const searchedItemsFocusRecords = searchedItems.map((result) => result.item);

		const newFilteredFocusRecords = searchedItemsFocusRecords.filter(
			(focusRecord) => focusRecordContainsTaskId(focusRecord) && focusRecordInDateRange(focusRecord)
		);

		return newFilteredFocusRecords;
	};
};
