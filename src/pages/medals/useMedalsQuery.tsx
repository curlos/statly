import { useGetFocusMedalsQuery } from '../../services/resources/focusRecordsApi';
import { useGetTasksMedalsQuery } from '../../services/resources/tasksApi';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';
import { useApplyDefaultDateRange } from '../../hooks/useApplyDefaultDateRange';
import useGetDefaultMedalDates from './useGetDefaultMedalDates';

interface UseMedalsQueryProps {
	type: string;
	interval: string;
}

export const useMedalsQuery = ({ type, interval }: UseMedalsQueryProps) => {
	const { queryParams } = useSharedQueryParams();
	const { isLoadingGetUserSettings } = useUserSettingsContext();
	const defaultDateIntervalObj = useGetDefaultMedalDates();

	// Apply default date range and get skip logic
	const { shouldSkipQuery } = useApplyDefaultDateRange({
		isLoadingGetUserSettings,
		defaultDateIntervalObj
	});

	const medalsQueryParams = {
		...queryParams,
		interval: interval || 'daily'
	};

	const { data: focusMedalsData, isLoading: isLoadingFocus, isFetching: isFetchingFocus } = useGetFocusMedalsQuery(
		medalsQueryParams,
		{ skip: type !== 'focus' || shouldSkipQuery }
	);

	const { data: tasksMedalsData, isLoading: isLoadingTasks, isFetching: isFetchingTasks } = useGetTasksMedalsQuery(
		medalsQueryParams,
		{ skip: type !== 'tasks' || shouldSkipQuery }
	);

	const medalsData = type === 'focus' ? focusMedalsData : tasksMedalsData;
	const isLoading = shouldSkipQuery || (type === 'focus' ? isLoadingFocus : isLoadingTasks);
	const isFetching = type === 'focus' ? isFetchingFocus : isFetchingTasks;

	return {
		medalsData,
		isLoading,
		isFetching
	};
};