import { baseAPI } from '../api';
import { applySettingsPatch } from '../../utils/settingsPatch';
import { applyGuestSettingsPatches, isGuestToken } from '../../utils/guest.utils';
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
				if (isGuestToken(localStorage.getItem('token'))) {
					applyGuestSettingsPatches(userSettings as unknown as Record<string, unknown>);
				}
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
						// Dotted keys like "pages.forest.landStyle" are set by their path
						applySettingsPatch(currentUserSettings as unknown as Record<string, unknown>, payload);
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
			invalidatesTags: (result, error) => {
				if (error) {
					return [];
				}
				// A guest's change only exists in their browser so the settings themselves don't need fetching, but their streaks do
				if ((result as { guestLocal?: boolean } | undefined)?.guestLocal) {
					return ['TodayFocus', 'StreakHistory', 'CombinedStreakHistory'];
				}
				return ['UserSettings', 'TodayFocus', 'StreakHistory', 'CombinedStreakHistory'];
			},
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
