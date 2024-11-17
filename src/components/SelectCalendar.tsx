import { useEffect, useState } from 'react';
import Icon from './Icon';
import {
	areDatesEqual,
	formatCheckedInDayDate,
	getAllDaysInWeekFromDate,
	getAllMonths,
	getCalendarMonth,
} from '../utils/date.utils';
import { setTimeOnDateString } from '../utils/date.utils';
import classNames from 'classnames';
import { useThemeContext } from '../contexts/useThemeContext';

interface CalendarProps {
	dueDate: Date | null;
	setDueDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const SelectCalendar: React.FC<CalendarProps> = ({
	dueDate,
	setDueDate,
	time,
	connectedCurrentDate,
	setConnectedCurrentDate,
	selectedInterval,
	outerCurrentDate,
}) => {
	const { chosenColorObj } = useThemeContext();

	const [localCurrentDate, setLocalCurrentDate] = useState(new Date());
	const [allDaysInWeekFromDate, setAllDaysInWeekFromDate] = useState(null);

	useEffect(() => {
		if (dueDate) {
			let newDueDate = dueDate;

			if (time) {
				newDueDate = dueDate ? dueDate : new Date();
				const newDateObject = setTimeOnDateString(newDueDate, time);
				newDueDate = newDateObject;
			}

			setLocalCurrentDate(newDueDate);
		}
	}, [dueDate]);

	useEffect(() => {
		if (connectedCurrentDate) {
			setLocalCurrentDate(connectedCurrentDate);
		}
	}, [connectedCurrentDate]);

	// Month
	const goToPreviousMonth = () => {
		setLocalCurrentDate(new Date(localCurrentDate.getFullYear(), localCurrentDate.getMonth() - 1, 1));
	};

	const goToNextMonth = () => {
		setLocalCurrentDate(new Date(localCurrentDate.getFullYear(), localCurrentDate.getMonth() + 1, 1));
	};

	// Year
	const goToPreviousYear = () => {
		setLocalCurrentDate(
			new Date(localCurrentDate.getFullYear() - 1, localCurrentDate.getMonth(), localCurrentDate.getDate())
		);
	};

	const goToNextYear = () => {
		setLocalCurrentDate(
			new Date(localCurrentDate.getFullYear() + 1, localCurrentDate.getMonth(), localCurrentDate.getDate())
		);
	};

	const calendarMonth = getCalendarMonth(localCurrentDate.getFullYear(), localCurrentDate.getMonth());
	const monthName = localCurrentDate.toLocaleString('default', { month: 'long' });

	useEffect(() => {
		if (selectedInterval === 'Week') {
			const newAllDaysInWeekFromDate = {};

			getAllDaysInWeekFromDate(outerCurrentDate).forEach((day) => {
				const dateKey = formatCheckedInDayDate(day);
				newAllDaysInWeekFromDate[dateKey] = day;
			});

			setAllDaysInWeekFromDate(newAllDaysInWeekFromDate);
		} else {
			setAllDaysInWeekFromDate(null);
		}
	}, [selectedInterval, outerCurrentDate]);

	const [showYearView, setShowYearView] = useState(false);

	return (
		<div>
			<div className="flex items-center justify-between px-4">
				<div className="flex-1 cursor-pointer" onClick={() => setShowYearView(!showYearView)}>
					{showYearView
						? `${localCurrentDate.getFullYear()}`
						: `${monthName} ${localCurrentDate.getFullYear()}`}
				</div>
				<div className="flex items-center">
					<Icon
						name="keyboard_double_arrow_left"
						fill={0}
						customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						onClick={goToPreviousYear}
					/>
					<Icon
						name="chevron_left"
						fill={0}
						customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						onClick={goToPreviousMonth}
					/>
					<Icon
						name="fiber_manual_record"
						fill={0}
						customClass={'text-color-gray-50 !text-[14px] hover:text-white cursor-pointer'}
					/>
					<Icon
						name="chevron_right"
						fill={0}
						customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						onClick={goToNextMonth}
					/>
					<Icon
						name="keyboard_double_arrow_right"
						fill={0}
						customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
						onClick={goToNextYear}
					/>
				</div>
			</div>

			{showYearView ? (
				<YearView {...{ localCurrentDate, setLocalCurrentDate, setDueDate, setShowYearView }} />
			) : (
				<MonthView
					{...{
						calendarMonth,
						allDaysInWeekFromDate,
						localCurrentDate,
						selectedInterval,
						setConnectedCurrentDate,
						setLocalCurrentDate,
						chosenColorObj,
						dueDate,
						setDueDate,
						time,
					}}
				/>
			)}
		</div>
	);
};

const MonthView = ({
	calendarMonth,
	allDaysInWeekFromDate,
	localCurrentDate,
	selectedInterval,
	setConnectedCurrentDate,
	setLocalCurrentDate,
	chosenColorObj,
	dueDate,
	setDueDate,
	time,
}) => {
	return (
		<div className="w-full text-[12px] p-3">
			<div>
				<div className="grid grid-cols-7 gap-1 text-center">
					{['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, i) => (
						<div key={day + i} className="py-1">
							{day}
						</div>
					))}
				</div>
			</div>
			<div className="text-center">
				{calendarMonth.map((week, index) => {
					let isSelectedWeek = false;

					if (allDaysInWeekFromDate) {
						const firstDayOfThisWeekKey = formatCheckedInDayDate(week[0]);
						isSelectedWeek = allDaysInWeekFromDate[firstDayOfThisWeekKey];
					}

					return (
						<div
							key={`week-${index}`}
							className={classNames(
								'mb-1 grid grid-cols-7 gap-1',
								isSelectedWeek && 'bg-color-gray-200 rounded-full'
							)}
						>
							{week.map((day, index) => {
								const isCurrentMonth = day.getMonth() === localCurrentDate.getMonth();
								const isDayToday = areDatesEqual(new Date(), day);
								const isChosenDay = areDatesEqual(dueDate, day);
								let appliedStyles = [];

								if (isCurrentMonth) {
									if (isChosenDay && selectedInterval !== 'Week') {
										appliedStyles.push(`${chosenColorObj.bgColor} text-white`);
									} else if (isDayToday) {
										appliedStyles.push(
											`bg-color-gray-200 hover:bg-color-gray-200 ${chosenColorObj.textColor}`
										);
									} else {
										appliedStyles.push('text-white bg-transparent hover:bg-color-gray-300');
									}
								} else {
									appliedStyles.push('text-color-gray-100 bg-transparent hover:bg-color-gray-20');
								}

								const handleClick = () => {
									setLocalCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));

									let newDueDate = day ? day : new Date();

									if (time) {
										const newDateObject = setTimeOnDateString(newDueDate, time);
										newDueDate = newDateObject;
									}

									if (selectedInterval === 'Week') {
										if (setConnectedCurrentDate) {
											setConnectedCurrentDate(newDueDate);
										}

										// setOuterCurrentDate(newDueDate);
									} else {
										if (setConnectedCurrentDate) {
											setConnectedCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));
										}
										setDueDate(newDueDate);
									}
								};

								return (
									<div
										key={`day-${index}`}
										className={`py-1 cursor-pointer rounded-full ${appliedStyles}`}
										onClick={handleClick}
									>
										{day.getDate()}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const YearView = ({ localCurrentDate, setLocalCurrentDate, setDueDate, setShowYearView }) => {
	const { chosenColorObj } = useThemeContext();
	const monthsOfYear = getAllMonths(localCurrentDate);

	return (
		<div className="grid grid-cols-3 gap-2 my-3">
			{monthsOfYear.map((monthDate) => {
				const monthName = monthDate.toLocaleString('default', { month: 'short' });

				// Check if the current monthDate has the same month and year as localCurrentDate
				const isSelected =
					monthDate.getFullYear() === localCurrentDate.getFullYear() &&
					monthDate.getMonth() === localCurrentDate.getMonth();

				return (
					<div
						className="flex justify-center"
						onClick={() => {
							setLocalCurrentDate(monthDate);
							setDueDate(monthDate);
							setShowYearView(false);
						}}
					>
						<div
							className={classNames(
								'flex justify-center items-center h-[40px] w-[40px] cursor-pointer rounded-full',
								isSelected ? chosenColorObj.bgColor : 'bg-color-gray-600'
							)}
						>
							{monthName}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default SelectCalendar;
