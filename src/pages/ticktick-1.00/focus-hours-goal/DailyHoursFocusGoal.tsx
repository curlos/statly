import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Icon from '../../../components/Icon';
import { getFormattedDuration } from '../../../utils/helpers.utils';

const DailyHoursFocusGoal = ({
	focusRecords,
	streaksInfo,
	goalSeconds,
	totalFocusDurationToday,
	percentageOfFocusedGoalHours,
}) => {
	// 18,000 seconds = 5 Hours, the daily goal for number of focus hours per day.
	// TODO: GOAL number of seconds should editable in the "/user-settings" endpoint and that should come from there.

	if (!focusRecords) {
		return null;
	}

	const completedGoalForTheDay = percentageOfFocusedGoalHours >= 100;

	return (
		<div>
			<div className="flex justify-end items-center text-orange-500">
				<Icon name="local_fire_department" customClass={'!text-[32px]'} />
				<span className="text-[20px]">
					<span className="text-[32px] font-bold">{streaksInfo.currentStreak.days}</span>
					/90
				</span>
			</div>
			<CircularProgressbarWithChildren
				value={percentageOfFocusedGoalHours}
				strokeWidth={3}
				styles={buildStyles({
					textColor: '#4772F9',
					pathColor: completedGoalForTheDay ? '#00cc66' : '#34d399', // Red when overtime, otherwise original color
					trailColor: '#3d3c3c',
				})}
				counterClockwise={false}
				className={completedGoalForTheDay ? 'animated-progress-path' : ''}
			>
				<div
					className="text-white text-[40px] flex justify-center gap-4 w-[100%] select-none cursor-pointer mb-[-10px]"
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
		</div>
	);
};

export default DailyHoursFocusGoal;
