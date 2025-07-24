import { useFilterFocusRecords } from '../../../pages/ticktick-1.00/focus-records/useFilterFocusRecords';
import { useGetTodoistAllTasksQuery } from '../../../services/resources/oldFocusAppsApi';
import { useGetAllProjectsQuery, useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { formatDateTime, getFormattedShortMonthDay } from '../../../utils/date.utils';
import { getAllCompletedTasksDuringFocusRecord, getFocusDuration } from '../../../utils/focus-apps/focusRecords.utils';
import { getFormattedDuration } from '../../../utils/focus-apps/helpers.utils';
import { getFocusRecordFocusApp, getFocusRecordProperty } from '../../../utils/focus-apps/multiFocusApps.utils';

const useGetSterilizedFocusRecords = () => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById, ancestorTasksById, completedTasksGroupedByDate } = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistAllCompletedTasks } = useGetTodoistAllTasksQuery();
	const { todoistAllTasksById, todoistAncestorTasksById, todoistCompletedTasksGroupedByDate } =
		fetchedTodoistAllCompletedTasks || {};

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const { filteredFocusRecords } = useFilterFocusRecords();

	const getSterilizedFocusRecordList = () => {
		return filteredFocusRecords
			.sort((focusRecordOne, focusRecordTwo) => {
				const startTimeOneProperty = getFocusRecordProperty(focusRecordOne, 'startTime');
				const startTimeTwoProperty = getFocusRecordProperty(focusRecordTwo, 'startTime');

				const focusRecordOneStartTime = startTimeOneProperty;
				const focusRecordTwoStartTime = startTimeTwoProperty;

				const startTimeOne = new Date(focusRecordOneStartTime);
				const startTimeTwo = new Date(focusRecordTwoStartTime);

				return startTimeOne - startTimeTwo;
			})
			.map((focusRecord) => getSterilizedFocusRecord(focusRecord));
	};

	const getSterilizedFocusRecord = (focusRecord) => {
		const startTime = getFocusRecordProperty(focusRecord, 'startTime');
		const endTime = getFocusRecordProperty(focusRecord, 'endTime');
		const focusNote = getFocusRecordProperty(focusRecord, 'note');

		const startTimeObj = formatDateTime(startTime);
		const endTimeObj = formatDateTime(endTime);
		const duration = getFocusDuration({ focusRecord });

		const completedTasksDuringFocusSession = getAllCompletedTasksDuringFocusRecord({
			completedTasksGroupedByDate,
			todoistCompletedTasksGroupedByDate,
			focusRecord,
		});
		const completedTaskNames =
			completedTasksDuringFocusSession &&
			completedTasksDuringFocusSession.map((task) => task.title || task.content);

		const tasksData = getFocusRecordTaskData(focusRecord);

		const sterilizedFocusRecord = {
			dateAndDurationStr: `${getFormattedShortMonthDay(new Date(startTime))} ${startTimeObj.time} - ${endTimeObj.time} (${getFormattedDuration(duration, false)})`,
			tasksData: tasksData,
			completedTaskNames,
			note: focusNote,
		};

		return sterilizedFocusRecord;
	};

	const getFocusRecordTaskData = (focusRecord) => {
		const getTickTickFocusRecordTask = () => {
			const getTaskTitle = (task) => {
				const taskBreadCrumbs = getTickTickFocusRecordBreadcrumbs(task);

				const taskNamesPath = [task.title || 'No Name'];

				taskBreadCrumbs &&
					taskBreadCrumbs.forEach((taskId) => {
						const breadcrumbTask = tasksById[taskId];
						taskNamesPath.push(breadcrumbTask.title);
					});

				const taskId = task.taskId || task.id;

				const fullTask = tasksById[taskId];
				const taskProject = fullTask?.projectId && projectsById[fullTask?.projectId];
				const taskProjectName = taskProject ? taskProject.name : '';

				let taskNamePath = taskNamesPath.join(' - ');

				if (taskProjectName) {
					taskNamePath += ` (${taskProjectName})`;
				}

				return taskNamePath;
			};

			const tasksData = [];

			for (const task of focusRecord.tasks) {
				const { startTime, endTime, taskId } = task;

				const startTimeObj = formatDateTime(startTime);
				const endTimeObj = formatDateTime(endTime);
				const dateStr = `${startTimeObj.time} - ${endTimeObj.time}`;

				const taskTitle = getTaskTitle(task);
				tasksData.push({
					name: taskTitle,
					date: dateStr,
				});
			}

			return tasksData;
		};

		const getOtherAppsFocusRecordTask = () => {
			const startTime = getFocusRecordProperty(focusRecord, 'startTime');
			const endTime = getFocusRecordProperty(focusRecord, 'endTime');

			const startTimeObj = formatDateTime(startTime);
			const endTimeObj = formatDateTime(endTime);
			const dateStr = `${startTimeObj.time} - ${endTimeObj.time}`;

			const focusRecordTitle = getFocusRecordProperty(focusRecord, 'displayTitle');

			return [
				{
					name: focusRecordTitle,
					date: dateStr,
				},
			];
		};

		const getFocusRecordTask = () => {
			const focusApp = getFocusRecordFocusApp(focusRecord);

			switch (focusApp) {
				case 'TickTick':
					return getTickTickFocusRecordTask();
				default:
					return getOtherAppsFocusRecordTask();
			}
		};

		return getFocusRecordTask();
	};

	const getTickTickFocusRecordBreadcrumbs = (task) => {
		const parentTask = task;
		const parentTaskId = task.id || task.taskId;

		// Only checking TickTick because Todoist does not have Focus Records.
		const parentTaskBreadcrumbsTickTick =
			parentTask && ancestorTasksById[parentTaskId] && Object.keys(ancestorTasksById[parentTaskId]);

		const parentTaskBreadcrumbs = parentTaskBreadcrumbsTickTick;

		return parentTaskBreadcrumbs;
	};

	const serializeFocusRecordToMarkdown = (record) => {
		const { dateAndDurationStr, tasksData, completedTaskNames, note } = record;

		const lines = [];

		lines.push(``);
		lines.push(`### 📅 ${dateAndDurationStr}`);
		lines.push(``);

		// Tasks
		tasksData.forEach((task) => {
			lines.push(`**📝 ${task.name}**`);
			if (task.date) {
				lines.push(`*${task.date}*`);
			}
			lines.push('');
		});

		// Notes
		if (note) {
			lines.push(note.trim());
			lines.push('');
		}

		// Completed tasks
		if (completedTaskNames && completedTaskNames.length > 0) {
			lines.push(`**✅ Completed Tasks**`);
			completedTaskNames.forEach((taskName) => {
				lines.push(`- [x] ${taskName}`);
			});
			lines.push('');
		}

		return lines.join('\n');
	};

	const handleCopyToClipboard = () => {
		const sterilizedFocusRecordList = getSterilizedFocusRecordList();
		const allFocusRecordsMarkdown = [];

		for (let i = 0; i < sterilizedFocusRecordList.length; i++) {
			const sterilizedFocusRecord = sterilizedFocusRecordList[i];
			const focusRecordMarkdown = serializeFocusRecordToMarkdown(sterilizedFocusRecord);
			allFocusRecordsMarkdown.push(focusRecordMarkdown);

			// Add separator between records (but not after the last one)
			if (i !== sterilizedFocusRecordList.length - 1) {
				allFocusRecordsMarkdown.push('---\n');
			}
		}

		const finalMarkdown = allFocusRecordsMarkdown.join('\n');

		// Optional: copy to clipboard
		navigator.clipboard.writeText(finalMarkdown);
	};

	return { getSterilizedFocusRecordList, handleCopyToClipboard };
};

export default useGetSterilizedFocusRecords;
