import { describe, expect, it } from '@jest/globals';
import type { ForestTree } from './forestLayout';
import { describeTree } from './forestText';

const names: Record<string, string> = { health: 'Health', jobs: 'Job Hunt' };
const getProjectName = (projectId: string) => names[projectId] || 'No Project';

const makeTree = (overrides: Partial<ForestTree>): ForestTree => ({
	key: 'record-1-health',
	startTime: new Date(2026, 9, 8, 12).toISOString(),
	treeName: 'jacaranda_tree',
	projectId: 'health',
	seconds: 2700,
	projectSeconds: { health: 2700 },
	...overrides,
});

describe('describeTree', () => {
	it('describes a record with one project', () => {
		const text = describeTree(makeTree({}), getProjectName);
		expect(text.title).toBe('Health');
		expect(text.projectLines).toEqual([]);
		expect(text.details).toBe('45m · October 8, 2026');
		expect(text.treeLabel).toBe('Jacaranda Tree');
		expect(text.description).toBe('Health, 45 minutes, October 8, 2026, Jacaranda Tree');
	});

	it('lists every project in a shared record, biggest first, and says the total', () => {
		const text = describeTree(makeTree({ projectSeconds: { jobs: 1260, health: 1380 } }), getProjectName);
		expect(text.projectLines).toEqual(['Health · 23m', 'Job Hunt · 21m']);
		expect(text.description).toBe(
			'Health 23 minutes and Job Hunt 21 minutes, 45 minutes in total, October 8, 2026, Jacaranda Tree'
		);
	});

	it('calls a project it does not know by "No Project", and handles a record with no tasks', () => {
		expect(describeTree(makeTree({ projectId: 'gone', projectSeconds: {} }), getProjectName).title).toBe(
			'No Project'
		);
	});
});
