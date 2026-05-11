import { useState, useRef, useEffect, useMemo } from 'react';
import { useDialogFocus } from '../../../hooks/useDialogFocus';
import { DropdownProps } from '../../../interfaces/interfaces';
import SelectCalendar from '../../SelectCalendar';
import Dropdown from '../Dropdown';
import DropdownTime from '../DropdownCalendar/DropdownTime';
import { getAllDaysInWeekFromDate, getTimeString, setTimeOnDateString } from '../../../utils/date.utils';
import { useThemeContext } from '../../../contexts/useThemeContext';
import classNames from 'classnames';
import Icon from '../../Icon';
import { debounce } from '../../../utils/helpers.utils';

interface DropdownTimeCalendarProps extends DropdownProps {
	date: Date | null;
	setDate: React.Dispatch<React.SetStateAction<Date | null>>;
	showTime?: boolean;
	selectedInterval?: string | null;
	outerCurrentDate?: Date | null;
	setSelectedDates?: (dates: Date[]) => void;
	selectedDates?: Date[];
}

const DropdownTimeCalendar: React.FC<DropdownTimeCalendarProps> = ({
	toggleRef,
	isVisible,
	setIsVisible,
	date,
	setDate,
	showTime = false,
	selectedInterval = null,
	outerCurrentDate = null,
	setSelectedDates,
}) => {
	const { chosenColorObj, nextDarkestColorObj } = useThemeContext();

	// TODO: Get default date of today
	const [selectedTime, setSelectedTime] = useState(getTimeString(date ?? undefined));
	const [selectedDate, setSelectedDate] = useState(date);
	const [isDropdownTimeVisible, setIsDropdownTimeVisible] = useState(false);
	const dropdownTimeRef = useRef(null);

	const [connectedCurrentDate, setConnectedCurrentDate] = useState<Date>(outerCurrentDate || new Date());

	const dialogRef = useDialogFocus<HTMLDivElement>(isVisible, () => setIsVisible(false));

	const handleConfirm = () => {
		let newDueDate = selectedDate ? selectedDate : new Date();

		if (selectedTime) {
			const newDateObject = setTimeOnDateString(newDueDate, selectedTime);
			newDueDate = newDateObject;
		}

		setDate(newDueDate);
		setIsVisible(false);

		if (setSelectedDates && selectedInterval === 'Week') {
			setSelectedDates(getAllDaysInWeekFromDate(connectedCurrentDate));
		}
	};

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={'w-[250px] p-1 shadow-2xl border border-color-gray-100 rounded-lg select-none'}
		>
			<div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Date picker" className="outline-none">
				<div className="pt-2">
					<SelectCalendar
						{...{
							dueDate: selectedDate,
							setDueDate: setSelectedDate,
							connectedCurrentDate,
							setConnectedCurrentDate,
							time: selectedTime,
							selectedInterval: selectedInterval || undefined,
							outerCurrentDate: connectedCurrentDate,
							onConfirm: handleConfirm,
						}}
					/>
				</div>

				{showTime && (
					<div className="relative">
						<div className="mb-2 px-2">
							<button
								type="button"
								ref={dropdownTimeRef}
								aria-expanded={isDropdownTimeVisible}
								aria-haspopup="listbox"
								aria-label={`Selected time: ${selectedTime}`}
								className={classNames(
									chosenColorObj.hover.outlineColor,
									'text-center text-[14px] p-1 bg-color-gray-200 mb-0 w-full rounded cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white'
								)}
								onClick={() => setIsDropdownTimeVisible(!isDropdownTimeVisible)}
							>
								{selectedTime}
							</button>
						</div>

						<DropdownTime
							toggleRef={dropdownTimeRef}
							isVisible={isDropdownTimeVisible}
							setIsVisible={setIsDropdownTimeVisible}
							selectedTime={selectedTime}
							setSelectedTime={setSelectedTime}
							customClasses="mt-[10px]"
						/>
					</div>
				)}

				{/* Search Bar to search for Date through string. */}
				<SearchDateInput {...{ setConnectedCurrentDate, setDueDate: setSelectedDate }} />

				<div className="grid grid-cols-2 gap-2 p-2">
					<button
						className="border border-color-gray-100 rounded py-1 cursor-pointer hover:bg-color-gray-200"
						onClick={() => {
							setIsVisible(false);
						}}
					>
						Cancel
					</button>
					<button
						className={classNames(
							chosenColorObj.bgColor,
							nextDarkestColorObj?.hover.bgColor,
							'rounded py-1 cursor-pointer'
						)}
						onClick={handleConfirm}
					>
						Ok
					</button>
				</div>
			</div>
		</Dropdown>
	);
};

interface SearchDateInputProps {
	setConnectedCurrentDate: (date: Date) => void;
	setDueDate: (date: Date | null) => void;
}

interface DebouncedFunction {
	(): void;
	cancel: () => void;
}

const SearchDateInput: React.FC<SearchDateInputProps> = ({ setConnectedCurrentDate, setDueDate }) => {
	const [localSearchText, setLocalSearchText] = useState('');
	const [isInvalidDate, setIsInvalidDate] = useState(false);
	const [statusMessage, setStatusMessage] = useState('');

	const handleDebouncedSearch = useMemo(
		() =>
			debounce(() => {
				const newDate = localSearchText ? new Date(localSearchText) : new Date();

				const isDateValid = !isNaN(newDate.getTime());

				if (isDateValid) {
					const typedInNewDate = localSearchText;

					if (typedInNewDate) {
						setConnectedCurrentDate(newDate);
						setDueDate(newDate);
						setStatusMessage(`Calendar showing ${newDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`);
					}

					setIsInvalidDate(false);
				} else {
					setIsInvalidDate(true);
				}
			}, 1000) as DebouncedFunction,
		[localSearchText, setConnectedCurrentDate, setDueDate]
	);

	useEffect(() => {
		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [handleDebouncedSearch]);

	return (
		<div className="px-2">
			<div className="flex items-center gap-1 p-1 rounded bg-color-gray-200">
				<Icon
					name="search"
					fill={0}
					customClass={'text-color-gray-50 !text-[20px]'}
				/>
				<input
					placeholder="Search Date"
					aria-label="Search date"
					value={localSearchText}
					onChange={(e) => {
						setLocalSearchText(e.target.value);
					}}
					className="text-[14px] bg-transparent placeholder:text-color-gray-50 mb-0 w-full outline-none resize-none"
				/>
			</div>
			{isInvalidDate && <div role="alert" className="text-red-500 mt-1">Date is invalid</div>}
		<div role="status" className="sr-only">{statusMessage}</div>
		</div>
	);
};

export default DropdownTimeCalendar;
