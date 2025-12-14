import classNames from 'classnames';
import Icon from '../../../../components/Icon';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getFormattedLongDay } from '../../../../utils/date.utils';
import { getFormattedDuration } from '../../../../utils/helpers.utils';
import { useGetFocusStatsQuery } from '../../../../services/resources/statsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import Spinner from '../../../../components/Loaders/Spinner';

const OverviewCard = () => {
	// Get today's date
	const today = new Date();
	const todayDateKey = getFormattedLongDay(today);

	// Get yesterday's date
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayDateKey = getFormattedLongDay(yesterday);

	// Build query params for API using custom hook
	const todayQueryParams = useStatsQueryParams({
		'group-by': 'day',
		'interval-start-date': todayDateKey,
		'interval-end-date': todayDateKey,
	});

	const yesterdayQueryParams = useStatsQueryParams({
		'group-by': 'day',
		'interval-start-date': yesterdayDateKey,
		'interval-end-date': yesterdayDateKey,
	});

	const allTimeQueryParams = useStatsQueryParams({
		'group-by': 'day',
		'interval-start-date': '2020-11-02', // Account creation date
		'interval-end-date': todayDateKey,
	});

	// Fetch today's stats
	const { data: todayStats, isLoading: isTodayLoading, isFetching: isTodayFetching } = useGetFocusStatsQuery(todayQueryParams);

	// Fetch yesterday's stats
	const { data: yesterdayStats, isLoading: isYesterdayLoading, isFetching: isYesterdayFetching } = useGetFocusStatsQuery(yesterdayQueryParams);

	// Fetch all-time stats
	const { data: allTimeStats, isLoading: isAllTimeLoading, isFetching: isAllTimeFetching } = useGetFocusStatsQuery(allTimeQueryParams);

	// Check if any query is loading or fetching
	const isLoading = isTodayLoading || isYesterdayLoading || isAllTimeLoading || isTodayFetching || isYesterdayFetching || isAllTimeFetching;

	// Extract values
	const todayData = todayStats?.byDay?.[0] || { duration: 0, count: 0 };
	const yesterdayData = yesterdayStats?.byDay?.[0] || { duration: 0, count: 0 };

	const todayFocusRecords = todayData.count;
	const todayFocusDuration = todayData.duration;
	const yesterdayFocusRecords = yesterdayData.count;
	const yesterdayFocusDuration = yesterdayData.duration;

	const totalFocusRecords = allTimeStats?.summary?.totalRecords || 0;
	const totalFocusDuration = allTimeStats?.summary?.totalDuration || 0;

	// Calculate differences
	const diffTodayFromYesterdayFocusRecords = {
		numDiff: Math.abs(todayFocusRecords - yesterdayFocusRecords),
		lessThanYesterday: todayFocusRecords < yesterdayFocusRecords,
	};

	const diffTodayFromYesterdayFocusDuration = {
		numDiff: Math.abs(todayFocusDuration - yesterdayFocusDuration),
		lessThanYesterday: todayFocusDuration < yesterdayFocusDuration,
	};

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col text-[12px] sm:text-[16px] relative">
			<div className="flex items-center gap-2 mb-2">
				<h3 className="font-bold text-[16px]">Overview</h3>
				{isLoading && <Spinner size="md" />}
			</div>

			<div className="flex-1 flex flex-col justify-center gap-7">
				<div className="grid grid-cols-2 lg:grid-cols-4 w-full text-center">
					{/* Today's Focus Records */}
					<div className="flex flex-col items-center p-2">
						<div className={classNames(chosenColorObj.textColor, 'font-bold text-[24px]')}>
							{todayFocusRecords}
						</div>
						<div className="text-color-gray-100 font-medium">Today's Focus Records</div>
						<div className="text-color-gray-100 flex items-center gap-1">
							<div className="text-[10px] sm:text-[16px]">
								{diffTodayFromYesterdayFocusRecords.numDiff} from yesterday
							</div>
							<Icon
								name={classNames(
									diffTodayFromYesterdayFocusRecords.lessThanYesterday
										? 'arrow_downward'
										: 'arrow_upward'
								)}
								fill={1}
								customClass={classNames(
									'!text-[18px]',
									diffTodayFromYesterdayFocusRecords.lessThanYesterday
										? 'text-red-500'
										: 'text-emerald-500'
								)}
							/>
						</div>
					</div>

					{/* Total Focus Records */}
					<div className="flex flex-col items-center p-2 lg:border-l border-color-gray-150">
						<div className={classNames(chosenColorObj.textColor, 'font-bold text-[24px]')}>
							{totalFocusRecords.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Total Focus Records</div>
					</div>

					{/* Today Focus Duration */}
					<div className="flex flex-col items-center p-2 lg:border-l border-color-gray-150">
						<div className={classNames(chosenColorObj.textColor, 'font-bold text-[24px]')}>
							{getFormattedDuration(todayFocusDuration, false)}
						</div>
						<div className="text-color-gray-100 font-medium">Today's Focus</div>
						<div className="text-color-gray-100 flex items-center gap-1">
							<div className="text-[8px] sm:text-[16px]">
								{getFormattedDuration(diffTodayFromYesterdayFocusDuration.numDiff, false)} from
								yesterday
							</div>
							<Icon
								name={classNames(
									diffTodayFromYesterdayFocusDuration.lessThanYesterday
										? 'arrow_downward'
										: 'arrow_upward'
								)}
								fill={1}
								customClass={classNames(
									'!text-[18px]',
									diffTodayFromYesterdayFocusDuration.lessThanYesterday
										? 'text-red-500'
										: 'text-emerald-500'
								)}
							/>
						</div>
					</div>

					{/* Total Focus Duration */}
					<div className="flex flex-col items-center p-2 lg:border-l border-color-gray-150">
						<div className={classNames(chosenColorObj.textColor, 'font-bold text-[24px]')}>
							{getFormattedDuration(totalFocusDuration, false)}
						</div>
						<div className="text-color-gray-100 font-medium">Total Focus Time</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;
