import DailyHoursFocusGoal from './DailyHoursFocusGoal.js';
import { useState } from 'react';
import Icon from '../../../components/Icon.js';
import SidebarModal from '../../../components/SidebarModal/SidebarModal.js';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi.js';
import LoaderBottomRightBO3Medal from '../../../components/Loaders/LoaderBottomRightBO3Medal.js';
import FocusHourGoalSettingsModal from './FocusHourGoalSettingsModal.js';

export default function Page() {
	const { isLoading: isLoadingGetFocusRecords } = useGetPomoAndStopwatchFocusRecordsQuery();

	const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);
	const [isSettingsSidebarModalOpen, setIsSettingsSidebarModalOpen] = useState(false);

	return (
		<div className="w-screen h-screen bg-color-gray-700 flex justify-center items-center">
			<DailyHoursFocusGoal />

			{isLoadingGetFocusRecords && <LoaderBottomRightBO3Medal />}

			<>
				<Icon
					name="menu"
					customClass={'!text-[30px] text-white absolute right-0 top-0 mt-[15px] mr-[15px] cursor-pointer'}
					onClick={() => setIsSidebarModalOpen(!isSidebarModalOpen)}
				/>

				<Icon
					name="settings"
					customClass={
						'!text-[30px] text-color-gray-100 absolute right-0 top-[15px] mt-[35px] mr-[15px] cursor-pointer'
					}
					onClick={() => setIsSettingsSidebarModalOpen(!isSettingsSidebarModalOpen)}
				/>

				{isSidebarModalOpen && <SidebarModal {...{ isSidebarModalOpen, setIsSidebarModalOpen }} />}
				{isSettingsSidebarModalOpen && (
					<FocusHourGoalSettingsModal
						{...{
							isSidebarModalOpen: isSettingsSidebarModalOpen,
							setIsSidebarModalOpen: setIsSettingsSidebarModalOpen,
						}}
					/>
				)}
			</>
		</div>
	);
}
