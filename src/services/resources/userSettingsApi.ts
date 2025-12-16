import { baseAPI } from '../api';
import { invalidateOnSuccess } from '../utils/rtkHelpers';
import type { GetUserSettingsResponse, UserSettings } from '../../types/api';

export const userSettingsApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getUserSettings: builder.query<GetUserSettingsResponse, void>({
			query: () => {
				return `/user-settings`;
			},
			providesTags: ['UserSettings'],
			transformResponse: (response: UserSettings): GetUserSettingsResponse => {
				const userSettings = response;
				return { userSettings };
			},
		}),
		editUserSettings: builder.mutation({
			query: (payload) => ({
				url: `/user-settings/edit`,
				method: 'PUT',
				body: payload,
			}),
			// Optimistically update the user settings
			onQueryStarted: async (payload, { dispatch, queryFulfilled }) => {
				const patchResult = dispatch(
					userSettingsApi.util.updateQueryData('getUserSettings', undefined, (draft) => {
						const currentUserSettings = draft.userSettings;

						// Overwrite user settings properties with those from payload
						// This will update user settings with all the properties from payload
						// Existing properties in user settings that are also in the payload will be overwritten
						Object.assign(currentUserSettings, payload);
					})
				);

				try {
					// Wait for the mutation to resolve
					await queryFulfilled;
				} catch {
					// If the mutation fails, undo the optimistic update
					patchResult.undo();
				}
			},
			invalidatesTags: invalidateOnSuccess(['UserSettings', 'TodayFocus', 'StreakHistory'] as const),
		}),
		getDocumentCounts: builder.query({
			query: () => `/user-settings/document-counts`,
			providesTags: ['DocumentCounts'],
		}),
	}),
});

export const {
	useGetUserSettingsQuery,
	useEditUserSettingsMutation,
	useGetDocumentCountsQuery
} = userSettingsApi;
