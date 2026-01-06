import classNames from 'classnames';
import { useState, useRef } from 'react';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getAllDatesInYear, getFormattedLongDay } from '../../../../utils/date.utils';
import { getFormattedDuration } from '../../../../utils/helpers.utils';
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
	const { chosenColorName, chosenColorVariantsObj } = useThemeContext();

	const durations = [
		{
			value: '0m',
			bgColor: 'bg-color-gray-600',
		},
		{
			value: '0-59m',
			bgColor: chosenColorVariantsObj[`${chosenColorName}-200`].bgColor,
		},
		{
			value: '1h+',
			bgColor: chosenColorVariantsObj[`${chosenColorName}-300`].bgColor,
		},
		{
			value: '2h+',
			bgColor: chosenColorVariantsObj[`${chosenColorName}-400`].bgColor,
		},
		{
			value: '3h+',
			bgColor: chosenColorVariantsObj[`${chosenColorName}-500`].bgColor,
		},
		{
			value: '4h+',
			bgColor: chosenColorVariantsObj[`${chosenColorName}-600`].bgColor,
		},
		{
			value: '5h+',
			bgColor: chosenColorVariantsObj[`${chosenColorName}-800`].bgColor,
		},
		{
			value: '6h+',
			bgColor: chosenColorVariantsObj[`${chosenColorName}-900`].bgColor,
		},
	];

	const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return (
		<div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
			<div className="flex justify-center w-full sm:w-auto">
				<div>
					<div className="hidden sm:flex lg:hidden xl:flex justify-between text-color-gray-100">
						{monthsShort.map((month) => (
							<div key={month}>{month}</div>
						))}
					</div>

					<div className="flex justify-between text-color-gray-100 sm:hidden lg:flex xl:hidden">
						{monthsShort.map((month, index) => index % 2 === 0 && <div key={month}>{month}</div>)}
					</div>

					<div className="flex flex-col flex-wrap max-h-[340px] sm:max-h-[210px] md:max-h-[150px] lg:max-h-[250px] xl:max-h-[210px]">
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
					<div key={duration.value} className="flex items-center text-color-gray-100 gap-1">
						<div
							className={classNames(`h-[13px] w-[13px] border border-color-gray-100`, duration.bgColor)}
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
	const rangeClass = getRangeClass(focusDurationForDay, themeContext);

	const formattedDurationForTheDay = getFormattedDuration(focusDurationForDay, false);

	return (
		<div className="relative">
			<div
				key={date.toLocaleDateString()}
				className={classNames(
					`h-[15px] w-[15px] cursor-pointer border-[1.25px] border-color-gray-600 hover:border-[2px]`,
					rangeClass,
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

const getRangeClass = (seconds: number, themeContext: ReturnType<typeof useThemeContext>): string => {
	const { chosenColorName, chosenColorVariantsObj } = themeContext;

	// 6 hours - 5m offset = 21300 seconds
	if (seconds >= 21300) {
		return chosenColorVariantsObj[`${chosenColorName}-900`].bgColor;
	}

	// 5 hours - 5m offset = 17700 seconds
	if (seconds >= 17700) {
		return chosenColorVariantsObj[`${chosenColorName}-700`].bgColor;
	}

	// 4 hours - 5m offset = 14100 seconds
	if (seconds >= 14100) {
		return chosenColorVariantsObj[`${chosenColorName}-600`].bgColor;
	}

	// 3 hours - 5m offset = 10500 seconds
	if (seconds >= 10500) {
		return chosenColorVariantsObj[`${chosenColorName}-500`].bgColor;
	}

	// 2 hours - 5m offset = 6900 seconds
	if (seconds >= 6900) {
		return chosenColorVariantsObj[`${chosenColorName}-400`].bgColor;
	}

	// 1 hour - 5m offset = 3300 seconds
	if (seconds >= 3300) {
		return chosenColorVariantsObj[`${chosenColorName}-300`].bgColor;
	}

	// Any time > 0
	if (seconds > 0) {
		return chosenColorVariantsObj[`${chosenColorName}-100`].bgColor;
	}

	// 0 seconds
	return 'bg-color-gray-700';
};

export default CalendarHeatmap;
