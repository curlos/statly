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
 * @description Groups the array of tasks from TickTick by date, project, and tag.
 * @param {Array<Object>} tasks
 * @returns {Object}
 */
export const getGroupedCompletedTasks = (tasks) => {
	const allCompletedTasks = [];
	const completedTasksGroupedByDate = {};
	const completedTasksGroupedByProject = {};
	const completedTasksGroupedByTag = {};

	const storeTaskInCompletedDateKey = (completedTime, task, projectId, tags) => {
		const completedTimeDate = new Date(completedTime);
		const completedTimeKey = getFormattedLongDay(completedTimeDate);

		// Some "tasks" are actually "items", a simple version of a full task on TickTick 1.0. These simple items do not include a project ID or tags because they can only be associated with a full parent task and never be by themselves. Because of this, the logic here will pass down and associate any projectId or tags from the full parent task to the child. So, if a full task's project was "Hello Mobile", then its items (or children) would inherit that "projectId" as well and also be for "Hello Mobile".
		const taskWithAllProperties = { ...task, projectId, ...(tags !== undefined && { tags }) };

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

	for (let task of tasks) {
		const { completedTime, items, projectId, tags } = task;
		const noCompletedTasksOrTaskItems = !completedTime && (!items || items.length === 0);

		if (noCompletedTasksOrTaskItems) {
			continue;
		}

		if (completedTime) {
			storeTaskInCompletedDateKey(completedTime, task, projectId, tags);
		}

		for (let item of items) {
			const { completedTime } = item;

			if (completedTime) {
				storeTaskInCompletedDateKey(completedTime, item, projectId, tags);
			}
		}
	}

	return {
		completedTasksGroupedByDate,
		completedTasksGroupedByProject,
		completedTasksGroupedByTag,
		allCompletedTasks,
	};
};

/**
 * @description Gets the grouped completed tasks from Todoist. Only be date currently since that's all I have access to but in the future, if I somehow secure the FULL Todoist Tasks with the linked project and other info then this function can be expanded.
 * @param {Array<Object>} tasks
 * @returns {Object}
 */
export const getGroupedTodoistCompletedTasks = (tasks) => {
	const todoistCompletedTasksGroupedByDate = {};

	const storeTaskInCompletedDateKey = (completed_at, task) => {
		const completedTimeDate = new Date(completed_at);
		const completedTimeKey = getFormattedLongDay(completedTimeDate);

		if (!todoistCompletedTasksGroupedByDate[completedTimeKey]) {
			todoistCompletedTasksGroupedByDate[completedTimeKey] = [];
		}

		todoistCompletedTasksGroupedByDate[completedTimeKey].push(task);
	};

	for (let task of tasks) {
		const { completed_at } = task;

		if (!completed_at) {
			continue;
		}

		storeTaskInCompletedDateKey(completed_at, task);
	}

	return {
		todoistCompletedTasksGroupedByDate,
	};
};
