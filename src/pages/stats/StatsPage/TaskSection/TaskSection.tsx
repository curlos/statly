import { useState } from 'react';
import ModalPickDateRange from '../../../../components/Modal/ModalPickDateRange';
import CompletionDistributionCard from './CompletionDistributionCard';
import CompletionStatsCard from './CompletionStatsCard';
import OverviewCard from './OverviewCard';
import CompletedTasksCurveCard from '../OverviewSection/CompletedTasksCurveCard';

const TaskSection = () => {
	// Custom
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
				{/* <OverviewCard />
				<CompletionDistributionCard />
				<CompletionStatsCard /> */}
				<CompletedTasksCurveCard />
			</div>

			{/* <ModalPickDateRange
				isModalOpen={isModalPickDateRangeOpen}
				setIsModalOpen={setIsModalPickDateRangeOpen}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
			/> */}
		</div>
	);
};

export default TaskSection;
