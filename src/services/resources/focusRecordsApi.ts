import { baseAPI, buildQueryString } from '../api';
import { invalidateOnSuccess } from '../utils/rtkHelpers';
import type {
	FocusRecordsResponse,
	FocusMedalsResponse,
	FocusChallengesResponse,
	AllFocusRecordsResponse,
	FocusRecordsNeedingSentimentResponse
} from '../../types/api';

/**
 * @description API for fetching focus records data from the backend
 */
export const focusRecordsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getFocusRecords: builder.query<FocusRecordsResponse, Record<string, unknown>>({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/focus-records?${queryString}`
                    : '/focus-records';
            },
            transformResponse: (response: FocusRecordsResponse) => {
                return response;
            },
            providesTags: ['FocusRecord'],
        }),
        getFocusRecordsExport: builder.query<unknown, Record<string, unknown>>({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/focus-records/export?${queryString}`
                    : '/focus-records/export';
            },
            transformResponse: (response: unknown) => {
                return response;
            },
            providesTags: ['ExportFocusRecord'],
        }),
        getFocusMedals: builder.query<FocusMedalsResponse, Record<string, unknown>>({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/focus-records/medals?${queryString}`
                    : '/focus-records/medals';
            },
            transformResponse: (response: FocusMedalsResponse) => {
                return response;
            },
            providesTags: ['FocusMedal'],
        }),
        getFocusChallenges: builder.query<FocusChallengesResponse, Record<string, unknown>>({
            query: (queryParams) => {
                const queryString = buildQueryString(queryParams);
                return queryString
                    ? `/focus-records/challenges?${queryString}`
                    : '/focus-records/challenges';
            },
            transformResponse: (response: FocusChallengesResponse) => {
                return response;
            },
            providesTags: ['FocusChallenge'],
        }),
        getAllFocusRecords: builder.query<AllFocusRecordsResponse, { page?: number; limit?: number } | void>({
            query: (queryParams?: { page?: number; limit?: number }) => {
                const queryString = buildQueryString(queryParams || {});
                return queryString
                    ? `/focus-records/all?${queryString}`
                    : '/focus-records/all';
            },
            transformResponse: (response: AllFocusRecordsResponse) => {
                return response;
            },
            providesTags: ['AllFocusRecords'],
        }),
        getFocusRecordsNeedingSentiment: builder.query<FocusRecordsNeedingSentimentResponse, void>({
            query: () => '/focus-records/analyze-sentiment/ids',
            transformResponse: (response: FocusRecordsNeedingSentimentResponse) => {
                return response;
            },
        }),
        analyzeNoteEmotions: builder.mutation<unknown, string[]>({
            query: (recordIds: string[]) => ({
                url: '/focus-records/analyze-note-emotions',
                method: 'POST',
                body: { recordIds },
            }),
            // Don't automatically invalidate tags - we'll do it manually after all chunks complete
        }),
        revalidateCrossesMidnight: builder.mutation<unknown, { timezone: string }>({
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
