export const isTickTickFocusRecord = (focusRecord) => {
	return focusRecord.tasks;
};
export const isSessionAppFocusRecord = (focusRecord) => {
	return focusRecord['start_date'];
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
