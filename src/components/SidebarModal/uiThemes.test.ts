import { describe, expect, it } from '@jest/globals';
import { existsSync } from 'fs';
import path from 'path';
import { GAME_THEME_COLORS, LIGHT_GAME_THEMES, UI_THEME_GROUPS } from './uiThemes';

const SRC = path.join(__dirname, '../..');
const pickerThemes = UI_THEME_GROUPS.flatMap((group) => group.themes);
const pickerKeys = pickerThemes.map((theme) => theme.key);

// The bf1/bf4 team variants share one CSS file (prefix match), so check the base key's file.
const cssFileFor = (key: string) => path.join(SRC, 'themes', `${key.replace(/-(blue|red|green|orange)$/, '')}.css`);

describe('UI theme data', () => {
	it('lists every theme key in the picker only once', () => {
		expect(new Set(pickerKeys).size).toBe(pickerKeys.length);
	});

	it('puts every game theme with an accent color in the picker', () => {
		Object.keys(GAME_THEME_COLORS).forEach((key) => expect(pickerKeys).toContain(key));
	});

	it('gives every picker theme an accent color, except Ink & Marker (which uses the user color)', () => {
		pickerKeys
			.filter((key) => key !== 'ink-marker')
			.forEach((key) => expect(GAME_THEME_COLORS).toHaveProperty([key]));
	});

	it('only marks known game themes as light', () => {
		LIGHT_GAME_THEMES.forEach((key) => expect(GAME_THEME_COLORS).toHaveProperty([key]));
	});

	it('has a CSS file for every picker theme', () => {
		pickerKeys.forEach((key) => expect(existsSync(cssFileFor(key))).toBe(true));
	});

	it('has an icon file for every picker theme that uses one', () => {
		pickerThemes
			.filter((theme) => theme.icon)
			.forEach((theme) => expect(existsSync(path.join(SRC, 'assets/themes/icons', theme.icon!))).toBe(true));
	});

	it('has no empty groups', () => {
		UI_THEME_GROUPS.forEach((group) => expect(group.themes.length).toBeGreaterThan(0));
	});
});
