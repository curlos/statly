import { describe, expect, it } from '@jest/globals';
import { getHeatmapColors, getHeatmapMaxDarken } from './color.utils';

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
