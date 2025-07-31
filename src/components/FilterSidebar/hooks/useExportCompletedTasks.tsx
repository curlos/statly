import {
	getGroupedSubtasksAndParentTasks,
	getTasksWithParentIdAndNoParent,
} from '../../../pages/ticktick-1.00/completed-tasks/DayWithCompletedTasks/getGroupedSubtasksAndParentTasks.util';
import { useFilterCompletedTasks } from '../../../pages/ticktick-1.00/completed-tasks/useFilterCompletedTasks';
import { useUserSettingsContext } from '../../../pages/ticktick-1.00/focus-records/useUserSettingsContext';
import { useGetTodoistAllProjectsQuery, useGetTodoistAllTasksQuery } from '../../../services/resources/oldFocusAppsApi';
import { useGetAllProjectsQuery, useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';

const useExportCompletedTasks = () => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById, ancestorTasksById } = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistAllTasksById } = useGetTodoistAllTasksQuery();
	const { todoistAllTasksById, todoistAncestorTasksById } = fetchedTodoistAllTasksById || {};

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	// RTK Query - Todoist - Projects
	const { data: fetchedTodoistAllProjects } = useGetTodoistAllProjectsQuery();
	const { todoistAllProjectsById } = fetchedTodoistAllProjects || {};

	// Context
	const {
		completedTasksPageSettings: { showIndentedTasks },
	} = useUserSettingsContext();

	const { filteredDaysWithCompletedTasks } = useFilterCompletedTasks();

	const getNestedTasksObj = (taskIds, groupedSubtasksByParentTask, parentDirectChildrenTaskIdsByParentId) => {
		const dayWithCompletedTasksIndentedObj = {};

		taskIds.forEach((parentTaskId) => {
			const parentTask = todoistAllTasksById[parentTaskId] || tasksById[parentTaskId];

			// These are the tasks who are direct children of the parent task. These will be rendered as completed checkboxes with the content.
			const directCompletedSubtasks = groupedSubtasksByParentTask[parentTask.id];

			const nextIndentedTaskIds = parentDirectChildrenTaskIdsByParentId[parentTaskId];

			dayWithCompletedTasksIndentedObj[parentTaskId] = {
				directCompletedSubtasks,
				parentDirectChildrenCompletedTasks:
					nextIndentedTaskIds &&
					nextIndentedTaskIds.length > 0 &&
					getNestedTasksObj(
						nextIndentedTaskIds,
						groupedSubtasksByParentTask,
						parentDirectChildrenTaskIdsByParentId
					),
			};
		});

		return dayWithCompletedTasksIndentedObj;
	};

	const getSterilizedDaysWithCompletedTasksIndented = () => {
		const sterilizedDaysWithCompletedTasksIndented = {};

		filteredDaysWithCompletedTasks.forEach((dateWithCompletedTasks) => {
			const { dateStr, completedTasksForDay } = dateWithCompletedTasks;

			const { groupedSubtasksByParentTask, parentTasks } = getGroupedSubtasksAndParentTasks({
				completedTasksForDay,
			});

			const { tasksWithParentId, tasksWithNoParent } = getTasksWithParentIdAndNoParent({
				completedTasksForDay,
				tasksById,
				todoistAllTasksById,
				ancestorTasksById,
				todoistAncestorTasksById,
			});

			const parentDirectChildrenTaskIdsByParentId = getParentDirectChildrenTaskIdsByParentId(tasksWithParentId);

			const nestedTasksObj = getNestedTasksObj(
				tasksWithNoParent,
				groupedSubtasksByParentTask,
				parentDirectChildrenTaskIdsByParentId
			);

			sterilizedDaysWithCompletedTasksIndented[dateStr] = nestedTasksObj;
		});

		return sterilizedDaysWithCompletedTasksIndented;
	};

	const getSterilizedDaysWithCompletedTasks = () => {
		const sterilizedDaysWithCompletedTasks = {};
		const numberOfCompletedTasksByDateStr = {};

		filteredDaysWithCompletedTasks.forEach((dateWithCompletedTasks) => {
			const { dateStr, completedTasksForDay } = dateWithCompletedTasks;

			const { groupedSubtasksByParentTask, parentTasks } = getGroupedSubtasksAndParentTasks({
				completedTasksForDay,
			});

			Object.keys(groupedSubtasksByParentTask).forEach((parentTaskId, i) => {
				const completedSubtasks = groupedSubtasksByParentTask[parentTaskId];
				const parentTask =
					(tasksById && tasksById[parentTaskId]) ||
					(todoistAllTasksById && todoistAllTasksById[parentTaskId]);
				const parentTaskTitle = parentTask?.title || parentTask?.content || parentTaskId;

				const parentTaskBreadcrumbsTickTick =
					parentTask && ancestorTasksById[parentTask.id] && Object.keys(ancestorTasksById[parentTask.id]);

				const parentTaskBreadcrumbsTodoist =
					parentTask &&
					todoistAncestorTasksById[parentTask.id] &&
					Object.keys(todoistAncestorTasksById[parentTask.id]);

				const parentTaskBreadcrumbs = parentTaskBreadcrumbsTickTick || parentTaskBreadcrumbsTodoist;

				if (!sterilizedDaysWithCompletedTasks[dateStr]) {
					sterilizedDaysWithCompletedTasks[dateStr] = [];
				}

				const ancestorTaskNames = parentTaskBreadcrumbs
					? parentTaskBreadcrumbs.map((taskId) => {
							const task = tasksById[taskId] || todoistAllTasksById[taskId];

							return task.title || task.content;
						})
					: [];

				const ancestorTaskNamesStr = ancestorTaskNames.join(' - ');

				const projectId = parentTask['projectId'] || parentTask['v2_project_id'] || parentTask['project_id'];
				const project = projectsById[projectId] || todoistAllProjectsById[projectId];

				const additionalTaskNameInfo = showIndentedTasks
					? ''
					: (ancestorTaskNamesStr ? ` - ${ancestorTaskNamesStr}` : '') +
						(project ? ` (${project.name})` : '') +
						` (${completedSubtasks.length})`;

				const name = parentTaskTitle + additionalTaskNameInfo;

				if (!numberOfCompletedTasksByDateStr[dateStr]) {
					numberOfCompletedTasksByDateStr[dateStr] = 0;
				}

				numberOfCompletedTasksByDateStr[dateStr] += completedSubtasks.length;

				sterilizedDaysWithCompletedTasks[dateStr].push({
					name: name,
					ancestorTaskIds: parentTaskBreadcrumbs,
					completedSubtasks,
					id: parentTask.id,
				});
			});
		});

		return {
			sterilizedDaysWithCompletedTasks,
			numberOfCompletedTasksByDateStr,
		};
	};

	/**
	 * @description Get and map the parent ids to their direct children. The array will contain the list of direct children (who are siblings to each other).
	 * @returns {Object}
	 */
	const getParentDirectChildrenTaskIdsByParentId = (tasksWithParentId) => {
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

	const handleCopyToClipboard = () => {
		if (showIndentedTasks) {
			const sterilizedDaysWithCompletedTasksIndented = getSterilizedDaysWithCompletedTasksIndented();

			const oldestToNewestDateStrs = Object.keys(sterilizedDaysWithCompletedTasksIndented).sort((a, b) => {
				return new Date(a) - new Date(b);
			});

			const allDaysMarkdown = [];

			oldestToNewestDateStrs.forEach((dateStr) => {
				console.log(dateStr);

				const indentedTasks = sterilizedDaysWithCompletedTasksIndented[dateStr];
				const dayTotalCompletedTasks = getTotalCompletedTasksFromIndentedData(indentedTasks);
				const dayCompletedTasksMarkdown = serializeNestedTasksToMarkdown(indentedTasks);
				allDaysMarkdown.push(`### 📅  ${dateStr} (${dayTotalCompletedTasks})\n\n` + dayCompletedTasksMarkdown);
			});

			const finalMarkdown = allDaysMarkdown.join('\n---\n');
			// Optional: copy to clipboard
			navigator.clipboard.writeText(finalMarkdown);

			return finalMarkdown;
		}

		const { sterilizedDaysWithCompletedTasks, numberOfCompletedTasksByDateStr } =
			getSterilizedDaysWithCompletedTasks();

		const allDaysWithCompletedTasksMarkdown = [];

		const oldestToNewestDateStrs = Object.keys(sterilizedDaysWithCompletedTasks).sort((a, b) => {
			return new Date(a) - new Date(b);
		});

		oldestToNewestDateStrs.forEach((dateStr) => {
			const dayWithCompletedTasksMarkdown = serializeDayWithCompletedTasks(
				dateStr,
				sterilizedDaysWithCompletedTasks[dateStr],
				numberOfCompletedTasksByDateStr[dateStr]
			);
			allDaysWithCompletedTasksMarkdown.push(dayWithCompletedTasksMarkdown);
		});

		const finalMarkdown = allDaysWithCompletedTasksMarkdown.join('\n');

		// Optional: copy to clipboard
		navigator.clipboard.writeText(finalMarkdown);

		return finalMarkdown;
	};

	function serializeDayWithCompletedTasks(dateStr, dayWithCompletedTasks, numberOfCompletedTasks) {
		const lines = [];
		lines.push(`### 📅 ${dateStr} (${numberOfCompletedTasks})\n`);

		dayWithCompletedTasks.forEach((parentTaskData, index) => {
			const { name, completedSubtasks } = parentTaskData;

			lines.push(`**📝 ${name}**`);

			completedSubtasks.forEach((task) => {
				lines.push(`- [x] ${task.title || task.content}`);
			});

			// Add an empty line after each task group, but no extra newline
			if (index !== dayWithCompletedTasks.length - 1) {
				lines.push('');
			}
		});

		lines.push('\n---\n');
		return lines.join('\n');
	}

	function serializeNestedTasksToMarkdown(data, level = 0) {
		const lines = [];

		for (const parentTaskId in data) {
			const entry = data[parentTaskId];
			const indent = '  '.repeat(level);

			const parentTask = tasksById[parentTaskId] || todoistAllTasksById[parentTaskId];
			const parentTaskName = parentTask?.title || parentTask?.content || parentTaskId;

			// Include the parent task ID as a bold header
			lines.push(`${indent}- **${parentTaskName}**`);

			// Render direct completed subtasks
			if (entry.directCompletedSubtasks?.length) {
				for (const task of entry.directCompletedSubtasks) {
					const taskName = task?.title || task?.content;
					const subIndent = '  '.repeat(level + 1); // one level deeper
					lines.push(`${subIndent}- [x] ${taskName}`);
				}
			}

			// Recursively render children
			if (entry.parentDirectChildrenCompletedTasks) {
				const childMarkdown = serializeNestedTasksToMarkdown(
					entry.parentDirectChildrenCompletedTasks,
					level + 1
				);
				lines.push(childMarkdown);
			}
		}

		return lines.join('\n');
	}

	const getTotalCompletedTasksFromIndentedData = (data) => {
		let allDirectCompletedTasksTotal = 0;

		for (const parentTaskId in data) {
			const entry = data[parentTaskId];
			allDirectCompletedTasksTotal += entry.directCompletedSubtasks ? entry.directCompletedSubtasks.length : 0;

			if (entry.parentDirectChildrenCompletedTasks) {
				allDirectCompletedTasksTotal += getTotalCompletedTasksFromIndentedData(
					entry.parentDirectChildrenCompletedTasks
				);
			}
		}

		return allDirectCompletedTasksTotal;
	};

	const downloadZipFolderOfGroupedCompletedTasks = (groupType) => {};

	return {
		handleCopyToClipboard,
		downloadZipFolderOfGroupedCompletedTasks,
	};
};

export default useExportCompletedTasks;
