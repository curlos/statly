import type { LandColors } from './landStyles';
import { LAND_DEPTH, TILE_HALF_HEIGHT, TILE_HALF_WIDTH, getSeededRandom } from './forestLayout';

export interface WallShape {
	color: string;
	alpha: number;
	path: Path2D;
	lineWidth?: number;
	// Rounded line ends, for strokes that are drawn as little limbs or streaks
	round?: boolean;
}

type Decor = NonNullable<LandColors['decor']>;
type EdgePoint = (progress: number) => { x: number; y: number };

// Counts grow with the grid up to a cap, like the other land details.
const MAX_CRACKS = 60;
const MAX_POOLS = 25;
const MAX_DUNES = 120;
const MAX_CACTI = 25;
const MAX_STARS = 900;
const MAX_NEBULAS = 30;
const MAX_CRATERS = 30;

const getFlatRadius = (radius: number) => (radius * TILE_HALF_HEIGHT) / TILE_HALF_WIDTH;

const addEllipse = (path: Path2D, x: number, y: number, radius: number) => {
	path.moveTo(x + radius, y);
	path.ellipse(x, y, radius, getFlatRadius(radius), 0, 0, Math.PI * 2);
};

// Where a seeded spot lands on the top of the land, slightly inside the edges
const getTopPoint = (side: number, label: string, index: number) => {
	const column = 0.05 + getSeededRandom(`${label}-column`, index) * 0.9;
	const row = 0.05 + getSeededRandom(`${label}-row`, index) * 0.9;
	return { x: (column - row) * side * TILE_HALF_WIDTH, y: (column + row) * side * TILE_HALF_HEIGHT };
};

// Glowing cracks with pools of lava where some of them start, and dark rocks lying around.
const buildVolcanoTop = (side: number): WallShape[] => {
	const cracks = new Path2D();
	const pools = new Path2D();
	const poolCores = new Path2D();
	const rocks = new Path2D();
	const crackCount = Math.min(Math.round(side * 0.7), MAX_CRACKS);
	const poolCount = Math.min(Math.round(side * 0.25), MAX_POOLS);
	const rockCount = Math.min(Math.round(side * 0.6), 60);

	for (let crack = 0; crack < crackCount; crack++) {
		let { x, y } = getTopPoint(side, 'crack', crack);
		cracks.moveTo(x, y);
		for (let step = 0; step < 6; step++) {
			x += (getSeededRandom('crack-x', crack * 6 + step) - 0.5) * 26;
			y += (getSeededRandom('crack-y', crack * 6 + step) - 0.5) * 12;
			cracks.lineTo(x, y);
		}
	}

	for (let pool = 0; pool < poolCount; pool++) {
		const { x, y } = getTopPoint(side, 'pool', pool);
		const radius = 5 + getSeededRandom('pool-size', pool) * 5;
		addEllipse(pools, x, y, radius);
		addEllipse(poolCores, x, y, radius * 0.55);
	}

	for (let rock = 0; rock < rockCount; rock++) {
		const { x, y } = getTopPoint(side, 'rock', rock);
		addEllipse(rocks, x, y, 2 + getSeededRandom('rock-size', rock) * 3);
	}

	return [
		{ color: '#1c1414', alpha: 0.7, path: rocks },
		{ color: '#ff5a1f', alpha: 0.25, path: cracks, lineWidth: 7, round: true },
		{ color: '#ff7a1f', alpha: 0.85, path: cracks, lineWidth: 3, round: true },
		{ color: '#ffd25a', alpha: 1, path: cracks, lineWidth: 1.2, round: true },
		{ color: '#ff5a1f', alpha: 0.95, path: pools },
		{ color: '#ffc23d', alpha: 1, path: poolCores },
	];
};

