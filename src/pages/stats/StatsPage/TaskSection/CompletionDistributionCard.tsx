import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar } from 'recharts';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useStatsContext } from '../../../../contexts/useStatsContext';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import {
	getAllDaysInRange,
	getLast7Days,
	getFormattedShortMonthDay,
	getAllDaysInWeekFromDate,
	getAllDaysInMonthFromDate,
	getAllDaysInYearFromDate,
	getFormattedLongDay,
} from '../../../../utils/date.utils';

const CompletionDistributionCard = () => {
	const { completedTasksGroupedByDate } = useStatsContext();

	getAllDaysInRange();

	const lastSevenDays = getLast7Days();
	const defaultData = lastSevenDays.map((day) => ({
		name: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
		completedTasks: 0,
	}));

	const [data, setData] = useState(defaultData);

	const themeContext = useThemeContext();
	const { chosenColorObj, nextLightestColorObj } = themeContext;

	const { searchParams } = useSearchParamsContext();
	const startDateFromUrl = searchParams.get('start-date') || 'Jan 1, 1900';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const intervalFromUrl = searchParams.get('date-interval') || 'All';

	useEffect(() => {
		if (!completedTasksGroupedByDate) {
			return;
		}

		const selectedDates = getSelectedDates(new Date(startDateFromUrl), new Date(endDateFromUrl));
		const newData = getCompletedTasksData(selectedDates);

		setData(newData);
	}, [completedTasksGroupedByDate, startDateFromUrl, endDateFromUrl, intervalFromUrl]);

	const getSelectedDates = (startDate, endDate) => {
		switch (intervalFromUrl) {
			case 'Day':
				return [startDate];
			case 'Week':
				return getAllDaysInWeekFromDate(startDate);
			case 'Month':
				return getAllDaysInMonthFromDate(startDate);
			case 'Year':
				return getAllDaysInYearFromDate(startDate);
			case 'Custom':
				return getAllDaysInRange(startDate, endDate);
			default:
				return [];
		}
	};

	const getCompletedTasksData = (selectedDates) => {
		if (intervalFromUrl === 'All') {
			const completedTaskDateKeys = Object.keys(completedTasksGroupedByDate);
			completedTaskDateKeys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

			return completedTaskDateKeys.map((dateKey) => {
				const date = new Date(dateKey);
				const completedTasksForDateArr = completedTasksGroupedByDate[dateKey] || [];

				const dayShortName = date.toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
				});
				const dayLongName = date.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				});

				return {
					name: dayShortName,
					fullName: dayLongName,
					completedTasks: completedTasksForDateArr.length,
				};
			});
		}

		return selectedDates.map((date) => {
			const dateKey = getFormattedLongDay(date);
			const completedTasksForDateArr = completedTasksGroupedByDate[dateKey] || [];

			const dayShortName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
			const dayLongName = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

			return {
				name: dayShortName,
				fullName: dayLongName,
				completedTasks: completedTasksForDateArr.length,
			};
		});
	};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[280px]">
			<div className="flex justify-between items-center mb-6">
				<h3 className="font-bold text-[16px]">Completion Distribution</h3>
			</div>

			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					width={512}
					height={210}
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
					<YAxis dataKey="completedTasks" tickFormatter={(value) => `${value}`} />
					<Tooltip
						content={({ payload }) => {
							// "payload" property is an empty array if the tooltip is not active. Otherwise, if it is active, then it'll show an element in the "payload" array.
							if (payload && payload[0]) {
								const { name, fullName, completedTasks } = payload[0].payload;
								const nameToUse = fullName || name;

								return (
									<div
										className={classNames(chosenColorObj.textColor, 'bg-black p-2 rounded-md')}
									>{`${nameToUse}, ${completedTasks}`}</div>
								);
							}

							return null;
						}}
					/>
					<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
					<Bar
						dataKey="completedTasks"
						fill={chosenColorObj.hexColor}
						background={{ fill: '#3a3a3a' }}
						activeBar={{ fill: nextLightestColorObj.hexColor, cursor: 'pointer' }}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default CompletionDistributionCard;
