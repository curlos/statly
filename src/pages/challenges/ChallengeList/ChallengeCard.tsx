import classNames from 'classnames';
import { useThemeContext } from '../../../contexts/useThemeContext';
import useWindowSize from '../../../hooks/useWindowSize';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';
import { useEffect } from 'react';
import { Challenge } from '../../../types/api';

interface ChallengeCardProps {
	challenge: Challenge;
	isChosenChallenge: boolean;
	setChosenChallenge: (challenge: Challenge) => void;
	isIncomplete?: boolean;
	isLoadingFocusOrTasksData: boolean;
	setShowChosenChallengeModal: (show: boolean) => void;
	completedChallenges: Challenge[];
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
	challenge,
	isChosenChallenge,
	setChosenChallenge,
	isIncomplete = false,
	isLoadingFocusOrTasksData,
	setShowChosenChallengeModal,
	completedChallenges,
}) => {
	const { name } = challenge;

	const { chosenColorObj } = useThemeContext();

	const {
		challengesPageSettings: { selectedChallengeCardImage },
	} = useUserSettingsContext();

	const imgSrc =
		challenge.type === 'focus'
			? selectedChallengeCardImage?.focus
			: selectedChallengeCardImage?.tasks;

	const { width } = useWindowSize();

	useEffect(() => {
		if (isChosenChallenge) {
			if (!challenge.completedDate && completedChallenges) {
				const newChosenChallenge = completedChallenges[0];
				setChosenChallenge(newChosenChallenge);
			} else {
				setChosenChallenge(challenge);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isChosenChallenge, challenge, completedChallenges]);

	return (
		<div
			className={classNames(
				'cursor-pointer flex flex-col',
				isChosenChallenge ? `border-2 ${chosenColorObj.borderColor}` : 'border-2 border-color-gray-200',
				isLoadingFocusOrTasksData ? 'animate-pulse' : isIncomplete && 'opacity-50'
			)}
			onClick={() => {
				setChosenChallenge(challenge);

				if (width && width < 768) {
					setShowChosenChallengeModal(true);
				}
			}}
		>
			<div className="flex justify-center">
				<img src={imgSrc} className="max-h-[250px]" />
			</div>

			<div
				className={classNames(
					'flex-1 py-1 px-2 font-semibold',
					isChosenChallenge ? chosenColorObj.bgColor : 'bg-color-gray-200'
				)}
			>
				{name}
			</div>
		</div>
	);
};

export default ChallengeCard;