// Soft dune ripples, cacti and half-buried rocks.
const buildDesertTop = (side: number): WallShape[] => {
	const shadowRipples = new Path2D();
	const lightRipples = new Path2D();
	const body = new Path2D();
	const highlight = new Path2D();
	const rocks = new Path2D();
	const rockTops = new Path2D();
	const cellCount = side * side;
	const duneCount = Math.min(Math.round(cellCount * 0.12), MAX_DUNES);
	const cactusCount = Math.min(Math.round(cellCount * 0.02), MAX_CACTI);
	const rockCount = Math.min(Math.round(cellCount * 0.03), 40);

	for (let dune = 0; dune < duneCount; dune++) {
		const { x, y } = getTopPoint(side, 'dune', dune);
		const length = 20 + getSeededRandom('dune-length', dune) * 22;
		shadowRipples.moveTo(x, y);
		shadowRipples.quadraticCurveTo(x + length / 2, y - 5, x + length, y);
		lightRipples.moveTo(x, y - 1.8);
		lightRipples.quadraticCurveTo(x + length / 2, y - 6.8, x + length, y - 1.8);
	}

	// A trunk with an arm on each side, bent up like a cactus
	for (let cactus = 0; cactus < cactusCount; cactus++) {
		const { x, y } = getTopPoint(side, 'cactus', cactus);
		body.moveTo(x, y);
		body.lineTo(x, y - 10);
		body.moveTo(x, y - 4);
		body.lineTo(x - 4.5, y - 4);
		body.lineTo(x - 4.5, y - 7.5);
		body.moveTo(x, y - 6);
		body.lineTo(x + 4.5, y - 6);
		body.lineTo(x + 4.5, y - 9.5);
		highlight.moveTo(x - 0.7, y - 1);
		highlight.lineTo(x - 0.7, y - 9);
		addEllipse(rocks, x, y + 0.5, 4);
	}

	for (let rock = 0; rock < rockCount; rock++) {
		const { x, y } = getTopPoint(side, 'desert-rock', rock);
		const radius = 2.5 + getSeededRandom('desert-rock-size', rock) * 3;
		addEllipse(rocks, x, y, radius);
		addEllipse(rockTops, x - radius * 0.2, y - 0.8, radius * 0.6);
	}

	return [
		{ color: '#c88a40', alpha: 0.55, path: shadowRipples, lineWidth: 1.1, round: true },
		{ color: '#fbe0a8', alpha: 0.6, path: lightRipples, lineWidth: 1, round: true },
		{ color: '#9a5a2e', alpha: 0.6, path: rocks },
		{ color: '#c98a4e', alpha: 1, path: rockTops },
		{ color: '#3f8f4a', alpha: 1, path: body, lineWidth: 3.2, round: true },
		{ color: '#7cc97f', alpha: 0.8, path: highlight, lineWidth: 0.9, round: true },
	];
};

const addSparkle = (path: Path2D, x: number, y: number, size: number) => {
	path.moveTo(x, y - size);
	path.quadraticCurveTo(x, y, x + size, y);
	path.quadraticCurveTo(x, y, x, y + size);
	path.quadraticCurveTo(x, y, x - size, y);
	path.quadraticCurveTo(x, y, x, y - size);
};

// Nebula clouds, craters, stars and sparkles.
const buildSpaceTop = (side: number): WallShape[] => {
	const whiteStars = new Path2D();
	const blueStars = new Path2D();
	const sparkles = new Path2D();
	const purpleClouds = new Path2D();
	const blueClouds = new Path2D();
	const craters = new Path2D();
	const craterRims = new Path2D();
	const cellCount = side * side;
	const starCount = Math.min(Math.round(cellCount * 1.2), MAX_STARS);
	const sparkleCount = Math.min(Math.round(side * 0.5), 40);
	const cloudCount = Math.min(Math.round(side * 0.3), MAX_NEBULAS);
	const craterCount = Math.min(Math.round(side * 0.4), MAX_CRATERS);

	for (let cloud = 0; cloud < cloudCount; cloud++) {
		const { x, y } = getTopPoint(side, 'cloud', cloud);
		addEllipse(cloud % 2 === 0 ? purpleClouds : blueClouds, x, y, 20 + getSeededRandom('cloud-size', cloud) * 22);
	}

	for (let crater = 0; crater < craterCount; crater++) {
		const { x, y } = getTopPoint(side, 'crater', crater);
		const radius = 6 + getSeededRandom('crater-size', crater) * 6;
		addEllipse(craters, x, y, radius);
		addEllipse(craterRims, x, y + 0.8, radius);
	}

	for (let star = 0; star < starCount; star++) {
		const { x, y } = getTopPoint(side, 'star', star);
		const radius = 0.5 + getSeededRandom('star-size', star) * 0.7;
		const path = star % 3 === 0 ? blueStars : whiteStars;
		path.moveTo(x + radius, y);
		path.arc(x, y, radius, 0, Math.PI * 2);
	}

	for (let sparkle = 0; sparkle < sparkleCount; sparkle++) {
		const { x, y } = getTopPoint(side, 'sparkle', sparkle);
		addSparkle(sparkles, x, y, 3 + getSeededRandom('sparkle-size', sparkle) * 2);
	}

	return [
		{ color: '#7a4fd0', alpha: 0.13, path: purpleClouds },
		{ color: '#3a7be0', alpha: 0.11, path: blueClouds },
		{ color: '#150f33', alpha: 0.5, path: craters },
		{ color: '#5a54a0', alpha: 0.7, path: craterRims, lineWidth: 1 },
		{ color: '#ffffff', alpha: 0.9, path: whiteStars },
		{ color: '#bcd8ff', alpha: 0.9, path: blueStars },
		{ color: '#ffffff', alpha: 0.95, path: sparkles },
	];
};

