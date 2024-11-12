import DailyHoursFocusGoal from './DailyHoursFocusGoal.js';
import { useState } from 'react';
import Icon from '../../../components/Icon.js';
import SidebarModal from './SidebarModal.js';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi.js';
import { getStreaksInfo, getFocusDataForDayInfo } from '../../../utils/focus.utils.js';
import LoaderBottomRightBO3Medal from '../../../components/Loaders/LoaderBottomRightBO3Medal.js';

const defaultFocusData = {
	goalSeconds: 5400,
	totalFocusDurationForDay: 0,
	percentageOfFocusedGoalHours: 0,
};

export default function Page() {
	const {
		data: fetchedFocusRecords,
		isLoading: isLoadingGetFocusRecords,
		error: errorGetFocusRecords,
	} = useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords, focusRecordsByDate } = fetchedFocusRecords || {};

	const [isSidebarModalOpen, setIsSidebarModalOpen] = useState(false);

	const streaksInfo = focusRecords && getStreaksInfo(focusRecords);
	const focusDataForTodayInfo = focusRecordsByDate && getFocusDataForDayInfo(focusRecordsByDate, new Date());
	const { goalSeconds, totalFocusDurationForDay, percentageOfFocusedGoalHours } =
		focusDataForTodayInfo || defaultFocusData;

	const isLoading = !focusRecordsByDate || !streaksInfo || !focusDataForTodayInfo;

	return (
		<div className="w-screen h-screen bg-color-gray-700 flex justify-center items-center">
			<Icon
				name="menu"
				customClass={'!text-[30px] text-white absolute right-0 top-0 mt-[15px] mr-[15px] cursor-pointer'}
				onClick={() => setIsSidebarModalOpen(!isSidebarModalOpen)}
			/>
			<div className="w-[350px]">
				<DailyHoursFocusGoal
					{...{
						focusRecords,
						streaksInfo,
						goalSeconds,
						totalFocusDurationToday: totalFocusDurationForDay,
						percentageOfFocusedGoalHours,
					}}
				/>
			</div>

			{isLoading && <LoaderBottomRightBO3Medal />}

			{isSidebarModalOpen && <SidebarModal {...{ isSidebarModalOpen, setIsSidebarModalOpen }} />}
		</div>
	);
}
