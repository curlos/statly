import { useState } from 'react';
import { useGetFocusStatsQuery } from '../../../../services/resources/documentsStatsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import { useStatsDateRange } from '../../../../hooks/useStatsDateRange';

interface UseGetFocusStatsForIntervalOptions {
	dataType: 'duration' | 'count';
	initialInterval: string;
	initialDates: Date[];
	showGroupedIntervalForWeek?: boolean;
}

/**
 * Custom hook to fetch and transform focus stats data for interval-based charts
 * Handles API fetching, date range management, grouped intervals, and data transformation
 * Used by both TrendsCard (duration) and RecentFocusRecordsCurveCard (count)
 */
export const useGetFocusStatsForInterval = (options: UseGetFocusStatsForIntervalOptions) => {
	const { dataType, initialInterval, initialDates, showGroupedIntervalForWeek = false } = options;

	const selectedIntervalOptions = ['Week', 'Month', 'Year', 'All', 'Custom'];

	// Use custom hook for date range management
	const {
		selectedInterval,
		setSelectedInterval,
		apiStartDate,
		apiEndDate,
		setIsModalPickDateRangeOpen,
		renderDateRangePicker,
		renderCustomDateModal,
	} = useStatsDateRange({
		initialInterval,
		initialDates,
	});

	const selectedGroupedIntervalOptions = ['Days', 'Weeks', 'Months'];
	const [selectedGroupedInterval, setSelectedGroupedInterval] = useState('Days');

	// Map selectedGroupedInterval to API group-by parameter
	const getGroupByParam = () => {
		switch (selectedGroupedInterval) {
			case 'Days':
				return 'day';
			case 'Weeks':
				return 'week';
			case 'Months':
				return 'month';
			default:
				return 'day';
		}
	};

	// Build query params for API using custom hook
	const queryParams = useStatsQueryParams({
		'group-by': getGroupByParam(),
		'interval-start-date': apiStartDate,
		'interval-end-date': apiEndDate,
	});

	// Fetch stats from API
	const { data: statsData, isLoading, isFetching } = useGetFocusStatsQuery(queryParams);

	// Transform API data to chart format based on grouping
	const transformDataForChart = () => {
		if (!statsData) return [];

		// Get the appropriate data array based on group-by parameter
		const rawData = statsData.byDay || statsData.byWeek || statsData.byMonth || [];

		return rawData.map((item: any) => {
			let name = '';

			if (selectedGroupedInterval === 'Days') {
				// Backend returns YYYY-MM-DD format for days
				const [year, month, dayNum] = item.date.split('-').map(Number);
				const date = new Date(year, month - 1, dayNum);
				name = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
			} else if (selectedGroupedInterval === 'Weeks') {
				// Backend returns "January 1, 2025" format (Monday of the week)
				// Display as "Jan 1 - Jan 7, 2025" (start of week to end of week)
				const startDate = new Date(item.date);
				const endDate = new Date(startDate);
				endDate.setDate(endDate.getDate() + 6); // Add 6 days to get Sunday

				const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
				const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
				name = `${startStr} - ${endStr}`;
			} else if (selectedGroupedInterval === 'Months') {
				// Backend returns "January 2025" format
				name = item.date;
			}

			// Return different data shape based on dataType
			if (dataType === 'duration') {
				return {
					name,
					seconds: item.duration,
				};
			} else {
				return {
					name,
					fullName: name,
					score: item.count || 0,
				};
			}
		});
	};

	const data = transformDataForChart();

	// Determine if grouped interval dropdown should be shown
	const shouldShowGroupedInterval = showGroupedIntervalForWeek ? true : selectedInterval !== 'Week';

	return {
		// State
		selectedInterval,
		setSelectedInterval,
		selectedIntervalOptions,
		selectedGroupedInterval,
		setSelectedGroupedInterval,
		selectedGroupedIntervalOptions,

		// API data
		data,
		statsData,
		isLoading,
		isFetching,

		// Helper functions
		setIsModalPickDateRangeOpen,
		renderDateRangePicker,
		renderCustomDateModal,
		shouldShowGroupedInterval,
	};
};
