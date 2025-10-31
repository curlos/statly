import { useMemo } from 'react';
import { useSearchParamsCustom } from '../contexts/useSearchParamsContext';
import { useUserSettingsContext } from '../pages/focus-records/useUserSettingsContext';

interface UseStatsQueryParamsOptions {
	'group-by'?: string;
	'interval-start-date'?: string;
	'interval-end-date'?: string;
	'nested'?: boolean;
}

/**
 * Custom hook to build query params for stats API calls
 * Automatically includes common search params filters and allows passing unique params per component
 *
 * Two-tier date filtering:
 * 1. 'start-date' and 'end-date' from URL (Filter Sidebar) - broad filter
 * 2. 'interval-start-date' and 'interval-end-date' from options (Interval Dropdown) - further narrows results
 */
export const useStatsQueryParams = (options: UseStatsQueryParamsOptions = {}) => {
	const { searchParams } = useSearchParamsCustom();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const {
		focusRecordsPageSettings: {
			taskIdIncludeFocusRecordsFromSubtasks
		}
	} = useUserSettingsContext();

	const queryParams = useMemo(() => {
		return {
			'group-by': options['group-by'] || undefined,
			// Filter Sidebar dates (from URL params) - first tier filter
			'start-date': searchParams.get('start-date') || undefined,
			'end-date': searchParams.get('end-date') || undefined,
			// Interval Dropdown dates (from component options) - second tier filter
			'interval-start-date': options['interval-start-date'] || undefined,
			'interval-end-date': options['interval-end-date'] || undefined,
			'nested': options['nested'] || undefined,
			'search': searchParams.get('search') || undefined,
			'focus-apps': searchParams.get('focus-apps') || undefined,
			'projects-ticktick': searchParams.get('projects') || undefined,
			'projects-todoist': searchParams.get('projects-todoist') || undefined,
			'categories': searchParams.get('categories') || undefined,
			'to-do-list-apps': searchParams.get('to-do-list-apps') || undefined,
			'crosses-midnight': searchParams.get('crosses-midnight') || undefined,
			'task-id': searchParams.get('task-id') || undefined,
			'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
			'timezone': timezone,
		};
	}, [
		options['group-by'],
		options['interval-start-date'],
		options['interval-end-date'],
		options['nested'],
		searchParams,
		timezone
	]);

	return queryParams;
};
