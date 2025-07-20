import { FOCUS_APPS } from '../../../../utils/constants/constants.utils';
import { getFocusDurationFromArray } from '../../../../utils/focus-apps/focusRecords.utils';
import { getRandomColor, getFormattedDuration } from '../../../../utils/focus-apps/helpers.utils';
import { getFocusRecordFocusApp, getFocusRecordProperty } from '../../../../utils/focus-apps/multiFocusApps.utils';
import { checkIfInboxProject } from '../../../../utils/tickTickOne.util';

/**
 * @description Gets the focus record data grouped by project and shows much time has been focused for each project.
 * @param allFocusRecordsForInterval 
 * @param focusDurationForInterval 
 * @param tasksById 
 * @param projectsById
 * @returns <Array<Object>> Example: [{
		"name": "Hello Mobile",
		"color": "#1F67E2",
		"value": "714h51m",
		"percentage": 53.38
	}, ...]
 */
export const getDataByProjects = ({
	allFocusRecordsForInterval,
	focusDurationForInterval,
	tasksById,
	projectsById,
	sessionCategoriesById,
	startDate
}) => {
	const focusRecordsGroupedByProject = {};

	// Default it to the "Inbox" project if the focus record has no task with a project.
	const INBOX_PROJECT_ID = 'inbox116577688';

	allFocusRecordsForInterval.forEach((focusRecord) => {
		const focusApp = getFocusRecordFocusApp(focusRecord);

		if (focusApp === 'TickTick') {
			const { tasks } = focusRecord;

			if (tasks?.length > 0) {
				for (const task of tasks) {
					const { taskId } = task;
					let projectKey = INBOX_PROJECT_ID;

					if (taskId) {
						if (tasksById[taskId]) {
							const { projectId } = tasksById[taskId];
							projectKey = projectId;
						}
					}

					if (!focusRecordsGroupedByProject[projectKey]) {
						focusRecordsGroupedByProject[projectKey] = [];
					}

					focusRecordsGroupedByProject[projectKey].push(task);
				}
			} else {
				// If there are no tasks in the focus records, there is no connected project, so just put it in the "Inbox" project by default.
				if (!focusRecordsGroupedByProject[INBOX_PROJECT_ID]) {
					focusRecordsGroupedByProject[INBOX_PROJECT_ID] = [];
				}

				focusRecordsGroupedByProject[INBOX_PROJECT_ID].push(focusRecord);
			}
		} else if (focusApp === 'session-app') {
			sessionCategoriesById[focusRecord.category.id];
			const projectKey = focusRecord.category.id || 'General';

			if (!focusRecordsGroupedByProject[projectKey]) {
				focusRecordsGroupedByProject[projectKey] = [];
			}

			focusRecordsGroupedByProject[projectKey].push(focusRecord);
		} else {
			const projectKey = focusApp;

			if (!focusRecordsGroupedByProject[projectKey]) {
				focusRecordsGroupedByProject[projectKey] = [];
			}

			focusRecordsGroupedByProject[projectKey].push(focusRecord);
		}
	});

	const dataByProjects = Object.keys(focusRecordsGroupedByProject).map((projectId) => {
		const focusRecordsArr = focusRecordsGroupedByProject[projectId];
		const focusDurationForProject = getFocusDurationFromArray({ focusRecords: focusRecordsArr, startDate });

		const percentage = Number(((focusDurationForProject / focusDurationForInterval) * 100).toFixed(2));

		const isFromInboxProject = checkIfInboxProject(projectId);
		const isFromGeneralSessionAppProject = projectId === 'General';
		const isNotFromTickTickOrSessionApp =
			projectId === 'forest-app' || projectId === 'be-focused-app' || projectId === 'tide-ios-app';
		const isFromDefaultProject =
			isFromInboxProject || isFromGeneralSessionAppProject || isNotFromTickTickOrSessionApp;

		let name = 'Inbox';
		let color = 'green';

		if (!isFromDefaultProject) {
			const isTickTickProject = projectsById[projectId];
			const isSessionCategory = sessionCategoriesById[projectId];

			if (isTickTickProject) {
				const project = projectsById[projectId];
				name = project.name;

				if (project.color) {
					color = project.color;
				} else {
					// If there's no color, assign a random color.
					color = getRandomColor();
				}
			} else if (isSessionCategory) {
				const category = sessionCategoriesById[projectId];
				name = `${category.title} (Session App)`;

				if (category.hex_color) {
					color = category.hex_color;
				} else {
					// If there's no color, assign a random color.
					color = getRandomColor();
				}
			}
		} else if (isFromGeneralSessionAppProject) {
			name = 'General (Session App)';
		} else if (isNotFromTickTickOrSessionApp) {
			name = `${FOCUS_APPS[projectId].name} (App)`;
			color = getRandomColor();
		}

		return {
			name,
			color,
			value: getFormattedDuration(focusDurationForProject, false),
			percentage,
		};
	});

	return dataByProjects;
};

/**
 * @description Gets the focus record data grouped by tasks and shows much time has been focused for each task.
 * @param allFocusRecordsForInterval 
 * @param focusDurationForInterval 
 * @param tasksById 
 * @returns <Array<Object>> Example: [{
		"name": "TickTick 2.0 (Web)",
		"color": "rgb(168, 73, 61)",
		"value": "241h9m",
		"percentage": 18.01
	}, ...]
 */
