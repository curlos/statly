import { useState } from 'react';
import Modal from './Modal';
import Icon from '../Icon';
import { getFormattedDuration } from '../../utils/helpers.utils';
import { formatDateAsAPIKey, formatDateWithoutTimezone, getAllMonths } from '../../utils/date.utils';
import { useThemeContext } from '../../contexts/useThemeContext';
import classNames from 'classnames';
import FocusGoalCalendarDay from './FocusGoalCalendarDay';
import StreaksList, { SortOption } from './StreaksList';
import { useStatsDateRange } from '../../hooks/useStatsDateRange';
import FocusStatsCard from './ModalFocusGoalProgress/FocusStatsCard';
import GeneralSelectButtonAndDropdown from '../../pages/stats/StatsPage/GeneralSelectButtonAndDropdown';

interface Streak {
	days: number;
	from: string | null;
	to: string | null;
}

interface StreakData {
	currentStreak?: Streak;
	longestStreak?: Streak;
	allStreaks?: Streak[];
	dailyDurationsMap?: {
		[dateKey: string]: number;
	};
}

interface ModalFocusGoalProgressProps {
	isOpen: boolean;
	onClose: () => void;
	streakData: StreakData;
	ring: any; // The specific ring this modal is for
}

const ModalFocusGoalProgress: React.FC<ModalFocusGoalProgressProps> = ({
	isOpen,
	onClose,
	streakData,
	ring,
}) => {
	const { chosenColorObj } = useThemeContext() as any;

	const customDailyFocusGoal = ring?.customDailyFocusGoal ?? {};
	const selectedDaysOfWeek = ring?.selectedDaysOfWeek ?? {};
	const restDays = ring?.restDays ?? {};
	const ringName = ring?.name;
	const ringColor = ring?.color;
	const useThemeColor = ring?.useThemeColor;
	const goalSeconds = ring?.goalSeconds ?? 3600;
	const [currentDate, setCurrentDate] = useState(new Date());
	const [showYearView, setShowYearView] = useState(false);
	const [viewMode, setViewMode] = useState<'calendar' | 'streaks'>('calendar');
	const [sortBy, setSortBy] = useState<string>('Longest');

	// Focus stats interval management
	const selectedIntervalOptions = ['Week', 'Month', 'Year', 'All', 'Custom'];
	const {
		selectedInterval,
		setSelectedInterval,
		selectedDates,
		setSelectedDates,
		startDate,
		endDate,
		setIsModalPickDateRangeOpen,
		renderCustomDateModal,
	} = useStatsDateRange({
		initialInterval: 'Month',
		initialDates: [new Date()],
	});

	// Calendar navigation handlers
	const goToPreviousMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
	};

	const goToNextMonth = () => {
		setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	};

	const goToPreviousYear = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
		);
	};

	const goToNextYear = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate())
		);
	};

	const monthName = currentDate.toLocaleString('default', { month: 'long' });

	// Convert display sort option to internal format
	const getSortByValue = (): SortOption => {
		switch (sortBy) {
			case 'Longest':
				return 'longest';
			case 'Shortest':
				return 'shortest';
			case 'Most Recent':
				return 'recent';
			case 'Oldest':
				return 'oldest';
			default:
				return 'longest';
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} customClasses="!max-w-[650px]">
			<div className="bg-color-gray-700 rounded-lg p-6">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold">
						{ringName ? `${ringName} - ` : ''}Focus {getFormattedDuration(goalSeconds, false, true)}
					</h2>
					<Icon
						name="close"
						customClass="cursor-pointer hover:text-color-gray-100"
						onClick={onClose}
					/>
				</div>

				{/* Streaks Section */}
				<div className="grid grid-cols-2 gap-3 mb-3">
					<StreakDisplay
						title="Current Streak"
						streak={streakData?.currentStreak}
						iconName="local_fire_department"
						iconColor="text-orange-500"
					/>
					<StreakDisplay
						title="Longest Streak"
						streak={streakData?.longestStreak}
						iconName="local_fire_department"
						iconColor="text-purple-500"
					/>
				</div>

				{/* Focus Stats Card */}
				<div className="mb-6">
					<FocusStatsCard
						selectedInterval={selectedInterval}
						setSelectedInterval={setSelectedInterval}
						selectedDates={selectedDates}
						setSelectedDates={setSelectedDates}
						selectedIntervalOptions={selectedIntervalOptions}
						dailyDurationsMap={streakData?.dailyDurationsMap || {}}
						goalSeconds={goalSeconds}
						customDailyFocusGoal={customDailyFocusGoal}
						setIsModalPickDateRangeOpen={setIsModalPickDateRangeOpen}
						startDate={startDate}
						endDate={endDate}
					/>
				</div>

				{/* View toggle button with sort dropdown */}
				<div className="flex justify-between items-center mb-3">
					{/* Sort dropdown - only visible in streaks view */}
					{viewMode === 'streaks' && (
						<GeneralSelectButtonAndDropdown
							selected={sortBy}
							setSelected={setSortBy}
							selectedOptions={['Longest', 'Shortest', 'Most Recent', 'Oldest']}
						/>
					)}

					{/* Spacer for calendar view */}
					{viewMode === 'calendar' && <div></div>}

					<button
						onClick={() => setViewMode(viewMode === 'calendar' ? 'streaks' : 'calendar')}
						className={classNames(
							"text-[14px] py-1 px-3 rounded-3xl cursor-pointer bg-color-gray-600 border text-color-gray-50 transition-colors flex items-center gap-1",
							"border-color-gray-100",
							chosenColorObj.hover.textColor,
							chosenColorObj.hover.borderColor
						)}
					>
						{viewMode === 'calendar' ? (
							<>
								<Icon name="list" customClass="!text-[18px]" />
								<span>View All Streaks</span>
							</>
						) : (
							<>
								<Icon name="calendar_month" customClass="!text-[18px]" />
								<span>View Calendar</span>
							</>
						)}
					</button>
				</div>

				{viewMode === 'calendar' ? (
					<>
						{/* Calendar Navigation */}
						<CalendarNavigation
							currentDate={currentDate}
							showYearView={showYearView}
							setShowYearView={setShowYearView}
							monthName={monthName}
							goToPreviousMonth={goToPreviousMonth}
							goToNextMonth={goToNextMonth}
							goToPreviousYear={goToPreviousYear}
							goToNextYear={goToNextYear}
						/>

						{/* Calendar Grid or Year View */}
						{showYearView ? (
							<YearView
								currentDate={currentDate}
								setCurrentDate={setCurrentDate}
								setShowYearView={setShowYearView}
							/>
						) : (
							<CalendarGrid
								currentDate={currentDate}
								dailyDurationsMap={streakData?.dailyDurationsMap}
								themeColor={chosenColorObj.hexColor}
								goalSeconds={goalSeconds}
								ringColor={ringColor}
								useThemeColor={useThemeColor}
								selectedDaysOfWeek={selectedDaysOfWeek}
								restDays={restDays}
								customDailyFocusGoal={customDailyFocusGoal}
							/>
						)}
					</>
				) : (
					<StreaksList
						allStreaks={streakData?.allStreaks || []}
						currentStreak={streakData?.currentStreak}
						sortBy={getSortByValue()}
					/>
				)}

				{/* Custom date modal */}
				{renderCustomDateModal()}
			</div>
		</Modal>
	);
};

