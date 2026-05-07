import classNames from 'classnames';
import { useState, useMemo, useRef } from 'react';
import { PieChart, Pie, Cell, Label, Tooltip } from 'recharts';
import Icon from '../../../../../components/Icon';
import Modal from '../../../../../components/Modal/Modal';
import { useThemeContext } from '../../../../../contexts/useThemeContext';
import { getFormattedDuration } from '../../../../../utils/helpers.utils';
import { useGetFocusStatsQuery } from '../../../../../services/resources/statsApi';
import { useStatsQueryParams } from '../../../../../hooks/useStatsQueryParams';
import { useStatsDateRange } from '../../../../../hooks/useStatsDateRange';
import { useApplyDefaultDateRangeContext } from '../../../../../contexts/useApplyDefaultDateRangeContext';
import GeneralSelectButtonAndDropdown from '../../GeneralSelectButtonAndDropdown';
import CustomPieChartTooltip from './CustomPieChartTooltip';
import ProgressBarList from './ProgressBarList';
import { useGetProjectsQuery } from '../../../../../services/resources/projectsApi';
import Spinner from '../../../../../components/Loaders/Spinner';
import { getPieChartPaddingAngle } from '../../../../../utils/pieChart.utils';
import { aggregateNestedTasksByParent } from '../../../../../utils/nestedTaskAggregation.utils';
import { EMOTIONS } from '../../../../../utils/constants/constants.utils';
import type { AggregationResults, ProgressBarItemData } from '../../../../../types/stats';
import { sourceToAppName } from '../../../../../utils/focusRecords.utils';

const noData = [
	{
		name: 'No Data',
		color: 'var(--color-gray-100)',
		duration: 0,
		percentage: 100,
		id: 'No Data',
		type: undefined as 'project' | 'task' | 'emotion' | undefined,
		projectId: undefined as string | undefined,
	},
];

