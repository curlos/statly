import { useRef, useState, useEffect } from 'react';
import Icon from '../../../components/Icon';
import {
	getAllDaysInWeekFromDate,
	getAllDaysInMonthFromDate,
	formatCheckedInDayDate,
	getAllDaysInYearFromDate,
	getAllDaysInRange,
	getFormattedShortMonthDay,
} from '../../../utils/date.utils';
import DropdownGeneralSelect from '../DropdownGeneralSelect';
import CompletionStatsCard from './CompletionStatsCard';
import CompletionDistributionCard from './CompletionDistributionCard';
import OverviewCard from './OverviewCard';
import ModalPickDateRange from '../../../components/Modal/ModalPickDateRange';

const TaskSection = () => {
	const dropdownRef = useRef(null);
	const [isDropdownVisible, setIsDropdownVisible] = useState(false);
	const [selectedTimeInterval, setSelectedTimeInterval] = useState('Day');
	const selectedTimeIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	// Custom
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	useEffect(() => {
		switch (selectedTimeInterval) {
			case 'Day':
				setSelectedDates([selectedDates[0]]);
				break;
			case 'Week':
				setSelectedDates(getAllDaysInWeekFromDate(selectedDates[0]));
				break;
			case 'Month':
				setSelectedDates(getAllDaysInMonthFromDate(selectedDates[0]));
				break;
			case 'Year':
				setSelectedDates(getAllDaysInYearFromDate(selectedDates[0]));
				break;
			case 'Custom':
				setSelectedDates(getAllDaysInRange(startDate, endDate));
				break;
		}
	}, [selectedTimeInterval, startDate, endDate]);

	const getFormattedSelectedDates = () => {
		switch (selectedTimeInterval) {
			case 'Day':
				return formatCheckedInDayDate(selectedDates[0]);
			case 'Week':
				return `${getFormattedShortMonthDay(selectedDates[0])} - ${getFormattedShortMonthDay(selectedDates[selectedDates.length - 1])}`;
			case 'Month':
				return selectedDates[0].toLocaleString('default', { month: 'long', year: 'numeric' });
			case 'Year':
				return selectedDates[0].toLocaleString('default', { year: 'numeric' });
			case 'Custom':
				return `${getFormattedShortMonthDay(startDate)} - ${getFormattedShortMonthDay(endDate)}`;
		}
	};

	const handleArrowClick = (arrowType) => {
		const date = new Date(selectedDates[0]);
		switch (selectedTimeInterval) {
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
				setSelectedDates(getAllDaysInYearFromDate(date));
				break;
			default:
				break;
		}
	};

	return (
		<div>
			<div className="flex flex-col xs:flex-row gap-2 xs:gap-4">
				<div className="relative">
					<div
						className="flex gap-[2px] bg-color-gray-600 py-2 px-4 rounded-md cursor-pointer justify-between items-center"
						onClick={() => setIsDropdownVisible(!isDropdownVisible)}
					>
						<div>{selectedTimeInterval}</div>
						<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
					</div>

					<DropdownGeneralSelect
						toggleRef={dropdownRef}
						isVisible={isDropdownVisible}
						setIsVisible={setIsDropdownVisible}
						selected={selectedTimeInterval}
						setSelected={setSelectedTimeInterval}
						selectedOptions={selectedTimeIntervalOptions}
						onClick={(name) => {
							if (name?.toLowerCase() !== 'custom') {
								return;
							}

							setIsModalPickDateRangeOpen(true);
						}}
					/>
				</div>

				{selectedTimeInterval !== 'All' && (
					<div className="flex-1 sm:flex-none flex justify-between gap-3 bg-color-gray-600 py-2 px-2 rounded-md">
						<Icon
							name="keyboard_arrow_left"
							customClass="!text-[18px] mt-[2px] cursor-pointer"
							onClick={() => handleArrowClick('left')}
						/>
						<div>{getFormattedSelectedDates()}</div>
						<Icon
							name="keyboard_arrow_right"
							customClass="!text-[18px] mt-[2px] cursor-pointer"
							onClick={() => handleArrowClick('right')}
						/>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
				<OverviewCard {...{ selectedTimeInterval, selectedDates }} />
				<CompletionDistributionCard {...{ selectedTimeInterval, selectedDates }} />
				{/* <CompletionRateDistributionCard /> */}
				<CompletionStatsCard {...{ selectedTimeInterval, selectedDates }} />
			</div>

			<ModalPickDateRange
				isModalOpen={isModalPickDateRangeOpen}
				setIsModalOpen={setIsModalPickDateRangeOpen}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
			/>
		</div>
	);
};

export default TaskSection;
