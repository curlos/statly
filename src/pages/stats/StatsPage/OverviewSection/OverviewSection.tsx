import TodaysActionReport from './TodaysActionReport';
import OverviewCard from './OverviewCard';
import { useGetOverviewStatsQuery } from '../../../../services/resources/statsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import Spinner from '../../../../components/Loaders/Spinner';
import Tooltip from '../../../../components/Tooltip';
import Icon from '../../../../components/Icon';
import { useApplyDefaultDateRange } from '../../../../hooks/useApplyDefaultDateRange';

const OverviewSection = () => {
	// Build query params for overview stats (respects FilterSidebar selections)
	const overviewQueryParams = useStatsQueryParams();
	const { shouldSkipQuery } = useApplyDefaultDateRange();

	const { data: overviewStats, isLoading, isFetching } = useGetOverviewStatsQuery(overviewQueryParams, {
		skip: shouldSkipQuery
	});

	return (
		<div>
			<div className="bg-color-gray-600 p-4 rounded-md">
				<div className="flex justify-between items-center">
					<div className="grid grid-cols-2 sm:flex gap-6">
						<div>
							<span className="font-bold">{(overviewStats?.totalTasksCount ?? 0).toLocaleString()}</span> <span className="text-gray-400">Total Tasks</span>
						</div>

						<div>
							<span className="font-bold">{(overviewStats?.totalCompletedTasksCount ?? 0).toLocaleString()}</span> <span className="text-gray-400">Completed Tasks</span>
						</div>

						<div>
							<span className="font-bold">{(overviewStats?.totalProjectsCount ?? 0).toLocaleString()}</span> <span className="text-gray-400">Projects</span>
						</div>

						<div className="flex items-center gap-1">
							<span className="font-bold">{(overviewStats?.activeDays ?? 0).toLocaleString()}</span>{' '}
							<span className="text-gray-400">Active Days</span>
							<span className="mb-[-6px]">
								<Tooltip
									content="Active days are days where you either completed at least one task or focused for at least one session. It's a measure of your consistent productivity!"
									position="bottom"
									className="!w-[200px]"
								>
									<Icon
										name="help_outline"
										fill={0}
										customClass="!text-[18px] text-gray-400 hover:text-white cursor-help"
									/>
								</Tooltip>
							</span>
						</div>
					</div>

					{(isLoading || isFetching) && <Spinner size="sm" />}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-3">
				<OverviewCard overviewStats={overviewStats} isLoading={isLoading} />
				<TodaysActionReport todayFocusDuration={overviewStats?.todayFocusDuration ?? 0} />
			</div>
		</div>
	);
};

export default OverviewSection;
