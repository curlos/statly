import DailyHoursFocusGoal from './DailyHoursFocusGoal.js';
import Spinner from '../../components/Loaders/Spinner.js';
import Navbar from '../../components/Navbar/Navbar.js';

export default function Page() {
	// const { isLoading: isLoadingGetFocusRecords } = useGetPomoAndStopwatchFocusRecordsQuery();

	return (
		<div className="w-screen h-screen bg-color-gray-700 flex justify-center items-center">
			<div className="absolute top-0 w-full">
				<Navbar page="focus-hours-goal-page" />
			</div>

			<DailyHoursFocusGoal />

			{/* {isLoadingGetFocusRecords && (
				<div className="absolute bottom-4 right-4">
					<Spinner size="xl" />
				</div>
			)} */}
		</div>
	);
}
