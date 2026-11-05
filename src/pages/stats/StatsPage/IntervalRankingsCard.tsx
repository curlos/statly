import { useEffect, useState } from 'react';
import classNames from 'classnames';
import Icon from '../../../components/Icon';
import Modal from '../../../components/Modal/Modal';
import Pagination from '../../../components/Pagination';
import Spinner from '../../../components/Loaders/Spinner';
import { useGetIntervalRankingsQuery } from '../../../services/resources/statsApi';
import { useStatsQueryParams } from '../../../hooks/useStatsQueryParams';
import { useApplyDefaultDateRangeContext } from '../../../contexts/useApplyDefaultDateRangeContext';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { getFormattedDuration } from '../../../utils/helpers.utils';
import { formatRankingDate, getRankingDateRange, RankingInterval } from '../../../utils/intervalRankings.utils';
import type { IntervalRankingItem } from '../../../types/api';
import GeneralSelectButtonAndDropdown from './GeneralSelectButtonAndDropdown';

type RankingType = 'tasks' | 'focus';

interface RankingsContentProps {
	type: RankingType;
	fromModal: boolean;
	initialInterval: string;
	initialSort: string;
	onIntervalChange?: (interval: string) => void;
	onSortChange?: (sort: string) => void;
	onExpand?: () => void;
	onClose?: () => void;
}

const ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_MODAL = 25;
const intervalOptions = ['Day', 'Week', 'Month', 'Year'];
const sortOptions = ['Most → Least', 'Least → Most'];

const pluralize = (count: number, word: string) => `${count.toLocaleString()} ${word}${count === 1 ? '' : 's'}`;

