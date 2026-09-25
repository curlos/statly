import { useEffect, useMemo, useRef, useState } from 'react';
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

// Fixed height (px) of each date row so the virtualized list can calculate which rows are visible.
const ROW_HEIGHT = 28;
// Number of extra rows rendered above and below the visible window so fast scrolling doesn't show blank space.
const OVERSCAN = 10;
const INITIAL_RANGE = { start: 0, end: 50 };

const ChosenMedal: React.FC<ChosenMedalProps> = ({ chosenMedal, maxHeight, chosenMedalRef }) => {
	const { buildUrlWithQueryParams } = useSearchParamsContext();

	const {
		medalsPageSettings: { selectedMedalCardImage },
	} = useUserSettingsContext();

	const pageContext = usePageContext();

	const listRef = useRef<HTMLUListElement>(null);
	const [range, setRange] = useState(INITIAL_RANGE);

	// Sorted once per medal instead of on every scroll re-render.
	const sortedIntervals = useMemo(() => {
		if (!chosenMedal?.intervalsEarned) {
			return [];
		}

		return chosenMedal.intervalsEarned.toSorted((a: string, b: string) => {
			if (chosenMedal.interval !== 'weekly') {
				return new Date(b).getTime() - new Date(a).getTime();
			}
			// If it's weekly, split the strings into two since weekly shows both the start and end period. Grab the start period date and sort it by that.
			const startDateA = a.split(' - ')[0].trim();
			const startDateB = b.split(' - ')[0].trim();

			return new Date(startDateB).getTime() - new Date(startDateA).getTime();
		});
	}, [chosenMedal]);

	useEffect(() => {
		setRange(INITIAL_RANGE);
	}, [chosenMedal]);

	// Only the rows inside (or near) the visible part of the scroll container get rendered. The rest of the list's height is filled with padding above and below.
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const container = e.currentTarget;
		const list = listRef.current;

		if (!list) {
			return;
		}

		const offset = list.getBoundingClientRect().top - container.getBoundingClientRect().top;
		const start = Math.max(0, Math.floor(-offset / ROW_HEIGHT) - OVERSCAN);
		const end = Math.max(start, Math.ceil((container.clientHeight - offset) / ROW_HEIGHT) + OVERSCAN);

		setRange((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
	};

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
			className="ui-theme-plate flex justify-center mt-5 overflow-auto gray-scrollbar"
			style={{ maxHeight }}
			onScroll={handleScroll}
		>
			<div className="w-full">
				<div className="flex justify-center mb-2">
					<img src={imgSrc} alt={`${chosenMedal.name} Medal`} className="max-h-[300px] max-w-full" />
				</div>
				<div>
					<div className="text-[24px] md:text-[26px] font-bold bg-color-gray-200 px-3 sticky">
						{chosenMedal.name}
					</div>
					<div className="mt-2 space-y-1 px-3">
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
								<span className="relative">
									<a
										href="#after-intervals-list"
										className="sr-only focus:fixed focus:bottom-4 focus:right-4 focus:z-50 focus:w-auto focus:h-auto focus:overflow-visible focus:m-0 focus:whitespace-normal focus:[clip:auto] focus:px-2 focus:py-1 focus:bg-white focus:text-black focus:rounded"
										onClick={(e) => {
											e.preventDefault();
											document.getElementById('after-intervals-list')?.focus({ preventScroll: true });
										}}
									>
										Skip list of {timesEarned.toLocaleString()} {(timesEarned === 1 ? getIntervalsEarnedText().slice(0, -1) : getIntervalsEarnedText()).toLowerCase()}
									</a>
								</span>
								<ul
									ref={listRef}
									role="list"
									style={{
										paddingTop: range.start * ROW_HEIGHT,
										// Extra 12px keeps the original bottom spacing (was pb-3).
										paddingBottom: Math.max(0, sortedIntervals.length - range.end) * ROW_HEIGHT + 12,
									}}
								>
									{sortedIntervals.slice(range.start, range.end).map((dateRange: string, index: number) => {
										return (
											<li
												key={dateRange}
												className="list-disc ml-5 h-7 whitespace-nowrap"
												aria-setsize={sortedIntervals.length}
												aria-posinset={range.start + index + 1}
											>
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
								<div id="after-intervals-list" tabIndex={-1} />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenMedal;
