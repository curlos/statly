import classNames from 'classnames';
import ProgressBar from '../ProgressBar';
import { useGetProjectsQuery } from '../../../../../services/resources/documentsProjectsApi';
import NestedProgressBars from './NestedProgressBars';

interface ProgressBarListProps {
	data: Array<any>;
}

const ProgressBarList: React.FC<ProgressBarListProps> = ({
	data,
	dataByTasks,
	dataType,
	fromModal,
	isModalOpen,
	setIsModalOpen,
	focusDurationForInterval,
	sortBy,
	showNestedProgressBars,
	ancestorTasksById,
	metricType = 'duration',
	aggregationResults,
	intervalStartDate,
	intervalEndDate
}) => {
	// Fetch metadata needed for ProgressBar navigation
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById, projectsSessionById } = fetchedProjects || {};

	// Session categories are stored as projects with source='ProjectSession'
	const sessionCategoriesById = projectsSessionById || {};

	const isFocusDuration = metricType === 'duration';
	const metricKey = isFocusDuration ? 'duration' : 'count';

	// Data is already grouped by parent in CompletionStatsCard for completed tasks
	// So we just sort and display it here
	const sortedData = [...data].sort((a, b) => {
		// Primary sort: by metric value
		const metricDiff = sortBy === 'Focus Hours: Most-Least' || sortBy === 'Tasks: Most-Least'
			? b[metricKey] - a[metricKey]
			: a[metricKey] - b[metricKey];

		// If metrics are equal, sort alphabetically by name
		if (metricDiff === 0) {
			const nameA = (a.name || '').toLowerCase();
			const nameB = (b.name || '').toLowerCase();
			return nameA.localeCompare(nameB);
		}

		return metricDiff;
	});
	const maxDataLen = fromModal ? sortedData.length : 5;

	return (
		<div className="space-y-4 w-full p-2">
			<div
				className={classNames(
					'space-y-4 w-full overflow-auto gray-scrollbar',
					fromModal ? 'max-h-[300px] md:max-h-[500px]' : 'md:max-h-[230px]'
				)}
			>
				{showNestedProgressBars && ancestorTasksById && aggregationResults ? (
					<NestedProgressBars
						{...{
							data,
							dataByTasks,
							dataType,
							focusDurationForInterval,
							fromModal,
							isModalOpen,
							setIsModalOpen,
							sortBy,
							projectsById,
							sessionCategoriesById,
							ancestorTasksById,
							metricType,
							aggregationResults,
							intervalStartDate,
							intervalEndDate
						}}
					/>
				) : (
					sortedData
						.slice(0, maxDataLen)
						.map((item) => <ProgressBar key={item.id} item={item} projectsById={projectsById} sessionCategoriesById={sessionCategoriesById} metricType={metricType} ancestorTasksById={ancestorTasksById} intervalStartDate={intervalStartDate} intervalEndDate={intervalEndDate} />)
				)}
			</div>

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
