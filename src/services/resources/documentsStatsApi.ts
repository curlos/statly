import { baseAPI, buildQueryString } from '../api';

/**
 * @description API for fetching documents/stats data from the backend
 */
export const documentsStatsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getOverviewStats: builder.query({
            query: () => '/documents/stats/overview',
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['OverviewStats'],
        }),
        getFocusStats: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/documents/stats/focus?${queryString}`
                    : '/documents/stats/focus';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['FocusStats'],
        })
    }),
    overrideExisting: false,
});

export const { useGetOverviewStatsQuery, useGetFocusStatsQuery } = documentsStatsApi;
