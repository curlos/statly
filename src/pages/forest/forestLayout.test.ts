import { describe, expect, it } from '@jest/globals';
import {
	GRID_FILL_RATIO,
	LAND_PADDING_CELLS,
	MIN_GRID_SIDE,
	getLayout,
	getSeededRandom,
	type ForestTree,
} from './forestLayout';

const makeTrees = (count: number): ForestTree[] =>
	Array.from({ length: count }, (_, index) => ({
		key: `record-${index}-project`,
		startTime: new Date(Date.UTC(2026, 0, 1) + index * 25 * 60 * 1000).toISOString(),
		treeName: 'pine_tree',
		projectId: 'project',
		seconds: 1500,
		projectSeconds: { project: 1500 },
	}));

// The position of a cell in planting order: row by row, each row from the left corner to the top corner.
const getPlantingOrder = (column: number, row: number, side: number) =>
	(column - LAND_PADDING_CELLS) * side + (side - LAND_PADDING_CELLS - 1 - row);

describe('getLayout', () => {
	it('plants exactly one tree per input tree', () => {
		const { placedTrees } = getLayout(makeTrees(250));
		expect(placedTrees).toHaveLength(250);
	});

	it('uses a minimum grid for a few trees, and a bigger one as the tree count grows', () => {
		expect(getLayout(makeTrees(0)).side).toBe(MIN_GRID_SIDE);
		expect(getLayout(makeTrees(8)).side).toBe(MIN_GRID_SIDE);
		expect(getLayout(makeTrees(2000)).side).toBeGreaterThan(getLayout(makeTrees(200)).side);
	});

	it('leaves the outer ring of cells empty', () => {
		const { side, placedTrees } = getLayout(makeTrees(1500));
		placedTrees.forEach(({ column, row }) => {
			expect(column).toBeGreaterThanOrEqual(LAND_PADDING_CELLS);
			expect(row).toBeGreaterThanOrEqual(LAND_PADDING_CELLS);
			expect(column).toBeLessThan(side - LAND_PADDING_CELLS);
			expect(row).toBeLessThan(side - LAND_PADDING_CELLS);
		});
	});

	it('never puts two trees in the same cell', () => {
		[8, 45, 217, 2365, 12400].forEach((count) => {
			const { placedTrees } = getLayout(makeTrees(count));
			const cells = new Set(placedTrees.map(({ column, row }) => `${column},${row}`));
			expect(cells.size).toBe(count);
		});
	});

	it('plants trees in time order, row by row', () => {
		const trees = makeTrees(600);
		const { side, placedTrees } = getLayout(trees);
		const cellByKey = new Map(placedTrees.map((tree) => [tree.key, getPlantingOrder(tree.column, tree.row, side)]));
		const orders = trees.map((tree) => cellByKey.get(tree.key)!);
		orders.slice(1).forEach((order, index) => expect(order).toBeGreaterThan(orders[index]));
	});

	it('plants the same trees in the same cells every time, whatever order they arrive in', () => {
		const trees = makeTrees(300);
		const shuffled = [...trees].sort((a, b) => a.key.localeCompare(b.key));
		const toPositions = (input: ForestTree[]) =>
			Object.fromEntries(getLayout(input).placedTrees.map(({ key, column, row }) => [key, `${column},${row}`]));
		expect(toPositions(shuffled)).toEqual(toPositions(trees));
	});

	it('keeps trees spread over the land instead of piled in one corner', () => {
		const { side, placedTrees } = getLayout(makeTrees(1000));
		const lastRowShare = placedTrees.filter(({ column }) => column >= side / 2).length / placedTrees.length;
		expect(lastRowShare).toBeGreaterThan(0.4);
		expect(lastRowShare).toBeLessThan(0.6);
	});

	it('uses roughly the fill ratio the layout is designed for', () => {
		const count = 5000;
		const { side } = getLayout(makeTrees(count));
		const plantableCells = (side - LAND_PADDING_CELLS * 2) ** 2;
		expect(count / plantableCells).toBeLessThanOrEqual(GRID_FILL_RATIO);
	});
});

describe('getSeededRandom', () => {
	it('returns the same number for the same input, always between 0 and 1', () => {
		expect(getSeededRandom('label', 3)).toBe(getSeededRandom('label', 3));
		for (let index = 0; index < 500; index++) {
			const value = getSeededRandom('check', index);
			expect(value).toBeGreaterThanOrEqual(0);
			expect(value).toBeLessThan(1);
		}
	});
});
