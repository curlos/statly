import { arrayToObjectByKey } from '../../utils/focus-apps/helpers.utils';
import { getGroupedTodoistCompletedTasks } from '../../utils/focus-apps/tasks.utils';
import { baseAPI, buildQueryString } from '../api';

/**
 * @description This is the API for getting focus records, tasks, project, etc. from TickTick 1.0 - the original TickTick and the one I currently use. This is only going to be used to gather data from TickTick 1.0 and display it in a nicer fashion while I finish TickTick 2.0 which could take a while.
 */
export const oldFocusAppsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getSessionAppFocusRecords: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return '/old-focus-apps/focus-records/session-app?no-breaks=true';
			},
			transformResponse: (response) => {
				const sessionFocusRecords = response;
				const sessionFocusRecordsByCategory = {};

				const categoriesById = {};

				sessionFocusRecords.forEach((focusRecord) => {
					const { category } = focusRecord;

					const categoryId = category.id || 'General';

					if (!categoriesById[categoryId]) {
						categoriesById[categoryId] = category;
					}

					if (!sessionFocusRecordsByCategory[categoryId]) {
						sessionFocusRecordsByCategory[categoryId] = [];
					}

					sessionFocusRecordsByCategory[categoryId].push(focusRecord);
				});

				return { sessionFocusRecords, sessionFocusRecordsByCategory, sessionCategoriesById: categoriesById };
			},
		}),
		getBeFocusedAppFocusRecords: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/old-focus-apps/focus-records/be-focused-app?${queryString}`
					: '/old-focus-apps/focus-records/be-focused-app';
			},
			transformResponse: (response) => {
				const beFocusedAppFocusRecords = response;

				return { beFocusedAppFocusRecords };
			},
		}),
		getForestAppFocusRecords: builder.query({
			query: (queryParams) => {
				return '/old-focus-apps/focus-records/forest-app?before-session-app=true';
			},
			transformResponse: (response) => {
				const forestAppFocusRecords = response;

				return { forestAppFocusRecords };
			},
		}),
		getTideAppFocusRecords: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/old-focus-apps/focus-records/tide-app?${queryString}`
					: '/old-focus-apps/focus-records/tide-app';
			},
			transformResponse: (response) => {
				const tideAppFocusRecords = response;
				return { tideAppFocusRecords };
			},
		}),
		getTodoistAllTasks: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/old-focus-apps/todoist-all-tasks?${queryString}`
					: '/old-focus-apps/todoist-all-tasks';
			},
			transformResponse: (response) => {
				const todoistAllTasks = response;
				const todoistAllTasksById = arrayToObjectByKey(response, 'id');

				const { todoistCompletedTasksGroupedByDate, ancestorTasksById: todoistAncestorTasksById } =
					getGroupedTodoistCompletedTasks(todoistAllTasks, todoistAllTasksById);

				return {
					todoistAllTasks,
					todoistAllTasksById,
					todoistCompletedTasksGroupedByDate,
					todoistAncestorTasksById,
				};
			},
		}),
		getTodoistAllProjects: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/old-focus-apps/todoist-all-projects?${queryString}`
					: '/old-focus-apps/todoist-all-projects';
			},
			transformResponse: (response) => {
				const todoistAllProjects = response;
				const todoistAllProjectsById = arrayToObjectByKey(response, 'id');

				return { todoistAllProjects, todoistAllProjectsById };
			},
		}),
	}),
});

export const {
	useGetSessionAppFocusRecordsQuery,
	useGetBeFocusedAppFocusRecordsQuery,
	useGetForestAppFocusRecordsQuery,
	useGetTideAppFocusRecordsQuery,
	useGetTodoistAllTasksQuery,
	useGetTodoistAllProjectsQuery,
} = oldFocusAppsApi;
