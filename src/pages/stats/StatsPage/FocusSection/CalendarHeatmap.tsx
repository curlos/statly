import classNames from 'classnames';
import { useState, useRef, useEffect, forwardRef } from 'react';
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

const getActiveIndexForYear = (dates: Date[]) => {
	const today = new Date();
	if (dates[0].getFullYear() !== today.getFullYear()) return dates.length - 1;
	const jan1 = new Date(today.getFullYear(), 0, 1);
	return Math.floor((today.getTime() - jan1.getTime()) / 86400000);
};

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
	const year = selectedDates[0].getFullYear();
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

	// Roving tabindex: one Tab stop for the whole grid
	const [activeIndex, setActiveIndex] = useState(() => getActiveIndexForYear(allDatesInYear));
	const dayNodesRef = useRef<Array<HTMLButtonElement | null>>([]);

	// Live row count so ←/→ jumps by exactly one visual column at any breakpoint
	const gridRef = useRef<HTMLDivElement>(null);
	const [rowCount, setRowCount] = useState(14);

	// Reset active cell to today when the selected year changes
	useEffect(() => {
		setActiveIndex(getActiveIndexForYear(allDatesInYear));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [year]);

	// Track the grid's computed row count so column jumps stay accurate after resize
	useEffect(() => {
		const update = () => {
			if (!gridRef.current) return;
			const rows = window.getComputedStyle(gridRef.current).gridTemplateRows.split(' ').length;
			setRowCount(rows);
		};
		const observer = new ResizeObserver(update);
		if (gridRef.current) observer.observe(gridRef.current);
		update();
		return () => observer.disconnect();
	}, []);

	const handleGridKeyDown = (e: React.KeyboardEvent) => {
		let next = activeIndex;
		switch (e.key) {
			case 'ArrowUp':    next = activeIndex - 1; break;
			case 'ArrowDown':  next = activeIndex + 1; break;
			case 'ArrowLeft':  next = activeIndex - rowCount; break;
			case 'ArrowRight': next = activeIndex + rowCount; break;
			case 'Home': next = 0; break;
			case 'End':  next = allDatesInYear.length - 1; break;
			default: return;
		}
		next = Math.max(0, Math.min(allDatesInYear.length - 1, next));
		if (next !== activeIndex) {
			e.preventDefault();
			setActiveIndex(next);
			dayNodesRef.current[next]?.focus();
		}
	};

	return (
		<div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
			<div className="flex justify-center w-full sm:w-auto">
				<div className="relative">
					<div className="hidden sm:flex lg:hidden xl:flex justify-between text-color-gray-50">
						{monthsShort.map((month) => (
							<div key={month}>{month}</div>
						))}
					</div>

					<div className="flex justify-between text-color-gray-100 sm:hidden lg:flex xl:hidden">
						{monthsShort.map((month, index) => index % 2 === 0 && <div key={month}>{month}</div>)}
					</div>

					<p className="sr-only">Year-at-a-glance heatmap showing daily focus duration. Each cell represents one day; darker colors indicate more focus time. Use arrow keys to navigate between days.</p>
					<div
						ref={gridRef}
						className="grid grid-flow-col grid-rows-[repeat(auto-fill,_15px)] max-h-[360px] sm:max-h-[210px] md:max-h-[150px] lg:max-h-[250px] xl:max-h-[210px] gap-[1px]"
						role="grid"
						aria-label="Focus duration heatmap"
						onKeyDown={handleGridKeyDown}
					>
						{allDatesInYear.map((date, index) => (
							<CalendarDay
								key={date.toLocaleDateString()}
								date={date}
								focusRecordsGroupedByDate={focusRecordsGroupedByDate}
								isActive={index === activeIndex}
								ref={(el) => { dayNodesRef.current[index] = el; }}
								onFocus={() => setActiveIndex(index)}
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
	isActive: boolean;
	onFocus: () => void;
}

const CalendarDay = forwardRef<HTMLButtonElement, CalendarDayProps>(({ date, focusRecordsGroupedByDate, isActive, onFocus }, ref) => {
	const [isVisible, setIsVisible] = useState(false);
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
			<button
				ref={ref}
				type="button"
				aria-label={`${dateKey}: ${formattedDurationForTheDay}`}
				tabIndex={isActive ? 0 : -1}
				style={rangeStyle}
				className={classNames(
					'h-[15px] w-[15px] flex-shrink-0 cursor-pointer border-[1.25px] border-color-gray-600 hover:border-[2px] rounded p-0 relative',
					'focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-1 focus-visible:z-10',
					chosenColorObj.hover.borderColor
				)}
				onFocus={() => { setIsVisible(true); onFocus(); }}
				onBlur={() => setIsVisible(false)}
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
				onClick={() => setIsVisible(v => !v)}
			/>

			<Dropdown
				toggleRef={dropdownRef}
				isVisible={isVisible}
				setIsVisible={setIsVisible}
				customClasses={'!bg-black'}
			>
				<div className={classNames(chosenColorObj.textColor, 'p-2 text-[16px] bg-black text-nowrap rounded')}>
					<div>{dateKey}</div>
					<div className="font-bold">{formattedDurationForTheDay}</div>
				</div>
			</Dropdown>
		</div>
	);
});

CalendarDay.displayName = 'CalendarDay';

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
