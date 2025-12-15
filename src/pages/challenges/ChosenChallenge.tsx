import { usePageContext } from 'vike-react/usePageContext';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { getFormattedShortMonthDay } from '../../utils/date.utils';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { Challenge } from '../../types/api';

interface ChosenChallengeProps {
	chosenChallenge: Challenge | null;
	maxHeight: string;
	chosenChallengeRef: React.RefObject<HTMLDivElement>;
}

const ChosenChallenge: React.FC<ChosenChallengeProps> = ({ chosenChallenge, maxHeight, chosenChallengeRef }) => {
	const {
		challengesPageSettings: { selectedChallengeCardImage },
	} = useUserSettingsContext();

	const { updateQueryParams } = useSearchParamsContext();
	const pageContext = usePageContext();

	if (!chosenChallenge || Object.keys(chosenChallenge).length === 0) {
		return null;
	}

	console.log(chosenChallenge)

	const { name, completedDate } = chosenChallenge;

	const imgSrc =
		chosenChallenge.type === 'focus'
			? selectedChallengeCardImage?.focus
			: selectedChallengeCardImage?.tasks;



	const handleGoToCompletedDate = (completedDate: Challenge['completedDate']) => {
		const nonDateQueryParams = { ...pageContext.urlParsed.search };
		const startDate = pageContext.urlParsed.search['start-date'] || 'Jan 1, 1900'

		delete nonDateQueryParams['start-date'];
		delete nonDateQueryParams['end-date'];

		const isForFocusChallenges = pageContext.routeParams.type === 'focus';

		updateQueryParams(
			{
				...nonDateQueryParams,
				'start-date': getFormattedShortMonthDay(new Date(startDate)),
				'end-date': getFormattedShortMonthDay(new Date(completedDate || startDate)),
			},
			`/${isForFocusChallenges ? 'focus-records' : 'completed-tasks'}`
		);
	};

	return (
		<div
			ref={chosenChallengeRef}
			className="flex justify-center mt-5 overflow-auto gray-scrollbar"
			style={{ maxHeight }}
		>
			<div>
				<div className="flex justify-center mb-2">
					<img src={imgSrc} />
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
							<span
								className="text-color-gray-50 cursor-pointer hover:underline"
								onClick={() => handleGoToCompletedDate(completedDate)}
							>
								{completedDate ? completedDate : 'N/A'}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenChallenge;
