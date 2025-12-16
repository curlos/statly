/**
 * Shared types for stats aggregation and task data
 */

import type { AncestorTask } from './api';

export interface ProgressBarItemData {
	id: string;
	name?: string;
	value?: number;
	percentage?: number;
	count?: number;
	duration?: number;
	type?: 'project' | 'task' | 'emotion';
	projectId?: string;
	color?: string;
	[key: string]: unknown;
}

export interface GroupedTaskInfo extends ProgressBarItemData {
	isGrouped: boolean;
	instanceCount: number;
}

export interface GroupedTaskById {
	id: string;
	title: string;
	content: string;
	projectId?: string;
	color?: string;
}

export interface AggregationResults {
	aggregatedData: ProgressBarItemData[];
	totalMetricOnParentTask: Record<string, { value: number; percentage: number }>;
	tasksWithNoParent: string[];
	groupedTasksInfo: Record<string, GroupedTaskInfo>;
	groupedTasksById: Record<string, GroupedTaskById>;
	virtualAncestorsById: Record<string, GroupedTaskById>;
	groupedSubtasksByParentTask: Record<string, AncestorTask[]>;
	parentDirectChildrenTaskIdsByParentId: Record<string, string[]>;
	progressBarDataById: Record<string, ProgressBarItemData>;
}

export interface EmotionProgressBarData {
	byProject: ProgressBarItemData[];
	byTask: ProgressBarItemData[];
	ancestorTasksById: Record<string, AncestorTask>;
}
