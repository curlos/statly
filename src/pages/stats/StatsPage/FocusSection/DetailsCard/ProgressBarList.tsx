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
	ancestorTasksById
}) => {
	// Fetch metadata needed for ProgressBar navigation
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById, projectsSessionById } = fetchedProjects || {};

	// Session categories are stored as projects with source='ProjectSession'
	const sessionCategoriesById = projectsSessionById || {};

	const sortedData = [...data].sort((a, b) => {
		if (sortBy === 'Focus Hours: Most-Least') {
			return b.duration - a.duration;
		}

		return a.duration - b.duration;
	});
	const maxDataLen = fromModal ? sortedData.length : 5;

	return (
		<div className="space-y-4 w-full p-2">
			<div
				className={classNames(
					'space-y-4',
					fromModal && 'max-h-[300px] md:max-h-[500px] overflow-auto gray-scrollbar'
				)}
			>
				{showNestedProgressBars && ancestorTasksById ? (
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
							ancestorTasksById
						}}
					/>
				) : (
					sortedData
						.slice(0, maxDataLen)
						.map((item) => <ProgressBar key={item.id} item={item} fromModal={fromModal} projectsById={projectsById} sessionCategoriesById={sessionCategoriesById} />)
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
