export const isTickTickFocusRecord = (focusRecord) => {
	return focusRecord.tasks;
};
export const isSessionAppFocusRecord = (focusRecord) => {
	return focusRecord?.focusRecordApp === 'session-app';
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
	const fromTickTick = isTickTickFocusRecord(focusRecord);
	const fromSessionApp = isSessionAppFocusRecord(focusRecord);

	switch (property) {
		case 'taskId':
			if (fromTickTick) {
				return '';
			}

			if (fromSessionApp) {
				const { title, category } = focusRecord;
				const focusRecordTitle = title ? `${title} (${category.title})` : `${category.title}`;
				return focusRecordTitle;
			}

			return '';
		case 'startTime':
			if (fromTickTick) {
				return focusRecord.startTime;
			}

			if (fromSessionApp) {
				return focusRecord['start_date'];
			}

			return '';
		case 'endTime':
			if (fromTickTick) {
				return focusRecord.endTime;
			}

			if (fromSessionApp) {
				return focusRecord['end_date'];
			}

			return '';
		case 'note':
			if (fromTickTick) {
				return focusRecord.note;
			}

			if (fromSessionApp) {
				return focusRecord.notes;
			}

			return '';
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
