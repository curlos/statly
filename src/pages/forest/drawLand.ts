import type { LandColors } from './landStyles';
import { LAND_DEPTH, TILE_HALF_HEIGHT, TILE_HALF_WIDTH, getSeededRandom } from './forestLayout';
import { buildTopDecor, buildWallDecor, hasTopDecor, type WallShape } from './landDecor';

const WATER_RIM_DEPTH = 2.5;
// How many grid cells of water surround the sand island, and how tall the island's edge stands above the water.
const BEACH_WATER_RING_CELLS = 0.8;
const BEACH_CLIFF_HEIGHT = 5;
// Wall details per grid cell along each wall, so they stay the same size at every grid size.
const LAND_BLADES_PER_CELL = 4.5;
const LAND_LUMPS_PER_CELL = 0.9;
const LAND_STONES_PER_CELL = 1.6;
const LAND_COBBLES_PER_CELL = 3.4;
const LAND_WAVE_STEPS_PER_CELL = 4;
const LAND_FLOWERS_PER_PATCH = 4;
// Details are drawn at a fixed size on the real grid, with counts that grow with the grid up to a cap.
const MAX_TILE_LINES = 300;
const MAX_MOTTLES = 70;
const MAX_TUFTS = 700;
const MAX_FLOWER_PATCHES = 90;
const MAX_TOP_ORNAMENTS = 400;
const ORNAMENT_COLORS = ['#e23b3b', '#f2c84b', '#4aa3ff', '#f6f6f6'];

