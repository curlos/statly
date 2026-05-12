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

	const { buildUrlWithQueryParams } = useSearchParamsContext();
	const pageContext = usePageContext();

	if (!chosenChallenge || Object.keys(chosenChallenge).length === 0) {
		return null;
	}

	const { name, completedDate } = chosenChallenge;

	const imgSrc =
		chosenChallenge.type === 'focus'
			? selectedChallengeCardImage?.focus
			: selectedChallengeCardImage?.tasks;

	const getCompletedDateHref = () => {
		if (!completedDate) return undefined;

		const nonDateQueryParams = { ...pageContext.urlParsed.search };
		let startDate = pageContext.urlParsed.search['start-date'];

		if (!startDate) {
			startDate = chosenChallenge.type === 'focus'
				? (overviewStats?.firstFocusRecordDate || 'Jan 1, 100')
				: (overviewStats?.firstCompletedTaskDate || 'Jan 1, 100');
		}

		delete nonDateQueryParams['start-date'];
		delete nonDateQueryParams['end-date'];

		const isForFocusChallenges = pageContext.routeParams.type === 'focus';

		return buildUrlWithQueryParams(
			{
				...nonDateQueryParams,
				'start-date': getFormattedShortMonthDay(new Date(startDate)),
				'end-date': getFormattedShortMonthDay(new Date(completedDate))
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
						<div className="text-[16px] md:text-[18px] pb-2">
							<span className="font-bold">Completion Date: </span>
							{completedDate ? (
								<a
									href={getCompletedDateHref()}
									className="text-color-gray-50 hover:underline"
									aria-label={`View ${chosenChallenge.type === 'focus' ? 'focus records' : 'completed tasks'} for ${completedDate}`}
								>
									{completedDate}
								</a>
							) : (
								<span className="text-color-gray-50">N/A</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenChallenge;
