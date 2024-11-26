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

const MedalList = ({ maxHeight, chosenMedal, setChosenMedal }) => {
	const { focusRecordsGroupedByDate } = useStatsContext();

	const [dailyFocusHoursMedals, setDailyFocusHoursMedals] = useState(DEFAULT_DAILY_FOCUS_HOURS_MEDALS);
	const [weeklyFocusHoursMedals, setWeeklyFocusHoursMedals] = useState(DEFAULT_WEEKLY_FOCUS_HOURS_MEDALS);
	const [monthlyFocusHoursMedals, setMonthlyFocusHoursMedals] = useState(DEFAULT_MONTHLY_FOCUS_HOURS_MEDALS);
	const [yearlyFocusHoursMedals, setYearlyFocusHoursMedals] = useState(DEFAULT_YEARLY_FOCUS_HOURS_MEDALS);

	const getTimesEarnedForInterval = (focusDurationForInterval, intervalFocusHoursMedals) => {
		Object.entries(focusDurationForInterval).forEach(([dateKey, focusDuration]) => {
			intervalFocusHoursMedals.forEach((focusHourMedal) => {
				const { requiredDuration } = focusHourMedal;

				if (focusDuration >= requiredDuration) {
					focusHourMedal.timesEarned += 1;
				}
			});
		});
	};

	useEffect(() => {
		if (!focusRecordsGroupedByDate) {
			return;
		}

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
		getTimesEarnedForInterval(newFocusDurationByDate, newDailyFocusHoursMedals);
		getTimesEarnedForInterval(focusDurationByWeek, newWeeklyFocusHoursMedals);
		getTimesEarnedForInterval(focusDurationByMonth, newMonthlyFocusHoursMedals);
		getTimesEarnedForInterval(focusDurationByYear, newYearlyFocusHoursMedals);

		// Update with new focus durations
		setDailyFocusHoursMedals(newDailyFocusHoursMedals);
		setWeeklyFocusHoursMedals(newWeeklyFocusHoursMedals);
		setMonthlyFocusHoursMedals(newMonthlyFocusHoursMedals);
		setYearlyFocusHoursMedals(newYearlyFocusHoursMedals);

		setChosenMedal(newDailyFocusHoursMedals[0]);
	}, [focusRecordsGroupedByDate]);

	const getMedalsToUse = () => {
		const allMedals = {
			daily: dailyFocusHoursMedals,
			weekly: weeklyFocusHoursMedals,
			monthly: monthlyFocusHoursMedals,
			yearly: yearlyFocusHoursMedals,
		};

		for (const [interval, intervalFocusHourMedals] of Object.entries(allMedals)) {
			if (location.pathname.includes(interval)) {
				return intervalFocusHourMedals;
			}
		}

		return dailyFocusHoursMedals;
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