// One side wall of the block: stacked wavy layers, stones, and a thick lip of grass or lumps hanging over the top.
const buildWallShapes = (land: LandColors, side: number, direction: 1 | -1) => {
	const width = side * TILE_HALF_WIDTH;
	const height = side * TILE_HALF_HEIGHT;
	const frontY = height * 2;
	const label = direction === 1 ? 'right' : 'left';
	const isGrass = land.edge === 'blades';
	const isWater = land.edge === 'waves';
	const shapes: WallShape[] = [];
	const getEdgePoint = (progress: number) => ({ x: direction * width * progress, y: frontY - height * progress });

	// Starts a shape along the top edge of the wall. Callers trace its lower edge back to the front corner.
	const beginFromTopEdge = () => {
		const path = new Path2D();
		path.moveTo(0, frontY);
		path.lineTo(direction * width, height);
		return path;
	};

	land.layers
		.map((color, index) => ({ color, index }))
		.reverse()
		.forEach(({ color, index }) => {
			const path = beginFromTopEdge();
			if (index === land.layers.length - 1) {
				path.lineTo(direction * width, height + LAND_DEPTH);
				path.lineTo(0, frontY + LAND_DEPTH);
			} else {
				const layerDepth =
					LAND_DEPTH * (isGrass ? 0.82 + index * 0.1 : isWater ? 0.42 + index * 0.25 : 0.56 + index * 0.2);
				const waveSize = isWater ? 0.5 : 1;
				const phase = getSeededRandom(`${label}-phase`, index) * Math.PI * 2;
				const stepCount = side * LAND_WAVE_STEPS_PER_CELL;
				for (let step = stepCount; step >= 0; step--) {
					const progress = step / stepCount;
					const { x, y } = getEdgePoint(progress);
					path.lineTo(
						x,
						y +
							layerDepth +
							(Math.sin(progress * side * 1.9 + phase) * 1.6 +
								Math.sin(progress * side * 0.7 + phase) * 1.4) *
								waveSize
					);
				}
			}
			path.closePath();
			shapes.push({ color, alpha: 1, path });
		});

	if (land.stone) {
		const path = new Path2D();
		const stoneCount = Math.round(side * (isGrass ? LAND_COBBLES_PER_CELL : LAND_STONES_PER_CELL));
		for (let index = 0; index < stoneCount; index++) {
			const { x, y } = getEdgePoint(
				isGrass
					? (index + 0.2 + getSeededRandom(`${label}-stone-x`, index) * 0.6) / stoneCount
					: 0.02 + getSeededRandom(`${label}-stone-x`, index) * 0.96
			);
			const stoneY =
				y +
				LAND_DEPTH *
					(isGrass
						? 0.58 + getSeededRandom(`${label}-stone-y`, index) * 0.32
						: 0.5 + getSeededRandom(`${label}-stone-y`, index) * 0.42);
			const stoneSize = isGrass
				? 2.6 + getSeededRandom(`${label}-stone-size`, index) * 2.2
				: 3.5 + getSeededRandom(`${label}-stone-size`, index) * 5;
			path.moveTo(x + stoneSize, stoneY);
			path.ellipse(x, stoneY, stoneSize, stoneSize * 0.62, -direction * 0.5, 0, Math.PI * 2);
		}
		shapes.push({ color: land.stone, alpha: isGrass ? 0.75 : 0.25, path });
	}

	// The lip is drawn twice: a darker copy lower down, then the lighter copy on top, which makes it look thick.
	const addLip = (color: string, lipDepth: number) => {
		const path = beginFromTopEdge();

		if (land.edge === 'lumps') {
			const lumpCount = Math.max(1, Math.round(side * LAND_LUMPS_PER_CELL));
			for (let lump = lumpCount; lump > 0; lump--) {
				const start = getEdgePoint(lump / lumpCount);
				const end = getEdgePoint((lump - 1) / lumpCount);
				const size = lipDepth * (1.05 + getSeededRandom(`${label}-lump`, lump) * 0.3);
				path.lineTo(start.x, start.y + lipDepth * 0.65);
				path.bezierCurveTo(
					start.x,
					start.y + size * 1.15,
					end.x,
					end.y + size * 1.15,
					end.x,
					end.y + lipDepth * 0.65
				);
			}
		} else {
			// Many small, uneven grass tufts with slightly softened tips. A few run longer than the rest.
			const tuftCount = Math.round(side * LAND_BLADES_PER_CELL);
			const tuftWidths = Array.from(
				{ length: tuftCount },
				(_, tuft) => 0.6 + getSeededRandom(`${label}-width`, tuft) * 0.9
			);
			const totalWidth = tuftWidths.reduce((total, tuftWidth) => total + tuftWidth, 0);
			const tuftEdges = [0];
			tuftWidths.forEach((tuftWidth) => tuftEdges.push(tuftEdges[tuftEdges.length - 1] + tuftWidth / totalWidth));

			for (let tuft = tuftCount - 1; tuft >= 0; tuft--) {
				const startProgress = tuftEdges[tuft + 1];
				const endProgress = tuftEdges[tuft];
				const tuftProgressWidth = startProgress - endProgress;
				const tipProgress =
					endProgress + tuftProgressWidth * (0.3 + getSeededRandom(`${label}-lean`, tuft) * 0.4);
				const tipRounding = tuftProgressWidth * 0.1;
				const isLongTuft = getSeededRandom(`${label}-long`, tuft) > 0.82;
				const valleyDepth = lipDepth * (0.84 + getSeededRandom(`${label}-valley`, tuft) * 0.08);
				const tipDepth = lipDepth + (isLongTuft ? 4.5 : 1.5 + getSeededRandom(`${label}-tip`, tuft) * 2);

				const start = getEdgePoint(startProgress);
				const end = getEdgePoint(endProgress);
				const tip = getEdgePoint(tipProgress);
				const beforeTip = getEdgePoint(tipProgress + tipRounding);
				const afterTip = getEdgePoint(tipProgress - tipRounding);

				path.lineTo(start.x, start.y + valleyDepth);
				path.lineTo(beforeTip.x, beforeTip.y + tipDepth - 0.6);
				path.quadraticCurveTo(tip.x, tip.y + tipDepth + 0.4, afterTip.x, afterTip.y + tipDepth - 0.6);
				path.lineTo(end.x, end.y + valleyDepth);
			}
		}

		path.closePath();
		shapes.push({ color, alpha: 1, path });
	};

	// Grass fills about the top half of the wall, with a thin darker layer peeking out below it. Rounded lumps keep a thicker darker layer.
	if (isWater) {
		// Ripples running along the wall, so the water has a surface to catch the light.
		const ripples = new Path2D();
		[0.3, 0.52, 0.76].forEach((depthShare, rippleIndex) => {
			const stepCount = side * LAND_WAVE_STEPS_PER_CELL;
			for (let step = 0; step <= stepCount; step++) {
				const progress = step / stepCount;
				const { x, y } = getEdgePoint(progress);
				const rippleY = y + LAND_DEPTH * depthShare + Math.sin(progress * side * 1.7 + rippleIndex * 2) * 1.1;
				if (step === 0) ripples.moveTo(x, rippleY);
				else ripples.lineTo(x, rippleY);
			}
		});
		shapes.push({ color: '#ffffff', alpha: 0.28, path: ripples, lineWidth: 1 });

		// A bright strip where the water on top turns over the edge and becomes the wall.
		const path = new Path2D();
		path.moveTo(0, frontY);
		path.lineTo(direction * width, height);
		path.lineTo(direction * width, height + WATER_RIM_DEPTH);
		path.lineTo(0, frontY + WATER_RIM_DEPTH);
		path.closePath();
		shapes.push({ color: '#a9f0ea', alpha: 1, path });
	} else {
		addLip(land.turfShade, LAND_DEPTH * (isGrass ? 0.5 : 0.3));
		addLip(land.turf, LAND_DEPTH * (isGrass ? 0.45 : 0.2));
	}

	// Ornaments hanging on the walls of the Christmas land
	if (land.decor === 'christmas') {
		ORNAMENT_COLORS.forEach((color, colorIndex) => {
			const path = new Path2D();
			const ornamentCount = Math.round(side * 1.4);
			for (let index = colorIndex; index < ornamentCount; index += ORNAMENT_COLORS.length) {
				const { x, y } = getEdgePoint((index + 0.5) / ornamentCount);
				const ornamentY = y + LAND_DEPTH * (0.48 + getSeededRandom(`${label}-ornament`, index) * 0.36);
				path.moveTo(x + 2.8, ornamentY);
				path.arc(x, ornamentY, 2.8, 0, Math.PI * 2);
			}
			shapes.push({ color, alpha: 1, path });
		});
	}

	shapes.push(...buildWallDecor(land.decor, label, side, getEdgePoint));

	// The right wall faces away from the light.
	if (direction === 1) {
		const path = new Path2D();
		path.moveTo(0, frontY);
		path.lineTo(width, height);
		path.lineTo(width, height + LAND_DEPTH);
		path.lineTo(0, frontY + LAND_DEPTH);
		path.closePath();
		// Water needs a stronger difference between its two walls to read as a solid block.
		shapes.push({ color: isWater ? 'rgba(5, 35, 70, 0.3)' : 'rgba(40, 20, 40, 0.13)', alpha: 1, path });
	}

	return shapes;
};

