import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import {
	getDayString,
	getFormattedLongDay,
	getDateMapSinceDay,
	sortObjectByDateKeys,
	areDatesEqual,
} from '../../utils/date.utils';
import { getFocusDurationFilteredByProjects, getFormattedDuration } from '../../utils/helpers.utils';

const CRUCIAL_PROJECTS = {
	LeetCode: true,
	'Side Projects': true,
	'Behavioral Interview Prep': true,
};

const GOAL_FOR_DAYS = {
	Sunday: 5400,
	Monday: 3600,
	Tuesday: 3600,
	Wednesday: 3600,
	Thursday: 3600,
	Friday: 3600,
	Saturday: 5400,
};

const getGoalSeconds = (date) => {
	const currentDayString = getDayString(date);
	const goalSecondsForToday = GOAL_FOR_DAYS[currentDayString];
	return goalSecondsForToday;
};

const getDurationForFocusRecordsFilteredByProjects = (focusRecords) => {
	let totalFocusDuration = 0;

	focusRecords.forEach((focusRecord) => {
		totalFocusDuration += getFocusDurationFilteredByProjects(focusRecord, CRUCIAL_PROJECTS);
	});

	return totalFocusDuration;
};

const DailyHoursFocusGoal = ({ focusRecords }) => {
	const [streaksInfo, setStreaksInfo] = useState({
		currentStreak: 0,
		longestStreak: 0,
		allStreaks: {},
	});

	useEffect(() => {
		if (focusRecords) {
			const streakObj = {
				currentStreak: 0,
			};

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

			// TODO: This will not currently count days that have no focus records like October 20, 2024. So, those will not break a streak as of now. Will need to fix later to include those too.
			Object.keys(sortedFocusDurationByDate).forEach((dateKey) => {
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
			});

			setStreaksInfo(newStreaksInfo);
		}
	}, [focusRecords]);

	// 18,000 seconds = 5 Hours, the daily goal for number of focus hours per day.
	// TODO: GOAL number of seconds should editable in the "/user-settings" endpoint and that should come from there.
	const GOAL_SECONDS = getGoalSeconds(new Date());

	if (!focusRecords) {
		return null;
	}

	const getFocusRecordsFromToday = () => {
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

	const getTotalFocusDurationToday = () => {
		const focusRecordsFromToday = getFocusRecordsFromToday();
		return getDurationForFocusRecordsFilteredByProjects(focusRecordsFromToday);
	};

	const getPercentageOfFocusedGoalHours = () => {
		const totalFocusDurationToday = getTotalFocusDurationToday();
		return (totalFocusDurationToday / GOAL_SECONDS) * 100;
	};

	const totalFocusDurationToday = getTotalFocusDurationToday();
	const percentageOfFocusedGoalHours = getPercentageOfFocusedGoalHours();
	const completedGoalForTheDay = percentageOfFocusedGoalHours >= 100;

	return (
		<div>
			<div className="flex justify-end items-center text-orange-500">
				<Icon name="local_fire_department" customClass={'!text-[32px]'} />
				<span className="text-[20px]">
					<span className="text-[32px] font-bold">{streaksInfo.longestStreak.days}</span>
					/90
				</span>
			</div>
			<CircularProgressbarWithChildren
				value={getPercentageOfFocusedGoalHours()}
				strokeWidth={3}
				styles={buildStyles({
					textColor: '#4772F9',
					pathColor: completedGoalForTheDay ? '#00cc66' : '#34d399', // Red when overtime, otherwise original color
					trailColor: '#3d3c3c',
				})}
				counterClockwise={false}
				className={completedGoalForTheDay ? 'animated-progress-path' : ''}
			>
				<div
					className="text-white text-[40px] flex justify-center gap-4 w-[100%] select-none cursor-pointer mb-[-10px]"
					onMouseOver={() => {}}
				>
					<div data-cy="timer-display" className="text-center text-[32px]">
						<div className="mt-3">
							<span className="text-[48px] font-[600]">
								{getFormattedDuration(totalFocusDurationToday, false)}
							</span>
							<span className="">/</span>
							<span>{getFormattedDuration(GOAL_SECONDS, false)}</span>
						</div>

						<div className="text-[22px] mt-[-5px] text-color-gray-100">
							{Number(percentageOfFocusedGoalHours).toFixed(2)}%
						</div>
					</div>
				</div>
			</CircularProgressbarWithChildren>
		</div>
	);
};

export default DailyHoursFocusGoal;
