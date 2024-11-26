import { useRef, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import useMaxHeight from '../../../hooks/useMaxHeight';
import useResizeObserver from '../../../hooks/useResizeObserver';
import { DEFAULT_DAILY_FOCUS_HOURS_MEDALS } from '../../../utils/constants/focus/focusHoursMedals.utils';
import TopButtonList from './TopButtonList';
import MedalList from './MedalList/MedalList';
import ChosenMedal from './ChosenMedal';

const Page = () => {
	const [chosenMedal, setChosenMedal] = useState(DEFAULT_DAILY_FOCUS_HOURS_MEDALS[0]);

	// Top Header
	const [headerHeight, setHeaderHeight] = useState(0);
	const topHeaderRef = useRef(null);
	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');
	const maxHeight = useMaxHeight(headerHeight + 20);

	const BUTTONS_MEDALS_TYPE_OBJ = [
		{
			name: 'Focus',
			urlName: 'focus',
		},
		{
			name: 'Tasks',
			urlName: 'tasks',
		},
	];

	const BUTTONS_INTERVALS_OBJ = [
		{
			name: 'Daily',
			urlName: 'daily',
		},
		{
			name: 'Weekly',
			urlName: 'weekly',
		},
		{
			name: 'Monthly',
			urlName: 'monthly',
		},
		{
			name: 'Yearly',
			urlName: 'yearly',
		},
	];

	return (
		<div>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<div ref={topHeaderRef}>
					<Navbar />
					<div className="container text-[28px] font-bold">Medals</div>
					<div className="container grid grid-cols-12">
						<div className="flex items-center justify-between col-span-8">
							<TopButtonList {...{ BUTTONS_OBJ: BUTTONS_MEDALS_TYPE_OBJ, isForInterval: false }} />
							<div className="mr-3">
								<TopButtonList {...{ BUTTONS_OBJ: BUTTONS_INTERVALS_OBJ }} />
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-12 container">
					<MedalList {...{ maxHeight, chosenMedal, setChosenMedal }} />

					<div className="col-span-4">
						<ChosenMedal {...{ chosenMedal }} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
