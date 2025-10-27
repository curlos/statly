import classNames from 'classnames';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar } from 'recharts';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { convertTo12HourFormat, getAllDaysInMonthFromDate } from '../../../../utils/date.utils';
import { getFormattedDuration } from '../../../../utils/focus-apps/helpers.utils';
import { useGetFocusStatsQuery } from '../../../../services/resources/documentsStatsApi';
import { useFocusRecordsQueryParams } from '../../../../hooks/useFocusRecordsQueryParams';
import { useStatsDateRange } from '../../../../hooks/useStatsDateRange';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import Spinner from '../../../../components/Loaders/Spinner';

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
	const { chosenColorObj, nextLightestColorObj } = themeContext;

	// Build query params for API using custom hook
	const queryParams = useFocusRecordsQueryParams({
		'group-by': 'hour',
		'start-date': apiStartDate,
		'end-date': apiEndDate,
	});

	// Fetch stats from API
	const { data: statsData, isLoading, isFetching } = useGetFocusStatsQuery(queryParams);

	// Transform API data to chart format
	const data = (statsData?.byHour || []).map((hourData: any) => ({
		name: convertTo12HourFormat(`${hourData.hour.toString().padStart(2, '0')}:00`),
		seconds: hourData.duration
	}));

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-[16px]">Most Focused Time</h3>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<div className="flex items-center gap-2">
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

			<div className="w-full h-full text-[12px] sm:text-[14px] md:text-[16px]">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						width={500}
						height={300}
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
						barSize={10}
					>
						<XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} dy={7} />
						<YAxis
							dataKey="seconds"
							type="number"
							domain={['dataMin', 'dataMax']}
							tickFormatter={(value) => `${getFormattedDuration(value, false)}`}
						/>
						<Tooltip
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
						<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
						<Bar
							dataKey="seconds"
							fill={chosenColorObj.hexColor}
							background={{ fill: '#3a3a3a' }}
							// TODO: Write function to get a slightly lighter color to show on hover/active.
							activeBar={{ fill: nextLightestColorObj.hexColor, cursor: 'pointer' }}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>

			{renderCustomDateModal()}
		</div>
	);
};

export default MostFocusedTimeCard;
