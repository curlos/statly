import { createContext, useContext, useEffect, useState } from 'react';
import { useGetUserSettingsQuery, useEditUserSettingsMutation } from '../services/resources/userSettingsApi';
import { TAILWIND_COLORS_OBJ } from '../utils/TAILWIND_COLORS/TAILWIND_COLORS_OBJ';
import { lightenHex, darkenHex, hexToRgba } from '../utils/color.utils';

const buildCustomColorObj = (hex: string) => ({
	textColor: 'text-[var(--theme-color)]',
	bgColor: 'bg-[var(--theme-color)]',
	bgColorHalfOpacity: 'bg-[var(--theme-color-half)]',
	borderColor: 'border-[var(--theme-color)]',
	outlineColor: 'outline-[var(--theme-color)]',
	hexColor: hex,
	hover: {
		textColor: 'hover:text-[var(--theme-color)]',
		bgColor: 'hover:bg-[var(--theme-color)]',
		bgColorHalfOpacity: 'hover:bg-[var(--theme-color-half)]',
		borderColor: 'hover:border-[var(--theme-color)]',
		outlineColor: 'hover:outline-[var(--theme-color)]',
	},
	focus: {
		outlineColor: 'focus:outline-[var(--theme-color)]',
		borderColor: 'focus:border-[var(--theme-color)]',
	},
});

const getInitialColorMode = (): 'dark' | 'light' => {
	const stored = localStorage.getItem('color-mode');
	if (stored === 'dark' || stored === 'light') return stored;
	return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const useTheme = () => {
	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	const [colorMode, setColorMode] = useState<'dark' | 'light'>(getInitialColorMode);

	useEffect(() => {
		document.documentElement.classList.toggle('light-mode', colorMode === 'light');
		localStorage.setItem('color-mode', colorMode);
	}, [colorMode]);

	useEffect(() => {
		if (userSettings?.theme?.colorMode && userSettings.theme.colorMode !== colorMode) {
			setColorMode(userSettings.theme.colorMode);
		}
	}, [userSettings?.theme?.colorMode, colorMode]);

	const toggleColorMode = async () => {
		const next: 'dark' | 'light' = colorMode === 'dark' ? 'light' : 'dark';
		setColorMode(next);
		await editUserSettings({ theme: { ...userSettings?.theme, colorMode: next } });
	};

	const tailwindColorKey = userSettings?.theme?.color || localStorage.getItem('theme-color') || 'red-500';
	const customColorHex = userSettings?.theme?.customColor || localStorage.getItem('theme-custom-color') || '#3b82f6';
	const useCustomColor = userSettings?.theme?.useCustomColor ?? false;
	const themeColorKey = useCustomColor ? customColorHex : tailwindColorKey;
	const isCustomHex = useCustomColor;
	const [chosenColorName, chosenColorNum] = themeColorKey.split('-');
	const chosenColorObj = isCustomHex
		? buildCustomColorObj(themeColorKey)
		: TAILWIND_COLORS_OBJ[chosenColorName][themeColorKey];
	const chosenColorVariantsObj = isCustomHex ? {} : TAILWIND_COLORS_OBJ[chosenColorName];

	useEffect(() => {
		if (isCustomHex) {
			document.documentElement.style.setProperty('--theme-color', themeColorKey);
			document.documentElement.style.setProperty('--theme-color-half', hexToRgba(themeColorKey, 0.5));
		}
	}, [isCustomHex, themeColorKey]);

	if (userSettings?.theme?.color && localStorage.getItem('theme-color') !== userSettings?.theme?.color) {
		localStorage.setItem('theme-color', userSettings?.theme?.color);
	}

	if (userSettings?.theme?.customColor && localStorage.getItem('theme-custom-color') !== userSettings?.theme?.customColor) {
		localStorage.setItem('theme-custom-color', userSettings?.theme?.customColor);
	}

	const selectedFontFamilyKey = userSettings?.theme?.fontFamily || localStorage.getItem('font-family') || 'Default';

	if (userSettings?.theme?.fontFamily && localStorage.getItem('font-family') !== userSettings?.theme?.fontFamily) {
		localStorage.setItem('font-family', userSettings?.theme?.fontFamily);
	}

	useEffect(() => {
		document.documentElement.style.fontFamily = selectedFontFamilyKey !== 'Default' ? selectedFontFamilyKey : '';
	}, [selectedFontFamilyKey]);

	const getNextLightestAndDarkestColor = () => {
		if (isCustomHex) {
			return {
				nextLightestColorObj: buildCustomColorObj(lightenHex(themeColorKey, 0.25)),
				nextDarkestColorObj: buildCustomColorObj(darkenHex(themeColorKey, 0.25)),
			};
		}

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

		if (isCustomHex) {
			return preferredNextColor === 'next-lightest' ? nextLightestColorObj : nextDarkestColorObj;
		}

		if (preferredNextColor === 'next-lightest') {
			// If they are the same, then, to actually see a difference, we have to get the next darkest color.
			if (chosenColorObj.textColor === nextLightestColorObj?.textColor) {
				return nextDarkestColorObj;
			} else {
				return nextLightestColorObj;
			}
			// If the preferred next color is "next-darkest"
		} else {
			// If they are the same, then, to actually see a difference, we have to get the next lightest color.
			if (chosenColorObj.textColor === nextDarkestColorObj?.textColor) {
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
		selectedFontFamilyKey,
		colorMode,
		toggleColorMode,
	};
};

// Export the type of the theme context value
export type ThemeContextValue = ReturnType<typeof useTheme>;

// Create typed context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Export typed hook
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = (): ThemeContextValue => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useThemeContext must be used within ThemeProvider');
	}
	return context;
};

// Export typed provider
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const value = useTheme();
	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
