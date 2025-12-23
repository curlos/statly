import FocusRecordsCurveCard from '../OverviewSection/FocusRecordsCurveCard';
import DetailsCard from './DetailsCard/DetailsCard';
import MostFocusedTimeCard from './MostFocusedTimeCard';
import OverviewCard from './OverviewCard';
import TimelineCard from './TimelineCard';
import FocusDurationCurveCard from './FocusDurationCurveCard';
import YearGridsCard from './YearGridsCard';
import DailyHoursFocusGoalCard from './DailyFocusHourGoalCard';

const FocusSection = () => {
	return (
		<div>
			<OverviewCard />

			<div className="mt-5 flex flex-col lg:flex-row items-center gap-5">
				<div className="flex-[5] w-full h-[380px]">
					<DetailsCard />
				</div>

				<div className="flex-[4] w-full h-[380px]">
					<DailyHoursFocusGoalCard />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
				<FocusDurationCurveCard />
				<FocusRecordsCurveCard />
				<TimelineCard />
				<MostFocusedTimeCard />
				<YearGridsCard />
			</div>
		</div>
	);
};

export default FocusSection;
