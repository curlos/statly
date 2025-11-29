import JSZip from 'jszip';
import { useUserSettingsContext } from '../../../pages/focus-records/useUserSettingsContext';
import { saveAs } from 'file-saver';
import { getFormattedDateAndTimeForFileName } from '../../../utils/date.utils';
import { useSharedQueryParams } from '../../../hooks/useSharedQueryParams';
import { baseAPI } from '../../../services/api';
import { useDispatch } from 'react-redux';
import { getAppliedFiltersMarkdown } from './getAppliedFiltersMarkdown';
import { useGetProjectsQuery } from '../../../services/resources/documentsProjectsApi';

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
	function getTaskCheckbox(task) {
		const statusIsWillNotDo = task.status === -1;
		return statusIsWillNotDo ? '❌' : '[x]';
	}

	function serializeDayWithCompletedTasks(dateStr, parentTasks, taskCount) {
		const lines = [];
		// Remove leading zero from day (e.g., "January 01, 2025" -> "January 1, 2025")
		const formattedDateStr = dateStr.replace(/\b0(\d),/, '$1,');
		lines.push(`### 📅 ${formattedDateStr} (${taskCount})\n`);

		parentTasks.forEach((parentTaskData, index) => {
			const { name, completedSubtasks } = parentTaskData;

			// Name already includes <b> tags from backend for the actual task name
			lines.push(`📝 ${name}`);

			completedSubtasks.forEach((task) => {
				const checkbox = getTaskCheckbox(task);
				lines.push(`- ${checkbox} ${task.title || task.content}`);
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
	function serializeNestedTaskNode(taskId, node, ancestorTasksById, level) {
		const lines = [];
		const indent = '  '.repeat(level);

		// Handle grouped task IDs (like "grouped-Check Streaks")
		let taskInfo = ancestorTasksById[taskId];
		if (!taskInfo && taskId.startsWith('grouped-')) {
			// Extract task name from grouped ID
			const taskName = taskId.replace('grouped-', '');
			taskInfo = { title: taskName, projectId: null };
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
		const childIds = hasChildren ? Object.keys(node.parentDirectChildrenCompletedTasks) : [];
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
			if (hasDirectCompletedSubtasks) {
				node.directCompletedSubtasks.forEach(task => {
					const checkbox = getTaskCheckbox(task);
					lines.push(`${indent}  - ${checkbox} ${task.title || task.content}`);
				});
			}

			// Render the nested child's subtasks (the task itself completing)
			const childNode = node.parentDirectChildrenCompletedTasks[taskId];
			if (childNode.directCompletedSubtasks && childNode.directCompletedSubtasks.length > 0) {
				childNode.directCompletedSubtasks.forEach(task => {
					const checkbox = getTaskCheckbox(task);
					lines.push(`${indent}  - ${checkbox} ${task.title || task.content}`);
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
			if (hasDirectCompletedSubtasks) {
				node.directCompletedSubtasks.forEach(task => {
					const checkbox = getTaskCheckbox(task);
					lines.push(`${indent}  - ${checkbox} ${task.title || task.content}`);
				});
			}

			// Recursively render children
			if (hasChildren) {
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
	function serializeNestedDay(dateStr, dayData, ancestorTasksById) {
		const lines = [];

		// Extract taskCount from backend (already calculated)
		const { taskCount, ...nestedTasks } = dayData;

		// Remove leading zero from day
		const formattedDateStr = dateStr.replace(/\b0(\d),/, '$1,');
		lines.push(`### 📅 ${formattedDateStr} (${taskCount})\n`);

		// Render each root task
		const rootTaskIds = Object.keys(nestedTasks);
		rootTaskIds.forEach((rootTaskId, index) => {
			const rootNode = nestedTasks[rootTaskId];
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

	const getCompletedTasksMarkdown = (days, customTitle, totalTasks) => {
		const allDaysWithCompletedTasksMarkdown = [];

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
		const result = await dispatch(
			baseAPI.endpoints.getDaysWithCompletedTasksExport.initiate({
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
				const nestedData = result.data;
				const ancestorTasksById = result.data.ancestorTasksById || {};
				const totalTasks = result.data.totalTasks || 0;

				// Since we hardcode 'group-by': 'none', the structure is always { [dateStr]: { [rootTaskId]: NestedTaskNode } }
				const days = Object.entries(nestedData)
					.filter(([key]) => key !== 'ancestorTasksById' && key !== 'totalTasks') // Filter out metadata
					.map(([dateStr, nestedTasks]) => serializeNestedDay(dateStr, nestedTasks, ancestorTasksById))
					.join('\n---\n');

				finalMarkdown = `# Completed Tasks (${totalTasks.toLocaleString()})\n\n${getAppliedFiltersMarkdown({ ...urlValues, projectsById })}---\n\n${days}`;
			} else {
				// Flat mode (existing logic)
				const { days, totalTasks } = result.data;
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
		const result = await dispatch(
			baseAPI.endpoints.getDaysWithCompletedTasksExport.initiate({
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
				const nestedData = result.data;
				const ancestorTasksById = result.data.ancestorTasksById || {};
				const totalTasks = result.data.totalTasks || 0;

				// nestedData is { [dateStr]: { [rootTaskId]: NestedTaskNode }, ancestorTasksById, totalTasks }
				const days = Object.entries(nestedData)
					.filter(([key]) => key !== 'ancestorTasksById' && key !== 'totalTasks')
					.map(([dateStr, nestedTasks]) => serializeNestedDay(dateStr, nestedTasks, ancestorTasksById))
					.join('\n---\n');

				finalMarkdown = `# Completed Tasks (${totalTasks.toLocaleString()})\n\n${getAppliedFiltersMarkdown({ ...urlValues, projectsById })}---\n\n${days}`;
			} else {
				// Flat mode (existing logic)
				const { days, totalTasks } = result.data;
				finalMarkdown = getCompletedTasksMarkdown(days, null, totalTasks);
			}

			// Download as single markdown file
			const blob = new Blob([finalMarkdown], { type: 'text/markdown;charset=utf-8' });
			saveAs(blob, 'completed_tasks.md');
		}
	};

	const downloadZipFolderOfGroupedCompletedTasks = async (groupType) => {
		const exportMode = showIndentedTasks ? 'nested' : 'flat';

		// Trigger the export query manually
		const result = await dispatch(
			baseAPI.endpoints.getDaysWithCompletedTasksExport.initiate({
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
			const ancestorTasksById = result.data.ancestorTasksById || {};
			const groupedData = { ...result.data };
			delete groupedData.ancestorTasksById;
			delete groupedData.totalTasks;

			// Build array for sorting - calculate task counts per group
			const groupsArray = Object.entries(groupedData).map(([groupId, daysData]) => {
				// Count tasks in this group by summing taskCount from each day
				const totalCompletedTasks = Object.values(daysData).reduce((sum, dayData) => {
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
					daysData,
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
			const { grouped } = result.data;

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
