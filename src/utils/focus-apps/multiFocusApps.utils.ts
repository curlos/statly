import { getEndTimeFromStartTimeAndDuration } from './focusRecords.utils';

export const getFocusRecordFocusApp = (focusRecord) => {
	return focusRecord.focusRecordApp || 'TickTick';
};

/**
 * @description The Session App does not have any tasks. It only has focus records, "tags", and "categories". "Tags" can be thought of sort of like tasks and "Categories" can be thought of as sort of like "Projects". Anyways, a custom taskId is created by using the title of the tag and the title of the category. This is the only way I see to uniquely identify a "task" in a Focus Record.
 * @param {Object} focusRecord
 * @returns {String}
 */
export const getSessionAppFocusRecordTaskId = (focusRecord) => {
	const { title, category } = focusRecord;
	const focusRecordTitle = title ? `${title} (${category.title})` : `${category.title}`;
	return focusRecordTitle;
};

export const getFocusRecordProperty = (focusRecord, property) => {
	const focusApp = getFocusRecordFocusApp(focusRecord);

	const fromTickTick = focusApp === 'TickTick';
	const fromSessionApp = focusApp === 'session-app';
	const fromBeFocusedApp = focusApp === 'be-focused-app';
	const fromForestApp = focusApp === 'forest-app';
	const fromTideApp = focusApp === 'tide-ios-app';

	const getTaskId = () => {
		if (fromTickTick) {
			return '';
		}

		if (fromSessionApp) {
			const { title, category } = focusRecord;
			const focusRecordTitle = title ? `${title} (${category.title})` : `${category.title}`;
			return focusRecordTitle;
		}

		if (fromTideApp) {
			return focusRecord.name;
		}

		return '';
	};

	const getStartTime = () => {
		if (fromTickTick) {
			return focusRecord.startTime;
		}

		if (fromSessionApp) {
			return focusRecord['start_date'];
		}

		if (fromTideApp) {
			return focusRecord.startTime;
		}

		return '';
	};

	const getEndTime = () => {
		if (fromTickTick) {
			return focusRecord.endTime;
		}

		if (fromSessionApp) {
			return focusRecord['end_date'];
		}

		if (fromTideApp) {
			return getEndTimeFromStartTimeAndDuration(focusRecord.startTime, focusRecord.duration);
		}

		return '';
	};

	const getNote = () => {
		if (fromTickTick) {
			return focusRecord.note;
		}

		if (fromSessionApp) {
			return focusRecord.notes;
		}

		return '';
	};

	const getKey = () => {
		if (fromTickTick) {
			return focusRecord.id;
		}

		if (fromSessionApp) {
			return `${focusRecord['start_date']} - ${focusRecord['end_date']}`;
		}

		if (fromTideApp) {
			return `${focusRecord.name} - ${focusRecord.startTime} - ${focusRecord.duration} ${focusRecord.focusRecordApp}`;
		}
	};

	const getDisplayTitle = () => {
		if (fromSessionApp) {
			const { title, category } = focusRecord;
			return title ? `${title} (${category.title})` : `${category.title}`;
		}

		if (fromTideApp) {
			return focusRecord.name;
		}

		return '';
	};

	switch (property) {
		case 'taskId':
			return getTaskId();
		case 'startTime':
			return getStartTime();
		case 'endTime':
			return getEndTime();
		case 'note':
			return getNote();
		case 'key':
			return getKey();
		case 'displayTitle':
			return getDisplayTitle();
	}
};

export const isTickTickProject = (project) => {
	return project.name;
};
export const isSessionAppProject = (project) => {
	return project.title;
};

/**
 * @description
 * - TickTick = Project or List
 * - Session App = Category
 * @param {Object} project
 * @param {String} property
 * @returns
 */
export const getProjectProperty = (project, property) => {
	const fromTickTick = isTickTickProject(project);
	const fromSessionApp = isSessionAppProject(project);

	switch (property) {
		case 'id':
			if (fromTickTick) {
				return project.id;
			}

			if (fromSessionApp) {
				return project.id || 'General';
			}

			return '';
		case 'color':
			if (fromTickTick) {
				return project.color;
			}

			if (fromSessionApp) {
				return project['hex_color'];
			}

			return '';
		case 'name':
			if (fromTickTick) {
				return project.name;
			}

			if (fromSessionApp) {
				return project['title'];
			}

			return '';
	}
};