// Header, ranked list, and pagination; rendered once in the card and again (bigger) in the modal.
const RankingsContent = ({
	type,
	fromModal,
	initialInterval,
	initialSort,
	onIntervalChange,
	onSortChange,
	onExpand,
	onClose,
}: RankingsContentProps) => {
	const [selectedInterval, setSelectedInterval] = useState(initialInterval);
	const [selectedSort, setSelectedSort] = useState(initialSort);
	const [currentPage, setCurrentPage] = useState(1);
	const interval = selectedInterval.toLowerCase() as RankingInterval;
	const limit = fromModal ? ITEMS_PER_PAGE_MODAL : ITEMS_PER_PAGE;
	const headingId = `interval-rankings-${type}${fromModal ? '-modal' : ''}-heading`;

	const { hover, textColor } = useThemeContext().chosenColorObj;
	const { buildUrlWithQueryParams } = useSearchParamsContext();
	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();
	const queryParams = useStatsQueryParams();

	// Go back to the first page when the sidebar filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [queryParams]);

	const { currentData, isLoading, isFetching } = useGetIntervalRankingsQuery(
		{
			...queryParams,
			type,
			interval,
			sort: selectedSort === 'Least → Most' ? 'least' : 'most',
			page: currentPage,
			limit,
		},
		{ skip: shouldSkipQuery }
	);
	const rankings = currentData?.rankings || [];
	const totalPages = currentData?.totalPages || 0;

	// Links to the focus records or completed tasks page filtered to this interval.
	const getRankingHref = (ranking: IntervalRankingItem) => {
		const { startDate, endDate } = getRankingDateRange(ranking.date, interval);
		return buildUrlWithQueryParams(
			{
				'start-date': getFormattedShortMonthDay(startDate),
				'end-date': getFormattedShortMonthDay(endDate),
				'year-agnostic': '',
				page: '',
			},
			type === 'focus' ? '/focus-records' : '/completed-tasks'
		);
	};

	const getValueText = (ranking: IntervalRankingItem) =>
		type === 'focus'
			? `${getFormattedDuration(ranking.duration || 0, false)} · ${pluralize(ranking.count, 'focus record')}`
			: pluralize(ranking.count, 'completed task');

	const iconButtonClass = classNames('text-color-gray-50 !text-[20px] rounded-2xl p-[6px]', hover.textColor);

	return (
		<>
			<div className="flex justify-between items-center gap-2 mb-3">
				<div className="flex items-center gap-2 min-w-0">
					<h2 id={headingId} className="font-bold text-[16px]">
						{selectedInterval}s by {type === 'focus' ? 'Focus Time' : 'Completed Tasks'}
					</h2>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<div className="flex items-center gap-1 shrink-0">
					<GeneralSelectButtonAndDropdown
						selected={selectedSort}
						setSelected={(value) => {
							setSelectedSort(value);
							setCurrentPage(1);
							onSortChange?.(value);
						}}
						selectedOptions={sortOptions}
						align="right"
					/>
					<GeneralSelectButtonAndDropdown
						selected={selectedInterval}
						setSelected={(value) => {
							setSelectedInterval(value);
							setCurrentPage(1);
							onIntervalChange?.(value);
						}}
						selectedOptions={intervalOptions}
						align="right"
					/>
					{onExpand && (
						<button
							type="button"
							aria-label="Open bigger view"
							className="bg-transparent border-0 p-0 cursor-pointer"
							onClick={onExpand}
						>
							<Icon name="open_in_full" fill={0} customClass={iconButtonClass} />
						</button>
					)}
					{onClose && (
						<button
							type="button"
							aria-label="Close"
							className="bg-transparent border-0 p-0 cursor-pointer"
							onClick={onClose}
						>
							<Icon name="close" fill={0} customClass={iconButtonClass} />
						</button>
					)}
				</div>
			</div>

			<ul
				aria-label={`${selectedInterval}s ranked by ${type === 'focus' ? 'focus time' : 'completed tasks'}`}
				className={classNames(
					'flex-1 min-h-0 space-y-3 pr-2 list-none p-0 m-0',
					fromModal ? 'overflow-y-scroll always-visible-scrollbar' : 'overflow-auto gray-scrollbar'
				)}
			>
				{rankings.length === 0 ? (
					<li className="text-center text-color-gray-25 py-8">{isFetching ? '' : 'No data found'}</li>
				) : (
					rankings.map((ranking) => (
						<li key={ranking.date}>
							<a
								href={getRankingHref(ranking)}
								aria-label={`Rank ${ranking.rank}: ${getValueText(ranking)}, ${formatRankingDate(ranking.date, interval)}`}
								className="block p-4 rounded-lg bg-color-gray-200 hover:brightness-125"
							>
								<div className="flex items-center gap-2">
									<span className="text-color-gray-25 font-medium">{ranking.rank}.</span>
									<span className="font-semibold">{getValueText(ranking)}</span>
									<Icon name={type === 'focus' ? 'timer' : 'check_circle'} customClass={textColor} />
								</div>
								<div className="text-sm text-color-gray-25 mt-1 ml-8">
									{formatRankingDate(ranking.date, interval)}
								</div>
							</a>
						</li>
					))
				)}
			</ul>

			{totalPages > 1 && (
				<div className="flex justify-center mt-3">
					<Pagination
						total={totalPages}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
						compactView={true}
					/>
				</div>
			)}
		</>
	);
};

// Ranks days/weeks/months/years by completed tasks or focus time, with a bigger modal view.
const IntervalRankingsCard = ({
	type,
	heightClassName = 'h-[380px]',
}: {
	type: RankingType;
	heightClassName?: string;
}) => {
	const [cardInterval, setCardInterval] = useState('Day');
	const [cardSort, setCardSort] = useState(sortOptions[0]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<section
				className={classNames(
					'bg-color-gray-600 p-3 rounded-lg flex flex-col text-[12px] sm:text-[14px] md:text-[16px]',
					heightClassName
				)}
				aria-labelledby={`interval-rankings-${type}-heading`}
			>
				<RankingsContent
					type={type}
					fromModal={false}
					initialInterval={cardInterval}
					initialSort={cardSort}
					onIntervalChange={setCardInterval}
					onSortChange={setCardSort}
					onExpand={() => setIsModalOpen(true)}
				/>
			</section>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				positionClasses="top-center"
				customClasses="!w-[1000px]"
				ariaLabelledBy={`interval-rankings-${type}-modal-heading`}
			>
				<div className="ui-theme-bare rounded-xl shadow-lg bg-color-gray-600 p-2">
					<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[80vh] text-[14px] md:text-[16px]">
						<RankingsContent
							type={type}
							fromModal={true}
							initialInterval={cardInterval}
							initialSort={cardSort}
							onClose={() => setIsModalOpen(false)}
						/>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default IntervalRankingsCard;
