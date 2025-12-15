import { useEffect, useRef } from 'react';
import MedalCard from './MedalCard';
import MedalListSkeleton from './MedalListSkeleton';
import type { MedalWithName, FocusMedalsResponse, TasksMedalsResponse } from '../../../types/api';

interface MedalListProps {
	maxHeight: string;
	chosenMedal: MedalWithName | null;
	setChosenMedal: (medal: MedalWithName) => void;
	setShowChosenMedalModal: (show: boolean) => void;
	medalsData?: FocusMedalsResponse | TasksMedalsResponse;
	isLoading: boolean;
	type: string;
	interval: string;
}

const MedalList: React.FC<MedalListProps> = ({ maxHeight, chosenMedal, setChosenMedal, setShowChosenMedalModal, medalsData, isLoading, type, interval }) => {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// Convert backend response to array format for rendering
	const medalsToUse = medalsData ? Object.entries(medalsData).map(([name, medalData]) => ({
		name,
		intervalsEarned: medalData.intervalsEarned || [],
		interval,
		type: medalData.type
	})) : [];

	// Set default chosen medal - always update when interval/type/filters change
	useEffect(() => {
		if (!medalsData || isLoading) {
			return;
		}

		// Scroll to top of container
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = 0;
		}

		// Find first medal that has been earned
		const firstEarnedMedal = medalsToUse.find((medal) => medal.intervalsEarned.length > 0);
		if (firstEarnedMedal) {
			setChosenMedal(firstEarnedMedal);
		}
	}, [medalsData, isLoading, type, interval]);

	const medalsThatHaveBeenEarned = medalsToUse.filter((medal) => medal.intervalsEarned.length > 0);
	const medalsThatHaveNotBeenEarned = medalsToUse.filter((medal) => medal.intervalsEarned.length === 0);

	if (isLoading) {
		return <MedalListSkeleton maxHeight={maxHeight} />;
	}

	return (
		<div className="col-span-12 sm:col-span-8">
			<div
				ref={scrollContainerRef}
				className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 overflow-auto gray-scrollbar"
				style={{ maxHeight }}
			>
				{medalsThatHaveBeenEarned.map((medal) => {
					return (
						<MedalCard
							key={medal.name}
							{...{
								medal: medal,
								chosenMedal,
								setChosenMedal,
								isLoadingFocusOrTasksData: isLoading,
								setShowChosenMedalModal,
							}}
						/>
					);
				})}

				{medalsThatHaveNotBeenEarned.map((medal) => {
					return (
						<MedalCard
							key={medal.name}
							{...{
								medal: medal,
								chosenMedal,
								setChosenMedal,
								isLoadingFocusOrTasksData: isLoading,
								setShowChosenMedalModal,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default MedalList;
