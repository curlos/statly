import { usePageContext } from 'vike-react/usePageContext';
import { useEffect, useRef } from 'react';
import ChallengeCard from './ChallengeCard';
import ChallengeListSkeleton from './ChallengeListSkeleton';
import { useGetFocusChallengesQuery } from '../../../services/resources/focusRecordsApi';
import { useGetTasksChallengesQuery } from '../../../services/resources/tasksApi';
import { useSharedQueryParams } from '../../../hooks/useSharedQueryParams';

const ChallengeList = ({ maxHeight, chosenChallenge, setChosenChallenge, setShowChosenChallengeModal }) => {
	const scrollContainerRef = useRef(null);
	const pageContext = usePageContext();
	const { type } = pageContext.routeParams;

	// Build query params using shared hook
	const { queryParams } = useSharedQueryParams();

	// Fetch challenges data from backend based on type
	const { data: focusChallengesData, isLoading: isLoadingFocusChallenges } = useGetFocusChallengesQuery(queryParams, {
		skip: type !== 'focus'
	});

	const { data: tasksChallengesData, isLoading: isLoadingTasksChallenges } = useGetTasksChallengesQuery(queryParams, {
		skip: type !== 'tasks'
	});

	const isLoadingFocusOrTasksData = type === 'focus' ? isLoadingFocusChallenges : isLoadingTasksChallenges;
	const challengesData = type === 'focus' ? focusChallengesData : tasksChallengesData;

	// Set default chosen challenge - always update when type/filters change
	useEffect(() => {
		if (!challengesData || isLoadingFocusOrTasksData) {
			return;
		}

		// Scroll to top of container
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = 0;
		}

		// Find first challenge that has been completed
		const firstCompletedChallenge = challengesData.find((challenge) => challenge.completedDate);
		if (firstCompletedChallenge) {
			setChosenChallenge(firstCompletedChallenge);
		}
	}, [challengesData, isLoadingFocusOrTasksData, type]);

	const getChallengesToUse = () => {
		const { type } = pageContext.routeParams;

		switch (type) {
			case 'focus':
			case 'tasks':
				return challengesData || [];
			default:
				return [];
		}
	};

	const challengesToUse = getChallengesToUse();

	const completedChallenges = challengesToUse.filter((challenge) => challenge.completedDate);
	const incompleteChallenges = challengesToUse.filter((challenge) => !challenge.completedDate);

	if (isLoadingFocusOrTasksData) {
		return <ChallengeListSkeleton maxHeight={maxHeight} />;
	}

	return (
		<div ref={scrollContainerRef} className="overflow-auto gray-scrollbar">
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
			</div>
		</div>
	);
};

export default ChallengeList;
