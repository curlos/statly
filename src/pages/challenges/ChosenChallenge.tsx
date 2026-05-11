import { usePageContext } from 'vike-react/usePageContext';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { getFormattedShortMonthDay } from '../../utils/date.utils';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { Challenge } from '../../types/api';
import { useGetOverviewStatsQuery } from '../../services/resources/statsApi';

interface ChosenChallengeProps {
	chosenChallenge: Challenge | null;
	maxHeight: string;
	chosenChallengeRef: React.RefObject<HTMLDivElement>;
}

const ChosenChallenge: React.FC<ChosenChallengeProps> = ({ chosenChallenge, maxHeight, chosenChallengeRef }) => {
	const { data: overviewStats } = useGetOverviewStatsQuery({
		skipTodayStats: true,
		includeFirstData: true
	});

	const {
		challengesPageSettings: { selectedChallengeCardImage },
	} = useUserSettingsContext();

	const { updateQueryParams } = useSearchParamsContext();
	const pageContext = usePageContext();

	if (!chosenChallenge || Object.keys(chosenChallenge).length === 0) {
		return null;
	}

	const { name, completedDate } = chosenChallenge;

	const imgSrc =
		chosenChallenge.type === 'focus'
			? selectedChallengeCardImage?.focus
			: selectedChallengeCardImage?.tasks;



	const handleGoToCompletedDate = (completedDate: Challenge['completedDate']) => {
		const nonDateQueryParams = { ...pageContext.urlParsed.search };
		let startDate = pageContext.urlParsed.search['start-date']

		if (!startDate) {
			startDate = chosenChallenge.type === 'focus' ? (overviewStats?.firstFocusRecordDate || 'Jan 1, 100') : (overviewStats?.firstCompletedTaskDate || 'Jan 1, 100')
		}


		delete nonDateQueryParams['start-date'];
		delete nonDateQueryParams['end-date'];

		const isForFocusChallenges = pageContext.routeParams.type === 'focus';

		updateQueryParams(
			{
				...nonDateQueryParams,
				'start-date': getFormattedShortMonthDay(new Date(startDate)),
				'end-date': getFormattedShortMonthDay(new Date(completedDate || startDate))
			},
			`/${isForFocusChallenges ? 'focus-records' : 'completed-tasks'}`
		);
	};

	return (
		<div
			ref={chosenChallengeRef}
			className="mt-5 overflow-auto gray-scrollbar"
			style={{ maxHeight }}
		>
			<div>
				<div className="flex justify-center mb-2">
					<img src={imgSrc} alt={`${name} challenge image`} className="max-h-[300px]" />
				</div>
				<div>
					<div className="text-[20px] md:text-[24px] font-bold bg-color-gray-200 px-2 sticky">{name}</div>
					<div className="mt-2 space-y-1">
						<div className="text-[16px] md:text-[18px]">
							<span className="font-bold">Description: </span>
							<span className="text-color-gray-50">
								{name} in total
							</span>
						</div>
						<div className="text-[16px] md:text-[18px]">
							<span className="font-bold">Completion Date: </span>
							<button
								type="button"
								className="text-color-gray-50 cursor-pointer hover:underline bg-transparent border-0 p-0"
								onClick={() => handleGoToCompletedDate(completedDate)}
							>
								{completedDate ? completedDate : 'N/A'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenChallenge;
