/**
 * @description // Go through all of the Completed Tasks for the day and group them up together by parent. So, all of the tasks with the same parent will be in the same array like "{ "5391586608": [{...}, {...}, ...] }". Also, get the "parentTasks" which are the tasks that have no parent.
 * @returns {Object}
 */
export const getGroupedSubtasksAndParentTasks = ({ completedTasksForDay }) => {
	const groupedSubtasksByParentTask = {};
	const parentTasksArr = [];
	const parentTasksObj = {};

	for (const task of completedTasksForDay) {
		if (!task) {
			continue
		}

		const parentId = task.parentId;

		if (parentId) {
			if (!groupedSubtasksByParentTask[parentId]) {
				groupedSubtasksByParentTask[parentId] = [];
			}

			groupedSubtasksByParentTask[parentId].push(task);
		} else {
			// Sometimes it's possible for a parent task to appear more than once (not entirely sure how though) so need to check if it's already been pushed to the array first. This really seems to only happen for TickTick though. Times were a completed tasks appears twice. Possibly happens due to me completing it, uncompleting, and then completing it a second time after I actually finish it which makes it show up twice.
			if (!parentTasksObj[task.id]) {
				parentTasksArr.push(task);
				parentTasksObj[task.id] = true;
			}

			if (!groupedSubtasksByParentTask[task.id]) {
				groupedSubtasksByParentTask[task.id] = [];
			}

			groupedSubtasksByParentTask[task.id].push(task);
		}
	}

	return {
		groupedSubtasksByParentTask,
		parentTasks: parentTasksArr,
	};
};

/**
 * @description Go through each completed task for the day, get the breadcrumbs/ancestors for the task and go through all of the ancestors of that task and check whether or not the ancestor tasks have parent ids and store the value in "tasksWithParentId". This is necessary to capture all possible indented tasks for day in tasksWithParentId - including the ancestors.
 * @returns {Object}
 */
export const getTasksWithParentIdAndNoParent = ({
	completedTasksForDay,
	ancestorTasksById,
	includeDirectParentTasksWithNoChild
}) => {
	const tasksWithParentId = {};

	for (const task of completedTasksForDay) {
		if (!task) {
			continue
		}

		const groupTaskBreadcrumbs = task.ancestorIds

		if (groupTaskBreadcrumbs && groupTaskBreadcrumbs.length > 0) {
			// Go through each "taskId" and if it has a parentId, then map it to that parentId, else map it to null.
			groupTaskBreadcrumbs.forEach((taskId) => {
				const breadcrumbTask = taskId === task.id ? task : ancestorTasksById[taskId];

				if (breadcrumbTask.parentId) {
					tasksWithParentId[breadcrumbTask.id] = breadcrumbTask.parentId;
				} else {
					tasksWithParentId[breadcrumbTask.id] = null;
				}
			});
		} else if (includeDirectParentTasksWithNoChild) {
			tasksWithParentId[task.id] = null;
		}
	}

	const tasksWithNoParent = Object.keys(tasksWithParentId).filter((currentTaskId) => {
		return !tasksWithParentId[currentTaskId];
	});

	return {
		tasksWithParentId, // An object that maps a task to it's parent id. So, if you have "5412423976", then tasksWithParentId["5412423976"] would you give its parentId which is "5391586608".
		tasksWithNoParent, // These are the tasks that have NO PARENT ID. The uppermost tasks. This would include tasks like TickTick 2.0 (Web), Project: Twitter 2.0, most Hello Mobile tasks, etc.
	};
};