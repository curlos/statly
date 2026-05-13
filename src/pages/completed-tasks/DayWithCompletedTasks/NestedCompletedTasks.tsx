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
	customDisplay
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

	/**
	 * @description
	 * @param directCompletedSubtasks
	 */
	const renderDirectCompletedSubtasks = (directCompletedSubtasks: (Task | AncestorTask)[]) => {
		return (
			<ul>
				{directCompletedSubtasks?.map((subtask: Task | AncestorTask, index: number) => (
					<li
						key={subtask.id + index + dateStr}
						className={classNames(
							showMedals ? 'break-all sm:break-words sm:break-normal' : 'break-words'
						)}
					>
						<CompletedTask task={subtask} buildUrlWithTaskIdQueryParam={buildUrlWithTaskIdQueryParam} isFullTask={false} cardTextColor={cardTextColor} />
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
		const parentTask = ancestorTasksById[parentTaskId]

		// These are the tasks who are direct children of the parent task. These will be rendered as completed checkboxes with the content.
		const directCompletedSubtasks = groupedSubtasksByParentTask[parentTask.id];
		const taskProject = (projectsById && parentTask?.projectId) ? projectsById[parentTask.projectId] : undefined;
		const projectQueryParam = taskProject?.source === 'ProjectTickTick' ? 'projects' : 'projects-todoist';

		const taskUrl = buildUrlWithTaskIdQueryParam(parentTask.id);
		const projectUrl = buildUrlWithQueryParams({ [projectQueryParam]: parentTask?.projectId, 'task-id': '', 'sort-by': '', search: '', 'start-date': '', 'end-date': '', page: '' });

		return (
			<ul key={parentTaskId} className="text-[16px] list-none p-0 m-0">
				<li>
					<Accordion
						title={
							<div className="flex items-center gap-2 text-[18px]">
								<h3 className="underline hover:text-blue-500 font-bold m-0">
									<a href={taskUrl} style={customDisplay.useTextColor ? { color: cardTextColor } : {}}>
										{parentTask.title}
									</a>
								</h3>

								{(taskProject || parentTask?.projectId) && (
									<span
										className={classNames("text-color-gray-25 hover:underline hover:text-blue-500", parentTask.parentId && "hidden sm:block")}
										style={{ color: customDisplay.useTextColor ? cardTextColor : '' }}
									>
										<a href={projectUrl}>({taskProject?.name || parentTask?.projectId})</a>
									</span>
								)}
							</div>
						}
						openByDefault={!groupedTasksCollapsedByDefault}
						showArrowNextToText={true}
					>
						{directCompletedSubtasks?.length > 0 && renderDirectCompletedSubtasks(directCompletedSubtasks)}

						<ul className="pl-2 sm:pl-6">
							{parentDirectChildrenTaskIdsByParentId[parentTaskId] &&
								parentDirectChildrenTaskIdsByParentId[parentTaskId].map((taskId: string) => {
									if (
										parentDirectChildrenTaskIdsByParentId[taskId] &&
										parentDirectChildrenTaskIdsByParentId[taskId].length > 0
									) {
										return renderNestedTasks(taskId);
									} else {
										return null
									}
								})}
						</ul>
					</Accordion>
				</li>
			</ul>
		);
	};

	return (
		<>
			{/* Starting the tasks with NO parent, recursively render the nested tasks. It's important to start with the tasks with NO parent as they are the top-level task and for this to recursively render this without missing any tasks, it must start from the top. */}
			{tasksWithNoParent.map((taskId: string, index: number) => {
				return <div key={taskId + index}>{renderNestedTasks(taskId)}</div>;
			})}
		</>
	);
};

export default NestedCompletedTasks;
