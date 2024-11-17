import { createContext, useContext } from 'react';
import { useGetUserSettingsQuery } from '../services/resources/userSettingsApi';
import { TAILWIND_COLORS_OBJ } from '../utils/TAILWIND_COLORS/TAILWIND_COLORS_OBJ';

const ThemeContext = createContext();

export const useThemeContext = () => {
	return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
	const value = useTheme();
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const useTheme = () => {
	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const themeColorKey = userSettings?.theme?.color || localStorage.getItem('theme-color') || 'red-500';
	const [chosenColorName, chosenColorNum] = themeColorKey.split('-');
	const chosenColorObj = TAILWIND_COLORS_OBJ[chosenColorName][themeColorKey];
	const chosenColorVariantsObj = TAILWIND_COLORS_OBJ[chosenColorName];

	if (userSettings?.theme?.color && !localStorage.getItem('theme-color')) {
		localStorage.setItem('theme-color', userSettings?.theme?.color);
	}

	const getNextLightestAndDarkestColor = () => {
		const colorVariantNameList = Object.keys(chosenColorVariantsObj);
		let nextLightestColorObj = null;
		let nextDarkestColorObj = null;

		for (let i = 0; i < colorVariantNameList.length; i++) {
			const colorVariantName = colorVariantNameList[i];

			if (colorVariantName === themeColorKey) {
				if (chosenColorNum == '50') {
					// There's no lighter color than the "50" variant so the next lightest color is just itself.
					nextLightestColorObj = chosenColorObj;
				} else {
					const prevColorName = colorVariantNameList[i - 1];
					nextLightestColorObj = chosenColorVariantsObj[prevColorName];
				}

				if (chosenColorNum == '950') {
					// There's no darker color than the "950" variant so the next darkest color is just itself.
					nextDarkestColorObj = chosenColorObj;
				} else {
					const nextColorName = colorVariantNameList[i + 1];
					nextDarkestColorObj = chosenColorVariantsObj[nextColorName];
				}
			}
		}

		return {
			nextLightestColorObj,
			nextDarkestColorObj,
		};
	};

	/**
	 * @description An extension of the "getNextLightestAndDarkestColor". This will get the next lightest or darkest color. However, the twist is that if we already have the lightest or darkest color possible, we will not see a difference. This is not good for things like active states on bar graphs in the Stats Page. So, in that case, we go the other way, get the next lightest or darkest depending on if we have the lightest or darkest color already.
	 * @param preferredNextColor {String}
	 * @returns
	 */
	const getNextLightestOrDarkestColorObj = (preferredNextColor = 'next-lightest') => {
		const { nextLightestColorObj, nextDarkestColorObj } = getNextLightestAndDarkestColor();

		if (preferredNextColor === 'next-lightest') {
			// If they are the same, then, to actually see a difference, we have to get the next darkest color.
			if (chosenColorObj.textColor === nextLightestColorObj.textColor) {
				return nextDarkestColorObj;
			} else {
				return nextLightestColorObj;
			}
			// If the preferred next color is "next-darkest"
		} else {
			// If they are the same, then, to actually see a difference, we have to get the next lightest color.
			if (chosenColorObj.textColor === nextDarkestColorObj.textColor) {
				return nextLightestColorObj;
			} else {
				return nextDarkestColorObj;
			}
		}
	};

	return {
		themeColorKey,
		cssStyles: TAILWIND_COLORS_OBJ,
		chosenColorObj,
		chosenColorVariantsObj, // To get all the variants. If a chosen color is red-500, then the variants would be red-50, red-100, red-200, red-300, etc.
		chosenColorName,
		nextLightestColorObj: getNextLightestOrDarkestColorObj('next-lightest'),
		nextDarkestColorObj: getNextLightestOrDarkestColorObj('next-darkest'),
	};
};
