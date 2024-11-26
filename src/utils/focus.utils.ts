import {
	getDayString,
	getFormattedLongDay,
	getDateMapSinceDay,
	sortObjectByDateKeys,
	areDatesEqual,
	getFormattedShortMonthDay,
} from './date.utils';
import { getFocusDurationFilteredByProjects } from './focus-apps/focusRecords.utils';

export const CRUCIAL_PROJECTS = {
	LeetCode: true,
	'Side Projects': true,
	'Behavioral Interview Prep': true,
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
	const currentDayString = getDayString(date);
	const goalSecondsForToday = GOAL_FOR_DAYS[currentDayString];
	return goalSecondsForToday;
};

export const getDurationForFocusRecordsFilteredByProjects = (focusRecords) => {
	let totalFocusDuration = 0;

	focusRecords?.forEach((focusRecord) => {
		totalFocusDuration += getFocusDurationFilteredByProjects(focusRecord, CRUCIAL_PROJECTS);
	});

	return totalFocusDuration;
};

export const getStreaksInfo = (focusRecords) => {
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

	Object.keys(focusRecordsByDate).map((dayKey) => {
		const focusRecordsForDay = focusRecordsByDate[dayKey];
		const durationForDay = getDurationForFocusRecordsFilteredByProjects(focusRecordsForDay);
		totalFocusDurationByDate[dayKey] = durationForDay;
	});

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

export const getFocusRecordsFromToday = (focusRecords) => {
	const focusRecordsFromToday = [];

	for (let focusRecord of focusRecords) {
		const isFocusRecordFromToday = areDatesEqual(new Date(focusRecord.startTime), new Date());

		// The array of focus records is sorted in order from start time so the most recent focus records will show up first. This means that today's focus records will show up first - assuming there is any. So, when you get to the first focus record that is not from today, we have found all possible focus records for today. This prevents the loop from going through thousands of records.
		if (!isFocusRecordFromToday) {
			break;
		}

		focusRecordsFromToday.push(focusRecord);
	}

	return focusRecordsFromToday;
};

export const getFocusDurationForDay = (focusRecordsByDate, date) => {
	const dayKey = getFormattedLongDay(date);
	const focusRecordsForTheDay = focusRecordsByDate[dayKey];
	return getDurationForFocusRecordsFilteredByProjects(focusRecordsForTheDay);
};

export const getFocusDataForDayInfo = (focusRecordsByDate, date) => {
	const goalSeconds = getGoalSeconds(date);
	const totalFocusDurationForDay = getFocusDurationForDay(focusRecordsByDate, date);
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

	const getPeriodKey = (endOfPeriod) => {
		switch (period) {
			case 'week':
				return getFormattedLongDay(endOfPeriod);
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
		const periodKey = getPeriodKey(endOfPeriod);

		if (!results[periodKey]) {
			results[periodKey] = 0;
		}

		// Add the focus duration to the period
		results[periodKey] += numsData[dateStr];
	});

	return results;
};
