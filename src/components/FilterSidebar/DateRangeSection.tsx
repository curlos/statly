import { useEffect, useState } from 'react';
import Accordion from '../Accordion/Accordion';
import FormPickDateRange from '../FormPickDateRange';
import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { getAllDaysInRange, getFormattedShortMonthDay } from '../../utils/date.utils';
import GeneralSelectButtonAndDropdown from '../../pages/StatsPage/GeneralSelectButtonAndDropdown';
import DateRangePicker from '../../pages/StatsPage/FocusSection/DateRangePicker';

const DateRangeSection = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const startDateFromUrl = searchParams.get('start-date');
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const intervalFromUrl = searchParams.get('date-interval') || 'All';
	const [isDropdownOpenForParent, setIsDropdownOpenForParent] = useState(false);

	const [startDate, setStartDate] = useState(startDateFromUrl ? new Date(startDateFromUrl) : new Date());
	const [endDate, setEndDate] = useState(new Date(endDateFromUrl));
	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
	const [selectedInterval, setSelectedInterval] = useState(intervalFromUrl);
	const [selectedDates, setSelectedDates] = useState([startDate]);

	useEffect(() => {
		const newStartDate = selectedInterval === 'All' ? '' : getFormattedShortMonthDay(selectedDates[0]);
		const newEndDate =
			selectedInterval === 'All' ? '' : getFormattedShortMonthDay(selectedDates[selectedDates.length - 1]);
		const newInterval = selectedInterval === 'All' ? '' : selectedInterval;

		updateQueryParams({
			'start-date': newStartDate,
			'end-date': newEndDate,
			'date-interval': newInterval,
			page: '',
		});
	}, [selectedDates, selectedInterval]);

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
				<div className="flex items-center gap-4 mb-3">
					<div>
						<GeneralSelectButtonAndDropdown
							selected={selectedInterval}
							setSelected={setSelectedInterval}
							selectedOptions={selectedIntervalOptions}
							onClick={(name) => {
								// if (name?.toLowerCase() !== 'custom') {
								// 	return;
								// }
								// TODO: Show FormPickDateRange potentially when "Custom" is clicked.
								// setIsModalPickDateRangeOpen(true);
							}}
							isDropdownOpenForParent={isDropdownOpenForParent}
							setIsDropdownOpenForParent={setIsDropdownOpenForParent}
						/>
					</div>

					<div className="flex-1">
						<div className={selectedInterval === 'All' || selectedInterval === 'Custom' ? 'hidden' : ''}>
							<DateRangePicker
								selectedDates={selectedDates}
								setSelectedDates={setSelectedDates}
								selectedInterval={selectedInterval}
								startDate={startDate}
								endDate={endDate}
							/>
						</div>
					</div>
				</div>

				{selectedInterval === 'Custom' && (
					<FormPickDateRange
						{...{
							startDate: startDate,
							setStartDate,
							endDate: endDate,
							setEndDate,
							confirmBeforeUpdating: false,
							onUpdateStartOrEndDate: (newStartDate, newEndDate) => {
								if (newStartDate) {
									console.log('Updating start date...');
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
				)}
			</Accordion>
		</div>
	);
};

export default DateRangeSection;
