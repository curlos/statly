import type { LandColors } from './landStyles';
import { TILE_HALF_HEIGHT, TILE_HALF_WIDTH, getLayout, getTreeBase, type PlacedTree } from './forestLayout';
import { drawLand } from './drawLand';
import { SMALL_SPRITE_SIZE, MEDIUM_SPRITE_SIZE, TREE_BASE_RATIO, TREE_SIZE, spritesByTree } from './forestSprites';

export const CACHE_MIN_TREES = 1500;
const MAX_CACHE_SIDE = 3000;
const CACHE_PADDING = 30;
// Past this many trees on screen, drawing them live each frame is too slow, so a moving view uses the cached picture
export const LIVE_TREE_BUDGET = 8000;
// Past this many, even one live draw takes too long (about half a second at 45,000)
export const SHARP_TREE_LIMIT = 30000;
export const SHARP_REDRAW_DELAY_MS = 140;

const SHADOW_COLOR = 'rgba(20, 30, 10, 0.26)';
const SHADOW_WIDTH_RATIO = 0.65;
const SHADOW_MIN_RADIUS = TREE_SIZE * 0.1;
const SHADOW_MAX_RADIUS = TREE_SIZE * 0.28;
// The ground is squashed by the isometric angle, so shadows are flattened to match the tiles.
const SHADOW_FLATTEN = TILE_HALF_HEIGHT / TILE_HALF_WIDTH;

// A ring around the base of the tree picked with the keyboard, dark under light so it shows on any land. The context is already set up to draw in world units.
export const drawSelectionRing = (context: CanvasRenderingContext2D, tree: PlacedTree, scale: number) => {
	const base = getTreeBase(tree.column, tree.row);
	const radiusX = TREE_SIZE * 0.38;
	context.beginPath();
	context.ellipse(base.x, base.y - 1, radiusX, (radiusX * TILE_HALF_HEIGHT) / TILE_HALF_WIDTH, 0, 0, Math.PI * 2);
	context.lineWidth = 5 / scale;
	context.strokeStyle = 'rgba(0, 0, 0, 0.65)';
	context.stroke();
	context.lineWidth = 2.5 / scale;
	context.strokeStyle = '#ffffff';
	context.stroke();
};

export interface ForestView {
	scale: number;
	x: number;
	y: number;
}

// The trees whose pictures reach into the view, with a little room around the edges
export const getVisibleTrees = (
	layout: ReturnType<typeof getLayout>,
	view: ForestView,
	width: number,
	height: number
) => {
	const { scale, x: viewX, y: viewY } = view;
	const visibleLeft = -viewX / scale - TREE_SIZE;
	const visibleRight = (width - viewX) / scale + TREE_SIZE;
	const visibleTop = -viewY / scale - TREE_SIZE;
	const visibleBottom = (height - viewY) / scale + TREE_SIZE;

	return layout.placedTrees.filter((tree) => {
		const base = getTreeBase(tree.column, tree.row);
		return base.x >= visibleLeft && base.x <= visibleRight && base.y >= visibleTop && base.y <= visibleBottom;
	});
};

