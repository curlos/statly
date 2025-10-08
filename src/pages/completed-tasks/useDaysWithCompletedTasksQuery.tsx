import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useGetDaysWithCompletedTasksQuery } from '../../services/resources/documentsTasksApi';
import { getFormattedShortMonthDay } from '../../utils/date.utils';

export const useDaysWithCompletedTasksQuery = ({ skip = false }: { skip?: boolean } = {}) => {
	const { searchParams } = useSearchParamsContext();
	const {
		completedTasksPageSettings: { maxDaysPerPage, taskIdIncludeCompletedTasksFromSubtasks },
	} = useUserSettingsContext();

	// Query Params
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';
	const projectsTodoistFromUrl = searchParams.get('projects-todoist') || '';
	const toDoListAppsFromUrlRaw = searchParams.get('to-do-list-apps') || '';
	const toDoListAppsFromUrl = toDoListAppsFromUrlRaw
		.split(',')
		.map((app: string) => {
			if (app === 'TickTick') return 'TaskTickTick';
			if (app === 'Todoist') return 'TaskTodoist';
			return app;
		})
		.join(',');
	const taskIdFromUrl = searchParams.get('task-id') || '';
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const currentPageFromUrl = searchParams.get('page') || 1;

	const { data: fetchedDaysWithCompletedTasks, isLoading, isFetching } = useGetDaysWithCompletedTasksQuery({
		page: Number(currentPageFromUrl) - 1,
		'sort-by': sortBy,
		'start-date': startDateFromUrl,
		'end-date': endDateFromUrl,
		'projects-ticktick': projectsFromUrl,
		'projects-todoist': projectsTodoistFromUrl,
		'max-days-per-page': maxDaysPerPage,
		'to-do-list-apps': toDoListAppsFromUrl,
		'task-id': taskIdFromUrl,
		'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
		'search': searchTextFromUrl
	}, { skip });

	const { totalPages, data: daysWithCompletedTasks, ancestorTasksById } = fetchedDaysWithCompletedTasks || {};

	return {
		fetchedDaysWithCompletedTasks,
		totalPages,
		daysWithCompletedTasks,
		ancestorTasksById,
		isLoading,
		isFetching,
		searchTextFromUrl,
		startDateFromUrl,
		endDateFromUrl,
		projectsFromUrl,
		projectsTodoistFromUrl,
		toDoListAppsFromUrl,
		taskIdFromUrl,
		sortBy,
		currentPageFromUrl
	};
};
