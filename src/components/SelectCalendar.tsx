import { useEffect, useRef, useState } from 'react';
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
	time?: string;
	connectedCurrentDate?: Date;
	setConnectedCurrentDate?: React.Dispatch<React.SetStateAction<Date>>;
	selectedInterval?: string;
	outerCurrentDate?: Date;
	onConfirm?: () => void;
}

const NAV_BTN_CLASS = 'inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded';

const SelectCalendar: React.FC<CalendarProps> = ({
	dueDate,
	setDueDate,
	time,
	connectedCurrentDate,
	setConnectedCurrentDate,
	selectedInterval,
	outerCurrentDate,
	onConfirm,
}) => {
	const { chosenColorObj } = useThemeContext();

	const [localCurrentDate, setLocalCurrentDate] = useState(new Date());
	const [allDaysInWeekFromDate, setAllDaysInWeekFromDate] = useState<Record<string, Date> | null>(null);

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
	}, [dueDate, time]);

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
	const currentYear = localCurrentDate.getFullYear();

	useEffect(() => {
		if (selectedInterval === 'Week') {
			const newAllDaysInWeekFromDate: Record<string, Date> = {};

			getAllDaysInWeekFromDate(outerCurrentDate ?? new Date()).forEach((day) => {
				const dateKey = formatCheckedInDayDate(day);
				newAllDaysInWeekFromDate[dateKey] = day;
			});

			setAllDaysInWeekFromDate(newAllDaysInWeekFromDate);
		} else {
			setAllDaysInWeekFromDate(null);
		}
	}, [selectedInterval, outerCurrentDate]);

	const [showYearView, setShowYearView] = useState(false);
	const shouldFocusMonthGrid = useRef(false);

	return (
		<div>
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{`${monthName} ${currentYear}`}
			</div>
			<div className="flex items-center justify-between px-4">
				<button
					type="button"
					aria-label={showYearView ? `${currentYear}, switch to month view` : `${monthName} ${currentYear}, switch to year view`}
					className="flex-1 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
					onClick={() => setShowYearView(!showYearView)}
				>
					{showYearView ? `${currentYear}` : `${monthName} ${currentYear}`}
				</button>
				<div className="flex items-center">
					<button type="button" aria-label="Previous year" onClick={goToPreviousYear} className={NAV_BTN_CLASS}>
						<Icon name="keyboard_double_arrow_left" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white'} />
					</button>
					<button type="button" aria-label="Previous month" onClick={goToPreviousMonth} className={NAV_BTN_CLASS}>
						<Icon name="chevron_left" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white'} />
					</button>
					<Icon name="fiber_manual_record" fill={0} customClass={'text-color-gray-50 !text-[14px] leading-none'} />
					<button type="button" aria-label="Next month" onClick={goToNextMonth} className={NAV_BTN_CLASS}>
						<Icon name="chevron_right" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white'} />
					</button>
					<button type="button" aria-label="Next year" onClick={goToNextYear} className={NAV_BTN_CLASS}>
						<Icon name="keyboard_double_arrow_right" fill={0} customClass={'text-color-gray-50 !text-[18px] hover:text-white'} />
					</button>
				</div>
			</div>

			{showYearView ? (
				<YearView {...{
					localCurrentDate,
					setLocalCurrentDate,
					setDueDate,
					setShowYearView: () => {
						shouldFocusMonthGrid.current = true;
						setShowYearView(false);
					},
				}} />
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
						onConfirm,
						focusGridRef: shouldFocusMonthGrid,
					}}
				/>
			)}
		</div>
	);
};

interface MonthViewProps {
	calendarMonth: Date[][];
	allDaysInWeekFromDate: Record<string, Date> | null;
	localCurrentDate: Date;
	selectedInterval?: string;
	setConnectedCurrentDate?: (date: Date) => void;
	setLocalCurrentDate: (date: Date) => void;
	chosenColorObj: ReturnType<typeof useThemeContext>['chosenColorObj'];
	dueDate: Date | null;
	setDueDate: (date: Date | null) => void;
	time?: string;
	onConfirm?: () => void;
	focusGridRef?: React.MutableRefObject<boolean>;
}

