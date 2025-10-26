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
export function arrayToObjectByKey(array: any[], keyProperty: string) {
	return array.reduce((acc, obj) => {
		// Use the value of the specified property as the key
		const key = keyProperty ? obj[keyProperty] : obj;
		// Assign the entire object as the value for this key
		acc[key] = obj;
		return acc;
	}, {});
}

export function debounce(func, wait, immediate = null) {
	var timeout;
	var cancelled = false; // flag to check if the debounce was cancelled

	var debounced = function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate && !cancelled) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};

	debounced.cancel = function () {
		clearTimeout(timeout);
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

export const getFormattedDuration = (duration, includeSeconds = true, includeMinutes = true) => {
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

export const parseFormattedDuration = (formatted: string): number => {
	if (!formatted || typeof formatted !== 'string') return 0;

	let totalSeconds = 0;

	// Match patterns like 4h, 30m, 16s (case-sensitive to match your original)
	const hoursMatch = formatted.match(/(\d+)\s*h/);
	const minutesMatch = formatted.match(/(\d+)\s*m/);
	const secondsMatch = formatted.match(/(\d+)\s*s/);

	if (hoursMatch) {
		totalSeconds += parseInt(hoursMatch[1], 10) * 3600;
	}
	if (minutesMatch) {
		totalSeconds += parseInt(minutesMatch[1], 10) * 60;
	}
	if (secondsMatch) {
		totalSeconds += parseInt(secondsMatch[1], 10);
	}

	return totalSeconds;
};

export const toTitleCase = (str) => {
	return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
};

export const getRandomColor = () => {
	const red = Math.floor(Math.random() * 256); // Random number between 0-255
	const green = Math.floor(Math.random() * 256); // Random number between 0-255
	const blue = Math.floor(Math.random() * 256); // Random number between 0-255
	return `rgb(${red}, ${green}, ${blue})`; // Construct RGB color string
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
export const getCommaSeparatedObj = (commaSeparatedStr) => {
	if (!commaSeparatedStr) {
		return {};
	}

	const commaSeparatedStrArr = commaSeparatedStr.split(',');
	const commaSeparatedObj = {};

	for (let value of commaSeparatedStrArr) {
		commaSeparatedObj[value] = true;
	}

	return commaSeparatedObj;
};

export const getMedalImageClasses = (medalImageSizePx, isBattlefieldOneOrThreeMedal) => {
	let medalImageClass = '';

	if (medalImageSizePx === 60) {
		medalImageClass = 'w-[60px]';

		if (isBattlefieldOneOrThreeMedal) {
			medalImageClass += ' sm:ml-[-15px] mr-[-5px]';
		}
	} else if (medalImageSizePx === 100) {
		medalImageClass = 'w-[100px]';

		if (isBattlefieldOneOrThreeMedal) {
			medalImageClass += ' sm:ml-[-25px] mr-[-10px]';
		}
	} else {
		medalImageClass = 'w-[150px]';

		if (isBattlefieldOneOrThreeMedal) {
			medalImageClass += ' sm:ml-[-30px] mr-[-15px]';
		}
	}

	medalImageClass += ' h-full';

	return medalImageClass;
};