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
		}),
		getTasksChallenges: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/documents/tasks/challenges?${queryString}`
					: '/documents/tasks/challenges';
			},
			transformResponse: (response) => {
				return response;
			},
			providesTags: ['TasksChallenge'],
		}),
		getDaysWithCompletedTasksExport: builder.query({
			query: (queryParams) => {
				const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				const queryString = buildQueryString({ ...queryParams, timezone });
				return queryString
					? `/documents/tasks/days-with-completed-tasks/export?${queryString}`
					: '/documents/tasks/days-with-completed-tasks/export';
			},
			transformResponse: (response) => {
				return response;
			},
			providesTags: ['ExportDayWithCompletedTasks'],
		}),
		getAllTasks: builder.query({
			query: (queryParams?: { page?: number; limit?: number }) => {
				const queryString = buildQueryString(queryParams || {});
				return queryString
					? `/documents/tasks/all?${queryString}`
					: '/documents/tasks/all';
			},
			transformResponse: (response) => {
				return response;
			},
			providesTags: ['AllTasks'],
		})
	}),
	overrideExisting: false,
});

export const { useGetDaysWithCompletedTasksQuery, useGetTasksMedalsQuery, useGetTasksChallengesQuery, useGetAllTasksQuery } = documentsTasksApi;