const TOP_BUILDERS: Record<Decor, ((side: number) => WallShape[]) | undefined> = {
	christmas: undefined,
	beach: undefined,
	volcano: buildVolcanoTop,
	desert: buildDesertTop,
	space: buildSpaceTop,
};

export const hasTopDecor = (decor: LandColors['decor']) => !!decor && !!TOP_BUILDERS[decor];

export const buildTopDecor = (decor: Decor, side: number) => TOP_BUILDERS[decor]?.(side) ?? [];

// Details on the side walls: lava dripping down the volcano, sandstone strata in the desert, and glints in the space rock.
export const buildWallDecor = (decor: LandColors['decor'], label: string, side: number, getEdgePoint: EdgePoint): WallShape[] => {
	if (decor === 'volcano') {
		const streaks = new Path2D();
		const drops = new Path2D();
		const dripCount = Math.round(side * 1.2);
		for (let drip = 0; drip < dripCount; drip++) {
			const { x, y } = getEdgePoint((drip + 0.2 + getSeededRandom(`${label}-drip-x`, drip) * 0.6) / dripCount);
			const endY = y + LAND_DEPTH * (0.3 + getSeededRandom(`${label}-drip-y`, drip) * 0.45);
			streaks.moveTo(x, y + LAND_DEPTH * 0.1);
			streaks.lineTo(x, endY);
			drops.moveTo(x + 2, endY);
			drops.arc(x, endY, 2, 0, Math.PI * 2);
		}
		return [
			{ color: '#ff5a1f', alpha: 0.3, path: streaks, lineWidth: 6, round: true },
			{ color: '#ff7a1f', alpha: 0.95, path: streaks, lineWidth: 2.6, round: true },
			{ color: '#ffd25a', alpha: 1, path: drops },
		];
	}

	if (decor === 'desert') {
		const strata = new Path2D();
		const stepCount = side * 4;
		[0.3, 0.55, 0.78].forEach((depthShare, index) => {
			for (let step = 0; step <= stepCount; step++) {
				const progress = step / stepCount;
				const { x, y } = getEdgePoint(progress);
				const bandY = y + LAND_DEPTH * depthShare + Math.sin(progress * side * 1.3 + index * 2) * 1.2;
				if (step === 0) strata.moveTo(x, bandY);
				else strata.lineTo(x, bandY);
			}
		});
		return [{ color: '#f0b080', alpha: 0.4, path: strata, lineWidth: 1.6 }];
	}

	if (decor === 'space') {
		const glints = new Path2D();
		const dots = new Path2D();
		const glintCount = Math.round(side * 1.6);
		for (let glint = 0; glint < glintCount; glint++) {
			const { x, y } = getEdgePoint((glint + 0.5) / glintCount);
			const glintY = y + LAND_DEPTH * (0.3 + getSeededRandom(`${label}-glint`, glint) * 0.55);
			(glint % 2 === 0 ? glints : dots).moveTo(x + 1, glintY);
			if (glint % 2 === 0) addSparkle(glints, x, glintY, 2.6);
			else dots.arc(x, glintY, 1, 0, Math.PI * 2);
		}
		return [
			{ color: '#bcd8ff', alpha: 0.9, path: glints },
			{ color: '#ffe9a8', alpha: 0.9, path: dots },
		];
	}

	return [];
};
