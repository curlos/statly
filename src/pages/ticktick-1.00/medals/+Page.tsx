import { useEffect, useRef, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { getFocusDurationFromArray } from '../../../utils/focus-apps/focusRecords.utils';
import { useThemeContext } from '../../../contexts/useThemeContext';
import classNames from 'classnames';
import useMaxHeight from '../../../hooks/useMaxHeight';
import useResizeObserver from '../../../hooks/useResizeObserver';
import {
	DEFAULT_DAILY_FOCUS_HOURS_MEDALS,
	DEFAULT_MONTHLY_FOCUS_HOURS_MEDALS,
	DEFAULT_WEEKLY_FOCUS_HOURS_MEDALS,
	DEFAULT_YEARLY_FOCUS_HOURS_MEDALS,
} from '../../../utils/constants/focus/focusHoursMedals.utils';
import { navigate } from 'vike/client/router';

const Page = () => {
	const [chosenMedal, setChosenMedal] = useState(DEFAULT_DAILY_FOCUS_HOURS_MEDALS[0]);

	const [headerHeight, setHeaderHeight] = useState(0);
	const topHeaderRef = useRef(null);

	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');

	const maxHeight = useMaxHeight(headerHeight);

	const BUTTONS_INTERVALS_OBJ = [
		{
			name: 'Daily',
			url: '/ticktick-1.00/medals/focus/daily',
		},
		{
			name: 'Weekly',
			url: '/ticktick-1.00/medals/focus/weekly',
		},
		{
			name: 'Monthly',
			url: '/ticktick-1.00/medals/focus/monthly',
		},
		{
			name: 'Yearly',
			url: '/ticktick-1.00/medals/focus/yearly',
		},
	];

	return (
		<div>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<div ref={topHeaderRef}>
					<Navbar />
					<div className="container text-[28px] font-bold">Medals</div>
					<TopButtonList {...{ BUTTONS_INTERVALS_OBJ }} />
				</div>

				<div className="grid grid-cols-12 container">
					<MedalList {...{ maxHeight, chosenMedal, setChosenMedal, BUTTONS_INTERVALS_OBJ }} />

					<div className="col-span-4">
						<div className="flex justify-center mt-5">
							<div>
								<div className="flex justify-center">
									<img src="/Backfire_Medal_IW.webp" />
								</div>
								<div>
									<div className="text-[26px] font-bold bg-color-gray-200 px-2">
										{chosenMedal.name}
									</div>
									<div className="text-[18px]">
										<span className="font-bold">Times Earned: </span>
										{chosenMedal.timesEarned.toLocaleString()}
									</div>
									<div className="text-[18px]">
										<span className="font-bold">Description: </span>
										{chosenMedal.name} in a day
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const MedalList = ({ maxHeight, chosenMedal, setChosenMedal, BUTTONS_INTERVALS_OBJ }) => {
	const { focusRecordsGroupedByDate } = useStatsContext();

	const [focusDurationByDate, setFocusDurationByDate] = useState({});
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

		console.log(focusDurationByWeek);

		// Calculate the number of times a medal for each interval was earned.
		getTimesEarnedForInterval(newFocusDurationByDate, newDailyFocusHoursMedals);
		getTimesEarnedForInterval(focusDurationByWeek, newWeeklyFocusHoursMedals);
		getTimesEarnedForInterval(focusDurationByMonth, newMonthlyFocusHoursMedals);
		getTimesEarnedForInterval(focusDurationByYear, newYearlyFocusHoursMedals);

		console.log(newWeeklyFocusHoursMedals);

		setFocusDurationByDate(newFocusDurationByDate);

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

	return (
		<div className="col-span-8 grid grid-cols-4 gap-2 overflow-auto gray-scrollbar" style={{ maxHeight }}>
			{getMedalsToUse().map((medal) => {
				return <MedalCard key={medal.name} {...{ medal: medal, chosenMedal, setChosenMedal }} />;
			})}
		</div>
	);
};

const MedalCard = ({ medal, chosenMedal, setChosenMedal }) => {
	const { name = 'Focus 5 Hours', imageSrc = '/Backfire_Medal_IW.webp', timesEarned = 'x361' } = medal;

	const { chosenColorObj } = useThemeContext();

	return (
		<div
			className={classNames(
				'bg-color-gray-600 border cursor-pointer',
				chosenColorObj.hover.borderColor,
				chosenMedal.name === name ? chosenColorObj.borderColor : 'border-[transparent]'
			)}
			onClick={() => setChosenMedal(medal)}
		>
			<div className="bg-color-gray-150 border-l-[5px] border-white pl-1 font-semibold">{name}</div>
			<img src={imageSrc} className="w-[200px]" />
			<div className="flex justify-end px-2 text-[18px] font-bold">x{timesEarned.toLocaleString()}</div>
		</div>
	);
};

const TopButtonList = ({ BUTTONS_INTERVALS_OBJ }) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[16px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-semibold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-300`;

	return (
		<div className="container flex items-center gap-2 my-2">
			{BUTTONS_INTERVALS_OBJ.map((buttonObj) => {
				const { name, url } = buttonObj;

				return <TopButton key={name} {...{ name, url, selectedButtonStyle, unselectedButtonStyle }} />;
			})}
		</div>
	);
};

const TopButton = ({ name, url, selectedButtonStyle, unselectedButtonStyle }) => {
	return (
		<div
			className={location.pathname.includes(name.toLowerCase()) ? selectedButtonStyle : unselectedButtonStyle}
			onClick={() => navigate(url)}
		>
			{name}
		</div>
	);
};

/**
 * @description Adds up the focus duration over different grouped periods using the object with the focus duration for all the singular days "focusData".
 * @param {Object} focusData
 * @param {String} period
 * @returns {Object}
 */
function sumFocusByPeriod(focusData, period) {
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

	Object.keys(focusData).forEach((dateStr) => {
		const date = new Date(dateStr);
		const startOfPeriod = getStartOfPeriod(new Date(date), period);
		const endOfPeriod = getEndOfPeriod(new Date(startOfPeriod), period);

		// A period key can be created because each date in the array of focus data will have their own period key that is shared by other dates that are within the same period.
		const periodKey = `${startOfPeriod.toLocaleDateString('en-US')} to ${endOfPeriod.toLocaleDateString('en-US')}`;

		if (!results[periodKey]) {
			results[periodKey] = 0;
		}

		// Add the focus duration to the period
		results[periodKey] += focusData[dateStr];
	});

	return results;
}

export default Page;
