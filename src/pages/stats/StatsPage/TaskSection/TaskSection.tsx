import { useState } from 'react';
import CompletionStatsCard from './CompletionStatsCard';
import OverviewCard from './OverviewCard';
import CompletedTasksCurveCard from '../OverviewSection/CompletedTasksCurveCard';

const TaskSection = () => {
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
				<OverviewCard />
				<CompletedTasksCurveCard />
				{/* <CompletionStatsCard /> */}
			</div>
		</div>
	);
};

export default TaskSection;
