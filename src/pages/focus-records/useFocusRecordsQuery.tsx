import { useGetFocusRecordsQuery } from '../../services/resources/documentsFocusRecordsApi';
import { useUserSettingsContext } from './useUserSettingsContext';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';

export const useFocusRecordsQuery = ({ skip = false }: { skip?: boolean } = {}) => {
	const { urlValues, queryParams } = useSharedQueryParams();

	const {
		focusRecordsPageSettings: {
			taskIdIncludeFocusRecordsFromSubtasks,
			maxFocusRecordsPerPage
		},
		isLoadingGetUserSettings
	} = useUserSettingsContext();

	const { data: fetchedFocusRecords, isLoading, isFetching } = useGetFocusRecordsQuery({
		...queryParams,
		page: Number(urlValues.currentPageFromUrl) - 1,
		'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
		'limit': maxFocusRecordsPerPage
	}, { skip: skip || isLoadingGetUserSettings });

	const { data: focusRecords, total, totalPages, totalDuration, onlyTasksTotalDuration, ancestorTasksById, emotionCounts } = fetchedFocusRecords || {};

	return {
		fetchedFocusRecords,
		focusRecords,
		total,
		totalPages,
		totalDuration,
		onlyTasksTotalDuration,
		ancestorTasksById,
		emotionCounts,
		isLoading,
		isFetching,
		...urlValues,
	};
};
