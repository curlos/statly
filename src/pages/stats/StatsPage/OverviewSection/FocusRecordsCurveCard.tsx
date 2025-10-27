import classNames from 'classnames';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useGetFocusStatsForInterval } from '../hooks/useGetFocusStatsForInterval';
import { getAllDaysInWeekFromDate } from '../../../../utils/date.utils';
import Spinner from '../../../../components/Loaders/Spinner';

const FocusRecordsCurveCard = () => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, hexColor } = chosenColorObj;

	// Use custom hook for focus stats with count data type
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
		shouldShowGroupedInterval,
	} = useGetFocusStatsForInterval({
		dataType: 'count',
		initialInterval: 'Week',
		initialDates: getAllDaysInWeekFromDate(new Date()),
	});

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-[16px]">Focus Records Curve</h3>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<div className={classNames('flex gap-2 items-center', selectedInterval === 'All' && 'py-2')}>
					{shouldShowGroupedInterval && (
						<GeneralSelectButtonAndDropdown
							selected={selectedGroupedInterval}
							setSelected={setSelectedGroupedInterval}
							selectedOptions={selectedGroupedIntervalOptions}
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

			<div className="sm:hidden mb-2">{renderDateRangePicker()}</div>

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
							<stop offset="30%" stopColor={hexColor} stopOpacity={0.8} />
							<stop offset="95%" stopColor="black" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="5" strokeOpacity={0.3} />
					<XAxis dataKey="name" dy={7} />
					<YAxis />
					<Tooltip
						offset={10}
						contentStyle={{
							backgroundColor: 'black',
						}}
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { name, fullName, score } = payload[0].payload;
								const nameToUse = fullName ? fullName : name;

								return (
									<div
										className={classNames(textColor, 'bg-black p-2 rounded-md')}
									>{`${nameToUse}, ${score.toLocaleString()}`}</div>
								);
							}

							return null;
						}}
					/>
					<Area type="monotone" dataKey="score" stroke={hexColor} strokeWidth={3} fill="url(#colorPv)" />
				</AreaChart>
			</ResponsiveContainer>

			{renderCustomDateModal()}
		</div>
	);
};

export default FocusRecordsCurveCard;
