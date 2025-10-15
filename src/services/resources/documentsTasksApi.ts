import { baseAPI, buildQueryString } from '../api';

/**
 * @description API for fetching documents/tasks data from the backend
 */
export const documentsTasksApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getDaysWithCompletedTasks: builder.query({
			query: (queryParams) => {
				const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const queryString = buildQueryString({ ...queryParams, timezone });
				return queryString
					? `/documents/tasks/days-with-completed-tasks?${queryString}`
					: '/documents/tasks/days-with-completed-tasks';
			},
			transformResponse: (response) => {
				return response;
			},
			providesTags: ['DayWithCompletedTasks'],
		}),
		getTasksMedals: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/documents/tasks/medals?${queryString}`
					: '/documents/tasks/medals';
			},
			transformResponse: (response) => {
				return response;
			},
			providesTags: ['TasksMedal'],
		})
	}),
	overrideExisting: false,
});

export const { useGetDaysWithCompletedTasksQuery, useGetTasksMedalsQuery } = documentsTasksApi;
