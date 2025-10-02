import { useEffect } from 'react';
import Icon from '../../../../components/Icon';
import {
	getAllDaysInWeekFromDate,
	getAllDaysInMonthFromDate,
	getAllDaysInYearFromDate,
	getAllDaysInRange,
	formatCheckedInDayDate,
	getFormattedShortMonthDay,
} from '../../../../utils/date.utils';

const DateRangePicker = ({ selectedDates, setSelectedDates, selectedInterval, startDate, endDate }) => {
	useEffect(() => {
		const firstDay = selectedDates[0] || new Date();

		switch (selectedInterval) {
			case 'Day':
				setSelectedDates([firstDay]);
				break;
			case 'Week':
				setSelectedDates(getAllDaysInWeekFromDate(firstDay));
				break;
			case 'Month':
				setSelectedDates(getAllDaysInMonthFromDate(firstDay));
				break;
			case 'Year':
				setSelectedDates(getAllDaysInYearFromDate(firstDay));
				break;
			case 'Custom':
				setSelectedDates(getAllDaysInRange(startDate, endDate));
				break;
		}
	}, [selectedInterval, startDate, endDate]);

	const handleArrowClick = (arrowType) => {
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
				return `${getFormattedShortMonthDay(startDate)} - ${getFormattedShortMonthDay(endDate)}`;
		}
	};

	return (
		<div className="flex justify-between items-center gap-3 bg-color-gray-600 py-2 rounded-md">
			<Icon
				name="keyboard_arrow_left"
				customClass="!text-[20px] mt-[2px] cursor-pointer text-color-gray-100"
				onClick={() => {
					handleArrowClick('left');
				}}
			/>
			<div className="text-[14px] sm:text-[16px]">{getFormattedSelectedDates()}</div>
			<Icon
				name="keyboard_arrow_right"
				customClass="!text-[20px] mt-[2px] cursor-pointer text-color-gray-100"
				onClick={() => {
					handleArrowClick('right');
				}}
			/>
		</div>
	);
};

export default DateRangePicker;
