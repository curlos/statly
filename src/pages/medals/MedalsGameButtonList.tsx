import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { MEDALS_GAMES } from './medalsLinks';

const MedalsGameButtonList = ({
	medalGameButtonType,
	buttonNamesList,
	selectedGame,
	setSelectedGame,
	selectedMedalType,
	setSelectedMedalType,
}) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[13.5px] sm:text-[16px] py-1 px-3 cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-semibold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-300`;

	return (
		<div className="flex flex-wrap items-center gap-2 my-2">
			{buttonNamesList.map((buttonName) => {
				return (
					<MedalsGameButton
						key={buttonName}
						{...{
							buttonName,
							buttonType: medalGameButtonType,
							selectedButtonStyle,
							unselectedButtonStyle,
							selectedGame,
							setSelectedGame,
							selectedMedalType,
							setSelectedMedalType,
						}}
					/>
				);
			})}
		</div>
	);
};

const MedalsGameButton = ({
	buttonName,
	buttonType,
	selectedButtonStyle,
	unselectedButtonStyle,
	selectedGame,
	setSelectedGame,
	selectedMedalType,
	setSelectedMedalType,
}) => {
	const isSelected = buttonType === 'GAME' ? selectedGame === buttonName : selectedMedalType === buttonName;

	const handleClick = () => {
		if (buttonType === 'GAME') {
			setSelectedGame(buttonName);
			setSelectedMedalType(MEDALS_GAMES[buttonName]['MEDALS_ORDER'][0]);
		} else {
			setSelectedMedalType(buttonName);
		}
	};

	return (
		<div className={isSelected ? selectedButtonStyle : unselectedButtonStyle} onClick={handleClick}>
			{buttonName}
		</div>
	);
};

export default MedalsGameButtonList;