export const getDataByTasks = ({ allFocusRecordsForInterval, focusDurationForInterval, tasksById, startDate }) => {
	const focusRecordsGroupedByTask = {};
	const NO_TASK_KEY = 'No Task';

	// Get all the focus records tied to a specific taskId with the taskId being the key and the value being the array of focus records.
	allFocusRecordsForInterval.forEach((focusRecord) => {
		const { tasks } = focusRecord;

		if (tasks?.length > 0) {
			for (const task of tasks) {
				const taskId = task?.taskId ? task.taskId : NO_TASK_KEY;

				if (!focusRecordsGroupedByTask[taskId]) {
					focusRecordsGroupedByTask[taskId] = [];
				}

				focusRecordsGroupedByTask[taskId].push(task);
			}
		} else {
			// console.log(focusRecord)
			// debugger
			
			const taskId = getFocusRecordProperty(focusRecord, 'taskId')

			if (taskId) {
				// If there are no tasks in the focus records, put it in the default "NO TASK" array.
				if (!focusRecordsGroupedByTask[taskId]) {
					focusRecordsGroupedByTask[taskId] = [];
				}

				focusRecordsGroupedByTask[taskId].push(focusRecord);
			} else {
				// If there are no tasks in the focus records, put it in the default "NO TASK" array.
				if (!focusRecordsGroupedByTask[NO_TASK_KEY]) {
					focusRecordsGroupedByTask[NO_TASK_KEY] = [];
				}

				focusRecordsGroupedByTask[NO_TASK_KEY].push(focusRecord);
			}
		}
	});

	// Go through all the "taskId" keys and get the name, color, value, and percentage of that taskId.
	const dataByTasks = Object.keys(focusRecordsGroupedByTask).map((taskId, i) => {
		const focusRecordsArr = focusRecordsGroupedByTask[taskId];
		const focusDurationForProject = getFocusDurationFromArray({ focusRecords: focusRecordsArr, startDate });

		const percentage = Number(((focusDurationForProject / focusDurationForInterval) * 100).toFixed(2));

		let name = taskId;
		const color = getRandomColor();
		let id = `${taskId}-${i}`

		if (taskId !== 'No Task') {
			const task = tasksById[taskId];

			if (task) {
				name = task.title;
				id = `${taskId}-${i}`
			}
		}

		return {
			name,
			color,
			value: getFormattedDuration(focusDurationForProject, false),
			percentage,
			id
		};
	});

	return dataByTasks;
};

const addFocusRecordToUnclassified = (taskFromFocusRecord, focusRecordsGroupedByTag) => {
	// Default it to the "Unclassified" tag if the focus record has no task with a project.
	const UNCLASSIFIED_KEY = 'UNCLASSIFIED';

	// If there are no tasks in the focus records, there is no connected project, so just put it in the "Inbox" project by default.
	if (!focusRecordsGroupedByTag[UNCLASSIFIED_KEY]) {
		focusRecordsGroupedByTag[UNCLASSIFIED_KEY] = [];
	}

	focusRecordsGroupedByTag[UNCLASSIFIED_KEY].push(taskFromFocusRecord);
};

export const getDataByTags = ({ allFocusRecordsForInterval, focusDurationForInterval, tasksById, startDate }) => {
	const focusRecordsGroupedByTag = {};

	allFocusRecordsForInterval.forEach((focusRecord) => {
		const { tasks } = focusRecord;

		if (!tasks || tasks.length === 0) {
			addFocusRecordToUnclassified(focusRecord, focusRecordsGroupedByTag);
		} else {
			for (const task of tasks) {
				const { taskId } = task;

				if (!taskId || !tasksById[taskId]) {
					addFocusRecordToUnclassified(task, focusRecordsGroupedByTag);
				} else {
					const { tags } = tasksById[taskId];

					if (!tags || tags.length === 0) {
						addFocusRecordToUnclassified(task, focusRecordsGroupedByTag);
					} else {
						for (let tagName of tags) {
							if (!focusRecordsGroupedByTag[tagName]) {
								focusRecordsGroupedByTag[tagName] = [];
							}

							focusRecordsGroupedByTag[tagName].push(task);
						}
					}
				}
			}
		}
	});

	const taskAlreadyAppearedInAnotherTag = {};

	return Object.keys(focusRecordsGroupedByTag).map((tagName) => {
		const focusRecordsArr = focusRecordsGroupedByTag[tagName];
		const filteredFocusRecordsArr =
			tagName === 'UNCLASSIFIED'
				? focusRecordsArr
				: focusRecordsArr.filter((focusRecord) => {
						const { tasks } = focusRecord;
						return focusRecord;
					});
		const focusDurationForTag = getFocusDurationFromArray({ focusRecords: focusRecordsArr, startDate });
		const totalFocusDuration = getFocusDurationFromArray({ focusRecords: allFocusRecordsForInterval, startDate });
		const percentage = Number(((focusDurationForTag / focusDurationForInterval) * 100).toFixed(2));

		const isUnclassifiedTag = tagName === 'UNCLASSIFIED';

		let name = 'Unclassified';
		let color = 'green';

		// TODO: The numbers beind the grouped tags seems to be a bit off and don't all add up the final number of focused hours over an interval. Very strange. Look into this later!
		// if (isUnclassifiedTag) {
		// 	console.log('TAGs Focus Records: ');
		// 	console.log(focusRecordsArr);
		// 	console.log('All Fcous Records:');
		// 	console.log(allFocusRecordsForInterval);
		// }

		if (!isUnclassifiedTag) {
			const tag = tagsByRawName[tagName];
			name = tag.name;

			if (tag.color) {
				color = tag.color;
			} else {
				// If there's no color, assign a random color.
				color = getRandomColor();
			}
		}

		return {
			name,
			color,
			value: getFormattedDuration(focusDurationForTag, false),
			percentage,
		};
	});
};
