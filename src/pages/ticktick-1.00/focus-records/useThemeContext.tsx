import { createContext, useContext, useEffect, useState } from 'react';
import { useGetUserSettingsQuery } from '../../../services/resources/userSettingsApi';
import { TAILWIND_COLORS_OBJ } from '../../../utils/TAILWIND_COLORS/TAILWIND_COLORS_OBJ';
import { generateTailwindColorObjects } from '../../../utils/TAILWIND_COLORS/generateTailwindColorObjects';

const ThemeContext = createContext();

export const useThemeContext = () => {
	return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
	const calendar = useTheme();
	return <ThemeContext.Provider value={calendar}>{children}</ThemeContext.Provider>;
};

const useTheme = () => {
	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const [themeColorKey, setThemeColorKey] = useState('red-500');

	useEffect(() => {
		if (isLoadingGetUserSettings) {
			return;
		}

		const currentThemeColor = userSettings?.theme?.color;

		if (currentThemeColor) {
			setThemeColorKey(currentThemeColor);
		}
	}, [userSettings]);

	const [colorName] = themeColorKey.split('-');
	const chosenColorObj = TAILWIND_COLORS_OBJ[colorName][themeColorKey];

	// console.log(generateTailwindColorObjects());

	return {
		themeColorKey,
		setThemeColorKey,
		cssStyles: TAILWIND_COLORS_OBJ,
		chosenColorObj,
	};
};
