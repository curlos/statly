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
            query: () => {
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                return {
                    url: '/documents/sync/ticktick/all',
                    method: 'POST',
                    body: { timezone },
                };
            },
            invalidatesTags: ['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'DayWithCompletedTasks', 'AllTasks', 'Project', 'ProjectGroup', 'FocusMedal', 'TasksMedal', 'FocusChallenge', 'TasksChallenge', 'OverviewStats', 'FocusStats', 'TasksStats'],
        }),
        syncTasksFromArchivedProjects: builder.mutation({
            query: (payload) => ({
                url: `/documents/sync/ticktick/tasks-from-archived-projects`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['AllTasks', 'DayWithCompletedTasks', 'TasksMedal', 'TasksChallenge', 'OverviewStats', 'TasksStats'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSyncMetadataQuery,
    useSyncAllMutation,
    useSyncTasksFromArchivedProjectsMutation
} = documentsSyncApi;
