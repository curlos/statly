import classNames from 'classnames';
import { useState, useRef } from 'react';
import { useThemeContext } from '../contexts/useThemeContext';
import { formatCheckedInDayDate } from '../utils/date.utils';
import DropdownTimeCalendar from './Dropdown/DropdownsAddFocusRecord/DropdownTimeCalendar';

const FormPickDateRange = ({
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	onCancel,
	onConfirm,
	onUpdateStartOrEndDate,
	confirmBeforeUpdating = true,
	isDropdownCalendarOpenForParent,
	setIsDropdownCalendarOpenForParent,
	showTime = true,
}) => {
	const [localStartDate, setLocalStartDate] = useState(startDate);
	const [localEndDate, setLocalEndDate] = useState(endDate);

	const { chosenColorObj, nextDarkestColorObj } = useThemeContext();

	return (
		<div>
			<div className="space-y-2">
				<DateInput
					labelName="Start"
					date={localStartDate}
					setDate={(value) => {
						setLocalStartDate(value);

						if (!confirmBeforeUpdating) {
							setStartDate(value);
						}

						if (onUpdateStartOrEndDate) {
							onUpdateStartOrEndDate(value, null);
						}
					}}
					{...{
						isDropdownCalendarOpenForParent,
						setIsDropdownCalendarOpenForParent,
					}}
					showTime={showTime}
				/>
				<DateInput
					labelName="End"
					date={localEndDate}
					setDate={(value) => {
						setLocalEndDate(value);

						if (!confirmBeforeUpdating) {
							setEndDate(value);
						}

						if (onUpdateStartOrEndDate) {
							onUpdateStartOrEndDate(null, value);
						}
					}}
					{...{
						isDropdownCalendarOpenForParent,
						setIsDropdownCalendarOpenForParent,
					}}
					showTime={showTime}
				/>
			</div>

			{confirmBeforeUpdating && (
				<div className="flex justify-end gap-2 mt-5">
					<button
						className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
						onClick={() => {
							if (onCancel) {
								onCancel();
							}
						}}
					>
						Cancel
					</button>
					<button
						className={classNames(
							chosenColorObj.bgColor,
							nextDarkestColorObj.hover.bgColor,
							'rounded py-1 cursor-pointer min-w-[114px]'
						)}
						onClick={async () => {
							// TODO: Send the local start and end dates to the parent
							setStartDate(localStartDate);
							setEndDate(localEndDate);

							if (onConfirm) {
								onConfirm();
							}
						}}
					>
						Confirm
					</button>
				</div>
			)}
		</div>
	);
};

const DateInput = ({
	labelName,
	date,
	setDate,
	isDropdownCalendarOpenForParent,
	setIsDropdownCalendarOpenForParent,
	showTime,
}) => {
	const dropdownTimeCalenderRef = useRef(null);
	const [isDropdownTimeCalendarVisible, setIsDropdownTimeCalendarVisible] = useState(false);

	const { chosenColorObj } = useThemeContext();

	return (
		<div className="flex items-center gap-2">
			<div className="w-[40px]">{labelName}</div>
			<div className="w-full relative">
				<div
					ref={dropdownTimeCalenderRef}
					onClick={() => {
						setIsDropdownTimeCalendarVisible(!isDropdownTimeCalendarVisible);

						if (isDropdownCalendarOpenForParent !== undefined) {
							setIsDropdownCalendarOpenForParent(!isDropdownTimeCalendarVisible);
						}
					}}
					className={classNames(
						'border border-color-gray-300 cursor-pointer px-3 py-1 rounded w-full bg-color-gray-200',
						chosenColorObj.hover.borderColor
					)}
				>
					{formatCheckedInDayDate(date)}
				</div>

				<DropdownTimeCalendar
					toggleRef={dropdownTimeCalenderRef}
					isVisible={isDropdownTimeCalendarVisible}
					setIsVisible={(value) => {
						setIsDropdownTimeCalendarVisible(value);

						if (isDropdownCalendarOpenForParent !== undefined) {
							setIsDropdownCalendarOpenForParent(value);
						}
					}}
					date={date}
					setDate={setDate}
					showTime={showTime}
				/>
			</div>
		</div>
	);
};

export default FormPickDateRange;
