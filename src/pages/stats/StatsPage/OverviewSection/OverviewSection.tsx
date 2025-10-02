import { useStatsContext } from '../../../../contexts/useStatsContext';
import MedalsCard from './MedalsCard';
import OverviewCard from './OverviewCard';
import RecentCompletionCurveCard from './RecentCompletionCurveCard';
import RecentFocusedDurationCurveCard from './RecentFocusedDurationCurveCard';
import RecentFocusRecordsCurveCard from './RecentFocusRecordsCurveCard';

const OverviewSection = () => {
	const { total } = useStatsContext();

	return (
		<div>
			<div className="bg-color-gray-600 p-4 rounded-md">
				<div className="flex justify-between items-center">
					<div className="grid grid-cols-2 sm:flex gap-6">
						<div>
							<span className="font-bold">{total.numOfAllTasks.toLocaleString()}</span> Tasks
						</div>

						<div>
							<span className="font-bold">{total.numOfCompletedTasks.toLocaleString()}</span> Completed
						</div>

						<div>
							<span className="font-bold">{total.numOfProjects.toLocaleString()}</span> Projects
						</div>

						{/* TODO: Populate with real user account data after TickTick 2.0 is done. Use the date the account was created in to do so. */}
						<div>
							<span className="font-bold">{total.numOfDaysSinceAccountCreated.toLocaleString()}</span>{' '}
							Days
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-3">
				<OverviewCard />
				<MedalsCard />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
				<RecentFocusRecordsCurveCard />
				<RecentFocusedDurationCurveCard />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
				<RecentCompletionCurveCard />
			</div>
		</div>
	);
};

export default OverviewSection;
