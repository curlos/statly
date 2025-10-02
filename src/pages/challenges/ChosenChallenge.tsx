import { usePageContext } from 'vike-react/usePageContext';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { getFormattedShortMonthDay } from '../../utils/date.utils';
import { parseDateRange } from '../../utils/focus.utils';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';

const ChosenChallenge = ({ chosenChallenge, maxHeight, chosenChallengeRef }) => {
	if (!chosenChallenge || Object.keys(chosenChallenge).length === 0) {
		return null;
	}

	const {
		challengesPageSettings: { selectedChallengeCardImage },
	} = useUserSettingsContext();

	const { updateQueryParams } = useSearchParamsContext();

	const { name, completedDate, startDate, deadline, fullImageSrc, rewardName } = chosenChallenge;

	let imgSrc =
		chosenChallenge.requiredDuration !== undefined
			? selectedChallengeCardImage?.focus
			: selectedChallengeCardImage?.tasks;

	if (fullImageSrc) {
		imgSrc = fullImageSrc;
	}

	const isCustomChallenge = chosenChallenge.fullImageSrc !== undefined;

	const pageContext = usePageContext();

	const handleGoToSelectedDateRange = (dateRange) => {
		const nonDateQueryParams = pageContext.urlParsed.search;
		delete nonDateQueryParams['start-date'];
		delete nonDateQueryParams['end-date'];

		const isForFocusChallenges = pageContext.routeParams.type === 'focus';

		const parseDateRangeObj = parseDateRange('day', dateRange);
		const { endDate } = parseDateRangeObj;

		updateQueryParams(
			{
				'start-date': getFormattedShortMonthDay(new Date('Nov 2, 2020')),
				'end-date': getFormattedShortMonthDay(endDate),
				...nonDateQueryParams,
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
								{name} {isCustomChallenge ? '' : 'in total'}
							</span>
						</div>
						{rewardName && (
							<div className="text-[16px] md:text-[18px]">
								<span className="font-bold">Reward: </span>
								<span className="text-color-gray-50">{rewardName ? rewardName : 'N/A'}</span>
							</div>
						)}
						{startDate && (
							<div className="text-[16px] md:text-[18px]">
								<span className="font-bold">Start Date: </span>
								<span className="text-color-gray-50">{startDate ? startDate : 'N/A'}</span>
							</div>
						)}
						{deadline && (
							<div className="text-[16px] md:text-[18px]">
								<span className="font-bold">Deadline: </span>
								<span className="text-color-gray-50">{deadline ? deadline : 'N/A'}</span>
							</div>
						)}
						<div className="text-[16px] md:text-[18px]">
							<span className="font-bold">Completion Date: </span>
							<span
								className="text-color-gray-50 cursor-pointer hover:underline"
								onClick={() => handleGoToSelectedDateRange(completedDate)}
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
