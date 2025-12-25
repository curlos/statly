import { baseAPI, buildQueryString } from '../api';
import { arrayToObjectByKey } from '../../utils/helpers.utils';
import type { Project, ProjectGroup } from '../../types/models';
import type { GetProjectsResponse, GetProjectGroupsResponse } from '../../types/api';

/**
 * @description API for fetching projects data from the backend
 */
export const projectsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<GetProjectsResponse, { fullData?: boolean } | void>({
            query: (queryParams?: { fullData?: boolean }) => {
                const queryString = buildQueryString(queryParams || {});
                return queryString
                    ? `/projects?${queryString}`
                    : '/projects';
            },
            transformResponse: (response: Project[]) => {
                const projects = response;
                const projectsWithInbox: Project[] = [
					...projects,
					{
						id: 'inbox116577688',
						name: 'Inbox',
						source: 'ProjectTickTick',
					} as Project,
				];

                const projectsById = arrayToObjectByKey(projectsWithInbox, 'id');
                const projectsTickTick = projectsWithInbox.filter((project) => project.source === 'ProjectTickTick' || project.id === 'inbox116577688');
                const projectsTodoist = projects.filter((project) => project.source === 'ProjectTodoist');
                const projectsSession = projects.filter((project) => project.source === 'ProjectSession');
                const projectsSessionById = arrayToObjectByKey(projectsSession, 'id');

                return { projects, projectsById, projectsTickTick, projectsTodoist, projectsSession, projectsSessionById };
            },
            providesTags: ['Project'],
        }),
        getProjectGroups: builder.query<GetProjectGroupsResponse, { fullData?: boolean } | void>({
            query: (queryParams?: { fullData?: boolean }) => {
                const queryString = buildQueryString(queryParams || {});
                return queryString
                    ? `/projects/project-groups?${queryString}`
                    : '/projects/project-groups';
            },
            transformResponse: (response: ProjectGroup[]) => {
                const projectGroups = response;
                const projectGroupsById = arrayToObjectByKey(projectGroups, 'id');
                return { projectGroups, projectGroupsById };
            },
            providesTags: ['ProjectGroup'],
        })
    }),
    overrideExisting: false,
});

export const { useGetProjectsQuery, useGetProjectGroupsQuery } = projectsApi;
