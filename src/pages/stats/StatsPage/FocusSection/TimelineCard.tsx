import classNames from 'classnames';
import { useState, useRef } from 'react';
import DropdownTimeCalendar from '../../../../components/Dropdown/DropdownsAddFocusRecord/DropdownTimeCalendar';
import Icon from '../../../../components/Icon';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import DateRangePicker from './DateRangePicker';
import TimelineChart from './TimelineChart';

const TimelineCard = () => {
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[380px] sm:h-[350px]">
			<div className="flex flex-col sm:flex-row justify-between sm:items-center">
				<h3 className="font-bold text-[16px]">Timeline</h3>

				<div className="flex gap-2 items-center">
					<CustomWeekPicker {...{ selectedDates, setSelectedDates }} />

					<DateRangePicker
						selectedDates={selectedDates}
						setSelectedDates={setSelectedDates}
						selectedInterval={'Week'}
					/>
				</div>
			</div>

			<div className="mt-[-10px]">
				<TimelineChart {...{ selectedDates }} />
			</div>
		</div>
	);
};

const CustomWeekPicker = ({ selectedDates, setSelectedDates }) => {
	const dropdownTimeCalenderRef = useRef(null);
	const [isDropdownTimeCalendarVisible, setIsDropdownTimeCalendarVisible] = useState(false);

	const { chosenColorObj } = useThemeContext();

	const [date, setDate] = useState(selectedDates && selectedDates.length > 0 ? selectedDates[0] : new Date());

	return (
		<div className="flex items-center gap-2">
			<div className="relative">
				<div
					ref={dropdownTimeCalenderRef}
					onClick={() => {
						setIsDropdownTimeCalendarVisible(!isDropdownTimeCalendarVisible);
					}}
				>
					<Icon
						name="calendar_month"
						fill={0}
						customClass={classNames(
							'text-color-gray-50 !text-[20px] cursor-pointer border border-color-gray-100 rounded-2xl bg-color-gray-300 p-[6px]',
							`${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
						)}
					/>
				</div>

				<DropdownTimeCalendar
					toggleRef={dropdownTimeCalenderRef}
					isVisible={isDropdownTimeCalendarVisible}
					setIsVisible={(value) => {
						setIsDropdownTimeCalendarVisible(value);
					}}
					date={date}
					setDate={setDate}
					showTime={true}
					selectedInterval="Week"
					outerCurrentDate={date}
					selectedDates={selectedDates}
					setSelectedDates={setSelectedDates}
				/>
			</div>
		</div>
	);
};

export default TimelineCard;
