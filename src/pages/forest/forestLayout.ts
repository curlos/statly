// Pure layout logic for the forest page: where each tree is planted on the land. It has no React or canvas code so it can be tested on its own.

export interface ForestTree {
	key: string;
	startTime: string;
	treeName: string;
	// What the tooltip and screen readers say is worked out from these only when a tree is shown, because doing it for every tree is slow.
	projectId: string;
	// The whole record's length
	seconds: number;
	// The time each project had in this record, from its tasks
	projectSeconds: Record<string, number>;
}

export interface PlacedTree extends ForestTree {
	column: number;
	row: number;
}

// World units. A tile's width is sqrt(3) times its height, which is the true isometric angle.
export const TILE_HALF_WIDTH = 20;
export const TILE_HALF_HEIGHT = 11.55;

export const MIN_GRID_SIDE = 10;
// Share of grid cells that hold a tree. Low on purpose so trees have room and the grid grows with the tree count.
export const GRID_FILL_RATIO = 0.25;
// Rings of empty cells kept around the edge of the land.
export const LAND_PADDING_CELLS = 1;
// How far a tree can drift from the middle of its stretch, as a share of the stretch. 0 spaces trees perfectly evenly, 1 allows anywhere in the stretch.
export const PLANTING_NUDGE = 0.8;

// The walls stay this tall at every grid size, so a bigger forest reads as a wider, thinner slab.
export const LAND_DEPTH = 50;

export const hashString = (text: string) => {
	let hash = 2166136261;
	for (let i = 0; i < text.length; i++) {
		hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
	}
	// Extra mixing so similar strings (like "cell-1" and "cell-2") spread out evenly instead of clumping.
	hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
	hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
	return (hash ^ (hash >>> 16)) >>> 0;
};

// Repeatable pseudo-random number from 0 to 1, so the land details never move between redraws.
export const getSeededRandom = (label: string, index: number) => hashString(`${label}-${index}`) / 4294967296;

// Trees are planted in the order of their focus records, like reading rows of text. The first row runs from the left corner of the land to the top corner along the top-left edge, then each next row does the same one step closer to the bottom-right edge. Every position comes from the trees' times and keys, so the same trees always land in the same cells.
export const getLayout = (trees: ForestTree[]) => {
	// The outer ring of cells stays empty, which leaves one cell of space between the trees and the edge of the land.
	const side = Math.max(MIN_GRID_SIDE, Math.ceil(Math.sqrt(trees.length / GRID_FILL_RATIO)) + LAND_PADDING_CELLS * 2);
	const cellCount = side * side;

	// Plantable cells in planting order: row by row, each row from the left corner to the top corner.
	const plantableCells: number[] = [];
	for (let column = LAND_PADDING_CELLS; column < side - LAND_PADDING_CELLS; column++) {
		for (let row = side - LAND_PADDING_CELLS - 1; row >= LAND_PADDING_CELLS; row--) {
			plantableCells.push(row * side + column);
		}
	}

	const treesByTime = [...trees].sort(
		(a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime() || a.key.localeCompare(b.key)
	);

	// Splits the ordered cells into one equal stretch per tree and plants each tree near the middle of its own stretch, so trees are spaced as evenly as possible over the whole land while staying in time order. The small random nudge keeps it from looking like a lattice.
	let previousCellIndex = -1;
	const placedTrees: PlacedTree[] = treesByTime
		.map((tree, index) => {
			const nudge = (getSeededRandom('nudge', hashString(tree.key)) - 0.5) * PLANTING_NUDGE;
			const stretchPosition = index + 0.5 + nudge;
			const wantedCellIndex = Math.floor((stretchPosition * plantableCells.length) / treesByTime.length);
			// Rounding can put two neighbors on the same cell, so each tree takes the first free cell at or after the one it wants, while leaving enough cells for the trees still to come.
			const cellIndex = Math.min(
				Math.max(wantedCellIndex, previousCellIndex + 1),
				plantableCells.length - (treesByTime.length - index)
			);
			previousCellIndex = cellIndex;
			const cell = plantableCells[cellIndex];
			return { ...tree, column: cell % side, row: Math.floor(cell / side) };
		})
		.sort((a, b) => a.column + a.row - (b.column + b.row));

	const cells = new Int32Array(cellCount).fill(-1);
	placedTrees.forEach((tree, index) => {
		cells[tree.row * side + tree.column] = index;
	});

	return { side, depth: LAND_DEPTH, placedTrees, cells };
};

export const getTreeBase = (column: number, row: number) => ({
	x: (column - row) * TILE_HALF_WIDTH,
	y: (column + row + 1) * TILE_HALF_HEIGHT,
});
