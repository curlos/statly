import { baseAPI } from '../api';
import { invalidateOnSuccess } from '../utils/rtkHelpers';

export interface CustomImageFolder {
	_id: string;
	userId: string;
	source: string;
	name: string;
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export const customImageFoldersApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getCustomImageFolders: builder.query<CustomImageFolder[], void>({
			query: () => '/custom-image-folders',
			providesTags: ['CustomImageFolder'],
		}),
		createCustomImageFolder: builder.mutation<CustomImageFolder, { name: string }>({
			query: (body) => ({
				url: '/custom-image-folders',
				method: 'POST',
				body,
			}),
			invalidatesTags: invalidateOnSuccess(['CustomImageFolder'] as const),
		}),
		renameCustomImageFolder: builder.mutation<CustomImageFolder, { id: string; name: string }>({
			query: ({ id, name }) => ({
				url: `/custom-image-folders/${id}`,
				method: 'PUT',
				body: { name },
			}),
			invalidatesTags: invalidateOnSuccess(['CustomImageFolder', 'CustomImage'] as const),
		}),
		deleteCustomImageFolder: builder.mutation<{ message: string }, { id: string; strategy?: 'moveToGeneral' | 'deleteImages' }>({
			query: (args) => {
				const { id, strategy } = args;
				return {
					url: `/custom-image-folders/${id}${strategy ? `?strategy=${strategy}` : ''}`,
					method: 'DELETE',
				};
			},
			invalidatesTags: invalidateOnSuccess(['CustomImageFolder', 'CustomImage'] as const),
		}),
	}),
});

export const {
	useGetCustomImageFoldersQuery,
	useCreateCustomImageFolderMutation,
	useRenameCustomImageFolderMutation,
	useDeleteCustomImageFolderMutation,
} = customImageFoldersApi;
