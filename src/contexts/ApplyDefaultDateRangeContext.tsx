import { createContext, useEffect, useRef, ReactNode } from 'react';
import { useSearchParamsContext } from './useSearchParamsContext';
import { useUserSettingsContext } from '../pages/focus-records/useUserSettingsContext';
import useGetDefaultDateRangeIntervalDates from '../hooks/useGetDefaultDateRangeIntervalDates';
import { usePageContext } from 'vike-react/usePageContext';

interface ApplyDefaultDateRangeContextType {
	shouldSkipQuery: boolean;
}

export const ApplyDefaultDateRangeContext = createContext<ApplyDefaultDateRangeContextType | undefined>(undefined);

// Helper to extract base path (first segment)
const getBasePath = (pathname: string) => {
	const parts = pathname.split('/').filter(Boolean);
	return parts[0] ? `/${parts[0]}` : '/';
};

// Routes that should have defaults applied
const ROUTES_WITH_DEFAULTS = new Set([
	'/stats',
	'/focus-hours-goal',
	'/focus-records',
	'/completed-tasks',
	'/medals',
	'/challenges'
]);

export const ApplyDefaultDateRangeProvider = ({ children }: { children: ReactNode }) => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const { isLoadingGetUserSettings } = useUserSettingsContext();
	const defaultDateIntervalObj = useGetDefaultDateRangeIntervalDates();
	const { startDate, endDate, dateInterval } = defaultDateIntervalObj;
	const pageContext = usePageContext();

	// This first ref is needed so that we only make the "updateQueryParams" with the default date interval ONCE. After that one time, it won't do it again.
	const sentUpdateQueryParamsForDefaultsRef = useRef(false);

	// This second ref is needed because "updateQueryParams" really updates the "searchParams" state variable and updating state is asynchronous and thus we have to wait for the change. There is a gap between "sentUpdateQueryParamsForDefaultsRef.current" being true and this one being true which is why we need this second ref until the query params and state have truly been updated.
	const hasSuccessfullyQueriedRef = useRef(false);
	const previousPathnameRef = useRef(pageContext.urlPathname);

	// If we already have date query params, then that should override default date ranges.
	const hasDateQueryParams = searchParams.has('start-date') || searchParams.has('end-date');

	// Reset refs SYNCHRONOUSLY when BASE path changes (before render completes)
	// This ensures shouldSkipQuery uses correct ref values on route change
	const currentBasePath = getBasePath(pageContext.urlPathname);
	const previousBasePath = getBasePath(previousPathnameRef.current);

	if (currentBasePath !== previousBasePath) {
		sentUpdateQueryParamsForDefaultsRef.current = false;
		hasSuccessfullyQueriedRef.current = false;
		previousPathnameRef.current = pageContext.urlPathname;
	}

	useEffect(() => {
		// If we've already loaded the user settings and sent the updateQueryParams call with the default date interval, then we need to keep waiting here until either the date query params in the URL show up. If the default date interval is "All" though, then there'd be no query params in the URL and thus we are finished so we can mark it as successfully queried.
		if (!isLoadingGetUserSettings && sentUpdateQueryParamsForDefaultsRef.current && (hasDateQueryParams || dateInterval === 'All')) {
			hasSuccessfullyQueriedRef.current = true;
		}
	}, [hasDateQueryParams, isLoadingGetUserSettings, dateInterval]);

	// Apply default date ranges only on allowed routes
	useEffect(() => {
		const currentBasePath = getBasePath(pageContext.urlPathname);
		const isAllowedRoute = ROUTES_WITH_DEFAULTS.has(currentBasePath);

		// Only update the query params if there's no existing date query params, we haven't set out "updateQueryParams" yet, the dateInterval is available in the user settings (isLoadingGetUserSettings === false), we have a default start and end date, and the default date interval isn't all (if it's all, there's no need for query params to clog up the URL).
		if (
			isAllowedRoute &&
			!hasDateQueryParams &&
			!sentUpdateQueryParamsForDefaultsRef.current &&
			!isLoadingGetUserSettings &&
			startDate &&
			endDate &&
			dateInterval !== 'All'
		) {
			sentUpdateQueryParamsForDefaultsRef.current = true;
			updateQueryParams({
				'start-date': startDate,
				'end-date': endDate,
				'date-interval': dateInterval || ''
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasDateQueryParams, isLoadingGetUserSettings, startDate, endDate, dateInterval, pageContext.urlPathname]);

	// Skip query if:
	// 1. Still loading settings, OR
	// 2. No params AND defaults available AND haven't successfully queried yet (initial load - waiting for defaults to be applied and URL to update)
	// After first successful query, allow querying without params (user clearing filters)
	const shouldSkipQuery =
		isLoadingGetUserSettings ||
		(!hasDateQueryParams && !!startDate && !!endDate && !hasSuccessfullyQueriedRef.current && dateInterval !== 'All');

	return (
		<ApplyDefaultDateRangeContext.Provider value={{ shouldSkipQuery }}>
			{children}
		</ApplyDefaultDateRangeContext.Provider>
	);
};
