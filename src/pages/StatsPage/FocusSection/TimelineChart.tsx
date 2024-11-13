import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import {
	convertTo12HourFormat,
	fillInHourBlocksWithSeconds,
	getDailyHourBlocks,
	getFormattedLongDay,
} from '../../../utils/date.utils';
import { useStatsContext } from '../../../contexts/useStatsContext';
import apexchart from 'apexcharts';
import { getFormattedDuration } from '../../../utils/helpers.utils';
import { useThemeContext } from '../../ticktick-1.00/focus-records/useThemeContext';

const TimelineChart = ({ selectedDates }) => {
	const { focusRecordsGroupedByDate } = useStatsContext();

	const DEFAULT_SERIES = Array.from({ length: 24 }, (_, i) => ({
		name: convertTo12HourFormat(`${i.toString().padStart(2, '0')}:00`),
		data: generateHourData(),
	}));

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

	console.log(getColorScaleRanges());

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
			y: {
				formatter: (value, series) => {
					return getFormattedDuration(value, false);
				},
			},
		},
		legend: {
			show: false,
		},
	};

	useEffect(() => {
		if (focusRecordsGroupedByDate) {
			const newSeries = DEFAULT_SERIES;

			// For all 7 days of the week, go through each day and for each day go through each hour block in its 24 hours. Check the focus records for that day and determine how much time was filled up in each hour block out of a potential full hour. For example, 7:00PM could have a maximum of 3,600 seconds (1 hour).
			for (let dayIndex = 0; dayIndex < selectedDates.length; dayIndex++) {
				const selectedDate = selectedDates[dayIndex];
				const dateKey = getFormattedLongDay(selectedDate);
				const focusRecordsForTheDay = focusRecordsGroupedByDate[dateKey];

				// Go through all the focus records. For each focus record, split it up into hour blocks.
				const newDailyHourBlocks = getDailyHourBlocks();

				if (focusRecordsForTheDay) {
					fillInHourBlocksWithSeconds(focusRecordsForTheDay, newDailyHourBlocks);

					Object.values(newDailyHourBlocks).forEach((dailyHourBlock, index) => {
						newSeries[index].data[dayIndex] = dailyHourBlock.seconds;
					});
				}
			}

			// This is necessary because just changing the "series" unfortunately will not re-render the heatmap with the updated data. So, it has to be forcibly done here.
			apexchart.exec(chartId, 'updateSeries', newSeries);

			setSeries(newSeries);
		}
	}, [focusRecordsGroupedByDate, selectedDates]);

	return <ReactApexChart options={options} series={series} type="heatmap" height={310} />;
};

// Helper function to generate random data for each hour across the 7 days of the week
// Random data are scaled appropriately for demo purposes
function generateHourData() {
	return Array.from({ length: 7 }, () => 0);
}

export default TimelineChart;
