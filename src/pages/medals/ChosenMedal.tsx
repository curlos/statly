import { usePageContext } from 'vike-react/usePageContext';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { getFormattedShortMonthDay, parseDateRange } from '../../utils/date.utils';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import type { MedalWithName } from '../../types/api';

interface ChosenMedalProps {
	chosenMedal: MedalWithName | null;
	maxHeight: string | number;
	chosenMedalRef: React.RefObject<HTMLDivElement>;
}

const ChosenMedal: React.FC<ChosenMedalProps> = ({ chosenMedal, maxHeight, chosenMedalRef }) => {
	const { buildUrlWithQueryParams } = useSearchParamsContext();

	const {
		medalsPageSettings: { selectedMedalCardImage },
	} = useUserSettingsContext();

	const pageContext = usePageContext();

	if (!chosenMedal || Object.keys(chosenMedal).length === 0) {
		return null;
	}

	const { name, intervalsEarned, interval } = chosenMedal;

	const timesEarned = !intervalsEarned ? 0 : intervalsEarned.length;

	const getIntervalText = () => {
		switch (interval) {
			case 'daily':
				return 'day';
			case 'weekly':
				return 'week';
			case 'monthly':
				return 'month';
			case 'yearly':
				return 'year';
			default:
				return 'day';
		}
	};

	const getIntervalsEarnedText = () => {
		switch (interval) {
			case 'daily':
				return 'Days';
			case 'weekly':
				return 'Weeks';
			case 'monthly':
				return 'Months';
			case 'yearly':
				return 'Years';
			default:
				return 'Days';
		}
	};

	const imgSrc = selectedMedalCardImage?.[chosenMedal.type]

	const getDateRangeHref = (dateRange: string) => {
		const nonDateQueryParams = { ...pageContext.urlParsed.search };
		delete nonDateQueryParams['start-date'];
		delete nonDateQueryParams['end-date'];

		const isForFocusMedals = pageContext.routeParams.type === 'focus';

		const { startDate, endDate } = parseDateRange(getIntervalText(), dateRange);

		return buildUrlWithQueryParams(
			{
				...nonDateQueryParams,
				'start-date': getFormattedShortMonthDay(startDate),
				'end-date': getFormattedShortMonthDay(endDate),
				'year-agnostic': ''
			},
			`/${isForFocusMedals ? 'focus-records' : 'completed-tasks'}`
		);
	};

	return (
		<div
			ref={chosenMedalRef}
			className="flex justify-center mt-5 overflow-auto gray-scrollbar"
			style={{ maxHeight }}
		>
			<div>
				<div className="flex justify-center mb-2">
					<img src={imgSrc} alt={`${chosenMedal.name} Medal`} className="max-h-[300px] max-w-full" />
				</div>
				<div>
					<div className="text-[24px] md:text-[26px] font-bold bg-color-gray-200 px-2 sticky">
						{chosenMedal.name}
					</div>
					<div className="mt-2 space-y-1">
						<div className="text-[18px]">
							<span className="font-bold">Description: </span>
							{name} in a {getIntervalText()}
						</div>
						<div className="text-[18px]">
							<span className="font-bold">Times Earned: </span>
							{timesEarned.toLocaleString()}
						</div>
						{intervalsEarned && intervalsEarned.length > 0 && (
							<div className="text-[18px]">
								<span className="font-bold underline">{getIntervalsEarnedText()} Earned: </span>
								<a
									href="#after-intervals-list"
									className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:px-2 focus:py-1 focus:bg-white focus:text-black focus:rounded"
								>
									Skip list of {timesEarned} {getIntervalsEarnedText().toLowerCase()}
								</a>
								<ul role="list" className="pb-3">
									{intervalsEarned
										.toSorted((a: string, b: string) => {
											if (chosenMedal.interval !== 'weekly') {
												return new Date(b).getTime() - new Date(a).getTime();
											}
											// If it's weekly, split the strings into two since weekly shows both the start and end period. Grab the start period date and sort it by that.
											const startDateA = a.split(' - ')[0].trim();
											const startDateB = b.split(' - ')[0].trim();

											return new Date(startDateB).getTime() - new Date(startDateA).getTime();
										})
										?.map((dateRange: string) => {
											return (
												<li key={dateRange} className="list-disc ml-5">
													<a
														href={getDateRangeHref(dateRange)}
														className="hover:underline"
														aria-label={`View ${chosenMedal.type === 'tasks' ? 'completed tasks' : 'focus records'} for ${dateRange}`}
													>
														{dateRange}
													</a>
												</li>
											);
										})}
								</ul>
								<div id="after-intervals-list" />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenMedal;
