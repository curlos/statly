import { baseAPI } from '../api';
import { arrayToObjectByKey } from '../../utils/focus-apps/helpers.utils';

/**
 * @description API for fetching documents/projects data from the backend
 */
export const documentsProjectsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: () => '/documents/projects',
            transformResponse: (response) => {
                return { projects: response };
            },
            providesTags: ['Project'],
        }),
        getProjectGroups: builder.query({
            query: () => '/documents/projects/project-groups',
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
