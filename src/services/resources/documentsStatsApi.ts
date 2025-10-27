import { baseAPI } from '../api';

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
        })
    }),
    overrideExisting: false,
});

export const { useGetOverviewStatsQuery } = documentsStatsApi;
