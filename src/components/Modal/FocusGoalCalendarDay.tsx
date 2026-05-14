import { CircularProgressbarWithChildren, CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Tooltip from '../Tooltip';
import { getFormattedDuration } from '../../utils/helpers.utils';
import { areDatesEqual } from '../../utils/date.utils';
import { hexToRgba } from '../../utils/color.utils';
import { truncateText } from '../../utils/text.utils';
import classNames from 'classnames';
import Icon from '../Icon';
import { useThemeContext } from '../../contexts/useThemeContext';
import useWindowSize from '../../hooks/useWindowSize';

// Helper function to check if a date falls within any inactive period
const isDateInInactivePeriod = (
	dateKey: string,
	inactivePeriods?: Array<{ startDate: string; endDate: string | null }>
): boolean => {
	if (!inactivePeriods || inactivePeriods.length === 0) {
		return false;
	}

	return inactivePeriods.some(period => {
		const { startDate, endDate } = period;

		// If endDate is null, period is still active (currently paused)
		if (endDate === null) {
			return dateKey >= startDate;
		}

		// Check if date is within the closed period [startDate, endDate]
		return dateKey >= startDate && dateKey <= endDate;
	});
};

interface RingData {
	ringId: string;
	ringName: string;
	color: string | null;
	useThemeColor?: boolean;
	duration: number;
	goal: number;
	percentage: number;
	restDays: Record<string, boolean>;
	selectedDaysOfWeek: Record<string, boolean>;
	customDailyFocusGoal?: Record<string, number>;
	inactivePeriods?: Array<{ startDate: string; endDate: string | null }>;
}

interface FocusGoalCalendarDayProps {
	mode: 'single' | 'combined';
	day: Date;
	dateKey: string;
	themeColor: string;
	tabIndex?: number;
	// Single mode props
	dayData?: {
		goalSeconds: number;
		totalFocusDurationForDay: number;
		percentageOfFocusedGoalHours: number;
	};
	goalSeconds?: number;
	restDays?: Record<string, boolean>;
	selectedDaysOfWeek?: Record<string, boolean>;
	customDailyFocusGoal?: Record<string, number>;
	inactivePeriods?: Array<{ startDate: string; endDate: string | null }>;
	// Combined mode props
	ringsData?: RingData[];
}

const FocusGoalCalendarDay: React.FC<FocusGoalCalendarDayProps> = ({
	mode,
	day,
	dateKey,
	themeColor,
	tabIndex,
	dayData,
	goalSeconds: defaultGoalSeconds,
	restDays,
	selectedDaysOfWeek,
	customDailyFocusGoal,
	inactivePeriods,
	ringsData,
}) => {
	const { chosenColorObj } = useThemeContext();
	const { width } = useWindowSize();
	const truncateLength = (width ?? 0) >= 576 ? 20 : 15;

	// Check if today
	const isToday = areDatesEqual(new Date(), day);

	// Multi-ring mode
	if (mode === 'combined' && ringsData) {
		// Use thinner strokes and smaller sizes on mobile to prevent overlap
		const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
		// Ring sizes for concentric circles (largest to smallest)
		const sizes = isMobile
			? (ringsData.length === 3 ? [38, 32, 24] : [40, 32])
			: (ringsData.length === 3 ? [50, 40, 30] : [50, 40]);
		const baseStrokeWidth = isMobile ? 5 : 7;

		// Multi-ring tooltip content
		const multiRingTooltipContent = (
			<div className="flex gap-4 items-start">
				{/* Left side: Ring stats */}
				<div className="space-y-1 flex-shrink-0">
					{ringsData.map((ring) => {
						const displayColor = ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor);
						const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as
							| 'monday'
							| 'tuesday'
							| 'wednesday'
							| 'thursday'
							| 'friday'
							| 'saturday'
							| 'sunday';
						const isRestDay = ring.restDays?.[dateKey] ?? false;
						const isInInactivePeriod = isDateInInactivePeriod(dateKey, ring.inactivePeriods);
						const isFreebieDay = !(ring.selectedDaysOfWeek?.[dayOfWeek] ?? true) || isRestDay;
						return (
							<div key={ring.ringId} className="whitespace-nowrap">
								<div className="text-xs font-semibold flex items-center gap-1" style={{ color: displayColor }}>
									{truncateText(ring.ringName, truncateLength)}
									{ring.customDailyFocusGoal?.[dateKey] !== undefined && (
										<Icon
											name="acute"
											fill={1}
											customClass="!text-[14px] text-sky-300"
										/>
									)}
									{isFreebieDay && (
										<Icon
											name="featured_seasonal_and_gifts"
											fill={1}
											customClass="!text-[14px] text-sky-300"
										/>
									)}
									{isInInactivePeriod && (
										<Icon name="pause" fill={1} customClass="!text-[14px] ml-1" />
									)}
								</div>
								<div className="text-sm font-bold flex items-baseline gap-1">
									<span style={{ color: displayColor }}>{getFormattedDuration(ring.duration, false)}</span>
									<span className="text-xs opacity-60" style={{ color: displayColor }}>/{getFormattedDuration(ring.goal, false)}</span>
								</div>
							</div>
						);
					})}
				</div>

				{/* Right side: Mini concentric circles visual */}
				<div className="relative flex-shrink-0" style={{ width: '60px', height: '60px' }}>
					{ringsData.map((ring, index) => {
						const visualSizes = ringsData.length === 3 ? [60, 48, 36] : [60, 48];
						const size = visualSizes[index];
						const strokeWidth = 7 * (visualSizes[0] / size);
						const displayColor = ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor);

						return (
							<div
								key={ring.ringId}
								className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
								style={{ width: `${size}px`, height: `${size}px` }}
							>
								<CircularProgressbar
									value={ring.percentage}
									strokeWidth={strokeWidth}
									styles={buildStyles({
										pathColor: displayColor,
										trailColor: hexToRgba(displayColor, 0.2),
									})}
								/>
							</div>
						);
					})}
				</div>
			</div>
		);

		const containerSize = isMobile ? 40 : 50;
		const dateLabel = day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
		const combinedAriaLabel = `${dateLabel} - ${ringsData.map(r =>
			`${r.ringName}: ${getFormattedDuration(r.duration, false)} / ${getFormattedDuration(r.goal, false)} (${r.percentage.toFixed(2)}%)`
		).join(', ')}`;

		return (
			<Tooltip content={multiRingTooltipContent} position="top" tabIndex={tabIndex ?? -1} ariaLabel={combinedAriaLabel}>
				<div className="flex items-center justify-center relative" style={{ width: `${containerSize}px`, height: `${containerSize}px` }}>
					{ringsData.map((ring, index) => {
						const size = sizes[index];
						const strokeWidth = baseStrokeWidth * (sizes[0] / size);
						const displayColor = ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor);

						return (
							<div
								key={ring.ringId}
								className="absolute flex items-center justify-center"
								style={{ width: `${size}px`, height: `${size}px` }}
							>
								<CircularProgressbar
									value={ring.percentage}
									strokeWidth={strokeWidth}
									styles={buildStyles({
										pathColor: displayColor,
										trailColor: hexToRgba(displayColor, 0.2),
									})}
								/>
							</div>
						);
					})}
					<div className={classNames('absolute text-xs', isToday ? 'font-bold text-white' : 'text-color-gray-50')}>
						{day.getDate()}
					</div>
				</div>
			</Tooltip>
		);
	}

	// Single ring mode (existing logic)

	// Check if this date has a custom goal
	const customGoalForDay = customDailyFocusGoal?.[dateKey];
	const hasCustomGoal = customGoalForDay !== undefined;

	// Use dayData if available, otherwise show 0 progress
	const totalFocused = dayData?.totalFocusDurationForDay || 0;
	// Use custom goal if set for this date, otherwise use default (fallback to 3600 seconds = 1 hour)
	const goalForDay = hasCustomGoal ? customGoalForDay : (dayData?.goalSeconds || defaultGoalSeconds || 3600);
	// Recalculate percentage based on the actual goal (custom or default)
	const percentage = goalForDay > 0 ? (totalFocused / goalForDay) * 100 : 0;

	// Check if this is a rest day
	const isRestDay = restDays?.[dateKey] ?? false;

	// Check if this is an inactive period day
	const isInInactivePeriod = isDateInInactivePeriod(dateKey, inactivePeriods);

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

	const singleDateLabel = day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	const singleAriaLabel = [
		`${singleDateLabel} - ${getFormattedDuration(totalFocused, false)} / ${getFormattedDuration(goalForDay, false)} - ${percentage.toFixed(2)}%`,
		hasCustomGoal && 'Custom Goal',
		isFreebieDay && 'Freebie Day',
		isRestDay && 'Rest Day',
		isInInactivePeriod && 'Inactive Period',
	].filter(Boolean).join(', ');

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
			{isInInactivePeriod && (
				<div className="flex items-center justify-center gap-1 mb-0">
					<span className="text-color-gray-100">Inactive Period</span>
					<Icon name="pause" fill={1} customClass="!text-[20px]" />
				</div>
			)}
		</div>
	);

	return (
		<Tooltip content={tooltipContent} position="top" tabIndex={tabIndex ?? -1} ariaLabel={singleAriaLabel}>
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
				{/* Inactive period icon */}
				{isInInactivePeriod && !isRestDay && (
					<Icon
						name="pause"
						fill={1}
						customClass="!text-[16px] absolute bottom-0 right-0 p-[2px] rounded-full bg-gray-500"
					/>
				)}
			</div>
		</Tooltip>
	);
};

export default FocusGoalCalendarDay;
