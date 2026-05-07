/**
 * Color utility functions
 */

/**
 * Convert hex color to rgba with opacity
 * @param hex - Hex color string (e.g., "#fa114f")
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string (e.g., "rgba(250, 17, 79, 0.2)")
 */
export const hexToRgba = (hex: string, opacity: number): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const lightenHex = (hex: string, factor: number): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const toHex = (v: number) => Math.round(v + (255 - v) * factor).toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const darkenHex = (hex: string, factor: number): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const toHex = (v: number) => Math.round(v * (1 - factor)).toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const getColorBrightness = (hex: string): number => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return 0.299 * r + 0.587 * g + 0.114 * b;
};

const TIER_STEP = 0.14;

export const getHeatmapColors = (hexColor: string, count = 7): string[] => {
	const brightness = getColorBrightness(hexColor);
	const pivotTier = Math.min(count - 1, Math.floor(brightness / (255 / count)));
	return Array.from({ length: count }, (_, i) => {
		if (i === pivotTier) return hexColor;
		if (i < pivotTier) return darkenHex(hexColor, Math.min((pivotTier - i) * TIER_STEP, 0.85));
		return lightenHex(hexColor, Math.min((i - pivotTier) * TIER_STEP, 0.92));
	});
};
