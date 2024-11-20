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
		getTodoistAllCompletedTasks: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/old-focus-apps/todoist-all-completed-tasks?${queryString}`
					: '/old-focus-apps/todoist-all-completed-tasks';
			},
			transformResponse: (response) => {
				const todoistAllCompletedTasks = response;

				const { todoistCompletedTasksGroupedByDate } =
					getGroupedTodoistCompletedTasks(todoistAllCompletedTasks);

				return { todoistAllCompletedTasks, todoistCompletedTasksGroupedByDate };
			},
		}),
		getTodoistAllTasksById: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString
					? `/old-focus-apps/todoist-all-tasks-by-id?${queryString}`
					: '/old-focus-apps/todoist-all-tasks-by-id';
			},
			transformResponse: (response) => {
				const todoistAllTasksById = response;

				return { todoistAllTasksById };
			},
		}),
	}),
});

export const {
	useGetSessionAppFocusRecordsQuery,
	useGetBeFocusedAppFocusRecordsQuery,
	useGetForestAppFocusRecordsQuery,
	useGetTideAppFocusRecordsQuery,
	useGetTodoistAllCompletedTasksQuery,
	useGetTodoistAllTasksByIdQuery,
} = oldFocusAppsApi;
