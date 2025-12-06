import {
	getDayString,
	getFormattedLongDay,
	getDateMapSinceDay,
	sortObjectByDateKeys,
	areDatesEqual,
	getFormattedShortMonthDay,
} from './date.utils';
import { getFocusDurationFilteredByProjects, getFocusDurationFromArray } from './focus-apps/focusRecords.utils';
import { parseFormattedDuration } from './focus-apps/helpers.utils';

export const CRUCIAL_PROJECTS = {
	'LeetCode': true,
	'Side Projects': true,
	'Behavioral Interview Prep': true,
	'DS&A': true,
	'University Courses': true,
	'NeetCode 250': true,
	'MIT': true,
	'GUNPLA': true
};

export const GOAL_FOR_DAYS = {
	Sunday: 5400,
	Monday: 5400,
	Tuesday: 5400,
	Wednesday: 5400,
	Thursday: 5400,
	Friday: 5400,
	Saturday: 5400,
};

export const getGoalSeconds = (date) => {
	const defaultGoalSeconds = parseFormattedDuration('6h')

	const currentDayString = getDayString(date);
	const goalSecondsForToday = defaultGoalSeconds || GOAL_FOR_DAYS[currentDayString];
	return goalSecondsForToday;
};

export const getDurationForFocusRecordsFilteredByProjects = (focusRecords, filteredProjects, tasksById) => {
	let totalFocusDuration = 0;

	focusRecords?.forEach((focusRecord) => {
		totalFocusDuration += getFocusDurationFilteredByProjects(focusRecord, filteredProjects, tasksById);
	});

	return totalFocusDuration;
};

export const getStreaksInfo = (focusRecords, filteredProjects, tasksById) => {
	const focusRecordsByDate = {};

	focusRecords.forEach((focusRecord) => {
		const { startTime } = focusRecord;

		const dayKey = getFormattedLongDay(new Date(startTime));

		if (!focusRecordsByDate[dayKey]) {
			focusRecordsByDate[dayKey] = [];
		}

		focusRecordsByDate[dayKey].push(focusRecord);
	});

	const totalFocusDurationByDate = getDateMapSinceDay('November 1, 2020');
	const includeAllProjects = Object.values(filteredProjects).every(value => value === false)

	if (includeAllProjects) {
		Object.keys(focusRecordsByDate).map((dayKey) => {
			const focusRecordsForDay = focusRecordsByDate[dayKey];
			const durationForDay = getFocusDurationFromArray({ focusRecords: focusRecordsForDay, startDate: new Date(dayKey) });
			totalFocusDurationByDate[dayKey] = durationForDay;
		});
	} else {
		Object.keys(focusRecordsByDate).map((dayKey) => {
			const focusRecordsForDay = focusRecordsByDate[dayKey];
			const durationForDay = getDurationForFocusRecordsFilteredByProjects(focusRecordsForDay, filteredProjects, tasksById);
			totalFocusDurationByDate[dayKey] = durationForDay;
		});
	}
	
	const sortedFocusDurationByDate = sortObjectByDateKeys(totalFocusDurationByDate);

	const newStreaksInfo = {
		currentStreak: {
			days: 0,
			from: null,
			to: null,
		},
		longestStreak: {
			days: 0,
			from: null,
			to: null,
		},
		allStreaks: [],
	};

	const todayDateKey = getFormattedLongDay(new Date());

	// TODO: This will not currently count days that have no focus records like October 20, 2024. So, those will not break a streak as of now. Will need to fix later to include those too.
	for (const dateKey of Object.keys(sortedFocusDurationByDate)) {
		const focusDurationForDay = sortedFocusDurationByDate[dateKey];
		const goalSecondsForDay = getGoalSeconds(new Date(dateKey));
		const goalHasBeenMet = focusDurationForDay >= goalSecondsForDay;

		const { currentStreak, longestStreak, allStreaks } = newStreaksInfo;

		if (goalHasBeenMet) {
			currentStreak.days += 1;

			if (!currentStreak.from) {
				currentStreak.from = dateKey;
			}

			currentStreak.to = dateKey;

			if (currentStreak.days >= longestStreak.days) {
				newStreaksInfo.longestStreak = { ...currentStreak };
			}
		} else {
			const isToday = todayDateKey === dateKey;

			// If the goal has not been met and it's the current day, then there's still a chance to achieve the goal for the day so the streak has not been broken yet.
			if (isToday) {
				continue;
			}

			const newStreakHasStarted = currentStreak.days > 0;

			// If the goal has not been met for the day, then the streak has been broken and must be reset. If there was a current streak (1 day or more), add that to the list of the "allStreaks" and reset "currentStreak".
			if (newStreakHasStarted) {
				allStreaks.push({ ...currentStreak });

				if (currentStreak.days >= longestStreak.days) {
					newStreaksInfo.longestStreak = { ...currentStreak };
				}

				// Reset current streak
				currentStreak.days = 0;
				currentStreak.from = null;
				currentStreak.to = null;
			}
		}
	}

	return newStreaksInfo;
};

