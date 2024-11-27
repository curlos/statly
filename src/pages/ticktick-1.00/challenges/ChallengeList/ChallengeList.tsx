import { usePageContext } from 'vike-react/usePageContext';
import { DEFAULT_TOTAL_FOCUS_HOURS_CHALLENGES } from '../../../../utils/constants/focus/focusHoursChallenges.utils';
import { useEffect, useState } from 'react';
import { useStatsContext } from '../../../../contexts/useStatsContext';
import { getFocusDurationFromArray } from '../../../../utils/focus-apps/focusRecords.utils';
import ChallengeCard from './ChallengeCard';
import { DEFAULT_TOTAL_COMPLETED_TASKS_CHALLENGES } from '../../../../utils/constants/tasks/tasksChallenges.utils';

const ChallengeList = ({ maxHeight, chosenChallenge, setChosenChallenge, setShowChosenChallengeModal }) => {
	const pageContext = usePageContext();
	const { focusRecordsGroupedByDate, allCompletedTasksGroupedByDate } = useStatsContext();

	const [focusHoursChallenges, setFocusHoursChallenges] = useState(DEFAULT_TOTAL_FOCUS_HOURS_CHALLENGES);
	const [completedTasksChallenges, setCompletedTasksChallenges] = useState(DEFAULT_TOTAL_COMPLETED_TASKS_CHALLENGES);

	const isLoadingFocusOrTasksData = !focusRecordsGroupedByDate || !allCompletedTasksGroupedByDate;

	useEffect(() => {
		if (isLoadingFocusOrTasksData) {
			return;
		}

		const focusDurationByDate = {};

		// Get the focus duration for each day.
		Object.entries(focusRecordsGroupedByDate).forEach(([dateKey, focusRecords]) => {
			focusDurationByDate[dateKey] = getFocusDurationFromArray(focusRecords);
		});

		const newFocusHoursChallenges = JSON.parse(JSON.stringify(DEFAULT_TOTAL_FOCUS_HOURS_CHALLENGES));
		const newCompletedTasksChallenges = JSON.parse(JSON.stringify(DEFAULT_TOTAL_COMPLETED_TASKS_CHALLENGES));

		// Focus
		let totalFocusHours = 0;

		Object.entries(focusDurationByDate).forEach(([dateKey, focusHoursForDay]) => {
			totalFocusHours += focusHoursForDay;

			newFocusHoursChallenges.forEach((challenge) => {
				if (!challenge.completedDate && totalFocusHours >= challenge.requiredDuration) {
					challenge.completedDate = dateKey;
				}
			});
		});

		setFocusHoursChallenges(newFocusHoursChallenges);

		// Tasks
		let totalCompletedTasks = 0;

		// Convert the object into an array of entries
		const sortedEntries = Object.entries(allCompletedTasksGroupedByDate).sort(
			(a, b) => new Date(a[0]) - new Date(b[0])
		);

		// Convert the array of entries back into an object
		const sortedAllCompletedTasksGroupedByDate = Object.fromEntries(sortedEntries);

		Object.entries(sortedAllCompletedTasksGroupedByDate).forEach(([dateKey, completedTasksForDay]) => {
			totalCompletedTasks += completedTasksForDay.length;

			newCompletedTasksChallenges.forEach((challenge) => {
				if (!challenge.completedDate && totalCompletedTasks >= challenge.requiredCompletedTasks) {
					challenge.completedDate = dateKey;
				}
			});
		});

		setCompletedTasksChallenges(newCompletedTasksChallenges);

		if (!chosenChallenge || Object.keys(chosenChallenge).length === 0) {
			const allChallenges = {
				focus: newFocusHoursChallenges,
				tasks: newCompletedTasksChallenges,
			};

			const { type } = pageContext.routeParams;

			const newChosenChallenge = allChallenges[type].find((challenge) => challenge.completedDate);

			setChosenChallenge(newChosenChallenge);
		}
	}, [focusRecordsGroupedByDate, allCompletedTasksGroupedByDate]);

	const getChallengesToUse = () => {
		const { type } = pageContext.routeParams;
		const challengesToUse = type === 'focus' ? focusHoursChallenges : completedTasksChallenges;
		return challengesToUse;
	};

	const challengesToUse = getChallengesToUse();

	const completedChallenges = challengesToUse.filter((challenge) => challenge.completedDate);
	const incompleteChallenges = challengesToUse.filter((challenge) => !challenge.completedDate);

	return (
		<div className="overflow-auto gray-scrollbar">
			<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-2 " style={{ maxHeight }}>
				{completedChallenges.map((challenge) => {
					return (
						<ChallengeCard
							key={challenge.name}
							{...{
								challenge,
								isChosenChallenge: challenge.name === chosenChallenge.name,
								setChosenChallenge,
								isIncomplete: false,
								isLoadingFocusOrTasksData,
								setShowChosenChallengeModal,
							}}
						/>
					);
				})}

				{incompleteChallenges.map((challenge) => {
					return (
						<ChallengeCard
							key={challenge.name}
							{...{
								challenge,
								isChosenChallenge: challenge.name === chosenChallenge.name,
								setChosenChallenge,
								isIncomplete: true,
								isLoadingFocusOrTasksData,
								setShowChosenChallengeModal,
							}}
						/>
					);
				})}
			</div>

			<div></div>
		</div>
	);
};

export default ChallengeList;
