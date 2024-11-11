import { getFocusDurationFromArray, getRandomColor, getFormattedDuration } from '../../../../utils/helpers.utils';
import { checkIfInboxProject } from '../../../../utils/tickTickOne.util';

export const getDataByProjects = (allFocusRecordsForInterval, focusDurationForInterval, tasksById, projectsById) => {
	const focusRecordsGroupedByProject = {};

	// Default it to the "Inbox" project if the focus record has no task with a project.
	const INBOX_PROJECT_ID = 'inbox116577688';

	allFocusRecordsForInterval.forEach((focusRecord) => {
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
	});

	// console.log(focusRecordsGroupedByProject);

	let sum = 0;
	// console.log(Object.values(focusRecordsGroupedByProject).forEach((arr) => (sum += arr.length)));
	// console.log(sum);

	return Object.keys(focusRecordsGroupedByProject).map((projectId) => {
		const focusRecordsArr = focusRecordsGroupedByProject[projectId];
		const focusDurationForProject = getFocusDurationFromArray(focusRecordsArr);

		// const numOfFocusRecords = focusRecordsArr.length;

		const percentage = Number(((focusDurationForProject / focusDurationForInterval) * 100).toFixed(2));

		const isFromInboxProject = checkIfInboxProject(projectId);

		let name = 'Inbox';
		let color = 'green';

		if (!isFromInboxProject) {
			const project = projectsById[projectId];
			name = project.name;

			if (project.color) {
				color = project.color;
			} else {
				// If there's no color, assign a random color.
				color = getRandomColor();
			}
		}

		return {
			name,
			color,
			value: getFormattedDuration(focusDurationForProject, false),
			percentage,
		};
	});
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

export const getDataByTags = (allFocusRecordsForInterval, focusDurationForInterval, tasksById) => {
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
						// console.log(tasksById[taskId]);

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

	// console.log(focusRecordsGroupedByTag);

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
		const focusDurationForTag = getFocusDurationFromArray(focusRecordsArr);
		const totalFocusDuration = getFocusDurationFromArray(allFocusRecordsForInterval);
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
