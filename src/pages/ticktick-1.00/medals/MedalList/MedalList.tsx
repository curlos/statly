import { useState, useEffect } from 'react';
import { useStatsContext } from '../../../../contexts/useStatsContext';
import {
	DEFAULT_DAILY_FOCUS_HOURS_MEDALS,
	DEFAULT_WEEKLY_FOCUS_HOURS_MEDALS,
	DEFAULT_MONTHLY_FOCUS_HOURS_MEDALS,
	DEFAULT_YEARLY_FOCUS_HOURS_MEDALS,
} from '../../../../utils/constants/focus/focusHoursMedals.utils';
import { getFocusDurationFromArray } from '../../../../utils/focus-apps/focusRecords.utils';
import MedalCard from './MedalCard';
import { sumNumsByPeriod } from '../../../../utils/focus.utils';
import { usePageContext } from 'vike-react/usePageContext';
import {
	DEFAULT_DAILY_COMPLETED_TASKS_MEDALS,
	DEFAULT_MONTHLY_COMPLETED_TASKS_MEDALS,
	DEFAULT_WEEKLY_COMPLETED_TASKS_MEDALS,
	DEFAULT_YEARLY_COMPLETED_TASKS_MEDALS,
} from '../../../../utils/constants/tasks/tasksMedals.utils';

