import { useEffect } from "react";
import GeneralSelectButtonAndDropdown from "../../../pages/stats/StatsPage/GeneralSelectButtonAndDropdown";
import { formatDateAsAPIKey, getFormattedShortMonthDay, getAllDaysInWeekFromDate, getAllDaysInMonthFromDate, getAllDaysInYearFromDate, getAllDaysInRange } from "../../../utils/date.utils";
import Icon from "../../Icon";

const FocusStatsCard = ({
	mode,
	selectedInterval,
	setSelectedInterval,
	selectedDates,
	setSelectedDates,
	selectedIntervalOptions,
	dailyDurationsMap,
	goalSeconds,
	customDailyFocusGoal,
	combinedGoalMetMap,
	setIsModalPickDateRangeOpen,
	startDate,
	endDate,
}: {
	mode: 'single' | 'combined';
	selectedInterval: string;
	setSelectedInterval: (value: string) => void;
	selectedDates: Date[];
	setSelectedDates: (value: Date[]) => void;
	selectedIntervalOptions: string[];
	dailyDurationsMap: { [dateKey: string]: number };
	goalSeconds: number;
	customDailyFocusGoal?: Record<string, number>;
	combinedGoalMetMap?: Record<string, boolean>;
	setIsModalPickDateRangeOpen: (value: boolean) => void;
	startDate: Date | null;
	endDate: Date | null;
}) => {
	// Update selectedDates when interval changes or when navigation happens
	useEffect(() => {
		// Use current date as reference point
		const referenceDate = selectedDates.length > 0 ? selectedDates[0] : new Date();

		let newDates: Date[] = [];

		switch (selectedInterval) {
			case 'Week':
				newDates = getAllDaysInWeekFromDate(referenceDate);
				break;
			case 'Month':
				newDates = getAllDaysInMonthFromDate(referenceDate);
				break;
			case 'Year':
				newDates = getAllDaysInYearFromDate(referenceDate);
				break;
			case 'All':
				// For "All", we don't need specific dates
				return;
			case 'Custom':
				// Custom dates are handled by the modal
				if (startDate && endDate) {
					newDates = getAllDaysInRange(startDate, endDate);
					// Only update if dates have changed
					if (selectedDates.length !== newDates.length ||
							selectedDates[0]?.getTime() !== newDates[0]?.getTime()) {
						setSelectedDates(newDates);
					}
				}
				return;
			default:
				return;
		}

		// Check if we need to expand (if we only have 1 date, or if dates don't match the interval)
		const needsExpansion = selectedDates.length === 1 || selectedDates.length !== newDates.length;

		if (needsExpansion) {
			setSelectedDates(newDates);
		}
	}, [selectedInterval, selectedDates, setSelectedDates, startDate, endDate]);

	// Calculate statistics
	const calculateStats = () => {
		const today = new Date();
		const todayKey = formatDateAsAPIKey(today);

		// Determine which data map to use based on mode
		const dataMap = mode === 'combined' && combinedGoalMetMap ? combinedGoalMetMap : dailyDurationsMap;
		const allDateKeys = Object.keys(dataMap);

		// Handle empty data
		if (allDateKeys.length === 0) {
			return { totalDays: 0, daysMetGoal: 0, percentage: 0 };
		}

		// Common logic: Calculate total possible days and days with records
		let totalPossibleDays: number;
		let daysWithRecords: string[];

		if (selectedInterval === 'All') {
			// Get earliest date from map keys
			const sortedKeys = allDateKeys.sort();
			const firstDateKey = sortedKeys[0];
			const [year, month, day] = firstDateKey.split('-').map(Number);
			const firstDate = new Date(year, month - 1, day);

			// Calculate all days from first record to today
			const allPossibleDates = getAllDaysInRange(firstDate, today);
			totalPossibleDays = allPossibleDates.filter(date =>
				formatDateAsAPIKey(date) <= todayKey
			).length;

			daysWithRecords = allDateKeys;
		} else {
			// Use selectedDates for total possible days
			totalPossibleDays = selectedDates.filter(date =>
				formatDateAsAPIKey(date) <= todayKey
			).length;

			// Filter to days with records (still needed for daysMetGoal)
			const intervalDateKeys = new Set(
				selectedDates
					.filter(date => formatDateAsAPIKey(date) <= todayKey)
					.map(date => formatDateAsAPIKey(date))
			);
			daysWithRecords = allDateKeys.filter(dateKey =>
				intervalDateKeys.has(dateKey)
			);
		}

		// Mode-specific logic: Count days where goal was met
		const daysMetGoal = mode === 'combined' && combinedGoalMetMap
			? daysWithRecords.filter(dateKey => combinedGoalMetMap[dateKey] === true)
			: daysWithRecords.filter(dateKey => {
				const duration = dailyDurationsMap[dateKey];
				const dailyGoalSeconds = customDailyFocusGoal?.[dateKey] ?? goalSeconds;
				const offsetDailyGoal = dailyGoalSeconds - 300; // 5-minute offset
				return duration >= offsetDailyGoal;
			});

		return {
			totalDays: totalPossibleDays,
			daysMetGoal: daysMetGoal.length,
			percentage: totalPossibleDays > 0
				? (daysMetGoal.length / totalPossibleDays) * 100
				: 0
		};
	};

	// Navigation handlers
	const goToPrevious = () => {
		if (selectedDates.length === 0) return;
		const firstDay = selectedDates[0];
		let newDate: Date;

		switch (selectedInterval) {
			case 'Week':
				newDate = new Date(firstDay);
				newDate.setDate(newDate.getDate() - 7);
				break;
			case 'Month':
				newDate = new Date(firstDay);
				newDate.setMonth(newDate.getMonth() - 1);
				break;
			case 'Year':
				newDate = new Date(firstDay);
				newDate.setFullYear(newDate.getFullYear() - 1);
				break;
			default:
				return;
		}

		setSelectedDates([newDate]);
	};

	const goToNext = () => {
		if (selectedDates.length === 0) return;
		const firstDay = selectedDates[0];
		let newDate: Date;

		switch (selectedInterval) {
			case 'Week':
				newDate = new Date(firstDay);
				newDate.setDate(newDate.getDate() + 7);
				break;
			case 'Month':
				newDate = new Date(firstDay);
				newDate.setMonth(newDate.getMonth() + 1);
				break;
			case 'Year':
				newDate = new Date(firstDay);
				newDate.setFullYear(newDate.getFullYear() + 1);
				break;
			default:
				return;
		}

		setSelectedDates([newDate]);
	};

	// Format display label
	const getDisplayLabel = () => {
		if (selectedDates.length === 0) return '';

		const firstDate = selectedDates[0];
		const lastDate = selectedDates[selectedDates.length - 1];

		switch (selectedInterval) {
			case 'Week':
				return `${getFormattedShortMonthDay(firstDate)} - ${getFormattedShortMonthDay(lastDate)}`;
			case 'Month':
				return firstDate.toLocaleString('default', { month: 'long', year: 'numeric' });
			case 'Year':
				return `${firstDate.getFullYear()}`;
			case 'All':
				return 'All Time';
			case 'Custom':
				return `${getFormattedShortMonthDay(firstDate)} - ${getFormattedShortMonthDay(lastDate)}`;
			default:
				return '';
		}
	};

	const stats = calculateStats();
	const displayLabel = getDisplayLabel();
	const showNavigation = selectedInterval !== 'All' && selectedInterval !== 'Custom';

	return (
		<div className="bg-color-gray-600 rounded-lg p-4">
			{/* Header row: Interval dropdown + Navigation/Date */}
			<div className="flex items-center justify-between mb-1">
				{/* Left: Navigation arrows + Date label */}
				<div className="flex items-center gap-2 flex-1">
					{showNavigation ? (
						<>
							<Icon
								name="chevron_left"
								customClass="cursor-pointer hover:text-color-gray-100"
								onClick={goToPrevious}
							/>
							<div className="text-sm text-color-gray-25 font-medium">
								{displayLabel}
							</div>
							<Icon
								name="chevron_right"
								customClass="cursor-pointer hover:text-color-gray-100"
								onClick={goToNext}
							/>
						</>
					) : (
						<div className="text-sm text-color-gray-100 font-medium">
							{displayLabel}
						</div>
					)}
				</div>

				{/* Right: Interval dropdown */}
				<GeneralSelectButtonAndDropdown
					selected={selectedInterval}
					setSelected={setSelectedInterval}
					selectedOptions={selectedIntervalOptions}
					onClick={(name) => {
						if (name?.toLowerCase() !== 'custom') return;
						setIsModalPickDateRangeOpen(true);
					}}
					align="right"
				/>
			</div>

			{/* Main stats display */}
			<div className="text-2xl font-bold mb-0">
				{stats.daysMetGoal}/{stats.totalDays} <span className="text-color-gray-50">({Math.round(stats.percentage)}%)</span>
			</div>

			{/* Helper text */}
			<div className="text-color-gray-50">
				Days goal met
			</div>
		</div>
	);
};

export default FocusStatsCard