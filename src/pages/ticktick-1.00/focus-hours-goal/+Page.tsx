import { useData } from 'vike-react/useData';
import type { Data } from './+data.js';
import Icon from '../../../components/Icon.jsx';
import DailyHoursFocusGoal from './DailyHoursFocusGoal.js';

export default function Page() {
	const { focusRecords, streaksInfo, goalSeconds, totalFocusDurationToday, percentageOfFocusedGoalHours } =
		useData<Data>();

	return (
		<div className="w-screen h-screen bg-color-gray-700 flex justify-center items-center">
			<Icon
				name="menu"
				customClass={'!text-[30px] text-white absolute right-0 top-0 mt-[15px] mr-[15px] cursor-pointer'}
			/>
			<div className="w-[350px]">
				<DailyHoursFocusGoal
					{...{
						focusRecords,
						streaksInfo,
						goalSeconds,
						totalFocusDurationToday,
						percentageOfFocusedGoalHours,
					}}
				/>
			</div>

			{/* <SidebarModal /> */}
		</div>
	);
}

const SidebarModal = () => {
	return (
		<div className="overlay absolute bg-black bg-opacity-[70%] w-screen h-screen">
			<div className="text-black w-full flex h-[300px] overflow-hidden">
				<div className="fixed inset-y-0 right-0 w-[400px] bg-color-gray-700 p-4 text-white">
					<div className="font-bold">Settings</div>
				</div>
			</div>
		</div>
	);
};
