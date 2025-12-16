import { useState, useEffect, useMemo } from 'react';
import { useGetFocusStatsQuery, useGetTasksStatsQuery } from '../../../../services/resources/statsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import { useStatsDateRange } from '../../../../hooks/useStatsDateRange';
import { getFormattedShortMonthDay } from '../../../../utils/date.utils';
import type {
	TaskStatsByDayItem,
	FocusStatsByDayItem,
	TaskStatsByRecordItem,
	FocusStatsByRecordItem
} from '../../../../types/api';

interface UseGetStatsForIntervalOptions {
	dataType: 'duration' | 'count' | 'completedTasks';
	initialInterval: string;
	initialDates: Date[];
	showRecordInterval?: boolean;
}

/**
 * Custom hook to fetch and transform stats data for interval-based charts
 * Handles API fetching, date range management, grouped intervals, and data transformation
 * Used by FocusDurationCurveCard (duration), FocusRecordsCurveCard (count), and CompletedTasksCurveCard (completedTasks)
 */
export const useGetStatsForInterval = (options: UseGetStatsForIntervalOptions) => {
	const { dataType, initialInterval, initialDates, showRecordInterval = false } = options;

	const selectedIntervalOptions = showRecordInterval
		? ['Day', 'Week', 'Month', 'Year', 'All', 'Custom']
		: ['Week', 'Month', 'Year', 'All', 'Custom'];

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

	// Determine which grouped interval options to show based on selected interval
	// Memoize to prevent recalculation on every render
	const availableGroupedIntervalOptions = useMemo(() => {
		let options: string[] = [];

		if (selectedInterval === 'Day') {
			options = ['Records']; // Day can only be grouped by Records
		} else if (selectedInterval === 'Week') {
			options = ['Days']; // Week can only be grouped by Days
		} else if (selectedInterval === 'All' || selectedInterval === 'Custom') {
			options = selectedGroupedIntervalOptions; // Show all options including 'Years'
		} else if (selectedInterval === 'Month') {
			options = ['Days', 'Weeks']; // Month can only be grouped by Days or Weeks
		} else {
			options = ['Days', 'Weeks', 'Months']; // Other intervals exclude 'Years'
		}

		// Add 'Records' option if showRecordInterval is true (but not for 'Day' since it's already set)
		if (showRecordInterval && selectedInterval !== 'Day') {
			options.push('Records');
		}

		return options;
	}, [selectedInterval, showRecordInterval]);

	// Initialize with first available option instead of hard-coded 'Days'
	const [selectedGroupedInterval, setSelectedGroupedInterval] = useState(availableGroupedIntervalOptions[0]);

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
			case 'Records':
				return 'record';
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
		const rawData = statsData.byDay || statsData.byWeek || statsData.byMonth || statsData.byYear || statsData.byRecord || [];

		return rawData.map((item: TaskStatsByDayItem | FocusStatsByDayItem | TaskStatsByRecordItem | FocusStatsByRecordItem) => {
			let name = '';

			if (selectedGroupedInterval === 'Days') {
				// Backend returns YYYY-MM-DD format for days
				const dateItem = item as TaskStatsByDayItem | FocusStatsByDayItem;
				const [year, month, dayNum] = dateItem.date.split('-').map(Number);
				const date = new Date(year, month - 1, dayNum);
				name = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
			} else if (selectedGroupedInterval === 'Weeks') {
				// Backend returns "January 1, 2025" format (Monday of the week)
				// Display as "Jan 1 - Jan 7, 2025" (start of week to end of week)
				const dateItem = item as TaskStatsByDayItem | FocusStatsByDayItem;
				const startDate = new Date(dateItem.date);
				const endDate = new Date(startDate);
				endDate.setDate(endDate.getDate() + 6); // Add 6 days to get Sunday

				const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
				const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
				name = `${startStr} - ${endStr}`;
			} else if (selectedGroupedInterval === 'Months') {
				// Backend returns "January 2025" format
				const dateItem = item as TaskStatsByDayItem | FocusStatsByDayItem;
				name = dateItem.date;
			} else if (selectedGroupedInterval === 'Years') {
				// Backend returns year as string (e.g., "2025")
				const dateItem = item as TaskStatsByDayItem | FocusStatsByDayItem;
				name = dateItem.date;
			} else if (selectedGroupedInterval === 'Records') {
				// For Records: X-axis shows just date, tooltip shows full date + time range
				const recordItem = item as TaskStatsByRecordItem | FocusStatsByRecordItem;
				const startDate = new Date(recordItem.startTime);
				const endDate = new Date(recordItem.endTime);

				// Check if record spans multiple days
				const startDay = getFormattedShortMonthDay(startDate);
				const endDay = getFormattedShortMonthDay(endDate);
				const crossesMidnight = startDay !== endDay;

				// Short name for X-axis (just date)
				if (crossesMidnight) {
					name = `${startDay} - ${endDay}`;
				} else {
					name = startDay;
				}
			}

			// Return different data shape based on dataType
			if (dataType === 'duration') {
				const focusItem = item as FocusStatsByDayItem | FocusStatsByRecordItem;
				const isRecordItem = 'startTime' in focusItem;
				return {
					name,
					fullName: selectedGroupedInterval === 'Records' && isRecordItem
						? `${name}\n${new Date(focusItem.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${new Date(focusItem.endTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
						: name,
					seconds: focusItem.duration,
					startTime: isRecordItem ? focusItem.startTime : undefined,
					endTime: isRecordItem ? focusItem.endTime : undefined,
				};
			} else if (dataType === 'count') {
				const countItem = item as FocusStatsByDayItem | FocusStatsByRecordItem;
				return {
					name,
					fullName: name,
					score: countItem.count || 0,
				};
			} else {
				// dataType === 'completedTasks'
				const taskItem = item as TaskStatsByDayItem | TaskStatsByRecordItem;
				return {
					name,
					fullName: name,
					score: taskItem.count || 0,
				};
			}
		});
	};

	const data = transformDataForChart();

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
	};
};
