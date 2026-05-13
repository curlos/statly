import DailyHoursFocusGoal from "../../../focus-time-goal/DailyHoursFocusGoal";

const DailyHoursFocusGoalCard = () => {
	return (
		<section className="bg-color-gray-600 p-3 rounded-lg h-full w-full flex flex-col" aria-labelledby="focus-goal-heading">
			<h2 id="focus-goal-heading" className="font-bold text-[16px]">Today's Focus Hour Goal</h2>

			<div className="flex flex-1 justify-center items-center p-3">
				<DailyHoursFocusGoal
					{...{
						type: 'small',
					}}
				/>
			</div>
		</section>
	);
};

export default DailyHoursFocusGoalCard;
