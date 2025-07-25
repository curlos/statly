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
		completedTasksPageSettings: { groupedTasksCollapsedByDefault, showIndentedTasks },
	} = useUserSettingsContext();

	const { filteredDaysWithCompletedTasks } = useFilterCompletedTasks();

	const getSterilizedDaysWithCompletedTasks = () => {
		const sterilizedDaysWithCompletedTasks = {};
		const numberOfCompletedTasksByDateStr = {};

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

				const name =
					parentTaskTitle +
					(ancestorTaskNamesStr ? ` - ${ancestorTaskNamesStr}` : '') +
					(project ? ` (${project.name})` : '') +
					` (${completedSubtasks.length})`;

				if (!numberOfCompletedTasksByDateStr[dateStr]) {
					numberOfCompletedTasksByDateStr[dateStr] = 0;
				}

				numberOfCompletedTasksByDateStr[dateStr] += completedSubtasks.length;

				sterilizedDaysWithCompletedTasks[dateStr].push({
					name: name,
					ancestorTaskIds: parentTaskBreadcrumbs,
					completedSubtasks,
				});
			});
		});

		return {
			sterilizedDaysWithCompletedTasks,
			numberOfCompletedTasksByDateStr,
		};
	};

	const handleCopyToClipboard = () => {
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

	const downloadZipFolderOfGroupedCompletedTasks = (groupType) => {};

	return {
		handleCopyToClipboard,
		downloadZipFolderOfGroupedCompletedTasks,
	};
};

export default useExportCompletedTasks;
