import { useSearchParamsContext } from '../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay } from '../utils/date.utils';

/**
 * Shared hook to build common query parameters used across multiple pages
 * (focus-records, completed-tasks, medals, challenges)
 */
export const useSharedQueryParams = () => {
	const { searchParams } = useSearchParamsContext();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	// Extract raw values from URL
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Jan 1, 1900';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';
	const projectsTodoistFromUrl = searchParams.get('projects-todoist') || '';
	const categoriesFromUrl = searchParams.get('categories') || '';
	const toDoListAppsFromUrl = searchParams.get('to-do-list-apps') || '';
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';
	const taskIdFromUrl = searchParams.get('task-id') || '';
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const currentPageFromUrl = searchParams.get('page') || 1;
	const crossesMidnight = searchParams.get('crosses-midnight') === 'true';

	return {
		// Raw values for display/state
		urlValues: {
			searchTextFromUrl,
			startDateFromUrl,
			endDateFromUrl,
			projectsFromUrl,
			projectsTodoistFromUrl,
			categoriesFromUrl,
			toDoListAppsFromUrl,
			focusAppsFromUrl,
			taskIdFromUrl,
			sortBy,
			currentPageFromUrl,
			timezone,
		},

		// Query params object for API calls
		queryParams: {
			timezone,
			'projects-ticktick': projectsFromUrl,
			'projects-todoist': projectsTodoistFromUrl,
			'categories': categoriesFromUrl,
			'task-id': taskIdFromUrl,
			'start-date': startDateFromUrl,
			'end-date': endDateFromUrl,
			'search': searchTextFromUrl,
			'focus-apps': focusAppsFromUrl,
			'to-do-list-apps': toDoListAppsFromUrl,
			'sort-by': sortBy,
			'crosses-midnight': crossesMidnight
		}
	};
};
