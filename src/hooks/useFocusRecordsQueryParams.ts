import { useMemo } from 'react';
import { useSearchParamsCustom } from '../contexts/useSearchParamsContext';

interface UseFocusRecordsQueryParamsOptions {
	'group-by': string;
	'start-date': string;
	'end-date': string;
	'nested'?: boolean;
}

/**
 * Custom hook to build query params for focus records API calls
 * Automatically includes common search params filters and allows passing unique params per component
 */
export const useFocusRecordsQueryParams = (options: UseFocusRecordsQueryParamsOptions) => {
	const { searchParams } = useSearchParamsCustom();

	const queryParams = useMemo(() => {
		return {
			'group-by': options['group-by'],
			'start-date': options['start-date'],
			'end-date': options['end-date'],
			'nested': options['nested'] || undefined,
			'search': searchParams.get('search') || undefined,
			'focus-apps': searchParams.get('focus-apps') || undefined,
			'projects-ticktick': searchParams.get('projects-ticktick') || undefined,
			'projects-todoist': searchParams.get('projects-todoist') || undefined,
			'categories': searchParams.get('categories') || undefined,
			'to-do-list-apps': searchParams.get('to-do-list-apps') || undefined,
			'crosses-midnight': searchParams.get('crosses-midnight') || undefined,
		};
	}, [
		options['group-by'],
		options['start-date'],
		options['end-date'],
		options['nested'],
		searchParams
	]);

	return queryParams;
};
