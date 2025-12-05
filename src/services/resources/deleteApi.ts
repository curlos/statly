import { baseAPI } from '../api';
import { invalidateOnSuccess } from '../utils/rtkHelpers';

/**
 * @description API for deleting user documents
 */
export const deleteApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		deleteFocusRecord: builder.mutation({
			query: (id: string) => ({
				url: `/delete/focus-record/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: invalidateOnSuccess(['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats', 'TodayFocus', 'StreakHistory', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'] as const),
		}),
		deleteFocusRecords: builder.mutation({
			query: () => ({
				url: `/delete/focus-records`,
				method: 'DELETE',
			}),
			invalidatesTags: invalidateOnSuccess(['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats', 'TodayFocus', 'StreakHistory', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'] as const),
		}),
		deleteTasks: builder.mutation({
			query: () => ({
				url: `/delete/tasks`,
				method: 'DELETE',
			}),
			invalidatesTags: invalidateOnSuccess(['DayWithCompletedTasks', 'ExportDayWithCompletedTasks', 'AllTasks', 'TasksMedal', 'TasksChallenge', 'TasksStats', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'] as const),
		}),
		deleteProjects: builder.mutation({
			query: () => ({
				url: `/delete/projects`,
				method: 'DELETE',
			}),
			invalidatesTags: invalidateOnSuccess(['Project', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'] as const),
		}),
		deleteProjectGroups: builder.mutation({
			query: () => ({
				url: `/delete/project-groups`,
				method: 'DELETE',
			}),
			invalidatesTags: invalidateOnSuccess(['ProjectGroup', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'] as const),
		}),
		deleteAllDocuments: builder.mutation({
			query: () => ({
				url: `/delete/all`,
				method: 'DELETE',
			}),
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
	}),
	overrideExisting: false,
});

export const {
	useDeleteFocusRecordMutation,
	useDeleteFocusRecordsMutation,
	useDeleteTasksMutation,
	useDeleteProjectsMutation,
	useDeleteProjectGroupsMutation,
	useDeleteAllDocumentsMutation
} = deleteApi;
