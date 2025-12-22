/**
 * Utility functions for serializing completed tasks to markdown format
 * Extracted from useExportCompletedTasks.tsx to be reused across the application
 */
import type { Task, Project } from '../types/models';
import type { AncestorTask } from '../types/api';

// Type definitions for nested task structures
interface NestedTaskNode {
	directCompletedSubtasks: (Task | AncestorTask)[];
	parentDirectChildrenCompletedTasks: Record<string, NestedTaskNode>;
}

interface ParentTaskData {
	name: string;
	completedSubtasks: (Task | AncestorTask)[];
}

/**
 * Helper function to get task text (title or content)
 */
function getTaskText(task: Task | AncestorTask): string {
	return task.title || ('content' in task ? task.content : '') || '';
}

/**
 * Get the checkbox prefix for a task based on its status
 * status === -1 means "won't do" (red X)
 * otherwise it's completed (checkmark)
 */
export function getTaskCheckbox(task: Task | AncestorTask): string {
	const statusIsWillNotDo = 'status' in task && task.status === -1;
	return statusIsWillNotDo ? '❌' : '[x]';
}

/**
 * Serializes a day's completed tasks in flat format (with parent task grouping)
 * Used for non-nested/breadcrumb view
 */
export function serializeDayWithCompletedTasks(
	dateStr: string,
	parentTasks: ParentTaskData[],
	taskCount: number
): string {
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
			lines.push(`- ${checkbox} ${getTaskText(task)}`);
		});

		// Add an empty line after each task group, but no extra newline
		if (index !== parentTasks.length - 1) {
			lines.push('');
		}
	});

	return lines.join('\n');
}

/**
 * Recursively serialize a nested task node to markdown
 * Used for nested/indented view
 */
export function serializeNestedTaskNode(
	taskId: string,
	node: NestedTaskNode,
	ancestorTasksById: Record<string, Task | AncestorTask>,
	level: number,
	projectsById?: Record<string, Project>
): string {
	const lines: string[] = [];
	const indent = '  '.repeat(level);

	// Handle grouped task IDs (like "grouped-Check Streaks")
	let taskInfo = ancestorTasksById[taskId];
	if (!taskInfo && taskId.startsWith('grouped-')) {
		// Extract task name from grouped ID
		const taskName = taskId.replace('grouped-', '');
		taskInfo = {
			id: taskId,
			title: taskName,
			projectId: '',
			parentId: null,
			ancestorIds: []
		} as AncestorTask;
	}

	if (!taskInfo) {
		return '';
	}

	// Check if this node has children to recurse into
	const hasChildren =
		node.parentDirectChildrenCompletedTasks &&
		Object.keys(node.parentDirectChildrenCompletedTasks).length > 0;

	// Check if this node has direct completed subtasks
	const hasDirectCompletedSubtasks =
		node.directCompletedSubtasks && node.directCompletedSubtasks.length > 0;

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
			node.directCompletedSubtasks.forEach((task) => {
				const checkbox = getTaskCheckbox(task);
				lines.push(`${indent}  - ${checkbox} ${getTaskText(task)}`);
			});
		}

		// Render the nested child's subtasks (the task itself completing)
		const childNode = node.parentDirectChildrenCompletedTasks[taskId];
		if (childNode.directCompletedSubtasks && childNode.directCompletedSubtasks.length > 0) {
			childNode.directCompletedSubtasks.forEach((task) => {
				const checkbox = getTaskCheckbox(task);
				lines.push(`${indent}  - ${checkbox} ${getTaskText(task)}`);
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
			node.directCompletedSubtasks.forEach((task) => {
				const checkbox = getTaskCheckbox(task);
				lines.push(`${indent}  - ${checkbox} ${getTaskText(task)}`);
			});
		}

		// Recursively render children
		if (hasChildren) {
			Object.entries(node.parentDirectChildrenCompletedTasks).forEach(([childId, childNode]) => {
				const childMarkdown = serializeNestedTaskNode(
					childId,
					childNode,
					ancestorTasksById,
					level + 1,
					projectsById
				);
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
 * Used for nested/indented view
 */
export function serializeNestedDay(
	dateStr: string,
	dayData: Record<string, unknown>,
	ancestorTasksById: Record<string, Task | AncestorTask>,
	projectsById?: Record<string, Project>
): string {
	const lines: string[] = [];

	// Extract taskCount from backend (already calculated)
	const { taskCount, ...nestedTasks } = dayData;

	// Remove leading zero from day
	const formattedDateStr = dateStr.replace(/\b0(\d),/, '$1,');
	lines.push(`### 📅 ${formattedDateStr} (${taskCount})\n`);

	// Render each root task
	const rootTaskIds = Object.keys(nestedTasks);
	rootTaskIds.forEach((rootTaskId, index) => {
		const rootNode = nestedTasks[rootTaskId] as NestedTaskNode;
		const rootMarkdown = serializeNestedTaskNode(
			rootTaskId,
			rootNode,
			ancestorTasksById,
			0,
			projectsById
		);
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

/**
 * Serializes a single task to markdown (just the title)
 * Used for copying individual tasks from the context menu
 */
export function serializeTaskToMarkdown(task: Task | AncestorTask): string {
	return getTaskText(task);
}