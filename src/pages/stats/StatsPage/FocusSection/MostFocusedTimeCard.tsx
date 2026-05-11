import classNames from 'classnames';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar } from 'recharts';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { convertTo12HourFormat, getAllDaysInMonthFromDate } from '../../../../utils/date.utils';
import { getFormattedDuration } from '../../../../utils/helpers.utils';
import { useGetFocusStatsQuery } from '../../../../services/resources/statsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import { useStatsDateRange } from '../../../../hooks/useStatsDateRange';
import { useApplyDefaultDateRangeContext } from '../../../../contexts/useApplyDefaultDateRangeContext';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import Spinner from '../../../../components/Loaders/Spinner';
import type { StatsByHourItem } from '../../../../types/api';

const MostFocusedTimeCard = () => {
	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];

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
		initialInterval: 'Month',
		initialDates: getAllDaysInMonthFromDate(new Date()),
	});

	const themeContext = useThemeContext();
	const { chosenColorObj, nextLightestColorObj, colorMode } = themeContext;

	// Build query params for API using custom hook
	const queryParams = useStatsQueryParams({
		'group-by': 'hour',
		'interval-start-date': apiStartDate ?? undefined,
		'interval-end-date': apiEndDate ?? undefined,
	});

	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();

	// Fetch stats from API
	const { data: statsData, isLoading, isFetching } = useGetFocusStatsQuery(queryParams, {
		skip: shouldSkipQuery
	});

	// Transform API data to chart format
	const data = (statsData?.byHour || []).map((hourData: StatsByHourItem) => ({
		name: convertTo12HourFormat(`${hourData.hour.toString().padStart(2, '0')}:00`),
		seconds: hourData.duration
	}));

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[380px] text-[12px] sm:text-[14px] md:text-[16px] relative">
			<div className={classNames("flex justify-between items-center", selectedInterval === 'All' && 'mb-6')}>
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-[16px]">Most Focused Time</h3>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<div className="flex items-center gap-2">
					<GeneralSelectButtonAndDropdown
						selected={selectedInterval}
						setSelected={setSelectedInterval}
						selectedOptions={selectedIntervalOptions}
						align="right"
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

			<div className="flex-1 min-h-0">
				<p className="sr-only">Bar chart showing focus duration by hour of day, indicating the most productive times.</p>
				<ResponsiveContainer width="100%" height="100%">
				<BarChart
					width={500}
					data={data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
					barSize={10}
				>
					<XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} dy={7} minTickGap={20} tick={{ fill: 'var(--color-gray-50)' }} />
					<YAxis
						dataKey="seconds"
						type="number"
						domain={['dataMin', 'dataMax']}
						tickFormatter={(value) => `${getFormattedDuration(value, false)}`}
						tick={{ fill: 'var(--color-gray-50)' }}
					/>
					<Tooltip
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { name, seconds } = payload[0].payload;
								return (
									<div className={classNames(chosenColorObj.textColor, 'bg-black p-2 rounded-md')}>
										<div>{name}</div>
										<div className="font-bold">{getFormattedDuration(seconds, false)}</div>
									</div>
								);
							}

							return null;
						}}
					/>
					<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
					<Bar
						dataKey="seconds"
						fill={chosenColorObj.hexColor}
						background={{ fill: colorMode === 'dark' ? '#3a3a3a' : '#c9c9c9' }}
						// TODO: Write function to get a slightly lighter color to show on hover/active.
						activeBar={{ fill: nextLightestColorObj?.hexColor || chosenColorObj.hexColor, cursor: 'pointer' }}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>

			{renderCustomDateModal()}
		</div>
	);
};

export default MostFocusedTimeCard;
