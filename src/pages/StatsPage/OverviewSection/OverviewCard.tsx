import classNames from 'classnames';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { getFormattedDuration } from '../../../utils/helpers.utils';
import { useThemeContext } from '../../../contexts/useThemeContext';

const OverviewCard = () => {
	const { total, today } = useStatsContext();

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor } = chosenColorObj;

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<h3 className="font-bold text-[16px]">Overview</h3>

			<div className="flex-1 flex flex-col justify-center gap-7 ">
				<div className="grid grid-cols-2 sm:grid-cols-3 w-full text-[14px] sm:text-[16px]">
					<div className="text-center p-2 order-1 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{today.numOfCompletedTasks.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Today's Completion</div>
					</div>

					<div className="text-center p-2 sm:border-l sm:border-r border-color-gray-150 order-3 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{today.numOfFocusRecords.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium text-[13.5px]">Today's Focus Records</div>
					</div>

					<div className="text-center p-2 order-5 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{getFormattedDuration(today.focusDuration, false)}
						</div>
						<div className="text-color-gray-100 font-medium">Today's Focus</div>
					</div>

					<div className="text-center p-2 order-2 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{total.numOfCompletedTasks.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Total Completion</div>
					</div>

					<div className="text-center p-2 sm:border-l sm:border-r border-color-gray-150 order-4 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{total.numOfFocusRecords.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">Total Focus Records</div>
					</div>

					<div className="text-center p-2 order-6 sm:order-none">
						<div className={classNames(textColor, 'font-bold text-[24px]')}>
							{getFormattedDuration(total.focusDuration, false)}
						</div>
						<div className="text-color-gray-100 font-medium">Total Focus Duration</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;
