import classNames from 'classnames';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import useWindowSize from '../../../../hooks/useWindowSize';

const ChallengeCard = ({
	challenge,
	isChosenChallenge,
	setChosenChallenge,
	isIncomplete = false,
	isLoadingFocusOrTasksData,
	setShowChosenChallengeModal,
}) => {
	const { name } = challenge;

	const { chosenColorObj } = useThemeContext();

	const imgSrc =
		challenge.requiredDuration !== undefined
			? 'https://i.imgur.com/6xLKg5k.jpeg'
			: 'https://i.imgur.com/x084PtQ.png';

	const { width } = useWindowSize();

	return (
		<div
			className={classNames(
				'cursor-pointer flex flex-col',
				isChosenChallenge ? `border-2 ${chosenColorObj.borderColor}` : 'border-2 border-color-gray-200',
				isLoadingFocusOrTasksData ? 'animate-pulse' : isIncomplete && 'opacity-50'
			)}
			onClick={() => {
				setChosenChallenge(challenge);

				if (width && width < 576) {
					setShowChosenChallengeModal(true);
				}
			}}
		>
			<img src={imgSrc} className="w-full" />

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
