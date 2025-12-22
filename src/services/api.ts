import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface RootState {
	user: {
		token?: string;
	};
}

interface ViteImportMeta {
	readonly env: {
		readonly VITE_SERVER_URL: string;
	};
}

// Utility function to build query strings
export const buildQueryString = (params: Record<string, unknown>) => {
	if (!params) return '';

	// Filter out empty, null, or undefined values
	const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
		if (value !== '' && value !== null && value !== undefined) {
			acc[key] = value;
		}
		return acc;
	}, {} as Record<string, unknown>);

	return new URLSearchParams(filteredParams as Record<string, string>).toString();
};

// Define the API with tasks endpoints
export const baseAPI = createApi({
	reducerPath: 'api', // Unique identifier for the reducer
	baseQuery: fetchBaseQuery({
		baseUrl: (import.meta as unknown as ViteImportMeta).env.VITE_SERVER_URL,
		prepareHeaders: (headers, { getState }) => {
			const state = getState() as RootState;
			const token = state.user.token;
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
		'ExportDayWithCompletedTasks',
		'AllTasks',
		'Project',
		'ProjectGroup',
		'FocusRecord',
		'ExportFocusRecord',
		'AllFocusRecords',
		'FocusMedal',
		'TasksMedal',
		'FocusChallenge',
		'TasksChallenge',
		'OverviewStats',
		'FocusStats',
		'TasksStats',
		'SyncMetadata',
		'DocumentCounts',
		'TodayFocus',
		'StreakHistory',
		'CustomImage',
		'CustomImageFolder'
	],
	endpoints: () => ({}),
});
