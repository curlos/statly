import { useState } from 'react';
import type { AggregationResults, ProgressBarItemData } from '../../../../types/stats';
import type { AncestorTask } from '../../../../types/api';
import type { Project } from '../../../../types/models';

type TaskLookup = Record<string, { title?: string; content?: string; projectId?: string }>;

interface UseCompletionMarkdownParams {
	selectedInterval: string;
	apiStartDate: string | null;
	apiEndDate: string | null;
	showNestedProgressBars: boolean;
	aggregationResults: AggregationResults | null;
	progressBarData: ProgressBarItemData[];
	selected: string;
	ancestorTasksById: Record<string, AncestorTask> | undefined;
	projectsById: Record<string, Project> | undefined;
}

const getIntervalLabel = (selectedInterval: string, apiStartDate: string | null, apiEndDate: string | null): string => {
	if (selectedInterval === 'All') return 'All Time';
	if (!apiStartDate) return selectedInterval;
	if (selectedInterval === 'Day') return apiStartDate;
	const start = new Date(apiStartDate);
	if (isNaN(start.getTime())) return selectedInterval;
	if (selectedInterval === 'Month') return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	if (selectedInterval === 'Year') return String(start.getFullYear());
	return apiEndDate ? `${apiStartDate} - ${apiEndDate}` : apiStartDate;
};

const formatLine = (name: string, count: number, percentage: number, depth: number): string => {
	const indent = '    '.repeat(depth);
	return `${indent}- ${name} (${count.toLocaleString()} tasks, ${parseFloat(percentage.toFixed(2))}%)`;
};

const renderNestedTaskMD = (
	taskId: string,
	depth: number,
	agg: AggregationResults,
	ancestorLookup: TaskLookup
): string => {
	const { totalMetricOnParentTask, groupedTasksInfo, virtualAncestorsById, parentDirectChildrenTaskIdsByParentId, progressBarDataById } = agg;
	const metric = totalMetricOnParentTask[taskId];
	if (!metric) return '';

	if (groupedTasksInfo?.[taskId] || virtualAncestorsById?.[taskId]) {
		const item = progressBarDataById[taskId];
		if (!item) return '';
		return formatLine(item.name || taskId, metric.value, metric.percentage, depth);
	}

	const parentTask = ancestorLookup[taskId];
	const taskName = parentTask?.title || parentTask?.content || taskId;
	let line = formatLine(taskName, metric.value, metric.percentage, depth);

	const children = parentDirectChildrenTaskIdsByParentId[taskId] || [];
	const allChildren = [...children, taskId];

	// Mirror NestedProgressBars count-mode grouping: split into branch tasks and direct/leaf tasks.
	// Direct tasks (including the parent task itself if it has direct completions) get collapsed
	// into a single "Direct Child Tasks: ParentName" entry, matching the visual renderer.
	const directTaskIds: string[] = [];
	const branchTaskIds: string[] = [];

	for (const childId of allChildren) {
		const hasChildren = (parentDirectChildrenTaskIdsByParentId[childId]?.length ?? 0) > 0;
		if (hasChildren && childId !== taskId) {
			branchTaskIds.push(childId);
		} else if (progressBarDataById[childId]) {
			directTaskIds.push(childId);
		}
	}

	const childEntries: { value: number; text: string }[] = [];

	// Only recurse into branch tasks; direct/leaf tasks are omitted entirely
	for (const childId of branchTaskIds) {
		const childValue = totalMetricOnParentTask[childId]?.value ?? 0;
		const childText = renderNestedTaskMD(childId, depth + 1, agg, ancestorLookup);
		if (childText) childEntries.push({ value: childValue, text: childText });
	}

	childEntries.sort((a, b) => b.value - a.value);

	if (childEntries.length > 0) line += '\n' + childEntries.map(e => e.text).join('\n');

	return line;
};

const renderProjectViewMD = (
	projects: ProgressBarItemData[],
	agg: AggregationResults,
	ancestorLookup: TaskLookup,
	baseDepth: number
): string => {
	const { aggregatedData, totalMetricOnParentTask } = agg;

	const groupedProjectsAndTasks: Record<string, string[]> = {};
	for (const item of aggregatedData) {
		const projectId = item.projectId as string | undefined;
		if (!projectId) continue;
		if (!groupedProjectsAndTasks[projectId]) groupedProjectsAndTasks[projectId] = [];
		groupedProjectsAndTasks[projectId].push(item.id);
	}

	return projects
		.filter(p => p.id !== 'No Data')
		.map(project => {
			let line = formatLine(project.name || project.id, project.count ?? 0, project.percentage ?? 0, baseDepth);
			const taskIds = [...(groupedProjectsAndTasks[project.id] || [])].sort((a, b) =>
				(totalMetricOnParentTask[b]?.value ?? 0) - (totalMetricOnParentTask[a]?.value ?? 0)
			);
			const taskLines = taskIds.map(taskId => renderNestedTaskMD(taskId, baseDepth + 1, agg, ancestorLookup)).filter(Boolean);
			if (taskLines.length > 0) line += '\n' + taskLines.join('\n');
			return line;
		})
		.join('\n');
};

const buildMarkdown = (params: UseCompletionMarkdownParams): string => {
	const { selectedInterval, apiStartDate, apiEndDate, showNestedProgressBars, aggregationResults, progressBarData, selected, ancestorTasksById } = params;

	const header = `# ${getIntervalLabel(selectedInterval, apiStartDate, apiEndDate)}\n\n`;

	if (!showNestedProgressBars || !aggregationResults) {
		return header + progressBarData
			.filter(item => item.id !== 'No Data')
			.map(item => formatLine(item.name || 'Unknown', item.count ?? 0, item.percentage ?? 0, 0))
			.join('\n');
	}

	const ancestorLookup = (ancestorTasksById || {}) as TaskLookup;

	if (selected === 'Project') {
		if (!aggregationResults.tasksWithNoParent) return '';
		const sortedProjects = [...progressBarData].sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
		return header + renderProjectViewMD(sortedProjects, aggregationResults, ancestorLookup, 0);
	}

	if (selected === 'Task') {
		if (!aggregationResults.tasksWithNoParent) return '';
		const sortedTasks = [...aggregationResults.tasksWithNoParent].sort((a, b) =>
			(aggregationResults.totalMetricOnParentTask[b]?.value ?? 0) - (aggregationResults.totalMetricOnParentTask[a]?.value ?? 0)
		);
		return header + sortedTasks.map(taskId => renderNestedTaskMD(taskId, 0, aggregationResults, ancestorLookup)).filter(Boolean).join('\n');
	}

	return '';
};

export const useCompletionMarkdown = (params: UseCompletionMarkdownParams) => {
	const [copied, setCopied] = useState(false);

	const handleCopyMarkdown = async () => {
		const markdown = buildMarkdown(params);
		await navigator.clipboard.writeText(markdown);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return { copied, handleCopyMarkdown };
};
