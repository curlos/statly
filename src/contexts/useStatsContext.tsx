import { createContext, useContext, useEffect, useState } from 'react';
import {
	useGetAllTasksQuery,
	useGetAllProjectsQuery,
	useGetPomoAndStopwatchFocusRecordsQuery,
	useGetAllTagsQuery,
} from '../services/resources/ticktickOneApi';
import { getFormattedLongDay, getLast7Days, getLast7Months, getLast7Weeks, getTimeSince } from '../utils/date.utils';
import { getGroupedFocusRecordsByDate, getFocusDurationFromArray } from '../utils/focus-apps/focusRecords.utils';
import {
	useGetSessionAppFocusRecordsQuery,
	useGetBeFocusedAppFocusRecordsQuery,
	useGetForestAppFocusRecordsQuery,
	useGetTideAppFocusRecordsQuery,
	useGetTodoistAllTasksQuery,
	useGetTodoistAllProjectsQuery,
} from '../services/resources/oldFocusAppsApi';
import { useFilterFocusRecords } from '../pages/ticktick-1.00/focus-records/useFilterFocusRecords';
import { useFilterCompletedTasks } from '../pages/ticktick-1.00/completed-tasks/useFilterCompletedTasks';
import { groupTasksByDateStr } from '../utils/focus-apps/tasks.utils';

const StatsContext = createContext();

export const useStatsContext = () => {
	return useContext(StatsContext);
};

export const StatsProvider = ({ children }) => {
	const calendar = useStats();
	return <StatsContext.Provider value={calendar}>{children}</StatsContext.Provider>;
};

