import { useRef, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import useMaxHeight from '../../../hooks/useMaxHeight';
import useResizeObserver from '../../../hooks/useResizeObserver';
import { DEFAULT_DAILY_FOCUS_HOURS_MEDALS } from '../../../utils/constants/focus/focusHoursMedals.utils';
import TopButtonList from './TopButtonList';
import MedalList from './MedalList/MedalList';

const Page = () => {
	const [chosenMedal, setChosenMedal] = useState(DEFAULT_DAILY_FOCUS_HOURS_MEDALS[0]);

	// Top Header
	const [headerHeight, setHeaderHeight] = useState(0);
	const topHeaderRef = useRef(null);
	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');
	const maxHeight = useMaxHeight(headerHeight + 20);

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
						<ChosenMedal {...{ chosenMedal }} />
					</div>
				</div>
			</div>
		</div>
	);
};

const ChosenMedal = ({ chosenMedal }) => {
	const getIntervalText = () => {
		if (location.pathname.includes('daily')) {
			return 'day';
		} else if (location.pathname.includes('weekly')) {
			return 'week';
		} else if (location.pathname.includes('monthly')) {
			return 'month';
		} else if (location.pathname.includes('yearly')) {
			return 'year';
		}
	};

	return (
		<div className="flex justify-center mt-5">
			<div>
				<div className="flex justify-center">
					<img src="/Backfire_Medal_IW.webp" />
				</div>
				<div>
					<div className="text-[26px] font-bold bg-color-gray-200 px-2">{chosenMedal.name}</div>
					<div className="text-[18px]">
						<span className="font-bold">Times Earned: </span>
						{chosenMedal.timesEarned.toLocaleString()}
					</div>
					<div className="text-[18px]">
						<span className="font-bold">Description: </span>
						{chosenMedal.name} in a {getIntervalText()}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
