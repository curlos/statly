import { arrayToObjectByKey } from './focus-apps/helpers.utils';
import { getTasksWithParentIdAndNoParent, getGroupedSubtasksAndParentTasks } from '../pages/completed-tasks/DayWithCompletedTasks/getGroupedSubtasksAndParentTasks.util';

/**
 * For tasks that are passed in and that are not in "ancestorTasksById", this must mean that it's not connected to a task from the "tasks" collection in the DB which means that this task is NOT from TickTick or Todoist. The only way for that to be possible is to be a "virtual task" from a focus record. For example, in a "Forest" focus record, you'll have a "tasks" array inside and that "task" is virtually created in the sync endpoint based on the original Forest focus record. However, it's not a task connected to a "real" task from the "tasks" collection in the DB.
 */
function separateRealTasksFromVirtualFocusTasks(
	data: any[],
	ancestorTasksById: Record<string, any>
) {
	const tasksFromTickTickOrTodoist: any[] = [];
	const virtualFocusAppTasks: any[] = [];

	data.forEach((item) => {
		const task = ancestorTasksById[item.id];
		if (task) {
			tasksFromTickTickOrTodoist.push(task);
		} else {
			// NOTE: This condition should only really happen for the "Details Card" in the "/stats/focus" page. It shouldn't be possible to see this in "Completion Stats" in the "/stats/task" page.
			virtualFocusAppTasks.push(item);
		}
	});

	return { tasksFromTickTickOrTodoist, virtualFocusAppTasks };
}

/**
 * Builds a mapping of parent IDs to their direct children task IDs
 */
function buildParentToChildrenMap(tasksWithParentId: Record<string, string>) {
	const parentDirectChildrenTaskIdsByParentId: Record<string, string[]> = {};

	Object.entries(tasksWithParentId).forEach(([currentTaskId, parentTaskId]) => {
		if (parentTaskId) {
			if (!parentDirectChildrenTaskIdsByParentId[parentTaskId]) {
				parentDirectChildrenTaskIdsByParentId[parentTaskId] = [];
			}
			parentDirectChildrenTaskIdsByParentId[parentTaskId].push(currentTaskId);
		}
	});

	return parentDirectChildrenTaskIdsByParentId;
}

/**
 * Creates aggregated data array for top-level parent tasks
 */
function buildAggregatedDataForTopLevelParents(
	tasksWithNoParent: string[],
	ancestorTasksById: Record<string, any>,
	totalMetricOnParentTask: Record<string, { value: number; percentage: number }>,
	metricKey: string,
	projectsById?: Record<string, any>
) {
	return tasksWithNoParent.map((taskId) => {
		const parentTask = ancestorTasksById[taskId];
		const totals = totalMetricOnParentTask[taskId];

		// Get color from project
		const projectId = parentTask?.projectId || parentTask?.v2_project_id || parentTask?.project_id;
		const color = projectsById?.[projectId]?.color || '#808080';

		return {
			id: taskId,
			name: parentTask?.title || parentTask?.content || 'Unknown Task',
			projectId: projectId,
			color: color,
			[metricKey]: totals.value,
			percentage: totals.percentage,
			type: 'task'
		};
	});
}

/**
 * Groups standalone tasks by name and performs all necessary bookkeeping.
 * This includes updating totalMetricOnParentTask, progressBarDataById, and creating groupedTasksById.
 * Returns the grouped data and updated tasksWithNoParent array.
 */
