import { getFocusDataForDayInfo, getStreaksInfo } from '../../../utils/focus.utils';
import { getGroupedFocusRecordsByDate } from '../../../utils/helpers.utils';

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async () => {
	const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/ticktick-1.0/focus-records`);
	const focusRecords = await response.json();
	const focusRecordsByDate = getGroupedFocusRecordsByDate(focusRecords);
	const streaksInfo = getStreaksInfo(focusRecords);
	const { goalSeconds, totalFocusDurationForDay, percentageOfFocusedGoalHours } = getFocusDataForDayInfo(
		focusRecordsByDate,
		new Date()
	);

	return {
		focusRecords,
		focusRecordsByDate,
		streaksInfo,
		goalSeconds,
		totalFocusDurationToday: totalFocusDurationForDay,
		percentageOfFocusedGoalHours,
	};
};
