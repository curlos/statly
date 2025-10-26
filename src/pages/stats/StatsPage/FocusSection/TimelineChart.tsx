import { useState, useEffect } from 'react';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import {
	convertTo12HourFormat,
	getFormattedLongDay,
	getDailyHourBlocks,
	getDateRangeFromSelectedDates,
} from '../../../../utils/date.utils';
import { getFormattedDuration } from '../../../../utils/focus-apps/helpers.utils';
import { useGetFocusRecordsStatsQuery } from '../../../../services/resources/documentsFocusRecordsApi';
import { useFocusRecordsQueryParams } from '../../../../hooks/useFocusRecordsQueryParams';
import ReactApexChart from 'react-apexcharts';
import apexchart from 'apexcharts';
import Spinner from '../../../../components/Loaders/Spinner';

const TimelineChart = ({ selectedDates }) => {
	// Get date range from selected dates
	const { startDate: apiStartDate, endDate: apiEndDate } = getDateRangeFromSelectedDates(selectedDates);

	// Build query params for API using custom hook
	const queryParams = useFocusRecordsQueryParams({
		'group-by': 'timeline',
		'start-date': apiStartDate,
		'end-date': apiEndDate,
	});

	// Fetch stats from API
	const { data: statsData, isLoading, isFetching } = useGetFocusRecordsStatsQuery(queryParams);
	const focusRecords = statsData?.records || [];

	// Create series in reverse order (12:00 AM at top, 11:00 PM at bottom)
	const DEFAULT_SERIES = Array.from({ length: 24 }, (_, i) => {
		const startHour = convertTo12HourFormat(`${i.toString().padStart(2, '0')}:00`);
		return {
			name: startHour, // Y-axis label shows just start hour
			data: Array.from({ length: 7 }, () => 0),
		};
	}).reverse();

	const [series, setSeries] = useState(DEFAULT_SERIES);

	const chartId = 'timeline';
	const { chosenColorName, chosenColorVariantsObj } = useThemeContext();

	const getColorScaleRanges = () => {
		return [
			{ from: 0, to: 0, color: '#2f2f2f', name: '0m' },
			{ from: 1, to: 600, color: chosenColorVariantsObj[`${chosenColorName}-100`].hexColor, name: '0m-10m' }, // 100
			{ from: 601, to: 1200, color: chosenColorVariantsObj[`${chosenColorName}-300`].hexColor, name: '10m-20m' }, // 300
			{ from: 1201, to: 1800, color: chosenColorVariantsObj[`${chosenColorName}-400`].hexColor, name: '20m-30m' }, // 400
			{ from: 1801, to: 2400, color: chosenColorVariantsObj[`${chosenColorName}-500`].hexColor, name: '30m-40m' }, // 500
			{ from: 2401, to: 3000, color: chosenColorVariantsObj[`${chosenColorName}-600`].hexColor, name: '40m-50m' }, // 600
			{ from: 3001, to: 3600, color: chosenColorVariantsObj[`${chosenColorName}-700`].hexColor, name: '50m-60m' }, // 700
		];
	};

	const options = {
		chart: {
			id: chartId,
			height: 250,
			type: 'heatmap',
			toolbar: {
				show: false,
			},
			background: 'transparent', // Dark background for the chart area
		},
		plotOptions: {
			heatmap: {
				enableShades: false,
				useFillColorAsStroke: true,
				colorScale: {
					ranges: getColorScaleRanges(),
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		xaxis: {
			type: 'category',
			categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			labels: {
				style: {
					colors: '#FFFFFF', // White labels for dark mode
				},
			},
			tooltip: {
				enabled: false,
			},
			axisTicks: {
				show: true,
			},
		},
		yaxis: {
			labels: {
				style: {
					colors: '#FFFFFF', // White labels for dark mode
				},
			},
		},
		tooltip: {
			theme: 'dark',
			custom: ({ seriesIndex, dataPointIndex, w }) => {
				const value = w.globals.series[seriesIndex][dataPointIndex];
				const hourLabel = w.globals.seriesNames[seriesIndex];

				// Get the date for this data point using the dataPointIndex (0-6 for days of week)
				const date = selectedDates[dataPointIndex];
				const formattedDate = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

				// Calculate the end hour (next hour)
				// Extract hour from label like "12:00 AM" or "1:00 PM"
				const hourMatch = hourLabel.match(/(\d+):00 (AM|PM)/);
				if (hourMatch) {
					let hour = parseInt(hourMatch[1]);
					const period = hourMatch[2];

					// Convert to next hour
					let nextHour;
					let nextPeriod;

					if (hour === 12) {
						nextHour = 1;
						nextPeriod = period; // 12 AM -> 1 AM, 12 PM -> 1 PM
					} else if (hour === 11) {
						nextHour = 12;
						nextPeriod = period === 'AM' ? 'PM' : 'AM'; // 11 AM -> 12 PM, 11 PM -> 12 AM
					} else {
						nextHour = hour + 1;
						nextPeriod = period;
					}

					const endHour = `${nextHour}:00 ${nextPeriod}`;

					return `
						<div style="padding: 8px; background: black; border-radius: 4px;">
							<div style="margin-bottom: 4px; color: #aaa;">${formattedDate}</div>
							<div style="margin-bottom: 4px;">${hourLabel} - ${endHour}</div>
							<div style="font-weight: bold;">${getFormattedDuration(value, false)}</div>
						</div>
					`;
				}

				return `
					<div style="padding: 8px; background: black; border-radius: 4px;">
						<div style="margin-bottom: 4px; color: #aaa;">${formattedDate}</div>
						<div style="margin-bottom: 4px;">${hourLabel}</div>
						<div style="font-weight: bold;">${getFormattedDuration(value, false)}</div>
					</div>
				`;
			},
		},
		legend: {
			show: false,
		},
	};

	useEffect(() => {
		if (focusRecords.length > 0) {
			const newSeries = DEFAULT_SERIES.map(s => ({ ...s, data: [...s.data] }));

			// Group records by date - a record can span multiple days, so add it to all affected days
			const recordsByDate: Record<string, any[]> = {};
			focusRecords.forEach((record: any) => {
				const startTime = new Date(record.startTime);
				const endTime = new Date(record.endTime);

				// Iterate through all days this record spans
				const currentDate = new Date(startTime);
				currentDate.setHours(0, 0, 0, 0); // Start at beginning of start day

				const endDate = new Date(endTime);
				endDate.setHours(0, 0, 0, 0); // Get beginning of end day

				// Add record to each day it overlaps
				while (currentDate <= endDate) {
					const dateKey = getFormattedLongDay(currentDate);
					if (!recordsByDate[dateKey]) {
						recordsByDate[dateKey] = [];
					}
					recordsByDate[dateKey].push(record);

					// Move to next day
					currentDate.setDate(currentDate.getDate() + 1);
				}
			});

			// For all 7 days of the week, process each day
			for (let dayIndex = 0; dayIndex < selectedDates.length; dayIndex++) {
				const selectedDate = selectedDates[dayIndex];
				const dateKey = getFormattedLongDay(selectedDate);
				const recordsForTheDay = recordsByDate[dateKey] || [];

				// Create hour blocks for the day
				const newDailyHourBlocks = getDailyHourBlocks();

				// Fill hour blocks with durations from records
				recordsForTheDay.forEach((record: any) => {
					const startTime = new Date(record.startTime);
					const endTime = new Date(record.endTime);

					// Process each hour of the current day (0-23)
					for (let hour = 0; hour < 24; hour++) {
						const hourBlockKey = `${hour.toString().padStart(2, '0')}:00`;
						if (newDailyHourBlocks[hourBlockKey]) {
							// Create hour boundaries using the selected date (not the record's start date)
							const hourStart = new Date(selectedDate);
							hourStart.setHours(hour, 0, 0, 0);

							const hourEnd = new Date(selectedDate);
							hourEnd.setHours(hour + 1, 0, 0, 0);

							// Find the overlap between [startTime, endTime] and [hourStart, hourEnd]
							const overlapStart = startTime > hourStart ? startTime : hourStart;
							const overlapEnd = endTime < hourEnd ? endTime : hourEnd;

							// Calculate duration in seconds (will be 0 if no overlap)
							const overlapDuration = Math.max(0, (overlapEnd.getTime() - overlapStart.getTime()) / 1000);

							if (overlapDuration > 0) {
								newDailyHourBlocks[hourBlockKey].seconds += overlapDuration;
							}
						}
					}
				});

				// Update series data
				// Since series is reversed (12 AM at top), we need to reverse the index mapping
				Object.values(newDailyHourBlocks).forEach((dailyHourBlock: any, index: number) => {
					const reversedIndex = 23 - index; // Hour 0 -> index 23, Hour 23 -> index 0
					newSeries[reversedIndex].data[dayIndex] = dailyHourBlock.seconds;
				});
			}

			// Force re-render of heatmap
			apexchart.exec(chartId, 'updateSeries', newSeries);
			apexchart.exec(chartId, 'updateOptions', {
				tooltip: options.tooltip
			}, false, false);
			setSeries(newSeries);
		}
	}, [focusRecords, selectedDates]);

	return (
		<div className="relative">
			<ReactApexChart options={options} series={series} type="heatmap" height={310} />
			{(isLoading || isFetching) && (
				<div className="absolute top-3 right-3">
					<Spinner size="lg" />
				</div>
			)}
		</div>
	);
};

export default TimelineChart;
