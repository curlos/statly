import { describe, expect, it } from '@jest/globals';
import { applySettingsPatch } from './settingsPatch';

describe('applySettingsPatch', () => {
	it('replaces top-level keys, like before', () => {
		const settings: Record<string, unknown> = { autoSyncEnabled: false, theme: { color: 'blue' } };
		applySettingsPatch(settings, { autoSyncEnabled: true, theme: { color: 'red' } });
		expect(settings).toEqual({ autoSyncEnabled: true, theme: { color: 'red' } });
	});

	it('sets a value deep inside the settings from a dotted key, leaving its neighbors alone', () => {
		const settings: Record<string, unknown> = { pages: { forest: { landStyle: 'auto', projectTrees: { a: 'maple_tree' } }, medals: { keep: true } } };
		applySettingsPatch(settings, { 'pages.forest.landStyle': 'winter' });
		expect(settings).toEqual({ pages: { forest: { landStyle: 'winter', projectTrees: { a: 'maple_tree' } }, medals: { keep: true } } });
	});

	it('replaces a whole nested object, and adds the path when it does not exist yet', () => {
		const settings: Record<string, unknown> = {};
		applySettingsPatch(settings, { 'pages.forest.projectTrees': { a: 'palm_tree' } });
		expect(settings).toEqual({ pages: { forest: { projectTrees: { a: 'palm_tree' } } } });
	});

	it('never adds a literal dotted key', () => {
		const settings: Record<string, unknown> = {};
		applySettingsPatch(settings, { 'pages.forest.landStyle': 'sand' });
		expect(Object.keys(settings)).toEqual(['pages']);
	});

	it('applies several changes in order', () => {
		const settings: Record<string, unknown> = {};
		applySettingsPatch(settings, { 'pages.forest.projectTrees': { a: 'x' } });
		applySettingsPatch(settings, { 'pages.forest.projectTrees': { a: 'x', b: 'y' } });
		expect(settings).toEqual({ pages: { forest: { projectTrees: { a: 'x', b: 'y' } } } });
	});
});
