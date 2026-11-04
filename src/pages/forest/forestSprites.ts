import { getTreeImageSrc } from './forestTrees';

// Where a tree touches the ground, as fractions of its image, so each tree gets a shadow that fits its own shape.
interface TreeFootprint {
	centerX: number;
	bottomY: number;
	width: number;
}

interface ForestSprites {
	full: HTMLImageElement;
	small: HTMLCanvasElement;
	medium: HTMLCanvasElement;
	footprint: TreeFootprint;
}

export const TREE_SIZE = 48;
export const TREE_BASE_RATIO = 0.92;
export const SMALL_SPRITE_SIZE = 32;
export const MEDIUM_SPRITE_SIZE = 96;

export const spritesByTree = new Map<string, ForestSprites>();
const loadingTrees = new Set<string>();

const createSprite = (image: HTMLImageElement, size: number) => {
	const sprite = document.createElement('canvas');
	sprite.width = size;
	sprite.height = size;
	const context = sprite.getContext('2d')!;
	context.imageSmoothingQuality = 'high';
	context.drawImage(image, 0, 0, size, size);
	return sprite;
};

const DEFAULT_FOOTPRINT: TreeFootprint = { centerX: 0.5, bottomY: 0.92, width: 0.5 };

// Finds the outline of the tree's visible pixels from its small copy.
const measureFootprint = (sprite: HTMLCanvasElement): TreeFootprint => {
	try {
		const size = sprite.width;
		const { data } = sprite.getContext('2d')!.getImageData(0, 0, size, size);
		let minX = size;
		let maxX = -1;
		let maxY = -1;

		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				if (data[(y * size + x) * 4 + 3] > 40) {
					minX = Math.min(minX, x);
					maxX = Math.max(maxX, x);
					maxY = y;
				}
			}
		}

		if (maxX < 0) return DEFAULT_FOOTPRINT;
		return { centerX: (minX + maxX + 1) / 2 / size, bottomY: (maxY + 1) / size, width: (maxX - minX + 1) / size };
	} catch {
		return DEFAULT_FOOTPRINT;
	}
};

export const loadSprites = (treeName: string, onLoad: () => void) => {
	if (spritesByTree.has(treeName) || loadingTrees.has(treeName)) return;

	loadingTrees.add(treeName);
	const image = new Image();
	image.onload = () => {
		const small = createSprite(image, SMALL_SPRITE_SIZE);
		spritesByTree.set(treeName, {
			full: image,
			small,
			medium: createSprite(image, MEDIUM_SPRITE_SIZE),
			footprint: measureFootprint(small),
		});
		loadingTrees.delete(treeName);
		onLoad();
	};
	image.onerror = () => loadingTrees.delete(treeName);
	image.src = getTreeImageSrc(treeName);
};
