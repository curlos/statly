import { usePageContext } from 'vike-react/usePageContext';
import { useEffect, useRef } from 'react';
import ChallengeCard from './ChallengeCard';
import ChallengeListSkeleton from './ChallengeListSkeleton';
import type { Challenge } from '../../../types/api';

interface ChallengeListProps {
	maxHeight: string;
	chosenChallenge: Challenge | null;
	setChosenChallenge: React.Dispatch<React.SetStateAction<Challenge | null>>;
	setShowChosenChallengeModal: (show: boolean) => void;
	challengesData: Challenge[] | undefined;
	isLoading: boolean;
}

const ChallengeList: React.FC<ChallengeListProps> = ({
	maxHeight,
	chosenChallenge,
	setChosenChallenge,
	setShowChosenChallengeModal,
	challengesData,
	isLoading
}) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const pageContext = usePageContext();
	const { type } = pageContext.routeParams;

	// Set default chosen challenge - always update when type/filters change
	useEffect(() => {
		if (!challengesData || isLoading) {
			return;
		}

		// Scroll to top of container
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = 0;
		}

		// Find first challenge that has been completed
		const firstCompletedChallenge = challengesData.find((challenge: Challenge) => challenge.completedDate);
		if (firstCompletedChallenge) {
			setChosenChallenge(firstCompletedChallenge);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [challengesData, isLoading, type]);

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

	const completedChallenges = challengesToUse.filter((challenge: Challenge) => challenge.completedDate);
	const incompleteChallenges = challengesToUse.filter((challenge: Challenge) => !challenge.completedDate);
	const allChallenges = [...completedChallenges, ...incompleteChallenges];

	const handleChallengeKeyDown = (challengeName: string, e: React.KeyboardEvent) => {
		if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
		e.preventDefault();
		const currentIndex = allChallenges.findIndex((c) => c.name === challengeName);
		const direction = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
		const nextIndex = (currentIndex + direction + allChallenges.length) % allChallenges.length;
		setChosenChallenge(allChallenges[nextIndex]);
		const radios = scrollContainerRef.current?.querySelectorAll<HTMLElement>('[role="radio"]');
		radios?.[nextIndex]?.focus();
	};

	if (isLoading) {
		return <ChallengeListSkeleton maxHeight={maxHeight} />;
	}

	return (
		<div ref={scrollContainerRef} role="radiogroup" aria-label="Challenges" className="overflow-auto gray-scrollbar">
			<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 p-[2px]" style={{ maxHeight }}>
				{completedChallenges.map((challenge: Challenge) => {
					return (
						<ChallengeCard
							key={challenge.name}
							{...{
								challenge,
								isChosenChallenge: challenge.name === chosenChallenge?.name,
								setChosenChallenge,
								isIncomplete: false,
								isLoading,
								setShowChosenChallengeModal,
								completedChallenges,
								onKeyDown: handleChallengeKeyDown,
							}}
						/>
					);
				})}

				{incompleteChallenges.map((challenge: Challenge) => {
					return (
						<ChallengeCard
							key={challenge.name}
							{...{
								challenge,
								isChosenChallenge: challenge.name === chosenChallenge?.name,
								setChosenChallenge,
								isIncomplete: true,
								isLoading,
								setShowChosenChallengeModal,
								completedChallenges,
								onKeyDown: handleChallengeKeyDown,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default ChallengeList;
