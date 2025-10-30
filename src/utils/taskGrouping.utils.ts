/**
 * Groups standalone tasks (with only 1 instance) by their name.
 * Used to consolidate daily habit tasks like "Check Streaks" that appear multiple times.
 */
export function groupTasksByName(
	groupedData: any[],
	metricKey: 'duration' | 'count' = 'count',
	totalCount
) {
	if (!groupedData || groupedData.length === 0) {
		return groupedData;
	}

	// Separate tasks that have only 1 count from those that don't
	const standaloneTasksByName: Record<string, any> = {};
	const tasksWithChildren: any[] = [];

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
				standaloneTasksByName[taskName][metricKey] += 1;
				standaloneTasksByName[taskName].percentage = ((standaloneTasksByName[taskName][metricKey]) / totalCount) * 100;
				standaloneTasksByName[taskName].isGrouped = true;
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
	data: any[],
	ancestorTasksById: Record<string, any>,
	totalCount: number,
	metricKey: 'duration' | 'count' = 'count'
) {
	if (!data || !ancestorTasksById || data.length === 0) {
		return data;
	}

	const groupedByParent: Record<string, any> = {};

	console.log(data)

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
		groupedByParent[parentId][metricKey] += item[metricKey] || 0;
	});

	// Calculate percentages and convert to array
	const groupedArray = Object.values(groupedByParent).map((item) => ({
		...item,
		percentage: Number(((item[metricKey] / totalCount) * 100).toFixed(2))
	}));

	// Apply name-based grouping to consolidate daily habit tasks
	return groupTasksByName(groupedArray, metricKey, totalCount);
}
