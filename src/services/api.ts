import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthenticatedBaseQuery } from './utils/customBaseQuery';

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
	baseQuery: createAuthenticatedBaseQuery(),
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
		'CombinedStreakHistory',
		'CustomImage',
		'CustomImageFolder'
	],
	endpoints: () => ({}),
});
