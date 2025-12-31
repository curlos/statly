import { useSearchParamsContext } from '../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay } from '../utils/date.utils';
import { usePageContext } from 'vike-react/usePageContext';

/**
 * Shared hook to build common query parameters used across multiple pages
 * (focus-records, completed-tasks, medals, challenges)
 */
export const useSharedQueryParams = () => {
	const { searchParams } = useSearchParamsContext();
	const pageContext = usePageContext();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	// Read date params from URL directly to avoid async state sync issues during navigation
	const urlSearchParams = pageContext.urlParsed.search || {};
	const startDateFromUrl = urlSearchParams['start-date'] || 'Jan 1, 1900';
	const endDateFromUrl = urlSearchParams['end-date'] || getFormattedShortMonthDay(new Date());

	// Extract other values from searchParams (no timing issues with these)
	const searchTextFromUrl = searchParams.get('search') || '';
	const intervalStartDateFromUrl = searchParams.get('interval-start-date') || '';
	const intervalEndDateFromUrl = searchParams.get('interval-end-date') || '';
	const projectsFromUrl = searchParams.get('projects') || '';
	const projectsTodoistFromUrl = searchParams.get('projects-todoist') || '';
	const categoriesFromUrl = searchParams.get('categories') || '';
	const toDoListAppsFromUrl = searchParams.get('to-do-list-apps') || '';
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';
	const emotionsFromUrl = searchParams.get('emotions') || '';
	const taskIdFromUrl = searchParams.get('task-id') || '';
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const currentPageFromUrl = searchParams.get('page') || 1;
	const generalFromUrl = searchParams.get('general') || '';
	const yearAgnostic = searchParams.get('year-agnostic') === 'true';

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
			emotionsFromUrl,
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
			'interval-start-date': intervalStartDateFromUrl,
			'interval-end-date': intervalEndDateFromUrl,
			'search': searchTextFromUrl,
			'focus-apps': focusAppsFromUrl,
			'to-do-list-apps': toDoListAppsFromUrl,
			'emotions': emotionsFromUrl,
			'sort-by': sortBy,
			'general': generalFromUrl,
			'year-agnostic': yearAgnostic
		}
	};
};
