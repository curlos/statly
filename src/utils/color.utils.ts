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
