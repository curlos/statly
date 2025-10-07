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
        syncAll: builder.mutation({
            query: () => ({
                url: '/documents/sync/ticktick-all',
                method: 'POST',
            }),
            invalidatesTags: ['FocusRecord', 'DayWithCompletedTasks', 'Project', 'ProjectGroup'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSyncMetadataQuery,
    useSyncAllMutation
} = documentsSyncApi;
