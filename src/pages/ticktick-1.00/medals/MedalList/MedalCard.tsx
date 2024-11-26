import classNames from 'classnames';
import { useThemeContext } from '../../../../contexts/useThemeContext';

const MedalCard = ({ medal, chosenMedal, setChosenMedal }) => {
	const { name = 'Focus 5 Hours', imageSrc = '/Backfire_Medal_IW.webp', timesEarned = 'x361' } = medal;

	const { chosenColorObj } = useThemeContext();

	return (
		<div
			className={classNames(
				'bg-color-gray-600 border cursor-pointer',
				chosenColorObj.hover.borderColor,
				chosenMedal.name === name ? chosenColorObj.borderColor : 'border-[transparent]'
			)}
			onClick={() => setChosenMedal(medal)}
		>
			<div className="bg-color-gray-150 border-l-[5px] border-white pl-1 font-semibold">{name}</div>
			<img src={imageSrc} className="w-[200px]" />
			<div className="flex justify-end px-2 text-[18px] font-bold">x{timesEarned.toLocaleString()}</div>
		</div>
	);
};

export default MedalCard;
