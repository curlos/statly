import type { Project } from '../../../types/models';
import type { AncestorTask } from '../../../types/api';

interface AppliedFiltersParams {
	sortBy?: string;
	searchTextFromUrl?: string;
	startDateFromUrl?: string;
	endDateFromUrl?: string;
	intervalStartDateFromUrl?: string;
	intervalEndDateFromUrl?: string;
	taskIdFromUrl?: string;
	toDoListAppsFromUrl?: string;
	focusAppsFromUrl?: string;
	crossesMidnight?: boolean;
	ancestorTasksById?: Record<string, AncestorTask>;
	projectsFromUrl?: string;
	projectsTodoistFromUrl?: string;
	categoriesFromUrl?: string;
	projectsById?: Record<string, Project>;
}

/**
 * Generates markdown representation of applied filters
 * Used by both useExportCompletedTasks and useExportFocusRecords
 */
export const getAppliedFiltersMarkdown = (params: AppliedFiltersParams): string => {
	const {
		sortBy,
		searchTextFromUrl,
		startDateFromUrl,
		endDateFromUrl,
		intervalStartDateFromUrl,
		intervalEndDateFromUrl,
		taskIdFromUrl,
		toDoListAppsFromUrl,
		focusAppsFromUrl,
		crossesMidnight,
		ancestorTasksById,
		projectsFromUrl,
		projectsTodoistFromUrl,
		categoriesFromUrl,
		projectsById,
	} = params;

	const filters: string[] = [];

	// Sort By
	if (sortBy && sortBy !== 'Newest') {
		filters.push(`**Sort By:** ${sortBy}`);
	}

	// Search Text
	if (searchTextFromUrl) {
		filters.push(`**Search Text:** ${searchTextFromUrl}`);
	}

	// Task Filter
	if (taskIdFromUrl) {
		const taskTitle = ancestorTasksById?.[taskIdFromUrl]?.title || taskIdFromUrl;
		filters.push(`**Task:** ${taskTitle}`);
	}

	// Date Range
	if (startDateFromUrl && endDateFromUrl) {
		const dateRangeString = `${startDateFromUrl} - ${endDateFromUrl}`;
		filters.push(`**Date Range:** ${dateRangeString}`);
	}

	// Interval Date Range
	if (intervalStartDateFromUrl && intervalEndDateFromUrl) {
		filters.push(`**Interval Date Range:** ${intervalStartDateFromUrl} - ${intervalEndDateFromUrl}`);
	}

	// To-Do List Apps (for Completed Tasks page)
	if (toDoListAppsFromUrl) {
		const apps = toDoListAppsFromUrl.split(',').join(', ');
		filters.push(`**To-Do List Apps:** ${apps}`);
	}

	// Focus Apps (for Focus Records page)
	if (focusAppsFromUrl) {
		const apps = focusAppsFromUrl.split(',').join(', ');
		filters.push(`**Focus Apps:** ${apps}`);
	}

	// Crosses Midnight (for Focus Records page)
	if (crossesMidnight === true) {
		filters.push(`**Crosses Midnight:** True`);
	}

	// Projects (TickTick)
	if (projectsFromUrl && projectsById) {
		const projectIds = projectsFromUrl.split(',');
		const projectNames = projectIds.map(id => projectsById[id]?.name || id).join(', ');
		filters.push(`**Projects (TickTick):** ${projectNames}`);
	}

	// Projects (Todoist)
	if (projectsTodoistFromUrl && projectsById) {
		const projectIds = projectsTodoistFromUrl.split(',');
		const projectNames = projectIds.map(id => projectsById[id]?.name || id).join(', ');
		filters.push(`**Projects (Todoist):** ${projectNames}`);
	}

	// Categories (Session App) - for Focus Records
	if (categoriesFromUrl && projectsById) {
		const categoryIds = categoriesFromUrl.split(',');
		const categoryNames = categoryIds.map(id => projectsById[id]?.name || id).join(', ');
		filters.push(`**Categories (Session App):** ${categoryNames}`);
	}

	// If no filters applied, show "None"
	const filtersContent = filters.length === 0 ? 'None' : filters.join('  \n');

	// Return formatted markdown with header (separator moved to caller for flexibility)
	return '### Applied Filters\n\n' + filtersContent + '\n\n';
};
