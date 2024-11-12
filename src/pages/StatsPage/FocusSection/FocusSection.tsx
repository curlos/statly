import DetailsCard from './DetailsCard/DetailsCard';
import MostFocusedTimeCard from './MostFocusedTimeCard';
import OverviewCard from './OverviewCard';
import TimelineCard from './TimelineCard';
import TrendsCard from './TrendsCard';
import YearGridsCard from './YearGridsCard';

const FocusSection = () => {
	return (
		<div>
			<OverviewCard />

			<div className="mt-5 flex items-center gap-5">
				<div className="flex-[5] w-full h-[350px]">
					<DetailsCard />
				</div>

				<div className="flex-[4] w-full"></div>
			</div>

			<div className="grid grid-cols-2 gap-5 mt-5">
				<TrendsCard />
				<TimelineCard />
				<MostFocusedTimeCard />
				<YearGridsCard />
			</div>
		</div>
	);
};

export default FocusSection;