// Streak Display Component
const StreakDisplay = ({
	title,
	streak,
	iconName,
	iconColor,
}: {
	title: string;
	streak?: Streak;
	iconName: string;
	iconColor: string;
}) => (
	<div className="bg-color-gray-600 rounded-lg p-4">
		<div className="flex items-center gap-2 text-color-gray-100">
			<span>{title}</span>
			<Icon name={iconName} customClass={classNames(iconColor, '!text-[24px]')} />
		</div>
		<div className="text-2xl font-bold mb-1">{streak?.days || 0} Days</div>
		{streak?.from && streak?.to && (
			<div className="text-color-gray-100 text-xs">
				{formatDateWithoutTimezone(streak.from)}{' '}
				-{' '}
				{formatDateWithoutTimezone(streak.to)}
			</div>
		)}
	</div>
);

// Calendar Navigation Component
const CalendarNavigation = ({
	currentDate,
	showYearView,
	setShowYearView,
	monthName,
	goToPreviousMonth,
	goToNextMonth,
	goToPreviousYear,
	goToNextYear,
}: {
	currentDate: Date;
	showYearView: boolean;
	setShowYearView: (value: boolean) => void;
	monthName: string;
	goToPreviousMonth: () => void;
	goToNextMonth: () => void;
	goToPreviousYear: () => void;
	goToNextYear: () => void;
}) => (
	<div className="flex items-center justify-between px-4 mb-4">
		<div className="flex-1 font-semibold text-lg">
			<span className="cursor-pointer" onClick={() => setShowYearView(!showYearView)}>
				{showYearView ? `${currentDate.getFullYear()}` : `${monthName} ${currentDate.getFullYear()}`}
			</span>
		</div>
		<div className="flex items-center">
			<Icon
				name="keyboard_double_arrow_left"
				fill={0}
				customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
				onClick={goToPreviousYear}
			/>
			<Icon
				name="chevron_left"
				fill={0}
				customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
				onClick={goToPreviousMonth}
			/>
			<Icon
				name="fiber_manual_record"
				fill={0}
				customClass={'text-color-gray-50 !text-[6px] mx-1'}
			/>
			<Icon
				name="chevron_right"
				fill={0}
				customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
				onClick={goToNextMonth}
			/>
			<Icon
				name="keyboard_double_arrow_right"
				fill={0}
				customClass={'text-color-gray-50 !text-[18px] hover:text-white cursor-pointer'}
				onClick={goToNextYear}
			/>
		</div>
	</div>
);

