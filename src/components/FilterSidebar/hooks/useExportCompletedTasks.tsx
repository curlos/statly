import JSZip from 'jszip';
import { useUserSettingsContext } from '../../../pages/focus-records/useUserSettingsContext';
import { saveAs } from 'file-saver';
import { getFormattedDateAndTimeForFileName } from '../../../utils/date.utils';
import { useSharedQueryParams } from '../../../hooks/useSharedQueryParams';
import { tasksApi } from '../../../services/resources/tasksApi';
import { useDispatch } from 'react-redux';
import { getAppliedFiltersMarkdown } from './getAppliedFiltersMarkdown';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import type { Task } from '../../../types/models';
import type { AncestorTask } from '../../../types/api';

interface ParentTaskData {
	name: string;
	completedSubtasks: Task[];
}

interface NestedTaskNode {
	parentDirectChildrenCompletedTasks?: Record<string, NestedTaskNode>;
	directCompletedSubtasks?: Task[];
}

interface DayData {
	taskCount: number;
	[key: string]: NestedTaskNode | number;
}

// Export API Response Types
interface FlatExportResponse {
	days: Array<{ dateStr: string; parentTasks: ParentTaskData[]; taskCount: number }>;
	totalTasks: number;
}

interface FlatGroupedExportResponse {
	grouped: Record<string, {
		days: Array<{ dateStr: string; parentTasks: ParentTaskData[]; taskCount: number }>;
		totalCompletedTasks: number;
		groupName: string;
	}>;
}

interface NestedExportResponse {
	[dateStr: string]: DayData | Record<string, AncestorTask> | number;
	ancestorTasksById: Record<string, AncestorTask>;
	totalTasks: number;
}

interface NestedGroupedExportResponse {
	[groupId: string]: Record<string, DayData> | Record<string, AncestorTask> | number;
	ancestorTasksById: Record<string, AncestorTask>;
	totalTasks: number;
}

