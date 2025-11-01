import classNames from 'classnames';
import { useState, useRef } from 'react';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getAllDatesInYear, getFormattedLongDay } from '../../../../utils/date.utils';
import { secondsToHoursAndMinutes, getFormattedDuration } from '../../../../utils/focus-apps/helpers.utils';

interface CalendarHeatmapProps {
	selectedDates: Date[];
	statsData: any;
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ selectedDates, statsData }) => {
	// Convert API data to grouped by date format
	const focusRecordsGroupedByDate: Record<string, { duration: number }> = {};
	(statsData?.byDay || []).forEach((day: any) => {
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

const CalendarDay = ({ date, focusRecordsGroupedByDate }) => {
	const [isHovering, setIsHovering] = useState(false);
	const dropdownRef = useRef(null);
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const dateKey = getFormattedLongDay(date);
	const focusDataForDate = focusRecordsGroupedByDate?.[dateKey];
	const focusDurationForDay = focusDataForDate?.duration || 0;
	const { hours, minutes } = secondsToHoursAndMinutes(focusDurationForDay);
	const rangeClass = getRangeClass(hours, minutes, themeContext);

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

const getRangeClass = (hours, minutes, themeContext): string => {
	const { chosenColorName, chosenColorVariantsObj } = themeContext;

	if (hours >= 6) {
		return chosenColorVariantsObj[`${chosenColorName}-900`].bgColor;
	}

	if (hours === 5) {
		return chosenColorVariantsObj[`${chosenColorName}-700`].bgColor;
	}

	if (hours === 4) {
		return chosenColorVariantsObj[`${chosenColorName}-600`].bgColor;
	}

	if (hours === 3) {
		return chosenColorVariantsObj[`${chosenColorName}-500`].bgColor;
	}

	if (hours === 2) {
		return chosenColorVariantsObj[`${chosenColorName}-400`].bgColor;
	}

	if (hours === 1) {
		return chosenColorVariantsObj[`${chosenColorName}-300`].bgColor;
	}

	if (minutes > 0) {
		return chosenColorVariantsObj[`${chosenColorName}-100`].bgColor;
	}

	if (hours === 0 && minutes === 0) {
		return 'bg-color-gray-700';
	}
};

export default CalendarHeatmap;
