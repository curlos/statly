import { useGetFocusRecordsQuery } from '../../services/resources/documentsFocusRecordsApi';
import { useUserSettingsContext } from './useUserSettingsContext';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';

export const useFocusRecordsQuery = ({ skip = false }: { skip?: boolean } = {}) => {
	const { urlValues, queryParams } = useSharedQueryParams();

	const {
		focusRecordsPageSettings: {
			taskIdIncludeFocusRecordsFromSubtasks,
		}
	} = useUserSettingsContext();

	const { data: fetchedFocusRecords, isLoading, isFetching } = useGetFocusRecordsQuery({
		...queryParams,
		page: Number(urlValues.currentPageFromUrl) - 1,
		'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
	}, { skip });

	const { data: focusRecords, total, totalPages, totalDuration, onlyTasksTotalDuration, ancestorTasksById } = fetchedFocusRecords || {};

	return {
		fetchedFocusRecords,
		focusRecords,
		total,
		totalPages,
		totalDuration,
		onlyTasksTotalDuration,
		ancestorTasksById,
		isLoading,
		isFetching,
		...urlValues,
	};
};
