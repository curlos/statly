import classNames from 'classnames';
import { navigate } from 'vike/client/router';
import { useThemeContext } from '../../../contexts/useThemeContext';

const TopButtonList = ({ BUTTONS_INTERVALS_OBJ }) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[16px] py-1 px-3 cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-semibold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-300`;

	return (
		<div className="container flex items-center gap-2 my-2">
			{BUTTONS_INTERVALS_OBJ.map((buttonObj) => {
				const { name, url } = buttonObj;

				return <TopButton key={name} {...{ name, url, selectedButtonStyle, unselectedButtonStyle }} />;
			})}
		</div>
	);
};

const TopButton = ({ name, url, selectedButtonStyle, unselectedButtonStyle }) => {
	return (
		<div
			className={location.pathname.includes(name.toLowerCase()) ? selectedButtonStyle : unselectedButtonStyle}
			onClick={() => navigate(url)}
		>
			{name}
		</div>
	);
};

export default TopButtonList;