// Calendar Grid Component
const CalendarGrid = ({
	currentDate,
	dailyDurationsMap,
	themeColor,
	goalSeconds,
	ringColor,
	useThemeColor,
	selectedDaysOfWeek,
	restDays,
	customDailyFocusGoal,
}: {
	currentDate: Date;
	dailyDurationsMap?: { [dateKey: string]: number };
	themeColor: string;
	goalSeconds: number;
	ringColor?: string | null;
	useThemeColor?: boolean;
	selectedDaysOfWeek: Record<string, boolean>;
	restDays: Record<string, boolean>;
	customDailyFocusGoal: Record<string, number>;
}) => {
	// Determine which color to use for the ring
	const ringDisplayColor = useThemeColor ? themeColor : (ringColor || themeColor);

	// Get first day of month and last day
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

	// Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
	// Convert to Monday-based (0 = Monday, 6 = Sunday)
	const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

	// Create array of all days in month
	const daysInMonth = lastDay.getDate();
	const days: (Date | null)[] = [];

	// Add empty cells for days before month starts
	for (let i = 0; i < firstDayOfWeek; i++) {
		days.push(null);
	}

	// Add all days of the month
	for (let day = 1; day <= daysInMonth; day++) {
		days.push(new Date(year, month, day, 12, 0, 0));
	}

	// Map day headers to selectedDaysOfWeek keys
	const dayHeaders = [
		{ label: 'Mo', key: 'monday' },
		{ label: 'Tu', key: 'tuesday' },
		{ label: 'We', key: 'wednesday' },
		{ label: 'Th', key: 'thursday' },
		{ label: 'Fr', key: 'friday' },
		{ label: 'Sa', key: 'saturday' },
		{ label: 'Su', key: 'sunday' },
	];

	return (
		<div>
			{/* Day headers */}
			<div className="grid grid-cols-7 gap-2 text-center text-sm text-color-gray-100 mb-2">
				{dayHeaders.map(({ label, key }) => {
					const isDaySelected = selectedDaysOfWeek?.[key] ?? true;
					const isFreebieDay = !isDaySelected;

					return (
						<div key={label} className="flex items-center justify-center gap-1">
							<span>{label}</span>
							{isFreebieDay && (
								<Icon
									name="featured_seasonal_and_gifts"
									fill={1}
									customClass="!text-[14px] text-sky-300"
								/>
							)}
						</div>
					);
				})}
			</div>

			{/* Calendar grid */}
			<div className="grid grid-cols-7 gap-2">
				{days.map((day, index) => {
					if (day === null) {
						return <div key={`empty-${index}`} className="w-[40px] h-[40px]"></div>;
					}

					// Format date as YYYY-MM-DD to match API format
					const dateKey = formatDateAsAPIKey(day);
					const totalFocusDurationForDay = dailyDurationsMap?.[dateKey] || 0;

					// Check if this day has a custom goal, otherwise use default
					const customGoalForDay = customDailyFocusGoal?.[dateKey];
					const goalForDay = customGoalForDay !== undefined ? customGoalForDay : goalSeconds;
					const percentageOfFocusedGoalHours = (totalFocusDurationForDay / goalForDay) * 100;

					const dayData = {
						goalSeconds: goalForDay, // Use day-specific goal (custom or default)
						totalFocusDurationForDay,
						percentageOfFocusedGoalHours,
					};

					return (
						<FocusGoalCalendarDay
							key={index}
							day={day}
							dayData={dayData}
							themeColor={ringDisplayColor}
							goalSeconds={goalSeconds}
							restDays={restDays}
							dateKey={dateKey}
							selectedDaysOfWeek={selectedDaysOfWeek}
							customDailyFocusGoal={customDailyFocusGoal}
						/>
					);
				})}
			</div>
		</div>
	);
};

// Year View Component
const YearView = ({
	currentDate,
	setCurrentDate,
	setShowYearView,
}: {
	currentDate: Date;
	setCurrentDate: (date: Date) => void;
	setShowYearView: (value: boolean) => void;
}) => {
	const { chosenColorObj } = useThemeContext() as any;
	const monthsOfYear = getAllMonths(currentDate);

	return (
		<div className="grid grid-cols-3 gap-2 my-3">
			{monthsOfYear.map((monthDate) => {
				const monthName = monthDate.toLocaleString('default', { month: 'short' });
				const isSelected =
					monthDate.getFullYear() === currentDate.getFullYear() &&
					monthDate.getMonth() === currentDate.getMonth();

				return (
					<div
						key={`${monthName}-${monthDate.getFullYear()}`}
						className="flex justify-center"
						onClick={() => {
							setCurrentDate(monthDate);
							setShowYearView(false);
						}}
					>
						<div
							className={classNames(
								'flex justify-center items-center h-[40px] w-[60px] cursor-pointer rounded-full',
								isSelected ? chosenColorObj.bgColor : 'bg-color-gray-600 hover:bg-color-gray-500'
							)}
						>
							{monthName}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ModalFocusGoalProgress;
