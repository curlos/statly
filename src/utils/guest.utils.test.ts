import { beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { applySettingsPatch } from './settingsPatch';
import {
	GUEST_RINGS_HEADER,
	addGuestSettingsPatch,
	applyGuestSettingsPatches,
	getGuestRequestAction,
	getGuestRingsHeaderValue,
	getGuestTooltipPosition,
	isGuestToken,
	saveGuestSettingsPatch,
	withGuestRingsHeader,
} from './guest.utils';

const makeToken = (payload: object) => `header.${btoa(JSON.stringify(payload))}.signature`;

describe('isGuestToken', () => {
	it('recognizes a guest token', () => {
		expect(isGuestToken(makeToken({ userId: '1', isGuest: true }))).toBe(true);
	});

	it('reads real tokens, which are base64url encoded', () => {
		// These characters become "-" and "_" in a real token
		const payload = Buffer.from(JSON.stringify({ userId: '??>>~~', isGuest: true })).toString('base64url');
		expect(payload).toMatch(/[-_]/);
		expect(isGuestToken(`header.${payload}.signature`)).toBe(true);
	});

	it('treats normal, missing and broken tokens as not a guest', () => {
		expect(isGuestToken(makeToken({ userId: '1' }))).toBe(false);
		expect(isGuestToken(null)).toBe(false);
		expect(isGuestToken('not-a-token')).toBe(false);
	});
});

describe('guest settings', () => {
	const store: Record<string, string> = {};

	beforeAll(() => {
		(globalThis as unknown as { localStorage: unknown }).localStorage = {
			getItem: (key: string) => store[key] ?? null,
			setItem: (key: string, value: string) => {
				store[key] = value;
			},
		};
	});

	it('replays changes in order on top of the real settings', () => {
		saveGuestSettingsPatch({ theme: { color: 'blue-500' } });
		saveGuestSettingsPatch({ 'pages.forest.landStyle': 'desert' });
		saveGuestSettingsPatch({ theme: { color: 'green-500' } });

		const settings: Record<string, unknown> = {
			theme: { color: 'red-500' },
			autoSyncEnabled: false,
			pages: { forest: { landStyle: 'grass' } },
		};
		applyGuestSettingsPatches(settings);

		expect(settings).toEqual({
			theme: { color: 'green-500' },
			autoSyncEnabled: false,
			pages: { forest: { landStyle: 'desert' } },
		});
	});
});

describe('getGuestRingsHeaderValue', () => {
	const key = 'guestSettingsPatches';
	const store: Record<string, string> = {};

	beforeAll(() => {
		(globalThis as unknown as { localStorage: unknown }).localStorage = {
			getItem: (k: string) => store[k] ?? null,
			setItem: (k: string, v: string) => {
				store[k] = v;
			},
		};
	});

	it('sends nothing until a guest has changed a ring', () => {
		store[key] = JSON.stringify([{ theme: { color: 'blue-500' } }, { 'pages.forest.landStyle': 'desert' }]);
		expect(getGuestRingsHeaderValue()).toBeUndefined();
	});

	it('sends the rings from the latest change to the pages', () => {
		const first = [{ id: 'ring-1', goalSeconds: 3600 }];
		const second = [{ id: 'ring-1', goalSeconds: 7200 }];
		store[key] = JSON.stringify([
			{ pages: { focusHoursGoal: { rings: first } } },
			{ theme: { color: 'blue-500' } },
			{ pages: { focusHoursGoal: { rings: second } } },
		]);
		expect(JSON.parse(decodeURIComponent(getGuestRingsHeaderValue() as string))).toEqual(second);
	});

	it('sends nothing when the rings are too big for a header', () => {
		const rings = Array.from({ length: 40 }, (_, i) => ({ id: `ring-${i}`, name: 'x'.repeat(300) }));
		store[key] = JSON.stringify([{ pages: { focusHoursGoal: { rings } } }]);
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		expect(getGuestRingsHeaderValue()).toBeUndefined();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

describe('getGuestRequestAction', () => {
	it('lets guests read anything', () => {
		expect(getGuestRequestAction('GET', '/focus-records?page=1')).toBe('allow');
		expect(getGuestRequestAction('get', '/stats/overview')).toBe('allow');
	});

	it('keeps guests settings changes in their own browser', () => {
		expect(getGuestRequestAction('PUT', '/user-settings/edit', { theme: { color: 'blue-500' } })).toBe(
			'save-locally'
		);
	});

	it('stops everything else that would change the shared account', () => {
		expect(getGuestRequestAction('DELETE', '/delete/all')).toBe('block');
		expect(getGuestRequestAction('DELETE', '/delete/focus-record/abc')).toBe('block');
		expect(getGuestRequestAction('POST', '/delete/tasks/bulk-delete', { taskIds: ['1'] })).toBe('block');
		expect(getGuestRequestAction('POST', '/sync/ticktick/all')).toBe('block');
		expect(getGuestRequestAction('POST', '/import/backup', {})).toBe('block');
		expect(getGuestRequestAction('POST', '/focus-records/analyze-note-emotions', { recordIds: ['1'] })).toBe(
			'block'
		);
		expect(getGuestRequestAction('PUT', '/users/update-password', { newPassword: 'x' })).toBe('block');
		expect(getGuestRequestAction('PUT', '/users/update-profile', {})).toBe('block');
		expect(getGuestRequestAction('POST', '/custom-images/upload', {})).toBe('block');
	});

	it("can't save a TickTick cookie, even as a settings change", () => {
		expect(getGuestRequestAction('PUT', '/user-settings/edit', { tickTickCookie: 'abc' })).toBe('block');
	});

	it('stops a settings change that has nothing to save', () => {
		expect(getGuestRequestAction('PUT', '/user-settings/edit', undefined)).toBe('block');
	});
});

describe('withGuestRingsHeader', () => {
	const key = 'guestSettingsPatches';
	const store: Record<string, string> = {};
	const rings = [{ id: 'ring-1', goalSeconds: 14400 }];

	beforeAll(() => {
		(globalThis as unknown as { localStorage: unknown }).localStorage = {
			getItem: (k: string) => store[k] ?? null,
			setItem: (k: string, v: string) => {
				store[k] = v;
			},
		};
	});

	beforeEach(() => {
		store[key] = JSON.stringify([{ pages: { focusHoursGoal: { rings } } }]);
	});

	it('adds the guests rings to the streaks requests', () => {
		const result = withGuestRingsHeader('/streaks/history?timezone=UTC') as {
			url: string;
			headers: Record<string, string>;
		};

		expect(result.url).toBe('/streaks/history?timezone=UTC');
		expect(JSON.parse(decodeURIComponent(result.headers[GUEST_RINGS_HEADER]))).toEqual(rings);
	});

	it('keeps everything else on a request that is already set up', () => {
		const result = withGuestRingsHeader({ url: '/streaks/today', method: 'GET', headers: { 'x-other': '1' } }) as {
			method: string;
			headers: Record<string, string>;
		};

		expect(result.method).toBe('GET');
		expect(result.headers['x-other']).toBe('1');
		expect(result.headers[GUEST_RINGS_HEADER]).toBeDefined();
	});

	it('leaves every other request alone', () => {
		expect(withGuestRingsHeader('/focus-records?page=1')).toBe('/focus-records?page=1');
		const args = { url: '/stats/overview' };
		expect(withGuestRingsHeader(args)).toBe(args);
	});

	it('leaves the streaks requests alone until a ring has been changed', () => {
		store[key] = JSON.stringify([{ theme: { color: 'blue-500' } }]);
		expect(withGuestRingsHeader('/streaks/today')).toBe('/streaks/today');
	});
});

describe('getGuestTooltipPosition', () => {
	it('puts the message just below and to the right of the mouse', () => {
		const { left, top } = getGuestTooltipPosition(300, 200, 1440);
		expect(left).toBeGreaterThan(300);
		expect(left).toBeLessThan(330);
		expect(top).toBeGreaterThan(200);
		expect(top).toBeLessThan(240);
	});

	it('keeps the whole message on the screen near the right edge, and the left edge', () => {
		expect(getGuestTooltipPosition(1430, 200, 1440).left + 240).toBeLessThanOrEqual(1440);
		expect(getGuestTooltipPosition(0, 200, 100).left).toBeGreaterThanOrEqual(0);
	});
});

describe('addGuestSettingsPatch', () => {
	it("keeps one copy of a section however many times it's changed", () => {
		let patches: Record<string, unknown>[] = [];
		for (let i = 0; i < 50; i++) {
			patches = addGuestSettingsPatch(patches, {
				pages: { focusHoursGoal: { rings: [{ id: 'ring-1', goalSeconds: i }] } },
			});
		}

		expect(patches).toEqual([{ pages: { focusHoursGoal: { rings: [{ id: 'ring-1', goalSeconds: 49 }] } } }]);
	});

	it('keeps changes to different things', () => {
		let patches: Record<string, unknown>[] = [];
		patches = addGuestSettingsPatch(patches, { theme: { color: 'blue-500' } });
		patches = addGuestSettingsPatch(patches, { pages: { forest: {} } });
		patches = addGuestSettingsPatch(patches, { autoSyncEnabled: true });
		patches = addGuestSettingsPatch(patches, { 'pages.forest.landStyle': 'desert' });

		expect(patches).toHaveLength(4);
	});

	it('drops earlier changes inside something that is replaced, but keeps the replacement', () => {
		let patches: Record<string, unknown>[] = [];
		patches = addGuestSettingsPatch(patches, { 'pages.forest.landStyle': 'desert' });
		patches = addGuestSettingsPatch(patches, { 'pages.forest.hemisphere': 'south' });
		patches = addGuestSettingsPatch(patches, { pages: { forest: { landStyle: 'grass' } } });

		expect(patches).toEqual([{ pages: { forest: { landStyle: 'grass' } } }]);
	});

	it('keeps a change to part of a section that was replaced earlier', () => {
		let patches: Record<string, unknown>[] = [];
		patches = addGuestSettingsPatch(patches, { pages: { forest: { landStyle: 'grass' } } });
		patches = addGuestSettingsPatch(patches, { 'pages.forest.landStyle': 'desert' });

		expect(patches).toHaveLength(2);
	});

	it('only drops the keys that are replaced when one change names several', () => {
		let patches: Record<string, unknown>[] = [{ theme: { color: 'red-500' }, autoSyncEnabled: true }];
		patches = addGuestSettingsPatch(patches, { theme: { color: 'blue-500' } });

		expect(patches).toEqual([{ autoSyncEnabled: true }, { theme: { color: 'blue-500' } }]);
	});

	it('always gives the same settings as replaying every change', () => {
		const keys = [
			'theme',
			'autoSyncEnabled',
			'pages',
			'pages.forest',
			'pages.forest.landStyle',
			'pages.forest.hemisphere',
			'pages.focusHoursGoal.rings',
			'pages.focusHoursGoal.combinedRingsSettings.goalDays',
		];
		const makeBase = () => ({
			theme: { color: 'red-500' },
			autoSyncEnabled: false,
			pages: {
				forest: { landStyle: 'grass', hemisphere: 'north' },
				focusHoursGoal: { rings: [0], combinedRingsSettings: { goalDays: 7 } },
			},
		});

		// A seeded random number generator so a failure can be reproduced
		let seed = 12345;
		const random = () => {
			seed = (seed * 1103515245 + 12345) % 2147483648;
			return seed / 2147483648;
		};

		for (let run = 0; run < 400; run++) {
			let compacted: Record<string, unknown>[] = [];
			const everything: Record<string, unknown>[] = [];

			for (let step = 0; step < 14; step++) {
				const patch: Record<string, unknown> = {};
				const keyCount = 1 + Math.floor(random() * 2);
				for (let i = 0; i < keyCount; i++) {
					patch[keys[Math.floor(random() * keys.length)]] = `value-${run}-${step}-${i}`;
				}
				everything.push(patch);
				compacted = addGuestSettingsPatch(compacted, patch);
			}

			const fromEverything: Record<string, unknown> = makeBase();
			const fromCompacted: Record<string, unknown> = makeBase();
			everything.forEach((patch) => applySettingsPatch(fromEverything, patch));
			compacted.forEach((patch) => applySettingsPatch(fromCompacted, patch));

			expect(fromCompacted).toEqual(fromEverything);
			expect(compacted.length).toBeLessThanOrEqual(everything.length);
		}
	});
});

describe('stored guest settings that are damaged', () => {
	const key = 'guestSettingsPatches';
	const store: Record<string, string> = {};

	beforeAll(() => {
		(globalThis as unknown as { localStorage: unknown }).localStorage = {
			getItem: (k: string) => store[k] ?? null,
			setItem: (k: string, v: string) => {
				store[k] = v;
			},
		};
	});

	it.each([['null'], ['{"theme":{"color":"red-500"}}'], ['"text"'], ['42'], ['not json at all']])(
		'still loads settings when the storage has %s',
		(stored) => {
			store[key] = stored;
			const settings: Record<string, unknown> = { theme: { color: 'red-500' } };

			expect(() => applyGuestSettingsPatches(settings)).not.toThrow();
			expect(settings).toEqual({ theme: { color: 'red-500' } });
			expect(getGuestRingsHeaderValue()).toBeUndefined();
		}
	);

	it.each([['null'], ['{"theme":{"color":"red-500"}}'], ['not json at all']])(
		'still saves changes when the storage has %s',
		(stored) => {
			store[key] = stored;

			saveGuestSettingsPatch({ theme: { color: 'blue-500' } });

			expect(JSON.parse(store[key])).toEqual([{ theme: { color: 'blue-500' } }]);
		}
	);

	it('keeps the good changes and leaves out the ones that are not changes', () => {
		store[key] = JSON.stringify([
			{ theme: { color: 'blue-500' } },
			null,
			'text',
			7,
			['list'],
			{ autoSyncEnabled: true },
		]);
		const settings: Record<string, unknown> = { theme: { color: 'red-500' }, autoSyncEnabled: false };

		applyGuestSettingsPatches(settings);
		saveGuestSettingsPatch({ 'pages.forest.landStyle': 'desert' });

		expect(settings).toEqual({ theme: { color: 'blue-500' }, autoSyncEnabled: true });
		expect(JSON.parse(store[key])).toEqual([
			{ theme: { color: 'blue-500' } },
			{ autoSyncEnabled: true },
			{ 'pages.forest.landStyle': 'desert' },
		]);
	});
});
