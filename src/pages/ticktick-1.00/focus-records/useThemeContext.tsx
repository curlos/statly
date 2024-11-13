import { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useThemeContext = () => {
	return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
	const calendar = useTheme();
	return <ThemeContext.Provider value={calendar}>{children}</ThemeContext.Provider>;
};

const useTheme = () => {
	return {
		'/ticktick-1.00/focus-records': {
			themeColor: 'red-500',
			cssStyles: {
				'blue-500': {
					textColor: 'text-blue-500',
					bgColor: 'bg-blue-500/50',
					borderColor: 'border-blue-500',
				},
				'emerald-500': {
					textColor: 'text-emerald-500',
					bgColor: 'bg-emerald-500/50',
					borderColor: 'border-emerald-500',
				},
				'red-500': {
					textColor: 'text-red-500',
					bgColor: 'bg-red-500/50',
					borderColor: 'border-red-500',
				},
			},
		},
	};
};
