import { baseAPI, buildQueryString } from '../api';
import type {
	DaysWithCompletedTasksResponse,
	TasksMedalsResponse,
	TasksChallengesResponse,
	AllTasksResponse
} from '../../types/api';

/**
 * @description API for fetching tasks data from the backend
 */
export const tasksApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getDaysWithCompletedTasks: builder.query<DaysWithCompletedTasksResponse, Record<string, unknown>>({
			query: (queryParams) => {
				const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const queryString = buildQueryString({ ...queryParams, timezone });
				return queryString
					? `/tasks/days-with-completed-tasks?${queryString}`
					: '/tasks/days-with-completed-tasks';
			},
			transformResponse: (response: DaysWithCompletedTasksResponse) => {
				return response;
			},
			providesTags: ['DayWithCompletedTasks'],
		}),
		getTasksMedals: builder.query<TasksMedalsResponse, Record<string, unknown>>({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/tasks/medals?${queryString}`
					: '/tasks/medals';
			},
			transformResponse: (response: TasksMedalsResponse) => {
				return response;
			},
			providesTags: ['TasksMedal'],
		}),
		getTasksChallenges: builder.query<TasksChallengesResponse, Record<string, unknown>>({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/tasks/challenges?${queryString}`
					: '/tasks/challenges';
			},
			transformResponse: (response: TasksChallengesResponse) => {
				return response;
			},
			providesTags: ['TasksChallenge'],
		}),
		getDaysWithCompletedTasksExport: builder.query<unknown, Record<string, unknown>>({
			query: (queryParams) => {
				const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				const queryString = buildQueryString({ ...queryParams, timezone });
				return queryString
					? `/tasks/days-with-completed-tasks/export?${queryString}`
					: '/tasks/days-with-completed-tasks/export';
			},
			transformResponse: (response: unknown) => {
				return response;
			},
			providesTags: ['ExportDayWithCompletedTasks'],
		}),
		getAllTasks: builder.query<AllTasksResponse, { page?: number; limit?: number } | void>({
			query: (queryParams?: { page?: number; limit?: number }) => {
				const queryString = buildQueryString(queryParams || {});
				return queryString
					? `/tasks/all?${queryString}`
					: '/tasks/all';
			},
			transformResponse: (response: AllTasksResponse) => {
				return response;
			},
			providesTags: ['AllTasks'],
		})
	}),
	overrideExisting: false,
});

export const { useGetDaysWithCompletedTasksQuery, useGetTasksMedalsQuery, useGetTasksChallengesQuery, useGetAllTasksQuery } = tasksApi;
