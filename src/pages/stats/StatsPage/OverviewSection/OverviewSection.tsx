import TodaysActionReport from './TodaysActionReport';
import OverviewCard from './OverviewCard';
import RecentCompletionCurveCard from './RecentCompletionCurveCard';
import RecentFocusedDurationCurveCard from './RecentFocusedDurationCurveCard';
import RecentFocusRecordsCurveCard from './RecentFocusRecordsCurveCard';
import { useGetOverviewStatsQuery } from '../../../../services/resources/documentsStatsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import Spinner from '../../../../components/Loaders/Spinner';

const OverviewSection = () => {
	// Build query params for overview stats (respects FilterSidebar selections)
	const overviewQueryParams = useStatsQueryParams();

	const { data: overviewStats, isLoading, isFetching } = useGetOverviewStatsQuery(overviewQueryParams);

	return (
		<div>
			<div className="bg-color-gray-600 p-4 rounded-md">
				<div className="flex justify-between items-center">
					<div className="grid grid-cols-2 sm:flex gap-6">
						<div>
							<span className="font-bold">{(overviewStats?.numOfAllTasks ?? 0).toLocaleString()}</span> <span className="text-gray-400">Tasks</span>
						</div>

						<div>
							<span className="font-bold">{(overviewStats?.numOfCompletedTasks ?? 0).toLocaleString()}</span> <span className="text-gray-400">Completed</span>
						</div>

						<div>
							<span className="font-bold">{(overviewStats?.numOfProjects ?? 0).toLocaleString()}</span> <span className="text-gray-400">Projects</span>
						</div>

						<div>
							<span className="font-bold">{(overviewStats?.numOfDaysSinceAccountCreated ?? 0).toLocaleString()}</span>{' '}
							<span className="text-gray-400">Days</span>
						</div>
					</div>

					{isLoading || isFetching && <Spinner size="sm" />}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-3">
				<OverviewCard />
				<TodaysActionReport />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
				<RecentFocusRecordsCurveCard />
				{/* <RecentFocusedDurationCurveCard /> */}
			</div>

			{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
				<RecentCompletionCurveCard />
			</div> */}
		</div>
	);
};

export default OverviewSection;
