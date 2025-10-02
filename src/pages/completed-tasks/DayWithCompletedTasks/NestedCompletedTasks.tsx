import classNames from 'classnames';
import Accordion from '../../../components/Accordion/Accordion';
import Icon from '../../../components/Icon';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';

const NestedCompletedTasks = ({
	tasksWithNoParent,
	tasksWithParentId,
	todoistAllTasksById,
	groupedSubtasksByParentTask,
	tasksById,
	groupedTasksCollapsedByDefault,
	dateStr,
	updateTaskIdQueryParam,
}) => {
	const {
		focusRecordsPageSettings: { showMedals },
	} = useUserSettingsContext();

	/**
	 * @description Get and map the parent ids to their direct children. The array will contain the list of direct children (who are siblings to each other).
	 * @returns {Object}
	 */
	const getParentDirectChildrenTaskIdsByParentId = () => {
		const parentDirectChildrenTaskIdsByParentId = {};

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
	const renderDirectCompletedSubtasks = (directCompletedSubtasks) => {
		return (
			<ul className="">
				{directCompletedSubtasks?.map((subtask, index) => (
					<li
						key={subtask.id + index + dateStr}
						className={classNames(
							'flex items-start gap-1',
							showMedals ? 'break-all sm:break-words sm:break-normal' : 'break-words'
						)}
					>
						<Icon
							name={subtask.status === -1 ? 'disabled_by_default' : 'check_box'}
							customClass={classNames('!text-[20px] text-white mt-[2px]')}
						/>
						<span>{subtask.content || subtask.title}</span>
					</li>
				))}
			</ul>
		);
	};

	/**
	 * @description
	 * @param {String} parentTaskId
	 */
	const renderNestedTasks = (parentTaskId) => {
		const parentTask = todoistAllTasksById[parentTaskId] || tasksById[parentTaskId];

		// These are the tasks who are direct children of the parent task. These will be rendered as completed checkboxes with the content.
		const directCompletedSubtasks = groupedSubtasksByParentTask[parentTask.id];

		return (
			<ul key={parentTaskId} className="text-[16px]">
				<Accordion
					title={
						<li
							className="underline cursor-pointer font-bold text-[18px] hover:text-blue-500"
							onClick={() => updateTaskIdQueryParam(parentTask.id)}
						>
							{/* TickTick tasks = "title", Todoist tasks = "content" */}
							{parentTask.title || parentTask.content}
						</li>
					}
					openByDefault={!groupedTasksCollapsedByDefault}
					showArrowNextToText={true}
				>
					{directCompletedSubtasks?.length > 0 && renderDirectCompletedSubtasks(directCompletedSubtasks)}

					<ul className="pl-6">
						{parentDirectChildrenTaskIdsByParentId[parentTaskId] &&
							parentDirectChildrenTaskIdsByParentId[parentTaskId].map((taskId, index) => {
								const task = tasksById[taskId] || todoistAllTasksById[taskId];

								if (
									parentDirectChildrenTaskIdsByParentId[taskId] &&
									parentDirectChildrenTaskIdsByParentId[taskId].length > 0
								) {
									return renderNestedTasks(taskId);
								}

								const directCompletedSubtasks = groupedSubtasksByParentTask[taskId];

								return (
									<Accordion
										key={taskId + index + dateStr}
										title={
											<li
												className="underline cursor-pointer font-bold text-[18px] mt-1 hover:text-blue-500 break-words"
												onClick={() => updateTaskIdQueryParam(task.id)}
											>
												{task.content || task.title}
											</li>
										}
										openByDefault={true}
										showArrowNextToText={true}
									>
										{directCompletedSubtasks?.length > 0 &&
											renderDirectCompletedSubtasks(directCompletedSubtasks)}
									</Accordion>
								);
							})}
					</ul>
				</Accordion>
			</ul>
		);
	};

	return (
		<>
			{/* Starting the tasks with NO parent, recursively render the nested tasks. It's important to start with the tasks with NO parent as they are the top-level task and for this to recursively render this without missing any tasks, it must start from the top. */}
			{tasksWithNoParent.map((taskId, index) => {
				return <div key={taskId + index}>{renderNestedTasks(taskId)}</div>;
			})}
		</>
	);
};

export default NestedCompletedTasks;
