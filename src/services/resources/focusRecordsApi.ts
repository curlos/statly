import { baseAPI, buildQueryString } from '../api';
import { invalidateOnSuccess } from '../utils/rtkHelpers';

/**
 * @description API for fetching focus records data from the backend
 */
export const focusRecordsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getFocusRecords: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/focus-records?${queryString}`
                    : '/focus-records';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['FocusRecord'],
        }),
        getFocusRecordsExport: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/focus-records/export?${queryString}`
                    : '/focus-records/export';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['ExportFocusRecord'],
        }),
        getFocusMedals: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/focus-records/medals?${queryString}`
                    : '/focus-records/medals';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['FocusMedal'],
        }),
        getFocusChallenges: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/focus-records/challenges?${queryString}`
                    : '/focus-records/challenges';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['FocusChallenge'],
        }),
        getAllFocusRecords: builder.query({
            query: (queryParams?: { page?: number; limit?: number }) => {
                const queryString = buildQueryString(queryParams || {});
                return queryString
                    ? `/focus-records/all?${queryString}`
                    : '/focus-records/all';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['AllFocusRecords'],
        }),
        getFocusRecordsNeedingSentiment: builder.query({
            query: () => '/focus-records/analyze-sentiment/ids',
            transformResponse: (response: { recordIds: string[] }) => {
                return response;
            },
        }),
        analyzeNoteEmotions: builder.mutation({
            query: (recordIds: string[]) => ({
                url: '/focus-records/analyze-note-emotions',
                method: 'POST',
                body: { recordIds },
            }),
            // Don't automatically invalidate tags - we'll do it manually after all chunks complete
        }),
        revalidateCrossesMidnight: builder.mutation({
            query: ({ timezone }: { timezone: string }) => ({
                url: '/focus-records/revalidate-crosses-midnight',
                method: 'POST',
                body: { timezone },
            }),
            invalidatesTags: invalidateOnSuccess(['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats', 'TodayFocus', 'StreakHistory'] as const),
        })
    }),
    overrideExisting: false,
});

export const { useGetFocusRecordsQuery, useGetFocusRecordsExportQuery, useGetFocusMedalsQuery, useGetFocusChallengesQuery, useGetAllFocusRecordsQuery, useLazyGetFocusRecordsNeedingSentimentQuery, useAnalyzeNoteEmotionsMutation, useRevalidateCrossesMidnightMutation } = focusRecordsApi;
