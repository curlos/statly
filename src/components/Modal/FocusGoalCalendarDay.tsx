import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Tooltip from '../Tooltip';
import { getFormattedDuration } from '../../utils/focus-apps/helpers.utils';
import { areDatesEqual } from '../../utils/date.utils';
import classNames from 'classnames';

interface FocusGoalCalendarDayProps {
	day: Date;
	dayData?: {
		goalSeconds: number;
		totalFocusDurationForDay: number;
		percentageOfFocusedGoalHours: number;
	};
	themeColor: string;
	goalSeconds: number;
}

const FocusGoalCalendarDay: React.FC<FocusGoalCalendarDayProps> = ({
	day,
	dayData,
	themeColor,
	goalSeconds: defaultGoalSeconds,
}) => {
	// Use dayData if available, otherwise show 0 progress
	const percentage = dayData?.percentageOfFocusedGoalHours || 0;
	const totalFocused = dayData?.totalFocusDurationForDay || 0;
	const goalForDay = dayData?.goalSeconds || defaultGoalSeconds;

	// Check if today
	const isToday = areDatesEqual(new Date(), day);

	// Tooltip content
	const tooltipContent = (
		<div className="text-base whitespace-nowrap">
			<span className="text-lg font-bold">{getFormattedDuration(totalFocused, false)}</span>
			<span className="mx-[2px]">/</span>
			<span className="text-base text-color-gray-25">{getFormattedDuration(goalForDay, false)}</span>
			<div className="text-color-gray-100 text-center">{percentage.toFixed(2)}%</div>
		</div>
	);

	return (
		<Tooltip content={tooltipContent} position="top">
			<div className="flex items-center justify-center">
				<div style={{ width: '40px', height: '40px' }}>
					<CircularProgressbarWithChildren
						value={percentage}
						strokeWidth={10}
						styles={buildStyles({
							pathColor: themeColor,
							trailColor: '#3d3c3c',
						})}
						counterClockwise={false}
					>
						<div
							className={classNames(
								'text-[14px]',
								isToday ? 'font-bold text-white' : 'text-color-gray-100'
							)}
						>
							{day.getDate()}
						</div>
					</CircularProgressbarWithChildren>
				</div>
			</div>
		</Tooltip>
	);
};

export default FocusGoalCalendarDay;
