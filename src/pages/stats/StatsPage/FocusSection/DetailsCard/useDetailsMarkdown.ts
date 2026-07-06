import { useState } from 'react';
import { getFormattedDuration } from '../../../../../utils/helpers.utils';
import type { AggregationResults, ProgressBarItemData, EmotionProgressBarData } from '../../../../../types/stats';
import type { AncestorTask } from '../../../../../types/api';
import type { Project } from '../../../../../types/models';

type TaskLookup = Record<string, { title?: string; content?: string; projectId?: string }>;

interface UseDetailsMarkdownParams {
	selectedInterval: string;
	apiStartDate: string | null;
	apiEndDate: string | null;
	showNestedProgressBars: boolean;
	aggregationResults: AggregationResults | Record<string, AggregationResults> | undefined;
	progressBarData: ProgressBarItemData[];
	selected: string;
	ancestorTasksById: Record<string, AncestorTask> | undefined;
	byEmotionWithTasks: Record<string, EmotionProgressBarData> | undefined;
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

const formatLine = (name: string, duration: number, percentage: number, depth: number): string => {
	const indent = '    '.repeat(depth);
	return `${indent}- ${name} (${getFormattedDuration(duration, false)}, ${parseFloat(percentage.toFixed(2))}%)`;
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
	const allChildren = [...children, taskId].sort((a, b) => {
		const va = a === taskId ? (progressBarDataById[a]?.duration ?? 0) : (totalMetricOnParentTask[a]?.value ?? progressBarDataById[a]?.duration ?? 0);
		const vb = b === taskId ? (progressBarDataById[b]?.duration ?? 0) : (totalMetricOnParentTask[b]?.value ?? progressBarDataById[b]?.duration ?? 0);
		return vb - va;
	});

	const childLines: string[] = [];
	for (const childId of allChildren) {
		if (childId === taskId) {
			if (children.length > 0) {
				const item = progressBarDataById[childId];
				if (item) childLines.push(formatLine(item.name || childId, item.duration ?? 0, item.percentage ?? 0, depth + 1));
			}
			continue;
		}
		if ((parentDirectChildrenTaskIdsByParentId[childId]?.length ?? 0) > 0) {
			childLines.push(renderNestedTaskMD(childId, depth + 1, agg, ancestorLookup));
		} else {
			const item = progressBarDataById[childId];
			if (item) childLines.push(formatLine(item.name || childId, item.duration ?? 0, item.percentage ?? 0, depth + 1));
		}
	}
	const nonEmpty = childLines.filter(Boolean);
	if (nonEmpty.length > 0) line += '\n' + nonEmpty.join('\n');

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
			let line = formatLine(project.name || project.id, project.duration ?? 0, project.percentage ?? 0, baseDepth);
			const taskIds = [...(groupedProjectsAndTasks[project.id] || [])].sort((a, b) =>
				(totalMetricOnParentTask[b]?.value ?? 0) - (totalMetricOnParentTask[a]?.value ?? 0)
			);
			const taskLines = taskIds.map(taskId => renderNestedTaskMD(taskId, baseDepth + 1, agg, ancestorLookup)).filter(Boolean);
			if (taskLines.length > 0) line += '\n' + taskLines.join('\n');
			return line;
		})
		.join('\n');
};

const buildMarkdown = (params: UseDetailsMarkdownParams): string => {
	const { selectedInterval, apiStartDate, apiEndDate, showNestedProgressBars, aggregationResults, progressBarData, selected, ancestorTasksById, byEmotionWithTasks, projectsById } = params;

	const header = `# ${getIntervalLabel(selectedInterval, apiStartDate, apiEndDate)}\n\n`;

	if (!showNestedProgressBars || !aggregationResults) {
		return header + progressBarData
			.filter(item => item.id !== 'No Data')
			.map(item => formatLine(item.name || 'Unknown', item.duration ?? 0, item.percentage ?? 0, 0))
			.join('\n');
	}

	const ancestorLookup = (ancestorTasksById || {}) as TaskLookup;

	if (selected === 'Project') {
		const agg = aggregationResults as AggregationResults;
		if (!agg?.tasksWithNoParent) return '';
		const sortedProjects = [...progressBarData].sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));
		return header + renderProjectViewMD(sortedProjects, agg, ancestorLookup, 0);
	}

	if (selected === 'Task') {
		const agg = aggregationResults as AggregationResults;
		if (!agg?.tasksWithNoParent) return '';
		const sortedTasks = [...agg.tasksWithNoParent].sort((a, b) =>
			(agg.totalMetricOnParentTask[b]?.value ?? 0) - (agg.totalMetricOnParentTask[a]?.value ?? 0)
		);
		return header + sortedTasks.map(taskId => renderNestedTaskMD(taskId, 0, agg, ancestorLookup)).filter(Boolean).join('\n');
	}

	if (selected === 'Emotion' && !('tasksWithNoParent' in aggregationResults)) {
		const byEmotion = aggregationResults as Record<string, AggregationResults>;
		const body = progressBarData
			.filter(e => e.id !== 'No Data')
			.map(emotion => {
				let line = formatLine(emotion.name || 'Unknown', emotion.duration ?? 0, emotion.percentage ?? 0, 0);
				if (byEmotionWithTasks) {
					const emotionAgg = byEmotion[emotion.id];
					const emotionData = byEmotionWithTasks[emotion.id];
					if (emotionAgg && emotionData) {
						const emotionAncestorLookup = (emotionData.ancestorTasksById || {}) as TaskLookup;
						const enrichedProjects = emotionData.byProject.map(project => ({
							...project,
							name: projectsById?.[project.id]?.name || project.id,
						}));
						const projectLines = renderProjectViewMD(enrichedProjects, emotionAgg, emotionAncestorLookup, 1);
						if (projectLines) line += '\n' + projectLines;
					}
				}
				return line;
			})
			.join('\n');
		return header + body;
	}

	return '';
};

export const useDetailsMarkdown = (params: UseDetailsMarkdownParams) => {
	const [copied, setCopied] = useState(false);

	const handleCopyMarkdown = async () => {
		const markdown = buildMarkdown(params);
		await navigator.clipboard.writeText(markdown);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return { copied, handleCopyMarkdown };
};
