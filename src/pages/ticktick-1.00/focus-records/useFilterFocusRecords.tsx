import Fuse from 'fuse.js';
import { useEffect } from 'react';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay, isDateBetween } from '../../../utils/date.utils';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';

export const useFilterFocusRecords = ({
	taskIdToFilterBy,
	setFilteredFocusRecords,
	defaultFocusRecords,
	setSortByOptions,
	DEFAULT_SORT_BY_OPTIONS,
}) => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	const fuse = new Fuse(defaultFocusRecords, {
		includeScore: true,
		isCaseSensitive: false,
		findAllMatches: true,
		threshold: 0.1, // Lower threshold for the strictest matches
		ignoreLocation: true, // Ignores location to search throughout the entire text
		distance: 99999, // Higher distance means the searching algorithm will treat characters at the beginning and at the end as equally as possible.
		minMatchCharLength: 3, // Increase min match character length for longer matches. Will ignore short words like "at" or "is" since I don't need those.
		keys: [
			{ name: 'note', weight: 1 },
			{ name: 'tasks.title', weight: 0.75 },
			{ name: 'tasks.projectName', weight: 0.5 },
		],
	});

	const filterBySearch = () => {
		if (searchTextFromUrl.trim() === '') {
			setSortByOptions(DEFAULT_SORT_BY_OPTIONS);
		} else {
			setSortByOptions(['Most Relevant', ...DEFAULT_SORT_BY_OPTIONS]);
		}

		setFilteredFocusRecords(getFilteredFocusRecords());
	};

	useEffect(() => {
		if (defaultFocusRecords) {
			filterBySearch();
		}
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

	const focusRecordContainsProjectId = (focusRecord) => {
		if (!projectsFromUrl) {
			return true;
		}

		if (!focusRecord.tasks || focusRecord.tasks.length === 0 || !tasksById) {
			return false;
		}

		const projectIdsFromUrlArr = projectsFromUrl.split(',');
		const projectIdsFromUrlObj = {};

		projectIdsFromUrlArr.forEach((projectId) => {
			projectIdsFromUrlObj[projectId] = true;
		});

		const { tasks } = focusRecord;
		const oneOfTheTasksHasASelectedProject = tasks.find((task) => {
			const taskWithFullInfo = tasksById[task.taskId];

			if (!taskWithFullInfo) {
				return false;
			}

			const taskIsFromASelectedProject = projectIdsFromUrlObj[taskWithFullInfo.projectId];
			return taskIsFromASelectedProject;
		});

		return oneOfTheTasksHasASelectedProject;
	};

	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('November 2, 2020'))} - ${getFormattedShortMonthDay(new Date())}`;
	const currentDateRangeString = `${startDateFromUrl} - ${endDateFromUrl}`;
	const includesAllDates = firstDayToTodayString === currentDateRangeString;

	const focusRecordInDateRange = (focusRecord) => {
		if (includesAllDates) {
			return true;
		}

		const { startTime } = focusRecord;
		const startTimeDate = new Date(startTime);
		const startDateFromUrlDate = new Date(startDateFromUrl);
		const endDateFromUrlDate = new Date(endDateFromUrl);

		return isDateBetween(startTimeDate, startDateFromUrlDate, endDateFromUrlDate);
	};

	useEffect(() => {
		if (defaultFocusRecords) {
			const newFilteredFocusRecords = getFilteredFocusRecords();
			setFilteredFocusRecords(newFilteredFocusRecords);
		}
	}, [defaultFocusRecords, taskIdToFilterBy, startDateFromUrl, endDateFromUrl, projectsFromUrl, tasksById]);

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
			(focusRecord) =>
				focusRecordContainsTaskId(focusRecord) &&
				focusRecordContainsProjectId(focusRecord) &&
				focusRecordInDateRange(focusRecord)
		);

		return newFilteredFocusRecords;
	};
};
