import classNames from 'classnames';
import { useState, useRef } from 'react';
import DropdownTimeCalendar from '../../../../components/Dropdown/DropdownsAddFocusRecord/DropdownTimeCalendar';
import Icon from '../../../../components/Icon';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getAllDaysInWeekFromDate, getDateRangeFromSelectedDates } from '../../../../utils/date.utils';
import DateRangePicker from './DateRangePicker';
import TimelineChart from './TimelineChart';
import Spinner from '../../../../components/Loaders/Spinner';
import { useGetFocusStatsQuery } from '../../../../services/resources/statsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import { useApplyDefaultDateRangeContext } from '../../../../contexts/useApplyDefaultDateRangeContext';

const TimelineCard = () => {
	// Initialize with Week range to match selectedInterval='Week'
	const [selectedDates, setSelectedDates] = useState(getAllDaysInWeekFromDate(new Date()));

	// Get date range from selected dates
	const { startDate: apiStartDate, endDate: apiEndDate } = getDateRangeFromSelectedDates(selectedDates);

	// Build query params for API using custom hook
	const queryParams = useStatsQueryParams({
		'group-by': 'timeline',
		'interval-start-date': apiStartDate ?? undefined,
		'interval-end-date': apiEndDate ?? undefined,
	});

	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();

	// Fetch stats from API
	const { data: statsData, isLoading, isFetching } = useGetFocusStatsQuery(queryParams, {
		skip: shouldSkipQuery
	});

	return (
		<section className="bg-color-gray-600 p-3 rounded-lg flex flex-col sm:h-[350px] lg:h-[380px] relative" aria-labelledby="timeline-heading">
			<div className="flex flex-col sm:flex-row justify-between sm:items-center">
				<div className="flex items-center gap-2">
					<h2 id="timeline-heading" className="font-bold text-[16px]">Timeline</h2>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<div className="flex gap-2 items-center">
					<CustomWeekPicker {...{ selectedDates, setSelectedDates }} />

					<div className="flex-1">
						<DateRangePicker
							selectedDates={selectedDates}
							setSelectedDates={setSelectedDates}
							selectedInterval={'Week'}
						/>
					</div>
				</div>
			</div>

			<div className="mt-[-10px]">
				<TimelineChart selectedDates={selectedDates} statsData={statsData} />
			</div>
		</section>
	);
};

interface CustomWeekPickerProps {
	selectedDates: Date[];
	setSelectedDates: (dates: Date[]) => void;
}

const CustomWeekPicker: React.FC<CustomWeekPickerProps> = ({ selectedDates, setSelectedDates }) => {
	const dropdownTimeCalenderRef = useRef(null);
	const [isDropdownTimeCalendarVisible, setIsDropdownTimeCalendarVisible] = useState(false);

	const { chosenColorObj } = useThemeContext();

	const [date, setDate] = useState<Date | null>(selectedDates && selectedDates.length > 0 ? selectedDates[0] : new Date());

	return (
		<div className="flex items-center gap-2">
			<div className="relative">
				<button
					ref={dropdownTimeCalenderRef}
					type="button"
					aria-label="Open calendar picker"
					aria-expanded={isDropdownTimeCalendarVisible}
					className="bg-transparent border-0 p-0 cursor-pointer"
					onClick={() => setIsDropdownTimeCalendarVisible(!isDropdownTimeCalendarVisible)}
				>
					<Icon
						name="calendar_month"
						fill={0}
						customClass={classNames(
							'text-color-gray-50 !text-[20px] border border-color-gray-100 rounded-2xl bg-color-gray-300 p-[6px]',
							`${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
						)}
					/>
				</button>

				<DropdownTimeCalendar
					toggleRef={dropdownTimeCalenderRef}
					isVisible={isDropdownTimeCalendarVisible}
					setIsVisible={(value) => {
						setIsDropdownTimeCalendarVisible(value);
					}}
					date={date}
					setDate={setDate}
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
