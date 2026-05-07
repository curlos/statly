import classNames from 'classnames';
import { useState, useRef } from 'react';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getAllDatesInYear, getFormattedLongDay } from '../../../../utils/date.utils';
import { getFormattedDuration } from '../../../../utils/helpers.utils';
import { getHeatmapColors } from '../../../../utils/color.utils';
import type { FocusStatsResponse, FocusStatsByDayItem } from '../../../../types/api';

interface DayDurationData {
	duration: number;
}

interface CalendarHeatmapProps {
	selectedDates: Date[];
	statsData?: FocusStatsResponse;
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ selectedDates, statsData }) => {
	// Convert API data to grouped by date format
	const focusRecordsGroupedByDate: Record<string, DayDurationData> = {};
	(statsData?.byDay || []).forEach((day: FocusStatsByDayItem) => {
		// Parse date as local date (YYYY-MM-DD format from backend)
		const [year, month, dayNum] = day.date.split('-').map(Number);
		const localDate = new Date(year, month - 1, dayNum);
		focusRecordsGroupedByDate[getFormattedLongDay(localDate)] = { duration: day.duration };
	});

	const allDatesInYear = getAllDatesInYear(selectedDates[0].getFullYear());
	const { chosenColorObj } = useThemeContext();
	const { hexColor } = chosenColorObj;

	const heatmapColors = getHeatmapColors(hexColor);
	const zeroColor = 'var(--color-gray-200)';
	const durations = [
		{ value: '0m',    bgStyle: { backgroundColor: zeroColor } },
		{ value: '0-59m', bgStyle: { backgroundColor: heatmapColors[6] } },
		{ value: '1h+',   bgStyle: { backgroundColor: heatmapColors[5] } },
		{ value: '2h+',   bgStyle: { backgroundColor: heatmapColors[4] } },
		{ value: '3h+',   bgStyle: { backgroundColor: heatmapColors[3] } },
		{ value: '4h+',   bgStyle: { backgroundColor: heatmapColors[2] } },
		{ value: '5h+',   bgStyle: { backgroundColor: heatmapColors[1] } },
		{ value: '6h+',   bgStyle: { backgroundColor: heatmapColors[0] } },
	];

	const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return (
		<div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
			<div className="flex justify-center w-full sm:w-auto">
				<div>
					<div className="hidden sm:flex lg:hidden xl:flex justify-between text-color-gray-50">
						{monthsShort.map((month) => (
							<div key={month}>{month}</div>
						))}
					</div>

					<div className="flex justify-between text-color-gray-100 sm:hidden lg:flex xl:hidden">
						{monthsShort.map((month, index) => index % 2 === 0 && <div key={month}>{month}</div>)}
					</div>

					<div className="grid grid-flow-col grid-rows-[repeat(auto-fill,_15px)] max-h-[360px] sm:max-h-[210px] md:max-h-[150px] lg:max-h-[250px] xl:max-h-[210px] gap-[1px]">
						{allDatesInYear.map((date) => (
							<CalendarDay
								key={date.toLocaleDateString()}
								date={date}
								focusRecordsGroupedByDate={focusRecordsGroupedByDate}
							/>
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-row sm:flex-col flex-wrap gap-2 mt-2">
				{durations.map((duration) => (
					<div key={duration.value} className="flex items-center text-color-gray-50 gap-1">
						<div
							style={duration.bgStyle}
							className="h-[13px] w-[13px] border border-color-gray-50 rounded"
						></div>
						{duration.value}
					</div>
				))}
			</div>
		</div>
	);
};

interface CalendarDayProps {
	date: Date;
	focusRecordsGroupedByDate: Record<string, DayDurationData>;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date, focusRecordsGroupedByDate }) => {
	const [isHovering, setIsHovering] = useState(false);
	const dropdownRef = useRef(null);
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const dateKey = getFormattedLongDay(date);
	const focusDataForDate = focusRecordsGroupedByDate?.[dateKey];
	const focusDurationForDay = focusDataForDate?.duration || 0;
	const rangeStyle = getRangeStyle(focusDurationForDay, chosenColorObj.hexColor);

	const formattedDurationForTheDay = getFormattedDuration(focusDurationForDay, false);

	return (
		<div className="relative">
			<div
				key={date.toLocaleDateString()}
				style={rangeStyle}
				className={classNames(
					`h-[15px] w-[15px] flex-shrink-0 cursor-pointer border-[1.25px] border-color-gray-600 hover:border-[2px] rounded`,
					chosenColorObj.hover.borderColor
				)}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				onClick={() => setIsHovering(!isHovering)}
			></div>

			<Dropdown
				toggleRef={dropdownRef}
				isVisible={isHovering}
				setIsVisible={setIsHovering}
				customClasses={'!bg-black'}
			>
				<div className={classNames(chosenColorObj.textColor, 'p-2 text-[16px] bg-black text-nowrap rounded')}>
					<div>{dateKey}</div>
					<div className="font-bold">{formattedDurationForTheDay}</div>
				</div>
			</Dropdown>
		</div>
	);
};

const getRangeStyle = (seconds: number, hexColor: string): React.CSSProperties => {
	const colors = getHeatmapColors(hexColor);

	// 6 hours - 5m offset = 21300 seconds
	if (seconds >= 21300) return { backgroundColor: colors[0] };

	// 5 hours - 5m offset = 17700 seconds
	if (seconds >= 17700) return { backgroundColor: colors[1] };

	// 4 hours - 5m offset = 14100 seconds
	if (seconds >= 14100) return { backgroundColor: colors[2] };

	// 3 hours - 5m offset = 10500 seconds
	if (seconds >= 10500) return { backgroundColor: colors[3] };

	// 2 hours - 5m offset = 6900 seconds
	if (seconds >=  6900) return { backgroundColor: colors[4] };

	// 1 hour - 5m offset = 3300 seconds
	if (seconds >=  3300) return { backgroundColor: colors[5] };

	// Any time > 0
	if (seconds >      0) return { backgroundColor: colors[6] };

	// 0 seconds
	return { backgroundColor: 'var(--color-gray-200)' };
};

export default CalendarHeatmap;
