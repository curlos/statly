import { baseAPI } from '../api';
import { invalidateOnSuccess } from '../utils/rtkHelpers';
import type { CustomImage } from '../../types/models';

export const customImagesApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getCustomImages: builder.query<CustomImage[], void>({
			query: () => '/custom-images',
			providesTags: ['CustomImage'],
		}),
		uploadCustomImages: builder.mutation<CustomImage[], FormData>({
			query: (formData) => ({
				url: '/custom-images/upload',
				method: 'POST',
				body: formData,
			}),
			invalidatesTags: invalidateOnSuccess(['CustomImage'] as const),
		}),
		updateCustomImage: builder.mutation<CustomImage, { id: string; formData: FormData }>({
			query: ({ id, formData }) => ({
				url: `/custom-images/${id}`,
				method: 'PUT',
				body: formData,
			}),
			invalidatesTags: invalidateOnSuccess(['CustomImage', 'UserSettings'] as const),
		}),
		deleteCustomImage: builder.mutation<{ message: string }, string>({
			query: (id) => ({
				url: `/custom-images/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: invalidateOnSuccess(['CustomImage'] as const),
		}),
		reorderCustomImages: builder.mutation<{ message: string }, string[]>({
			query: (imageIds) => ({
				url: '/custom-images/reorder',
				method: 'PUT',
				body: { imageIds },
			}),
			invalidatesTags: invalidateOnSuccess(['CustomImage'] as const),
		}),
		moveCustomImage: builder.mutation<CustomImage, { id: string; folder: string }>({
			query: ({ id, folder }) => ({
				url: `/custom-images/${id}/move`,
				method: 'PUT',
				body: { folder },
			}),
			invalidatesTags: invalidateOnSuccess(['CustomImage'] as const),
		}),
	}),
});

export const {
	useGetCustomImagesQuery,
	useUploadCustomImagesMutation,
	useUpdateCustomImageMutation,
	useDeleteCustomImageMutation,
	useReorderCustomImagesMutation,
	useMoveCustomImageMutation,
} = customImagesApi;
