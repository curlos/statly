import DailyHoursFocusGoal from '../../../ticktick-1.00/focus-hours-goal/DailyHoursFocusGoal';

const DailyHoursFocusGoalCard = () => {
	return (
		<div className="bg-color-gray-600 p-3 rounded-lg h-full w-full">
			<h3 className="font-bold text-[16px]">Today's Focus Hour Goal</h3>

			<div className="flex justify-center items-center">
				<DailyHoursFocusGoal
					{...{
						type: 'small',
					}}
				/>
			</div>
		</div>
	);
};

export default DailyHoursFocusGoalCard;
