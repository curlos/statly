import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Utility function to build query strings
export const buildQueryString = (params) => {
	if (!params) return '';

	// Filter out empty, null, or undefined values
	const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
		if (value !== '' && value !== null && value !== undefined) {
			acc[key] = value;
		}
		return acc;
	}, {});

	return new URLSearchParams(filteredParams).toString();
};

// Define the API with tasks endpoints
export const baseAPI = createApi({
	reducerPath: 'api', // Unique identifier for the reducer
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_SERVER_URL,
		prepareHeaders: (headers, { getState }) => {
			const token = getState().user.token;
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
			return headers;
		},
	}),
	tagTypes: [
		'User',
		'UserSettings',
		'TickTick-1.0-Task',
		'DayWithCompletedTasks',
		'Project',
		'ProjectGroup',
		'FocusRecord',
		'FocusMedal',
		'TasksMedal',
		'FocusChallenge',
		'TasksChallenge',
		'OverviewStats',
		'FocusStats',
		'TasksStats'
	],
	endpoints: () => ({}),
});
