import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Tooltip from '../Tooltip';
import { getFormattedDuration } from '../../utils/focus-apps/helpers.utils';
import { areDatesEqual } from '../../utils/date.utils';
import { hexToRgba } from '../../utils/color.utils';
import classNames from 'classnames';
import Icon from '../Icon';

interface FocusGoalCalendarDayProps {
	day: Date;
	dayData?: {
		goalSeconds: number;
		totalFocusDurationForDay: number;
		percentageOfFocusedGoalHours: number;
	};
	themeColor: string;
	goalSeconds: number;
	restDays?: Record<string, boolean>;
	dateKey: string;
	selectedDaysOfWeek: Record<string, boolean>;
	customDailyFocusGoal: Record<string, number>;
}

const FocusGoalCalendarDay: React.FC<FocusGoalCalendarDayProps> = ({
	day,
	dayData,
	themeColor,
	goalSeconds: defaultGoalSeconds,
	restDays,
	dateKey,
	selectedDaysOfWeek,
	customDailyFocusGoal,
}) => {

	// Check if this date has a custom goal
	const customGoalForDay = customDailyFocusGoal?.[dateKey];
	const hasCustomGoal = customGoalForDay !== undefined;

	// Use dayData if available, otherwise show 0 progress
	const totalFocused = dayData?.totalFocusDurationForDay || 0;
	// Use custom goal if set for this date, otherwise use default
	const goalForDay = hasCustomGoal ? customGoalForDay : (dayData?.goalSeconds || defaultGoalSeconds);
	// Recalculate percentage based on the actual goal (custom or default)
	const percentage = goalForDay > 0 ? (totalFocused / goalForDay) * 100 : 0;

	// Check if today
	const isToday = areDatesEqual(new Date(), day);

	// Check if this is a rest day
	const isRestDay = restDays?.[dateKey] ?? false;

	// Check if this is a freebie day (day of week is not selected)
	const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as
		| 'monday'
		| 'tuesday'
		| 'wednesday'
		| 'thursday'
		| 'friday'
		| 'saturday'
		| 'sunday';
	const isFreebieDay = !(selectedDaysOfWeek?.[dayOfWeek] ?? true);

	// Tooltip content
	const tooltipContent = (
		<div className="text-base whitespace-nowrap">
			<div className="text-center font-bold">
				<span className="text-lg" style={{ color: themeColor }}>{getFormattedDuration(totalFocused, false)}</span>
				<span className="mx-[2px] opacity-60" style={{ color: themeColor }}>/</span>
				<span className="text-base opacity-60" style={{ color: themeColor }}>{getFormattedDuration(goalForDay, false)}</span>
			</div>
			<div className="text-color-gray-100 text-center">{percentage.toFixed(2)}%</div>
			{hasCustomGoal && (
				<div className="flex items-center justify-center gap-1 mb-0">
					<span className="text-color-gray-100">Custom Goal</span>
					<Icon name="acute" fill={1} customClass="!text-[20px]" />
				</div>
			)}
			{isFreebieDay && (
				<div className="flex items-center justify-center gap-1 mb-0">
					<span className="text-color-gray-100">Freebie Day</span>
					<Icon name="featured_seasonal_and_gifts" fill={1} customClass="!text-[20px] text-sky-300" />
				</div>
			)}
			{isRestDay && (
				<div className="flex items-center justify-center gap-1 mb-0">
					<span className="text-color-gray-100">Rest Day</span>
					<Icon name="beach_access" fill={1} customClass="!text-[20px]" />
				</div>
			)}
		</div>
	);

	return (
		<Tooltip content={tooltipContent} position="top">
			<div className="flex items-center justify-center relative">
				<div style={{ width: '40px', height: '40px' }}>
					<CircularProgressbarWithChildren
						value={percentage}
						strokeWidth={10}
						styles={buildStyles({
							pathColor: themeColor,
							trailColor: hexToRgba(themeColor, 0.2)
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

				{/* Rest day icon */}
				{isRestDay && (
					<Icon
						name="beach_access"
						fill={1}
						customClass="!text-[16px] absolute bottom-0 right-0 p-[2px] rounded-full bg-blue-600"
					/>
				)}
			</div>
		</Tooltip>
	);
};

export default FocusGoalCalendarDay;
