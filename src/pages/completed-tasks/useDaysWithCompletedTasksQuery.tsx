import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useGetDaysWithCompletedTasksQuery } from '../../services/resources/tasksApi';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';
import { useApplyDefaultDateRangeContext } from '../../contexts/useApplyDefaultDateRangeContext';

export const useDaysWithCompletedTasksQuery = ({ skip = false }: { skip?: boolean } = {}) => {
	const { urlValues, queryParams } = useSharedQueryParams();
	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();

	const {
		completedTasksPageSettings: { maxDaysPerPage, taskIdIncludeCompletedTasksFromSubtasks },
		isLoadingGetUserSettings
	} = useUserSettingsContext();

	const { data: fetchedDaysWithCompletedTasks, isLoading, isFetching } = useGetDaysWithCompletedTasksQuery({
		...queryParams,
		page: Number(urlValues.currentPageFromUrl) - 1,
		'max-days-per-page': maxDaysPerPage,
		'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
	}, { skip: skip || isLoadingGetUserSettings || shouldSkipQuery });

	const { totalPages, data: daysWithCompletedTasks, ancestorTasksById } = fetchedDaysWithCompletedTasks || {};

	return {
		fetchedDaysWithCompletedTasks,
		totalPages,
		daysWithCompletedTasks,
		ancestorTasksById,
		isLoading: isLoading || isLoadingGetUserSettings,
		isFetching: isFetching || isLoadingGetUserSettings,
		...urlValues
	};
};
