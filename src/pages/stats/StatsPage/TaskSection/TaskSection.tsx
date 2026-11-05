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
				<div className="flex-[5] w-full min-w-0 lg:h-[420px]">
					<CompletionStatsCard />
				</div>

				<div className="flex-[4] w-full min-w-0 lg:h-[420px]">
					<IntervalRankingsCard type="tasks" heightClassName="h-[380px] lg:h-[420px]" />
				</div>
			</div>
		</div>
	);
};

export default TaskSection;
