import { baseAPI } from '../api';
import { invalidateOnSuccess } from '../utils/rtkHelpers';

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
            invalidatesTags: invalidateOnSuccess([
                // General tags that need mostly every group
                'OverviewStats', 'SyncMetadata', 'DocumentCounts',
                // Projects
                'Project', 'ProjectGroup',
                // Tasks
                'DayWithCompletedTasks', 'ExportDayWithCompletedTasks', 'AllTasks', 'TasksMedal', 'TasksChallenge', 'TasksStats',
                // Focus Records
                'FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats', 'TodayFocus', 'StreakHistory'
            ] as const),
        }),
        syncTasksFromArchivedProjects: builder.mutation({
            query: (payload) => ({
                url: `/documents/sync/ticktick/tasks-from-archived-projects`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: invalidateOnSuccess([
                // Tasks
                'AllTasks', 'DayWithCompletedTasks', 'TasksMedal', 'TasksChallenge', 'OverviewStats', 'TasksStats', 'DocumentCounts',
                // The main reason this needs to be here is that focus records have a "completedTasks" array and thus one of these archived project's tasks could show up here so we need to be on top of that.
                'FocusRecord'
            ] as const),
        }),
        syncTickTickProjects: builder.mutation({
            query: () => ({
                url: '/documents/sync/ticktick/projects',
                method: 'POST',
            }),
            invalidatesTags: invalidateOnSuccess(['Project', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'] as const),
        }),
        syncTickTickProjectGroups: builder.mutation({
            query: () => ({
                url: '/documents/sync/ticktick/project-groups',
                method: 'POST',
            }),
            invalidatesTags: invalidateOnSuccess(['ProjectGroup', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'] as const),
        }),
        syncTickTickTasks: builder.mutation({
            query: () => ({
                url: '/documents/sync/ticktick/tasks',
                method: 'POST',
            }),
            invalidatesTags: invalidateOnSuccess(['DayWithCompletedTasks', 'ExportDayWithCompletedTasks', 'AllTasks', 'TasksMedal', 'TasksChallenge', 'TasksStats', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'] as const),
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
            invalidatesTags: invalidateOnSuccess(['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats', 'TodayFocus', 'StreakHistory', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'] as const),
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
