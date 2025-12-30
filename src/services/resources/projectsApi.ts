import { baseAPI, buildQueryString } from '../api';
import { arrayToObjectByKey } from '../../utils/helpers.utils';
import type { Project, ProjectGroup } from '../../types/models';
import type { GetProjectsResponse, GetProjectGroupsResponse } from '../../types/api';
import { userSettingsApi } from './userSettingsApi';

/**
 * @description API for fetching projects data from the backend
 */
export const projectsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<GetProjectsResponse, { fullData?: boolean } | void>({
            async queryFn(queryParams, { dispatch }, _extraOptions, fetchWithBQ) {
                try {
                    // First, fetch user settings to get the inbox ID
                    const userSettingsResult = await dispatch(
                        userSettingsApi.endpoints.getUserSettings.initiate(undefined, { forceRefetch: true })
                    );

                    const inboxId = userSettingsResult.data?.userSettings?.tickTickInboxProjectId || '';

                    // Then fetch projects
                    const queryString = buildQueryString(queryParams || {});
                    const url = queryString ? `/projects?${queryString}` : '/projects';

                    const projectsResult = await fetchWithBQ(url);

                    if (projectsResult.error) {
                        return { error: projectsResult.error };
                    }

                    const projects = projectsResult.data as Project[];

                    const projectsById = arrayToObjectByKey(projects, 'id');
                    const projectsTickTick = projects.filter((project) => project.source === 'ProjectTickTick' || (inboxId && project.id === inboxId));
                    const projectsTodoist = projects.filter((project) => project.source === 'ProjectTodoist');
                    const projectsSession = projects.filter((project) => project.source === 'ProjectSession');
                    const projectsSessionById = arrayToObjectByKey(projectsSession, 'id');

                    return {
                        data: {
                            projects: projects,
                            projectsById,
                            projectsTickTick,
                            projectsTodoist,
                            projectsSession,
                            projectsSessionById
                        }
                    };
                } catch (error) {
                    return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
                }
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
