import { baseAPI } from '../api';

/**
 * @description API for fetching documents/projects data from the backend
 */
export const documentsProjectsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query({
            query: () => '/documents/projects',
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['Project'],
        }),
        getProjectGroups: builder.query({
            query: () => '/documents/projects/project-groups',
            transformResponse: (response) => {
                return response;
            },
            providesTags: ['ProjectGroup'],
        })
    }),
    overrideExisting: false,
});

export const { useGetProjectsQuery, useGetProjectGroupsQuery } = documentsProjectsApi;
