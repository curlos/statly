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
import ModalFocusGoalProgress from '../../components/Modal/ModalFocusGoalProgress';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';

const defaultFocusData = {
	goalSeconds: 21600, // 6 hours
	totalFocusDurationForDay: 0,
	percentageOfFocusedGoalHours: 0,
};

const DailyHoursFocusGoal = ({ type = 'large' }) => {
	// Fetch today's focus data (fast query)
	const { queryParams } = useSharedQueryParams();
	const { data: todayData, isLoading: isTodayLoading } = useGetStreaksTodayQuery(queryParams);

	const [isFocusGoalModalOpen, setIsFocusGoalModalOpen] = useState(false);

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const {
		focusHoursGoalPageSettings: { showStreakCount },
	} = useUserSettingsContext();

	// Only fetch streak history when:
	// 1. showStreakCount is true, OR
	// 2. modal is open (we need the data for the modal)
	const shouldFetchStreakHistory = showStreakCount || isFocusGoalModalOpen;

	// Fetch streak history (current + longest streaks)
	const { data: streakData, isLoading: isStreakLoading } = useGetStreakHistoryQuery(queryParams, {
		skip: !shouldFetchStreakHistory,
	});

	const { goalSeconds, totalFocusDurationForDay, percentageOfFocusedGoalHours } =
		todayData?.todayData || defaultFocusData;

	// const completedGoalForTheDay = percentageOfFocusedGoalHours >= 100;

	const isLargeType = type === 'large';

	return (
		<div className={classNames(isLargeType ? 'w-[350px]' : 'w-[250px]', 'relative')}>
			{(isTodayLoading || isStreakLoading) && (
				<div className="absolute bottom-4 right-[-30px] z-10">
					<Spinner size="xl" />
				</div>
			)}
			<div
				className={classNames(
					'flex justify-end items-center text-orange-500 cursor-pointer mb-[-20px]',
					!showStreakCount && 'mr-4'
				)}
				onClick={() => setIsFocusGoalModalOpen(true)}
			>
				<Icon
					name="local_fire_department"
					customClass={classNames(
						!showStreakCount
							? isLargeType
								? '!text-[48px]'
								: '!text-[40px]'
							: isLargeType
							? '!text-[32px]'
							: '!text-[28px]'
					)}
				/>
				{showStreakCount && (
					<span className={classNames(isLargeType ? '!text-[20px]' : '!text-[18px]')}>
						<span className={classNames(isLargeType ? '!text-[36px]' : '!text-[28px]', 'font-bold')}>
							{streakData?.currentStreak?.days || 0}
						</span>
						<span className="mx-[2px]">/</span>
						<span className="text-[24px]">{getStreakGoalDays()}</span>
					</span>
				)}
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
							<span className="mx-[3px] text-color-gray-25">/</span>
							<span className="text-color-gray-25">{getFormattedDuration(goalSeconds, false)}</span>
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

			<ModalFocusGoalProgress
				isOpen={isFocusGoalModalOpen}
				onClose={() => setIsFocusGoalModalOpen(false)}
				streakData={streakData}
				goalSeconds={goalSeconds}
			/>
		</div>
	);
};

export default DailyHoursFocusGoal;