export const getFocusDurationForDay = (focusRecordsByDate, date, filteredProjects, tasksById) => {
	const dayKey = getFormattedLongDay(date);
	const focusRecordsForTheDay = focusRecordsByDate[dayKey];
	const includeAllProjects = Object.values(filteredProjects).every(value => value === false)

	if (includeAllProjects) {
		return getFocusDurationFromArray({
			focusRecords: focusRecordsForTheDay,
			startDate: date
		});
	}
	
	return getDurationForFocusRecordsFilteredByProjects(focusRecordsForTheDay, filteredProjects, tasksById);
};


export const getFocusDataForDayInfo = (focusRecordsByDate, date, filteredProjects, tasksById) => {
	const goalSeconds = getGoalSeconds(date);
	const totalFocusDurationForDay = getFocusDurationForDay(focusRecordsByDate, date, filteredProjects, tasksById);
	const percentageOfFocusedGoalHours = (totalFocusDurationForDay / goalSeconds) * 100;

	return {
		goalSeconds,
		totalFocusDurationForDay,
		percentageOfFocusedGoalHours,
	};
};

/**
 * @description Adds up the focus duration or completed tasks number over different grouped periods using the object with the num value (focus duration or completed tasks length) for all the singular days "numsData".
 * @param {Object} numsData
 * @param {String} period
 * @returns {Object}
 */
export const sumNumsByPeriod = (numsData, period) => {
	const results = {}; // Object to hold the sum of focus time for each period

	/**
	 * @description Gets the start of the passed in period (week, month, year).
	 */
	function getStartOfPeriod(date, period) {
		switch (period) {
			// For the passed in date, retreive that date's monday. For example, if the date is November 26, 2024 (Tuesday), then this would get November 25, 2024 (Monday).
			case 'week':
				const dayOfWeek = date.getDay();
				const thatWeeksMonday = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
				date.setDate(thatWeeksMonday);
				date.setHours(0, 0, 0, 0);
				return new Date(date);
			// Gets the first day of the month for that date
			case 'month':
				return new Date(date.getFullYear(), date.getMonth(), 1);
			// Gets the first day of January of that year for that date.
			case 'year':
				return new Date(date.getFullYear(), 0, 1);
			default:
				return new Date(date);
		}
	}

	/**
	 * @description
	 */
	function getEndOfPeriod(start, period) {
		switch (period) {
			// With "week", the corresponding "getStartOfPeriod" function will always set the start date to Monday so adding 6 to the Monday date will bring us to the end of the period/week (Sunday).
			case 'week':
				start.setDate(start.getDate() + 6);
				start.setHours(23, 59, 59, 999);
				return new Date(start);
			// Gets the last day of the month for that date "start.getMonth()" will set it to the next month and then "0" after it will set it back by one.
			case 'month':
				return new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
			// Sets this to December 31 of that date's year.
			case 'year':
				return new Date(start.getFullYear(), 11, 31, 23, 59, 59, 999);
			default:
				return new Date(start);
		}
	}

	const getPeriodKey = (startOfPeriod, endOfPeriod) => {
		switch (period) {
			case 'week':
				return `${getFormattedShortMonthDay(startOfPeriod)} - ${getFormattedShortMonthDay(endOfPeriod)}`;
			case 'month':
				return new Date(endOfPeriod).toLocaleString('default', { month: 'long', year: 'numeric' });
			case 'year':
				return new Date(endOfPeriod).toLocaleString('default', { year: 'numeric' });
		}
	};

	Object.keys(numsData).forEach((dateStr) => {
		const date = new Date(dateStr);
		const startOfPeriod = getStartOfPeriod(new Date(date), period);
		const endOfPeriod = getEndOfPeriod(new Date(startOfPeriod), period);

		// A period key can be created because each date in the array of focus data will have their own period key that is shared by other dates that are within the same period.
		const periodKey = getPeriodKey(startOfPeriod, endOfPeriod);

		if (!results[periodKey]) {
			results[periodKey] = 0;
		}

		// Add the focus duration to the period
		results[periodKey] += numsData[dateStr];
	});

	return results;
};

export const getFilteredProjectsWithNames = (filteredProjects, projectsById) => {
	const filteredProjectsWithNames = { ...filteredProjects };

	for (const [projectId, checked] of Object.entries(filteredProjects)) {
		const { name } = projectsById[projectId];
		filteredProjectsWithNames[name] = checked;
	}

	return filteredProjectsWithNames;
};

export const parseDateRange = (rangeType, rangeValue) => {
  const parseMonthYear = (str) => {
    const [monthName, year] = str.split(" ");
    const month = new Date(`${monthName} 1, ${year}`).getMonth();
    return { month, year: parseInt(year) };
  };

  const parseWeek = (str) => {
    const [startStr, endStr] = str.split(" - ");
    return [new Date(startStr), new Date(endStr)];
  };

  switch (rangeType.toLowerCase()) {
    case "day": {
      const date = new Date(rangeValue);
      return { startDate: date, endDate: date };
    }

    case "week": {
      const [start, end] = parseWeek(rangeValue);
      return { startDate: start, endDate: end };
    }

    case "month": {
      const { month, year } = parseMonthYear(rangeValue);
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0); // last day of the month
      return { startDate, endDate };
    }

    case "year": {
      const year = parseInt(rangeValue);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      return { startDate, endDate };
    }

    default:
      throw new Error("Unsupported range type: " + rangeType);
  }
}
