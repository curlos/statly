import classNames from 'classnames';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getFormattedDuration } from '../../../../utils/helpers.utils';
import Spinner from '../../../../components/Loaders/Spinner';
import type { OverviewStatsResponse } from '../../../../types/api';

interface OverviewCardProps {
	overviewStats?: OverviewStatsResponse;
	isLoading: boolean;
}

const OverviewCard = ({ overviewStats, isLoading }: OverviewCardProps) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor } = chosenColorObj;

	const {
		todayCompletedTasksCount = 0,
		todayFocusRecordCount = 0,
		todayFocusDuration = 0,
		totalCompletedTasksCount = 0,
		totalFocusRecordCount = 0,
		totalFocusDuration = 0,
	} = overviewStats || {};

	return (
		<section className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]" aria-labelledby="overview-card-heading">
			<div className="flex justify-between items-center">
				<h2 id="overview-card-heading" className="font-bold text-[16px]">Overview</h2>
				{isLoading && <Spinner size="sm" />}
			</div>

			<div className="flex-1 flex flex-col justify-center w-full text-[14px] sm:text-[16px]">
				<div className="flex sm:flex-col sm:gap-3">
					{/* Today group — left col on mobile, top row on desktop */}
					<div className="flex-1 flex flex-col justify-around sm:grid sm:grid-cols-3">
						<div className="text-center p-2" aria-label={`Today's Completion: ${todayCompletedTasksCount.toLocaleString()}`}>
							<div className={classNames(textColor, 'font-bold text-[20px] sm:text-[24px]')}>
								{todayCompletedTasksCount.toLocaleString()}
							</div>
							<div className="text-color-gray-25 font-medium">Today's Completion</div>
						</div>

						<div className="text-center p-2" aria-label={`Today's Focus Records: ${todayFocusRecordCount.toLocaleString()}`}>
							<div className={classNames(textColor, 'font-bold text-[20px] sm:text-[24px]')}>
								{todayFocusRecordCount.toLocaleString()}
							</div>
							<div className="text-color-gray-25 font-medium">Today's Focus Records</div>
						</div>

						<div className="text-center p-2" aria-label={`Today's Focus: ${getFormattedDuration(todayFocusDuration, false)}`}>
							<div className={classNames(textColor, 'font-bold text-[20px] sm:text-[24px]')}>
								{getFormattedDuration(todayFocusDuration, false)}
							</div>
							<div className="text-color-gray-25 font-medium">Today's Focus</div>
						</div>
					</div>

					{/* Total group — right col on mobile, bottom row on desktop */}
					<div className="flex-1 flex flex-col justify-around sm:grid sm:grid-cols-3 ">
						<div className="text-center p-2" aria-label={`Total Completion: ${totalCompletedTasksCount.toLocaleString()}`}>
							<div className={classNames(textColor, 'font-bold text-[20px] sm:text-[24px]')}>
								{totalCompletedTasksCount.toLocaleString()}
							</div>
							<div className="text-color-gray-25 font-medium">Total Completion</div>
						</div>

						<div className="text-center p-2" aria-label={`Total Focus Records: ${totalFocusRecordCount.toLocaleString()}`}>
							<div className={classNames(textColor, 'font-bold text-[20px] sm:text-[24px]')}>
								{totalFocusRecordCount.toLocaleString()}
							</div>
							<div className="text-color-gray-25 font-medium">Total Focus Records</div>
						</div>

						<div className="text-center p-2" aria-label={`Total Focus Time: ${getFormattedDuration(totalFocusDuration, false)}`}>
							<div className={classNames(textColor, 'font-bold text-[20px] sm:text-[24px]')}>
								{getFormattedDuration(totalFocusDuration, false)}
							</div>
							<div className="text-color-gray-25 font-medium">Total Focus Time</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default OverviewCard;
