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
        })
    }),
    overrideExisting: false,
});

export const { useGetFocusRecordsQuery, useGetFocusMedalsQuery } = documentsFocusRecordsApi;
