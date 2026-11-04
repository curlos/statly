import type { FetchArgs } from '@reduxjs/toolkit/query/react';
import { applySettingsPatch } from './settingsPatch';

const GUEST_SETTINGS_PATCHES_KEY = 'guestSettingsPatches';

export const GUEST_DISABLED_MESSAGE = 'This is a demo account, so this is turned off.';

// Anything with this attribute is turned off for guests, and shows the message when the mouse is over it
export const GUEST_DISABLED_ATTRIBUTE = 'data-guest-disabled';

const TOOLTIP_WIDTH = 240;
const TOOLTIP_OFFSET = 14;

// Puts the message just below and to the right of the mouse, moved over to the left when it would run off the screen
export const getGuestTooltipPosition = (mouseX: number, mouseY: number, viewportWidth: number) => ({
	left: Math.max(8, Math.min(mouseX + TOOLTIP_OFFSET, viewportWidth - TOOLTIP_WIDTH - 8)),
	top: mouseY + TOOLTIP_OFFSET + 6,
});

// The server works out streaks from the focus goal rings, so a guest's rings are sent along with each streaks request
export const GUEST_RINGS_HEADER = 'x-guest-focus-goal-rings';
const MAX_ENCODED_RINGS_LENGTH = 12000;

// Guest tokens are marked by the server so reading the token is enough to know this is a guest, even after a page reload.
export const isGuestToken = (token?: string | null) => {
	if (!token) return false;

	try {
		const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
		return !!JSON.parse(atob(payload)).isGuest;
	} catch {
		return false;
	}
};

// Whatever is in the browser's storage can't be trusted to be a list of changes (it could be damaged or edited), and one bad value there shouldn't stop settings from loading or saving. Anything that isn't a change is left out.
const getGuestSettingsPatches = (): Record<string, unknown>[] => {
	try {
		const patches = JSON.parse(localStorage.getItem(GUEST_SETTINGS_PATCHES_KEY) || '[]');
		return Array.isArray(patches) ? patches.filter((patch) => typeof patch === 'object' && patch !== null && !Array.isArray(patch)) : [];
	} catch {
		return [];
	}
};

const isSameOrInside = (key: string, ancestorKey: string) => key === ancestorKey || key.startsWith(`${ancestorKey}.`);

// Adds a change to the list. A change replaces whatever it names (a whole section like "pages", or one value deep inside like "pages.forest.landStyle"), so any earlier change to that same thing, or to something inside it, no longer matters and is dropped. This keeps the list small however many times a setting is changed, and replaying it gives exactly the same result.
export const addGuestSettingsPatch = (patches: Record<string, unknown>[], patch: Record<string, unknown>) => {
	const newKeys = Object.keys(patch);

	const remaining = patches
		.map((earlierPatch) => Object.fromEntries(Object.entries(earlierPatch).filter(([key]) => !newKeys.some((newKey) => isSameOrInside(key, newKey)))))
		.filter((earlierPatch) => Object.keys(earlierPatch).length > 0);

	return [...remaining, patch];
};

// Guests share one account so their settings changes stay in their own browser.
export const saveGuestSettingsPatch = (patch: Record<string, unknown>) => {
	try {
		localStorage.setItem(GUEST_SETTINGS_PATCHES_KEY, JSON.stringify(addGuestSettingsPatch(getGuestSettingsPatches(), patch)));
	} catch (error) {
		console.error('Failed to save guest settings:', error);
	}
};

// Replays a guest's changes, in order, on top of the demo account's real settings.
export const applyGuestSettingsPatches = (settings: Record<string, unknown>) => {
	getGuestSettingsPatches().forEach((patch) => applySettingsPatch(settings, patch));
};

// The rings a guest has changed to, ready to send in a header. Nothing to send until they change one, since the demo account's saved rings are already what the server uses. Every ring change saves all the pages' settings, so the last one that has rings has all of them.
export const getGuestRingsHeaderValue = (): string | undefined => {
	const settings: Record<string, unknown> = {};
	getGuestSettingsPatches().forEach((patch) => applySettingsPatch(settings, patch));

	const rings = (settings.pages as { focusHoursGoal?: { rings?: unknown } } | undefined)?.focusHoursGoal?.rings;
	if (!Array.isArray(rings)) {
		return undefined;
	}

	const encoded = encodeURIComponent(JSON.stringify(rings));
	if (encoded.length > MAX_ENCODED_RINGS_LENGTH) {
		console.warn('Guest focus goal settings are too large to send, so the saved ones are used for streaks.');
		return undefined;
	}

	return encoded;
};

export type GuestRequestAction = 'allow' | 'save-locally' | 'block';

// What happens to a request from a guest. Guests share one account so nothing they do is ever saved to it: reads go through, settings changes are kept in their own browser, and everything else is stopped. The TickTick cookie is the one setting that can't be kept locally.
export const getGuestRequestAction = (method: string, url: string, body?: unknown): GuestRequestAction => {
	if (method.toUpperCase() === 'GET') {
		return 'allow';
	}

	const isSettingsEdit = url.split('?')[0] === '/user-settings/edit';
	if (isSettingsEdit && body && typeof body === 'object' && !('tickTickCookie' in body)) {
		return 'save-locally';
	}

	return 'block';
};

// A guest's streaks are worked out from their own focus goal settings, so they go along with the streaks requests
export const withGuestRingsHeader = (args: string | FetchArgs): string | FetchArgs => {
	const url = typeof args === 'string' ? args : args.url;
	if (!url.startsWith('/streaks/')) {
		return args;
	}

	const ringsHeaderValue = getGuestRingsHeaderValue();
	if (!ringsHeaderValue) {
		return args;
	}

	const fetchArgs = typeof args === 'string' ? { url: args } : args;
	return { ...fetchArgs, headers: { ...(fetchArgs.headers as Record<string, string> | undefined), [GUEST_RINGS_HEADER]: ringsHeaderValue } };
};
