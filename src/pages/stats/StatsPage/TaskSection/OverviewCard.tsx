import classNames from 'classnames';
import { useMemo } from 'react';
import Icon from '../../../../components/Icon';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useGetTasksStatsQuery } from '../../../../services/resources/statsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import { useStatsDateRange } from '../../../../hooks/useStatsDateRange';
import GeneralSelectButtonAndDropdown from '../../StatsPage/GeneralSelectButtonAndDropdown';
import Spinner from '../../../../components/Loaders/Spinner';
import { getFormattedShortMonthDay } from '../../../../utils/date.utils';
import { useApplyDefaultDateRangeContext } from '../../../../contexts/useApplyDefaultDateRangeContext';

const OverviewCard = () => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];

	// Use custom hook for date range management
	const {
		selectedInterval,
		setSelectedInterval,
		apiStartDate,
		apiEndDate,
		setIsModalPickDateRangeOpen,
		renderDateRangePicker,
		renderCustomDateModal,
	} = useStatsDateRange({
		initialInterval: 'Day',
		initialDates: [new Date()],
	});

	// Helper function to get previous interval date range
	const getPrevIntervalDateRange = () => {
		const start = new Date(apiStartDate ?? '');
		const end = new Date(apiEndDate ?? '');

		switch (selectedInterval) {
			case 'Day':
				start.setDate(start.getDate() - 1);
				end.setDate(end.getDate() - 1);
				break;
			case 'Week':
				start.setDate(start.getDate() - 7);
				end.setDate(end.getDate() - 7);
				break;
			case 'Month': {
				start.setMonth(start.getMonth() - 1);
				// Set end to last day of previous month
				// Day 0 of current month = last day of previous month
				const endYear = end.getFullYear();
				const endMonth = end.getMonth();
				const lastDayOfPrevMonth = new Date(endYear, endMonth, 0);
				end.setTime(lastDayOfPrevMonth.getTime());
				break;
			}
			case 'Year':
				start.setFullYear(start.getFullYear() - 1);
				end.setFullYear(end.getFullYear() - 1);
				break;
			default:
				return { startDate: undefined, endDate: undefined };
		}

		return {
			startDate: getFormattedShortMonthDay(start),
			endDate: getFormattedShortMonthDay(end),
		};
	};

	const getPrevIntervalName = () => {
		switch (selectedInterval) {
			case 'Day':
				return 'yesterday';
			case 'Week':
				return 'last week';
			case 'Month':
				return 'last month';
			case 'Year':
				return 'last year';
			default:
				return '';
		}
	};

	// Build query params for current interval
	const currentQueryParams = useStatsQueryParams({
		'group-by': 'day',
		'interval-start-date': apiStartDate ?? undefined,
		'interval-end-date': apiEndDate ?? undefined,
	});

	// Build query params for previous interval
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const prevIntervalDateRange = useMemo(() => getPrevIntervalDateRange(), [apiStartDate, apiEndDate, selectedInterval]);
	const prevQueryParams = useStatsQueryParams({
		'group-by': 'day',
		'interval-start-date': prevIntervalDateRange.startDate,
		'interval-end-date': prevIntervalDateRange.endDate,
	});

	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();

	// Fetch current interval stats
	const { data: currentStats, isLoading, isFetching } = useGetTasksStatsQuery(currentQueryParams, {
		skip: shouldSkipQuery
	});

	// Fetch previous interval stats (skip if All or Custom interval)
	const shouldFetchPrevInterval = selectedInterval !== 'All' && selectedInterval !== 'Custom';
	const { data: prevStats } = useGetTasksStatsQuery(prevQueryParams, {
		skip: !shouldFetchPrevInterval || shouldSkipQuery,
	});

	// Calculate counts
	const numOfCompletedTasks = currentStats?.summary?.totalCount || 0;
	const prevIntervalCount = prevStats?.summary?.totalCount || 0;

	// Calculate difference
	const diffOfCompletedTasksFromPrevInterval = useMemo(() => {
		if (!shouldFetchPrevInterval) {
			return { numDiff: 0, lessThanPrev: false };
		}

		return {
			numDiff: Math.abs(numOfCompletedTasks - prevIntervalCount),
			lessThanPrev: numOfCompletedTasks < prevIntervalCount,
		};
	}, [numOfCompletedTasks, prevIntervalCount, shouldFetchPrevInterval]);

	return (
		<section className="bg-color-gray-600 p-3 rounded-lg flex flex-col" aria-labelledby="task-overview-heading">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2">
					<h2 id="task-overview-heading" className="font-bold text-[16px]">Overview</h2>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<div className={classNames('flex gap-2 items-center', selectedInterval === 'All' && 'py-2')}>
					<GeneralSelectButtonAndDropdown
						selected={selectedInterval}
						setSelected={setSelectedInterval}
						selectedOptions={selectedIntervalOptions}
						onClick={(name) => {
							if (name?.toLowerCase() !== 'custom') {
								return;
							}

							setIsModalPickDateRangeOpen(true);
						}}
					/>

					<div className="hidden sm:block">{renderDateRangePicker()}</div>
				</div>
			</div>

			<div className="sm:hidden mb-2">{renderDateRangePicker()}</div>

			<div className="flex-1 flex flex-col justify-center gap-7" aria-live="polite" aria-atomic="true">
				<div className="grid grid-cols-1 w-full">
					<div className="flex flex-col items-center p-2">
						<div className={classNames(chosenColorObj.textColor, 'font-bold text-[24px]')}>
							{numOfCompletedTasks.toLocaleString()}
						</div>
						<div className="text-color-gray-50 font-medium">
							{numOfCompletedTasks > 1 ? 'Completed Tasks' : 'Completed Task'}
						</div>
						{shouldFetchPrevInterval && (
							<div
								className="text-color-gray-50 flex items-center gap-1 ml-4"
								aria-label={`${diffOfCompletedTasksFromPrevInterval.numDiff} ${diffOfCompletedTasksFromPrevInterval.lessThanPrev ? 'fewer' : 'more'} than ${getPrevIntervalName()}`}
							>
								<div aria-hidden="true">
									{diffOfCompletedTasksFromPrevInterval.numDiff} from {getPrevIntervalName()}
								</div>
								<Icon
									name={
										diffOfCompletedTasksFromPrevInterval.lessThanPrev
											? 'arrow_downward'
											: 'arrow_upward'
									}
									fill={1}
									customClass={classNames(
										'!text-[18px]',
										diffOfCompletedTasksFromPrevInterval.lessThanPrev
											? 'text-red-500'
											: 'text-emerald-500'
									)}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

			{renderCustomDateModal()}
		</section>
	);
};

export default OverviewCard;
