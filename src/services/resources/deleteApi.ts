import { baseAPI } from '../api';

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
			invalidatesTags: (_result, error) =>
				error ? [] : ['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
		}),
		deleteFocusRecords: builder.mutation({
			query: () => ({
				url: `/delete/focus-records`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, error) =>
				error ? [] : ['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
		}),
		deleteTasks: builder.mutation({
			query: () => ({
				url: `/delete/tasks`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, error) =>
				error ? [] : ['DayWithCompletedTasks', 'ExportDayWithCompletedTasks', 'AllTasks', 'TasksMedal', 'TasksChallenge', 'TasksStats', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
		}),
		deleteProjects: builder.mutation({
			query: () => ({
				url: `/delete/projects`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, error) =>
				error ? [] : ['Project', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
		}),
		deleteProjectGroups: builder.mutation({
			query: () => ({
				url: `/delete/project-groups`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, error) =>
				error ? [] : ['ProjectGroup', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
		}),
		deleteAllDocuments: builder.mutation({
			query: () => ({
				url: `/delete/all`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, error) =>
				error ? [] : [
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
