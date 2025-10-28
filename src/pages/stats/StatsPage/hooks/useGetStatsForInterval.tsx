import { useState, useEffect } from 'react';
import { useGetFocusStatsQuery, useGetTasksStatsQuery } from '../../../../services/resources/documentsStatsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import { useStatsDateRange } from '../../../../hooks/useStatsDateRange';

interface UseGetStatsForIntervalOptions {
	dataType: 'duration' | 'count' | 'completedTasks';
	initialInterval: string;
	initialDates: Date[];
	showGroupedIntervalForWeek?: boolean;
}

/**
 * Custom hook to fetch and transform stats data for interval-based charts
 * Handles API fetching, date range management, grouped intervals, and data transformation
 * Used by FocusDurationCurveCard (duration), FocusRecordsCurveCard (count), and CompletedTasksCurveCard (completedTasks)
 */
export const useGetStatsForInterval = (options: UseGetStatsForIntervalOptions) => {
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

	const selectedGroupedIntervalOptions = ['Days', 'Weeks', 'Months', 'Years'];
	const [selectedGroupedInterval, setSelectedGroupedInterval] = useState('Days');

	// Determine which grouped interval options to show based on selected interval
	const getGroupedIntervalOptions = () => {
		if (selectedInterval === 'Week') {
			return ['Days']; // Week can only be grouped by Days
		} else if (selectedInterval === 'All' || selectedInterval === 'Custom') {
			return selectedGroupedIntervalOptions; // Show all options including 'Years'
		} else if (selectedInterval === 'Month') {
			return ['Days', 'Weeks']; // Month can only be grouped by Days or Weeks
		} else {
			return ['Days', 'Weeks', 'Months']; // Other intervals exclude 'Years'
		}
	};

	const availableGroupedIntervalOptions = getGroupedIntervalOptions();

	// Auto-reset selectedGroupedInterval if it's not available in current options
	useEffect(() => {
		if (!availableGroupedIntervalOptions.includes(selectedGroupedInterval)) {
			setSelectedGroupedInterval(availableGroupedIntervalOptions[0]);
		}
	}, [selectedInterval, selectedGroupedInterval, availableGroupedIntervalOptions]);

	// Map selectedGroupedInterval to API group-by parameter
	const getGroupByParam = () => {
		switch (selectedGroupedInterval) {
			case 'Days':
				return 'day';
			case 'Weeks':
				return 'week';
			case 'Months':
				return 'month';
			case 'Years':
				return 'year';
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

	// Fetch stats from API - use different query based on dataType
	const isFocusData = dataType === 'duration' || dataType === 'count';
	const { data: focusStatsData, isLoading: isFocusLoading, isFetching: isFocusFetching } = useGetFocusStatsQuery(queryParams, {
		skip: !isFocusData
	});
	const { data: tasksStatsData, isLoading: isTasksLoading, isFetching: isTasksFetching } = useGetTasksStatsQuery(queryParams, {
		skip: isFocusData
	});

	const statsData = isFocusData ? focusStatsData : tasksStatsData;
	const isLoading = isFocusData ? isFocusLoading : isTasksLoading;
	const isFetching = isFocusData ? isFocusFetching : isTasksFetching;

	// Transform API data to chart format based on grouping
	const transformDataForChart = () => {
		if (!statsData) return [];

		// Get the appropriate data array based on group-by parameter
		const rawData = statsData.byDay || statsData.byWeek || statsData.byMonth || statsData.byYear || [];

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
			} else if (selectedGroupedInterval === 'Years') {
				// Backend returns year as string (e.g., "2025")
				name = item.date;
			}

			// Return different data shape based on dataType
			if (dataType === 'duration') {
				return {
					name,
					seconds: item.duration,
				};
			} else if (dataType === 'count') {
				return {
					name,
					fullName: name,
					score: item.count || 0,
				};
			} else {
				// dataType === 'completedTasks'
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
		selectedGroupedIntervalOptions: availableGroupedIntervalOptions,

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
