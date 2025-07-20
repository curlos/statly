import { useRef, useState } from 'react';
import CompletionStatsCard from './CompletionStatsCard';
import CompletionDistributionCard from './CompletionDistributionCard';
import OverviewCard from './OverviewCard';
import ModalPickDateRange from '../../../components/Modal/ModalPickDateRange';

const TaskSection = () => {
	// Custom
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
				<OverviewCard />
				<CompletionDistributionCard />
				<CompletionStatsCard />
			</div>

			<ModalPickDateRange
				isModalOpen={isModalPickDateRangeOpen}
				setIsModalOpen={setIsModalPickDateRangeOpen}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
			/>
		</div>
	);
};

export default TaskSection;
