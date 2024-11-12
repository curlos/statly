import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Icon from '../../../components/Icon';
import { getFormattedDuration } from '../../../utils/helpers.utils';
import ModalHabitDetails from '../../../components/Modal/ModalHabitDetails/ModalHabitDetails';
import { useState } from 'react';
import { FOCUS_HOURS_HABIT_ID } from '../../../utils/constants.utils';
import classNames from 'classnames';
import { useGetPomoAndStopwatchFocusRecordsQuery } from '../../../services/resources/ticktickOneApi';
import { getStreaksInfo, getFocusDataForDayInfo } from '../../../utils/focus.utils';

const defaultFocusData = {
	goalSeconds: 5400,
	totalFocusDurationForDay: 0,
	percentageOfFocusedGoalHours: 0,
};

const DailyHoursFocusGoal = ({ type = 'large' }) => {
	const { data: fetchedFocusRecords } = useGetPomoAndStopwatchFocusRecordsQuery();
	const { focusRecords, focusRecordsByDate } = fetchedFocusRecords || {};

	const streaksInfo = focusRecords && getStreaksInfo(focusRecords);
	const focusDataForTodayInfo = focusRecordsByDate && getFocusDataForDayInfo(focusRecordsByDate, new Date());
	const { goalSeconds, totalFocusDurationForDay, percentageOfFocusedGoalHours } =
		focusDataForTodayInfo || defaultFocusData;

	const [isModalHabitDetailsOpen, setIsModalHabitDetailsOpen] = useState(false);

	const completedGoalForTheDay = percentageOfFocusedGoalHours >= 100;

	const isLargeType = type === 'large';

	return (
		<div className={classNames(isLargeType ? 'w-[350px]' : 'w-[250px]')}>
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
						{streaksInfo?.currentStreak?.days || 0}
					</span>
					/90
				</span>
			</div>
			<CircularProgressbarWithChildren
				value={percentageOfFocusedGoalHours}
				strokeWidth={4}
				styles={buildStyles({
					textColor: '#4772F9',
					pathColor: completedGoalForTheDay ? '#00cc66' : '#34d399', // Red when overtime, otherwise original color
					trailColor: '#3d3c3c',
				})}
				counterClockwise={false}
				className={completedGoalForTheDay ? 'animated-progress-path' : ''}
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

			{isModalHabitDetailsOpen && (
				<ModalHabitDetails
					isOpen={isModalHabitDetailsOpen}
					setIsOpen={setIsModalHabitDetailsOpen}
					habitId={FOCUS_HOURS_HABIT_ID}
				/>
			)}
		</div>
	);
};

export default DailyHoursFocusGoal;
