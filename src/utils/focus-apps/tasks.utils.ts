import { getFormattedLongDay } from '../date.utils';

export const getAllTasksAndItemsTickTickOne = (tasks) => {
	const allTasksAndItems = [];

	for (let task of tasks) {
		const { items } = task;

		allTasksAndItems.push(task);

		for (let item of items) {
			allTasksAndItems.push(item);
		}
	}

	return allTasksAndItems;
};

/**
 * @description Get all of the parent/ancestor task ids for a task. For example, "Focus Records Page" would have two: "TickTick 1.0 Stats Integration -> TickTick 2.0 (Web)." Works for both TickTick and Todoist tasks.
 * @param {Object} task
 * @param {Object} tasksById
 * @returns {Array<String>}
 */
const getAncestorTasksById = (task, tasksById) => {
	const ancestorTasksById = {};

	const getParentTask = (task) => {
		const parentId = task?.parentId || task?.parent_id;
		const parentTask = parentId && tasksById[parentId];

		if (parentTask) {
			ancestorTasksById[parentTask.id] = true;

			getParentTask(parentTask);
		}
	};

	getParentTask(task);

	return ancestorTasksById;
};

/**
 * @description Groups the array of tasks from TickTick by date, project, and tag.
 * @param {Array<Object>} tasks
 * @returns {Object}
 */
export const getGroupedCompletedTasks = (tasks, tasksById) => {
	const allCompletedTasks = [];
	const completedTasksGroupedByDate = {};
	const completedTasksGroupedByProject = {};
	const completedTasksGroupedByTag = {};

	const storeTaskInCompletedDateKey = (completedTime, task, projectId, tags, itemParentTaskId) => {
		const completedTimeDate = new Date(completedTime);
		const completedTimeKey = getFormattedLongDay(completedTimeDate);

		// Some "tasks" are actually "items", a simple version of a full task on TickTick 1.0. These simple items do not include a project ID or tags because they can only be associated with a full parent task and never be by themselves. Because of this, the logic here will pass down and associate any projectId or tags from the full parent task to the child. So, if a full task's project was "Hello Mobile", then its items (or children) would inherit that "projectId" as well and also be for "Hello Mobile".
		const taskWithAllProperties = {
			...task,
			projectId,
			...(tags !== undefined && { tags }),
			itemParentTaskId: itemParentTaskId ? itemParentTaskId : null,
		};

		if (!completedTasksGroupedByDate[completedTimeKey]) {
			completedTasksGroupedByDate[completedTimeKey] = [];
		}

		if (!completedTasksGroupedByProject[projectId]) {
			completedTasksGroupedByProject[projectId] = [];
		}

		if (tags) {
			for (let tag of tags) {
				if (!completedTasksGroupedByTag[tag]) {
					completedTasksGroupedByTag[tag] = [];
				}

				completedTasksGroupedByTag[tag].push(taskWithAllProperties);
			}
		}

		completedTasksGroupedByDate[completedTimeKey].push(taskWithAllProperties);
		completedTasksGroupedByProject[projectId].push(taskWithAllProperties);
		allCompletedTasks.push(taskWithAllProperties);
	};

	const ancestorTasksById = {};

	for (let task of tasks) {
		const { completedTime, items, projectId, tags } = task;
		const noCompletedTasksOrTaskItems = !completedTime && (!items || items.length === 0);

		if (noCompletedTasksOrTaskItems) {
			continue;
		}

		if (completedTime) {
			storeTaskInCompletedDateKey(completedTime, task, projectId, tags);
		}

		const ancestorTasksByIdOfTask = getAncestorTasksById(task, tasksById);

		ancestorTasksById[task.id] = ancestorTasksByIdOfTask;

		for (let item of items) {
			const { completedTime } = item;

			if (completedTime) {
				storeTaskInCompletedDateKey(completedTime, item, projectId, tags, task.id);
			}
		}
	}

	return {
		completedTasksGroupedByDate,
		completedTasksGroupedByProject,
		completedTasksGroupedByTag,
		allCompletedTasks,
		ancestorTasksById,
	};
};

/**
 * @description Gets the grouped completed tasks from Todoist. Only be date currently since that's all I have access to but in the future, if I somehow secure the FULL Todoist Tasks with the linked project and other info then this function can be expanded.
 * @param {Array<Object>} tasks
 * @returns {Object}
 */
export const getGroupedTodoistCompletedTasks = (tasks, todoistAllTasksById) => {
	const todoistCompletedTasksGroupedByDate = {};

	const storeTaskInCompletedDateKey = (completed_at, task) => {
		const completedTimeDate = new Date(completed_at);
		const completedTimeKey = getFormattedLongDay(completedTimeDate);

		if (!todoistCompletedTasksGroupedByDate[completedTimeKey]) {
			todoistCompletedTasksGroupedByDate[completedTimeKey] = [];
		}

		todoistCompletedTasksGroupedByDate[completedTimeKey].push(task);
	};

	const ancestorTasksById = {};

	for (let task of tasks) {
		const { completed_at } = task;

		if (!completed_at) {
			continue;
		}

		const ancestorTasksByIdOfTask = getAncestorTasksById(task, todoistAllTasksById);

		ancestorTasksById[task.id] = ancestorTasksByIdOfTask;

		storeTaskInCompletedDateKey(completed_at, task);
	}

	return {
		todoistCompletedTasksGroupedByDate,
		ancestorTasksById,
	};
};

export const findMatchingTaskOrAncestor = (task, taskIdToMatch, ancestorTasksById) => {
	const taskIds = [task.id, task.parentId, task.itemParentTaskId];

	// If the task or the task's parent is the ID from the URL.
	for (let taskId of taskIds) {
		if (String(taskId) === String(taskIdToMatch)) {
			return true;
		}
	}

	for (let taskId of taskIds) {
		const ancestorTasksByIdForTask = ancestorTasksById[taskId];

		if (ancestorTasksByIdForTask) {
			if (ancestorTasksByIdForTask[taskIdToMatch]) {
				return true;
			}
		}
	}
};
