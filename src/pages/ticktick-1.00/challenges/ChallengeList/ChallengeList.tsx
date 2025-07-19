import { usePageContext } from 'vike-react/usePageContext';
import { DEFAULT_TOTAL_FOCUS_HOURS_CHALLENGES } from '../../../../utils/constants/focus/focusHoursChallenges.utils';
import { useEffect, useState } from 'react';
import {
	getFocusDurationFromArray,
	getGroupedFocusRecordsByDate,
} from '../../../../utils/focus-apps/focusRecords.utils';
import ChallengeCard from './ChallengeCard';
import { DEFAULT_TOTAL_COMPLETED_TASKS_CHALLENGES } from '../../../../utils/constants/tasks/tasksChallenges.utils';
import ModalAddChallenge from '../ModalAddChallenge';
import { useFilterFocusRecords } from '../../focus-records/useFilterFocusRecords';
import { useFilterCompletedTasks } from '../../completed-tasks/useFilterCompletedTasks';
import { groupTasksByDateStr } from '../../../../utils/focus-apps/tasks.utils';

const ChallengeList = ({ maxHeight, chosenChallenge, setChosenChallenge, setShowChosenChallengeModal }) => {
	const pageContext = usePageContext();

	const { filteredFocusRecords } = useFilterFocusRecords();
	const { filteredDaysWithCompletedTasks } = useFilterCompletedTasks();

	const [focusHoursChallenges, setFocusHoursChallenges] = useState(DEFAULT_TOTAL_FOCUS_HOURS_CHALLENGES);
	const [completedTasksChallenges, setCompletedTasksChallenges] = useState(DEFAULT_TOTAL_COMPLETED_TASKS_CHALLENGES);

	const [showAddChallengeModal, setShowAddChallengeModal] = useState(false);

	const isLoadingFocusOrTasksData = !filteredFocusRecords || !filteredDaysWithCompletedTasks;

	useEffect(() => {
		if (isLoadingFocusOrTasksData) {
			return;
		}

		const focusRecordsGroupedByDate = getGroupedFocusRecordsByDate(filteredFocusRecords);

		const focusDurationByDate = {};

		// Get the focus duration for each day.
		Object.entries(focusRecordsGroupedByDate).forEach(([dateKey, focusRecords]) => {
			focusDurationByDate[dateKey] = getFocusDurationFromArray({ focusRecords });
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

		const filteredCompletedTasksByDay = groupTasksByDateStr(filteredDaysWithCompletedTasks);

		// Convert the object into an array of entries
		const sortedEntries = Object.entries(filteredCompletedTasksByDay).sort(
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
				custom: [],
			};

			const { type } = pageContext.routeParams;

			const newChosenChallenge = allChallenges[type].find((challenge) => challenge.completedDate);

			setChosenChallenge(newChosenChallenge);
		}
	}, [filteredFocusRecords, filteredDaysWithCompletedTasks]);

	const getChallengesToUse = () => {
		const { type } = pageContext.routeParams;

		switch (type) {
			case 'focus':
				return focusHoursChallenges;
			case 'tasks':
				return completedTasksChallenges;
			case 'custom':
				return [
					{
						name: 'Complete JS.Info Part 1, Part 2, and Part 3',
						startDate: 'December 6, 2023',
						deadline: 'December 31, 2023',
						completedDate: 'December 30, 2023',
						rewardName: 'MG 1/100 - Strike Rouge Ootori',
						smallImageSrc: '/mg_strike_rouge_small.jpg',
						fullImageSrc: '/mg_strike_rouge_large.jpg',
					},
					{
						name: 'Complete NeetCode 150',
						startDate: null,
						deadline: null,
						completedDate: null,
						rewardName: 'Perfect Grade 1/60 - Astray Red Frame',
						smallImageSrc: '/mg_strike_rouge_small.jpg',
						fullImageSrc: '/mg_strike_rouge_large.jpg',
					},
				];
		}
	};

	const challengesToUse = getChallengesToUse();

	const completedChallenges = challengesToUse.filter((challenge) => challenge.completedDate);
	const incompleteChallenges = challengesToUse.filter((challenge) => !challenge.completedDate);

	return (
		<div className="overflow-auto gray-scrollbar">
			<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 " style={{ maxHeight }}>
				{completedChallenges.map((challenge) => {
					return (
						<ChallengeCard
							key={challenge.name}
							{...{
								challenge,
								isChosenChallenge: challenge.name === chosenChallenge?.name,
								setChosenChallenge,
								isIncomplete: false,
								isLoadingFocusOrTasksData,
								setShowChosenChallengeModal,
								completedChallenges,
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
								isChosenChallenge: challenge.name === chosenChallenge?.name,
								setChosenChallenge,
								isIncomplete: true,
								isLoadingFocusOrTasksData,
								setShowChosenChallengeModal,
								completedChallenges,
							}}
						/>
					);
				})}

				{/* <AddChallengeCard {...{ setShowAddChallengeModal }} /> */}
			</div>

			<ModalAddChallenge {...{ showAddChallengeModal, setShowAddChallengeModal }} />
		</div>
	);
};

// const AddChallengeCard = ({ setShowAddChallengeModal }) => {
// 	const { chosenColorObj } = useThemeContext();

// 	return (
// 		<div
// 			className={classNames(
// 				'border py-1 px-3 flex items-center gap-1 text-color-gray-50 cursor-pointer',
// 				chosenColorObj.borderColor
// 			)}
// 			onClick={() => setShowAddChallengeModal(true)}
// 		>
// 			<div className="font-bold text-[18px]">Add Challenge</div>
// 			<Icon
// 				name="add"
// 				fill={0}
// 				customClass={classNames('text-color-gray-50 !text-[20px] cursor-pointer', chosenColorObj.textColor)}
// 			/>
// 		</div>
// 	);
// };

export default ChallengeList;
