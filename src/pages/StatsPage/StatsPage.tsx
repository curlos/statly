import LoaderBottomRightBO3Medal from '../../components/Loaders/LoaderBottomRightBO3Medal';
import { useStatsContext } from '../../contexts/useStatsContext';
import FocusSection from './FocusSection/FocusSection';
import OverviewSection from './OverviewSection/OverviewSection';
import TaskSection from './TaskSection/TaskSection';
import TopBar from './TopBar';
import { usePageContext } from 'vike-react/usePageContext';
const StatsPage = () => {
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;
	const { focusRecords } = useStatsContext();

	return (
		<div className="flex max-w-screen max-h-[100vh] overflow-x-hidden">
			<div className="flex-1 bg-color-gray-700 py-8 h-[100vh] overflow-scroll gray-scrollbar">
				<div className="container">
					<TopBar />

					<div className="mt-5">
						{location.pathname.includes('/overview') && <OverviewSection />}
						{location.pathname.includes('/task') && <TaskSection />}
						{location.pathname.includes('/focus') && <FocusSection />}
					</div>
				</div>
			</div>

			{!focusRecords && <LoaderBottomRightBO3Medal />}
		</div>
	);
};

export default StatsPage;
