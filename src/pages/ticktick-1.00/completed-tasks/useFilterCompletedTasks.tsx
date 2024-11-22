import Fuse from 'fuse.js';
import { useEffect } from 'react';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay, isDateBetween } from '../../../utils/date.utils';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';

export const useFilterCompletedTasks = ({
	setFilteredDaysWithCompletedTasks,
	defaultDaysWithCompletedTasks,
	setSortByOptions,
	DEFAULT_SORT_BY_OPTIONS,
}) => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';
	const categoriesFromUrl = searchParams.get('categories') || '';
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';

	// Projects
	const projectIdsFromUrlArr = projectsFromUrl.split(',');
	const projectIdsFromUrlObj = {};
	projectIdsFromUrlArr.forEach((projectId) => {
		projectIdsFromUrlObj[projectId] = true;
	});

	// Focus Apps
	const focusAppNamesFromUrlArr = focusAppsFromUrl.split(',');
	const focusAppNamesFromUrlObj = {};
	focusAppNamesFromUrlArr.forEach((name) => {
		focusAppNamesFromUrlObj[name] = true;
	});

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	const fuse = new Fuse(defaultDaysWithCompletedTasks, {
		includeScore: true,
		isCaseSensitive: false,
		findAllMatches: true,
		threshold: 0.1, // Lower threshold for the strictest matches
		ignoreLocation: true, // Ignores location to search throughout the entire text
		distance: 99999, // Higher distance means the searching algorithm will treat characters at the beginning and at the end as equally as possible.
		minMatchCharLength: 3, // Increase min match character length for longer matches. Will ignore short words like "at" or "is" since I don't need those.
		keys: [
			// TickTick
			{ name: 'title', weight: 1 },
		],
	});

	const filterBySearch = () => {
		if (searchTextFromUrl.trim() === '') {
			setSortByOptions(DEFAULT_SORT_BY_OPTIONS);
		} else {
			setSortByOptions(['Most Relevant', ...DEFAULT_SORT_BY_OPTIONS]);
		}

		setFilteredDaysWithCompletedTasks(getFilteredCompletedTasksByDay());
	};

	useEffect(() => {
		filterBySearch();
	}, [searchTextFromUrl]);

	// const focusRecordContainsProjectId = (focusRecord) => {
	// 	if (!projectsFromUrl) {
	// 		return true;
	// 	}

	// 	if (!focusRecord.tasks || focusRecord.tasks.length === 0 || !tasksById) {
	// 		return false;
	// 	}

	// 	const { tasks } = focusRecord;
	// 	const oneOfTheTasksHasASelectedProject = tasks.find((task) => {
	// 		const taskWithFullInfo = tasksById[task.taskId];

	// 		if (!taskWithFullInfo) {
	// 			return false;
	// 		}

	// 		const taskIsFromASelectedProject = projectIdsFromUrlObj[taskWithFullInfo.projectId];
	// 		return taskIsFromASelectedProject;
	// 	});

	// 	return oneOfTheTasksHasASelectedProject;
	// };

	// const focusRecordContainsFocusApp = (focusRecord) => {
	// 	if (!focusAppsFromUrl) {
	// 		return true;
	// 	}

	// 	const focusApp = getFocusRecordFocusApp(focusRecord);
	// 	const focusAppIsInUrl = focusAppNamesFromUrlObj[focusApp];
	// 	return focusAppIsInUrl;
	// };

	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('November 2, 2020'))} - ${getFormattedShortMonthDay(new Date())}`;
	const currentDateRangeString = `${startDateFromUrl} - ${endDateFromUrl}`;
	const includesAllDates = firstDayToTodayString === currentDateRangeString;

	// const focusRecordInDateRange = (focusRecord) => {
	// 	if (includesAllDates) {
	// 		return true;
	// 	}

	// 	const startTime = getFocusRecordProperty(focusRecord, 'startTime');
	// 	const startTimeDate = new Date(startTime);
	// 	const startDateFromUrlDate = new Date(startDateFromUrl);
	// 	const endDateFromUrlDate = new Date(endDateFromUrl);

	// 	return isDateBetween(startTimeDate, startDateFromUrlDate, endDateFromUrlDate);
	// };

	useEffect(() => {
		const newFilteredFocusRecords = getFilteredCompletedTasksByDay();
		setFilteredDaysWithCompletedTasks(newFilteredFocusRecords);
	}, [startDateFromUrl, endDateFromUrl, projectsFromUrl, categoriesFromUrl, focusAppsFromUrl, tasksById]);

	const getFilteredCompletedTasksByDay = () => {
		let searchedItems;

		if (searchTextFromUrl.trim() === '') {
			// If searchText is empty, consider all focus records as the searched result.
			searchedItems = defaultDaysWithCompletedTasks.map((dayWithCompletedTasks) => ({
				item: dayWithCompletedTasks,
			}));
		} else {
			// When searchText is not empty, perform the search using Fuse.js
			searchedItems = fuse.search(searchTextFromUrl);
		}

		const searchedItemsCompletedTasksByDate = searchedItems.map((result) => result.item);

		const newFilteredFocusRecords = searchedItemsCompletedTasksByDate.filter(
			(completedTasksByDate) => true
			// focusRecordContainsProjectId(completedTasksByDate) &&
			// focusRecordInDateRange(completedTasksByDate) &&
			// focusRecordContainsFocusApp(completedTasksByDate)
		);

		return newFilteredFocusRecords;
	};
};
