/**
 * @description
 * @returns {Object}
 */
export const getGroupedSubtasksAndParentTasks = ({
	completedTasksForDay,
	tasksById,
	todoistAllTasksById,
	ancestorTasksById,
	todoistAncestorTasksById,
}) => {
	const groupedSubtasksByParentTask = {};
	const parentTasksArr = [];
	const parentTasksObj = {};

	completedTasksForDay.forEach((task) => {
		const { itemParentTaskId, parent_id } = task;

		const parentId = itemParentTaskId || parent_id || task.parentId;

		if (parentId) {
			if (!groupedSubtasksByParentTask[parentId]) {
				groupedSubtasksByParentTask[parentId] = [];
			}

			groupedSubtasksByParentTask[parentId].push(task);
		} else {
			// Sometimes it's possible for a parent task to appear more than once (not entirely sure how though) so need to check if it's already been pushed to the array first.
			if (!parentTasksObj[task.id]) {
				parentTasksArr.push(task);
				parentTasksObj[task.id] = true;
			}
		}
	});

	// New Grouping Logic
	const tasksWithParentId = {};

	completedTasksForDay.forEach((task) => {
		const groupTask = task.itemParentTaskId
			? tasksById[task.itemParentTaskId]
			: tasksById[task.id] || todoistAllTasksById[task.id];

		const groupTaskBreadcrumbsTickTick =
			groupTask && ancestorTasksById[groupTask.id] && Object.keys(ancestorTasksById[groupTask.id]);

		const groupTaskBreadcrumbsTodoist =
			groupTask && todoistAncestorTasksById[groupTask.id] && Object.keys(todoistAncestorTasksById[groupTask.id]);

		let groupTaskBreadcrumbs = groupTaskBreadcrumbsTickTick || groupTaskBreadcrumbsTodoist;

		if (groupTaskBreadcrumbs) {
			groupTaskBreadcrumbs = task.itemParentTaskId
				? [task.itemParentTaskId, ...groupTaskBreadcrumbs]
				: groupTaskBreadcrumbs;

			groupTaskBreadcrumbs.forEach((taskId) => {
				const task = tasksById[taskId] || todoistAllTasksById[taskId];
				const taskParent = task.parentId || task['parent_id'] || task.itemParentTaskId;

				if (taskParent) {
					tasksWithParentId[task.id] = taskParent;
				} else {
					tasksWithParentId[task.id] = null;
				}
			});
		} else {
			const taskParent = task.parentId || task['parent_id'] || task.itemParentTaskId;

			if (taskParent) {
				tasksWithParentId[task.id] = taskParent;
			} else {
				tasksWithParentId[task.id] = null;
			}
		}
	});

	const tasksWithNoParent = Object.keys(tasksWithParentId).filter((currentTaskId) => {
		return !tasksWithParentId[currentTaskId];
	});

	return {
		groupedSubtasksByParentTask,
		parentTasks: parentTasksArr,
		tasksWithParentId,
		tasksWithNoParent,
	};
};
