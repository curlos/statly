import { describe, expect, it } from '@jest/globals';
import { buildMarkdown } from './useCompletionMarkdown';
import type { AggregationResults } from '../../../../types/stats';

const MOST = 'Tasks: Most-Least';
const LEAST = 'Tasks: Least-Most';

const projects = [
	{ id: 'side', name: 'Side Projects', count: 6, percentage: 66.67 },
	{ id: 'inbox', name: 'Inbox', count: 2, percentage: 22.22 },
	{ id: 'health', name: 'Health', count: 1, percentage: 11.11 },
];

// Side Projects has "Build app" and "Write docs". Health has "Run".
const agg = {
	aggregatedData: [
		{ id: 'build', projectId: 'side' },
		{ id: 'docs', projectId: 'side' },
		{ id: 'run', projectId: 'health' },
	],
	totalMetricOnParentTask: {
		build: { value: 4, percentage: 44 },
		docs: { value: 2, percentage: 22 },
		run: { value: 1, percentage: 11 },
	},
	tasksWithNoParent: ['build', 'docs', 'run'],
	groupedTasksInfo: {},
	groupedTasksById: {},
	virtualAncestorsById: {},
	groupedSubtasksByParentTask: {},
	parentDirectChildrenTaskIdsByParentId: {},
	progressBarDataById: {},
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
		aggregationResults: null,
		progressBarData: projects,
		selected: 'Project',
		ancestorTasksById,
		projectsById: undefined,
		sortBy: MOST,
		...overrides,
	});

describe('buildMarkdown (completion stats)', () => {
	it('copies the flat list in the chosen order', () => {
		expect(getNames(build({ sortBy: MOST }))).toEqual(['Side Projects', 'Inbox', 'Health']);
		expect(getNames(build({ sortBy: LEAST }))).toEqual(['Health', 'Inbox', 'Side Projects']);
	});

	it('orders ties by name, like the list on screen', () => {
		const tied = [
			{ id: 'b', name: 'Beta', count: 3, percentage: 50 },
			{ id: 'a', name: 'alpha', count: 3, percentage: 50 },
		];
		expect(getNames(build({ progressBarData: tied, sortBy: MOST }))).toEqual(['alpha', 'Beta']);
	});

	it('reverses projects and the tasks under them in the nested project view', () => {
		const nested = { showNestedProgressBars: true, aggregationResults: agg };
		expect(getNames(build({ ...nested, sortBy: MOST }))).toEqual([
			'Side Projects',
			'Build app',
			'Write docs',
			'Inbox',
			'Health',
			'Run',
		]);
		expect(getNames(build({ ...nested, sortBy: LEAST }))).toEqual([
			'Health',
			'Run',
			'Inbox',
			'Side Projects',
			'Write docs',
			'Build app',
		]);
	});

	it('reverses top-level tasks in the nested task view', () => {
		const nested = { showNestedProgressBars: true, aggregationResults: agg, selected: 'Task' };
		expect(getNames(build({ ...nested, sortBy: MOST }))).toEqual(['Build app', 'Write docs', 'Run']);
		expect(getNames(build({ ...nested, sortBy: LEAST }))).toEqual(['Run', 'Write docs', 'Build app']);
	});
});
