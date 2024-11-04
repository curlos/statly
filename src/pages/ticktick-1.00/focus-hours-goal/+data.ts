import { getFocusDataForDayInfo } from '../../../utils/focus.utils';

export type Data = Awaited<ReturnType<typeof data>>;

export const data = async () => {
	const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/ticktick-1.0/focus-records`);
	const focusRecords = await response.json();

	const { streaksInfo, goalSeconds, totalFocusDurationToday, percentageOfFocusedGoalHours } =
		getFocusDataForDayInfo(focusRecords);

	return {
		focusRecords,
		streaksInfo,
		goalSeconds,
		totalFocusDurationToday,
		percentageOfFocusedGoalHours,
	};
};
