import { baseAPI, buildQueryString } from '../api';
import { arrayToObjectByKey } from '../../utils/focus-apps/helpers.utils';

/**
 * @description API for fetching documents/projects data from the backend
 */
export const documentsProjectsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: (queryParams?: { fullData?: boolean }) => {
                const queryString = buildQueryString(queryParams || {});
                return queryString
                    ? `/documents/projects?${queryString}`
                    : '/documents/projects';
            },
            transformResponse: (response) => {
                const projects = response
                const projectsWithInbox = [
					...projects,
					{
						id: 'inbox116577688',
						name: 'Inbox',
					},
				];
                const projectsById = arrayToObjectByKey(projectsWithInbox, 'id');
                const projectsTickTick = projectsWithInbox.filter((project: any) => project.source === 'ProjectTickTick' || project.id === 'inbox116577688');
                const projectsTodoist = projects.filter((project: any) => project.source === 'ProjectTodoist');
                const projectsSession = projects.filter((project: any) => project.source === 'ProjectSession');
                const projectsSessionById = arrayToObjectByKey(projectsSession, 'id');

                return { projects, projectsById, projectsTickTick, projectsTodoist, projectsSession, projectsSessionById };
            },
            providesTags: ['Project'],
        }),
        getProjectGroups: builder.query({
            query: (queryParams?: { fullData?: boolean }) => {
                const queryString = buildQueryString(queryParams || {});
                return queryString
                    ? `/documents/projects/project-groups?${queryString}`
                    : '/documents/projects/project-groups';
            },
            transformResponse: (response) => {
                const projectGroups = response
                const projectGroupsById = arrayToObjectByKey(projectGroups, 'id');
                return { projectGroups, projectGroupsById };
            },
            providesTags: ['ProjectGroup'],
        })
    }),
    overrideExisting: false,
});

export const { useGetProjectsQuery, useGetProjectGroupsQuery } = documentsProjectsApi;
