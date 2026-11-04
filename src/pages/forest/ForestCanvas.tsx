import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Icon from '../../components/Icon';
import type { LandColors } from './landStyles';
import type { TreeText } from './forestText';
import {
	MIN_GRID_SIDE,
	TILE_HALF_HEIGHT,
	TILE_HALF_WIDTH,
	getLayout,
	getTreeBase,
	type ForestTree,
	type PlacedTree,
} from './forestLayout';
import { useForestGestures } from './useForestGestures';
import { TREE_BASE_RATIO, TREE_SIZE, loadSprites, spritesByTree } from './forestSprites';
import {
	CACHE_MIN_TREES,
	LIVE_TREE_BUDGET,
	SHARP_REDRAW_DELAY_MS,
	SHARP_TREE_LIMIT,
	buildForestCache,
	drawSelectionRing,
	getCacheScale,
	getVisibleTrees,
	renderForest,
	type ForestCache,
} from './forestRender';

// The smallest block starts at this share of the panel's width, and each extra cell of grid adds a little more, so the block grows with the record count until it fits the panel.
const MIN_INITIAL_LAND_WIDTH_RATIO = 0.72;
const INITIAL_LAND_WIDTH_RATIO_PER_CELL = 0.01;
// Panels narrower than this are phones, where the block starts as large as it can while still fully fitting.
const PHONE_PANEL_MAX_WIDTH = 640;

export interface ForestCanvasHandle {
	// Draws the whole forest, fitted to the given size, onto a new canvas with a transparent background
	renderImage: (width: number, height: number) => HTMLCanvasElement;
}

interface ForestCanvasProps {
	trees: ForestTree[];
	land: LandColors;
	ariaLabel: string;
	// The words for a tree's tooltip and announcement
	describeTree: (tree: ForestTree) => TreeText;
	// The id of the text on the page that describes the forest, for screen readers
	describedById?: string;
	// Called when a tree is clicked, or tapped a second time on touch screens
	onOpenTree?: (tree: ForestTree) => void;
}

// How "no more trees" is said for each arrow key
const DIRECTION_WORDS = { left: 'to the left', right: 'to the right', up: 'above', down: 'below' };

