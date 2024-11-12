import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Label, Tooltip } from 'recharts';
import GeneralSelectButtonAndDropdown from '../../GeneralSelectButtonAndDropdown';
import DateRangePicker from '../DateRangePicker';
import ModalPickDateRange from '../ModalPickDateRange';
import { useStatsContext } from '../../../../contexts/useStatsContext';
import { getFocusDurationFromArray, getFormattedDuration } from '../../../../utils/helpers.utils';
import classNames from 'classnames';
import CustomPieChartTooltip from './CustomPieChartTooltip';
import ProgressBarList from './ProgressBarList';
import { getDataByProjects, getDataByTags, getDataByTasks } from './getDataBy.util';

const noData = [
	{
		name: 'No Data',
		color: 'gray',
		value: 0,
		percentage: 100,
	},
];

const DetailsCard = () => {
	const {
		focusRecords,
		focusRecordsGroupedByDate,
		getFocusRecordsFromSelectedDates,
		tasksById,
		projectsById,
		tagsByRawName,
	} = useStatsContext();

	const [progressBarData, setProgressBarData] = useState(noData);

	const selectedOptions = ['Project', 'Task'];
	const [selected, setSelected] = useState(selectedOptions[0]);

	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
	const [selectedInterval, setSelectedInterval] = useState(selectedIntervalOptions[0]);
	const [selectedDates, setSelectedDates] = useState([new Date()]);
	const [focusDurationForInterval, setFocusDurationForInterval] = useState(0);

	// Custom
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	useEffect(() => {
		if (!focusRecords || !focusRecordsGroupedByDate || !projectsById || !tasksById) {
			return;
		}

		// Get all the completed tasks from the selected interval of dates
		const allFocusRecordsForInterval =
			selectedInterval === 'All' ? focusRecords : getFocusRecordsFromSelectedDates(selectedDates);
		const newFocusDurationForInterval = getFocusDurationFromArray(allFocusRecordsForInterval);

		let newProgressBarData = progressBarData;

		switch (selected) {
			case 'Project':
				newProgressBarData = getDataByProjects(
					allFocusRecordsForInterval,
					newFocusDurationForInterval,
					tasksById,
					projectsById
				);
				break;
			case 'Task':
				newProgressBarData = getDataByTasks(allFocusRecordsForInterval, newFocusDurationForInterval, tasksById);
				break;
			case 'Tag':
				newProgressBarData = getDataByTags(allFocusRecordsForInterval, newFocusDurationForInterval, tasksById);
				break;
		}

		if (!newFocusDurationForInterval) {
			setProgressBarData(noData);
		} else {
			setProgressBarData(newProgressBarData);
		}

		setFocusDurationForInterval(newFocusDurationForInterval);
	}, [
		focusRecords,
		focusRecordsGroupedByDate,
		selectedDates,
		projectsById,
		tagsByRawName,
		selected,
		selectedInterval,
		tasksById,
	]);

	const getPaddingAngle = () => {
		switch (selectedInterval) {
			case 'All':
				return 0.5;
			case 'Year':
				return 2;
			default:
				return 5;
		}
	};

	const getDateRangePicker = () => {
		return (
			selectedInterval !== 'All' && (
				<DateRangePicker
					selectedDates={selectedDates}
					setSelectedDates={setSelectedDates}
					selectedInterval={selectedInterval}
					startDate={startDate}
					endDate={endDate}
				/>
			)
		);
	};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-full">
			<div className="flex gap-4">
				<div className="flex justify-between items-center w-full">
					<h3 className="font-bold text-[16px] mb-3 sm:mb-0">Details</h3>

					<div className={classNames('flex items-center gap-4', selectedInterval === 'All' && 'py-2')}>
						<div className="flex gap-4">
							<GeneralSelectButtonAndDropdown
								selected={selected}
								setSelected={setSelected}
								selectedOptions={selectedOptions}
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
						</div>

						<div className="hidden sm:block">{getDateRangePicker()}</div>
					</div>
				</div>
			</div>

			<div className="sm:hidden mt-2">{getDateRangePicker()}</div>

			<div className="flex-1 mt-2 flex flex-col sm:flex-row items-center sm:gap-3 md:gap-10 px-4">
				<div>
					<PieChart width={220} height={220}>
						<Pie
							data={progressBarData}
							cx={100}
							cy={100}
							innerRadius={85}
							outerRadius={100}
							paddingAngle={getPaddingAngle()}
							dataKey="percentage"
						>
							{progressBarData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
							))}

							<Label
								position="center"
								fill="white"
								content={({ viewBox }) => {
									const { cx, cy } = viewBox;

									// In Recharts, the Label component inside a Pie (or other chart types) does not support rendering HTML elements such as <div> directly because it operates within an SVG context. This is why "svg" elements like "<text>" are used instead to display the HTML elements.

									return (
										<g>
											<text
												x={cx}
												y={cy - 10}
												fill="white"
												textAnchor="middle"
												dominantBaseline="central"
												className="text-[24px] font-bold"
											>
												{getFormattedDuration(focusDurationForInterval, false)}
											</text>
											<text
												x={cx}
												y={cy + 15}
												fill="#aaa"
												textAnchor="middle"
												dominantBaseline="central"
												className="text-[14px]"
											>
												Focus Duration
											</text>
										</g>
									);
								}}
							/>
						</Pie>

						<Tooltip content={<CustomPieChartTooltip active={false} payload={[]} />} />
					</PieChart>
				</div>

				<div className="sm:mt-3 flex flex-col gap-2 w-full">
					<ProgressBarList data={progressBarData} />
				</div>
			</div>

			<ModalPickDateRange
				isModalOpen={isModalPickDateRangeOpen}
				setIsModalOpen={setIsModalPickDateRangeOpen}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
			/>
		</div>
	);
};

export default DetailsCard;
