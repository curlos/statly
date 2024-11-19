import { getFormattedLongDay, sortObjectByDateKeys, sortArrayByProperty } from '../date.utils';
import { getFocusRecordFocusApp } from './multiFocusApps.utils';

/**
 * @description For TickTick 1.0, Session, Forest, BeFocused, and Tide Focus Records
 */
export const getFocusDuration = ({ focusRecord, onlyTasks, filterByTaskId }) => {
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

			// Calculate the total duration in seconds
			const durationSeconds = (end - start) / 1000; // Convert milliseconds to seconds
			return durationSeconds;
		}

		if (onlyTasks) {
			const { tasks } = focusRecord;
			let totalDurationSeconds = 0;

			for (const task of tasks) {
				const { startTime, endTime, taskId } = task;

				if (filterByTaskId && (!taskId || taskId !== filterByTaskId)) {
					continue;
				}

				// Convert ISO string times to Date objects
				const start = new Date(startTime);
				const end = new Date(endTime);
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

export const getFocusDurationFilteredByProjects = (focusRecord, filteredProjects) => {
	const { tasks } = focusRecord;
	let totalDurationSeconds = 0;

	const filteredTasks = tasks.filter((task) => {
		const taskIsFromFilteredProjects = filteredProjects[task.projectName];
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
		const { startTime, endTime, note, tasks } = focusRecord;

		const dayTitle = getFormattedLongDay(new Date(startTime));

		if (!groupedFocusRecordsByDate[dayTitle]) {
			groupedFocusRecordsByDate[dayTitle] = [];
		}

		groupedFocusRecordsByDate[dayTitle].push(focusRecord);
	});

	// Sort all the items by their date key (from oldest to most recent)
	const sortedGroupedFocusDataByDate = groupedFocusRecordsByDate && sortObjectByDateKeys(groupedFocusRecordsByDate);

	const sortedGroupedFocusRecordsAsc = {};

	Object.keys(sortedGroupedFocusDataByDate).forEach((day, index) => {
		const focusRecordsForTheDay = sortedGroupedFocusDataByDate[day];
		const sortedFocusRecordsForTheDay = sortArrayByProperty(focusRecordsForTheDay, 'startTime', 'ascending');
		sortedGroupedFocusRecordsAsc[day] = sortedFocusRecordsForTheDay;
	});

	return sortedGroupedFocusRecordsAsc;
};

/**
 * @description Gets the array of focus records and groups them by a unique taskId. Each taskId will a value that is the array of sorted focus records in ascending order by start time for the day.
 */
export const getGroupedFocusRecordsByTask = (focusRecords, tasksById) => {
	const groupedFocusRecordsByTask = {};

	// Create the groupedByTasks
	focusRecords.forEach((focusRecord) => {
		const { tasks } = focusRecord;

		const focusRecordTasksById = {};

		tasks.forEach((task) => {
			const { taskId } = task;

			const taskAlreadyInFocusRecord = focusRecordTasksById[taskId];

			// If the task in the list of "tasks" has already appeared in one of the earlier tasks in the focus record, then we don't we need to re-add it, as we've already the whole focus record and ALL of it's tasks. So, if we pushed a second focus record here when it's grouped by task, it would duplicate the focus record and show it a 2nd, 3rd, 4th, etc. time. This is only important for tasks of the same id as if the taskId has not already appeared before, then the focus record should appear a second time but in the different task.
			if (!taskAlreadyInFocusRecord && taskId) {
				if (!groupedFocusRecordsByTask[taskId]) {
					groupedFocusRecordsByTask[taskId] = [];
				}

				const focusRecordWithOnlyTasksOfThatTaskId = {
					...focusRecord,
					tasks: tasks.filter((task) => task.taskId === taskId),
				};

				groupedFocusRecordsByTask[taskId].push(focusRecordWithOnlyTasksOfThatTaskId);
				focusRecordTasksById[taskId] = true;
			}
		});
	});

	// Go through all the groupedByTasks and the focus records and inside the focus records, filter out any tasks that do not have the same "taskId" as the key.
	// This can't be done in the previous forEach loop because I need to know which tasks are CONNECTED to which focus records which can only truly be seen by having them all in the array first.
	Object.keys(groupedFocusRecordsByTask).forEach((taskId) => {
		const focusRecords = groupedFocusRecordsByTask[taskId];

		groupedFocusRecordsByTask[taskId] = focusRecords.map((focusRecord) => {
			const { tasks } = focusRecord;

			return {
				...focusRecord,
				// tasks: tasks.filter((task) => task.taskId === taskId),
			};
		});
	});

	const sortedGroupedFocusRecordsAsc = {};

	Object.keys(groupedFocusRecordsByTask).forEach((taskId, index) => {
		const focusRecordsForTheTask = groupedFocusRecordsByTask[taskId];
		const sortedFocusRecordsForTheTask = sortArrayByProperty(focusRecordsForTheTask, 'startTime', 'ascending');
		sortedGroupedFocusRecordsAsc[taskId] = sortedFocusRecordsForTheTask;
	});

	return sortedGroupedFocusRecordsAsc;
};

export const getFocusDurationFromArray = (focusRecords, onlyTasks, taskId) => {
	let totalFocusDuration = 0;

	focusRecords?.forEach((focusRecord) => {
		totalFocusDuration += getFocusDuration({ focusRecord, onlyTasks, filterByTaskId: taskId });
	});

	return totalFocusDuration;
};

export const getEndTimeFromStartTimeAndDuration = (startTime, duration, durationInSeconds = false) => {
	// Create a Date object from the startTime string
	const startTimeDate = new Date(startTime);

	console.log(startTimeDate);

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
