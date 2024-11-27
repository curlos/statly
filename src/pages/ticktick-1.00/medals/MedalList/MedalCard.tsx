import classNames from 'classnames';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import useWindowSize from '../../../../hooks/useWindowSize';

const MedalCard = ({ medal, chosenMedal, setChosenMedal, isLoadingFocusOrTasksData, setShowChosenMedalModal }) => {
	const { name, intervalsEarned } = medal;

	const { chosenColorObj } = useThemeContext();

	const timesEarned = !intervalsEarned ? 0 : intervalsEarned.length;

	const imgSrc =
		medal.requiredDuration !== undefined ? '/Brusilovs_Star.webp' : '/Eternal_Order_of_the_Gladiator_Medal.webp';

	const { width } = useWindowSize();

	return (
		<div
			className={classNames(
				'bg-color-gray-600 border-2 cursor-pointer',
				chosenColorObj.hover.borderColor,
				chosenMedal?.name === name ? chosenColorObj.borderColor : 'border-[transparent]',
				isLoadingFocusOrTasksData ? 'animate-pulse' : timesEarned === 0 && 'opacity-50'
			)}
			onClick={() => {
				setChosenMedal(medal);

				if (width && width < 576) {
					setShowChosenMedalModal(true);
				}
			}}
		>
			<div className="bg-color-gray-150 border-l-[5px] border-white pl-1 font-semibold text-[14px] sm:text-[16px]">
				{name}
			</div>
			<div className="flex justify-center">
				<img src={imgSrc} className="w-[150px] my-2" />
			</div>
			<div className="flex justify-end px-2 text-[16px] sm:text-[20px] font-bold">
				x{timesEarned.toLocaleString()}
			</div>
		</div>
	);
};

export default MedalCard;
