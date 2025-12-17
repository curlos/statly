import type { AncestorTask } from '../types/api';

/**
 * Groups standalone tasks (with only 1 instance) by their name.
 * Used to consolidate daily habit tasks like "Check Streaks" that appear multiple times.
 */
interface GroupedDataItem {
	id: string;
	name: string;
	projectId?: string;
	color?: string;
	duration?: number;
	count?: number;
	percentage: number;
	type: string;
	isGrouped?: boolean;
}

export function groupTasksByName(
	groupedData: GroupedDataItem[],
	metricKey: 'duration' | 'count' = 'count',
	totalCount: number
) {
	if (!groupedData || groupedData.length === 0) {
		return groupedData;
	}

	// Separate tasks that have only 1 count from those that don't
	const standaloneTasksByName: Record<string, GroupedDataItem> = {};
	const tasksWithChildren: GroupedDataItem[] = [];

	groupedData.forEach((item) => {
		if (item.type !== 'task') {
			tasksWithChildren.push(item);
			return;
		}

		// Only group tasks that have exactly 1 count (standalone daily tasks)
		if (item[metricKey] === 1) {
			const taskName = item.name;
			if (!standaloneTasksByName[taskName]) {
				// First occurrence - create the grouped object
				standaloneTasksByName[taskName] = {
					id: `grouped-${taskName}`,
					name: taskName,
					projectId: item.projectId,
					color: item.color,
					[metricKey]: 1,
					percentage: item.percentage,
					type: 'task',
					isGrouped: false // Will be true if we find another instance
				};
			} else {
				// Subsequent occurrence - increment count and percentage
				const existing = standaloneTasksByName[taskName]!;
				existing[metricKey] = (existing[metricKey] ?? 0) + 1;
				existing.percentage = ((existing[metricKey]!) / totalCount) * 100;
				existing.isGrouped = true;
			}
		} else {
			// Tasks with children already aggregated - keep as-is
			tasksWithChildren.push(item);
		}
	});

	// Convert grouped tasks to array and format percentages
	const groupedStandaloneTasks = Object.values(standaloneTasksByName).map(task => ({
		...task,
		percentage: Number(task.percentage.toFixed(2))
	}));

	return [...tasksWithChildren, ...groupedStandaloneTasks];
}

/**
 * Groups tasks by their parent task ID.
 * Used for Completion Stats to aggregate child tasks under their parent.
 */
export function groupTasksByParent(
	data: GroupedDataItem[],
	ancestorTasksById: Record<string, AncestorTask>,
	totalCount: number,
	metricKey: 'duration' | 'count' = 'count'
) {
	if (!data || !ancestorTasksById || data.length === 0) {
		return data;
	}

	const groupedByParent: Record<string, GroupedDataItem> = {};

	data.forEach((item) => {
		const taskInfo = ancestorTasksById[item.id];
		const parentId = taskInfo?.parentId || item.id; // Use task itself if no parent

		if (!groupedByParent[parentId]) {
			// Get parent task info or use current task if it's the top-level
			const parentInfo = ancestorTasksById[parentId] || taskInfo;

			groupedByParent[parentId] = {
				id: parentId,
				name: parentInfo?.title || item.name,
				projectId: parentInfo?.projectId || item.projectId,
				color: item.color,
				[metricKey]: 0,
				percentage: 0,
				type: 'task'
			};
		}

		// Aggregate metrics
		groupedByParent[parentId]![metricKey] = (groupedByParent[parentId]![metricKey] ?? 0) + (item[metricKey] || 0);
	});

	// Calculate percentages and convert to array
	const groupedArray = Object.values(groupedByParent).map((item) => ({
		...item,
		percentage: Number((((item[metricKey] ?? 0) / totalCount) * 100).toFixed(2))
	}));

	// Apply name-based grouping to consolidate daily habit tasks
	return groupTasksByName(groupedArray, metricKey, totalCount);
}
