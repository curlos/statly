import { useGetFocusMedalsQuery } from '../../services/resources/focusRecordsApi';
import { useGetTasksMedalsQuery } from '../../services/resources/tasksApi';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';
import { useApplyDefaultDateRangeContext } from '../../contexts/useApplyDefaultDateRangeContext';

interface UseMedalsQueryProps {
	type: string;
	interval: string;
}

export const useMedalsQuery = ({ type, interval }: UseMedalsQueryProps) => {
	const { queryParams } = useSharedQueryParams();
	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();

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