import { useEffect, useRef } from 'react';
import Icon from '../../../../components/Icon';
import {
	getAllDaysInWeekFromDate,
	getAllDaysInMonthFromDate,
	getAllDaysInYearFromDate,
	getAllDaysInRange,
	formatCheckedInDayDate,
	getFormattedShortMonthDay,
	getSmartDateForIntervalChange,
} from '../../../../utils/date.utils';

interface DateRangePickerProps {
	selectedDates: Date[];
	setSelectedDates: (dates: Date[]) => void;
	selectedInterval: string;
	startDate?: Date;
	endDate?: Date;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ selectedDates, setSelectedDates, selectedInterval, startDate, endDate }) => {
	// Track previous interval to detect changes
	const prevIntervalRef = useRef<string>(selectedInterval);

	useEffect(() => {
		const firstDay = selectedDates[0] || new Date();
		const previousInterval = prevIntervalRef.current;

		// Check if interval actually changed
		const intervalChanged = previousInterval !== selectedInterval;

		// When switching TO Custom, let DateRangeSection handle the state updates
		const switchingToCustom = intervalChanged && selectedInterval === 'Custom';
		if (switchingToCustom) {
			prevIntervalRef.current = selectedInterval;
			return;
		}

		// Determine the date to use
		let dateToUse: Date;
		if (intervalChanged && selectedInterval !== 'Custom') {
			// Use smart navigation when interval changes
			dateToUse = getSmartDateForIntervalChange(
				firstDay,
				previousInterval,
				selectedInterval
			);
		} else {
			// Preserve current date when not changing intervals
			dateToUse = firstDay;
		}

		// Apply the interval-specific date range
		switch (selectedInterval) {
			case 'Day':
				setSelectedDates([dateToUse]);
				break;
			case 'Week':
				setSelectedDates(getAllDaysInWeekFromDate(dateToUse));
				break;
			case 'Month':
				setSelectedDates(getAllDaysInMonthFromDate(dateToUse));
				break;
			case 'Year':
				setSelectedDates(getAllDaysInYearFromDate(dateToUse));
				break;
			case 'Custom':
				if (startDate && endDate) {
					setSelectedDates(getAllDaysInRange(startDate, endDate));
				}
				break;
		}

		// Update the ref for next comparison
		prevIntervalRef.current = selectedInterval;

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedInterval, startDate, endDate]);

	const handleArrowClick = (arrowType: 'left' | 'right') => {
		const firstDay = selectedDates[0] || new Date();
		const date = new Date(firstDay);
		switch (selectedInterval) {
			case 'Day':
				date.setDate(date.getDate() + (arrowType === 'left' ? -1 : 1));
				setSelectedDates([date]);
				break;
			case 'Week':
				date.setDate(date.getDate() + (arrowType === 'left' ? -7 : 7));
				setSelectedDates(getAllDaysInWeekFromDate(date));
				break;
			case 'Month':
				date.setMonth(date.getMonth() + (arrowType === 'left' ? -1 : 1));
				setSelectedDates(getAllDaysInMonthFromDate(date));
				break;
			case 'Year':
				date.setFullYear(date.getFullYear() + (arrowType === 'left' ? -1 : 1));
				setSelectedDates(getAllDaysInYearFromDate(date)); // Depending on your app's need, adjust this line
				break;
			default:
				break;
		}
	};

	const getFormattedSelectedDates = () => {
		const firstDay = selectedDates[0] || new Date();

		switch (selectedInterval) {
			case 'Day':
				return formatCheckedInDayDate(firstDay);
			case 'Week':
				return `${getFormattedShortMonthDay(firstDay)} - ${getFormattedShortMonthDay(selectedDates[selectedDates.length - 1])}`;
			case 'Month':
				return firstDay.toLocaleString('default', { month: 'long', year: 'numeric' });
			case 'Year':
				return firstDay.toLocaleString('default', { year: 'numeric' });
			case 'Custom':
				return startDate && endDate ? `${getFormattedShortMonthDay(startDate)} - ${getFormattedShortMonthDay(endDate)}` : '';
		}
	};

	return (
		<>
			<div aria-live="polite" aria-atomic="true" className="sr-only">{getFormattedSelectedDates()}</div>
			<div className="flex justify-between items-center gap-3 bg-color-gray-600 py-2 rounded-md">
				<button
					type="button"
					aria-label={`Previous ${selectedInterval.toLowerCase()}`}
					className="bg-transparent border-0 p-0 cursor-pointer"
					onClick={() => handleArrowClick('left')}
				>
					<Icon name="keyboard_arrow_left" customClass="!text-[20px] mt-[2px] text-color-gray-100" />
				</button>
				<div className="text-[14px] sm:text-[16px]">{getFormattedSelectedDates()}</div>
				<button
					type="button"
					aria-label={`Next ${selectedInterval.toLowerCase()}`}
					className="bg-transparent border-0 p-0 cursor-pointer"
					onClick={() => handleArrowClick('right')}
				>
					<Icon name="keyboard_arrow_right" customClass="!text-[20px] mt-[2px] text-color-gray-100" />
				</button>
			</div>
		</>
	);
};

export default DateRangePicker;
