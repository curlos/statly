import { TAILWIND_COLORS_STR } from './TAILWIND_COLORS_STR';

/**
 * @description Generates a gigantic color object using the string of copy and pasted TailwindCSS colors from their color's page. This is necessary so that I can generate the colors object, copy that, and then paste it into the "TAILWIND_COLORS_OBJ.ts" file so that when Tailwind runs through the colors, it sees that the literal string is present and thus JIT won't screw me over. I would prefer to dynamically create the classNames such as "text-${colorName}-500" but JIT will not be able to detect that this is a real color due to how they match their strings. So, this giant object has to be created. I also didn't want to disable JIT as I still think it's mostly useful for reducing bloat.
 * @returns {Object}
 */
export const generateTailwindColorObjects = () => {
	const colorLines = TAILWIND_COLORS_STR.split('\n');
	const colors = {};
	let currentColorGroupName = '';

	colorLines.forEach((line, i) => {
		const trimmedLine = line.trim().toLowerCase();

		const prevLine = colorLines[i - 1]?.trim();
		let colorNumVal = prevLine;

		if (trimmedLine !== '') {
			// If found Hex Color Value
			if (trimmedLine.includes('#')) {
				colors[currentColorGroupName][`${currentColorGroupName}-${colorNumVal}`].hexColor = trimmedLine;

				// If found a color number (like 100, 200, 300, 400, etc.)
			} else if (isNumber(trimmedLine)) {
				colorNumVal = trimmedLine;

				colors[currentColorGroupName][`${currentColorGroupName}-${colorNumVal}`] = {
					textColor: `text-${currentColorGroupName}-${colorNumVal}`,
					bgColor: `bg-${currentColorGroupName}-${colorNumVal}`,
					bgColorHalfOpacity: `bg-${currentColorGroupName}-${colorNumVal}/50`,
					borderColor: `border-${currentColorGroupName}-${colorNumVal}`,
					outlineColor: `outline-${currentColorGroupName}-${colorNumVal}`,
					hexColor: null,
					hover: {
						textColor: `hover:text-${currentColorGroupName}-${colorNumVal}`,
						bgColor: `hover:bg-${currentColorGroupName}-${colorNumVal}`,
						bgColorHalfOpacity: `hover:bg-${currentColorGroupName}-${colorNumVal}/50`,
						borderColor: `hover:border-${currentColorGroupName}-${colorNumVal}`,
						outlineColor: `hover:outline-${currentColorGroupName}-${colorNumVal}`,
					},
				};

				// If found a color name (Slate, Red, Blue, Yellow, etc.)
			} else {
				currentColorGroupName = trimmedLine;
				colors[currentColorGroupName] = {};
			}
		}
	});

	return colors;
};

const isNumber = (value) => typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)));
