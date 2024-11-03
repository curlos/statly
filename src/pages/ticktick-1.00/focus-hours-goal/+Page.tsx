import { useData } from 'vike-react/useData';
import type { Data } from './+data.js';
import Icon from '../../../components/Icon.jsx';
import DailyHoursFocusGoal from './DailyHoursFocusGoal.js';
import { useState } from 'react';
import SidebarModal from './SidebarModal.js';

export default function Page() {
	const { focusRecords, streaksInfo, goalSeconds, totalFocusDurationToday, percentageOfFocusedGoalHours } =
		useData<Data>();

	const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);

	return (
		<div className="w-screen h-screen bg-color-gray-700 flex justify-center items-center">
			{/* <Icon
				name="menu"
				customClass={'!text-[30px] text-white absolute right-0 top-0 mt-[15px] mr-[15px] cursor-pointer'}
				onClick={() => setIsSidebarModalOpen(!isSidebarModalOpen)}
			/> */}
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

			{/* {isSidebarModalOpen && <SidebarModal {...{ isSidebarModalOpen, setIsSidebarModalOpen }} />} */}
		</div>
	);
}
