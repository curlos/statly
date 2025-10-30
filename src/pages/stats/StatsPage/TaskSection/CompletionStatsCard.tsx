import classNames from 'classnames';
import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Label, Tooltip } from 'recharts';
import Icon from '../../../../components/Icon';
import Modal from '../../../../components/Modal/Modal';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useGetTasksStatsQuery } from '../../../../services/resources/documentsStatsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import { useStatsDateRange } from '../../../../hooks/useStatsDateRange';
import GeneralSelectButtonAndDropdown from '../GeneralSelectButtonAndDropdown';
import CustomPieChartTooltip from '../FocusSection/DetailsCard/CustomPieChartTooltip';
import ProgressBarList from '../FocusSection/DetailsCard/ProgressBarList';
import { useGetProjectsQuery } from '../../../../services/resources/documentsProjectsApi';
import Spinner from '../../../../components/Loaders/Spinner';
import { groupTasksByParent } from '../../../../utils/taskGrouping.utils';
import { aggregateNestedTasksByParent } from '../../../../utils/nestedTaskAggregation.utils';
import { getPieChartPaddingAngle } from '../../../../utils/pieChart.utils';

const noData = [
	{
		name: 'No Data',
		color: 'gray',
		value: 0,
		percentage: 100,
		id: 'No Data',
	},
];

