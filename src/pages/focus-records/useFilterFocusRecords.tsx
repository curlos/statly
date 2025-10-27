import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay, isDateBetween } from '../../utils/date.utils';
import { useGetAllTasksQuery, useGetPomoAndStopwatchFocusRecordsQuery } from '../../services/resources/ticktickOneApi';
import { getFocusRecordProperty, getFocusRecordFocusApp } from '../../utils/focus-apps/multiFocusApps.utils';
import { findMatchingTaskOrAncestor } from '../../utils/focus-apps/tasks.utils';
import { useUserSettingsContext } from './useUserSettingsContext';
import {
	useGetSessionAppFocusRecordsQuery,
	useGetBeFocusedAppFocusRecordsQuery,
	useGetForestAppFocusRecordsQuery,
	useGetTideAppFocusRecordsQuery,
} from '../../services/resources/oldFocusAppsApi';

export const useFilterFocusRecords = () => {
	// RTK Query - TickTick 1.0 - Focus Records
	const { data: fetchedFocusRecords, isLoading: isLoadingGetFocusRecords } =
		useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords } = fetchedFocusRecords || {};

	// RTK Query - Session App - Focus Records
	const { data: fetchedSessionFocusRecords } = useGetSessionAppFocusRecordsQuery();
	const { sessionFocusRecords } = fetchedSessionFocusRecords || {};

	// RTK Query - BeFocused App - Focus Records
	const { data: fetchedBeFocusedAppFocusRecords } = useGetBeFocusedAppFocusRecordsQuery();
	const { beFocusedAppFocusRecords } = fetchedBeFocusedAppFocusRecords || {};

	// RTK Query - Forest App - Focus Records
	const { data: fetchedForestAppFocusRecords } = useGetForestAppFocusRecordsQuery();
	const { forestAppFocusRecords } = fetchedForestAppFocusRecords || {};

	// RTK Query - Tide App - Focus Records
	const { data: fetchedTideFocusRecords } = useGetTideAppFocusRecordsQuery();
	const { tideAppFocusRecords } = fetchedTideFocusRecords || {};

	const allFocusRecordsAreHere: any =
		focusRecords && sessionFocusRecords && beFocusedAppFocusRecords && forestAppFocusRecords && tideAppFocusRecords;

	const defaultFocusRecords = allFocusRecordsAreHere
		? [
				...focusRecords,
				...sessionFocusRecords,
				...beFocusedAppFocusRecords,
				...forestAppFocusRecords,
				...tideAppFocusRecords,
			]
		: [];

	const [filteredFocusRecords, setFilteredFocusRecords] = useState(defaultFocusRecords);

	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	const [sortByOptions, setSortByOptions] = useState(DEFAULT_SORT_BY_OPTIONS);

	useHandleFilterFocusRecords({
		setFilteredFocusRecords,
		defaultFocusRecords,
		setSortByOptions,
		DEFAULT_SORT_BY_OPTIONS,
	});

	return {
		filteredFocusRecords,
		isLoadingGetFocusRecords,
		sortByOptions,
		allFocusRecordsAreHere,
	};
};

