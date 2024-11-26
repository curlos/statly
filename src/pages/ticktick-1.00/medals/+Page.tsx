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
	DEFAULT_WEEKLY_FOCUS_HOURS_MEDALS,
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
	// const [dailyFocusHoursMedals, setDailyFocusHoursMedals] = useState(DEFAULT_DAILY_FOCUS_HOURS_MEDALS);
	// const [dailyFocusHoursMedals, setDailyFocusHoursMedals] = useState(DEFAULT_DAILY_FOCUS_HOURS_MEDALS);

	useEffect(() => {
		if (!focusRecordsGroupedByDate) {
			return;
		}

		const newFocusDurationByDate = {};

		const newDailyFocusHoursMedals = JSON.parse(JSON.stringify(DEFAULT_DAILY_FOCUS_HOURS_MEDALS));
		// const newWeeklyFocusHoursMedals = JSON.parse(JSON.stringify(DEFAULT_WEEKLY_FOCUS_HOURS_MEDALS));

		// Get the focus duration for each day.
		Object.entries(focusRecordsGroupedByDate).forEach(([dateKey, focusRecords]) => {
			newFocusDurationByDate[dateKey] = getFocusDurationFromArray(focusRecords);
		});

		// Calculate the number of times a medal for each interval was earned.
		Object.entries(newFocusDurationByDate).forEach(([dateKey, focusDurationForDay]) => {
			newDailyFocusHoursMedals.forEach((dailyFocusHourMedal) => {
				const { requiredDuration } = dailyFocusHourMedal;

				if (focusDurationForDay >= requiredDuration) {
					dailyFocusHourMedal.timesEarned += 1;
				}
			});
		});

		console.log(newDailyFocusHoursMedals);

		setFocusDurationByDate(newFocusDurationByDate);
		setDailyFocusHoursMedals(newDailyFocusHoursMedals);
		setChosenMedal(newDailyFocusHoursMedals[0]);
	}, [focusRecordsGroupedByDate]);

	const getMedalsToUse = () => {
		const allMedals = {
			daily: dailyFocusHoursMedals,
			weekly: weeklyFocusHoursMedals,
			// 'daily': dailyFocusHoursMedals,
			// 'daily': dailyFocusHoursMedals,
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

export default Page;