const MedalList = ({ maxHeight, chosenMedal, setChosenMedal }) => {
	const pageContext = usePageContext();
	const { focusRecordsGroupedByDate, allCompletedTasksGroupedByDate } = useStatsContext();

	// Focus Medals
	const [dailyFocusHoursMedals, setDailyFocusHoursMedals] = useState(DEFAULT_DAILY_FOCUS_HOURS_MEDALS);
	const [weeklyFocusHoursMedals, setWeeklyFocusHoursMedals] = useState(DEFAULT_WEEKLY_FOCUS_HOURS_MEDALS);
	const [monthlyFocusHoursMedals, setMonthlyFocusHoursMedals] = useState(DEFAULT_MONTHLY_FOCUS_HOURS_MEDALS);
	const [yearlyFocusHoursMedals, setYearlyFocusHoursMedals] = useState(DEFAULT_YEARLY_FOCUS_HOURS_MEDALS);

	// Tasks Medals
	const [dailyCompletedTasksMedals, setDailyCompletedTasksMedals] = useState(DEFAULT_DAILY_COMPLETED_TASKS_MEDALS);
	const [weeklyCompletedTasksMedals, setWeeklyCompletedTasksMedals] = useState(DEFAULT_WEEKLY_COMPLETED_TASKS_MEDALS);
	const [monthlyCompletedTasksMedals, setMonthlyCompletedTasksMedals] = useState(
		DEFAULT_MONTHLY_COMPLETED_TASKS_MEDALS
	);
	const [yearlyCompletedTasksMedals, setYearlyCompletedTasksMedals] = useState(DEFAULT_YEARLY_COMPLETED_TASKS_MEDALS);

	useEffect(() => {
		if (!focusRecordsGroupedByDate || !allCompletedTasksGroupedByDate) {
			return;
		}

		const {
			newDailyFocusHoursMedals,
			newWeeklyFocusHoursMedals,
			newMonthlyFocusHoursMedals,
			newYearlyFocusHoursMedals,
		} = updateFocusMedalsData();
		const {
			newDailyCompletedTasksMedals,
			newWeeklyCompletedTasksMedals,
			newMonthlyCompletedTasksMedals,
			newYearlyCompletedTasksMedals,
		} = updateCompletedTasksMedalsData();

		if (!chosenMedal || Object.keys(chosenMedal).length === 0) {
			const allMedals = {
				focus: {
					daily: newDailyFocusHoursMedals,
					weekly: newWeeklyFocusHoursMedals,
					monthly: newMonthlyFocusHoursMedals,
					yearly: newYearlyFocusHoursMedals,
				},
				tasks: {
					daily: newDailyCompletedTasksMedals,
					weekly: newWeeklyCompletedTasksMedals,
					monthly: newMonthlyCompletedTasksMedals,
					yearly: newYearlyCompletedTasksMedals,
				},
			};

			const { type, interval } = pageContext.routeParams;

			const newChosenMedal = allMedals[type][interval].find((medal) => {
				const timesEarned = !medal.intervalsEarned || medal.intervalsEarned.length;
				return timesEarned > 0;
			});

			setChosenMedal(newChosenMedal);
		}
	}, [focusRecordsGroupedByDate, pageContext]);

	const updateFocusMedalsData = () => {
		const newFocusDurationByDate = {};

		const newDailyFocusHoursMedals = JSON.parse(JSON.stringify(DEFAULT_DAILY_FOCUS_HOURS_MEDALS));
		const newWeeklyFocusHoursMedals = JSON.parse(JSON.stringify(DEFAULT_WEEKLY_FOCUS_HOURS_MEDALS));
		const newMonthlyFocusHoursMedals = JSON.parse(JSON.stringify(DEFAULT_MONTHLY_FOCUS_HOURS_MEDALS));
		const newYearlyFocusHoursMedals = JSON.parse(JSON.stringify(DEFAULT_YEARLY_FOCUS_HOURS_MEDALS));

		// Get the focus duration for each day.
		Object.entries(focusRecordsGroupedByDate).forEach(([dateKey, focusRecords]) => {
			newFocusDurationByDate[dateKey] = getFocusDurationFromArray(focusRecords);
		});

		const focusDurationByWeek = sumNumsByPeriod(newFocusDurationByDate, 'week');
		const focusDurationByMonth = sumNumsByPeriod(newFocusDurationByDate, 'month');
		const focusDurationByYear = sumNumsByPeriod(newFocusDurationByDate, 'year');

		// Calculate the number of times a medal for each interval was earned.
		getTimesEarnedForInterval(newFocusDurationByDate, newDailyFocusHoursMedals, 'requiredDuration');
		getTimesEarnedForInterval(focusDurationByWeek, newWeeklyFocusHoursMedals, 'requiredDuration');
		getTimesEarnedForInterval(focusDurationByMonth, newMonthlyFocusHoursMedals, 'requiredDuration');
		getTimesEarnedForInterval(focusDurationByYear, newYearlyFocusHoursMedals, 'requiredDuration');

		// Update with new focus durations
		setDailyFocusHoursMedals(newDailyFocusHoursMedals);
		setWeeklyFocusHoursMedals(newWeeklyFocusHoursMedals);
		setMonthlyFocusHoursMedals(newMonthlyFocusHoursMedals);
		setYearlyFocusHoursMedals(newYearlyFocusHoursMedals);

		return {
			newDailyFocusHoursMedals,
			newWeeklyFocusHoursMedals,
			newMonthlyFocusHoursMedals,
			newYearlyFocusHoursMedals,
		};
	};

	const getTimesEarnedForInterval = (valueForInterval, medals, minValueProp) => {
		Object.entries(valueForInterval).forEach(([dateKey, value]) => {
			medals.forEach((medal) => {
				const minValue = medal[minValueProp];

				if (value >= minValue) {
					if (!medal.intervalsEarned) {
						medal.intervalsEarned = [];
					}

					medal.intervalsEarned.push(dateKey);
				}
			});
		});
	};

	const updateCompletedTasksMedalsData = () => {
		const newCompletedTasksByDate = {};

		const newDailyCompletedTasksMedals = JSON.parse(JSON.stringify(DEFAULT_DAILY_COMPLETED_TASKS_MEDALS));
		const newWeeklyCompletedTasksMedals = JSON.parse(JSON.stringify(DEFAULT_WEEKLY_COMPLETED_TASKS_MEDALS));
		const newMonthlyCompletedTasksMedals = JSON.parse(JSON.stringify(DEFAULT_MONTHLY_COMPLETED_TASKS_MEDALS));
		const newYearlyCompletedTasksMedals = JSON.parse(JSON.stringify(DEFAULT_YEARLY_COMPLETED_TASKS_MEDALS));

		// Get the focus duration for each day.
		Object.entries(allCompletedTasksGroupedByDate).forEach(([dateKey, completedTasks]) => {
			newCompletedTasksByDate[dateKey] = completedTasks.length;
		});

		const completedTasksNumByWeek = sumNumsByPeriod(newCompletedTasksByDate, 'week');
		const completedTasksNumByMonth = sumNumsByPeriod(newCompletedTasksByDate, 'month');
		const completedTasksNumByYear = sumNumsByPeriod(newCompletedTasksByDate, 'year');

		// Calculate the number of times a medal for each interval was earned.
		getTimesEarnedForInterval(newCompletedTasksByDate, newDailyCompletedTasksMedals, 'requiredCompletedTasks');
		getTimesEarnedForInterval(completedTasksNumByWeek, newWeeklyCompletedTasksMedals, 'requiredCompletedTasks');
		getTimesEarnedForInterval(completedTasksNumByMonth, newMonthlyCompletedTasksMedals, 'requiredCompletedTasks');
		getTimesEarnedForInterval(completedTasksNumByYear, newYearlyCompletedTasksMedals, 'requiredCompletedTasks');

		// Update with new focus durations
		setDailyCompletedTasksMedals(newDailyCompletedTasksMedals);
		setWeeklyCompletedTasksMedals(newWeeklyCompletedTasksMedals);
		setMonthlyCompletedTasksMedals(newMonthlyCompletedTasksMedals);
		setYearlyCompletedTasksMedals(newYearlyCompletedTasksMedals);

		return {
			newDailyCompletedTasksMedals,
			newWeeklyCompletedTasksMedals,
			newMonthlyCompletedTasksMedals,
			newYearlyCompletedTasksMedals,
		};
	};

	const getMedalsToUse = () => {
		const focusHoursMedals = {
			daily: dailyFocusHoursMedals,
			weekly: weeklyFocusHoursMedals,
			monthly: monthlyFocusHoursMedals,
			yearly: yearlyFocusHoursMedals,
		};

		const completedTasksMedals = {
			daily: dailyCompletedTasksMedals,
			weekly: weeklyCompletedTasksMedals,
			monthly: monthlyCompletedTasksMedals,
			yearly: yearlyCompletedTasksMedals,
		};

		const { type } = pageContext.routeParams;
		const medalsToLookThrough = type === 'focus' ? focusHoursMedals : completedTasksMedals;

		for (const [interval, medals] of Object.entries(medalsToLookThrough)) {
			if (location.pathname.includes(interval)) {
				return medals;
			}
		}
	};

	const medalsToUse = getMedalsToUse();

	const medalsThatHaveBeenEarned = medalsToUse.filter((medal) => {
		const timesEarned = !medal.intervalsEarned || medal.intervalsEarned.length;
		return timesEarned > 0;
	});

	const medalsThatHaveNotBeenEarned = medalsToUse.filter((medal) => {
		const timesEarned = !medal.intervalsEarned || medal.intervalsEarned.length;
		return timesEarned === 0;
	});

	return (
		<div className="col-span-12 sm:col-span-8">
			<div
				className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 overflow-auto gray-scrollbar"
				style={{ maxHeight }}
			>
				{medalsThatHaveBeenEarned.map((medal) => {
					return <MedalCard key={medal.name} {...{ medal: medal, chosenMedal, setChosenMedal }} />;
				})}

				{medalsThatHaveNotBeenEarned.map((medal) => {
					return <MedalCard key={medal.name} {...{ medal: medal, chosenMedal, setChosenMedal }} />;
				})}
			</div>
		</div>
	);
};

export default MedalList;
