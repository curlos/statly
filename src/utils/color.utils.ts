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

export const blendHexOverBackground = (foregroundHex: string, backgroundHex: string, alpha: number): string => {
	const blendChannel = (start: number) => {
		const foreground = parseInt(foregroundHex.slice(start, start + 2), 16);
		const background = parseInt(backgroundHex.slice(start, start + 2), 16);
		return Math.round(foreground * alpha + background * (1 - alpha)).toString(16).padStart(2, '0');
	};
	return `#${blendChannel(1)}${blendChannel(3)}${blendChannel(5)}`;
};

export const getHalfOpacityFillColor = (themeHex: string, colorMode: 'dark' | 'light'): string => {
	// Page surface colors, matching --color-gray-700 in index.css
	return blendHexOverBackground(themeHex, colorMode === 'dark' ? '#1e1e1e' : '#fafafa', 0.5);
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

const getRelativeLuminance = (hex: string): number => {
	const toLinear = (start: number) => {
		const c = parseInt(hex.slice(start, start + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * toLinear(1) + 0.7152 * toLinear(3) + 0.0722 * toLinear(5);
};

export const getReadableTextColor = (hex: string): '#ffffff' | '#000000' => {
	const luminance = getRelativeLuminance(hex);
	const contrastWithWhite = 1.05 / (luminance + 0.05);
	const contrastWithBlack = (luminance + 0.05) / 0.05;
	return contrastWithWhite >= contrastWithBlack ? '#ffffff' : '#000000';
};

const toHexColor = (color: string): string | null => {
	const named: Record<string, string> = { white: '#ffffff', black: '#000000' };
	const lowerCased = color.toLowerCase();
	if (named[lowerCased]) return named[lowerCased];
	return /^#[0-9a-f]{6}$/.test(lowerCased) ? lowerCased : null;
};

const getContrastRatio = (hexA: string, hexB: string): number => {
	const luminanceA = getRelativeLuminance(hexA);
	const luminanceB = getRelativeLuminance(hexB);
	return (Math.max(luminanceA, luminanceB) + 0.05) / (Math.min(luminanceA, luminanceB) + 0.05);
};

export const getMutedTextPercent = (textColor: string, fillColor: string, minContrast = 4.5): number => {
	const textHex = toHexColor(textColor);
	const fillHex = toHexColor(fillColor);
	if (!textHex || !fillHex) return 75;

	for (let percent = 75; percent < 100; percent++) {
		const mutedHex = blendHexOverBackground(textHex, fillHex, percent / 100);
		if (getContrastRatio(mutedHex, fillHex) >= minContrast) return percent;
	}
	return 100;
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
