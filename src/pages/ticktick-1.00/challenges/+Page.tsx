import { useState, useRef } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import useMaxHeight from '../../../hooks/useMaxHeight';
import TopButtonList from '../medals/TopButtonList';
import useResizeObserver from '../../../hooks/useResizeObserver';
import ChallengeList from './ChallengeList/ChallengeList';
import ChosenChallenge from './ChosenChallenge';

const Page = () => {
	const [chosenChallenge, setChosenChallenge] = useState({});
	const chosenChallengeRef = useRef(null);
	const [showChosenChallengeModal, setShowChosenChallengeModal] = useState(false);

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

	return (
		<div className="max-w-screen min-h-screen bg-color-gray-700">
			<div ref={topHeaderRef}>
				<Navbar />
				<div className="container text-[28px] font-bold">Challenges</div>
				<div className="container grid grid-cols-12">
					<div className="col-span-8">
						<TopButtonList {...{ BUTTONS_OBJ: BUTTONS_MEDALS_TYPE_OBJ, isForInterval: false }} />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-12 container">
				<div className="col-span-12 sm:col-span-8">
					<ChallengeList
						{...{ maxHeight, chosenChallenge, setChosenChallenge, setShowChosenChallengeModal }}
					/>
				</div>

				<div className="hidden sm:block sm:col-span-4">
					<ChosenChallenge {...{ chosenChallenge, maxHeight, chosenChallengeRef }} />
				</div>
			</div>
		</div>
	);
};

export default Page;
