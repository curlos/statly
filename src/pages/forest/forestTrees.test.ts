import { describe, expect, it } from '@jest/globals';
import { DEFAULT_TREE, TREE_NAMES, getAssignedTree, getPlantedTreeNames, getSeasonalTree, getSpokenDuration, getTreeDisplayName, getTreeImageSrc } from './forestTrees';

describe('getTreeDisplayName', () => {
	it('turns file names into title case words', () => {
		expect(getTreeDisplayName('pine_tree')).toBe('Pine Tree');
		expect(getTreeDisplayName('pine_tree_christmas')).toBe('Pine Tree Christmas');
		expect(getTreeDisplayName('anniversary_cake_10_fairies')).toBe('Anniversary Cake 10 Fairies');
	});
});

describe('getSpokenDuration', () => {
	it('says hours and minutes in words', () => {
		expect(getSpokenDuration(4200)).toBe('1 hour 10 minutes');
		expect(getSpokenDuration(7380)).toBe('2 hours 3 minutes');
		expect(getSpokenDuration(3600)).toBe('1 hour');
		expect(getSpokenDuration(2700)).toBe('45 minutes');
		expect(getSpokenDuration(60)).toBe('1 minute');
	});

	it('uses seconds for anything under a minute', () => {
		expect(getSpokenDuration(16)).toBe('16 seconds');
		expect(getSpokenDuration(1)).toBe('1 second');
	});
});

describe('getAssignedTree', () => {
	it('returns the tree assigned to the project', () => {
		expect(getAssignedTree('project-1', { 'project-1': 'maple_tree' })).toBe('maple_tree');
	});

	it('falls back to the default tree when nothing is assigned or the tree no longer exists', () => {
		expect(getAssignedTree('project-2', { 'project-1': 'maple_tree' })).toBe(DEFAULT_TREE);
		expect(getAssignedTree('project-1', { 'project-1': 'deleted_tree' })).toBe(DEFAULT_TREE);
		expect(getAssignedTree('', {})).toBe(DEFAULT_TREE);
	});
});

describe('getSeasonalTree', () => {
	const inDecember = new Date(2026, 11, 15, 12).toISOString();
	const inJuly = new Date(2026, 6, 15, 12).toISOString();

	it('swaps in the Christmas version in December when there is one', () => {
		expect(getSeasonalTree('bird_tree', inDecember)).toBe('bird_tree_christmas');
	});

	it('keeps the normal tree outside December, or when there is no Christmas version', () => {
		expect(getSeasonalTree('bird_tree', inJuly)).toBe('bird_tree');
		expect(getSeasonalTree('sakura_tree', inDecember)).toBe('sakura_tree');
	});
});

describe('getPlantedTreeNames', () => {
	const inDecember = new Date(2026, 11, 15, 12).toISOString();
	const inJuly = new Date(2026, 6, 15, 12).toISOString();

	it('lists the trees that were really planted, so December records show the Christmas version', () => {
		const planted = getPlantedTreeNames([{ projectId: 'a', startTime: inDecember }], { a: 'bird_tree' });
		expect(planted.get('a')).toEqual(['bird_tree_christmas']);
	});

	it('lists both versions, most common first, when a range crosses into December', () => {
		const trees = [
			{ projectId: 'a', startTime: inJuly },
			{ projectId: 'a', startTime: inJuly },
			{ projectId: 'a', startTime: inDecember },
		];
		expect(getPlantedTreeNames(trees, { a: 'bird_tree' }).get('a')).toEqual(['bird_tree', 'bird_tree_christmas']);
	});

	it('uses the default tree for projects with nothing assigned, and keeps projects separate', () => {
		const planted = getPlantedTreeNames([{ projectId: 'a', startTime: inJuly }, { projectId: 'b', startTime: inJuly }], { b: 'maple_tree' });
		expect(planted.get('a')).toEqual([DEFAULT_TREE]);
		expect(planted.get('b')).toEqual(['maple_tree']);
	});

	it('has nothing for a project with no trees', () => {
		expect(getPlantedTreeNames([], {}).get('a')).toBeUndefined();
	});
});

describe('tree list', () => {
	it('has no repeated names and a default that exists', () => {
		expect(new Set(TREE_NAMES).size).toBe(TREE_NAMES.length);
		expect(TREE_NAMES).toContain(DEFAULT_TREE);
	});

	it('builds image paths in the forest folder', () => {
		expect(getTreeImageSrc('pine_tree')).toBe('/images/forest/pine_tree.png');
	});
});
