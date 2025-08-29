import classNames from 'classnames';
import LazyImage from '../../../../components/LazyImage';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import useWindowSize from '../../../../hooks/useWindowSize';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';
import { usePageContext } from 'vike-react/usePageContext';
import { useEffect } from 'react';

const MedalCard = ({
	medal,
	chosenMedal,
	setChosenMedal,
	isLoadingFocusOrTasksData,
	setShowChosenMedalModal,
	allMedals,
}) => {
	const pageContext = usePageContext();
	const { type, interval } = pageContext.routeParams;

	const { chosenColorObj } = useThemeContext();
	const {
		medalsPageSettings: { selectedMedalCardImage },
	} = useUserSettingsContext();

	const { name, intervalsEarned } = medal;

	const timesEarned = !intervalsEarned ? 0 : intervalsEarned.length;

	const imgSrc = medal.requiredDuration !== undefined ? selectedMedalCardImage?.focus : selectedMedalCardImage?.tasks;

	const { width } = useWindowSize();

	useEffect(() => {
		if (medal.name === chosenMedal.name && medal.interval === chosenMedal.interval) {
			if (medal.intervalsEarned == 0 && allMedals) {
				const newChosenMedal = allMedals[type][interval].find((medal) => {
					const timesEarned = !medal.intervalsEarned || medal.intervalsEarned.length;
					return timesEarned > 0;
				});
				if (newChosenMedal && newChosenMedal !== chosenMedal) {
					setChosenMedal(newChosenMedal);
				}
			} else if (medal !== chosenMedal) {
				setChosenMedal(medal);
			}
		}
	}, [medal, chosenMedal, allMedals, type, interval]);

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
				<LazyImage src={imgSrc} alt="Medal image" />
			</div>
			<div className="flex justify-end px-2 text-[16px] sm:text-[20px] font-bold">
				x{timesEarned.toLocaleString()}
			</div>
		</div>
	);
};

export default MedalCard;
