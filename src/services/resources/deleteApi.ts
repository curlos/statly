import { baseAPI } from '../api';

/**
 * @description API for deleting user documents
 */
export const deleteApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		deleteFocusRecords: builder.mutation({
			query: () => ({
				url: `/delete/focus-records`,
				method: 'DELETE',
			}),
			invalidatesTags: ['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
		}),
		deleteTasks: builder.mutation({
			query: () => ({
				url: `/delete/tasks`,
				method: 'DELETE',
			}),
			invalidatesTags: ['DayWithCompletedTasks', 'ExportDayWithCompletedTasks', 'AllTasks', 'TasksMedal', 'TasksChallenge', 'TasksStats', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
		}),
		deleteProjects: builder.mutation({
			query: () => ({
				url: `/delete/projects`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Project', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
		}),
		deleteProjectGroups: builder.mutation({
			query: () => ({
				url: `/delete/project-groups`,
				method: 'DELETE',
			}),
			invalidatesTags: ['ProjectGroup', 'OverviewStats', 'SyncMetadata', 'DocumentCounts'],
		}),
		deleteAllDocuments: builder.mutation({
			query: () => ({
				url: `/delete/all`,
				method: 'DELETE',
			}),
			invalidatesTags: [
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
	useDeleteFocusRecordsMutation,
	useDeleteTasksMutation,
	useDeleteProjectsMutation,
	useDeleteProjectGroupsMutation,
	useDeleteAllDocumentsMutation
} = deleteApi;
