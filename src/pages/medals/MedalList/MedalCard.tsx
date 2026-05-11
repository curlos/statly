import classNames from 'classnames';
import LazyImage from '../../../components/LazyImage';
import { useThemeContext } from '../../../contexts/useThemeContext';
import useWindowSize from '../../../hooks/useWindowSize';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';
import type { MedalWithName } from '../../../types/api';

interface MedalCardProps {
	medal: MedalWithName;
	chosenMedal: MedalWithName | null;
	setChosenMedal: (medal: MedalWithName) => void;
	isLoadingFocusOrTasksData: boolean;
	setShowChosenMedalModal: (show: boolean) => void;
	onKeyDown: (medalName: string, e: React.KeyboardEvent) => void;
}

const MedalCard: React.FC<MedalCardProps> = ({
	medal,
	chosenMedal,
	setChosenMedal,
	isLoadingFocusOrTasksData,
	setShowChosenMedalModal,
	onKeyDown,
}) => {

	const { chosenColorObj } = useThemeContext();
	const {
		medalsPageSettings: { selectedMedalCardImage },
	} = useUserSettingsContext();

	const { name, intervalsEarned, interval } = medal;

	const timesEarned = !intervalsEarned ? 0 : intervalsEarned.length;

	const imgSrc = selectedMedalCardImage?.[medal.type] || '';
	const { width } = useWindowSize();

	const isSelected = chosenMedal?.name === name;

	console.log(medal)

	return (
		<button
			type="button"
			role="radio"
			aria-label={`${name} ${interval}, ${timesEarned === 1 ? `earned 1 time` : `earned ${timesEarned} times`}`}
			aria-checked={isSelected}
			tabIndex={isSelected ? 0 : -1}
			onKeyDown={(e) => onKeyDown(name, e)}
			className={classNames(
				'bg-color-gray-600 border-2 cursor-pointer text-left w-full focus:outline-none',
				chosenColorObj.hover.borderColor,
				isSelected ? chosenColorObj.borderColor : 'border-[transparent]',
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
		</button>
	);
};

export default MedalCard;
