import classNames from 'classnames';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar } from 'recharts';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getFormattedDuration } from '../../../../utils/focus-apps/helpers.utils';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import { useGetStatsForInterval } from '../hooks/useGetStatsForInterval';

const RecentFocusedDurationCurveCard = () => {
	const { selected, setSelected, selectedOptions, data } = useGetStatsForInterval('focusDuration');

	const themeContext = useThemeContext();
	const { chosenColorObj, nextLightestColorObj } = themeContext;
	const { textColor, hexColor } = chosenColorObj;

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center mb-6">
				<h3 className="font-bold text-[16px]">Recent Focused Duration Curve</h3>

				<GeneralSelectButtonAndDropdown
					selected={selected}
					setSelected={setSelected}
					selectedOptions={selectedOptions}
				/>
			</div>

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
					<YAxis dataKey="score" tickFormatter={(value) => `${getFormattedDuration(value, false)}`} />
					<Tooltip
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { name, fullName, score: seconds } = payload[0].payload;
								const nameToUse = fullName ? fullName : name;

								return (
									<div
										className={classNames(textColor, 'bg-black p-2 rounded-md')}
									>{`${nameToUse}, ${getFormattedDuration(seconds, false)}`}</div>
								);
							}

							return null;
						}}
					/>
					<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
					<Bar
						dataKey="score"
						fill={hexColor}
						background={{ fill: '#3a3a3a' }}
						activeBar={{ fill: nextLightestColorObj.hexColor, cursor: 'pointer' }}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default RecentFocusedDurationCurveCard;
