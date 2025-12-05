import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Icon from '../../components/Icon';
import { getFormattedDuration } from '../../utils/focus-apps/helpers.utils';
import { useState } from 'react';
import classNames from 'classnames';
import { getStreakGoalDays } from '../../utils/focus.utils';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useGetStreaksTodayQuery, useGetStreakHistoryQuery } from '../../services/resources/streaksApi';
import Spinner from '../../components/Loaders/Spinner';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';
import { useSyncOrchestration } from '../../hooks/useSyncOrchestration';

const defaultFocusData = {
	goalSeconds: 21600, // 6 hours
	totalFocusDurationForDay: 0,
	percentageOfFocusedGoalHours: 0,
};

const DailyHoursFocusGoal = ({ type = 'large' }) => {
	// Fetch today's focus data (fast query)
	const { queryParams } = useSharedQueryParams();
	const { data: todayData, isLoading: isTodayLoading } = useGetStreaksTodayQuery(queryParams);

	// Fetch streak history (current + longest streaks)
	const { data: streakData, isLoading: isStreakLoading } = useGetStreakHistoryQuery(queryParams);

	// Check if syncing to show spinner
	const { isSyncing } = useSyncOrchestration();

	const { goalSeconds, totalFocusDurationForDay, percentageOfFocusedGoalHours } =
		todayData?.todayData || defaultFocusData;

	const [isModalHabitDetailsOpen, setIsModalHabitDetailsOpen] = useState(false);

	// const completedGoalForTheDay = percentageOfFocusedGoalHours >= 100;

	const isLargeType = type === 'large';

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	return (
		<div className={classNames(isLargeType ? 'w-[350px]' : 'w-[250px]', 'relative')}>
			{(isTodayLoading || isStreakLoading || isSyncing) && (
				<div className="absolute bottom-4 right-[-30px] z-10">
					<Spinner size="xl" />
				</div>
			)}
			<div
				className="flex justify-end items-center text-orange-500 cursor-pointer"
				onClick={() => setIsModalHabitDetailsOpen(true)}
			>
				<Icon
					name="local_fire_department"
					customClass={classNames(isLargeType ? '!text-[32px]' : '!text-[28px]')}
				/>
				<span className={classNames(isLargeType ? '!text-[20px]' : '!text-[18px]')}>
					<span className={classNames(isLargeType ? '!text-[36px]' : '!text-[28px]', 'font-bold')}>
						{streakData?.currentStreak?.days || 0}
					</span>
					<span className="text-[24px]">/{getStreakGoalDays()}</span>
				</span>
			</div>
			<CircularProgressbarWithChildren
				value={percentageOfFocusedGoalHours}
				strokeWidth={4}
				styles={buildStyles({
					textColor: '#4772F9',
					pathColor: chosenColorObj.hexColor, // Red when overtime, otherwise original color
					trailColor: '#3d3c3c',
				})}
				counterClockwise={false}
			>
				<div
					className="text-white text-[40px] flex justify-center gap-4 w-[100%] select-none mb-[-10px]"
					onMouseOver={() => {}}
				>
					<div
						data-cy="timer-display"
						className={classNames('text-center', isLargeType ? 'text-[32px]' : 'text-[24px]')}
					>
						<div className="mt-3">
							<span className={classNames(isLargeType ? 'text-[48px]' : 'text-[36px]', 'font-[600]')}>
								{getFormattedDuration(totalFocusDurationForDay, false)}
							</span>
							<span className="">/</span>
							<span>{getFormattedDuration(goalSeconds, false)}</span>
						</div>

						<div
							className={classNames(
								isLargeType ? 'text-[22px]' : 'text-[20px]',
								'mt-[-5px] text-color-gray-100'
							)}
						>
							{Number(percentageOfFocusedGoalHours).toFixed(2)}%
						</div>
					</div>
				</div>
			</CircularProgressbarWithChildren>
		</div>
	);
};

export default DailyHoursFocusGoal;
