import classNames from 'classnames';
import { useState } from 'react';
import Accordion from '../../../../../components/Accordion/Accordion';
import { useGetTodoistAllTasksQuery } from '../../../../../services/resources/oldFocusAppsApi';
import { useGetAllTasksQuery, useGetAllProjectsQuery } from '../../../../../services/resources/ticktickOneApi';
import { arrayToObjectByKey, getFormattedDuration } from '../../../../../utils/focus-apps/helpers.utils';
import {
	getTasksWithParentIdAndNoParent,
	getGroupedSubtasksAndParentTasks,
} from '../../../../completed-tasks/DayWithCompletedTasks/getGroupedSubtasksAndParentTasks.util';
import ProgressBar from '../ProgressBar';

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
}) => {
	const sortedData = data.sort((a, b) => {
		if (sortBy === 'Focus Hours: Most-Least') {
			return b.focusDuration - a.focusDuration;
		}

		return a.focusDuration - b.focusDuration;
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
				{showNestedProgressBars ? (
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
						}}
					/>
				) : (
					sortedData
						.slice(0, maxDataLen)
						.map((item) => <ProgressBar key={item.id} item={item} fromModal={fromModal} />)
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

const NestedProgressBars = ({
	data,
	dataByTasks,
	dataType,
	focusDurationForInterval,
	fromModal,
	isModalOpen,
	setIsModalOpen,
	sortBy,
}) => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById, ancestorTasksById } = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistAllTasksById } = useGetTodoistAllTasksQuery();
	const { todoistAllTasksById, todoistAncestorTasksById } = fetchedTodoistAllTasksById || {};

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects } = useGetAllProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const groupedTasksCollapsedByDefault = useState(false);

	if (!data || !tasksById || !todoistAllTasksById || (dataType === 'Project' && !dataByTasks)) {
		return <div>Loading...</div>;
	}

	const dataToUse = dataType === 'Project' && dataByTasks ? dataByTasks : data;

	const taskIds = dataToUse.map((dataObj) => dataObj.id);

	if (!taskIds) {
		return;
	}

	const progressBarDataById = arrayToObjectByKey(dataToUse, 'id');

	const tickTickFocusRecordTasks = [];
	const otherFocusRecordTaskIds = [];

	taskIds.forEach((id) => {
		const task = tasksById[id];
		if (task) {
			tickTickFocusRecordTasks.push(task);
		} else {
			otherFocusRecordTaskIds.push(id);
		}
	});

	const { tasksWithParentId, tasksWithNoParent } = getTasksWithParentIdAndNoParent({
		completedTasksForDay: tickTickFocusRecordTasks,
		tasksById,
		todoistAllTasksById,
		ancestorTasksById,
		todoistAncestorTasksById,
		includeDirectParentTasksWithNoChild: true,
	});

	const { groupedSubtasksByParentTask, parentTasks } = getGroupedSubtasksAndParentTasks({
		completedTasksForDay: tickTickFocusRecordTasks,
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
		return (
			<ul className="space-y-4 pl-6 mb-6">
				{directFocusTasks?.map((subtask, index) => {
					const item = progressBarDataById[subtask.id];

					return (
						<li key={subtask.id + index} className="flex items-start gap-1">
							<ProgressBar key={item.id} item={item} fromModal={fromModal} />
						</li>
					);
				})}
			</ul>
		);
	};

	const totalTimeOnParentTask = {};

	const calculateTotalTimeFromChildren = (parentTaskId) => {
		if (totalTimeOnParentTask[parentTaskId]) {
			return totalTimeOnParentTask[parentTaskId];
		}

		let totalTime = 0;

		const directParentChildFocusTasks = groupedSubtasksByParentTask[parentTaskId];
		const childDirectParentTasks = parentDirectChildrenTaskIdsByParentId[parentTaskId];

		if (directParentChildFocusTasks) {
			directParentChildFocusTasks.forEach((subtask) => {
				const item = progressBarDataById[subtask.id];

				totalTime += item.focusDuration;
			});
		}

		if (childDirectParentTasks && childDirectParentTasks.length > 0) {
			childDirectParentTasks.forEach((taskId) => {
				totalTime += calculateTotalTimeFromChildren(taskId).time;
			});
		}

		totalTimeOnParentTask[parentTaskId] = {
			time: totalTime,
			percentage: Number(((totalTime / focusDurationForInterval) * 100).toFixed(2)),
		};

		return totalTimeOnParentTask[parentTaskId];
	};

	tasksWithNoParent.forEach((taskId) => {
		calculateTotalTimeFromChildren(taskId);
	});

	const renderNestedTasks = (parentTaskId) => {
		const parentTask = todoistAllTasksById[parentTaskId] || tasksById[parentTaskId];

		// These are the tasks who are direct children of the parent task. These will be rendered as completed checkboxes with the content.
		const directParentChildFocusTasks = groupedSubtasksByParentTask[parentTask.id];

		return (
			<ul key={parentTaskId} className="text-[16px]">
				<Accordion
					title={
						<li className="text-[18px] cursor-pointer font-bold hover:underline">
							{/* TickTick tasks = "title", Todoist tasks = "content" */}
							<span className="">{parentTask.title || parentTask.content} </span>
							<span className="text-color-gray-25">
								({getFormattedDuration(totalTimeOnParentTask[parentTaskId].time, false)},{' '}
								{totalTimeOnParentTask[parentTaskId].percentage}%)
							</span>
						</li>
					}
					openByDefault={!groupedTasksCollapsedByDefault}
					showArrowNextToText={true}
					customToggleOpen={() => {
						if (!fromModal) {
							setIsModalOpen(true);
						}
					}}
					preventOpen={!fromModal}
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
											<li className="cursor-pointer font-bold text-[18px] hover:underline">
												{task.content || task.title}{' '}
												<span className="text-color-gray-25">
													(
													{totalTimeOnParentTask[taskId] &&
														getFormattedDuration(totalTimeOnParentTask[taskId].time, false)}
													,{' '}
													{totalTimeOnParentTask[taskId] &&
														totalTimeOnParentTask[taskId].percentage}
													%)
												</span>
											</li>
										}
										openByDefault={true}
										showArrowNextToText={true}
										customClasses="mt-1"
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

	const sortedTasksWithNoParent = tasksWithNoParent.sort((taskIdOne, taskIdTwo) => {
		const durationOne = totalTimeOnParentTask[taskIdOne].time;
		const durationTwo = totalTimeOnParentTask[taskIdTwo].time;

		if (sortBy === 'Focus Hours: Most-Least') {
			return durationTwo - durationOne;
		}

		return durationOne - durationTwo;
	});

	const maxTasksWithNoParent = fromModal ? sortedTasksWithNoParent.length : 4;

	if (dataType === 'Project') {
		const groupedProjectsAndTasks = {};

		for (const taskId of [...sortedTasksWithNoParent, ...otherFocusRecordTaskIds]) {
			const task = tasksById[taskId] || todoistAllTasksById[taskId];

			if (!task) {
				continue;
			}

			const projectId = task['projectId'] || task['v2_project_id'] || task['project_id'];

			if (!groupedProjectsAndTasks[projectId]) {
				groupedProjectsAndTasks[projectId] = [];
			}

			groupedProjectsAndTasks[projectId].push(taskId);
		}

		const sortedProjects = data.sort((projectOne, projectTwo) => {
			if (sortBy === 'Focus Hours: Most-Least') {
				return projectTwo.focusDuration - projectOne.focusDuration;
			}

			return projectOne.focusDuration - projectTwo.focusDuration;
		});

		const tickTickProjects = [];
		const nonTickTickProjects = [];

		sortedProjects.forEach((project) => {
			if (projectsById[project.id]) {
				tickTickProjects.push(project);
			} else {
				nonTickTickProjects.push(project);
			}
		});

		const maxTickTickProjects = fromModal ? tickTickProjects.length : 5; // 3
		const maxNonTickTickProjects = fromModal
			? nonTickTickProjects.length
			: Math.min(5 - tickTickProjects.length, 5);

		return (
			<div>
				{tickTickProjects.slice(0, maxTickTickProjects).map((project) => {
					return (
						<ul key={project.id}>
							<Accordion
								title={
									<li className="text-[18px] cursor-pointer font-bold hover:underline">
										{/* TickTick tasks = "title", Todoist tasks = "content" */}
										<span className="">{project.name} </span>
										<span className="text-color-gray-25">
											({project.value}, {project.percentage}%)
										</span>
									</li>
								}
								openByDefault={!groupedTasksCollapsedByDefault}
								showArrowNextToText={true}
								customToggleOpen={() => {
									if (!fromModal) {
										setIsModalOpen(true);
									}
								}}
								preventOpen={!fromModal}
							>
								<div className="pl-6">
									{groupedProjectsAndTasks[project.id].map((taskId, index) => {
										return <div key={taskId + index}>{renderNestedTasks(taskId)}</div>;
									})}
								</div>
							</Accordion>
						</ul>
					);
				})}

				{nonTickTickProjects.length > 0 && (
					<div className="space-y-4">
						{fromModal && <div className="text-[24px] font-bold underline mt-4">Non-TickTick Projects</div>}
						{nonTickTickProjects.slice(0, maxNonTickTickProjects).map((item) => (
							<ProgressBar key={item.id} item={item} fromModal={fromModal} />
						))}
					</div>
				)}
			</div>
		);
	}

	const sortedOtherFocusRecordTasksData = otherFocusRecordTaskIds
		.sort((a, b) => {
			if (sortBy === 'Focus Hours: Most-Least') {
				return progressBarDataById[b].focusDuration - progressBarDataById[a].focusDuration;
			}

			return progressBarDataById[a].focusDuration - progressBarDataById[b].focusDuration;
		})
		.map((taskId) => progressBarDataById[taskId]);

	return (
		<div className={classNames(!fromModal && 'overflow-auto max-h-[230px]')}>
			{/* TickTick */}
			{sortedTasksWithNoParent.slice(0, maxTasksWithNoParent).map((taskId, index) => {
				return <div key={taskId + index}>{renderNestedTasks(taskId)}</div>;
			})}

			{/* Other (Session App, etc.) */}
			<div className="space-y-4">
				{sortedOtherFocusRecordTasksData.map((item) => (
					<ProgressBar key={item.id} item={item} fromModal={fromModal} />
				))}
			</div>
		</div>
	);
};

export default ProgressBarList;