// Garlands and ornaments that make the top of the Christmas land look like a decorated tree.
const buildChristmasShapes = (side: number) => {
	const width = side * TILE_HALF_WIDTH;
	const height = side * TILE_HALF_HEIGHT;
	const garland = new Path2D();
	const swagWidth = TILE_HALF_WIDTH * 5;
	for (let y = TILE_HALF_HEIGHT * 4; y < height * 2; y += TILE_HALF_HEIGHT * 5) {
		for (let x = -width; x < width; x += swagWidth) {
			garland.moveTo(x, y);
			garland.quadraticCurveTo(x + swagWidth / 2, y + TILE_HALF_HEIGHT * 2.4, x + swagWidth, y);
		}
	}

	const ornamentCount = Math.min(Math.round(side * side * 0.16), MAX_TOP_ORNAMENTS);
	const ornaments = ORNAMENT_COLORS.map((color, colorIndex) => {
		const path = new Path2D();
		for (let index = colorIndex; index < ornamentCount; index += ORNAMENT_COLORS.length) {
			const column = getSeededRandom('ornament-column', index);
			const row = getSeededRandom('ornament-row', index);
			const x = (column - row) * width;
			const y = (column + row) * height;
			path.moveTo(x + 3.4, y);
			path.arc(x, y, 3.4, 0, Math.PI * 2);
		}
		return { color, alpha: 1, path };
	});

	return [{ color: '#f2c84b', alpha: 0.9, path: garland, lineWidth: 1.6 }, ...ornaments];
};

// The island's outline in grid cells, with a gently wobbling shore and corners rounded by curves.
const buildIslandPath = (side: number, offsetY: number) => {
	const inset = BEACH_WATER_RING_CELLS;
	const corners = [
		[inset, inset],
		[side - inset, inset],
		[side - inset, side - inset],
		[inset, side - inset],
	];
	// Which way is "into the island" for each edge, in grid cells
	const normals = [
		[0, 1],
		[-1, 0],
		[0, -1],
		[1, 0],
	];
	const cornerShare = 0.1;
	const pointsPerEdge = Math.min(Math.max(16, side * 3), 300);
	const path = new Path2D();

	const toWorld = (u: number, v: number) => ({
		x: (u - v) * TILE_HALF_WIDTH,
		y: (u + v) * TILE_HALF_HEIGHT + offsetY,
	});
	const getEdgePoint = (edge: number, progress: number) => {
		const [startU, startV] = corners[edge];
		const [endU, endV] = corners[(edge + 1) % 4];
		const length = Math.hypot(endU - startU, endV - startV);
		const wobble =
			Math.sin(progress * length * 0.9 + edge * 1.7) * 0.2 + Math.sin(progress * length * 0.35 + edge) * 0.14;
		const [normalU, normalV] = normals[edge];
		return toWorld(
			startU + (endU - startU) * progress + normalU * wobble,
			startV + (endV - startV) * progress + normalV * wobble
		);
	};

	for (let edge = 0; edge < 4; edge++) {
		for (let point = 0; point <= pointsPerEdge; point++) {
			const { x, y } = getEdgePoint(edge, cornerShare + ((1 - cornerShare * 2) * point) / pointsPerEdge);
			if (edge === 0 && point === 0) path.moveTo(x, y);
			else path.lineTo(x, y);
		}

		// Round the corner with a curve that passes near the corner point and meets the start of the next edge.
		const [cornerU, cornerV] = corners[(edge + 1) % 4];
		const corner = toWorld(cornerU, cornerV);
		const next = getEdgePoint((edge + 1) % 4, cornerShare);
		path.quadraticCurveTo(corner.x, corner.y, next.x, next.y);
	}

	path.closePath();
	return path;
};

