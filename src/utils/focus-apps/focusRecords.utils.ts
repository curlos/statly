import { getFormattedLongDay, sortObjectByDateKeys, sortArrayByProperty, isTimeBetween, areDatesEqual, formatDateTime } from '../date.utils';
import { getFocusRecordFocusApp, getFocusRecordProperty } from './multiFocusApps.utils';
import { findMatchingTaskOrAncestor } from './tasks.utils';
import { getFormattedDuration } from './helpers.utils';
import { EMOTIONS } from '../constants/constants.utils';

const sourceToAppName: Record<string, string> = {
	'FocusRecordSession': 'Session',
	'FocusRecordBeFocused': 'Be Focused',
	'FocusRecordForest': 'Forest',
	'FocusRecordTide': 'Tide'
};

/**
 * @description For TickTick 1.0, Session, Forest, BeFocused, and Tide Focus Records
 */
export const getFocusDuration = ({
	focusRecord,
	onlyTasks,
	filterByTaskId,
	showTaskAncestors,
	ancestorTasksById,
	taskIdIncludeFocusRecordsFromSubtasks,
	startDate
}) => {
	const focusApp = getFocusRecordFocusApp(focusRecord);

	const getTickTickFocusDuration = () => {
		const isTaskFromFocusRecord = focusRecord?.taskId;
		const focusRecordWithoutTask = !focusRecord?.tasks;

		if (isTaskFromFocusRecord || focusRecordWithoutTask) {
			const task = focusRecord;
			const { startTime, endTime } = task;

			// Convert ISO string times to Date objects
			const start = new Date(startTime);
			const end = new Date(endTime);

			const durationSecondsBasedOnStartDate = getDurationSecondsBasedOnStartDate(startDate, start, end)

			if (durationSecondsBasedOnStartDate > 0) {
				return durationSecondsBasedOnStartDate
			}

			// Calculate the total duration in seconds
			const durationSeconds = (end - start) / 1000; // Convert milliseconds to seconds
			return durationSeconds;
		}

		if (onlyTasks) {
			const { tasks } = focusRecord;
			let totalDurationSeconds = 0;

			for (const task of tasks) {
				const { startTime, endTime, taskId } = task;
				const isNotDirectTask = taskId !== filterByTaskId;

				if (filterByTaskId) {
					if (!taskId) {
						continue;
					}

					if (showTaskAncestors && taskIdIncludeFocusRecordsFromSubtasks && ancestorTasksById) {
						const foundMatchingTaskOrAncestor = findMatchingTaskOrAncestor(
							task,
							filterByTaskId,
							ancestorTasksById
						);

						if (!foundMatchingTaskOrAncestor) {
							continue;
						}
					} else if (isNotDirectTask) {
						continue;
					}
				}

				// Convert ISO string times to Date objects
				const start = new Date(startTime);
				const end = new Date(endTime);

				const durationSecondsBasedOnStartDate = getDurationSecondsBasedOnStartDate(startDate, start, end)

				if (durationSecondsBasedOnStartDate > 0) {
					totalDurationSeconds += durationSecondsBasedOnStartDate
					continue
				}

				// Calculate the total duration in seconds
				const durationSeconds = (end - start) / 1000; // Convert milliseconds to seconds
				totalDurationSeconds += durationSeconds;
			}

			return totalDurationSeconds;
		}

		const { startTime, endTime, pauseDuration } = focusRecord;

		// Convert ISO string times to Date objects
		const start = new Date(startTime);
		const end = new Date(endTime);

		const durationSecondsBasedOnStartDate = getDurationSecondsBasedOnStartDate(startDate, start, end)

		if (durationSecondsBasedOnStartDate > 0) {
			// Subtracting the pause duration here will not necessarily be 100% accurate because TickTick does not tell me when the pause duration starts and ends. It only tells me the total amount of time the focus record was paused for without telling me the specific affected days. Thus, there is potential for some inaccuracies. However, this is better than not subtracting the pause duration. Days like November 10, 2020 had 1 focus record where I paused for a whole day (55,000 seconds) so that needs to be subtracted.
			return (durationSecondsBasedOnStartDate - pauseDuration)
		}

		// Calculate the total duration in seconds
		const totalDurationSeconds = (end - start) / 1000; // Convert milliseconds to seconds

		// Subtract the pause duration to get the real focus time
		const realFocusTimeSeconds = totalDurationSeconds - pauseDuration;

		return realFocusTimeSeconds;
	};

	switch (focusApp) {
		case 'TickTick':
			return getTickTickFocusDuration();
		case 'session-app':
			return focusRecord['duration_second'];
		case 'tide-ios-app':
			return formattedDurationStrToSeconds(focusRecord.duration);
		case 'forest-app':
			return getForestDurationSec(focusRecord['Start Time'], focusRecord['End Time']);
		case 'be-focused-app':
			return focusRecord.Duration * 60;
	}
};

