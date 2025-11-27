import { baseAPI, buildQueryString } from '../api';

/**
 * @description API for fetching documents/focus-records data from the backend
 */
export const documentsFocusRecordsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getFocusRecords: builder.query({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/documents/focus-records?${queryString}`
                    : '/documents/focus-records';
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
                    ? `/documents/focus-records/export?${queryString}`
                    : '/documents/focus-records/export';
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
                    ? `/documents/focus-records/medals?${queryString}`
                    : '/documents/focus-records/medals';
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
                    ? `/documents/focus-records/challenges?${queryString}`
                    : '/documents/focus-records/challenges';
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
                    ? `/documents/focus-records/all?${queryString}`
                    : '/documents/focus-records/all';
            },
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['AllFocusRecords'],
        }),
        getFocusRecordsNeedingSentiment: builder.query({
            query: () => '/documents/focus-records/analyze-sentiment/ids',
            transformResponse: (response: { recordIds: string[] }) => {
                return response;
            },
        }),
        analyzeNoteEmotions: builder.mutation({
            query: (recordIds: string[]) => ({
                url: '/documents/focus-records/analyze-note-emotions',
                method: 'POST',
                body: { recordIds },
            }),
            // Don't automatically invalidate tags - we'll do it manually after all chunks complete
        }),
        revalidateCrossesMidnight: builder.mutation({
            query: ({ timezone }: { timezone: string }) => ({
                url: '/documents/focus-records/revalidate-crosses-midnight',
                method: 'POST',
                body: { timezone },
            }),
            invalidatesTags: ['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats'],
        })
    }),
    overrideExisting: false,
});

export const { useGetFocusRecordsQuery, useGetFocusRecordsExportQuery, useGetFocusMedalsQuery, useGetFocusChallengesQuery, useGetAllFocusRecordsQuery, useLazyGetFocusRecordsNeedingSentimentQuery, useAnalyzeNoteEmotionsMutation, useRevalidateCrossesMidnightMutation } = documentsFocusRecordsApi;
