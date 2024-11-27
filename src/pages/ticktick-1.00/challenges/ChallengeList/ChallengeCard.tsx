import classNames from 'classnames';
import { useThemeContext } from '../../../../contexts/useThemeContext';

const ChallengeCard = ({
	challenge,
	isChosenChallenge,
	setChosenChallenge,
	isIncomplete = false,
	isLoadingFocusOrTasksData,
}) => {
	const { name } = challenge;

	const { chosenColorObj } = useThemeContext();

	return (
		<div
			className={classNames(
				'cursor-pointer',
				isChosenChallenge ? `border-2 ${chosenColorObj.borderColor}` : 'border-2 border-color-gray-200',
				isLoadingFocusOrTasksData ? 'animate-pulse' : isIncomplete && 'opacity-50'
			)}
			onClick={() => setChosenChallenge(challenge)}
		>
			<img src="https://i.imgur.com/6xLKg5k.jpeg" className="w-full" />

			<div
				className={classNames(
					'py-1 px-2 font-semibold',
					isChosenChallenge ? chosenColorObj.bgColor : 'bg-color-gray-200'
				)}
			>
				{name}
			</div>
		</div>
	);
};

export default ChallengeCard;