const getDurationSecondsBasedOnStartDate = (startDate, start, end) => {
	let durationSeconds = 0

	if (startDate) {
		const midnightDate = new Date(end.getTime())
		midnightDate.setHours(0,0,0,0)

		if (areDatesEqual(start, startDate) && !areDatesEqual(end, startDate)) {
			durationSeconds = (midnightDate.getTime() - start.getTime()) / 1000
		} else if (!areDatesEqual(start, startDate) && areDatesEqual(end, startDate)) {
			durationSeconds = (end.getTime() - midnightDate.getTime()) / 1000
		}
	}

	return durationSeconds
}

export const getFocusDurationFilteredByProjects = (focusRecord, filteredProjects, tasksById) => {
	const { tasks } = focusRecord;
	let totalDurationSeconds = 0;

	const filteredTasks = tasks.filter((task) => {
		let taskIsFromFilteredProjects = filteredProjects[task.projectName]

		if (tasksById[task.taskId]) {
			const { projectId } = tasksById[task.taskId]
			taskIsFromFilteredProjects = filteredProjects[projectId];
		}
		
		return taskIsFromFilteredProjects;
	});

	filteredTasks.forEach((task) => {
		const { startTime, endTime } = task;

		// Convert ISO string times to Date objects
		const start = new Date(startTime);
		const end = new Date(endTime);

		// Calculate the total duration in seconds
		const durationSeconds = (end - start) / 1000; // Convert milliseconds to seconds
		totalDurationSeconds += durationSeconds;
	});

	return totalDurationSeconds;
};

/**
 * @description Gets the array of focus records and groups them by a unique date key. Each date key will a value that is the array of sorted focus records in ascending order by start time for the day.
 */
export const getGroupedFocusRecordsByDate = (focusRecords) => {
	const groupedFocusRecordsByDate = {};

	focusRecords?.forEach((focusRecord) => {
		const startTime = getFocusRecordProperty(focusRecord, 'startTime');

		const dayTitle = getFormattedLongDay(new Date(startTime));

		if (!groupedFocusRecordsByDate[dayTitle]) {
			groupedFocusRecordsByDate[dayTitle] = [];
		}

		groupedFocusRecordsByDate[dayTitle].push(focusRecord);
	});

	const focusRecordsIncludingDayBeforeAndAfter = getFocusRecordsIncludingDayBeforeAndAfter(groupedFocusRecordsByDate)

	// Sort all the items by their date key (from oldest to most recent)
	const sortedGroupedFocusDataByDate = focusRecordsIncludingDayBeforeAndAfter && sortObjectByDateKeys(focusRecordsIncludingDayBeforeAndAfter);

	const sortedGroupedFocusRecordsAsc = {};

	Object.keys(sortedGroupedFocusDataByDate).forEach((day, index) => {
		const focusRecordsForTheDay = sortedGroupedFocusDataByDate[day];
		const sortedFocusRecordsForTheDay = sortArrayByProperty(focusRecordsForTheDay, 'startTime', 'ascending');
		sortedGroupedFocusRecordsAsc[day] = sortedFocusRecordsForTheDay;
	});

	return sortedGroupedFocusRecordsAsc;
};

