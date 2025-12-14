import { baseAPI, buildQueryString } from '../api';

/**
 * @description API for fetching stats data from the backend
 */
export const statsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getOverviewStats: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/stats/overview?${queryString}`
                    : '/stats/overview';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['OverviewStats'],
        }),
        getFocusStats: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/stats/focus?${queryString}`
                    : '/stats/focus';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['FocusStats'],
        }),
        getTasksStats: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/stats/tasks?${queryString}`
                    : '/stats/tasks';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['TasksStats'],
        })
    }),
    overrideExisting: false,
});

export const { useGetOverviewStatsQuery, useGetFocusStatsQuery, useGetTasksStatsQuery } = statsApi;
