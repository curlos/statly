import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import ProgressBar from '../ProgressBar';
import { useGetProjectsQuery } from '../../../../../services/resources/projectsApi';
import NestedProgressBars from './NestedProgressBars';
import Accordion from '../../../../../components/Accordion/Accordion';
import Pagination from '../../../../../components/Pagination';
import { getFormattedDuration } from '../../../../../utils/helpers.utils';
import type { ProgressBarItemData, AggregationResults, EmotionProgressBarData } from '../../../../../types/stats';
import type { AncestorTask } from '../../../../../types/api';
import { sourceToAppName } from '../../../../../utils/focusRecords.utils';

interface ProgressBarListProps {
	data: ProgressBarItemData[];
	dataByTasks?: ProgressBarItemData[];
	dataType: string;
	fromModal: boolean;
	setIsModalOpen: (open: boolean) => void;
	focusDurationForInterval: number;
	sortBy: string;
	showNestedProgressBars?: boolean;
	ancestorTasksById?: Record<string, AncestorTask>;
	metricType?: 'duration' | 'count';
	aggregationResults?: AggregationResults | Record<string, AggregationResults>;
	intervalStartDate: string;
	intervalEndDate: string;
	byEmotionWithTasks?: Record<string, EmotionProgressBarData>;
}

const ProgressBarList: React.FC<ProgressBarListProps> = ({
	data,
	dataByTasks,
	dataType,
	fromModal,
	setIsModalOpen,
	focusDurationForInterval,
	sortBy,
	showNestedProgressBars,
	ancestorTasksById,
	metricType = 'duration',
	aggregationResults,
	intervalStartDate,
	intervalEndDate,
	byEmotionWithTasks
}) => {
	// Pagination state for modal view
	const [currentPage, setCurrentPage] = useState(1);
	const scrollableContainerRef = useRef<HTMLDivElement>(null);

	// Fetch metadata needed for ProgressBar navigation
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById, projectsSessionById } = fetchedProjects || {};

	// Session categories are stored as projects with source='ProjectSession'
	const sessionCategoriesById = projectsSessionById || {};

	const isFocusDuration = metricType === 'duration';
	const metricKey = isFocusDuration ? 'duration' : 'count';

	// Data is already grouped by parent in CompletionStatsCard for completed tasks
	// So we just sort and display it here
	const sortedData = [...data].sort((a: ProgressBarItemData, b: ProgressBarItemData) => {
		// Primary sort: by metric value
		const valueA = (a[metricKey] as number) || 0;
		const valueB = (b[metricKey] as number) || 0;
		const metricDiff = sortBy === 'Focus Time: Most-Least' || sortBy === 'Tasks: Most-Least'
			? valueB - valueA
			: valueA - valueB;

		// If metrics are equal, sort alphabetically by name
		if (metricDiff === 0) {
			const nameA = (a.name || '').toLowerCase();
			const nameB = (b.name || '').toLowerCase();
			return nameA.localeCompare(nameB);
		}

		return metricDiff;
	});

	// Reset to page 1 when sorting changes or data length changes
	useEffect(() => {
		setCurrentPage(1);
	}, [sortBy, data]);

	// Scroll to top when page changes
	useEffect(() => {
		scrollableContainerRef?.current?.scrollTo(0, 0);
	}, [currentPage]);

	const maxDataLen = fromModal ? sortedData.length : 5;

	// Pagination calculations for modal view
	const itemsPerPage = 10;
	const totalPages = Math.ceil(sortedData.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	// Determine if we should show nested view
	// For emotions, ancestorTasksById is nested inside byEmotionWithTasks
	const shouldShowNestedView = showNestedProgressBars && aggregationResults && (
		(dataType === 'Emotion' && byEmotionWithTasks) ||
		ancestorTasksById
	);

	return (
		<div className="space-y-4 w-full p-2">
			<div
				ref={scrollableContainerRef}
				className={classNames(
					'space-y-4 w-full overflow-auto gray-scrollbar pr-3',
					fromModal ? 'max-h-[300px] md:max-h-[500px]' : 'max-h-[230px]'
				)}
			>
				{/* Special handling for Emotion dataType with nested view */}
				{dataType === 'Emotion' && shouldShowNestedView && byEmotionWithTasks && aggregationResults ? (
					sortedData.slice(fromModal ? startIndex : 0, fromModal ? endIndex : maxDataLen).map((emotion: ProgressBarItemData) => {
						const emotionId = emotion.id;
						const emotionData = byEmotionWithTasks[emotionId];
						const aggregationByEmotion = aggregationResults as Record<string, AggregationResults>;
						const emotionAggregation = aggregationByEmotion[emotionId];

						if (!emotionData || !emotionAggregation) {
							return null;
						}

						// Enrich project data with names and colors
						const enrichedByProject = emotionData.byProject.map((project: ProgressBarItemData) => {
							const projectId = project.id;
							let name = projectsById?.[projectId]?.name;

							// If no projectName, it's from a non-TickTick/Session app - use the app name
							if (!name || name in sourceToAppName) {
								name = sourceToAppName[projectId] || projectId;
							}

							const color = projectsById?.[projectId]?.color || '#808080';

							return {
								...project,
								name,
								color
							};
						});

						return (
							<Accordion
								key={emotionId}
								title={
									<li className="text-[18px] cursor-pointer font-normal hover:underline break-words w-full">
										<span
											className="w-2 h-2 rounded-full flex-shrink-0 inline-block"
											style={{ backgroundColor: emotion.color }}
										/>
										{" "}
										<span className="hover:underline">
											<span>{emotion.name}</span>
											{" "}
											<span className="text-color-gray-25">
												({isFocusDuration ? getFormattedDuration(emotion[metricKey] ?? 0, false) : `${emotion[metricKey]} tasks`}, {emotion.percentage}%)
											</span>
										</span>
									</li>
								}
								openByDefault={false}
								showArrowNextToText={true}
							>
								<div className="pl-6">
									<NestedProgressBars
										data={enrichedByProject}
										dataByTasks={emotionData.byTask}
										dataType="Project"
										ancestorTasksById={emotionData.ancestorTasksById}
										aggregationResults={emotionAggregation}
										emotionId={emotionId}
										focusDurationForInterval={focusDurationForInterval}
										fromModal={fromModal}
										setIsModalOpen={setIsModalOpen}
										sortBy={sortBy}
										projectsById={projectsById || {}}
										sessionCategoriesById={sessionCategoriesById}
										metricType={metricType}
										intervalStartDate={intervalStartDate}
										intervalEndDate={intervalEndDate}
										showPagination={false}
									/>
								</div>
							</Accordion>
						);
					})
				) : shouldShowNestedView ? (
					<NestedProgressBars
						data={data}
						dataByTasks={dataByTasks}
						dataType={dataType}
						focusDurationForInterval={focusDurationForInterval}
						fromModal={fromModal}
						setIsModalOpen={setIsModalOpen}
						sortBy={sortBy}
						projectsById={projectsById || {}}
						sessionCategoriesById={sessionCategoriesById}
						ancestorTasksById={ancestorTasksById || {}}
						metricType={metricType}
						aggregationResults={aggregationResults as AggregationResults}
						intervalStartDate={intervalStartDate}
						intervalEndDate={intervalEndDate}
						showPagination={true}
					/>
				) : (
					sortedData
						.slice(fromModal ? startIndex : 0, fromModal ? endIndex : maxDataLen)
						.map((item: ProgressBarItemData) => <ProgressBar key={item.id} item={item} projectsById={projectsById || {}} sessionCategoriesById={sessionCategoriesById} metricType={metricType} ancestorTasksById={ancestorTasksById || {}} intervalStartDate={intervalStartDate} intervalEndDate={intervalEndDate} />)
				)}
			</div>

			{fromModal && !shouldShowNestedView && totalPages > 1 && (
				<div className="flex justify-center pt-4">
					<Pagination
						total={totalPages}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
						compactView={true}
					/>
				</div>
			)}

			{!fromModal && (
				<div
					className="text-color-gray-100 cursor-pointer text-[16px] lg:text-[14px] xl:text-[16px]"
					onClick={() => setIsModalOpen(true)}
				>
					View More
				</div>
			)}
		</div>
	);
};

export default ProgressBarList;
