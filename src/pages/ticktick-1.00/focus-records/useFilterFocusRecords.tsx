import Fuse from 'fuse.js';
import { useEffect } from 'react';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay, isDateBetween } from '../../../utils/date.utils';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { getFocusRecordProperty, getFocusRecordFocusApp } from '../../../utils/focus-apps/multiFocusApps.utils';

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
	const categoriesFromUrl = searchParams.get('categories') || '';
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';

	// Projects
	const projectIdsFromUrlArr = projectsFromUrl.split(',');
	const projectIdsFromUrlObj = {};
	projectIdsFromUrlArr.forEach((projectId) => {
		projectIdsFromUrlObj[projectId] = true;
	});

	// Categories
	const categoryIdsFromUrlArr = categoriesFromUrl.split(',');
	const categoryIdsFromUrlObj = {};
	categoryIdsFromUrlArr.forEach((categoryId) => {
		categoryIdsFromUrlObj[categoryId] = true;
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

	const fuse = new Fuse(defaultFocusRecords, {
		includeScore: true,
		isCaseSensitive: false,
		findAllMatches: true,
		threshold: 0.1, // Lower threshold for the strictest matches
		ignoreLocation: true, // Ignores location to search throughout the entire text
		distance: 99999, // Higher distance means the searching algorithm will treat characters at the beginning and at the end as equally as possible.
		minMatchCharLength: 3, // Increase min match character length for longer matches. Will ignore short words like "at" or "is" since I don't need those.
		keys: [
			// TickTick
			{ name: 'note', weight: 1 },
			{ name: 'tasks.title', weight: 0.75 },
			{ name: 'tasks.projectName', weight: 0.5 },

			// Session App
			{ name: 'notes', weight: 1 },
			{ name: 'title', weight: 0.75 },
			{ name: 'category.title', weight: 1 },

			// Be Focused App
			{ name: 'Assigned task', weight: 1 },

			// Forest App
			{ name: 'Tag', weight: 1 },
			{ name: 'Tree Type', weight: 0.25 },

			// Tide App
			{ name: 'name', weight: 1 },
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
		filterBySearch();
	}, [searchTextFromUrl]);

	const focusRecordContainsTaskId = (focusRecord) => {
		if (!taskIdToFilterBy) {
			return true;
		}

		const taskIdToFilterByStr = String(taskIdToFilterBy);

		const focusApp = getFocusRecordFocusApp(focusRecord);

		switch (focusApp) {
			case 'TickTick': {
				if (!focusRecord.tasks || focusRecord.tasks.length === 0) {
					return false;
				}

				const { tasks } = focusRecord;

				return tasks.find((task) => String(task.taskId) === taskIdToFilterByStr);
			}
			default: {
				const taskId = getFocusRecordProperty(focusRecord, 'taskId');
				return taskId === taskIdToFilterByStr;
			}
		}
	};

	const focusRecordContainsProjectId = (focusRecord) => {
		if (!projectsFromUrl) {
			return true;
		}

		if (!focusRecord.tasks || focusRecord.tasks.length === 0 || !tasksById) {
			return false;
		}

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

	const focusRecordContainsCategoryId = (focusRecord) => {
		if (!categoriesFromUrl) {
			return true;
		}

		const focusApp = getFocusRecordFocusApp(focusRecord);

		if (focusApp !== 'session-app') {
			return false;
		}

		const categoryId = focusRecord.category.id || 'General';
		const categoryIsInUrl = categoryIdsFromUrlObj[categoryId];
		return categoryIsInUrl;
	};

	const focusRecordContainsFocusApp = (focusRecord) => {
		if (!focusAppsFromUrl) {
			return true;
		}

		const focusApp = getFocusRecordFocusApp(focusRecord);
		const focusAppIsInUrl = focusAppNamesFromUrlObj[focusApp];
		return focusAppIsInUrl;
	};

	const focusRecordIsNotABreak = (focusRecord) => {
		const focusApp = getFocusRecordFocusApp(focusRecord);
		if (focusApp !== 'session-app') {
			return true;
		}

		return focusRecord['type'] === 'fullFocus';
	};

	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('November 2, 2020'))} - ${getFormattedShortMonthDay(new Date())}`;
	const currentDateRangeString = `${startDateFromUrl} - ${endDateFromUrl}`;
	const includesAllDates = firstDayToTodayString === currentDateRangeString;

	const focusRecordInDateRange = (focusRecord) => {
		if (includesAllDates) {
			return true;
		}

		const startTime = getFocusRecordProperty(focusRecord, 'startTime');
		const startTimeDate = new Date(startTime);
		const startDateFromUrlDate = new Date(startDateFromUrl);
		const endDateFromUrlDate = new Date(endDateFromUrl);

		return isDateBetween(startTimeDate, startDateFromUrlDate, endDateFromUrlDate);
	};

	useEffect(() => {
		const newFilteredFocusRecords = getFilteredFocusRecords();
		setFilteredFocusRecords(newFilteredFocusRecords);
	}, [
		taskIdToFilterBy,
		startDateFromUrl,
		endDateFromUrl,
		projectsFromUrl,
		categoriesFromUrl,
		focusAppsFromUrl,
		tasksById,
	]);

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
				focusRecordContainsCategoryId(focusRecord) &&
				focusRecordInDateRange(focusRecord) &&
				focusRecordIsNotABreak(focusRecord) &&
				focusRecordContainsFocusApp(focusRecord)
		);

		return newFilteredFocusRecords;
	};
};