function groupStandaloneTasksByNameWithBookkeeping(
	aggregatedData: any[],
	metricKey: string,
	tasksWithNoParent: string[],
	totalMetricOnParentTask: Record<string, { value: number; percentage: number }>,
	progressBarDataById: Record<string, any>,
	totalDurationOrCount
) {
	// Separate standalone tasks from those with children already aggregated
	const standaloneTasksByName: Record<string, any[]> = {};
	const alreadyGroupedTasks: any[] = [];

	aggregatedData.forEach((item) => {
		if (item[metricKey] === 1) {
			// Standalone task with no children - eligible for name-based grouping
			const taskName = item.name;
			if (!standaloneTasksByName[taskName]) {
				standaloneTasksByName[taskName] = [];
			}
			standaloneTasksByName[taskName].push(item);
		} else {
			// Already has children aggregated - keep as-is
			alreadyGroupedTasks.push(item);
		}
	});

	// Group standalone tasks that share the same name
	const groupedTasksInfo: Record<string, any> = {};
	const groupedTaskIds = new Set<string>();

	const groupedStandaloneTasks = Object.entries(standaloneTasksByName).map(([name, tasks]) => {
		if (tasks.length === 1) {
			// Only one instance of this task - no grouping needed
			return tasks[0];
		} else {
			// Multiple instances with same name - group them together
			const totalMetric = tasks.reduce((sum, t) => sum + t[metricKey], 0);
			const totalPercentage = (totalMetric / totalDurationOrCount) * 100
			// const totalPercentage = tasks.reduce((sum, t) => sum + t.percentage, 0);
			const groupedId = `grouped-${name}`;

			// Track which task IDs were grouped
			tasks.forEach(task => groupedTaskIds.add(task.id));

			// Store grouped task info for NestedProgressBars to use
			groupedTasksInfo[groupedId] = {
				id: groupedId,
				name: name,
				projectId: tasks[0].projectId,
				color: tasks[0].color,
				[metricKey]: totalMetric,
				percentage: Number(totalPercentage.toFixed(2)),
				type: 'task',
				isGrouped: true,
				instanceCount: tasks.length
			};

			// Add to totalMetricOnParentTask so it can be rendered like a parent task
			totalMetricOnParentTask[groupedId] = {
				value: totalMetric,
				percentage: Number(totalPercentage.toFixed(2))
			};

			return groupedTasksInfo[groupedId];
		}
	});

	// Update tasksWithNoParent: remove individual grouped task IDs and add grouped IDs
	const filteredTasksWithNoParent = tasksWithNoParent.filter(taskId => !groupedTaskIds.has(taskId));
	const groupedTaskIdsArray = Object.keys(groupedTasksInfo);
	const updatedTasksWithNoParent = [...filteredTasksWithNoParent, ...groupedTaskIdsArray];

	// Update progressBarDataById to include grouped tasks. Even though an individual "Check Streaks" task might've been in there before, we now need the grouped id (like "grouped-Check Streaks") to also be in there since that's the task that will now be shown in the NestedProgressBars.
	groupedTaskIdsArray.forEach(groupedId => {
		const groupedInfo = groupedTasksInfo[groupedId];
		progressBarDataById[groupedId] = groupedInfo;
	});

	// Create groupedTasksById with task info for NestedProgressBars
	const groupedTasksById: Record<string, any> = {};
	groupedTaskIdsArray.forEach(groupedId => {
		const groupedInfo = groupedTasksInfo[groupedId];
		groupedTasksById[groupedId] = {
			id: groupedId,
			title: groupedInfo.name,
			content: groupedInfo.name,
			projectId: groupedInfo.projectId,
			color: groupedInfo.color
		};
	});

	// Combine already-grouped tasks with newly grouped standalone tasks
	const finalAggregatedData = [...alreadyGroupedTasks, ...groupedStandaloneTasks];

	return {
		finalAggregatedData,
		updatedTasksWithNoParent,
		groupedTasksInfo,
		groupedTasksById
	};
}

/**
 * Aggregates nested tasks by their top-level parent tasks.
 * Recursively calculates totals for all descendants.
 * Used for PieChart and NestedProgressBars to show parent-level aggregations.
 */
