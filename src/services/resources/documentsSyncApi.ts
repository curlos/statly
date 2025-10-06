import { baseAPI } from '../api';

/**
 * @description API for fetching documents/tasks data from the backend
 */
export const documentsSyncApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getSyncMetadata: builder.query({
            query: () => '/documents/sync/metadata',
            transformResponse: (response) => {
                return response;
            },
        }),
        syncTasks: builder.mutation({
            query: () => ({
                url: '/documents/sync/ticktick-tasks',
                method: 'POST',
            }),
            invalidatesTags: ['DaysWithCompletedTasks'],
        }),
    }),
    overrideExisting: false,
});

export const { useGetSyncMetadataQuery, useSyncTasksMutation } = documentsSyncApi;
