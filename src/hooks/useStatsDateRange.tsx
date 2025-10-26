import { useState } from 'react';
import { getDateRangeFromSelectedDates, getFormattedShortMonthDay } from '../utils/date.utils';
import DateRangePicker from '../pages/stats/StatsPage/FocusSection/DateRangePicker';
import ModalPickDateRange from '../components/Modal/ModalPickDateRange';

interface UseStatsDateRangeOptions {
	initialInterval: string;
	initialDates: Date[];
}

/**
 * Custom hook to manage date range state and logic for stats cards
 * Handles selected interval, selected dates, custom date modal, and API date formatting
 */
export const useStatsDateRange = (options: UseStatsDateRangeOptions) => {
	const { initialInterval, initialDates } = options;

	const [selectedInterval, setSelectedInterval] = useState(initialInterval);
	const [selectedDates, setSelectedDates] = useState(initialDates);

	// Custom date modal state
	const [isModalPickDateRangeOpen, setIsModalPickDateRangeOpen] = useState(false);
	const [startDate, setStartDate] = useState(new Date('January 1, 2024'));
	const [endDate, setEndDate] = useState(new Date());

	// Get API-formatted date range
	const getApiDateRange = () => {
		if (selectedInterval === 'All') {
			return {
				startDate: 'Nov 2, 2020', // Account creation date
				endDate: getFormattedShortMonthDay(new Date()),
			};
		}
		return getDateRangeFromSelectedDates(selectedDates);
	};

	const { startDate: apiStartDate, endDate: apiEndDate } = getApiDateRange();

	// Render DateRangePicker component
	const renderDateRangePicker = () => {
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

	// Render ModalPickDateRange component
	const renderCustomDateModal = () => {
		return (
			<ModalPickDateRange
				isModalOpen={isModalPickDateRangeOpen}
				setIsModalOpen={setIsModalPickDateRangeOpen}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
			/>
		);
	};

	return {
		// State
		selectedInterval,
		setSelectedInterval,
		selectedDates,
		setSelectedDates,
		isModalPickDateRangeOpen,
		setIsModalPickDateRangeOpen,
		startDate,
		setStartDate,
		endDate,
		setEndDate,

		// API-formatted dates
		apiStartDate,
		apiEndDate,

		// Render helpers
		renderDateRangePicker,
		renderCustomDateModal,
	};
};
