import classNames from 'classnames';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getAllDaysInMonthFromDate } from '../../../../utils/date.utils';
import { getFormattedDuration } from '../../../../utils/helpers.utils';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import Spinner from '../../../../components/Loaders/Spinner';
import { useGetStatsForInterval } from '../hooks/useGetStatsForInterval';
import { getStrokeWidthByDataLength } from '../../../../utils/chart.utils';

interface DurationChartDataItem {
	name: string;
	fullName: string;
	seconds: number;
	startTime?: string;
	endTime?: string;
}

const FocusDurationCurveCard = () => {
	// Use custom hook for focus stats with duration data type
	const {
		selectedInterval,
		setSelectedInterval,
		selectedIntervalOptions,
		selectedGroupedInterval,
		setSelectedGroupedInterval,
		selectedGroupedIntervalOptions,
		data,
		isLoading,
		isFetching,
		setIsModalPickDateRangeOpen,
		renderDateRangePicker,
		renderCustomDateModal,
	} = useGetStatsForInterval({
		dataType: 'duration',
		initialInterval: 'Month',
		initialDates: getAllDaysInMonthFromDate(new Date()),
		showRecordInterval: true,
	});


	const getAverage = () => {
		let totalSeconds = 0;
		let intervalsWithAtLeastOneFocusRecord = 0;

		const durationData = data as DurationChartDataItem[];
		durationData.forEach((day) => {
			const { seconds } = day;
			totalSeconds += seconds;

			if (seconds) {
				intervalsWithAtLeastOneFocusRecord += 1;
			}
		});

		const averageSeconds = totalSeconds / intervalsWithAtLeastOneFocusRecord;

		return `Average: ${getFormattedDuration(averageSeconds, false)}`;
	};

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px] text-[14px] sm:text-[16px] relative">
			<div className="flex justify-between items-center gap-1">
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-[16px]">Focus Durations Curve</h3>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<div className={classNames('flex gap-2 items-center', selectedInterval === 'All' && 'py-2')}>
					<GeneralSelectButtonAndDropdown
						selected={selectedGroupedInterval}
						setSelected={setSelectedGroupedInterval}
						selectedOptions={selectedGroupedIntervalOptions}
					/>

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

			<div className="text-color-gray-50 mb-2">{getAverage()}</div>

			<p className="sr-only">Area chart showing daily focus duration over the selected time period.</p>
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					width={500}
					height={400}
					data={data}
					margin={{
						top: 10,
						right: 30,
						left: (selectedInterval === 'All' || selectedInterval === 'Custom') ? 30 : 15,
						bottom: (selectedInterval === 'Week' || selectedInterval === 'Custom') ? 20 : 5,
					}}
				>
					<defs>
						<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="30%" stopColor={chosenColorObj.hexColor} stopOpacity={0.8} />
							<stop offset="95%" stopColor="black" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="5" strokeOpacity={0.3} stroke="var(--color-gray-25)" />

					<XAxis dataKey="name" dy={7} tick={{ fill: 'var(--color-gray-50)' }} />

					<YAxis
						dataKey="seconds"
						type="number"
						domain={['dataMin', 'dataMax']}
						tickFormatter={(seconds: number) => getFormattedDuration(seconds, false, true)}
						tick={{ fill: 'var(--color-gray-50)' }}
					/>
					<Tooltip
						offset={10}
						contentStyle={{
							backgroundColor: 'black',
						}}
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { fullName, name, seconds } = payload[0].payload as DurationChartDataItem;

								// For Records interval, show fullName (with time range) on separate lines
								if (selectedGroupedInterval === 'Records') {
									const lines = (fullName || name).split('\n');
									return (
										<div className={classNames(chosenColorObj.textColor, 'bg-black p-2 rounded-md')}>
											{lines.map((line: string, idx: number) => (
												<div key={idx}>{line}</div>
											))}
											<div className="font-bold">{getFormattedDuration(seconds, false)}</div>
										</div>
									);
								}

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
					<Area
						type="monotone"
						dataKey="seconds"
						stroke={chosenColorObj.hexColor}
						strokeWidth={getStrokeWidthByDataLength(data.length)}
						fill="url(#colorPv)"
					/>
				</AreaChart>
			</ResponsiveContainer>

			{renderCustomDateModal()}
		</div>
	);
};

export default FocusDurationCurveCard;