const useExportCompletedTasks = () => {
	const dispatch = useDispatch();
	const { queryParams, urlValues } = useSharedQueryParams();
	const userSettings = useUserSettingsContext();
	const taskIdIncludeCompletedTasksFromSubtasks = userSettings?.completedTasksPageSettings?.taskIdIncludeCompletedTasksFromSubtasks ?? true;
	const onlyExportTasksWithNoParent = userSettings?.completedTasksPageSettings?.onlyExportTasksWithNoParent ?? true;
	const showIndentedTasks = userSettings?.completedTasksPageSettings?.showIndentedTasks ?? false;
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	/**
	 * Get the checkbox prefix for a task based on its status
	 * status === -1 means "won't do" (red X)
	 * otherwise it's completed (checkmark)
	 */
	function getTaskCheckbox(task: Task): string {
		const statusIsWillNotDo = task.source === 'TaskTickTick' && task.status === -1;
		return statusIsWillNotDo ? '❌' : '[x]';
	}

	function getTaskTitle(task: Task): string {
		return task.title || (task.source === 'TaskTickTick' ? task.content : undefined) || '';
	}

	function serializeDayWithCompletedTasks(dateStr: string, parentTasks: ParentTaskData[], taskCount: number): string {
		const lines: string[] = [];
		// Remove leading zero from day (e.g., "January 01, 2025" -> "January 1, 2025")
		const formattedDateStr = dateStr.replace(/\b0(\d),/, '$1,');
		lines.push(`### 📅 ${formattedDateStr} (${taskCount})\n`);

		parentTasks.forEach((parentTaskData, index) => {
			const { name, completedSubtasks } = parentTaskData;

			// Name already includes <b> tags from backend for the actual task name
			lines.push(`📝 ${name}`);

			completedSubtasks.forEach((task) => {
				const checkbox = getTaskCheckbox(task);
				lines.push(`- ${checkbox} ${getTaskTitle(task)}`);
			});

			// Add an empty line after each task group, but no extra newline
			if (index !== parentTasks.length - 1) {
				lines.push('');
			}
		});

		return lines.join('\n');
	}

	// ============================================================================
	// Nested Export Helper Functions
	// ============================================================================


	/**
	 * Recursively serialize a nested task node to markdown
	 */
	function serializeNestedTaskNode(taskId: string, node: NestedTaskNode, ancestorTasksById: Record<string, AncestorTask>, level: number): string {
		const lines: string[] = [];
		const indent = '  '.repeat(level);

		// Handle grouped task IDs (like "grouped-Check Streaks")
		let taskInfo = ancestorTasksById[taskId];
		if (!taskInfo && taskId.startsWith('grouped-')) {
			// Extract task name from grouped ID
			const taskName = taskId.replace('grouped-', '');
			taskInfo = { id: taskId, title: taskName, projectId: '', parentId: null, ancestorIds: [] };
		}

		if (!taskInfo) {
			return '';
		}

		// Check if this node has children to recurse into
		const hasChildren = node.parentDirectChildrenCompletedTasks && Object.keys(node.parentDirectChildrenCompletedTasks).length > 0;

		// Check if this node has direct completed subtasks
		const hasDirectCompletedSubtasks = node.directCompletedSubtasks && node.directCompletedSubtasks.length > 0;

		// Special case: if this task only has itself as a child (nesting under itself)
		// Don't show the parent name twice - just show the checkboxes from the nested child
		const childIds = hasChildren && node.parentDirectChildrenCompletedTasks ? Object.keys(node.parentDirectChildrenCompletedTasks) : [];
		const onlyChildIsItself = childIds.length === 1 && childIds[0] === taskId;

		if (onlyChildIsItself) {
			// For tasks that nest under themselves, render parent name with all subtasks
			// Show project name for all tasks
			if (taskInfo.projectId && projectsById) {
				const project = projectsById[taskInfo.projectId];
				const projectName = project?.name || taskInfo.projectId;
				lines.push(`${indent}- **${taskInfo.title}** - (${projectName})`);
			} else {
				lines.push(`${indent}- **${taskInfo.title}**`);
			}

			// Render direct completed subtasks at this level (siblings of the task itself)
			if (hasDirectCompletedSubtasks && node.directCompletedSubtasks) {
				node.directCompletedSubtasks.forEach(task => {
					const checkbox = getTaskCheckbox(task);
					lines.push(`${indent}  - ${checkbox} ${getTaskTitle(task)}`);
				});
			}

			// Render the nested child's subtasks (the task itself completing)
			const childNode = node.parentDirectChildrenCompletedTasks?.[taskId];
			if (childNode?.directCompletedSubtasks && childNode.directCompletedSubtasks.length > 0) {
				childNode.directCompletedSubtasks.forEach(task => {
					const checkbox = getTaskCheckbox(task);
					lines.push(`${indent}  - ${checkbox} ${getTaskTitle(task)}`);
				});
			}
		} else if (hasChildren || hasDirectCompletedSubtasks) {
			// Normal case: show the parent task name with project name
			if (taskInfo.projectId && projectsById) {
				const project = projectsById[taskInfo.projectId];
				const projectName = project?.name || taskInfo.projectId;
				lines.push(`${indent}- **${taskInfo.title}** - (${projectName})`);
			} else {
				lines.push(`${indent}- **${taskInfo.title}**`);
			}

			// Render direct completed subtasks (tasks completed at this level)
			if (hasDirectCompletedSubtasks && node.directCompletedSubtasks) {
				node.directCompletedSubtasks.forEach(task => {
					const checkbox = getTaskCheckbox(task);
					lines.push(`${indent}  - ${checkbox} ${getTaskTitle(task)}`);
				});
			}

			// Recursively render children
			if (hasChildren && node.parentDirectChildrenCompletedTasks) {
				Object.entries(node.parentDirectChildrenCompletedTasks).forEach(([childId, childNode]) => {
					const childMarkdown = serializeNestedTaskNode(childId, childNode, ancestorTasksById, level + 1);
					if (childMarkdown) {
						lines.push(childMarkdown);
					}
				});
			}
		}

		return lines.join('\n');
	}

	/**
	 * Serialize one day's nested structure to markdown
	 */
	function serializeNestedDay(dateStr: string, dayData: DayData, ancestorTasksById: Record<string, AncestorTask>): string {
		const lines: string[] = [];

		// Extract taskCount from backend (already calculated)
		const { taskCount, ...nestedTasks } = dayData;

		// Remove leading zero from day
		const formattedDateStr = dateStr.replace(/\b0(\d),/, '$1,');
		lines.push(`### 📅 ${formattedDateStr} (${taskCount})\n`);

		// Render each root task
		const rootTaskIds = Object.keys(nestedTasks);
		rootTaskIds.forEach((rootTaskId, index) => {
			const rootNode = nestedTasks[rootTaskId];
			// Skip if rootNode is the taskCount number
			if (typeof rootNode === 'number') return;

			const rootMarkdown = serializeNestedTaskNode(rootTaskId, rootNode, ancestorTasksById, 0);
			if (rootMarkdown) {
				lines.push(rootMarkdown);
			}

			// Add blank line between root tasks
			if (index !== rootTaskIds.length - 1) {
				lines.push('');
			}
		});

		return lines.join('\n');
	}

	const getCompletedTasksMarkdown = (
		days: Array<{ dateStr: string; parentTasks: ParentTaskData[]; taskCount: number }>,
		customTitle: string | null,
		totalTasks: number
	): string => {
		const allDaysWithCompletedTasksMarkdown: string[] = [];

		// Add title as H1 at the beginning
		const titleInfo = customTitle || `Completed Tasks (${totalTasks.toLocaleString()})`;
		allDaysWithCompletedTasksMarkdown.push(`# ${titleInfo}\n`);

		// Add applied filters section (always shows, displays "None" if no filters)
		const appliedFiltersMarkdown = getAppliedFiltersMarkdown({ ...urlValues, projectsById });
		allDaysWithCompletedTasksMarkdown.push(appliedFiltersMarkdown);

		// Add separator
		allDaysWithCompletedTasksMarkdown.push('---\n');

		for (let i = 0; i < days.length; i++) {
			const day = days[i];
			const dayMarkdown = serializeDayWithCompletedTasks(
				day.dateStr,
				day.parentTasks,
				day.taskCount
			);

			allDaysWithCompletedTasksMarkdown.push(dayMarkdown);

			// Add separator between days (but not after the last one)
			if (i !== days.length - 1) {
				allDaysWithCompletedTasksMarkdown.push('---\n');
			}
		}

		const finalMarkdown = allDaysWithCompletedTasksMarkdown.join('\n');
		return finalMarkdown;
	};

	const handleCopyToClipboard = async () => {
		const exportMode = showIndentedTasks ? 'nested' : 'flat';

		// Trigger the export query manually
		const result: { data?: unknown } = await (dispatch as (arg: unknown) => Promise<{ data?: unknown }>)(
			tasksApi.endpoints.getDaysWithCompletedTasksExport.initiate({
				...queryParams,
				'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': 'none',
				'export-mode': exportMode,
			})
		);

		if (result.data) {
			let finalMarkdown;

			if (exportMode === 'nested') {
				const nestedData = result.data as unknown as NestedExportResponse;
				const ancestorTasksById = nestedData.ancestorTasksById || {};
				const totalTasks = nestedData.totalTasks || 0;

				// Since we hardcode 'group-by': 'none', the structure is always { [dateStr]: { [rootTaskId]: NestedTaskNode } }
				const days = Object.entries(nestedData)
					.filter(([key]) => key !== 'ancestorTasksById' && key !== 'totalTasks') // Filter out metadata
					.map(([dateStr, nestedTasks]) => serializeNestedDay(dateStr, nestedTasks as DayData, ancestorTasksById))
					.join('\n---\n');

				finalMarkdown = `# Completed Tasks (${totalTasks.toLocaleString()})\n\n${getAppliedFiltersMarkdown({ ...urlValues, projectsById })}---\n\n${days}`;
			} else {
				// Flat mode (existing logic)
				const flatData = result.data as unknown as FlatExportResponse;
				const { days, totalTasks } = flatData;
				finalMarkdown = getCompletedTasksMarkdown(days, null, totalTasks);
			}

			// Copy to clipboard with error handling
			try {
				await navigator.clipboard.writeText(finalMarkdown);
				return { success: true };
			} catch (error) {
				console.error('Failed to copy to clipboard:', error);
				return { success: false, error };
			}
		}

		return { success: false, error: new Error('No data to copy') };
	};

	const downloadSingleMarkdownFile = async () => {
		const exportMode = showIndentedTasks ? 'nested' : 'flat';

		// Trigger the export query manually
		const result: { data?: unknown } = await (dispatch as (arg: unknown) => Promise<{ data?: unknown }>)(
			tasksApi.endpoints.getDaysWithCompletedTasksExport.initiate({
				...queryParams,
				'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': 'none',
				'export-mode': exportMode,
			})
		);

		if (result.data) {
			let finalMarkdown;

			if (exportMode === 'nested') {
				const nestedData = result.data as unknown as NestedExportResponse;
				const ancestorTasksById = nestedData.ancestorTasksById || {};
				const totalTasks = nestedData.totalTasks || 0;

				// nestedData is { [dateStr]: { [rootTaskId]: NestedTaskNode }, ancestorTasksById, totalTasks }
				const days = Object.entries(nestedData)
					.filter(([key]) => key !== 'ancestorTasksById' && key !== 'totalTasks')
					.map(([dateStr, nestedTasks]) => serializeNestedDay(dateStr, nestedTasks as DayData, ancestorTasksById))
					.join('\n---\n');

				finalMarkdown = `# Completed Tasks (${totalTasks.toLocaleString()})\n\n${getAppliedFiltersMarkdown({ ...urlValues, projectsById })}---\n\n${days}`;
			} else {
				// Flat mode (existing logic)
				const flatData = result.data as unknown as FlatExportResponse;
				const { days, totalTasks } = flatData;
				finalMarkdown = getCompletedTasksMarkdown(days, null, totalTasks);
			}

			// Download as single markdown file
			const blob = new Blob([finalMarkdown], { type: 'text/markdown;charset=utf-8' });
			saveAs(blob, 'completed_tasks.md');
		}
	};

	const downloadZipFolderOfGroupedCompletedTasks = async (groupType: 'project' | 'task') => {
		const exportMode = showIndentedTasks ? 'nested' : 'flat';

		// Trigger the export query manually
		const result: { data?: unknown } = await (dispatch as (arg: unknown) => Promise<{ data?: unknown }>)(
			tasksApi.endpoints.getDaysWithCompletedTasksExport.initiate({
				...queryParams,
				'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': groupType,
				'export-mode': exportMode,
			})
		);

		if (!result.data) {
			return;
		}

		const zip = new JSZip();

		if (exportMode === 'nested') {
			// Nested mode: data is { [groupId]: { [dateStr]: { [rootTaskId]: NestedTaskNode } }, ancestorTasksById, totalTasks }
			const nestedGroupedData = result.data as unknown as NestedGroupedExportResponse;
			const ancestorTasksById = nestedGroupedData.ancestorTasksById || {};

			// Extract only the group data (exclude ancestorTasksById and totalTasks)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { ancestorTasksById: _, totalTasks: __, ...groupedData } = nestedGroupedData;

			// Build array for sorting - calculate task counts per group
			const groupsArray = Object.entries(groupedData).map(([groupId, daysData]) => {
				// Count tasks in this group by summing taskCount from each day
				const daysDataTyped = daysData as Record<string, DayData>;
				const totalCompletedTasks = Object.values(daysDataTyped).reduce((sum, dayData) => {
					return sum + (dayData.taskCount || 0);
				}, 0);

				// Get group name (project name or task name)
				let groupName = groupId;
				if (groupType === 'project') {
					const project = projectsById?.[groupId];
					groupName = project?.name || groupId;
				} else {
					const task = ancestorTasksById[groupId];
					groupName = task?.title || groupId;
				}

				return {
					groupId,
					groupName,
					daysData: daysDataTyped,
					totalCompletedTasks
				};
			});

			// Sort by totalCompletedTasks descending
			const sortedGroups = groupsArray.sort((a, b) => b.totalCompletedTasks - a.totalCompletedTasks);

			// Calculate padding width
			const paddingWidth = String(sortedGroups.length).length;

			// Add files to ZIP
			sortedGroups.forEach(({ groupName, daysData, totalCompletedTasks }, index) => {
				const paddedIndex = String(index + 1).padStart(paddingWidth, '0');

				// Serialize all days for this group
				const days = Object.entries(daysData)
					.map(([dateStr, nestedTasks]) => serializeNestedDay(dateStr, nestedTasks, ancestorTasksById))
					.join('\n---\n');

				const customTitle = `${groupName} - Completed Tasks (${totalCompletedTasks.toLocaleString()})`;
				const markdown = `# ${customTitle}\n\n${getAppliedFiltersMarkdown({ ...urlValues, projectsById })}---\n\n${days}`;

				// Filename for the markdown file
				const sanitizedName = `${paddedIndex}_${groupName}_(${totalCompletedTasks.toLocaleString()})`.replace(/[/\\?%*:|"<>]/g, '-');
				// Adjust date to local timezone to fix zip file timestamp display
				const localDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
				zip.file(`${sanitizedName}.md`, markdown, { date: localDate });
			});
		} else {
			// Flat mode (existing logic)
			const flatGroupedData = result.data as unknown as FlatGroupedExportResponse;
			const { grouped } = flatGroupedData;

			// Convert grouped object to array and sort by totalCompletedTasks (descending)
			const sortedGroups = Object.values(grouped)
				.map((groupData) => ({
					days: groupData.days,
					totalCompletedTasks: groupData.totalCompletedTasks,
					groupName: groupData.groupName,
				}))
				.sort((a, b) => b.totalCompletedTasks - a.totalCompletedTasks);

			// Calculate padding width based on total number of groups
			const totalGroups = sortedGroups.length;
			const paddingWidth = String(totalGroups).length;

			// Add files to ZIP
			sortedGroups.forEach(({ days, totalCompletedTasks, groupName }, index) => {
				const paddedIndex = String(index + 1).padStart(paddingWidth, '0');

				// Title used in the markdown content
				const customTitle = `${groupName} - Completed Tasks (${totalCompletedTasks.toLocaleString()})`;
				const markdown = getCompletedTasksMarkdown(days, customTitle, totalCompletedTasks);

				// Filename for the markdown file - sanitize forward slashes to prevent folder creation
				const sanitizedName = `${paddedIndex}_${groupName}_(${totalCompletedTasks.toLocaleString()})`.replace(/[/\\?%*:|"<>]/g, '-');
				// Adjust date to local timezone to fix zip file timestamp display
				const localDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
				zip.file(`${sanitizedName}.md`, markdown, { date: localDate });
			});
		}

		// Wait for ZIP generation to complete before saving
		await zip.generateAsync({ type: 'blob' }).then((blob) => {
			saveAs(blob, `CompletedTasks_${getFormattedDateAndTimeForFileName()}.zip`);
		});
	};

	return { handleCopyToClipboard, downloadSingleMarkdownFile, downloadZipFolderOfGroupedCompletedTasks };
};

export default useExportCompletedTasks;