const useHandleFilterFocusRecords = ({
	setFilteredFocusRecords,
	defaultFocusRecords,
	setSortByOptions,
	DEFAULT_SORT_BY_OPTIONS,
}) => {
	const { searchParams } = useSearchParamsContext();
	const taskIdFromUrl = searchParams.get('task-id');
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Jan 1, 1900';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';
	const categoriesFromUrl = searchParams.get('categories') || '';
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';

	const {
		focusRecordsPageSettings: { showTaskAncestors, taskIdIncludeFocusRecordsFromSubtasks },
	} = useUserSettingsContext();

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
	const { tasksById, ancestorTasksById } = fetchedTasks || {};

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
		if (setSortByOptions) {
			if (searchTextFromUrl.trim() === '') {
				setSortByOptions(DEFAULT_SORT_BY_OPTIONS);
			} else {
				setSortByOptions(['Most Relevant', ...DEFAULT_SORT_BY_OPTIONS]);
			}
		}

		setFilteredFocusRecords(getFilteredFocusRecords());
	};

	useEffect(() => {
		filterBySearch();
	}, [searchTextFromUrl]);

	const focusRecordContainsTaskId = (focusRecord) => {
		if (!taskIdFromUrl) {
			return true;
		}

		const taskIdToFilterByStr = String(taskIdFromUrl);

		const focusApp = getFocusRecordFocusApp(focusRecord);

		switch (focusApp) {
			case 'TickTick': {
				if (!focusRecord.tasks || focusRecord.tasks.length === 0) {
					return false;
				}

				const { tasks } = focusRecord;

				return tasks.find((task) => {
					const taskIdIsDirectlyInFocusRecord = String(task.taskId) === taskIdToFilterByStr;

					if (taskIdIsDirectlyInFocusRecord) {
						return taskIdIsDirectlyInFocusRecord;
					}

					if (!showTaskAncestors || !taskIdIncludeFocusRecordsFromSubtasks || !ancestorTasksById) {
						return false;
					}

					// If the task is NOT directly in the Focus Record's tasks, then look through all of othe Focus Record's task's breadcrumbs and check if the taskId is an ancestor of one of those tasks.
					const foundMatchingTaskOrAncestor = findMatchingTaskOrAncestor(
						task,
						taskIdToFilterByStr,
						ancestorTasksById
					);

					return foundMatchingTaskOrAncestor;
				});
			}
			default: {
				const taskId = getFocusRecordProperty(focusRecord, 'taskId');
				return taskId === taskIdToFilterByStr;
			}
		}
	};

	const focusRecordContainsProjectOrCategoryId = (focusRecord) => {
		if (!projectsFromUrl && !categoriesFromUrl) {
			return true;
		}

		let hasTickTickOrSessionProject = false;

		if (projectsFromUrl) {
			if (focusRecord.tasks && focusRecord.tasks.length > 0 && tasksById) {
				const { tasks } = focusRecord;
				const oneOfTheTasksHasASelectedProject = tasks.find((task) => {
					const taskWithFullInfo = tasksById[task.taskId];

					if (!taskWithFullInfo) {
						return false;
					}

					const taskIsFromASelectedProject = projectIdsFromUrlObj[taskWithFullInfo.projectId];
					return taskIsFromASelectedProject;
				});

				hasTickTickOrSessionProject = hasTickTickOrSessionProject || oneOfTheTasksHasASelectedProject;
			}
		}

		if (categoriesFromUrl) {
			const focusApp = getFocusRecordFocusApp(focusRecord);

			if (focusApp === 'session-app') {
				const categoryId = focusRecord.category.id || 'General';
				const categoryIsInUrl = categoryIdsFromUrlObj[categoryId];
				hasTickTickOrSessionProject = hasTickTickOrSessionProject || categoryIsInUrl;
			}
		}

		return hasTickTickOrSessionProject;
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

	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('Jan 1, 1900'))} - ${getFormattedShortMonthDay(new Date())}`;
	const currentDateRangeString = `${startDateFromUrl} - ${endDateFromUrl}`;
	const includesAllDates = firstDayToTodayString === currentDateRangeString;

	const focusRecordInDateRange = (focusRecord) => {
		if (includesAllDates) {
			return true;
		}

		const startTime = getFocusRecordProperty(focusRecord, 'startTime');
		const endTime = getFocusRecordProperty(focusRecord, 'endTime');

		const startTimeDate = new Date(startTime);
		const endTimeDate = new Date(endTime);

		const startDateFromUrlDate = new Date(startDateFromUrl);
		const endDateFromUrlDate = new Date(endDateFromUrl);

		return (
			isDateBetween(startTimeDate, startDateFromUrlDate, endDateFromUrlDate) ||
			isDateBetween(endTimeDate, startDateFromUrlDate, endDateFromUrlDate)
		);
	};

	useEffect(() => {
		const newFilteredFocusRecords = getFilteredFocusRecords();
		setFilteredFocusRecords(newFilteredFocusRecords);
	}, [
		taskIdFromUrl,
		startDateFromUrl,
		endDateFromUrl,
		projectsFromUrl,
		categoriesFromUrl,
		focusAppsFromUrl,
		tasksById,
		ancestorTasksById,
		showTaskAncestors,
		taskIdIncludeFocusRecordsFromSubtasks,
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

		const newFilteredFocusRecords = searchedItemsFocusRecords.filter((focusRecord) => {
			return (
				focusRecordContainsTaskId(focusRecord) &&
				focusRecordContainsProjectOrCategoryId(focusRecord) &&
				focusRecordInDateRange(focusRecord) &&
				focusRecordIsNotABreak(focusRecord) &&
				focusRecordContainsFocusApp(focusRecord)
			);
		});

		return newFilteredFocusRecords;
	};
};
