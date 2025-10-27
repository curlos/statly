import classNames from 'classnames';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getFormattedDuration } from '../../../../utils/focus-apps/helpers.utils';
import { getFormattedLongDay } from '../../../../utils/date.utils';
import { useGetFocusStatsQuery, useGetOverviewStatsQuery } from '../../../../services/resources/documentsStatsApi';
import { useGetDaysWithCompletedTasksQuery } from '../../../../services/resources/documentsTasksApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import Spinner from '../../../../components/Loaders/Spinner';

const OverviewCard = () => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor } = chosenColorObj;

	// Get today's date
	const today = new Date();
	const todayDateKey = getFormattedLongDay(today);

	// Build query params for overview stats (respects FilterSidebar selections)
	const overviewQueryParams = useStatsQueryParams();

	// Fetch overview stats (total task counts, project counts, etc.)
	const { data: overviewStats } = useGetOverviewStatsQuery(overviewQueryParams);

	// Build query params for today's focus stats
	const todayFocusQueryParams = useStatsQueryParams({
		'group-by': 'day',
		'interval-start-date': todayDateKey,
		'interval-end-date': todayDateKey,
	});

	// Build query params for all-time focus stats
	const allTimeFocusQueryParams = useStatsQueryParams({
		'group-by': 'day',
		'interval-start-date': '2020-11-02', // Account creation date
		'interval-end-date': todayDateKey,
	});

	// Fetch today's focus stats
	const { data: todayFocusStats, isLoading: isTodayFocusLoading } = useGetFocusStatsQuery(todayFocusQueryParams);

	// Fetch all-time focus stats
	const { data: allTimeFocusStats, isLoading: isAllTimeFocusLoading } = useGetFocusStatsQuery(allTimeFocusQueryParams);

	// Fetch today's completed tasks
	const { data: todayCompletedTasksData, isLoading: isTodayTasksLoading } = useGetDaysWithCompletedTasksQuery({
		'start-date': todayDateKey,
		'end-date': todayDateKey,
		'max-days-per-page': 1,
		'page': 0,
	});

	// Extract today's focus data
	const todayFocusData = todayFocusStats?.byDay?.[0] || { duration: 0, count: 0 };
	const todayNumOfFocusRecords = todayFocusData.count;
	const todayFocusDuration = todayFocusData.duration;

	// Extract all-time focus data
	const totalNumOfFocusRecords = allTimeFocusStats?.summary?.totalRecords || 0;
	const totalFocusDuration = allTimeFocusStats?.summary?.totalDuration || 0;

	// Extract today's completed tasks count
	const todayNumOfCompletedTasks = todayCompletedTasksData?.data?.[0]?.completedTasksForDay?.length || 0;

	// Extract total completed tasks from overview stats
	const totalNumOfCompletedTasks = overviewStats?.numOfCompletedTasks || 0;

	// Check if any query is loading
	const isLoading = isTodayFocusLoading || isAllTimeFocusLoading || isTodayTasksLoading;

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center">
				<h3 className="font-bold text-[16px]">Overview</h3>
				{isLoading && <Spinner size="sm" />}
			</div>

			<div className="flex-1 flex flex-col justify-center gap-7 ">
				<div className="grid grid-cols-2 sm:grid-cols-3 w-full text-[14px] sm:text-[16px]">
					<div className="text-center p-2 order-1 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{todayNumOfCompletedTasks.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Today's Completion</div>
					</div>

					<div className="text-center p-2 sm:border-l sm:border-r border-color-gray-150 order-3 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{todayNumOfFocusRecords.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium text-[13.5px]">Today's Focus Records</div>
					</div>

					<div className="text-center p-2 order-5 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{getFormattedDuration(todayFocusDuration, false)}
						</div>
						<div className="text-color-gray-100 font-medium">Today's Focus</div>
					</div>

					<div className="text-center p-2 order-2 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{totalNumOfCompletedTasks.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Total Completion</div>
					</div>

					<div className="text-center p-2 sm:border-l sm:border-r border-color-gray-150 order-4 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{totalNumOfFocusRecords.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Total Focus Records</div>
					</div>

					<div className="text-center p-2 order-6 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{getFormattedDuration(totalFocusDuration, false)}
						</div>
						<div className="text-color-gray-100 font-medium">Total Focus Duration</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;
