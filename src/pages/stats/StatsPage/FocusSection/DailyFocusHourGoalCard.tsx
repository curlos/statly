import DailyHoursFocusGoal from "../../../focus-hours-goal/DailyHoursFocusGoal";

const DailyHoursFocusGoalCard = () => {
	return (
		<div className="bg-color-gray-600 p-3 rounded-lg h-full w-full flex flex-col">
			<h3 className="font-bold text-[16px]">Today's Focus Hour Goal</h3>

			<div className="flex flex-1 justify-center items-center p-3">
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
