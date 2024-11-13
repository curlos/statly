import { useThemeContext } from '../pages/ticktick-1.00/focus-records/useThemeContext';

const useTailwindColors = () => {
	const themeContext = useThemeContext();
	const { cssStyles, chosenColorObj } = themeContext;

	const textColorArr = chosenColorObj.textColor.split('-');
	const chosenColorName = textColorArr[1];
	const chosenColorVariantsObj = cssStyles[chosenColorName];

	return {
		chosenColorVariantsObj,
		chosenColorName,
	};
};

export default useTailwindColors;
