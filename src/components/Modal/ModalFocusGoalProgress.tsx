import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import Icon from '../Icon';
import { getFormattedDuration } from '../../utils/helpers.utils';
import { areDatesEqual, formatDateAsAPIKey, formatDateWithoutTimezone, getAllMonths } from '../../utils/date.utils';
import { truncateText } from '../../utils/text.utils';
import { useThemeContext } from '../../contexts/useThemeContext';
import classNames from 'classnames';
import FocusGoalCalendarDay from './FocusGoalCalendarDay';
import StreaksList, { SortOption } from './StreaksList';
import { useStatsDateRange } from '../../hooks/useStatsDateRange';
import FocusStatsCard from './ModalFocusGoalProgress/FocusStatsCard';
import GeneralSelectButtonAndDropdown from '../../pages/stats/StatsPage/GeneralSelectButtonAndDropdown';
import useWindowSize from '../../hooks/useWindowSize';
import type { Ring } from '../../types/api';

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

interface CombinedRing {
	ringId: string;
	ringName: string;
	ringColor: string | null;
	useThemeColor?: boolean;
	goalSeconds?: number;
	customDailyFocusGoal?: Record<string, number>;
	restDays?: Record<string, boolean>;
	selectedDaysOfWeek?: Record<string, boolean>;
	dailyDurationsMap?: Record<string, number>;
	inactivePeriods?: Array<{ startDate: string; endDate: string | null }>;
}

interface CombinedStreakData {
	combinedStreaks?: {
		currentStreak?: Streak;
		longestStreak?: Streak;
		allStreaks?: Streak[];
	};
	rings?: CombinedRing[];
	combinedGoalMetMap?: Record<string, boolean>;
	dailyDurationsMap?: Record<string, number>;
}

