import Accordion from '../../../components/Accordion/Accordion';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import CompletedTask from './CompletedTask';
import type { AncestorTask } from '../../../types/api';
import type { Task } from '../../../types/models';

interface CustomDisplay {
	useBackgroundColor: boolean;
	backgroundColor: string;
	useTextColor: boolean;
	textColor: string;
	useBackgroundImage: boolean;
	backgroundImage: string;
	backgroundImageOpacity: number;
}

interface CompletedTasksWithBreadcrumbsProps {
	ancestorTasksById: Record<string, AncestorTask>;
	groupedSubtasksByParentTask: Record<string, (Task | AncestorTask)[]>;
	dateStr: string;
	buildUrlWithTaskIdQueryParam: (taskId: string) => string;
	groupedTasksCollapsedByDefault: boolean;
	cardTextColor?: string;
	customDisplay: CustomDisplay;
}

const CompletedTasksWithBreadcrumbs: React.FC<CompletedTasksWithBreadcrumbsProps> = ({
	ancestorTasksById,
	groupedSubtasksByParentTask,
	dateStr,
	buildUrlWithTaskIdQueryParam,
	groupedTasksCollapsedByDefault,
	cardTextColor,
	customDisplay
}) => {
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const { buildUrlWithQueryParams } = useSearchParamsContext();

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
							<h3 className="inline underline font-bold hover:text-blue-500 m-0">
								<a
									href={buildUrlWithTaskIdQueryParam(parentTaskId)}
									style={customDisplay.useTextColor ? { color: cardTextColor } : {}}
								>
									{parentTaskTitle}
								</a>
							</h3>

							{parentTaskBreadcrumbs?.length > 0 && (
								<span className="ml-1 text-color-gray-25" style={customDisplay.useTextColor ? { color: cardTextColor } : {}}>
									-{' '}
									{parentTaskBreadcrumbs.map((taskId: string, index: number) => {
										const taskObj = ancestorTasksById[taskId];
										const title = taskObj?.title || taskId;

										return (
											<span key={`breadcrumbs-${dateStr}-${taskId}-${index}`}>
												<a
													href={buildUrlWithTaskIdQueryParam(taskId)}
													className="hover:text-blue-500 hover:underline"
												>
													{title}
												</a>
												{index !== parentTaskBreadcrumbs.length - 1 && <span>{' > '}</span>}
											</span>
										);
									})}
								</span>
							)}

							{(taskProject || parentTask?.projectId) && (
								<span className="text-color-gray-25" style={customDisplay.useTextColor ? { color: cardTextColor } : {}}>
									{' - '}
								</span>
							)}

							{(taskProject || parentTask?.projectId) && (
								<a
								href={buildUrlWithQueryParams({ [projectQueryParam]: taskProject?.id || parentTask?.projectId, 'task-id': '', 'sort-by': '', search: '', 'start-date': '', 'end-date': '', page: '' })}
								className="text-color-gray-25 hover:underline hover:text-blue-500"
								style={customDisplay.useTextColor ? { color: cardTextColor } : {}}
							>
								({taskProject?.name || parentTask?.projectId})
							</a>
							)}
						</div>
					}
					openByDefault={!groupedTasksCollapsedByDefault}
					showArrowNextToText={true}
				>
					<ul className="space-y-1 list-none p-0 m-0">
						{completedSubtasks.map((task, i) => (
							<li key={dateStr + task.id + i}>
								<CompletedTask
									task={task}
									isFullTask={false}
									buildUrlWithTaskIdQueryParam={buildUrlWithTaskIdQueryParam}
									cardTextColor={cardTextColor}
								/>
							</li>
						))}
					</ul>
				</Accordion>
			);
		})
	);
};

export default CompletedTasksWithBreadcrumbs;
