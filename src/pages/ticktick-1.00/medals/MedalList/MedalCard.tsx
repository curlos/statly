import classNames from 'classnames';
import { useThemeContext } from '../../../../contexts/useThemeContext';

const MedalCard = ({ medal, chosenMedal, setChosenMedal }) => {
	const { name, intervalsEarned } = medal;

	const { chosenColorObj } = useThemeContext();

	const timesEarned = !intervalsEarned ? 0 : intervalsEarned.length;

	const imgSrc = medal.requiredDuration !== undefined ? '/Backfire_Medal_IW.webp' : '/GoodCitizen_Medal_IW.webp';

	return (
		<div
			className={classNames(
				'bg-color-gray-600 border-2 cursor-pointer',
				chosenColorObj.hover.borderColor,
				chosenMedal?.name === name ? chosenColorObj.borderColor : 'border-[transparent]',
				timesEarned === 0 && 'opacity-50'
			)}
			onClick={() => setChosenMedal(medal)}
		>
			<div className="bg-color-gray-150 border-l-[5px] border-white pl-1 font-semibold">{name}</div>
			<img src={imgSrc} className="w-[200px]" />
			<div className="flex justify-end px-2 text-[18px] font-bold">x{timesEarned.toLocaleString()}</div>
		</div>
	);
};

export default MedalCard;
