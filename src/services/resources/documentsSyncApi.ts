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
            providesTags: ['SyncMetadata'],
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
            invalidatesTags: (_result, error) => error ? [] : [
                // General tags that need mostly every group
                'OverviewStats', 'SyncMetadata', 'DocumentCounts',
                // Projects
                'Project', 'ProjectGroup',
                // Tasks
                'DayWithCompletedTasks', 'ExportDayWithCompletedTasks', 'AllTasks', 'TasksMedal', 'TasksChallenge', 'TasksStats',
                // Focus Records
                'FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats'
            ],
        }),
        syncTasksFromArchivedProjects: builder.mutation({
            query: (payload) => ({
                url: `/documents/sync/ticktick/tasks-from-archived-projects`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: (_result, error) => error ? [] : [
                // Tasks
                'AllTasks', 'DayWithCompletedTasks', 'TasksMedal', 'TasksChallenge', 'OverviewStats', 'TasksStats', 'DocumentCounts',
                // The main reason this needs to be here is that focus records have a "completedTasks" array and thus one of these archived project's tasks could show up here so we need to be on top of that.
                'FocusRecord'
            ],
        }),
        syncTickTickProjects: builder.mutation({
            query: () => ({
                url: '/documents/sync/ticktick/projects',
                method: 'POST',
            }),
            invalidatesTags: (_result, error) => error ? [] : ['Project', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
        }),
        syncTickTickProjectGroups: builder.mutation({
            query: () => ({
                url: '/documents/sync/ticktick/project-groups',
                method: 'POST',
            }),
            invalidatesTags: (_result, error) => error ? [] : ['ProjectGroup', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
        }),
        syncTickTickTasks: builder.mutation({
            query: () => ({
                url: '/documents/sync/ticktick/tasks',
                method: 'POST',
            }),
            invalidatesTags: (_result, error) => error ? [] : ['DayWithCompletedTasks', 'ExportDayWithCompletedTasks', 'AllTasks', 'TasksMedal', 'TasksChallenge', 'TasksStats', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
        }),
        syncTickTickFocusRecords: builder.mutation({
            query: () => {
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                return {
                    url: '/documents/sync/ticktick/focus-records',
                    method: 'POST',
                    body: { timezone },
                };
            },
            invalidatesTags: (_result, error) => error ? [] : ['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSyncMetadataQuery,
    useSyncAllMutation,
    useSyncTasksFromArchivedProjectsMutation,
    useSyncTickTickProjectsMutation,
    useSyncTickTickProjectGroupsMutation,
    useSyncTickTickTasksMutation,
    useSyncTickTickFocusRecordsMutation
} = documentsSyncApi;
