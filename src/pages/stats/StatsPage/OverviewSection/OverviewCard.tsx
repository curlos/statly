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

	// Destructure all stats from consolidated overview response
	const {
		todayCompletedTasksCount = 0,
		todayFocusRecordCount = 0,
		todayFocusDuration = 0,
		totalCompletedTasksCount = 0,
		totalFocusRecordCount = 0,
		totalFocusDuration = 0,
	} = overviewStats || {};

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<div className="flex justify-between items-center">
				<h3 className="font-bold text-[16px]">Overview</h3>
				{isLoading && <Spinner size="sm" />}
			</div>

			<div className="flex-1 flex flex-col justify-center gap-7 ">
				<div className="grid grid-cols-2 sm:grid-cols-3 w-full text-[14px] sm:text-[16px]">
					<div className="text-center p-2 order-1 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{todayCompletedTasksCount.toLocaleString()}
						</div>
						<div className="text-color-gray-25 font-medium">Today's Completion</div>
					</div>

					<div className="text-center p-2 sm:border-l sm:border-r border-color-gray-150 order-3 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{todayFocusRecordCount.toLocaleString()}
						</div>
						<div className="text-color-gray-25 font-medium text-[13.5px]">Today's Focus Records</div>
					</div>

					<div className="text-center p-2 order-5 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{getFormattedDuration(todayFocusDuration, false)}
						</div>
						<div className="text-color-gray-25 font-medium">Today's Focus</div>
					</div>

					<div className="text-center p-2 order-2 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{totalCompletedTasksCount.toLocaleString()}
						</div>
						<div className="text-color-gray-25 font-medium">Total Completion</div>
					</div>

					<div className="text-center p-2 sm:border-l sm:border-r border-color-gray-150 order-4 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{totalFocusRecordCount.toLocaleString()}
						</div>
						<div className="text-color-gray-25 font-medium">Total Focus Records</div>
					</div>

					<div className="text-center p-2 order-6 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{getFormattedDuration(totalFocusDuration, false)}
						</div>
						<div className="text-color-gray-25 font-medium">Total Focus Time</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;
