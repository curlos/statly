import Accordion from '../../../components/Accordion/Accordion';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import CompletedTask from './CompletedTask';
import type { AncestorTask } from '../../../types/api';
import type { Task } from '../../../types/models';

interface CompletedTasksWithBreadcrumbsProps {
	ancestorTasksById: Record<string, AncestorTask>;
	groupedSubtasksByParentTask: Record<string, (Task | AncestorTask)[]>;
	dateStr: string;
	updateTaskIdQueryParam: (taskId: string) => void;
	groupedTasksCollapsedByDefault: boolean;
}

const CompletedTasksWithBreadcrumbs: React.FC<CompletedTasksWithBreadcrumbsProps> = ({
	ancestorTasksById,
	groupedSubtasksByParentTask,
	dateStr,
	updateTaskIdQueryParam,
	groupedTasksCollapsedByDefault,
}) => {
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const { updateQueryParams } = useSearchParamsContext();

	return (
		ancestorTasksById &&
		Object.keys(groupedSubtasksByParentTask).map((parentTaskId, i) => {
			const completedSubtasks = groupedSubtasksByParentTask[parentTaskId];
			const parentTask =
				ancestorTasksById && ancestorTasksById[parentTaskId];
			const parentTaskTitle = parentTask?.title || parentTaskId;
			const parentTaskBreadcrumbs = parentTask?.ancestorIds?.slice(1)

			const taskProject = (projectsById && parentTask?.projectId) ? projectsById[parentTask.projectId] : undefined;
			const projectQueryParam = taskProject?.source === 'ProjectTickTick' ? 'projects' : 'projects-todoist';

			return (
				<Accordion
					key={dateStr + parentTaskId + i}
					title={
						<div className="text-[18px]">
							<span
								className="underline font-bold hover:text-blue-500"
								onClick={() => {
									updateTaskIdQueryParam(parentTaskId);
								}}
							>
								{parentTaskTitle}
							</span>

							{parentTaskBreadcrumbs?.length > 0 && (
								<span className="ml-1 text-color-gray-25">
									-{' '}
									{parentTaskBreadcrumbs.map((taskId: string, index: number) => {
										const taskObj = ancestorTasksById[taskId];
										const title = taskObj?.title || taskId;

										return (
											<span key={`breadcrumbs-${dateStr}-${taskId}-${index}`}>
												<span
													className="hover:text-blue-500 hover:underline"
													onClick={() => {
														updateTaskIdQueryParam(taskId);
													}}
												>
													{title}
												</span>
												{index !== parentTaskBreadcrumbs.length - 1 && <span>{' > '}</span>}
											</span>
										);
									})}
								</span>
							)}

							{(taskProject || parentTask?.projectId) && (
								<span className="text-color-gray-25">
									{' - '}
								</span>
							)}

							{(taskProject || parentTask?.projectId) && (
								<span className="text-color-gray-25 hover:underline hover:text-blue-500" onClick={() => {
									updateQueryParams({
										[projectQueryParam]: taskProject?.id || parentTask?.projectId,
										'task-id': '',
										'sort-by': '',
										search: '',
										'start-date': '',
										'end-date': '',
										page: '',
									});
								}}>
									({taskProject?.name || parentTask?.projectId})
								</span>
							)}
						</div>
					}
					openByDefault={!groupedTasksCollapsedByDefault}
					showArrowNextToText={true}
				>
					<div className="space-y-1">
						{completedSubtasks.map((task, i) => (
							<CompletedTask
								key={dateStr + task.id + i}
								task={task}
								isFullTask={false}
								updateTaskIdQueryParam={updateTaskIdQueryParam}
							/>
						))}
					</div>
				</Accordion>
			);
		})
	);
};

export default CompletedTasksWithBreadcrumbs;