// Draws the land and every tree that is on screen. The same drawing is used for the page and for the share card.
export const renderForest = (
	context: CanvasRenderingContext2D,
	{
		width,
		height,
		pixelRatio,
		view,
		layout,
		land,
		selectedTree,
		visibleTrees: knownVisibleTrees,
	}: {
		width: number;
		height: number;
		pixelRatio: number;
		view: ForestView;
		layout: ReturnType<typeof getLayout>;
		land: LandColors;
		selectedTree?: PlacedTree | null;
		visibleTrees?: PlacedTree[];
	}
) => {
	const { scale, x: viewX, y: viewY } = view;
	const { side } = layout;

	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	context.setTransform(pixelRatio * scale, 0, 0, pixelRatio * scale, pixelRatio * viewX, pixelRatio * viewY);
	drawLand(context, land, side);

	// Only draw what's on screen, using the smallest copy of each image that still looks sharp.
	const treePixels = TREE_SIZE * scale * pixelRatio;
	const spriteKey = treePixels <= SMALL_SPRITE_SIZE ? 'small' : treePixels <= MEDIUM_SPRITE_SIZE ? 'medium' : 'full';
	const visibleTrees = knownVisibleTrees ?? getVisibleTrees(layout, view, width, height);

	// All shadows go on the ground first, in one shape so overlapping ones merge instead of piling up darker, then the trees on top.
	context.fillStyle = SHADOW_COLOR;
	context.beginPath();
	for (const tree of visibleTrees) {
		const sprites = spritesByTree.get(tree.treeName);
		if (!sprites) continue;

		const { centerX, bottomY, width: footprintWidth } = sprites.footprint;
		const base = getTreeBase(tree.column, tree.row);
		const radiusX = Math.min(
			SHADOW_MAX_RADIUS,
			Math.max(SHADOW_MIN_RADIUS, (footprintWidth * TREE_SIZE * SHADOW_WIDTH_RATIO) / 2)
		);
		const radiusY = radiusX * SHADOW_FLATTEN;
		const shadowX = base.x + (centerX - 0.5) * TREE_SIZE;
		const shadowY = base.y + (bottomY - TREE_BASE_RATIO) * TREE_SIZE - radiusY * 0.35;

		context.moveTo(shadowX + radiusX, shadowY);
		context.ellipse(shadowX, shadowY, radiusX, radiusY, 0, 0, Math.PI * 2);
	}
	context.fill();

	for (const tree of visibleTrees) {
		const sprites = spritesByTree.get(tree.treeName);
		if (sprites) {
			const base = getTreeBase(tree.column, tree.row);
			context.drawImage(
				sprites[spriteKey],
				base.x - TREE_SIZE / 2,
				base.y - TREE_SIZE * TREE_BASE_RATIO,
				TREE_SIZE,
				TREE_SIZE
			);
		}
	}

	if (selectedTree) drawSelectionRing(context, selectedTree, scale);
};

// A big forest has too many trees to draw each frame, and zoomed out they are only a few pixels wide anyway. So the whole forest is drawn once into this picture, and zoomed out each frame just draws the picture. Zoomed in, the few trees on screen are drawn live instead.
export interface ForestCache {
	canvas: HTMLCanvasElement;
	scale: number;
	minX: number;
	minY: number;
	layout: ReturnType<typeof getLayout>;
	land: LandColors;
}

export const getCacheScale = (layout: ReturnType<typeof getLayout>) => {
	const { worldWidth, worldHeight } = getForestExtent(layout);
	return Math.min(1, MAX_CACHE_SIDE / worldWidth, MAX_CACHE_SIDE / worldHeight);
};

// The part of the world the forest covers, with a little room for trees at the edges
const getForestExtent = ({ side, depth }: ReturnType<typeof getLayout>) => ({
	minX: -side * TILE_HALF_WIDTH - CACHE_PADDING,
	minY: -TREE_SIZE,
	worldWidth: side * TILE_HALF_WIDTH * 2 + CACHE_PADDING * 2,
	worldHeight: side * TILE_HALF_HEIGHT * 2 + depth + TREE_SIZE + CACHE_PADDING,
});

export const buildForestCache = (layout: ReturnType<typeof getLayout>, land: LandColors): ForestCache => {
	const { minX, minY, worldWidth, worldHeight } = getForestExtent(layout);
	const scale = getCacheScale(layout);

	const canvas = document.createElement('canvas');
	canvas.width = Math.ceil(worldWidth * scale);
	canvas.height = Math.ceil(worldHeight * scale);

	renderForest(canvas.getContext('2d')!, {
		width: canvas.width,
		height: canvas.height,
		pixelRatio: 1,
		view: { scale, x: -minX * scale, y: -minY * scale },
		layout,
		land,
	});

	return { canvas, scale, minX, minY, layout, land };
};