const CompletionStatsCard = () => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { hover } = chosenColorObj;

	const selectedOptions = ['Project', 'Task'];
	const [selected, setSelected] = useState(selectedOptions[0]);

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
		initialInterval: 'Day',
		initialDates: [new Date()],
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showNestedProgressBars, setShowNestedProgressBars] = useState(false);
	const [sortBy, setSortBy] = useState('Tasks: Most-Least');

	// Build query params for API using custom hook
	const queryParams = useStatsQueryParams({
		'group-by': selected === 'Project' ? 'project' : 'task',
		'interval-start-date': apiStartDate,
		'interval-end-date': apiEndDate,
		'nested': showNestedProgressBars,
	});

	// Fetch metadata needed for ProgressBar navigation
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	// Fetch stats from API
	const { data: statsData, isLoading, isFetching } = useGetTasksStatsQuery(queryParams);
	const { ancestorTasksById } = statsData || {};

	// Extract and process data from API response
	const { progressBarData, aggregationResults } = useMemo(() => {
		let data = selected === 'Project'
			? statsData?.byProject?.length > 0 ? statsData?.byProject : noData
			: (statsData?.byTask?.length > 0 ? statsData?.byTask : noData);

		let aggregationResults = null;

		// Group tasks by parent based on view mode
		if (selected === 'Task' && ancestorTasksById && data[0]?.id !== 'No Data') {
			const totalCount = statsData?.summary?.totalCount || 1;

			if (showNestedProgressBars) {
				// Use recursive aggregation for nested view (shows top-level parents with all descendants)
				aggregationResults = aggregateNestedTasksByParent(
					data,
					ancestorTasksById,
					totalCount,
					'count',
					projectsById
				);
				data = aggregationResults.aggregatedData;
			} else {
				// Use simple flat aggregation for non-nested view
				data = groupTasksByParent(data, ancestorTasksById, totalCount, 'count');
			}
		}

		// For Project view with nested progress bars, calculate aggregation from tasks
		if (selected === 'Project' && showNestedProgressBars && ancestorTasksById && statsData?.byTask) {
			const taskData = statsData.byTask;
			const totalCount = statsData?.summary?.totalCount || 1;

			if (taskData.length > 0) {
				// Calculate aggregation results from task data
				aggregationResults = aggregateNestedTasksByParent(
					taskData,
					ancestorTasksById,
					totalCount,
					'count',
					projectsById
				);
			}
		}

		// Add project names and colors
		if (data && data[0]?.id !== 'No Data') {
			data = [...data].map((item) => {
				const projectId = item.type === 'project' ? item.id : item.projectId

				const name = item.type === 'project' ? projectsById && projectsById[projectId]?.name : item.name
				const color = projectsById && projectsById[projectId]?.color ? projectsById[projectId].color : '#808080'

				return {
					...item,
					name,
					color
				}
			})
		}

		return { progressBarData: data, aggregationResults };
	}, [statsData, selected, showNestedProgressBars, ancestorTasksById, projectsById]);

	const totalCompletedTasks = statsData?.summary?.totalCount || 0;

	const getCoreDetailsCard = (fromModal) => {
		return (
			<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-full relative">
				<div className="flex gap-4">
					<div className="md:flex justify-between items-center w-full">
						<div className="flex items-center gap-2 mb-3 sm:mb-0">
							<h3 className="font-bold text-[16px]">Completion Stats</h3>
							{(isLoading || isFetching) && <Spinner size="md" />}
						</div>

						<div className={classNames('flex items-center gap-2', selectedInterval === 'All' && 'py-2')}>
							<div className="flex items-center gap-2">
								<Icon
									name={showNestedProgressBars ? 'unknown_med' : 'network_node'}
									fill={0}
									customClass={classNames(
										'text-color-gray-50 !text-[20px] cursor-pointer border border-color-gray-100 rounded-2xl bg-color-gray-300 p-[6px]',
										`${hover.textColor} ${hover.borderColor}`
									)}
									onClick={() => setShowNestedProgressBars(!showNestedProgressBars)}
								/>

								<Icon
									name="swap_vert"
									fill={0}
									customClass={classNames(
										'text-color-gray-50 !text-[20px] cursor-pointer border border-color-gray-100 rounded-2xl bg-color-gray-300 p-[6px]',
										`${hover.textColor} ${hover.borderColor}`
									)}
									onClick={() =>
										setSortBy(
											sortBy === 'Tasks: Most-Least'
												? 'Tasks: Least-Most'
												: 'Tasks: Most-Least'
										)
									}
								/>

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

							<div className="hidden sm:block">{renderDateRangePicker()}</div>
						</div>
					</div>
				</div>

				<div className="sm:hidden mt-2">{renderDateRangePicker()}</div>

				<div className="flex-1 mt-2 flex flex-col sm:flex-row items-center sm:gap-3 md:gap-10 md:px-1">
					<div>
						<PieChart width={220} height={220}>
							<Pie
								data={progressBarData}
								cx={100}
								cy={100}
								innerRadius={85}
								outerRadius={100}
								paddingAngle={getPieChartPaddingAngle(progressBarData.length)}
								dataKey="percentage"
							>
								{progressBarData.map((entry, index) => (
									<Cell
										key={entry.id ? `${entry.id}-index` : index}
										fill={entry.color}
										stroke="none"
									/>
								))}

								<Label
									position="center"
									fill="white"
									content={({ viewBox }: any) => {
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
													{totalCompletedTasks.toLocaleString()}
												</text>
												<text
													x={cx}
													y={cy + 15}
													fill="#aaa"
													textAnchor="middle"
													dominantBaseline="central"
													className="text-[14px]"
												>
													Completed Tasks
												</text>
											</g>
										);
									}}
								/>
							</Pie>

							<Tooltip content={<CustomPieChartTooltip active={false} payload={[]} />} />
						</PieChart>
					</div>

					<div className="sm:mt-3 flex flex-col gap-2 w-full min-w-0">
						<ProgressBarList
							data={progressBarData as any}
							dataByTasks={statsData?.byTask as any}
							dataType={selected as any}
							fromModal={fromModal}
							isModalOpen={isModalOpen}
							setIsModalOpen={setIsModalOpen as any}
							focusDurationForInterval={totalCompletedTasks as any}
							sortBy={sortBy as any}
							showNestedProgressBars={showNestedProgressBars as any}
							ancestorTasksById={ancestorTasksById as any}
							metricType="count"
							aggregationResults={aggregationResults as any}
							intervalStartDate={apiStartDate}
							intervalEndDate={apiEndDate}
						/>
					</div>
				</div>

				{renderCustomDateModal()}
			</div>
		);
	};

	return (
		<div className="h-full">
			<div className="h-full">{getCoreDetailsCard(false)}</div>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				positionClasses="top-center"
				customClasses="!w-[1000px]"
			>
				<div className="rounded-xl shadow-lg bg-color-gray-600 p-2">{getCoreDetailsCard(isModalOpen)}</div>
			</Modal>
		</div>
	);
};

export default CompletionStatsCard;