const ForestCanvas = forwardRef<ForestCanvasHandle, ForestCanvasProps>(function ForestCanvas(
	{ trees, land, ariaLabel, describeTree, describedById, onOpenTree },
	ref
) {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const viewRef = useRef({ scale: 1, x: 0, y: 0, fitScale: 1, hasUserMoved: false });
	// The tree picked with the keyboard
	const selectedTreeRef = useRef<PlacedTree | null>(null);
	const [announcement, setAnnouncement] = useState('');
	const frameRef = useRef(0);
	const [hoveredTree, setHoveredTree] = useState<{ tree: PlacedTree; x: number; y: number } | null>(null);

	const layout = useMemo(() => getLayout(trees), [trees]);
	const hoveredText = useMemo(
		() => (hoveredTree ? describeTree(hoveredTree.tree) : null),
		[hoveredTree, describeTree]
	);

	const treeNames = useMemo(() => [...new Set(layout.placedTrees.map((tree) => tree.treeName))], [layout]);
	const cacheRef = useRef<ForestCache | null>(null);
	// While a big forest is mid-zoom, there are too many trees to draw live each frame, so the cached picture stands in until the view stops moving and then it is redrawn sharp.
	const sharpRedrawTimerRef = useRef(0);
	const drawSharpRef = useRef(false);

	const scheduleDraw = useCallback(() => {
		cancelAnimationFrame(frameRef.current);
		frameRef.current = requestAnimationFrame(() => {
			const canvas = canvasRef.current;
			const context = canvas?.getContext('2d');
			if (!canvas || !context) return;

			const pixelRatio = window.devicePixelRatio || 1;
			const width = canvas.width / pixelRatio;
			const height = canvas.height / pixelRatio;
			const view = viewRef.current;
			const selectedTree = selectedTreeRef.current;
			const drawSharp = drawSharpRef.current;
			drawSharpRef.current = false;

			// The cached picture can only be made once every tree's image has loaded.
			const canCache =
				layout.placedTrees.length >= CACHE_MIN_TREES &&
				treeNames.every((treeName) => spritesByTree.has(treeName));
			let visibleTrees: PlacedTree[] | undefined;
			let useCache = canCache && view.scale * pixelRatio <= getCacheScale(layout);
			let isPreview = false;

			// Zoomed in a little, so many trees are on screen. Drawing them all live would be slow, so the picture stands in while the view is moving, and the sharp redraw comes once it stops. With a huge number of trees on screen they are so small that the picture already looks sharp, so it is never redrawn.
			if (canCache && !useCache) {
				visibleTrees = getVisibleTrees(layout, view, width, height);
				if (visibleTrees.length > SHARP_TREE_LIMIT) {
					useCache = true;
				} else if (!drawSharp && visibleTrees.length > LIVE_TREE_BUDGET) {
					useCache = true;
					isPreview = true;
				}
			}

			clearTimeout(sharpRedrawTimerRef.current);

			if (useCache) {
				if (cacheRef.current?.layout !== layout || cacheRef.current.land !== land)
					cacheRef.current = buildForestCache(layout, land);
				const cache = cacheRef.current;

				context.setTransform(1, 0, 0, 1, 0, 0);
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.setTransform(
					pixelRatio * view.scale,
					0,
					0,
					pixelRatio * view.scale,
					pixelRatio * view.x,
					pixelRatio * view.y
				);
				context.imageSmoothingQuality = 'high';
				context.drawImage(
					cache.canvas,
					cache.minX,
					cache.minY,
					cache.canvas.width / cache.scale,
					cache.canvas.height / cache.scale
				);
				if (selectedTree) drawSelectionRing(context, selectedTree, view.scale);

				if (isPreview) {
					sharpRedrawTimerRef.current = window.setTimeout(() => {
						drawSharpRef.current = true;
						scheduleDrawRef.current();
					}, SHARP_REDRAW_DELAY_MS);
				}
				return;
			}

			renderForest(context, { width, height, pixelRatio, view, layout, land, selectedTree, visibleTrees });
		});
	}, [layout, land, treeNames]);

	// Images can finish loading after the land or trees change, so they must redraw with the latest version.
	const scheduleDrawRef = useRef(scheduleDraw);
	useEffect(() => {
		scheduleDrawRef.current = scheduleDraw;
	}, [scheduleDraw]);

	const fitToContainer = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		const { side, depth } = layout;
		const worldWidth = side * TILE_HALF_WIDTH * 2;
		const worldHeight = side * TILE_HALF_HEIGHT * 2 + depth + TREE_SIZE;
		const fullScale = Math.min(container.clientWidth / worldWidth, container.clientHeight / worldHeight) * 0.95;
		const landWidthRatio =
			MIN_INITIAL_LAND_WIDTH_RATIO + (side - MIN_GRID_SIDE) * INITIAL_LAND_WIDTH_RATIO_PER_CELL;
		const isPhone = container.clientWidth < PHONE_PANEL_MAX_WIDTH;
		const scale = isPhone ? fullScale : Math.min(fullScale, (container.clientWidth * landWidthRatio) / worldWidth);

		viewRef.current = {
			scale,
			fitScale: scale,
			x: container.clientWidth / 2,
			y: (container.clientHeight - worldHeight * scale) / 2 + TREE_SIZE * scale,
			hasUserMoved: false,
		};
		// Goes through the ref so that fitting depends only on the trees, and changing the land doesn't refit and undo your zoom.
		scheduleDrawRef.current();
	}, [layout]);

	// Keep the canvas sized to its container, and refit unless the user has zoomed or panned.
	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;

		const handleResize = () => {
			const pixelRatio = window.devicePixelRatio || 1;
			canvas.width = container.clientWidth * pixelRatio;
			canvas.height = container.clientHeight * pixelRatio;

			if (viewRef.current.hasUserMoved) {
				scheduleDraw();
			} else {
				fitToContainer();
			}
		};

		const resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(container);
		handleResize();

		return () => resizeObserver.disconnect();
	}, [fitToContainer, scheduleDraw]);

	useEffect(() => {
		viewRef.current.hasUserMoved = false;
		setHoveredTree(null);
		selectedTreeRef.current = null;
		setAnnouncement('');
		fitToContainer();
		new Set(trees.map((tree) => tree.treeName)).forEach((treeName) =>
			loadSprites(treeName, () => scheduleDrawRef.current())
		);
	}, [trees, fitToContainer]);

	useEffect(() => {
		scheduleDraw();
		return () => {
			cancelAnimationFrame(frameRef.current);
			clearTimeout(sharpRedrawTimerRef.current);
		};
	}, [scheduleDraw]);

	// Converts the cursor to grid cells and checks the trees in front of it first, because tree tops overlap the cells behind them.
	const findTreeAtPoint = (cursorX: number, cursorY: number) => {
		const { scale, x: viewX, y: viewY } = viewRef.current;
		const { side, placedTrees, cells } = layout;
		const worldX = (cursorX - viewX) / scale;
		const worldY = (cursorY - viewY) / scale;
		const treeTop = TREE_SIZE * TREE_BASE_RATIO;
		const treeBottom = TREE_SIZE * (1 - TREE_BASE_RATIO);
		const treeHalfWidth = TREE_SIZE * 0.35;

		const highestSum = Math.ceil((worldY + treeTop) / TILE_HALF_HEIGHT) - 1;
		const lowestSum = Math.floor((worldY - treeBottom) / TILE_HALF_HEIGHT) - 1;
		const centerDifference = Math.round(worldX / TILE_HALF_WIDTH);

		for (let sum = highestSum; sum >= lowestSum; sum--) {
			for (let difference = centerDifference - 2; difference <= centerDifference + 2; difference++) {
				if ((sum + difference) % 2 !== 0) continue;

				const column = (sum + difference) / 2;
				const row = (sum - difference) / 2;
				if (column < 0 || row < 0 || column >= side || row >= side) continue;

				const treeIndex = cells[row * side + column];
				if (treeIndex === -1) continue;

				const base = getTreeBase(column, row);
				const isInsideTree =
					Math.abs(worldX - base.x) <= treeHalfWidth &&
					worldY >= base.y - treeTop &&
					worldY <= base.y + treeBottom;
				if (isInsideTree) return placedTrees[treeIndex];
			}
		}

		return null;
	};

	const { handlePointerDown, handlePointerMove, handlePointerEnd, resetTap } = useForestGestures({
		viewRef,
		canvasRef,
		scheduleDraw,
		findTreeAtPoint,
		setHoveredTree,
		onOpenTree,
	});

	// A new set of trees starts the double-tap over
	useEffect(resetTap, [trees, resetTap]);

	useImperativeHandle(
		ref,
		() => ({
			renderImage: (width: number, height: number) => {
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;

				const { side, depth } = layout;
				const worldWidth = side * TILE_HALF_WIDTH * 2;
				const worldHeight = side * TILE_HALF_HEIGHT * 2 + depth + TREE_SIZE;
				const scale = Math.min(width / worldWidth, height / worldHeight) * 0.97;
				const view = { scale, x: width / 2, y: (height - worldHeight * scale) / 2 + TREE_SIZE * scale };

				renderForest(canvas.getContext('2d')!, { width, height, pixelRatio: 1, view, layout, land });
				return canvas;
			},
		}),
		[layout, land]
	);

	// The trees in time order: the oldest and newest for the Home and End keys, and each tree's place in line so every one sounds different when read out.
	const { oldestTree, newestTree, treeRanks } = useMemo(() => {
		const sorted = [...layout.placedTrees].sort((a, b) =>
			a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : a.key < b.key ? -1 : 1
		);
		return {
			oldestTree: sorted[0] ?? null,
			newestTree: sorted[sorted.length - 1] ?? null,
			treeRanks: new Map(sorted.map((tree, index) => [tree.key, index + 1])),
		};
	}, [layout]);

	const getSpokenPlace = (tree: PlacedTree) => `Tree ${treeRanks.get(tree.key)} of ${layout.placedTrees.length}`;

	const getTreeScreenPoint = (tree: PlacedTree) => {
		const view = viewRef.current;
		const base = getTreeBase(tree.column, tree.row);
		return { x: view.x + base.x * view.scale, y: view.y + (base.y - TREE_SIZE * 0.55) * view.scale };
	};

	// Picks a tree with the keyboard: rings it, scrolls it into view if needed, shows its tooltip and has screen readers read it out.
	const selectTree = (tree: PlacedTree | null, message?: string) => {
		selectedTreeRef.current = tree;

		if (!tree) {
			setHoveredTree(null);
			setAnnouncement(message ?? '');
			scheduleDraw();
			return;
		}

		const container = containerRef.current;
		if (container) {
			const margin = 60;
			const point = getTreeScreenPoint(tree);
			if (
				point.x < margin ||
				point.x > container.clientWidth - margin ||
				point.y < margin ||
				point.y > container.clientHeight - margin
			) {
				viewRef.current.x += container.clientWidth / 2 - point.x;
				viewRef.current.y += container.clientHeight / 2 - point.y;
				viewRef.current.hasUserMoved = true;
			}
		}

		const point = getTreeScreenPoint(tree);
		setHoveredTree({ tree, x: point.x, y: point.y });
		// Says where the tree leads, like a link would, instead of explaining how to follow it.
		setAnnouncement(`${describeTree(tree).description}. ${getSpokenPlace(tree)}. Opens this day in Focus Records.`);
		scheduleDraw();
	};

	// The closest tree in a screen direction, preferring ones that line up with it.
	const findNeighborTree = (from: PlacedTree, direction: 'left' | 'right' | 'up' | 'down') => {
		const [directionX, directionY] = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[direction];
		const fromBase = getTreeBase(from.column, from.row);
		let best: PlacedTree | null = null;
		let bestScore = Infinity;

		for (const tree of layout.placedTrees) {
			if (tree === from) continue;

			const base = getTreeBase(tree.column, tree.row);
			const deltaX = base.x - fromBase.x;
			const deltaY = base.y - fromBase.y;
			const along = deltaX * directionX + deltaY * directionY;
			const across = Math.abs(deltaX * directionY - deltaY * directionX);
			if (along <= 1 || across > along * 1.5) continue;

			const score = along + across * 2;
			if (score < bestScore) {
				best = tree;
				bestScore = score;
			}
		}

		return best;
	};

	const zoomAroundCenter = (factor: number) => {
		const container = containerRef.current;
		const view = viewRef.current;
		if (!container) return;

		const newScale = Math.min(Math.max(3, view.fitScale * 3), Math.max(view.fitScale * 0.8, view.scale * factor));
		const centerX = container.clientWidth / 2;
		const centerY = container.clientHeight / 2;
		view.x = centerX - ((centerX - view.x) / view.scale) * newScale;
		view.y = centerY - ((centerY - view.y) / view.scale) * newScale;
		view.scale = newScale;
		view.hasUserMoved = true;
		setHoveredTree(null);
		scheduleDraw();
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
		const selected = selectedTreeRef.current;
		const directions: Record<string, 'left' | 'right' | 'up' | 'down'> = {
			ArrowLeft: 'left',
			ArrowRight: 'right',
			ArrowUp: 'up',
			ArrowDown: 'down',
		};

		if (directions[event.key]) {
			event.preventDefault();
			if (!selected) return selectTree(oldestTree);

			const neighbor = findNeighborTree(selected, directions[event.key]);
			if (neighbor) selectTree(neighbor);
			else
				setAnnouncement(
					`No more trees ${DIRECTION_WORDS[directions[event.key]]}. ${describeTree(selected).description}. ${getSpokenPlace(selected)}.`
				);
		} else if (event.key === 'Home' || event.key === 'End') {
			event.preventDefault();
			selectTree(event.key === 'Home' ? oldestTree : newestTree);
		} else if ((event.key === 'Enter' || event.key === ' ') && selected) {
			event.preventDefault();
			onOpenTree?.(selected);
		} else if (event.key === 'Escape' && selected) {
			selectTree(null, 'Selection cleared.');
		} else if (event.key === '+' || event.key === '=') {
			event.preventDefault();
			zoomAroundCenter(1.25);
		} else if (event.key === '-' || event.key === '_') {
			event.preventDefault();
			zoomAroundCenter(0.8);
		} else if (event.key === '0') {
			event.preventDefault();
			fitToContainer();
		}
	};

	// Tabbing in picks the oldest tree so there is always something to read out. A mouse click that focuses the canvas doesn't.
	const handleFocus = (event: React.FocusEvent<HTMLCanvasElement>) => {
		if (!selectedTreeRef.current && event.currentTarget.matches(':focus-visible')) selectTree(oldestTree);
	};

	return (
		<div ref={containerRef} className="relative w-full h-full overflow-hidden">
			<canvas
				ref={canvasRef}
				role="application"
				aria-roledescription="forest"
				aria-label={`${ariaLabel} Use the arrow keys to move between trees, and press Enter to open a tree's day.`}
				aria-describedby={describedById}
				tabIndex={0}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				onBlur={() => selectTree(null)}
				className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
				style={{ touchAction: 'none', cursor: hoveredTree ? 'pointer' : undefined }}
				onPointerDown={handlePointerDown}
				onPointerUp={handlePointerEnd}
				onPointerCancel={handlePointerEnd}
				onPointerMove={handlePointerMove}
				onPointerLeave={(event) => {
					if (event.pointerType === 'mouse') setHoveredTree(null);
				}}
			/>

			<button
				type="button"
				aria-label="Reset zoom"
				className="absolute top-2 right-2 flex items-center bg-color-gray-300 border border-color-gray-50 rounded-full p-1 cursor-pointer"
				onClick={fitToContainer}
			>
				<Icon name="zoom_out_map" customClass="!text-[18px] text-color-gray-25" />
			</button>

			{hoveredTree && hoveredText && (
				<div
					aria-hidden="true"
					className="absolute z-10 pointer-events-none bg-color-gray-600 border border-color-gray-100 rounded-md px-2 py-1 text-[13px] whitespace-nowrap"
					style={{
						left: hoveredTree.x,
						top: hoveredTree.y - 12,
						transform: `translate(${hoveredTree.x > (containerRef.current?.clientWidth ?? 0) / 2 ? '-100%' : '0'}, -100%)`,
					}}
				>
					{/* A record with several projects lists each one, with the main project (the one whose tree this is) in bold. */}
					{hoveredText.projectLines.length > 0 ? (
						<ul className="m-0 p-0 list-none">
							{hoveredText.projectLines.map((line, index) => (
								<li key={line} className={index === 0 ? 'font-semibold' : 'text-color-gray-25'}>
									{line}
								</li>
							))}
						</ul>
					) : (
						<div className="font-semibold">{hoveredText.title}</div>
					)}
					<div>{hoveredText.details}</div>
					<div className="text-color-gray-50 text-[12px]">{hoveredText.treeLabel}</div>
				</div>
			)}

			<div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
				{announcement}
			</div>
		</div>
	);
});

export default ForestCanvas;