// The Beach land: a water block with a lighter top and darker walls, and a sand island standing up out of it on a small cliff with foam at its base.
const beachIslandPaths = new Map<number, Path2D>();

const buildBeachShapes = (side: number): WallShape[] => {
	const width = side * TILE_HALF_WIDTH;
	const height = side * TILE_HALF_HEIGHT;
	const islandPath = buildIslandPath(side, 0);
	beachIslandPaths.set(side, islandPath);

	// Short ripple strokes spread over the water around the island
	const ripples = new Path2D();
	const rippleCount = Math.min(Math.round(side * side * 0.5), 260);
	for (let index = 0; index < rippleCount; index++) {
		const column = getSeededRandom('ripple-column', index);
		const row = getSeededRandom('ripple-row', index);
		const x = (column - row) * width;
		const y = (column + row) * height;
		ripples.moveTo(x - 5, y);
		ripples.quadraticCurveTo(x, y - 1.8, x + 5, y);
	}

	const cliffPath = buildIslandPath(side, BEACH_CLIFF_HEIGHT);
	return [
		{ color: '#ffffff', alpha: 0.5, path: ripples, lineWidth: 1 },
		{ color: '#ffffff', alpha: 0.3, path: cliffPath, lineWidth: 7 },
		{ color: '#ffffff', alpha: 0.95, path: cliffPath, lineWidth: 2.2 },
		{ color: '#d6b779', alpha: 1, path: cliffPath },
		{ color: '#f6e3b4', alpha: 1, path: islandPath },
	];
};

// Building big shapes means thousands of curves, so each one is built once and reused on every redraw.
const shapesByLand = new WeakMap<LandColors, Map<string, WallShape[]>>();

const drawShapes = (
	context: CanvasRenderingContext2D,
	land: LandColors,
	key: string,
	buildShapes: () => WallShape[]
) => {
	const landShapes = shapesByLand.get(land) ?? new Map<string, WallShape[]>();
	shapesByLand.set(land, landShapes);

	const shapes = landShapes.get(key) ?? buildShapes();
	landShapes.set(key, shapes);

	shapes.forEach(({ color, alpha, path, lineWidth, round }) => {
		context.globalAlpha = alpha;
		if (lineWidth) {
			context.lineCap = round ? 'round' : 'butt';
			context.strokeStyle = color;
			context.lineWidth = lineWidth;
			context.stroke(path);
		} else {
			context.fillStyle = color;
			context.fill(path);
		}
	});
	context.globalAlpha = 1;
};

