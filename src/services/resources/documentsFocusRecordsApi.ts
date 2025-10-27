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
        })
    }),
    overrideExisting: false,
});

export const { useGetFocusRecordsQuery, useGetFocusMedalsQuery, useGetFocusChallengesQuery } = documentsFocusRecordsApi;
