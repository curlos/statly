import classNames from 'classnames';
import { useState } from 'react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getAllDaysInWeekFromDate } from '../../../../utils/date.utils';
import { getFormattedDuration } from '../../../../utils/focus-apps/helpers.utils';
import { useGetFocusStatsQuery } from '../../../../services/resources/documentsStatsApi';
import { useFocusRecordsQueryParams } from '../../../../hooks/useFocusRecordsQueryParams';
import { useStatsDateRange } from '../../../../hooks/useStatsDateRange';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import Spinner from '../../../../components/Loaders/Spinner';

const TrendsCard = () => {
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
		initialInterval: 'Week',
		initialDates: getAllDaysInWeekFromDate(new Date()),
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
	const queryParams = useFocusRecordsQueryParams({
		'group-by': getGroupByParam(),
		'start-date': apiStartDate,
		'end-date': apiEndDate,
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

			return {
				name,
				seconds: item.duration
			};
		});
	};

	const data = transformDataForChart();

	const getStrokeWidth = () => {
		// Use thinner stroke for "Days" + large date ranges to handle many data points
		if (selectedGroupedInterval === 'Days' && selectedInterval === 'All') {
			return 0.5;
		}
		if (selectedGroupedInterval === 'Days' && selectedInterval === 'Year') {
			return 1;
		}
		return 2;
	};

	const getAverage = () => {
		let totalSeconds = 0;
		let daysWithAtLeastOneFocusRecord = 0;

		data.forEach((day) => {
			const { seconds } = day;
			totalSeconds += seconds;

			if (seconds) {
				daysWithAtLeastOneFocusRecord += 1;
			}
		});

		const averageSeconds = totalSeconds / daysWithAtLeastOneFocusRecord;

		return `Daily Average: ${getFormattedDuration(averageSeconds, false)}`;
	};

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px] text-[14px] sm:text-[16px]">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-[16px]">Trends</h3>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<div className={classNames('flex gap-2 items-center', selectedInterval === 'All' && 'py-2')}>
					{selectedInterval !== 'Week' && (
						<GeneralSelectButtonAndDropdown
							selected={selectedGroupedInterval}
							setSelected={setSelectedGroupedInterval}
							selectedOptions={
								selectedInterval === 'Month' ? ['Days', 'Weeks'] : selectedGroupedIntervalOptions
							}
						/>
					)}

					<GeneralSelectButtonAndDropdown
						selected={selectedInterval}
						setSelected={setSelectedInterval}
						selectedOptions={selectedIntervalOptions}
						onClick={(name) => {
							if (name?.toLowerCase() !== 'custom') {
								return;
							}

							setIsModalPickDateRangeOpen(true);
						}}
					/>

					<div className="hidden sm:block">{renderDateRangePicker()}</div>
				</div>
			</div>

			<div className="sm:hidden">{renderDateRangePicker()}</div>

			<div className="text-color-gray-100 mb-2">{getAverage()}</div>

			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					width={500}
					height={400}
					data={data}
					margin={{
						top: 10,
						right: 30,
						left: 0,
						bottom: 0,
					}}
				>
					<defs>
						<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="30%" stopColor={chosenColorObj.hexColor} stopOpacity={0.8} />
							<stop offset="95%" stopColor="black" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="5" strokeOpacity={0.3} />

					<XAxis dataKey="name" dy={7} />

					<YAxis
						dataKey="seconds"
						type="number"
						domain={['dataMin', 'dataMax']}
						tickFormatter={(seconds) => getFormattedDuration(seconds, false, false)}
					/>
					<Tooltip
						offset={10}
						contentStyle={{
							backgroundColor: 'black',
						}}
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { name, seconds } = payload[0].payload;
								return (
									<div
										className={classNames(chosenColorObj.textColor, 'bg-black p-2 rounded-md')}
									>{`${name}, ${getFormattedDuration(seconds, false)}`}</div>
								);
							}

							return null;
						}}
					/>
					<Area
						type="monotone"
						dataKey="seconds"
						stroke={chosenColorObj.hexColor}
						strokeWidth={getStrokeWidth()}
						fill="url(#colorPv)"
					/>
				</AreaChart>
			</ResponsiveContainer>

			{renderCustomDateModal()}
		</div>
	);
};

export default TrendsCard;
