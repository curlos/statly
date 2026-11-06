import { describe, expect, it } from '@jest/globals';
import { getAccentOnLightBackground, getHeatmapColors, getHeatmapMaxDarken } from './color.utils';

describe('getAccentOnLightBackground', () => {
	it('darkens a pale yellow accent so it reads on white', () => {
		const result = getAccentOnLightBackground('#FFE200');
		expect(result).not.toBe('#FFE200');
		// Darker than the input: every channel is at most the original
		expect(parseInt(result.slice(1, 3), 16)).toBeLessThan(0xff);
	});

	it('keeps an accent that already has enough contrast', () => {
		expect(getAccentOnLightBackground('#1E3A8A')).toBe('#1E3A8A');
	});

	it('returns a value that is not a 6-digit hex unchanged', () => {
		expect(getAccentOnLightBackground('red')).toBe('red');
		expect(getAccentOnLightBackground('#fff')).toBe('#fff');
	});

	it('stops darkening at the contrast limit instead of going to black', () => {
		expect(getAccentOnLightBackground('#FFFFFF', 1.5)).not.toBe('#000000');
	});
});

describe('getHeatmapMaxDarken', () => {
	it('caps darkening for the near-white Battlefield 1 accent', () => {
		expect(getHeatmapMaxDarken('bf1')).toBe(0.6);
	});

	it('does not cap the Blue/Red Team variants, whose accents are saturated', () => {
		expect(getHeatmapMaxDarken('bf1-blue')).toBeUndefined();
		expect(getHeatmapMaxDarken('bf1-red')).toBeUndefined();
	});

	it('does not cap other themes', () => {
		expect(getHeatmapMaxDarken('default')).toBeUndefined();
		expect(getHeatmapMaxDarken('')).toBeUndefined();
	});
});

describe('getHeatmapColors', () => {
	it('returns the requested number of distinct colors for the team accents', () => {
		for (const hex of ['#43B0D8', '#FF5A3C']) {
			const colors = getHeatmapColors(hex, 7);
			expect(colors).toHaveLength(7);
			expect(new Set(colors).size).toBe(7);
		}
	});
});
