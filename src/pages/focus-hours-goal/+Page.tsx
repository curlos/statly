import DailyHoursFocusGoal from './DailyHoursFocusGoal.js';
import Navbar from '../../components/Navbar/Navbar.js';
import AppliedFilterItemList from '../focus-records/AppliedFilterItemList.js';
import { useState, useRef } from 'react';
import useResizeObserver from '../../hooks/useResizeObserver.js';

export default function Page() {
	// Top Header
	const [headerHeight, setHeaderHeight] = useState(0);
	const topHeaderRef = useRef(null);
	useResizeObserver(topHeaderRef, setHeaderHeight as (value: number | Record<string, number>) => void, 'height');

	return (
		<div className="min-h-screen bg-color-gray-700">
			<div className="flex flex-col justify-center items-center min-h-screen overflow-auto gray-scrollbar">
				<div ref={topHeaderRef} className="w-full mb-4 sm:mb-0">
					<Navbar page="focus-hours-goal-page" showFilterSidebarIcon={true} />

					<div className="container mt-2 hidden lg:block">
						<AppliedFilterItemList />
					</div>
				</div>

				<div className="flex-1 flex justify-center items-center" style={{ marginBottom: `${headerHeight}px` }}>
					<DailyHoursFocusGoal />
				</div>
			</div>
		</div>
	);
}
