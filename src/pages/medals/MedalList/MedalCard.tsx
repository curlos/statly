import classNames from 'classnames';
import LazyImage from '../../../components/LazyImage';
import { useThemeContext } from '../../../contexts/useThemeContext';
import useWindowSize from '../../../hooks/useWindowSize';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';

const MedalCard = ({
	medal,
	chosenMedal,
	setChosenMedal,
	isLoadingFocusOrTasksData,
	setShowChosenMedalModal,
}) => {

	const { chosenColorObj } = useThemeContext();
	const {
		medalsPageSettings: { selectedMedalCardImage },
	} = useUserSettingsContext();

	const { name, intervalsEarned } = medal;

	const timesEarned = !intervalsEarned ? 0 : intervalsEarned.length;

	const imgSrc = selectedMedalCardImage?.[medal.type]
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
			<div className="flex justify-center mx-2 my-2">
				<LazyImage src={imgSrc} alt="Medal image" className="w-full" />
			</div>
			<div className="flex justify-end px-2 text-[16px] sm:text-[20px] font-bold">
				x{timesEarned.toLocaleString()}
			</div>
		</div>
	);
};

export default MedalCard;