const useStats = () => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks } = useGetAllTasksQuery();
	const {
		tasksById,
		allTasksAndItems,
		totalCompletedTasks,
		allCompletedTasks,
		completedTasksGroupedByDate: tickTickCompletedTasksGroupedByDate,
	} = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistTasks } = useGetTodoistAllTasksQuery();
	const { todoistCompletedTasksGroupedByDate } = fetchedTodoistTasks || {};

	const allCompletedTasksGroupedByDate = {
		...tickTickCompletedTasksGroupedByDate,
		...todoistCompletedTasksGroupedByDate,
	};

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	const { projects, projectsById } = fetchedProjects || {};

	// RTK Query - Todoist - Projects
	const { data: fetchedTodoistAllProjects } = useGetTodoistAllProjectsQuery();
	const { todoistAllProjectsById } = fetchedTodoistAllProjects || {};

	// RTK Query - TickTick 1.0 - Tags
	const { data: fetchedTags } = useGetAllTagsQuery();
	const { tags, tagsByRawName } = fetchedTags || {};

	// FOCUS RECORDS FROM ALL APPS
	// RTK Query - TickTick 1.0 - Focus Records
	const { isLoading: isLoadingGetFocusRecords } = useGetPomoAndStopwatchFocusRecordsQuery();

	// RTK Query - Session App - Focus Records
	const { data: fetchedSessionFocusRecords, isLoading: isLoadingGetSessionFocusRecords } =
		useGetSessionAppFocusRecordsQuery();
	const { sessionCategoriesById } = fetchedSessionFocusRecords || {};

	// RTK Query - BeFocused App - Focus Records
	const { isLoading: isLoadingGetBeFocusedAppFocusRecords } = useGetBeFocusedAppFocusRecordsQuery();

	// RTK Query - Forest App - Focus Records
	const { isLoading: isLoadingGetForestAppFocusRecords } = useGetForestAppFocusRecordsQuery();

	// RTK Query - Tide App - Focus Records
	const { isLoading: isLoadingGetTideFocusRecords } = useGetTideAppFocusRecordsQuery();

	const accountCreatedDate = new Date('November 3, 2020');
	const timeSinceAccountCreated = getTimeSince(accountCreatedDate);
	const { days } = timeSinceAccountCreated;

	const [focusRecordsGroupedByDate, setFocusRecordsGroupedByDate] = useState(null);
	const [focusRecordsFromToday, setFocusRecordsFromToday] = useState(null);
	const [totalFocusDuration, setTotalFocusDuration] = useState(0);
	const [focusDurationForToday, setFocusDurationForToday] = useState(0);

	const [completedTasksGroupedByDate, setCompletedTasksGroupedByDate] = useState(null);
	const [completedTasksForToday, setCompletedTasksForToday] = useState(null);

	const [statsForLastSevenDays, setStatsForLastSevenDays] = useState(null);
	const [statsForLastSevenWeeks, setStatsForLastSevenWeeks] = useState(null);
	const [statsForLastSevenMonths, setStatsForLastSevenMonths] = useState(null);

	const todayDate = new Date();
	const todayDateKey = getFormattedLongDay(todayDate);

	const isLoading =
		isLoadingGetFocusRecords ||
		isLoadingGetSessionFocusRecords ||
		isLoadingGetBeFocusedAppFocusRecords ||
		isLoadingGetForestAppFocusRecords ||
		isLoadingGetTasks ||
		isLoadingGetTideFocusRecords ||
		isLoadingGetProjects;

	const { filteredFocusRecords, allFocusRecordsAreHere } = useFilterFocusRecords();
	const { filteredDaysWithCompletedTasks, allCompletedTasksAreHere } = useFilterCompletedTasks();

	useEffect(() => {
		if (isLoading) {
			return;
		}

		setFocusRecordsGroupedByDate(getGroupedFocusRecordsByDate(filteredFocusRecords));
		setTotalFocusDuration(getFocusDurationFromArray({ focusRecords: filteredFocusRecords }));
	}, [isLoading, filteredFocusRecords]);

	useEffect(() => {
		if (isLoading || !filteredDaysWithCompletedTasks) {
			return;
		}

		setCompletedTasksGroupedByDate(groupTasksByDateStr(filteredDaysWithCompletedTasks));
	}, [filteredDaysWithCompletedTasks]);

	useEffect(() => {
		if (!focusRecordsGroupedByDate) {
			return;
		}

		setFocusRecordsFromToday(focusRecordsGroupedByDate[todayDateKey]);
	}, [focusRecordsGroupedByDate]);

	useEffect(() => {
		if (!focusRecordsFromToday || !completedTasksGroupedByDate || !focusRecordsGroupedByDate) {
			return;
		}

		setCompletedTasksForToday(completedTasksGroupedByDate[todayDateKey]);
		setFocusDurationForToday(
			getFocusDurationFromArray({ focusRecords: focusRecordsFromToday, startDate: todayDate })
		);
		setStatsForLastSevenDays(getStatsForLast7Days());
		setStatsForLastSevenWeeks(getStatsForLast7Weeks());
		setStatsForLastSevenMonths(getStatsForLast7Months());
	}, [focusRecordsFromToday, completedTasksGroupedByDate, focusRecordsGroupedByDate]);

	const getStatsForLast7Days = () => {
		// Get the past 7 days including today
		const lastSevenDays = getLast7Days();
		const lastSevenDaysData = [];

		for (let day of lastSevenDays) {
			const dayKey = getFormattedLongDay(day);

			const completedTasks = completedTasksGroupedByDate[dayKey];
			const focusRecords = focusRecordsGroupedByDate[dayKey];
			const focusDuration = (focusRecords && getFocusDurationFromArray({ focusRecords, startDate: day })) || 0;

			lastSevenDaysData.push({
				name: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
				completedTasks,
				focusRecords,
				focusDuration,
			});
		}

		return lastSevenDaysData;
	};

	const getStatsForLast7Weeks = () => {
		const lastSevenWeeks = getLast7Weeks();
		const lastSevenWeeksData = [];

		// Fill in the default data that we'll need to edit in the following for loop with the different properties for the stats.
		for (let week of lastSevenWeeks) {
			const lastDayOfTheWeek = week[0];
			const firstDayOfTheWeek = week[week.length - 1];
			const lastDayShortName = lastDayOfTheWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
			const firstDayShortName = firstDayOfTheWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

			lastSevenWeeksData.push({
				name: lastDayShortName,
				fullName: `${firstDayShortName} to ${lastDayShortName}`,
				completedTasks: [],
				focusRecords: [],
				focusDuration: 0,
			});
		}

		// Go through each week and each day in that week, get the stats for that day and add or push it to its week's total stats.
		for (let i = 0; i < lastSevenWeeks.length; i++) {
			const week = lastSevenWeeks[i];
			const currentWeekData = lastSevenWeeksData[i];

			for (let day of week) {
				const dayKey = getFormattedLongDay(day);

				const completedTasks = completedTasksGroupedByDate[dayKey] || [];
				const focusRecords = focusRecordsGroupedByDate[dayKey] || [];
				const focusDuration = (focusRecords && getFocusDurationFromArray({ focusRecords })) || 0;

				currentWeekData.completedTasks.push(...completedTasks);
				currentWeekData.focusRecords.push(...focusRecords);
				currentWeekData.focusDuration += focusDuration;
			}
		}

		return lastSevenWeeksData;
	};

	const getStatsForLast7Months = () => {
		const lastSevenMonths = getLast7Months();
		const lastSevenMonthsData = [];

		// Fill in the default data that we'll need to edit in the following for loop with the different properties for the stats.
		for (let month of lastSevenMonths) {
			const firstDayOfTheMonth = month[0];
			const monthShortName = firstDayOfTheMonth.toLocaleDateString('en-US', { month: 'short' });
			const monthLongName = firstDayOfTheMonth.toLocaleDateString('en-US', { month: 'long' });

			lastSevenMonthsData.push({
				name: monthShortName,
				fullName: `${monthLongName}`,
				completedTasks: [],
				focusRecords: [],
				focusDuration: 0,
			});
		}

		// Go through each month and each day in that month, get the stats for that day and add or push it to its month's total stats.
		for (let i = 0; i < lastSevenMonths.length; i++) {
			const month = lastSevenMonths[i];
			const currentMonthData = lastSevenMonthsData[i];

			for (let day of month) {
				const dayKey = getFormattedLongDay(day);

				const completedTasks = completedTasksGroupedByDate[dayKey] || [];
				const focusRecords = focusRecordsGroupedByDate[dayKey] || [];
				const focusDuration = (focusRecords && getFocusDurationFromArray({ focusRecords })) || 0;

				currentMonthData.completedTasks.push(...completedTasks);
				currentMonthData.focusRecords.push(...focusRecords);
				currentMonthData.focusDuration += focusDuration;
			}
		}

		return lastSevenMonthsData;
	};

	const getCompletedTasksFromSelectedDates = (datesArr) => {
		const completedTasks = [];

		for (let date of datesArr) {
			const dateKey = getFormattedLongDay(date);
			const completedTasksForDateArr = allCompletedTasksGroupedByDate[dateKey] || [];
			completedTasks.push(...completedTasksForDateArr);
		}

		return completedTasks;
	};

	const getFocusRecordsFromSelectedDates = (datesArr) => {
		const focusRecords = [];

		for (let date of datesArr) {
			const dateKey = getFormattedLongDay(date);
			const focusRecordsForDateArr = focusRecordsGroupedByDate[dateKey] || [];
			focusRecords.push(...focusRecordsForDateArr);
		}

		return focusRecords;
	};

	return {
		total: {
			numOfAllTasks: allTasksAndItems?.length || 0,
			numOfCompletedTasks: totalCompletedTasks || 0,
			numOfProjects: projects?.length || 0,
			numOfDaysSinceAccountCreated: days || 0,
			numOfFocusRecords: filteredFocusRecords?.length || 0,
			focusDuration: totalFocusDuration || 0,
		},
		today: {
			numOfCompletedTasks: completedTasksForToday?.length || 0,
			numOfFocusRecords: focusRecordsFromToday?.length || 0,
			focusDuration: focusDurationForToday || 0,
		},
		statsForLastSevenDays,
		statsForLastSevenWeeks,
		statsForLastSevenMonths,

		// From RTK Query
		allCompletedTasks,
		completedTasksGroupedByDate,
		filteredDaysWithCompletedTasks,
		tasksById,
		projectsById,
		todoistAllProjectsById,
		sessionCategoriesById,
		tags,
		tagsByRawName,
		focusRecords: filteredFocusRecords,
		focusRecordsGroupedByDate,

		allFocusRecordsAreHere,
		allCompletedTasksAreHere,

		// Functions
		getCompletedTasksFromSelectedDates,
		getFocusRecordsFromSelectedDates,
	};
};
