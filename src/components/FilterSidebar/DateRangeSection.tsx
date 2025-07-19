import { useEffect, useState } from 'react';
import Accordion from '../Accordion/Accordion';
import FormPickDateRange from '../FormPickDateRange';
import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay } from '../../utils/date.utils';
import GeneralSelectButtonAndDropdown from '../../pages/StatsPage/GeneralSelectButtonAndDropdown';
import DateRangePicker from '../../pages/StatsPage/FocusSection/DateRangePicker';

const DateRangeSection = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const [isDropdownOpenForParent, setIsDropdownOpenForParent] = useState(false);

	const [startDate, setStartDate] = useState(new Date(startDateFromUrl));
	const [endDate, setEndDate] = useState(new Date(endDateFromUrl));
	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
	const [selectedInterval, setSelectedInterval] = useState(selectedIntervalOptions[0]);
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	const getDateRangePicker = () => {
		return (
			selectedInterval !== 'All' && (
				<DateRangePicker
					selectedDates={selectedDates}
					setSelectedDates={setSelectedDates}
					selectedInterval={selectedInterval}
					startDate={startDate}
					endDate={endDate}
				/>
			)
		);
	};

	useEffect(() => {
		updateQueryParams({ 'start-date': getFormattedShortMonthDay(startDate), page: '' });
	}, [startDate]);

	useEffect(() => {
		updateQueryParams({ 'end-date': getFormattedShortMonthDay(endDate), page: '' });
	}, [endDate]);

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Date Range</h3>
						<Icon
							name="diversity_2"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
				isChildDropdownOpen={isDropdownOpenForParent}
			>
				<div className="flex items-center gap-2 mb-3">
					<div className="flex-[2]">{getDateRangePicker()}</div>
					<div className="flex-[1]">
						<GeneralSelectButtonAndDropdown
							selected={selectedInterval}
							setSelected={setSelectedInterval}
							selectedOptions={selectedIntervalOptions}
							onClick={(name) => {
								if (name?.toLowerCase() !== 'custom') {
									return;
								}

								// setIsModalPickDateRangeOpen(true);
							}}
							isDropdownOpenForParent={isDropdownOpenForParent}
							setIsDropdownOpenForParent={setIsDropdownOpenForParent}
						/>
					</div>
				</div>

				<FormPickDateRange
					{...{
						startDate: new Date(startDateFromUrl),
						setStartDate,
						endDate: new Date(endDateFromUrl),
						setEndDate,
						confirmBeforeUpdating: false,
						onUpdateStartOrEndDate: (newStartDate, newEndDate) => {
							if (newStartDate) {
								setStartDate(newStartDate);
							} else if (newEndDate) {
								setEndDate(newEndDate);
							}
						},
						isDropdownCalendarOpenForParent: isDropdownOpenForParent,
						setIsDropdownCalendarOpenForParent: setIsDropdownOpenForParent,
						showTime: true,
					}}
				/>
			</Accordion>
		</div>
	);
};

export default DateRangeSection;
