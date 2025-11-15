import CompletionStatsCard from './CompletionStatsCard';
import OverviewCard from './OverviewCard';
import CompletedTasksCurveCard from '../OverviewSection/CompletedTasksCurveCard';

const TaskSection = () => {
	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-3">
				<OverviewCard />
				<CompletedTasksCurveCard />
			</div>

			<div className="mt-5 flex flex-col lg:flex-row items-center gap-5">
				<div className="flex-[5] w-full h-[380px]">
					<CompletionStatsCard />
				</div>

				<div className="flex-[4] w-full h-[380px]">
				</div>
			</div>
		</div>
	);
};

export default TaskSection;