export function aggregateNestedTasksByParent(
	data: any[],
	ancestorTasksById: Record<string, any>,
	totalCount: number,
	metricType: 'duration' | 'count' = 'count',
	projectsById?: Record<string, any>,
	totalDurationOrCount
) {
	if (!data || !ancestorTasksById || data.length === 0) {
		return {
			aggregatedData: [],
			totalMetricOnParentTask: {},
			tasksWithNoParent: []
		};
	}

	const metricKey = metricType === 'duration' ? 'duration' : 'count';
	const progressBarDataById = arrayToObjectByKey(data, 'id');
	const { tasksFromTickTickOrTodoist, virtualFocusAppTasks } = separateRealTasksFromVirtualFocusTasks(
		data,
		ancestorTasksById
	);

	// Get tasks with and without parents. NOTE: Only "tasksFromTickTickOrTodoist" has to be passed to both of the functions below because tasks from "TickTick" or "Todoist" can have an ancestral or parent-child relation. Virtual focus tasks cannot.
	const { tasksWithParentId, tasksWithNoParent } = getTasksWithParentIdAndNoParent({
		completedTasksForDay: tasksFromTickTickOrTodoist,
		ancestorTasksById,
		includeDirectParentTasksWithNoChild: true,
	});

	// Group subtasks by their parent task.
	const { groupedSubtasksByParentTask } = getGroupedSubtasksAndParentTasks({
		completedTasksForDay: tasksFromTickTickOrTodoist,
	});

	// Map parent IDs to their direct children
	const parentDirectChildrenTaskIdsByParentId = buildParentToChildrenMap(tasksWithParentId);

	// Store calculated totals to avoid recalculation
	const totalMetricOnParentTask: Record<string, { value: number; percentage: number }> = {};

	/**
	 * Recursively calculate total metric for a parent and all its descendants
	 */
	const calculateTotalMetricFromChildren = (parentTaskId: string): { value: number; percentage: number } => {
		if (totalMetricOnParentTask[parentTaskId]) {
			return totalMetricOnParentTask[parentTaskId];
		}

		// Set placeholder to prevent infinite recursion from circular references
		totalMetricOnParentTask[parentTaskId] = { value: 0, percentage: 0 };

		let totalMetric = 0;

		// Add the task's direct focus. Like "Stats Page" might have other nested tasks with focus but I could've focused directly on the "Stats" page task first. This direct task focus data would be present on "progressBarDataById"
		totalMetric += (progressBarDataById[parentTaskId] && progressBarDataById[parentTaskId]?.[metricKey]) || 0

		// Add direct children's metrics
		// Convert task objects to IDs and deduplicate to avoid double-counting
		const childTaskIdsFromSubtasks = (groupedSubtasksByParentTask[parentTaskId] || []).map((task: any) => task.id);
		const childTaskIdsFromParentMap = parentDirectChildrenTaskIdsByParentId[parentTaskId] || [];
		const childFocusTaskIds = [...new Set([...childTaskIdsFromSubtasks, ...childTaskIdsFromParentMap])];

		// Recursively add child parent tasks' metrics
		if (childFocusTaskIds && childFocusTaskIds.length > 0) {
			childFocusTaskIds.forEach((taskId) => {
				const totalMetricFromChild = calculateTotalMetricFromChildren(taskId).value;
				totalMetric += totalMetricFromChild
			});
		}

		totalMetricOnParentTask[parentTaskId] = {
			value: totalMetric,
			percentage: Number(((totalMetric / totalCount) * 100).toFixed(2)),
		};

		return totalMetricOnParentTask[parentTaskId];
	};

	// Calculate totals for all top-level parents
	tasksWithNoParent.forEach((taskId) => {
		calculateTotalMetricFromChildren(taskId);
	});

	// Create aggregated data array for PieChart
	const aggregatedData = buildAggregatedDataForTopLevelParents(
		tasksWithNoParent,
		ancestorTasksById,
		totalMetricOnParentTask,
		metricKey,
		projectsById
	);

	// Group standalone daily habit tasks and perform all bookkeeping
	const {
		finalAggregatedData,
		updatedTasksWithNoParent,
		groupedTasksInfo,
		groupedTasksById
	} = groupStandaloneTasksByNameWithBookkeeping(
		aggregatedData,
		metricKey,
		tasksWithNoParent,
		totalMetricOnParentTask,
		progressBarDataById,
		totalDurationOrCount
	);

	// Include virtual focus app tasks in the final data for sorting/display
	const combinedAggregatedData = [...finalAggregatedData, ...virtualFocusAppTasks];

	// Add virtual focus app tasks to lookup structures so they can be rendered as nested tasks
	const virtualTaskIds: string[] = [];
	const virtualAncestorsById: Record<string, any> = {};

	virtualFocusAppTasks.forEach(task => {
		// Create ancestor entry for each virtual task (task is its own ancestor)
		virtualAncestorsById[task.id] = {
			id: task.id,
			title: task.name,
			content: task.name,
			projectId: task.projectId,
			color: task.color
		};

		// Add to progressBarDataById (already there, but ensure it's present)
		progressBarDataById[task.id] = task;

		// Add to totalMetricOnParentTask so it has percentage data
		totalMetricOnParentTask[task.id] = {
			value: task[metricKey],
			percentage: task.percentage
		};

		virtualTaskIds.push(task.id);
	});

	// Include virtual task IDs in tasksWithNoParent so they render in the main list
	const finalTasksWithNoParent = [...updatedTasksWithNoParent, ...virtualTaskIds];

	return {
		aggregatedData: combinedAggregatedData,
		totalMetricOnParentTask,
		tasksWithNoParent: finalTasksWithNoParent,
		groupedTasksInfo,
		groupedTasksById,
		virtualAncestorsById,
		groupedSubtasksByParentTask,
		parentDirectChildrenTaskIdsByParentId,
		progressBarDataById
	};
}
