import classNames from 'classnames';
import Accordion from '../../../components/Accordion/Accordion';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import CompletedTask from './CompletedTask';
import type { Task } from '../../../types/models';
import type { AncestorTask } from '../../../types/api';

interface CustomDisplay {
	useBackgroundColor: boolean;
	backgroundColor: string;
	useTextColor: boolean;
	textColor: string;
	useBackgroundImage: boolean;
	backgroundImage: string;
	backgroundImageOpacity: number;
}

interface NestedCompletedTasksProps {
	tasksWithNoParent: string[];
	tasksWithParentId: Record<string, string | null>;
	groupedSubtasksByParentTask: Record<string, (Task | AncestorTask)[]>;
	groupedTasksCollapsedByDefault: boolean;
	dateStr: string;
	buildUrlWithTaskIdQueryParam: (taskId: string) => string;
	ancestorTasksById: Record<string, AncestorTask>;
	cardTextColor?: string;
	customDisplay: CustomDisplay;
}

const NestedCompletedTasks: React.FC<NestedCompletedTasksProps> = ({
	tasksWithNoParent,
	tasksWithParentId,
	groupedSubtasksByParentTask,
	groupedTasksCollapsedByDefault,
	dateStr,
	buildUrlWithTaskIdQueryParam,
	ancestorTasksById,
	cardTextColor,
	customDisplay,
}) => {
	const {
		focusRecordsPageSettings: { showMedals },
	} = useUserSettingsContext();

	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const { buildUrlWithQueryParams } = useSearchParamsContext();

	/**
	 * @description Get and map the parent ids to their direct children. The array will contain the list of direct children (who are siblings to each other).
	 * @returns {Object}
	 */
	const getParentDirectChildrenTaskIdsByParentId = () => {
		const parentDirectChildrenTaskIdsByParentId: Record<string, string[]> = {};

		Object.entries(tasksWithParentId).forEach(([currentTaskId, parentTaskId]) => {
			if (parentTaskId) {
				if (!parentDirectChildrenTaskIdsByParentId[parentTaskId]) {
					parentDirectChildrenTaskIdsByParentId[parentTaskId] = [];
				}

				// This array for the specific key of "parentTaskId" will only contain the taskIds of tasks who have the SAME PARENT ID. If they have the same parent id, then they are siblings. This will only contain the direct children of that parent. It will NOT contain the parent's grandchildren or great-grandchildren and so on.
				parentDirectChildrenTaskIdsByParentId[parentTaskId].push(currentTaskId);
			}
		});

		return parentDirectChildrenTaskIdsByParentId;
	};

	const parentDirectChildrenTaskIdsByParentId = getParentDirectChildrenTaskIdsByParentId();

	// Total completed tasks in a group, including all of its nested groups.
	const getCompletedCount = (taskId: string): number => {
		const directCount = groupedSubtasksByParentTask[taskId]?.length || 0;
		const childIds = parentDirectChildrenTaskIdsByParentId[taskId] || [];
		return childIds.reduce((sum, childId) => sum + getCompletedCount(childId), directCount);
	};

	const sortByCompletedCount = (taskIds: string[]) =>
		[...taskIds].sort((a, b) => getCompletedCount(b) - getCompletedCount(a));

	const renderCount = (count: number) => (
		<span className="text-muted-inherit" style={customDisplay.useTextColor ? { color: cardTextColor } : {}}>
			({count})
		</span>
	);

	/**
	 * @description
	 * @param directCompletedSubtasks
	 */
	const renderDirectCompletedSubtasks = (directCompletedSubtasks: (Task | AncestorTask)[]) => {
		return (
			<ul className="space-y-2">
				{directCompletedSubtasks?.map((subtask: Task | AncestorTask, index: number) => (
					<li
						key={subtask.id + index + dateStr}
						className={classNames(showMedals ? 'break-all sm:break-words sm:break-normal' : 'break-words')}
					>
						<CompletedTask
							task={subtask}
							buildUrlWithTaskIdQueryParam={buildUrlWithTaskIdQueryParam}
							isFullTask={false}
							cardTextColor={cardTextColor}
						/>
					</li>
				))}
			</ul>
		);
	};

	/**
	 * @description
	 * @param {String} parentTaskId
	 */
	const renderNestedTasks = (parentTaskId: string) => {
		const parentTask = ancestorTasksById[parentTaskId];

		// These are the tasks who are direct children of the parent task. These will be rendered as completed checkboxes with the content.
		const directCompletedSubtasks = groupedSubtasksByParentTask[parentTask.id];
		const taskUrl = buildUrlWithTaskIdQueryParam(parentTask.id);

		return (
			<li key={parentTaskId} className="text-[16px]">
				<Accordion
					titleHasLinks
						mutedArrow
					title={
						<div className="flex items-center gap-2 text-[18px]">
							<h3 className="min-w-0 break-words underline hover:text-blue-500 font-bold m-0">
								<a href={taskUrl} style={customDisplay.useTextColor ? { color: cardTextColor } : {}}>
									{parentTask.title}
								</a>
							</h3>
							{renderCount(getCompletedCount(parentTaskId))}
						</div>
					}
					openByDefault={!groupedTasksCollapsedByDefault}
					showArrowNextToText={true}
				>
					{directCompletedSubtasks?.length > 0 && renderDirectCompletedSubtasks(directCompletedSubtasks)}

					<ul className="pl-2 sm:pl-6 [&>li]:mt-2">
						{parentDirectChildrenTaskIdsByParentId[parentTaskId] &&
							sortByCompletedCount(parentDirectChildrenTaskIdsByParentId[parentTaskId]).map((taskId: string) => {
								if (
									parentDirectChildrenTaskIdsByParentId[taskId] &&
									parentDirectChildrenTaskIdsByParentId[taskId].length > 0
								) {
									return renderNestedTasks(taskId);
								} else {
									return null;
								}
							})}
					</ul>
				</Accordion>
			</li>
		);
	};

	// Group the top-level tasks by their project so the project becomes the outermost level.
	const topLevelTaskIdsByProjectId: Record<string, string[]> = {};
	tasksWithNoParent.forEach((taskId: string) => {
		const projectId = ancestorTasksById[taskId]?.projectId || '';
		if (!topLevelTaskIdsByProjectId[projectId]) {
			topLevelTaskIdsByProjectId[projectId] = [];
		}
		topLevelTaskIdsByProjectId[projectId].push(taskId);
	});

	const getProjectUrl = (projectId: string) => {
		const project = projectsById?.[projectId];
		const projectQueryParam = project?.source === 'ProjectTickTick' ? 'projects' : 'projects-todoist';

		return buildUrlWithQueryParams({
			[projectQueryParam]: projectId,
			'task-id': '',
			'sort-by': '',
			search: '',
			'start-date': '',
			'end-date': '',
			page: '',
		});
	};

	return (
		<>
			{/* Starting the tasks with NO parent, recursively render the nested tasks. It's important to start with the tasks with NO parent as they are the top-level task and for this to recursively render this without missing any tasks, it must start from the top. */}
			<ul className="space-y-5 list-none p-0 m-0">
				{Object.entries(topLevelTaskIdsByProjectId)
					.map(([projectId, taskIds]) => ({
						projectId,
						taskIds: sortByCompletedCount(taskIds),
						count: taskIds.reduce((sum, taskId) => sum + getCompletedCount(taskId), 0),
					}))
					.sort((a, b) => b.count - a.count)
					.map(({ projectId, taskIds, count }) => (
					<li key={projectId}>
						<Accordion
							titleHasLinks
							mutedArrow
							title={
								<div className="flex items-center gap-2 text-[18px]">
									<h3 className="min-w-0 break-words underline hover:text-blue-500 font-bold m-0">
										<a href={getProjectUrl(projectId)} style={customDisplay.useTextColor ? { color: cardTextColor } : {}}>
											{projectsById?.[projectId]?.name || projectId || 'No Project'}
										</a>
									</h3>
									{renderCount(count)}
								</div>
							}
							openByDefault={!groupedTasksCollapsedByDefault}
							showArrowNextToText={true}
						>
							<ul className="space-y-5 list-none pl-2 sm:pl-6 m-0">
								{taskIds.map((taskId: string) => renderNestedTasks(taskId))}
							</ul>
						</Accordion>
					</li>
				))}
			</ul>
		</>
	);
};

export default NestedCompletedTasks;