const DetailsCard = () => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { hover } = chosenColorObj;

	const selectedOptions = ['Project', 'Task', 'Emotion'];
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
	const [sortBy, setSortBy] = useState('Focus Time: Most-Least');

	const scrollableContainerRef = useRef<HTMLDivElement>(null);

	// Build query params for API using custom hook
	const getGroupBy = () => {
		if (selected === 'Project') return 'project';
		if (selected === 'Task') return 'task';
		if (selected === 'Emotion') return 'emotion';
		return 'project';
	};

	const queryParams = useStatsQueryParams({
		'group-by': getGroupBy(),
		'interval-start-date': apiStartDate ?? undefined,
		'interval-end-date': apiEndDate ?? undefined,
		'nested': showNestedProgressBars,
	});

	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();

	// Fetch metadata needed for ProgressBar navigation
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	// Fetch stats from API
	const { data: statsData, isLoading, isFetching } = useGetFocusStatsQuery(queryParams, {
		skip: shouldSkipQuery
	});
	const { ancestorTasksById } = statsData || {}

	const focusDurationForInterval = statsData?.summary?.totalDuration || 0;

	// Extract and process data from API response
	const { progressBarData, aggregationResults } = useMemo(() => {
		let data: ProgressBarItemData[];
		if (selected === 'Project') {
			data = (statsData?.byProject && statsData.byProject.length > 0) ? statsData.byProject : noData;
		} else if (selected === 'Task') {
			data = (statsData?.byTask && statsData.byTask.length > 0) ? statsData.byTask : noData;
		} else if (selected === 'Emotion') {
			data = (statsData?.byEmotion && statsData.byEmotion.length > 0) ? statsData.byEmotion : noData;
		} else {
			data = noData;
		}

		let aggregationResults: AggregationResults | Record<string, AggregationResults> | undefined = undefined;

		// Group tasks by parent based on view mode
		if (selected === 'Task' && showNestedProgressBars && ancestorTasksById && data[0]?.id !== 'No Data') {
			const totalDuration = statsData?.summary?.totalDuration || 1;

			const result = aggregateNestedTasksByParent(
				data,
				ancestorTasksById,
				totalDuration,
				'duration',
				projectsById,
				focusDurationForInterval
			) as AggregationResults;
			aggregationResults = result;
			data = result.aggregatedData || [];
		}

		// For Project view with nested progress bars, calculate aggregation from tasks
		if (selected === 'Project' && showNestedProgressBars && ancestorTasksById && statsData?.byTask) {
			const taskData = statsData.byTask;
			const totalDuration = statsData?.summary?.totalDuration || 1;

			if (taskData.length > 0) {
				// Calculate aggregation results from task data
				const result = aggregateNestedTasksByParent(
					taskData,
					ancestorTasksById,
					totalDuration,
					'duration',
					projectsById,
					focusDurationForInterval
				) as AggregationResults;
				aggregationResults = result;
			}
		}

		// For Emotion view with nested progress bars, calculate aggregation from emotion-specific tasks
		if (selected === 'Emotion' && showNestedProgressBars && statsData?.byEmotionWithTasks) {
			const aggregationResultsByEmotion: Record<string, AggregationResults> = {};
			const byEmotionWithTasks = statsData.byEmotionWithTasks;

			// Process each emotion's data separately
			Object.keys(byEmotionWithTasks).forEach(emotionId => {
				const emotionData = byEmotionWithTasks[emotionId];
				const emotionTaskData = emotionData.byTask;
				const emotionAncestorTasksById = emotionData.ancestorTasksById;

				const totalDuration = statsData?.summary?.totalDuration || 1;

				if (emotionTaskData && emotionTaskData.length > 0) {
					const result = aggregateNestedTasksByParent(
						emotionTaskData,
						emotionAncestorTasksById,
						totalDuration,
						'duration',
						projectsById,
						totalDuration
					) as AggregationResults;
					aggregationResultsByEmotion[emotionId] = result;
				}
			});

			// Store as object instead of single aggregationResults
			aggregationResults = aggregationResultsByEmotion;
		}

		// Add project/task/emotion names and colors
		if (data && data[0]?.id !== 'No Data') {
			data = [...data].map((item) => {
				// Handle emotion type
				if (item.type === 'emotion') {
					const emotionId = item.id as keyof typeof EMOTIONS;
					const emotion = EMOTIONS[emotionId];
					return {
						...item,
						name: emotion?.name || item.name,
						color: emotion?.hex || 'bg-gray-500/70'
					};
				}

				// Handle project/task types
				const projectId = item.type === 'project' ? item.id : (item.projectId || '');

				let name = item.type === 'project' ? projectsById && (projectsById[projectId]?.name || projectId) : item.name

				// If no projectName, it's from a non-TickTick/Session app - use the app name
				if (name && name in sourceToAppName) {
					name = sourceToAppName[projectId] || 'Inbox';
				}

				const color = projectsById && projectsById[projectId]?.color ? projectsById[projectId].color : '#808080'

				return {
					...item,
					name,
					color
				}
			})
		}

		return { progressBarData: data, aggregationResults };
	}, [statsData, selected, showNestedProgressBars, ancestorTasksById, projectsById, focusDurationForInterval]);

	const getCoreDetailsCard = (fromModal: boolean) => {
		return (
			<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-full relative">
				<div className="flex gap-4">
					<div className="md:flex justify-between items-center gap-2 w-full">
						<div className="flex items-center gap-2 mb-3 sm:mb-0">
							<h3 className="font-bold text-[16px]">Details</h3>
							{(isLoading || isFetching) && <Spinner size="md" />}

							{fromModal && (
								<Icon
									name="close"
									fill={0}
									customClass={classNames(
										'text-color-gray-50 !text-[22px] cursor-pointer rounded-2xl p-[6px] ml-auto sm:invisible',
										`${hover.textColor}`
									)}
									onClick={() => setIsModalOpen(false)}
								/>
							)}
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
											sortBy === 'Focus Time: Most-Least'
												? 'Focus Time: Least-Most'
												: 'Focus Time: Most-Least'
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
									align="right"
								/>
							</div>

							<div className="hidden sm:block">{renderDateRangePicker()}</div>
						</div>
					</div>
				</div>

				<div className="sm:hidden mt-2">{renderDateRangePicker()}</div>

				<div className="flex-1 mt-2 flex flex-col sm:flex-row items-center sm:gap-3 md:gap-10 md:px-4">
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
								{progressBarData.map((entry: { id: string; color?: string }, index: number) => (
									<Cell
										key={entry.id ? `${entry.id}-index` : index}
										fill={entry.color}
										stroke="none"
									/>
								))}

								<Label
									position="center"
									fill="white"
									content={(props: { viewBox?: unknown }) => {
										const viewBox = props.viewBox as { cx?: number; cy?: number } | undefined;
										if (!viewBox || !viewBox.cx || !viewBox.cy) return null;
										const { cx, cy } = viewBox;

										// In Recharts, the Label component inside a Pie (or other chart types) does not support rendering HTML elements such as <div> directly because it operates within an SVG context. This is why "svg" elements like "<text>" are used instead to display the HTML elements.

										return (
											<g>
												<text
													x={cx}
													y={cy - 10}
													fill="var(--color-primary-text)"
													textAnchor="middle"
													dominantBaseline="central"
													className="text-[24px] font-bold"
												>
													{getFormattedDuration(focusDurationForInterval, false)}
												</text>
												<text
													x={cx}
													y={cy + 15}
													fill="var(--color-gray-25)"
													textAnchor="middle"
													dominantBaseline="central"
													className="text-[14px]"
												>
													Focus Time
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
						<ProgressBarList
							data={progressBarData}
							dataByTasks={statsData?.byTask}
							dataType={selected}
							fromModal={fromModal}
							setIsModalOpen={setIsModalOpen}
							focusDurationForInterval={focusDurationForInterval}
							sortBy={sortBy}
							showNestedProgressBars={showNestedProgressBars}
							ancestorTasksById={ancestorTasksById}
							aggregationResults={aggregationResults}
							intervalStartDate={apiStartDate ?? ''}
							intervalEndDate={apiEndDate ?? ''}
							byEmotionWithTasks={statsData?.byEmotionWithTasks}
							scrollableContainerRef={scrollableContainerRef}
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
				customClasses="!w-[1000px]"
				contentRef={scrollableContainerRef}
			>
				<div className="rounded-xl shadow-lg bg-color-gray-600">{getCoreDetailsCard(isModalOpen)}</div>
			</Modal>
		</div>
	);
};

export default DetailsCard;
