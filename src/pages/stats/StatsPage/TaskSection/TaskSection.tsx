import CompletionStatsCard from './CompletionStatsCard';
import OverviewCard from './OverviewCard';
import CompletedTasksCurveCard from '../OverviewSection/CompletedTasksCurveCard';
import IntervalRankingsCard from '../IntervalRankingsCard';

const TaskSection = () => {
	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-3">
				<OverviewCard />
				<CompletedTasksCurveCard />
			</div>

			<div className="mt-5 flex flex-col lg:flex-row items-center gap-5">
				<div className="flex-[5] w-full lg:h-[380px]">
					<CompletionStatsCard />
				</div>

				<div className="flex-[4] w-full lg:h-[380px]">
					<IntervalRankingsCard type="tasks" />
				</div>
			</div>
		</div>
	);
};

export default TaskSection;
