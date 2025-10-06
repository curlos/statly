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
			providesTags: ['DaysWithCompletedTasks'],
		})
	}),
	overrideExisting: false,
});

export const { useGetDaysWithCompletedTasksQuery } = documentsTasksApi;