const getFocusRecordsIncludingDayBeforeAndAfter = (groupedFocusRecordsByDate) => {
	const focusRecordsIncludingDayBeforeAndAfter = {}

	for (let dayKey of Object.keys(groupedFocusRecordsByDate)) {
		const currentDay = new Date(dayKey)
	
		const dayBefore = new Date(currentDay.getTime())
		dayBefore.setDate(currentDay.getDate() - 1)
		
		const dayAfter = new Date(currentDay.getTime())
		dayAfter.setDate(currentDay.getDate() + 1)

		const currentDayKey = getFormattedLongDay(currentDay);
		const dayBeforeKey = getFormattedLongDay(dayBefore);
		const dayAfterKey = getFormattedLongDay(dayAfter);
		const dayBeforeFocusRecords = groupedFocusRecordsByDate[dayBeforeKey];
		const dayAfterFocusRecords = groupedFocusRecordsByDate[dayAfterKey];

		const focusRecordsForTheDay = [];

		const dayBeforeFocusRecordsThatEndAtDate = getFocusRecordsThatEndAtDate(dayBeforeFocusRecords, currentDay)
		const dayAfterFocusRecordsThatEndAtDate = getFocusRecordsThatEndAtDate(dayAfterFocusRecords, currentDay)

		if (dayBeforeFocusRecordsThatEndAtDate?.length > 0) {
			focusRecordsForTheDay.push(...dayBeforeFocusRecordsThatEndAtDate)
		}

		if (groupedFocusRecordsByDate[currentDayKey]?.length > 0) {
			focusRecordsForTheDay.push(...groupedFocusRecordsByDate[currentDayKey])
		}

		if (dayAfterFocusRecordsThatEndAtDate?.length > 0) {
			focusRecordsForTheDay.push(...dayAfterFocusRecordsThatEndAtDate)
		}

		focusRecordsIncludingDayBeforeAndAfter[dayKey] = focusRecordsForTheDay
	}

	return focusRecordsIncludingDayBeforeAndAfter
}

export const getFocusRecordsThatEndAtDate = (focusRecords, date) => {
	if (!focusRecords) {
		return []
	}

	const focusRecordsThatEndAtDate = []

	for (const focusRecord of focusRecords) {
		const { startTime, endTime } = focusRecord

		const partOfFocusRecordInCurrentDay = areDatesEqual(date, new Date(startTime)) || areDatesEqual(date, new Date(endTime))

		if (partOfFocusRecordInCurrentDay) {
			focusRecordsThatEndAtDate.push(focusRecord)
		}
	}

	return focusRecordsThatEndAtDate
}

export const getFocusDurationFromArray = ({
	focusRecords,
	onlyTasks=true,
	taskId,
	ancestorTasksById,
	showTaskAncestors,
	taskIdIncludeFocusRecordsFromSubtasks,
	startDate,
	endDate
}) => {
	let totalFocusDuration = 0;

	focusRecords?.forEach((focusRecord) => {
		totalFocusDuration += getFocusDuration({
			focusRecord,
			onlyTasks,
			filterByTaskId: taskId,
			ancestorTasksById,
			showTaskAncestors,
			taskIdIncludeFocusRecordsFromSubtasks,
			startDate,
			endDate
		});
	});

	return totalFocusDuration;
};

export const getEndTimeFromStartTimeAndDuration = (startTime, duration, durationInSeconds = false) => {
	// Create a Date object from the startTime string
	const startTimeDate = new Date(startTime);

	if (durationInSeconds) {
		startTimeDate.setSeconds(startTimeDate.getSeconds() + duration);
		const newEndTimeStr = startTimeDate.toString();

		return newEndTimeStr;
	}

	// Regular expression to parse the duration string
	const durationRegex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
	const matches = duration.match(durationRegex);

	// Extract hours, minutes, and seconds from the duration string
	const hours = parseInt(matches[1], 10) || 0;
	const minutes = parseInt(matches[2], 10) || 0;
	const seconds = parseInt(matches[3], 10) || 0;

	// Add duration to startTime
	startTimeDate.setHours(startTimeDate.getHours() + hours);
	startTimeDate.setMinutes(startTimeDate.getMinutes() + minutes);
	startTimeDate.setSeconds(startTimeDate.getSeconds() + seconds);

	const newEndTimeStr = startTimeDate.toString();

	return newEndTimeStr;
};

function formattedDurationStrToSeconds(duration) {
	// Regular expression to parse the duration string
	const durationRegex = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/;
	const matches = duration.match(durationRegex);

	// Extract hours, minutes, and seconds from the duration string
	const hours = parseInt(matches[1], 10) || 0;
	const minutes = parseInt(matches[2], 10) || 0;
	const seconds = parseInt(matches[3], 10) || 0;

	// Calculate total seconds
	return hours * 3600 + minutes * 60 + seconds;
}

