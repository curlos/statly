import { baseAPI, buildQueryString } from '../api';

/**
 * @description API for fetching streaks data from the backend
 */
export const streaksApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getStreaksToday: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/streaks/today?${queryString}` : '/streaks/today';
			},
			transformResponse: (response) => {
				return response;
			},
			providesTags: ['TodayFocus'],
		}),
		getStreakHistory: builder.query({
			query: (queryParams) => {
				const queryString = buildQueryString(queryParams);
				return queryString ? `/streaks/history?${queryString}` : '/streaks/history';
			},
			transformResponse: (response) => {
				return response;
			},
			providesTags: ['StreakHistory'],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetStreaksTodayQuery,
	useGetStreakHistoryQuery
} = streaksApi;
