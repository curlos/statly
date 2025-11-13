import { getGroupedFocusRecordsByDate } from '../../utils/focus-apps/focusRecords.utils';
import { arrayToObjectByKey } from '../../utils/focus-apps/helpers.utils';
import { getAllTasksAndItemsTickTickOne, getGroupedCompletedTasks } from '../../utils/focus-apps/tasks.utils';
import { baseAPI, buildQueryString } from '../api';

/**
 * @description This is the API for getting focus records, tasks, project, etc. from TickTick 1.0 - the original TickTick and the one I currently use. This is only going to be used to gather data from TickTick 1.0 and display it in a nicer fashion while I finish TickTick 2.0 which could take a while.
 */
export const tickTickOneApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getPomoAndStopwatchFocusRecords: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/ticktick/focus-records?${queryString}` : '/ticktick/focus-records';
			},
			transformResponse: (response) => {
				const focusRecords = response;
				const focusRecordsById = arrayToObjectByKey(focusRecords, 'id');
				const focusRecordsByDate = getGroupedFocusRecordsByDate(focusRecords);

				return { focusRecords: response, focusRecordsById, focusRecordsByDate };
			},
		}),
		getAllTasks: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/ticktick/tasks?${queryString}` : '/ticktick/tasks';
			},
			transformResponse: (response) => {
				const tasks = response;
				const tasksById = arrayToObjectByKey(response, 'id');
				const allTasksAndItems = getAllTasksAndItemsTickTickOne(tasks);

				const {
					allCompletedTasks,
					completedTasksGroupedByDate,
					completedTasksGroupedByProject,
					completedTasksGroupedByTag,
					ancestorTasksById,
				} = getGroupedCompletedTasks(tasks, tasksById);

				let totalCompletedTasks = 0;

				Object.values(completedTasksGroupedByDate).forEach((arr) => {
					if (arr) {
						totalCompletedTasks += arr.length;
					}
				});

				return {
					tasks,
					tasksById,
					allTasksAndItems,
					allCompletedTasks,
					completedTasksGroupedByDate,
					completedTasksGroupedByProject,
					completedTasksGroupedByTag,
					totalCompletedTasks,
					ancestorTasksById,
				};
			},
			providesTags: ['TickTick-1.0-Task'],
		}),
		getAllProjects: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/ticktick/projects?${queryString}` : '/ticktick/projects';
			},
			transformResponse: (response) => {
				const projects = response;
				const projectsWithInbox = [
					...projects,
					{
						id: 'inbox116577688',
						name: 'Inbox',
					},
				];
				const projectsById = arrayToObjectByKey(projectsWithInbox, 'id');

				return { projects: projectsWithInbox, projectsById };
			},
		}),
		getAllProjectGroups: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/ticktick/project-groups?${queryString}` : '/ticktick/project-groups';
			},
			transformResponse: (response) => {
				const projectGroups = response;
				const projectGroupsById = arrayToObjectByKey(projectGroups, 'id');

				return { projectGroups, projectGroupsById };
			},
		}),
		getAllTags: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/ticktick/tags?${queryString}` : '/ticktick/tags';
			},
			transformResponse: (response) => {
				const tags = response;
				// TickTick 1.0 Tags do not have an "id" property. Thie closest thing I see to a key is either "name" or "rawName".
				const tagsByRawName = arrayToObjectByKey(tags, 'rawName');

				return { tags, tagsByRawName };
			},
		}),
	}),
});

export const {
	useGetPomoAndStopwatchFocusRecordsQuery,
	useGetAllTasksQuery,
	useGetAllProjectsQuery,
	useGetAllProjectGroupsQuery,
	useGetAllTagsQuery
} = tickTickOneApi;
