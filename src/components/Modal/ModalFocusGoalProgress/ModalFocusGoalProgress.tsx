import { useState, useEffect, useRef } from 'react';
import Modal from '../Modal';
import Icon from '../../Icon';
import { getFormattedDuration } from '../../../utils/helpers.utils';
import { truncateText } from '../../../utils/text.utils';
import { useThemeContext } from '../../../contexts/useThemeContext';
import classNames from 'classnames';
import StreaksList, { SortOption } from '../StreaksList';
import { useStatsDateRange } from '../../../hooks/useStatsDateRange';
import FocusStatsCard from './FocusStatsCard';
import GeneralSelectButtonAndDropdown from '../../../pages/stats/StatsPage/GeneralSelectButtonAndDropdown';
import useWindowSize from '../../../hooks/useWindowSize';
import YearView from './YearView';
import CalendarGrid from './CalendarGrid';
import CalendarNavigation from './CalendarNavigation';
import StreakDisplay from './StreakDisplay';
import { ModalFocusGoalProgressProps } from './types';

const ModalFocusGoalProgress: React.FC<ModalFocusGoalProgressProps> = ({
	isOpen,
	onClose,
	mode,
	streakData,
	ring,
	combinedStreakData,
	rings,
}) => {
	const { chosenColorObj } = useThemeContext();
	const { width } = useWindowSize();
	const truncateLength = (width ?? 0) >= 576 ? 20 : 15;

	const customDailyFocusGoal = ring?.customDailyFocusGoal ?? {};
	const selectedDaysOfWeek = ring?.selectedDaysOfWeek ?? {};
	const restDays = ring?.restDays ?? {};
	const inactivePeriods = (ring?.inactivePeriods ?? []) as Array<{ startDate: string; endDate: string | null }>;
	const ringName = ring?.name;
	const ringColor = ring?.color;
	const useThemeColor = ring?.useThemeColor;
	const goalSeconds = ring?.goalSeconds ?? 3600;
	const [currentDate, setCurrentDate] = useState(new Date());
	const [showYearView, setShowYearView] = useState(false);
	const shouldFocusCalendarGrid = useRef(false);
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

	// Reset calendar to current month when modal opens or ring changes
	useEffect(() => {
		if (isOpen) {
			setCurrentDate(new Date());
			setShowYearView(false);
		}
	}, [isOpen, ring?.id]);

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
						{mode === 'combined' ? 'Combined Focus Goals' : `${ringName ? `${truncateText(ringName, truncateLength)} - ` : ''}Focus ${getFormattedDuration(goalSeconds, false, true)}`}
					</h2>
					<button
						type="button"
						aria-label="Close"
						className="bg-transparent border-0 p-0 cursor-pointer hover:text-color-gray-25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
						onClick={onClose}
					>
						<Icon name="close" customClass="!text-[24px]" />
					</button>
				</div>

				{/* Streaks Section */}
				<div role="group" aria-label="Streaks" className="grid grid-cols-2 gap-3 mb-3">
					<StreakDisplay
						title="Current Streak"
						streak={mode === 'combined' ? combinedStreakData?.combinedStreaks?.currentStreak : streakData?.currentStreak}
						iconName="local_fire_department"
						iconColor="text-orange-500"
					/>
					<StreakDisplay
						title="Longest Streak"
						streak={mode === 'combined' ? combinedStreakData?.combinedStreaks?.longestStreak : streakData?.longestStreak}
						iconName="local_fire_department"
						iconColor="text-purple-500"
					/>
				</div>

				{/* Focus Stats Card */}
				<div className="mb-6">
					<FocusStatsCard
						mode={mode}
						selectedInterval={selectedInterval}
						setSelectedInterval={setSelectedInterval}
						selectedDates={selectedDates}
						setSelectedDates={setSelectedDates}
						selectedIntervalOptions={selectedIntervalOptions}
						dailyDurationsMap={mode === 'combined'
							? (combinedStreakData?.dailyDurationsMap || {})
							: (streakData?.dailyDurationsMap || {})
						}
						goalSeconds={goalSeconds}
						customDailyFocusGoal={customDailyFocusGoal}
						combinedGoalMetMap={mode === 'combined'
							? (combinedStreakData?.combinedGoalMetMap || {})
							: undefined
						}
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
						type="button"
						aria-pressed={viewMode === 'streaks'}
						onClick={() => setViewMode(viewMode === 'calendar' ? 'streaks' : 'calendar')}
						className={classNames(
							"text-[14px] py-1 px-3 rounded-3xl cursor-pointer bg-color-gray-600 border text-color-gray-50 transition-colors flex items-center gap-1",
							"border-color-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
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
								setShowYearView={(value) => {
									if (!value) shouldFocusCalendarGrid.current = true;
									setShowYearView(value);
								}}
							/>
						) : (
							<CalendarGrid
								mode={mode}
								currentDate={currentDate}
								setCurrentDate={setCurrentDate}
								focusGridOnMount={shouldFocusCalendarGrid}
								dailyDurationsMap={streakData?.dailyDurationsMap}
								themeColor={chosenColorObj.hexColor}
								goalSeconds={goalSeconds}
								ringColor={ringColor}
								useThemeColor={useThemeColor}
								selectedDaysOfWeek={selectedDaysOfWeek as unknown as Record<string, boolean>}
								restDays={restDays}
								customDailyFocusGoal={customDailyFocusGoal}
								inactivePeriods={inactivePeriods}
								rings={rings}
							/>
						)}
					</>
				) : (
					<StreaksList
						allStreaks={mode === 'combined' ? combinedStreakData?.combinedStreaks?.allStreaks || [] : streakData?.allStreaks || []}
						currentStreak={mode === 'combined' ? combinedStreakData?.combinedStreaks?.currentStreak : streakData?.currentStreak}
						sortBy={getSortByValue()}
					/>
				)}

				{/* Custom date modal */}
				{renderCustomDateModal()}
			</div>
		</Modal>
	);
};

export default ModalFocusGoalProgress;
