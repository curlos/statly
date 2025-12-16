import { URL_TO_GAME_MEDAL_MAP } from '../pages/medals/medalsLinks';

export function secondsToHoursAndMinutes(seconds: number) {
	// Convert seconds to minutes
	const totalMinutes = Math.floor(seconds / 60);

	// Calculate hours and minutes
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	return {
		hours: hours,
		minutes: minutes,
	};
}

/**
 * Transforms an array of objects into an object with keys based on a specified property.
 * @param {Object[]} array - The array of objects to transform.
 * @param {string} keyProperty - The property of the objects to use as keys in the resulting object.
 * @returns {Object} An object with keys derived from each object's specified property and values as the objects themselves.
 */
export function arrayToObjectByKey<T>(array: T[], keyProperty: string): Record<string, T> {
	return array.reduce((acc, obj) => {
		// Use the value of the specified property as the key
		const key = keyProperty ? String((obj as Record<string, unknown>)[keyProperty]) : String(obj);
		// Assign the entire object as the value for this key
		acc[key] = obj;
		return acc;
	}, {} as Record<string, T>);
}

interface DebouncedFunction<T extends unknown[]> {
	(this: unknown, ...args: T): void;
	cancel: () => void;
}

export function debounce<T extends unknown[]>(func: (...args: T) => void, wait: number, immediate: boolean | null = null): DebouncedFunction<T> {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	let cancelled = false; // flag to check if the debounce was cancelled

	const debounced = function (this: unknown, ...args: T) {
		const later = () => {
			timeout = null;
			if (!immediate && !cancelled) func.apply(this, args);
		};
		const callNow = immediate && !timeout;
		if (timeout !== null) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(this, args);
	} as DebouncedFunction<T>;

	debounced.cancel = function () {
		if (timeout !== null) clearTimeout(timeout);
		cancelled = true; // set the flag
	};

	return debounced;
}

export function formatTimeToHoursMinutesSeconds(seconds: number) {
	// Extract hours
	const hours = Math.floor(seconds / 3600);
	// Extract remaining minutes after converting to hours
	const minutes = Math.floor((seconds % 3600) / 60);
	// Extract remaining seconds after converting to minutes
	const secondsRemaining = seconds % 60;

	return { hours, minutes, seconds: secondsRemaining };
}

export const getFormattedDuration = (duration: number, includeSeconds: boolean = true, includeMinutes: boolean = true) => {
	if (!duration) {
		return includeSeconds ? '0s' : includeMinutes ? '0m' : '0h';
	}

	const { hours, minutes, seconds } = formatTimeToHoursMinutesSeconds(duration);

	const hoursStr = hours !== 0 ? `${hours.toLocaleString()}h` : '';
	const minutesStr = minutes !== 0 && includeMinutes ? `${minutes}m` : '';
	const secondsStr = seconds !== 0 && includeSeconds ? `${seconds}s` : '';

	// Should only be possible with non-TickTick focus records like Session App. TickTick demands a minimum of 5 minutes for Focus Records but other apps like Session do not so you could have a focus record that is 16 seconds for example.
	if (duration < 60) {
		return `${seconds}s`;
	}

	return `${hoursStr}${minutesStr}${secondsStr}`;
};

export const toTitleCase = (str: string) => {
	return str.replace(/\w\S*/g, (text: string) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
};

export const isFromServer = () => typeof window === 'undefined';

/**
 * @description Transforms the URL string of the passed in query param (like "projects" or "categories") into an object with the
 * @param {String} projectsFromUrl - The comma separated string of the query param value.
 * @returns {Object} - Example: {
 * 	"66d0578f619d91029a6856ff": true,
 * 	"6546186da378914a9ef06b12": false,
 * ...
 * }
 */
export const getCommaSeparatedObj = (commaSeparatedStr: string | undefined): Record<string, boolean> => {
	if (!commaSeparatedStr) {
		return {};
	}

	const commaSeparatedStrArr = commaSeparatedStr.split(',');
	const commaSeparatedObj: Record<string, boolean> = {};

	for (const value of commaSeparatedStrArr) {
		commaSeparatedObj[value] = true;
	}

	return commaSeparatedObj;
};

export const isPokemonTcgCard = (imageUrl: string) => {
	const gameInfo = URL_TO_GAME_MEDAL_MAP.get(imageUrl);
	return gameInfo?.game === 'POKEMON TCG CARDS';
};

export const getMedalImageClasses = (medalImageSizePx: number, isBattlefieldOneOrThreeMedal: boolean, imageUrl: string = '') => {
	let medalImageClass = '';
	const isPokemon = isPokemonTcgCard(imageUrl);

	if (medalImageSizePx === 60) {
		medalImageClass = isPokemon ? 'w-[60px] h-[83px]' : 'w-[60px]';

		if (isBattlefieldOneOrThreeMedal) {
			medalImageClass += ' sm:ml-[-5px] mr-[-5px]';
		}
	} else if (medalImageSizePx === 100) {
		medalImageClass = isPokemon ? 'w-[100px] h-[139px]' : 'w-[100px]';

		if (isBattlefieldOneOrThreeMedal) {
			medalImageClass += ' sm:ml-[-10px] mr-[-10px]';
		}
	} else {
		medalImageClass = isPokemon ? 'w-[150px] h-[209px]' : 'w-[150px]';

		if (isBattlefieldOneOrThreeMedal) {
			medalImageClass += ' sm:ml-[-15px] mr-[-25px]';
		}
	}

	if (isPokemon) {
		medalImageClass += ' h-full';
	}

	return medalImageClass;
};