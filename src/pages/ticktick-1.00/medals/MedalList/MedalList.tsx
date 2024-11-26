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
import { sumFocusByPeriod } from '../../../../utils/focus.utils';
import { usePageContext } from 'vike-react/usePageContext';
import { DEFAULT_DAILY_COMPLETED_TASKS_MEDALS } from '../../../../utils/constants/tasks/tasksMedals.utils';

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

	useEffect(() => {
		const { type } = pageContext.routeParams;

		switch (type) {
			case 'focus':
				if (!focusRecordsGroupedByDate) {
					return;
				}

				updateFocusMedalsData();
				break;
			case 'tasks':
				if (!allCompletedTasksGroupedByDate) {
					return;
				}

				updateCompletedTasksMedalsData();
				break;
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

		const focusDurationByWeek = sumFocusByPeriod(newFocusDurationByDate, 'week');
		const focusDurationByMonth = sumFocusByPeriod(newFocusDurationByDate, 'month');
		const focusDurationByYear = sumFocusByPeriod(newFocusDurationByDate, 'year');

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

		const { type, interval } = pageContext.routeParams;

		console.log(type);

		// TODO: Pick the first earned medal from the specific interval and type
		setChosenMedal(newDailyFocusHoursMedals[0]);
	};

	const getTimesEarnedForInterval = (valueForInterval, medals, minValueProp) => {
		Object.entries(valueForInterval).forEach(([dateKey, value]) => {
			medals.forEach((medal) => {
				const minValue = medal[minValueProp];

				if (value >= minValue) {
					medal.timesEarned += 1;
				}
			});
		});
	};

	const updateCompletedTasksMedalsData = () => {
		const newCompletedTasksByDate = {};

		const newDailyCompletedTasksMedals = JSON.parse(JSON.stringify(DEFAULT_DAILY_COMPLETED_TASKS_MEDALS));

		// Get the focus duration for each day.
		Object.entries(allCompletedTasksGroupedByDate).forEach(([dateKey, completedTasks]) => {
			newCompletedTasksByDate[dateKey] = completedTasks.length;
		});

		// Calculate the number of times a medal for each interval was earned.
		getTimesEarnedForInterval(newCompletedTasksByDate, newDailyCompletedTasksMedals, 'requiredCompletedTasks');

		// Update with new focus durations
		setDailyCompletedTasksMedals(newDailyCompletedTasksMedals);

		const { type, interval } = pageContext.routeParams;

		console.log(newDailyCompletedTasksMedals);

		// TODO: Pick the first earned medal from the specific interval and type
		setChosenMedal(newDailyCompletedTasksMedals[0]);
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
			// weekly: weeklyFocusHoursMedals,
			// monthly: monthlyFocusHoursMedals,
			// yearly: yearlyFocusHoursMedals,
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

	console.log(medalsToUse);

	const medalsThatHaveNotBeenEarned = medalsToUse.filter((medal) => medal.timesEarned === 0);
	const medalsThatHaveBeenEarned = medalsToUse.filter((medal) => medal.timesEarned > 0);

	return (
		<div className="col-span-8 grid grid-cols-4 gap-2 overflow-auto gray-scrollbar" style={{ maxHeight }}>
			{medalsThatHaveBeenEarned.map((medal) => {
				return <MedalCard key={medal.name} {...{ medal: medal, chosenMedal, setChosenMedal }} />;
			})}

			{medalsThatHaveNotBeenEarned.map((medal) => {
				return <MedalCard key={medal.name} {...{ medal: medal, chosenMedal, setChosenMedal }} />;
			})}
		</div>
	);
};

export default MedalList;
