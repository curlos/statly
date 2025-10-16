import { useSearchParamsContext } from '../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay } from '../utils/date.utils';

/**
 * Shared hook to build common query parameters used across multiple pages
 * (focus-records, completed-tasks, medals, challenges)
 */
export const useSharedQueryParams = () => {
	const { searchParams } = useSearchParamsContext();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	return {
		timezone,
		'projects-ticktick': searchParams.get('projects') || '',
		'projects-todoist': searchParams.get('projects-todoist') || '',
		'categories': searchParams.get('categories') || '',
		'task-id': searchParams.get('task-id') || '',
		'start-date': searchParams.get('start-date') || 'Nov 2, 2020',
		'end-date': searchParams.get('end-date') || getFormattedShortMonthDay(new Date()),
		'task-id-include-focus-records-from-subtasks': searchParams.get('task-id-include-focus-records-from-subtasks') || 'false',
		'search': searchParams.get('search') || '',
		'focus-apps': searchParams.get('focus-apps') || '',
		'to-do-list-apps': searchParams.get('to-do-list-apps') || '',
	};
};
