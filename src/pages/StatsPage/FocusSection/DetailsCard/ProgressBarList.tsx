import { useState } from 'react';
import { useGetTodoistAllTasksQuery } from '../../../../services/resources/oldFocusAppsApi';
import { useGetAllTasksQuery } from '../../../../services/resources/ticktickOneApi';
import {
	getGroupedSubtasksAndParentTasks,
	getTasksWithParentIdAndNoParent,
} from '../../../ticktick-1.00/completed-tasks/DayWithCompletedTasks/getGroupedSubtasksAndParentTasks.util';
import ProgressBar from '../ProgressBar';
import classNames from 'classnames';
import Accordion from '../../../../components/Accordion/Accordion';
import { arrayToObjectByKey } from '../../../../utils/focus-apps/helpers.utils';

interface ProgressBarListProps {
	data: Array<any>;
}

const ProgressBarList: React.FC<ProgressBarListProps> = ({ data, dataType, fromModal, setIsOpen }) => {
	const sortedData = data.sort((a, b) => b.percentage - a.percentage);
	const maxDataLen = fromModal ? sortedData.length : 5;

	const [showNestedProgressBars, setShowNestedProgressBars] = useState(true);

	return (
		<div className="space-y-4 w-full p-2">
			<div className={classNames('space-y-4', fromModal && 'max-h-[500px] overflow-auto gray-scrollbar')}>
				{showNestedProgressBars ? (
					<NestedProgressBars {...{ data }} />
				) : (
					sortedData
						.slice(0, maxDataLen)
						.map((item) => <ProgressBar key={item.id} item={item} fromModal={fromModal} />)
				)}
			</div>

			{!fromModal && (
				<div
					className="text-color-gray-100 cursor-pointer text-[16px] lg:text-[14px] xl:text-[16px]"
					onClick={() => setIsOpen(true)}
				>
					View More
				</div>
			)}
		</div>
	);
};

const NestedProgressBars = ({ data }) => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById, ancestorTasksById } = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistAllTasksById } = useGetTodoistAllTasksQuery();
	const { todoistAllTasksById, todoistAncestorTasksById } = fetchedTodoistAllTasksById || {};

	const groupedTasksCollapsedByDefault = useState(false);

	if (!data || !tasksById || !todoistAllTasksById) {
		return <div>Loading...</div>;
	}

	const taskIds = data.map((dataObj) => dataObj.id);

	if (!taskIds) {
		return;
	}

	const progressBarDataById = arrayToObjectByKey(data, 'id');

	const focusRecordTasks = taskIds.map((id) => {
		return tasksById[id] || todoistAllTasksById[id];
	});

	const { tasksWithParentId, tasksWithNoParent } = getTasksWithParentIdAndNoParent({
		completedTasksForDay: focusRecordTasks,
		tasksById,
		todoistAllTasksById,
		ancestorTasksById,
		todoistAncestorTasksById,
	});

	const { groupedSubtasksByParentTask, parentTasks } = getGroupedSubtasksAndParentTasks({
		completedTasksForDay: focusRecordTasks,
	});

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
	const renderDirectFocusTasks = (directFocusTasks) => {
		console.log(data);
		console.log(directFocusTasks);

		return (
			<ul className="space-y-4">
				{directFocusTasks?.map((subtask, index) => {
					const item = progressBarDataById[subtask.id];

					return (
						<li key={subtask.id + index} className="flex items-start gap-1">
							<ProgressBar key={item.id} item={item} fromModal={true} />
						</li>
					);
				})}
			</ul>
		);
	};

	const renderNestedTasks = (parentTaskId) => {
		const parentTask = todoistAllTasksById[parentTaskId] || tasksById[parentTaskId];

		// These are the tasks who are direct children of the parent task. These will be rendered as completed checkboxes with the content.
		const directParentChildFocusTasks = groupedSubtasksByParentTask[parentTask.id];

		return (
			<ul key={parentTaskId} className="text-[16px]">
				<Accordion
					title={
						<li className="underline cursor-pointer font-bold text-[18px] hover:text-blue-500">
							{/* TickTick tasks = "title", Todoist tasks = "content" */}
							{parentTask.title || parentTask.content}
						</li>
					}
					openByDefault={!groupedTasksCollapsedByDefault}
					showArrowNextToText={true}
				>
					{directParentChildFocusTasks?.length > 0 && renderDirectFocusTasks(directParentChildFocusTasks)}

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

								const directFocusedTasks = groupedSubtasksByParentTask[taskId];

								return (
									<Accordion
										key={taskId + index}
										title={
											<li className="underline cursor-pointer font-bold text-[18px] mt-1 hover:text-blue-500">
												{task.content || task.title}
											</li>
										}
										openByDefault={true}
										showArrowNextToText={true}
									>
										{directFocusedTasks?.length > 0 && renderDirectFocusTasks(directFocusedTasks)}
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
			{tasksWithNoParent.map((taskId, index) => {
				return <div key={taskId + index}>{renderNestedTasks(taskId)}</div>;
			})}
		</>
	);
};

export default ProgressBarList;
