import { baseAPI, buildQueryString } from '../api';
import type { OverviewStatsResponse, TaskStatsResponse, FocusStatsResponse } from '../../types/api';

/**
 * @description API for fetching stats data from the backend
 */
export const statsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getOverviewStats: builder.query<OverviewStatsResponse, Record<string, unknown>>({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/stats/overview?${queryString}`
                    : '/stats/overview';
            },
            transformResponse: (response: OverviewStatsResponse) => {
                return response;
            },
            providesTags: ['OverviewStats'],
        }),
        getFocusStats: builder.query<FocusStatsResponse, Record<string, unknown>>({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/stats/focus?${queryString}`
                    : '/stats/focus';
            },
            transformResponse: (response: FocusStatsResponse) => {
                return response;
            },
            providesTags: ['FocusStats'],
        }),
        getTasksStats: builder.query<TaskStatsResponse, Record<string, unknown>>({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/stats/tasks?${queryString}`
                    : '/stats/tasks';
            },
            transformResponse: (response: TaskStatsResponse) => {
                return response;
            },
            providesTags: ['TasksStats'],
        })
    }),
    overrideExisting: false,
});

export const { useGetOverviewStatsQuery, useGetFocusStatsQuery, useGetTasksStatsQuery } = statsApi;