interface ModalFocusGoalProgressProps {
	isOpen: boolean;
	onClose: () => void;
	mode: 'single' | 'combined';
	// Single mode props
	streakData?: StreakData;
	ring?: Ring;
	// Combined mode props
	combinedStreakData?: CombinedStreakData;
	rings?: CombinedRing[];
}

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
						className="bg-transparent border-0 p-0 cursor-pointer hover:text-color-gray-25"
						onClick={onClose}
					>
						<Icon name="close" customClass="!text-[24px]" />
					</button>
				</div>

				{/* Streaks Section */}
				<div className="grid grid-cols-2 gap-3 mb-3">
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
						onClick={() => setViewMode(viewMode === 'calendar' ? 'streaks' : 'calendar')}
						className={classNames(
							"text-[14px] py-1 px-3 rounded-3xl cursor-pointer bg-color-gray-600 border text-color-gray-50 transition-colors flex items-center gap-1",
							"border-color-gray-50",
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
		<div className="flex items-center gap-2 text-color-gray-25">
			<span>{title}</span>
			<Icon name={iconName} customClass={classNames(iconColor, '!text-[24px]')} />
		</div>
		<div className="text-2xl font-bold mb-1">{streak?.days || 0} Days</div>
		{streak?.from && streak?.to && (
			<div className="text-color-gray-25 text-xs">
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
	<>
	<div aria-live="polite" aria-atomic="true" className="sr-only">
		{showYearView ? `${currentDate.getFullYear()}` : `${monthName} ${currentDate.getFullYear()}`}
	</div>
	<div className="flex items-center justify-between px-4 mb-4">
		<div className="flex-1 font-semibold text-lg">
			<button
				type="button"
				className="cursor-pointer bg-transparent border-0 p-0 font-semibold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
				onClick={() => setShowYearView(!showYearView)}
				aria-pressed={showYearView}
				aria-label={showYearView ? `${currentDate.getFullYear()}, switch to month view` : `${monthName} ${currentDate.getFullYear()}, switch to year view`}
			>
				{showYearView ? `${currentDate.getFullYear()}` : `${monthName} ${currentDate.getFullYear()}`}
			</button>
		</div>
		<div className="flex items-center">
			<button type="button" aria-label="Previous year" className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" onClick={goToPreviousYear}>
				<Icon name="keyboard_double_arrow_left" fill={0} customClass={'text-color-gray-25 !text-[22px] hover:text-color-gray-100'} />
			</button>
			<button type="button" aria-label="Previous month" className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" onClick={goToPreviousMonth}>
				<Icon name="chevron_left" fill={0} customClass={'text-color-gray-25 !text-[22px] hover:text-color-gray-100'} />
			</button>
			<Icon name="fiber_manual_record" fill={1} customClass={'text-color-gray-25 mt-[-7px] !text-[10px] mx-1'} />
			<button type="button" aria-label="Next month" className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" onClick={goToNextMonth}>
				<Icon name="chevron_right" fill={0} customClass={'text-color-gray-25 !text-[22px] hover:text-color-gray-100'} />
			</button>
			<button type="button" aria-label="Next year" className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded" onClick={goToNextYear}>
				<Icon name="keyboard_double_arrow_right" fill={0} customClass={'text-color-gray-25 !text-[22px] hover:text-color-gray-100'} />
			</button>
		</div>
	</div>
	</>
);

// Calendar Grid Component
const CalendarGrid = ({
	mode,
	currentDate,
	setCurrentDate,
	dailyDurationsMap,
	themeColor,
	goalSeconds,
	ringColor,
	useThemeColor,
	selectedDaysOfWeek,
	restDays,
	customDailyFocusGoal,
	inactivePeriods,
	rings,
	focusGridOnMount,
}: {
	mode: 'single' | 'combined';
	currentDate: Date;
	setCurrentDate: (date: Date) => void;
	dailyDurationsMap?: { [dateKey: string]: number };
	themeColor: string;
	goalSeconds: number;
	ringColor?: string | null;
	useThemeColor?: boolean;
	selectedDaysOfWeek: Record<string, boolean>;
	restDays: Record<string, boolean>;
	customDailyFocusGoal: Record<string, number>;
	inactivePeriods: Array<{ startDate: string; endDate: string | null }>;
	rings?: CombinedRing[];
	focusGridOnMount?: React.MutableRefObject<boolean>;
}) => {
	const getDefaultFocusDate = (date: Date) => {
		const today = new Date();
		if (today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth()) {
			return today;
		}
		return new Date(date.getFullYear(), date.getMonth(), 1);
	};

	const [focusedDate, setFocusedDate] = useState<Date>(() => getDefaultFocusDate(currentDate));
	const gridRef = useRef<HTMLDivElement>(null);
	const pendingFocusKey = useRef<string | null>(null);

	// After returning from YearView, focus the default day button on mount
	useEffect(() => {
		if (!focusGridOnMount?.current || !gridRef.current) return;
		focusGridOnMount.current = false;
		const target = getDefaultFocusDate(currentDate);
		const key = `${target.getFullYear()}-${target.getMonth()}-${target.getDate()}`;
		gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)?.focus();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!pendingFocusKey.current || !gridRef.current) return;
		const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${pendingFocusKey.current}"]`);
		if (btn) { pendingFocusKey.current = null; btn.focus(); }
	}, [currentDate]);

	useEffect(() => {
		if (pendingFocusKey.current !== null) return;
		setFocusedDate(getDefaultFocusDate(currentDate));
	}, [currentDate]);

	const handleKeyDown = (day: Date) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
		const y = day.getFullYear(), m = day.getMonth(), d = day.getDate();
		let newDate: Date | null = null;
		switch (e.key) {
			case 'ArrowRight': e.preventDefault(); newDate = new Date(y, m, d + 1); break;
			case 'ArrowLeft':  e.preventDefault(); newDate = new Date(y, m, d - 1); break;
			case 'ArrowDown':  e.preventDefault(); newDate = new Date(y, m, d + 7); break;
			case 'ArrowUp':    e.preventDefault(); newDate = new Date(y, m, d - 7); break;
			case 'Home':       e.preventDefault(); newDate = new Date(y, m, d - (day.getDay() + 6) % 7); break;
			case 'End':        e.preventDefault(); newDate = new Date(y, m, d + (7 - day.getDay()) % 7); break;
			case 'PageUp':     e.preventDefault(); newDate = new Date(y, m - 1, d); break;
			case 'PageDown':   e.preventDefault(); newDate = new Date(y, m + 1, d); break;
		}
		if (newDate) {
			const key = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;
			const isSameMonth = newDate.getMonth() === currentDate.getMonth() && newDate.getFullYear() === currentDate.getFullYear();
			setFocusedDate(newDate);
			if (isSameMonth) {
				gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${key}"]`)?.focus();
			} else {
				pendingFocusKey.current = key;
				setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
			}
		}
	};

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
			<div className="grid grid-cols-7 gap-2 text-center text-sm text-color-gray-25 mb-2">
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
			<div ref={gridRef} className="grid grid-cols-7 gap-2">
				{days.map((day, index) => {
					if (day === null) {
						return <div key={`empty-${index}`} className={mode === 'combined' ? 'w-[50px] h-[50px]' : 'w-[40px] h-[40px]'}></div>;
					}

					const dateKey = formatDateAsAPIKey(day);
					const isFocused = areDatesEqual(day, focusedDate);
					const navKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
					const dateLabel = day.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

					if (mode === 'combined' && rings) {
						// Multi-ring mode: prepare data for each ring
						const ringsData = rings.map(ring => {
							const duration = ring.dailyDurationsMap?.[dateKey] || 0;
							const customGoalForDay = ring.customDailyFocusGoal?.[dateKey];
							const goalForDay = customGoalForDay !== undefined ? customGoalForDay : (ring.goalSeconds || 3600);
							const percentage = (duration / goalForDay) * 100;

							return {
								ringId: ring.ringId,
								ringName: ring.ringName,
								color: ring.ringColor,
								useThemeColor: ring.useThemeColor,
								duration,
								goal: goalForDay,
								percentage,
								restDays: ring.restDays || {},
								selectedDaysOfWeek: ring.selectedDaysOfWeek || {},
								customDailyFocusGoal: ring.customDailyFocusGoal || {},
								inactivePeriods: ring.inactivePeriods || [],
							};
						});

						const ringsInfo = ringsData.map(r =>
							`${r.ringName}: ${getFormattedDuration(r.duration, false)} / ${getFormattedDuration(r.goal, false)} (${r.percentage.toFixed(2)}%)`
						).join(', ');
						const ariaLabel = `${dateLabel} - ${ringsInfo}`;

						return (
							<button
								key={index}
								type="button"
								data-date={navKey}
								tabIndex={isFocused ? 0 : -1}
								aria-label={ariaLabel}
								className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
								onFocus={(e) => {
									setFocusedDate(day);
									if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
										(e.currentTarget.firstElementChild as HTMLElement | null)?.focus();
									}
								}}
								onKeyDown={handleKeyDown(day)}
							>
								<FocusGoalCalendarDay
									mode="combined"
									day={day}
									dateKey={dateKey}
									themeColor={themeColor}
									ringsData={ringsData}
									tabIndex={-1}
								/>
							</button>
						);
					} else {
						// Single ring mode: existing logic
						const totalFocusDurationForDay = dailyDurationsMap?.[dateKey] || 0;
						const customGoalForDay = customDailyFocusGoal?.[dateKey];
						const goalForDay = customGoalForDay !== undefined ? customGoalForDay : goalSeconds;
						const percentageOfFocusedGoalHours = (totalFocusDurationForDay / goalForDay) * 100;
						const ariaLabel = `${dateLabel} - ${getFormattedDuration(totalFocusDurationForDay, false)} / ${getFormattedDuration(goalForDay, false)} - ${percentageOfFocusedGoalHours.toFixed(2)}%`;

						const dayData = {
							goalSeconds: goalForDay,
							totalFocusDurationForDay,
							percentageOfFocusedGoalHours,
						};

						return (
							<button
								key={index}
								type="button"
								data-date={navKey}
								tabIndex={isFocused ? 0 : -1}
								aria-label={ariaLabel}
								className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
								onFocus={(e) => {
									setFocusedDate(day);
									if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
										(e.currentTarget.firstElementChild as HTMLElement | null)?.focus();
									}
								}}
								onKeyDown={handleKeyDown(day)}
							>
								<FocusGoalCalendarDay
									mode="single"
									day={day}
									dayData={dayData}
									themeColor={ringDisplayColor}
									goalSeconds={goalSeconds}
									restDays={restDays}
									dateKey={dateKey}
									selectedDaysOfWeek={selectedDaysOfWeek as unknown as Record<string, boolean>}
									customDailyFocusGoal={customDailyFocusGoal}
									inactivePeriods={inactivePeriods}
									tabIndex={-1}
								/>
							</button>
						);
					}
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
	const { chosenColorObj } = useThemeContext();
	const monthsOfYear = getAllMonths(currentDate);
	const [focusedIndex, setFocusedIndex] = useState(currentDate.getMonth());
	const gridRef = useRef<HTMLDivElement>(null);
	const pendingFocusIndex = useRef<number | null>(null);

	useEffect(() => {
		if (pendingFocusIndex.current === null || !gridRef.current) return;
		const idx = pendingFocusIndex.current;
		pendingFocusIndex.current = null;
		setFocusedIndex(idx);
		gridRef.current.querySelectorAll<HTMLButtonElement>('button')[idx]?.focus();
	}, [currentDate]);

	const focusMonth = (index: number) => {
		if (index < 0) {
			pendingFocusIndex.current = 11;
			setCurrentDate(new Date(currentDate.getFullYear() - 1, 11, 1));
		} else if (index > 11) {
			pendingFocusIndex.current = 0;
			setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
		} else {
			setFocusedIndex(index);
			gridRef.current?.querySelectorAll<HTMLButtonElement>('button')[index]?.focus();
		}
	};

	return (
		<div ref={gridRef} className="grid grid-cols-3 gap-2 my-3">
			{monthsOfYear.map((monthDate, i) => {
				const monthName = monthDate.toLocaleString('default', { month: 'short' });
				const isSelected =
					monthDate.getFullYear() === currentDate.getFullYear() &&
					monthDate.getMonth() === currentDate.getMonth();

				return (
					<button
						key={`${monthName}-${monthDate.getFullYear()}`}
						type="button"
						tabIndex={i === focusedIndex ? 0 : -1}
						aria-pressed={isSelected}
						aria-label={monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
						className="flex justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
						onFocus={() => setFocusedIndex(i)}
						onKeyDown={(e) => {
							switch (e.key) {
								case 'ArrowRight': e.preventDefault(); focusMonth(i + 1); break;
								case 'ArrowLeft':  e.preventDefault(); focusMonth(i - 1); break;
								case 'ArrowDown':  e.preventDefault(); focusMonth(i + 3); break;
								case 'ArrowUp':    e.preventDefault(); focusMonth(i - 3); break;
								case 'Home':       e.preventDefault(); focusMonth(0); break;
								case 'End':        e.preventDefault(); focusMonth(11); break;
							}
						}}
						onClick={() => { setCurrentDate(monthDate); setShowYearView(false); }}
					>
						<div
							className={classNames(
								'flex justify-center items-center h-[40px] w-[60px] cursor-pointer rounded-full',
								isSelected ? chosenColorObj.bgColor : 'bg-color-gray-600 hover:bg-color-gray-500'
							)}
						>
							{monthName}
						</div>
					</button>
				);
			})}
		</div>
	);
};

export default ModalFocusGoalProgress;
