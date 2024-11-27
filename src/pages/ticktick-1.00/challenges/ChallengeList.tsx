import { usePageContext } from 'vike-react/usePageContext';
import { DEFAULT_TOTAL_FOCUS_HOURS_CHALLENGES } from '../../../utils/constants/focus/focusHoursChallenges.utils';
import { useEffect, useState } from 'react';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { getFocusDurationFromArray } from '../../../utils/focus-apps/focusRecords.utils';
import classNames from 'classnames';
import { useThemeContext } from '../../../contexts/useThemeContext';

const ChallengeList = ({ maxHeight, chosenChallenge, setChosenChallenge, setShowChosenMedalModal }) => {
	const pageContext = usePageContext();
	const { focusRecordsGroupedByDate, allCompletedTasksGroupedByDate } = useStatsContext();

	const [focusHoursChallenges, setFocusHoursChallenges] = useState(DEFAULT_TOTAL_FOCUS_HOURS_CHALLENGES);

	const isLoadingFocusOrTasksData = !focusRecordsGroupedByDate || !allCompletedTasksGroupedByDate;

	useEffect(() => {
		if (isLoadingFocusOrTasksData) {
			return;
		}

		const newFocusDurationByDate = {};

		// Get the focus duration for each day.
		Object.entries(focusRecordsGroupedByDate).forEach(([dateKey, focusRecords]) => {
			newFocusDurationByDate[dateKey] = getFocusDurationFromArray(focusRecords);
		});

		const newFocusHoursChallenges = JSON.parse(JSON.stringify(DEFAULT_TOTAL_FOCUS_HOURS_CHALLENGES));

		let totalFocusHours = 0;

		Object.entries(newFocusDurationByDate).forEach(([dateKey, focusHoursForDay]) => {
			totalFocusHours += focusHoursForDay;

			newFocusHoursChallenges.forEach((challenge) => {
				if (!challenge.completedDate && totalFocusHours >= challenge.requiredDuration) {
					challenge.completedDate = dateKey;
				}
			});
		});

		setFocusHoursChallenges(newFocusHoursChallenges);
	}, [focusRecordsGroupedByDate, allCompletedTasksGroupedByDate]);

	const completedChallenges = focusHoursChallenges.filter((challenge) => challenge.completedDate);
	const incompleteChallenges = focusHoursChallenges.filter((challenge) => !challenge.completedDate);

	return (
		<div className="col-span-12 sm:col-span-8 overflow-auto gray-scrollbar">
			<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2 " style={{ maxHeight }}>
				{completedChallenges.map((challenge) => {
					return (
						<ChallengeCard
							{...{
								challenge,
								isChosenChallenge: challenge.name === chosenChallenge.name,
								setChosenChallenge,
								isIncomplete: false,
								isLoadingFocusOrTasksData,
							}}
						/>
					);
				})}

				{incompleteChallenges.map((challenge) => {
					return (
						<ChallengeCard
							{...{
								challenge,
								isChosenChallenge: challenge.name === chosenChallenge.name,
								setChosenChallenge,
								isIncomplete: true,
								isLoadingFocusOrTasksData,
							}}
						/>
					);
				})}
			</div>

			<div></div>
		</div>
	);
};

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

			<div className={classNames('border-t py-1 px-2 font-semibold', chosenColorObj.borderColor)}>{name}</div>
		</div>
	);
};

export default ChallengeList;
