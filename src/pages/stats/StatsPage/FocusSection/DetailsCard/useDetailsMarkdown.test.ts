import { describe, expect, it } from '@jest/globals';
import { buildMarkdown } from './useDetailsMarkdown';
import type { AggregationResults } from '../../../../../types/stats';

const MOST = 'Focus Time: Most-Least';
const LEAST = 'Focus Time: Least-Most';

const projects = [
	{ id: 'side', name: 'Side Projects', duration: 17100, percentage: 86.36 },
	{ id: 'health', name: 'Health', duration: 2700, percentage: 13.64 },
];

// Side Projects has "Build app" (with two subtasks) and "Write docs". Health has "Run".
const agg = {
	aggregatedData: [
		{ id: 'build', projectId: 'side' },
		{ id: 'docs', projectId: 'side' },
		{ id: 'run', projectId: 'health' },
	],
	totalMetricOnParentTask: {
		build: { value: 10000, percentage: 50 },
		docs: { value: 7100, percentage: 36 },
		run: { value: 2700, percentage: 14 },
	},
	tasksWithNoParent: ['build', 'docs', 'run'],
	groupedTasksInfo: {},
	groupedTasksById: {},
	virtualAncestorsById: {},
	groupedSubtasksByParentTask: {},
	parentDirectChildrenTaskIdsByParentId: { build: ['small', 'big'] },
	progressBarDataById: {
		small: { id: 'small', name: 'Small subtask', duration: 4000, percentage: 20 },
		big: { id: 'big', name: 'Big subtask', duration: 6000, percentage: 30 },
	},
} as unknown as AggregationResults;

const ancestorTasksById = {
	build: { title: 'Build app' },
	docs: { title: 'Write docs' },
	run: { title: 'Run' },
} as never;

// The names in the copied Markdown, top to bottom
const getNames = (markdown: string) =>
	markdown
		.split('\n')
		.filter((line) => line.trim().startsWith('- '))
		.map((line) =>
			line
				.trim()
				.replace(/^- /, '')
				.replace(/ \(.*$/, '')
		);

const build = (overrides: Partial<Parameters<typeof buildMarkdown>[0]>) =>
	buildMarkdown({
		selectedInterval: 'Day',
		apiStartDate: 'Nov 4, 2026',
		apiEndDate: 'Nov 4, 2026',
		showNestedProgressBars: false,
		aggregationResults: undefined,
		progressBarData: projects,
		selected: 'Project',
		ancestorTasksById,
		byEmotionWithTasks: undefined,
		projectsById: undefined,
		sortBy: MOST,
		...overrides,
	});

describe('buildMarkdown (focus details)', () => {
	it('copies the flat list in the chosen order', () => {
		expect(getNames(build({ sortBy: MOST }))).toEqual(['Side Projects', 'Health']);
		expect(getNames(build({ sortBy: LEAST }))).toEqual(['Health', 'Side Projects']);
	});

	it('orders ties by name, like the list on screen', () => {
		const tied = [
			{ id: 'b', name: 'Beta', duration: 60, percentage: 50 },
			{ id: 'a', name: 'alpha', duration: 60, percentage: 50 },
		];
		expect(getNames(build({ progressBarData: tied, sortBy: LEAST }))).toEqual(['alpha', 'Beta']);
	});

	it('leaves out the No Data row', () => {
		const noData = [{ id: 'No Data', name: 'No Data', duration: 0, percentage: 100 }];
		expect(getNames(build({ progressBarData: noData }))).toEqual([]);
	});

	it('reverses projects and the tasks under them in the nested project view', () => {
		const nested = { showNestedProgressBars: true, aggregationResults: agg };
		expect(getNames(build({ ...nested, sortBy: MOST }))).toEqual([
			'Side Projects',
			'Build app',
			'Big subtask',
			'Small subtask',
			'Write docs',
			'Health',
			'Run',
		]);
		expect(getNames(build({ ...nested, sortBy: LEAST }))).toEqual([
			'Health',
			'Run',
			'Side Projects',
			'Write docs',
			'Build app',
			'Big subtask',
			'Small subtask',
		]);
	});

	it('reverses top-level tasks but keeps subtasks most to least in the nested task view', () => {
		const nested = { showNestedProgressBars: true, aggregationResults: agg, selected: 'Task' };
		expect(getNames(build({ ...nested, sortBy: LEAST }))).toEqual([
			'Run',
			'Write docs',
			'Build app',
			'Big subtask',
			'Small subtask',
		]);
		expect(getNames(build({ ...nested, sortBy: MOST }))).toEqual([
			'Build app',
			'Big subtask',
			'Small subtask',
			'Write docs',
			'Run',
		]);
	});
});
