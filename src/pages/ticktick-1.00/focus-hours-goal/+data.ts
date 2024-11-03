import {
	getFormattedLongDay,
	getDateMapSinceDay,
	sortObjectByDateKeys,
	areDatesEqual,
	getDayString,
} from '../../../utils/date.utils';
import { getFocusDurationFilteredByProjects } from '../../../utils/helpers.utils';

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async () => {
	const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/ticktick-1.0/focus-records`);
	const focusRecords = await response.json();

	const streaksInfo = getStreaksInfo(focusRecords);
	const goalSeconds = getGoalSeconds(new Date());
	const totalFocusDurationToday = getTotalFocusDurationToday(focusRecords);
	const percentageOfFocusedGoalHours = getPercentageOfFocusedGoalHours(focusRecords);

	return {
		focusRecords,
		streaksInfo,
		goalSeconds,
		totalFocusDurationToday,
		percentageOfFocusedGoalHours,
	};
};

const CRUCIAL_PROJECTS = {
	LeetCode: true,
	'Side Projects': true,
	'Behavioral Interview Prep': true,
};

const GOAL_FOR_DAYS = {
	Sunday: 5400,
	Monday: 5400,
	Tuesday: 5400,
	Wednesday: 5400,
	Thursday: 5400,
	Friday: 5400,
	Saturday: 5400,
};

const getGoalSeconds = (date) => {
	const currentDayString = getDayString(date);
	const goalSecondsForToday = GOAL_FOR_DAYS[currentDayString];
	return goalSecondsForToday;
};

const getDurationForFocusRecordsFilteredByProjects = (focusRecords) => {
	let totalFocusDuration = 0;

	focusRecords?.forEach((focusRecord) => {
		totalFocusDuration += getFocusDurationFilteredByProjects(focusRecord, CRUCIAL_PROJECTS);
	});

	return totalFocusDuration;
};

const getStreaksInfo = (focusRecords) => {
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

const getFocusRecordsFromToday = (focusRecords) => {
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

const getTotalFocusDurationToday = (focusRecords) => {
	const focusRecordsFromToday = getFocusRecordsFromToday(focusRecords);
	return getDurationForFocusRecordsFilteredByProjects(focusRecordsFromToday);
};

const getPercentageOfFocusedGoalHours = (focusRecords) => {
	const GOAL_SECONDS = getGoalSeconds(new Date());
	const totalFocusDurationToday = getTotalFocusDurationToday(focusRecords);
	return (totalFocusDurationToday / GOAL_SECONDS) * 100;
};
