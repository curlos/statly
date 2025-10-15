import { useEffect } from 'react';
import MedalCard from './MedalCard';
import MedalListSkeleton from './MedalListSkeleton';
import { usePageContext } from 'vike-react/usePageContext';
import { useGetFocusMedalsQuery } from '../../../services/resources/documentsFocusRecordsApi';
import { useGetTasksMedalsQuery } from '../../../services/resources/documentsTasksApi';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';

const MedalList = ({ maxHeight, chosenMedal, setChosenMedal, setShowChosenMedalModal }) => {
	const pageContext = usePageContext();
	const { searchParams } = useSearchParamsContext();
	const { type, interval } = pageContext.routeParams;

	// Build query params from URL search params
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const queryParams = {
		interval,
		timezone,
		'projects-ticktick': searchParams.get('projects') || '',
		'projects-todoist': searchParams.get('projects-todoist') || '',
		'categories': searchParams.get('categories') || '',
		'task-id': searchParams.get('task-id') || '',
		'start-date': searchParams.get('start-date') || 'Nov 2, 2020',
		'end-date': searchParams.get('end-date') || getFormattedShortMonthDay(new Date()),
		'task-id-include-focus-records-from-subtasks': searchParams.get('task-id-include-focus-records-from-subtasks') || 'false',
		'search': searchParams.get('search') || '',
		'focus-apps': searchParams.get('focus-apps') || '',
	};

	// Fetch medals data from backend based on type
	const { data: focusMedalsData, isLoading: isLoadingFocusMedals } = useGetFocusMedalsQuery(queryParams, {
		skip: type !== 'focus'
	});

	const { data: tasksMedalsData, isLoading: isLoadingTasksMedals } = useGetTasksMedalsQuery(queryParams, {
		skip: type !== 'tasks'
	});

	const isLoading = type === 'focus' ? isLoadingFocusMedals : isLoadingTasksMedals;
	const medalsData = type === 'focus' ? focusMedalsData : tasksMedalsData;

	// Convert backend response to array format for rendering
	const medalsToUse = medalsData ? Object.entries(medalsData).map(([name, medalData]) => ({
		name,
		intervalsEarned: medalData.intervalsEarned || [],
		interval
	})) : [];

	// Set default chosen medal
	useEffect(() => {
		if (!medalsData || isLoading) {
			return;
		}

		// Only set if chosenMedal is empty
		if (!chosenMedal || Object.keys(chosenMedal).length === 0) {
			// Find first medal that has been earned
			const firstEarnedMedal = medalsToUse.find((medal) => medal.intervalsEarned.length > 0);
			if (firstEarnedMedal) {
				setChosenMedal(firstEarnedMedal);
			}
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
