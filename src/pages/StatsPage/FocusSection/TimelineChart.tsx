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

const TimelineChart = ({ selectedDates }) => {
	const { focusRecordsGroupedByDate } = useStatsContext();

	const [series, setSeries] = useState(
		Array.from({ length: 24 }, (_, i) => ({
			name: convertTo12HourFormat(`${i.toString().padStart(2, '0')}:00`),
			data: generateHourData(),
		}))
	);

	const chartId = 'timeline';

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
				shadeIntensity: 1,
				radius: 0,
				useFillColorAsStroke: true,
				colorScale: {
					ranges: [
						{ from: 0, to: 0, color: '#2f2f2f', name: '0m' }, // Adjusted for dark mode visibility
						{ from: 1, to: 600, color: '#dbeafe', name: '0m-10m' },
						{ from: 601, to: 1200, color: '#7dd3fc', name: '10m-20m' },
						{ from: 1201, to: 1800, color: '#60a5fa', name: '20m-30m' },
						{ from: 1801, to: 2400, color: '#3b82f6', name: '30m-40m' },
						{ from: 2401, to: 3000, color: '#2563eb', name: '40m-50m' },
						{ from: 3001, to: 3600, color: '#1d4ed8', name: '50m-60m' },
					],
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
			theme: 'dark', // Dark theme for tooltips
		},
		legend: {
			show: false,
		},
	};

	useEffect(() => {
		if (focusRecordsGroupedByDate) {
			const newSeries = [...series];

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
	}, [focusRecordsGroupedByDate]);

	return <ReactApexChart options={options} series={series} type="heatmap" height={310} />;
};

// Helper function to generate random data for each hour across the 7 days of the week
// Random data are scaled appropriately for demo purposes
function generateHourData() {
	return Array.from({ length: 7 }, () => 0);
}

export default TimelineChart;
