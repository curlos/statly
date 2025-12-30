import { useEffect, useRef } from 'react';
import { useGetFocusMedalsQuery } from '../../services/resources/focusRecordsApi';
import { useGetTasksMedalsQuery } from '../../services/resources/tasksApi';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import useGetDefaultMedalDates from './useGetDefaultMedalDates';

interface UseMedalsQueryProps {
	type: string;
	interval: string;
}

export const useMedalsQuery = ({ type, interval }: UseMedalsQueryProps) => {
	const { queryParams } = useSharedQueryParams();
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const { isLoadingGetUserSettings } = useUserSettingsContext();
	const { startDate, endDate, dateInterval } = useGetDefaultMedalDates();

	// This first ref is needed so that we only make the "updateQueryParams" with the default date interval ONCE. After that one time, it won't do it again.
	const sentUpdateQueryParamsForDefaultsRef = useRef(false);

	// This second ref is needed because "updateQueryParams" really updates the "searchParams" state variable and updating state is asynchronous and thus we have to wait for the change. There is a gap between "sentUpdateQueryParamsForDefaultsRef.current" being true and this one being true which is why we need this second ref until the query params and state have truly been updated.
	const hasSuccessfullyQueriedRef = useRef(false);

	// If we already have date query params, then that should override default date ranges.
	const hasDateQueryParams = searchParams.has('start-date') || searchParams.has('end-date');

	useEffect(() => {
		// If we've already loaded the user settings and sent the updateQueryParams call with the default date interval, then we need to keep waiting here until either the date query params in the URL show up. If the default date interval is "All" though, then there'd be no query params in the URL and thus we are finished so we can mark it as successfully queried.
		if (!isLoadingGetUserSettings && sentUpdateQueryParamsForDefaultsRef.current && (hasDateQueryParams || dateInterval === 'All')) {
			hasSuccessfullyQueriedRef.current = true;
		}
	}, [hasDateQueryParams, isLoadingGetUserSettings, dateInterval]);

	useEffect(() => {
		// Only update the query params if there's no existing date query params, we haven't set out "updateQueryParams" yet, the dateInterval is available in the user settings (isLoadingGetUserSettings === false), we have a default start and end date, and the default date interval isn't all (if it's all, there's no need for query params to clog up the URL).
		if (
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
	}, [hasDateQueryParams, isLoadingGetUserSettings, startDate, endDate, dateInterval, updateQueryParams]);

	// Skip query if:
	// 1. Still loading settings, OR
	// 2. No params AND defaults available AND haven't successfully queried yet (initial load - waiting for defaults to be applied and URL to update)
	// After first successful query, allow querying without params (user clearing filters)
	const shouldSkipQuery =
		isLoadingGetUserSettings ||
		(!hasDateQueryParams && !!startDate && !!endDate && !hasSuccessfullyQueriedRef.current);

	const medalsQueryParams = {
		...queryParams,
		interval: interval || 'daily'
	};

	const { data: focusMedalsData, isLoading: isLoadingFocus, isFetching: isFetchingFocus } = useGetFocusMedalsQuery(
		medalsQueryParams,
		{ skip: type !== 'focus' || shouldSkipQuery }
	);

	const { data: tasksMedalsData, isLoading: isLoadingTasks, isFetching: isFetchingTasks } = useGetTasksMedalsQuery(
		medalsQueryParams,
		{ skip: type !== 'tasks' || shouldSkipQuery }
	);

	const medalsData = type === 'focus' ? focusMedalsData : tasksMedalsData;
	const isLoading = shouldSkipQuery || (type === 'focus' ? isLoadingFocus : isLoadingTasks);
	const isFetching = type === 'focus' ? isFetchingFocus : isFetchingTasks;

	return {
		medalsData,
		isLoading,
		isFetching
	};
};