export const getForestDurationSec = (startTimeStr, endTimeStr) => {
	const startTimeDate = new Date(startTimeStr);
	const endTimeDate = new Date(endTimeStr);

	// Calculate the difference in milliseconds
	const differenceInMilliseconds = endTimeDate - startTimeDate;

	// Convert milliseconds to seconds
	const differenceInSeconds = differenceInMilliseconds / 1000;
	const durationInSeconds = differenceInSeconds;

	return durationInSeconds;
};

export const getAllCompletedTasksDuringFocusRecord = ({
	completedTasksGroupedByDate,
	todoistCompletedTasksGroupedByDate,
	focusRecord,
}) => {
	if (!completedTasksGroupedByDate || !todoistCompletedTasksGroupedByDate) {
		return [];
	}

	const startTime = getFocusRecordProperty(focusRecord, 'startTime');
	const endTime = getFocusRecordProperty(focusRecord, 'endTime');

	const startTimeDate = new Date(startTime);
	const endTimeDate = new Date(endTime);
	const startTimeKey = getFormattedLongDay(startTimeDate);
	const endTimeKey = getFormattedLongDay(endTimeDate);
	const startAndEndTimeHappenedOnSameDay = startTimeKey === endTimeKey;

	// TickTick Completed Tasks
	let completedTasksDuringFocusSession = [];

	const completedTasksInStartTimeDay = completedTasksGroupedByDate[startTimeKey];

	completedTasksDuringFocusSession = getCompletedTasksBetweenTimes(
		completedTasksInStartTimeDay,
		startTimeDate,
		endTimeDate
	);

	// Todoist Completed Tasks
	let todoistCompletedTasksDuringFocusSession = [];

	const todoistCompletedTasksInStartTimeDay = todoistCompletedTasksGroupedByDate[startTimeKey];

	todoistCompletedTasksDuringFocusSession = getCompletedTasksBetweenTimes(
		todoistCompletedTasksInStartTimeDay,
		startTimeDate,
		endTimeDate
	);

	// I would think this scenario is very rare since I don't work at midnight anymore but basically if the start and end times were to happen on different days (September 13, 2024 11:05PM to September 14, 2024 1:12AM), then you need to grab the completed tasks for the end time's date as well.
	// TODO: Should be possible to actually test this when I bring over the focus records from 2021 and early 2022 since I did do a lot of work at midnight back then so the start and end time's would be different. Test this out after bringing over the records from back then.
	if (!startAndEndTimeHappenedOnSameDay) {
		const completedTasksInEndTimeDay = completedTasksGroupedByDate[endTimeKey];

		if (completedTasksInEndTimeDay) {
			completedTasksDuringFocusSession.push(
				...getCompletedTasksBetweenTimes(completedTasksInEndTimeDay, startTimeDate, endTimeDate)
			);
		}

		const todoistCompletedTasksInEndTimeDay = todoistCompletedTasksGroupedByDate[endTimeKey];

		if (todoistCompletedTasksInEndTimeDay) {
			todoistCompletedTasksDuringFocusSession.push(
				...getCompletedTasksBetweenTimes(todoistCompletedTasksInEndTimeDay, startTimeDate, endTimeDate)
			);
		}
	}

	const allCompletedTasksDuringFocusRecord = [...completedTasksDuringFocusSession, ...todoistCompletedTasksDuringFocusSession]

	allCompletedTasksDuringFocusRecord.sort((taskA, taskB) => {
		const taskACompletedTime = taskA.completedTime || taskA['completed_at'];
		const taskACompletedTimeDate = new Date(taskACompletedTime);

		const taskBCompletedTime = taskB.completedTime || taskB['completed_at'];
		const taskBCompletedTimeDate = new Date(taskBCompletedTime);

		return taskACompletedTimeDate - taskBCompletedTimeDate
	})

	return allCompletedTasksDuringFocusRecord;
};

export const getCompletedTasksBetweenTimes = (completedTasksInTimeDay, startTimeDate, endTimeDate) => {
	if (!completedTasksInTimeDay) {
		return [];
	}

	return completedTasksInTimeDay.filter((completedTask) => {
		const completedTime = completedTask.completedTime || completedTask['completed_at'];
		const completedTimeDate = new Date(completedTime);

		// Passed in an offset of 10 minutes between the start and end times because often times, I don't actually complete a task during the literal focus record session but a little after it or maybe even before it. So, I feel like this would handle most of the completed task scenarios during a focus record.
		const completedDuringFocusSession = isTimeBetween(completedTimeDate, startTimeDate, endTimeDate, 10);

		return completedDuringFocusSession;
	});
};

