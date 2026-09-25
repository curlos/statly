import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useGetUserSettingsQuery, useEditUserSettingsMutation } from '../services/resources/userSettingsApi';
import { TAILWIND_COLORS_OBJ } from '../utils/TAILWIND_COLORS/TAILWIND_COLORS_OBJ';
import { lightenHex, darkenHex, hexToRgba, getReadableTextColor } from '../utils/color.utils';

const buildCustomColorObj = (hex: string) => ({
	textColor: 'text-[var(--theme-color)]',
	bgColor: 'bg-[var(--theme-color)] text-on-theme',
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

// Game UI themes ignore the user's theme color and always use their signature accent color.
const GAME_THEME_COLORS: Record<string, string> = {
	hades: '#D9B650',
	p3r: '#3FE3F5',
	p5: '#E5191C',
	cyberpunk: '#FF5C57',
	p4: '#FFE200',
	ff7r: '#3AA0FF',
	mgs: '#7DFFB0',
	rdr2: '#C01D1D',
};

// Game UI themes with a light look (the rest force dark mode).
const LIGHT_GAME_THEMES = ['p4'];

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

	const uiTheme = userSettings?.theme?.uiTheme || localStorage.getItem('ui-theme') || 'default';
	const gameThemeColor = GAME_THEME_COLORS[uiTheme];
	const isGameTheme = !!gameThemeColor;
	// Ink & Marker keeps the user's own theme color and color mode, but uses its own fonts.
	const isInkMarker = uiTheme === 'ink-marker';

	// The mode actually showing: game UI themes pick their own (light for LIGHT_GAME_THEMES,
	// dark for the rest); otherwise the user's saved Color Mode. Use this for any color decisions.
	const effectiveColorMode: 'dark' | 'light' = LIGHT_GAME_THEMES.includes(uiTheme)
		? 'light'
		: isGameTheme
			? 'dark'
			: colorMode;

	useLayoutEffect(() => {
		document.documentElement.dataset.uiTheme = uiTheme;
		// Remember the theme so the next page load shows it right away, before user settings load
		localStorage.setItem('ui-theme', uiTheme);
	}, [uiTheme]);

	useEffect(() => {
		document.documentElement.classList.toggle('light-mode', effectiveColorMode === 'light');
		localStorage.setItem('color-mode', colorMode);
	}, [colorMode, effectiveColorMode]);

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
	const useCustomColor = userSettings?.theme?.useCustomColor ?? localStorage.getItem('theme-use-custom-color') === 'true';
	const themeColorKey = isGameTheme ? gameThemeColor : useCustomColor ? customColorHex : tailwindColorKey;
	const isCustomHex = isGameTheme || useCustomColor;
	const [chosenColorName, chosenColorNum] = themeColorKey.split('-');
	const baseColorObj = isCustomHex
		? buildCustomColorObj(themeColorKey)
		: TAILWIND_COLORS_OBJ[chosenColorName][themeColorKey];
	// Ink & Marker routes the user's color (Tailwind or custom) through the var(--theme-color) classes,
	// so its CSS can put the Copic marker texture on every themed element.
	const chosenColorObj = isInkMarker ? buildCustomColorObj(baseColorObj.hexColor) : baseColorObj;
	const chosenColorVariantsObj = isCustomHex ? {} : TAILWIND_COLORS_OBJ[chosenColorName];
	const themeHexColor = chosenColorObj?.hexColor;

	useLayoutEffect(() => {
		if (themeHexColor) {
			document.documentElement.style.setProperty('--theme-on-color', getReadableTextColor(themeHexColor));
		}
	}, [themeHexColor]);

	useLayoutEffect(() => {
		if (isCustomHex || isInkMarker) {
			document.documentElement.style.setProperty('--theme-color', themeHexColor);
			document.documentElement.style.setProperty('--theme-color-half', hexToRgba(themeHexColor, 0.5));
		}
	}, [isCustomHex, isInkMarker, themeHexColor]);

	if (userSettings?.theme?.color && localStorage.getItem('theme-color') !== userSettings?.theme?.color) {
		localStorage.setItem('theme-color', userSettings?.theme?.color);
	}

	if (userSettings?.theme?.customColor && localStorage.getItem('theme-custom-color') !== userSettings?.theme?.customColor) {
		localStorage.setItem('theme-custom-color', userSettings?.theme?.customColor);
	}

	if (userSettings?.theme?.useCustomColor !== undefined && localStorage.getItem('theme-use-custom-color') !== String(userSettings.theme.useCustomColor)) {
		localStorage.setItem('theme-use-custom-color', String(userSettings.theme.useCustomColor));
	}

	const selectedFontFamilyKey = userSettings?.theme?.fontFamily || localStorage.getItem('font-family') || 'Default';

	if (userSettings?.theme?.fontFamily && localStorage.getItem('font-family') !== userSettings?.theme?.fontFamily) {
		localStorage.setItem('font-family', userSettings?.theme?.fontFamily);
	}

	useEffect(() => {
		const root = document.documentElement;
		const hasChosenFont = selectedFontFamilyKey !== 'Default';
		// Game UI themes set their own fonts in src/themes/*.css.
		// Quoted: unquoted names with a word starting with a digit (e.g. "M PLUS 1p") are invalid CSS.
		root.style.fontFamily = hasChosenFont && !isGameTheme ? `'${selectedFontFamilyKey}'` : '';
		// Ink & Marker uses the chosen font everywhere (titles, labels, buttons too) via this variable,
		// and falls back to its own typefaces when the font is "Default".
		if (hasChosenFont) {
			root.style.setProperty('--user-font', `'${selectedFontFamilyKey}'`);
		} else {
			root.style.removeProperty('--user-font');
		}
	}, [selectedFontFamilyKey, isGameTheme]);

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
		// The mode actually showing (what colors should follow); savedColorMode is the user's setting.
		colorMode: effectiveColorMode,
		savedColorMode: colorMode,
		toggleColorMode,
		uiTheme,
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
