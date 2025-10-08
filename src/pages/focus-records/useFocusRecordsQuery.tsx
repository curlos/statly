import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useGetFocusRecordsQuery } from '../../services/resources/documentsFocusRecordsApi';
import { getFormattedShortMonthDay } from '../../utils/date.utils';

export const useFocusRecordsQuery = ({ skip = false }: { skip?: boolean } = {}) => {
	const { searchParams } = useSearchParamsContext();

	// Query Params
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const currentPageFromUrl = searchParams.get('page') || 1;
	const taskIdFromUrl = searchParams.get('task-id');
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';
	const categoriesFromUrl = searchParams.get('categories') || '';
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';

	const { data: fetchedFocusRecords, isLoading, isFetching } = useGetFocusRecordsQuery({
		page: Number(currentPageFromUrl) - 1,
		// 'sort-by': sortBy,
		// 'start-date': startDateFromUrl,
		// 'end-date': endDateFromUrl,
		'projects-ticktick': projectsFromUrl,
		// 'task-id': taskIdFromUrl,
		// 'task-id-include-completed-tasks-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
		// 'search': searchTextFromUrl
	}, { skip });

	const { data: focusRecords, total, totalPages, totalDuration, onlyTasksDuration, ancestorTasksById } = fetchedFocusRecords || {};

	return {
		fetchedFocusRecords,
		focusRecords,
		total,
		totalPages,
		totalDuration,
		onlyTasksDuration,
		ancestorTasksById,
		isLoading,
		isFetching,
		sortBy,
		currentPageFromUrl,
		taskIdFromUrl,
		searchTextFromUrl,
		startDateFromUrl,
		endDateFromUrl,
		projectsFromUrl,
		categoriesFromUrl,
		focusAppsFromUrl,
	};
};
