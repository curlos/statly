import DailyHoursFocusGoal from './DailyHoursFocusGoal.js';
import { useState } from 'react';
import Icon from '../../../components/Icon.js';
import SidebarModal from './SidebarModal.js';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi.js';
import LoaderBottomRightBO3Medal from '../../../components/Loaders/LoaderBottomRightBO3Medal.js';

export default function Page() {
	const { isLoading: isLoadingGetFocusRecords } = useGetPomoAndStopwatchFocusRecordsQuery();

	const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);

	return (
		<div className="w-screen h-screen bg-color-gray-700 flex justify-center items-center">
			<Icon
				name="menu"
				customClass={'!text-[30px] text-white absolute right-0 top-0 mt-[15px] mr-[15px] cursor-pointer'}
				onClick={() => setIsSidebarModalOpen(!isSidebarModalOpen)}
			/>
			<DailyHoursFocusGoal />

			{isLoadingGetFocusRecords && <LoaderBottomRightBO3Medal />}

			{isSidebarModalOpen && <SidebarModal {...{ isSidebarModalOpen, setIsSidebarModalOpen }} />}
		</div>
	);
}