/**
 * @description Serializes a focus record to markdown format
 * Used for copying focus records to clipboard and exporting them
 * @param record - The focus record to serialize
 * @param showFocusRecordEmotions - Whether to include emotions in the output
 * @param ancestorTasksById - Optional map of task IDs to task objects for getting ancestors
 * @param projectsById - Optional map of project IDs to project objects for getting project names
 */
export const serializeFocusRecordToMarkdown = (
	record: any,
	showFocusRecordEmotions: boolean = true,
	ancestorTasksById?: Record<string, any>,
	projectsById?: Record<string, any>
) => {
	const { startTime, endTime, duration, tasks, completedTasks, note, emotions, source } = record;

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);

	// Check if focus record crosses midnight
	const startDate = new Date(startTime);
	const endDate = new Date(endTime);
	const crossesMidnight = getFormattedLongDay(startDate) !== getFormattedLongDay(endDate);

	// Build date string with both dates if crosses midnight
	let dateStr = getFormattedLongDay(startDate);
	if (crossesMidnight) {
		dateStr += ` - ${getFormattedLongDay(endDate)}`;
	}
	dateStr += ` - ${startTimeObj.time} - ${endTimeObj.time} (${getFormattedDuration(duration, false)})`;

	const lines: string[] = [];

	// Date and duration
	lines.push(`### 📅 ${dateStr}`);

	// Tasks
	if (tasks && tasks.length > 0) {
		tasks.forEach((task: any) => {
			const taskStartTimeObj = formatDateTime(task.startTime);
			const taskEndTimeObj = formatDateTime(task.endTime);
			const taskTimeRange = `${taskStartTimeObj.time} - ${taskEndTimeObj.time}`;

			// Format task title with ancestors if available
			let taskTitle = task.title;
			const projectName = sourceToAppName[source] || projectsById?.[task?.projectId]?.name

			if (ancestorTasksById && task.taskId) {
				const parentTask = ancestorTasksById[task.taskId];
				if (parentTask) {
					const parentTaskTitle = parentTask.title || parentTask.content || task.title;
					const ancestorIds = parentTask.ancestorIds?.filter((id: string) => id !== task.taskId) || [];

					// Build breadcrumb trail
					const breadcrumbs = ancestorIds.map((ancestorId: string) => {
						const ancestorTask = ancestorTasksById[ancestorId];
						return ancestorTask?.title || ancestorTask?.content || ancestorId;
					});

					// Format: **MainTask** > Ancestor1 > Ancestor2
					if (breadcrumbs.length > 0) {
						taskTitle = `**${parentTaskTitle}** > ${breadcrumbs.join(' > ')}`;
					} else {
						taskTitle = `**${parentTaskTitle}**`;
					}
				}
			}

			// Add project name if available
			const projectSuffix = projectName ? ` - (${projectName})` : '';
			lines.push(`📝 ${taskTitle}${projectSuffix}: ${taskTimeRange}`);
		});
	}

	// Notes
	if (note) {
		lines.push(note.trim());
	}

	// Completed tasks
	if (completedTasks && completedTasks.length > 0) {
		lines.push(''); // Add blank line for separation
		lines.push(`###### ✅ Completed Tasks`);
		completedTasks.forEach((task: any) => {
			lines.push(`- [x] ${task.title}`);
		});
	}

	// Emotions
	if (showFocusRecordEmotions) {
		if (emotions && emotions.length > 0) {
			lines.push(''); // Add blank line for separation
			lines.push(`###### ❤️ Emotions`);
			emotions.forEach((emotionObj: any) => {
				const emotionData = EMOTIONS[emotionObj.emotion as keyof typeof EMOTIONS];
				const emoji = emotionData?.emoji || '';
				const emotionName = emotionData?.name || emotionObj.emotion.toUpperCase();
				const formattedScore = (emotionObj.score * 100).toFixed(0);
				lines.push(`- ${emoji} ${emotionName} - ${formattedScore}%`);
			});
		} else {
			const noneEmoji = EMOTIONS.none?.emoji || '⚫';
			lines.push(''); // Add blank line for separation
			lines.push(`###### ❤️ Emotions`);
			lines.push(`- ${noneEmoji} NONE`);
		}
	}

	return lines.join('\n');
};