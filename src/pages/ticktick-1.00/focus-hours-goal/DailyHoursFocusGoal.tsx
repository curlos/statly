import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Icon from '../../../components/Icon';
import { getFormattedDuration } from '../../../utils/helpers.utils';
import ModalHabitDetails from '../../../components/Modal/ModalHabitDetails/ModalHabitDetails';
import { useState } from 'react';
import { FOCUS_HOURS_HABIT_ID } from '../../../utils/constants.utils';

const DailyHoursFocusGoal = ({
	focusRecords,
	streaksInfo,
	goalSeconds,
	totalFocusDurationToday,
	percentageOfFocusedGoalHours,
}) => {
	const [isModalHabitDetailsOpen, setIsModalHabitDetailsOpen] = useState(false);

	if (!focusRecords) {
		return null;
	}

	const completedGoalForTheDay = percentageOfFocusedGoalHours >= 100;

	return (
		<div className="select-none">
			<div
				className="flex justify-end items-center text-orange-500 cursor-pointer"
				onClick={() => setIsModalHabitDetailsOpen(true)}
			>
				<Icon name="local_fire_department" customClass={'!text-[32px]'} />
				<span className="text-[20px]">
					<span className="text-[32px] font-bold">{streaksInfo.currentStreak.days}</span>
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
					<div data-cy="timer-display" className="text-center text-[32px]">
						<div className="mt-3">
							<span className="text-[48px] font-[600]">
								{getFormattedDuration(totalFocusDurationToday, false)}
							</span>
							<span className="">/</span>
							<span>{getFormattedDuration(goalSeconds, false)}</span>
						</div>

						<div className="text-[22px] mt-[-5px] text-color-gray-100">
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
