import { useGetFocusRecordsQuery } from '../../services/resources/focusRecordsApi';
import { useUserSettingsContext } from './useUserSettingsContext';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';
import { useApplyDefaultDateRangeContext } from '../../contexts/useApplyDefaultDateRangeContext';

export const useFocusRecordsQuery = ({ skip = false }: { skip?: boolean } = {}) => {
	const { urlValues, queryParams } = useSharedQueryParams();
	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();

	const {
		focusRecordsPageSettings: {
			taskIdIncludeFocusRecordsFromSubtasks,
			maxFocusRecordsPerPage,
			showEmotionCount,
			showNoteStats
		},
		isLoadingGetUserSettings
	} = useUserSettingsContext();

	const { data: fetchedFocusRecords, isLoading, isFetching } = useGetFocusRecordsQuery({
		...queryParams,
		page: Number(urlValues.currentPageFromUrl) - 1,
		'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
		'limit': maxFocusRecordsPerPage,
		'show-emotion-count': showEmotionCount,
		'show-note-stats': showNoteStats
	}, { skip: skip || isLoadingGetUserSettings || shouldSkipQuery });

	const { data: focusRecords, total, totalPages, totalDuration, onlyTasksTotalDuration, ancestorTasksById, emotionCounts, noteStats } = fetchedFocusRecords || {};

	return {
		fetchedFocusRecords,
		focusRecords,
		total,
		totalPages,
		totalDuration,
		onlyTasksTotalDuration,
		ancestorTasksById,
		emotionCounts,
		noteStats,
		isLoading,
		isFetching,
		...urlValues,
	};
};