const MonthView: React.FC<MonthViewProps> = ({
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
	onConfirm,
	focusGridRef,
}) => {
	const [focusedDate, setFocusedDate] = useState<Date>(dueDate ?? new Date());
	const gridRef = useRef<HTMLDivElement>(null);
	const pendingFocusKey = useRef<string | null>(null);

	// When transitioning from YearView, focus the active day button on mount
	useEffect(() => {
		if (!focusGridRef?.current || !gridRef.current) return;
		focusGridRef.current = false;
		const d = dueDate ?? new Date();
		const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
		const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${key}"]`);
		if (btn) {
			btn.focus();
		} else {
			const firstOfMonth = new Date(localCurrentDate.getFullYear(), localCurrentDate.getMonth(), 1);
			const fallbackKey = `${firstOfMonth.getFullYear()}-${firstOfMonth.getMonth()}-${firstOfMonth.getDate()}`;
			gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${fallbackKey}"]`)?.focus();
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Keep focusedDate (the roving tabindex position) in sync with the selected date
	useEffect(() => {
		if (dueDate) setFocusedDate(dueDate);
	}, [dueDate]);

	// After a cross-month arrow-key navigation, the new month renders and we focus the pending button
	useEffect(() => {
		if (!pendingFocusKey.current || !gridRef.current) return;
		const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${pendingFocusKey.current}"]`);
		if (btn) {
			pendingFocusKey.current = null;
			btn.focus();
		}
	}, [localCurrentDate]);

	// When the displayed month changes via prev/next buttons, ensure focusedDate stays within the visible grid
	useEffect(() => {
		if (pendingFocusKey.current) return; // arrow-key cross-month nav already set focusedDate correctly
		const dueDateInCurrentMonth = dueDate &&
			dueDate.getMonth() === localCurrentDate.getMonth() &&
			dueDate.getFullYear() === localCurrentDate.getFullYear();
		setFocusedDate(dueDateInCurrentMonth ? dueDate : new Date(localCurrentDate.getFullYear(), localCurrentDate.getMonth(), 1));
	}, [localCurrentDate]); // eslint-disable-line react-hooks/exhaustive-deps

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
			<div ref={gridRef} className="text-center">
				{calendarMonth.map((week, index) => {
					let isSelectedWeek = false;

					if (allDaysInWeekFromDate) {
						const firstDayOfThisWeekKey = formatCheckedInDayDate(week[0]);
						isSelectedWeek = firstDayOfThisWeekKey in allDaysInWeekFromDate;
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
								const isInSelectedWeek = !!allDaysInWeekFromDate && formatCheckedInDayDate(day) in allDaysInWeekFromDate;
								const isFocused = areDatesEqual(day, focusedDate);
								const appliedStyles = [];

								if (isCurrentMonth) {
									if (isChosenDay && selectedInterval !== 'Week') {
										appliedStyles.push(`${chosenColorObj.bgColor} text-white`);
									} else if (isDayToday) {
										appliedStyles.push(
											`bg-color-gray-200 hover:bg-color-gray-200 ${chosenColorObj.textColor}`
										);
									} else {
										appliedStyles.push('text-white bg-transparent hover:bg-color-gray-200');
									}
								} else {
									appliedStyles.push('text-color-gray-100 bg-transparent hover:bg-color-gray-20');
								}

								const handleClick = () => {
									setLocalCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));

									let newDueDate = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12, 0, 0);

									if (time) {
										const newDateObject = setTimeOnDateString(newDueDate, time);
										newDueDate = newDateObject;
									}

									if (selectedInterval === 'Week') {
										if (setConnectedCurrentDate) {
											setConnectedCurrentDate(newDueDate);
										}
									} else {
										if (setConnectedCurrentDate) {
											setConnectedCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));
										}
										setDueDate(newDueDate);
									}
								};

								const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
									let newDate: Date | null = null;
									const y = day.getFullYear();
									const m = day.getMonth();
									const d = day.getDate();

									switch (e.key) {
										case 'ArrowRight': e.preventDefault(); newDate = new Date(y, m, d + 1); break;
										case 'ArrowLeft':  e.preventDefault(); newDate = new Date(y, m, d - 1); break;
										case 'ArrowDown':  e.preventDefault(); newDate = new Date(y, m, d + 7); break;
										case 'ArrowUp':    e.preventDefault(); newDate = new Date(y, m, d - 7); break;
										case 'Home':       e.preventDefault(); newDate = new Date(y, m, d - (day.getDay() + 6) % 7); break;
										case 'End':        e.preventDefault(); newDate = new Date(y, m, d + (7 - day.getDay()) % 7); break;
										case 'PageUp':     e.preventDefault(); newDate = new Date(y, m - 1, d); break;
										case 'PageDown':   e.preventDefault(); newDate = new Date(y, m + 1, d); break;
										case 'Enter':
											if ((isChosenDay || isInSelectedWeek) && onConfirm) { e.preventDefault(); onConfirm(); }
											break;
									}

									if (newDate) {
										const key = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;
										const isSameMonthYear = newDate.getMonth() === localCurrentDate.getMonth() && newDate.getFullYear() === localCurrentDate.getFullYear();
										setFocusedDate(newDate);
										if (isSameMonthYear) {
											gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)?.focus();
										} else {
											pendingFocusKey.current = key;
											setLocalCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
										}
									}
								};

								return (
									<button
										key={`day-${index}`}
										type="button"
										data-date={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
										tabIndex={isFocused ? 0 : -1}
										aria-label={day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
										aria-pressed={(isChosenDay || isInSelectedWeek) || undefined}
										className={`py-1 cursor-pointer rounded-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${appliedStyles}`}
										onClick={handleClick}
										onFocus={() => setFocusedDate(day)}
										onKeyDown={handleKeyDown}
									>
										{day.getDate()}
									</button>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

interface YearViewProps {
	localCurrentDate: Date;
	setLocalCurrentDate: (date: Date) => void;
	setDueDate: (date: Date | null) => void;
	setShowYearView: (show: boolean) => void;
}

const YearView: React.FC<YearViewProps> = ({ localCurrentDate, setLocalCurrentDate, setDueDate, setShowYearView }) => {
	const { chosenColorObj } = useThemeContext();
	const monthsOfYear = getAllMonths(localCurrentDate);
	const [focusedIndex, setFocusedIndex] = useState(localCurrentDate.getMonth());
	const gridRef = useRef<HTMLDivElement>(null);
	const pendingFocusIndex = useRef<number | null>(null);

	// After a year change, focus the pending month button
	useEffect(() => {
		if (pendingFocusIndex.current === null || !gridRef.current) return;
		const idx = pendingFocusIndex.current;
		pendingFocusIndex.current = null;
		setFocusedIndex(idx);
		gridRef.current.querySelectorAll<HTMLButtonElement>('button')[idx]?.focus();
	}, [localCurrentDate]);

	const focusMonth = (index: number) => {
		if (index < 0) {
			pendingFocusIndex.current = 11;
			setLocalCurrentDate(new Date(localCurrentDate.getFullYear() - 1, 11, 1));
		} else if (index > 11) {
			pendingFocusIndex.current = 0;
			setLocalCurrentDate(new Date(localCurrentDate.getFullYear() + 1, 0, 1));
		} else {
			setFocusedIndex(index);
			gridRef.current?.querySelectorAll<HTMLButtonElement>('button')[index]?.focus();
		}
	};

	return (
		<div ref={gridRef} className="grid grid-cols-3 gap-2 my-3">
			{monthsOfYear.map((monthDate, i) => {
				const monthName = monthDate.toLocaleString('default', { month: 'short' });
				const isSelected =
					monthDate.getFullYear() === localCurrentDate.getFullYear() &&
					monthDate.getMonth() === localCurrentDate.getMonth();

				return (
					<button
						key={`${monthName} - ${monthDate.getFullYear()}`}
						type="button"
						tabIndex={i === focusedIndex ? 0 : -1}
						aria-pressed={isSelected}
						aria-label={monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
						className="flex justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full"
						onFocus={() => setFocusedIndex(i)}
						onKeyDown={(e) => {
							switch (e.key) {
								case 'ArrowRight': e.preventDefault(); focusMonth(i + 1); break;
								case 'ArrowLeft':  e.preventDefault(); focusMonth(i - 1); break;
								case 'ArrowDown':  e.preventDefault(); focusMonth(i + 3); break;
								case 'ArrowUp':    e.preventDefault(); focusMonth(i - 3); break;
								case 'Home':       e.preventDefault(); focusMonth(0); break;
								case 'End':        e.preventDefault(); focusMonth(11); break;
							}
						}}
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
					</button>
				);
			})}
		</div>
	);
};

export default SelectCalendar;
