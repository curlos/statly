import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Utility function to build query strings
export const buildQueryString = (params) => {
	return params ? new URLSearchParams(params).toString() : '';
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
		'Task',
		'Project',
		'FocusRecord',
		'User',
		'Comment',
		'Tag',
		'Filter',
		'Matrix',
		'Habit',
		'HabitSection',
		'HabitLog',
		'UserSettings',
		'TickTick-1.0-Task'
	],
	endpoints: () => ({}),
});