const drawLandDetails = (context: CanvasRenderingContext2D, land: LandColors, side: number) => {
	const width = side * TILE_HALF_WIDTH;
	const height = side * TILE_HALF_HEIGHT;
	const cellCount = side * side;
	const mottleCount = Math.min(Math.round(cellCount * 0.15), MAX_MOTTLES);
	const tuftCount = Math.min(Math.round(cellCount * 0.9), MAX_TUFTS);
	const flowerPatchCount = Math.min(Math.round(cellCount * 0.14), MAX_FLOWER_PATCHES);

	const getLandPoint = (label: string, index: number) => {
		// Stay slightly inside the edges so nothing sits on the rim.
		const column = 0.05 + getSeededRandom(`${label}-column`, index) * 0.9;
		const row = 0.05 + getSeededRandom(`${label}-row`, index) * 0.9;
		return { x: (column - row) * width, y: (column + row) * height };
	};

	// Soft lighter patches, flattened to match the angle of the ground
	context.fillStyle = land.topLight;
	context.globalAlpha = 0.55;
	for (let index = 0; index < mottleCount; index++) {
		const { x, y } = getLandPoint('mottle', index);
		const size = 10 + getSeededRandom('mottle-size', index) * 14;
		context.beginPath();
		context.ellipse(x, y, size, (size * TILE_HALF_HEIGHT) / TILE_HALF_WIDTH, 0, 0, Math.PI * 2);
		context.fill();
	}
	context.globalAlpha = 1;

	// Faint lines along the real grid cells. Very large grids skip some lines so they don't turn solid.
	const lineStep = Math.max(1, Math.ceil(side / MAX_TILE_LINES));
	context.strokeStyle = land.line;
	context.lineWidth = 0.5;
	context.beginPath();
	for (let line = lineStep; line < side; line += lineStep) {
		context.moveTo(line * TILE_HALF_WIDTH, line * TILE_HALF_HEIGHT);
		context.lineTo((line - side) * TILE_HALF_WIDTH, (line + side) * TILE_HALF_HEIGHT);
		context.moveTo(-line * TILE_HALF_WIDTH, line * TILE_HALF_HEIGHT);
		context.lineTo((side - line) * TILE_HALF_WIDTH, (side + line) * TILE_HALF_HEIGHT);
	}
	context.stroke();

	// Short grass ticks
	context.lineWidth = 0.65;
	context.lineCap = 'round';
	context.beginPath();
	for (let index = 0; index < tuftCount; index++) {
		const { x, y } = getLandPoint('tuft', index);
		context.moveTo(x - 0.8, y);
		context.lineTo(x - 1.5, y - 1.7);
		context.moveTo(x + 0.8, y);
		context.lineTo(x + 1.5, y - 1.7);
	}
	context.stroke();

	// Little clusters of flowers, leaves or snow
	for (let patch = 0; patch < flowerPatchCount; patch++) {
		const center = getLandPoint('patch', patch);

		for (let flower = 0; flower < LAND_FLOWERS_PER_PATCH; flower++) {
			const id = patch * LAND_FLOWERS_PER_PATCH + flower;
			const x = center.x + (getSeededRandom('flower-x', id) - 0.5) * 12;
			const y = center.y + (getSeededRandom('flower-y', id) - 0.5) * 7;
			context.fillStyle = land.speckles[id % land.speckles.length];
			context.beginPath();

			if (land.speckleShape === 'leaf') {
				context.ellipse(x, y, 1.6, 0.75, getSeededRandom('leaf', id) * Math.PI, 0, Math.PI * 2);
			} else if (land.speckleShape === 'snow') {
				context.ellipse(x, y, 1.8, 0.9, 0, 0, Math.PI * 2);
			} else {
				[
					[-0.8, 0],
					[0.8, 0],
					[0, -0.5],
					[0, 0.5],
				].forEach(([offsetX, offsetY]) => {
					context.moveTo(x + offsetX + 0.65, y + offsetY);
					context.arc(x + offsetX, y + offsetY, 0.65, 0, Math.PI * 2);
				});
			}
			context.fill();
		}
	}
};

export const drawLand = (context: CanvasRenderingContext2D, land: LandColors, side: number) => {
	const width = side * TILE_HALF_WIDTH;
	const height = side * TILE_HALF_HEIGHT;

	drawShapes(context, land, `${side}-left`, () => buildWallShapes(land, side, -1));
	drawShapes(context, land, `${side}-right`, () => buildWallShapes(land, side, 1));

	const topPath = new Path2D();
	topPath.moveTo(0, 0);
	topPath.lineTo(width, height);
	topPath.lineTo(0, height * 2);
	topPath.lineTo(-width, height);
	topPath.closePath();
	context.fillStyle = land.top;
	context.fill(topPath);

	// Keeps ground patches and flowers from spilling past the edge of the land. On the beach they stay on the sand island.
	context.save();
	context.clip(topPath);
	if (land.decor === 'beach') {
		drawShapes(context, land, `${side}-beach`, () => buildBeachShapes(side));
		const islandPath = beachIslandPaths.get(side);
		if (islandPath) context.clip(islandPath);
	}
	drawLandDetails(context, land, side);
	if (land.decor === 'christmas') drawShapes(context, land, `${side}-decor`, () => buildChristmasShapes(side));
	if (land.decor && hasTopDecor(land.decor))
		drawShapes(context, land, `${side}-top-decor`, () => buildTopDecor(land.decor!, side));
	context.restore();
};
