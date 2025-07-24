import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useFilterFocusRecords } from '../../../pages/ticktick-1.00/focus-records/useFilterFocusRecords';
import {
	useGetSessionAppFocusRecordsQuery,
	useGetTodoistAllTasksQuery,
} from '../../../services/resources/oldFocusAppsApi';
import { useGetAllProjectsQuery, useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { formatDateTime, getFormattedShortMonthDay } from '../../../utils/date.utils';
import {
	getAllCompletedTasksDuringFocusRecord,
	getFocusDuration,
	getFocusDurationFromArray,
} from '../../../utils/focus-apps/focusRecords.utils';
import { getFormattedDuration } from '../../../utils/focus-apps/helpers.utils';
import { getFocusRecordFocusApp, getFocusRecordProperty } from '../../../utils/focus-apps/multiFocusApps.utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { findMatchingTaskOrAncestor } from '../../../utils/focus-apps/tasks.utils';

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

	// RTK Query - Session App - Focus Records
	const { data: fetchedSessionFocusRecords, isLoading: isLoadingGetSessionFocusRecords } =
		useGetSessionAppFocusRecordsQuery();
	const { sessionCategoriesById } = fetchedSessionFocusRecords || {};

	const { searchParams } = useSearchParamsContext();

	const { filteredFocusRecords } = useFilterFocusRecords();

	const getSterilizedFocusRecordList = (groupById = false) => {
		const sterilizedFocusRecords = [];
		const sterilizedFocusRecordsByProjectId = [];
		const sterilizedFocusRecordsByTaskId = [];

		filteredFocusRecords
			.sort((focusRecordOne, focusRecordTwo) => {
				const startTimeOneProperty = getFocusRecordProperty(focusRecordOne, 'startTime');
				const startTimeTwoProperty = getFocusRecordProperty(focusRecordTwo, 'startTime');

				const focusRecordOneStartTime = startTimeOneProperty;
				const focusRecordTwoStartTime = startTimeTwoProperty;

				const startTimeOne = new Date(focusRecordOneStartTime);
				const startTimeTwo = new Date(focusRecordTwoStartTime);

				return startTimeOne - startTimeTwo;
			})
			.forEach((focusRecord) => {
				const sterilizedFocusRecord = getSterilizedFocusRecord(focusRecord);
				sterilizedFocusRecords.push(sterilizedFocusRecord);

				if (groupById) {
					const duration = getFocusDuration({ focusRecord, onlyTasks: true });
					const focusApp = getFocusRecordFocusApp(focusRecord);
					const uniqueProjectIds = new Set();
					const uniqueTaskIds = new Set();

					if (focusRecord.tasks && focusRecord.tasks.length > 0 && tasksById) {
						const { tasks } = focusRecord;

						tasks.forEach((task) => {
							uniqueTaskIds.add(task.taskId);

							const taskWithFullInfo = tasksById[task.taskId];

							if (!taskWithFullInfo) {
								uniqueProjectIds.add('no-project-id');
							} else {
								uniqueProjectIds.add(taskWithFullInfo.projectId);
							}
						});

						sterilizedFocusRecord.tasksData.forEach((task) => {
							task?.ancestorTaskIds?.forEach((taskId) => {
								uniqueTaskIds.add(taskId);
							});
						});
					}

					if (focusApp === 'session-app') {
						const categoryId = focusRecord.category.id || 'General';
						uniqueProjectIds.add(categoryId);
					}

					if (focusApp !== 'TickTick') {
						const taskId = getFocusRecordProperty(focusRecord, 'taskId');
						uniqueTaskIds.add(taskId);
					}

					uniqueProjectIds.forEach((projectId) => {
						if (!sterilizedFocusRecordsByProjectId[projectId]) {
							sterilizedFocusRecordsByProjectId[projectId] = {
								focusRecords: [],
								focusDuration: 0,
							};
						}

						sterilizedFocusRecordsByProjectId[projectId].focusRecords.push(sterilizedFocusRecord);
						sterilizedFocusRecordsByProjectId[projectId].focusDuration += duration;
					});

					uniqueTaskIds.forEach((taskId) => {
						if (!sterilizedFocusRecordsByTaskId[taskId]) {
							sterilizedFocusRecordsByTaskId[taskId] = {
								focusRecords: [],
								focusDuration: 0,
							};
						}

						const taskFocusDuration = getFocusDuration({
							focusRecord,
							onlyTasks: true,
							filterByTaskId: taskId,
							ancestorTasksById,
							showTaskAncestors: true,
							taskIdIncludeFocusRecordsFromSubtasks: true,
						});

						const sterilizedFocusRecordOnlyWithTaskIds = { ...sterilizedFocusRecord };
						sterilizedFocusRecordOnlyWithTaskIds.tasksData =
							sterilizedFocusRecordOnlyWithTaskIds.tasksData.filter((task) => {
								// If the task is NOT directly in the Focus Record's tasks, then look through all of othe Focus Record's task's breadcrumbs and check if the taskId is an ancestor of one of those tasks.
								const foundMatchingTaskOrAncestor = findMatchingTaskOrAncestor(
									task,
									taskId,
									ancestorTasksById
								);

								return foundMatchingTaskOrAncestor;
							});

						sterilizedFocusRecordsByTaskId[taskId].focusRecords.push(sterilizedFocusRecordOnlyWithTaskIds);
						sterilizedFocusRecordsByTaskId[taskId].focusDuration += taskFocusDuration;
					});
				}
			});

		console.log(sterilizedFocusRecordsByTaskId);

		return {
			sterilizedFocusRecords,
			sterilizedFocusRecordsByProjectId,
			sterilizedFocusRecordsByTaskId,
		};
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
			const getAncestorTaskIds = (task) => {
				const ancestorTaskIds = getTickTickFocusRecordBreadcrumbs(task);
				return ancestorTaskIds;
			};

			const getTaskTitle = (task, ancestorTaskIds) => {
				const taskNamesPath = [task.title || 'No Name'];

				ancestorTaskIds &&
					ancestorTaskIds.forEach((taskId) => {
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

				const ancestorTaskIds = getAncestorTaskIds(task);
				const taskTitle = getTaskTitle(task, ancestorTaskIds);
				tasksData.push({
					name: taskTitle,
					date: dateStr,
					id: taskId,
					ancestorTaskIds,
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

	const getTitleInfo = (focusRecords) => {
		const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
		const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
		const taskIdFromUrl = searchParams.get('task-id');
		const filterByTaskId = taskIdFromUrl || false;

		const startDateFromUrlDate = new Date(startDateFromUrl);
		const endDateFromUrlDate = new Date(endDateFromUrl);

		const totalFocusDuration = getFocusDurationFromArray({
			focusRecords: focusRecords,
			onlyTasks: true,
			taskId: filterByTaskId,
			ancestorTasksById,
			showTaskAncestors: true,
			taskIdIncludeFocusRecordsFromSubtasks: true,
			startDate: startDateFromUrlDate,
			endDate: endDateFromUrlDate,
		});

		return `Focus Records (${(focusRecords?.length || 0).toLocaleString()}) - ${getFormattedDuration(totalFocusDuration, false)}`;
	};

	const handleCopyToClipboard = () => {
		const { sterilizedFocusRecords } = getSterilizedFocusRecordList();
		const finalMarkdown = getFocusRecordsMarkdown(sterilizedFocusRecords);

		// Optional: copy to clipboard
		navigator.clipboard.writeText(finalMarkdown);
	};

	const downloadZipFolderOfGroupedFocusRecords = (groupType) => {
		const { sterilizedFocusRecordsByProjectId, sterilizedFocusRecordsByTaskId } =
			getSterilizedFocusRecordList(true);

		const zip = new JSZip();

		const groupedFocusRecords =
			groupType === 'project' ? sterilizedFocusRecordsByProjectId : sterilizedFocusRecordsByTaskId;

		// 1. Convert grouped object to array and sort by focusDuration (descending)
		const sortedGroups = Object.entries(groupedFocusRecords)
			.map(([groupId, { focusRecords, focusDuration }]) => ({
				groupId,
				focusRecords,
				focusDuration,
			}))
			.sort((a, b) => b.focusDuration - a.focusDuration);

		// 2. Add files to ZIP
		sortedGroups.forEach(({ groupId, focusRecords, focusDuration }, index) => {
			const groupName =
				groupType === 'project'
					? groupId !== 'no-project-id'
						? projectsById[groupId]?.name || 'Unnamed Project'
						: 'No Project ID'
					: groupId !== 'no-task-id'
						? tasksById[groupId]?.title || tasksById[groupId]?.content || tasksById[groupId]?.name
						: 'No Task Id';

			const formattedDuration = getFormattedDuration(focusDuration, false); // e.g. 12h30m
			const paddedIndex = String(index + 1).padStart(2, '0');

			// Title used in the markdown content
			const customTitle = `${groupName} - Focus Records (${focusRecords.length}) - ${formattedDuration}`;
			const markdown = getFocusRecordsMarkdown(focusRecords, customTitle);

			// Filename for the markdown file
			const sanitizedName = `${paddedIndex}_${groupName}_${formattedDuration}`.replace(/[\/\\?%*:|"<>]/g, '-');
			zip.file(`${sanitizedName}.md`, markdown);
		});

		zip.generateAsync({ type: 'blob' }).then((blob) => {
			saveAs(blob, 'FocusRecords.zip');
		});
	};

	const getFocusRecordsMarkdown = (sterilizedFocusRecords, customTitle) => {
		const titleInfo = customTitle || getTitleInfo();
		const allFocusRecordsMarkdown = [];

		// Add title as H1 at the beginning
		allFocusRecordsMarkdown.push(`# ${titleInfo}\n`);

		for (let i = 0; i < sterilizedFocusRecords.length; i++) {
			const sterilizedFocusRecord = sterilizedFocusRecords[i];
			const focusRecordMarkdown = serializeFocusRecordToMarkdown(sterilizedFocusRecord);
			allFocusRecordsMarkdown.push(focusRecordMarkdown);

			// Add separator between records (but not after the last one)
			if (i !== sterilizedFocusRecords.length - 1) {
				allFocusRecordsMarkdown.push('---\n');
			}
		}

		const finalMarkdown = allFocusRecordsMarkdown.join('\n');
		return finalMarkdown;
	};

	return { handleCopyToClipboard, downloadZipFolderOfGroupedFocusRecords };
};

export default useGetSterilizedFocusRecords;
