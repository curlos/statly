import DailyHoursFocusGoal from './DailyHoursFocusGoal.js';
import Navbar from '../../components/Navbar/Navbar.js';

export default function Page() {
	return (
		<div className="w-screen h-screen bg-color-gray-700 flex justify-center items-center">
			<div className="absolute top-0 w-full">
				<Navbar page="focus-hours-goal-page" showFilterSidebarIcon={true} />
			</div>

			<DailyHoursFocusGoal />
		</div>
	);
}
