import { useState, useEffect, useRef } from 'react';
import Icon from '../Icon';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputNumUserSettings from './InputNumUserSettings';
import GoalSecondsInput from './GoalSecondsInput';
import { truncateText } from '../../utils/text.utils';
import { useThemeContext } from '../../contexts/useThemeContext';
import classNames from 'classnames';
import ModalRestDays from '../Modal/ModalRestDays';
import ModalCustomFocusGoals from '../Modal/ModalCustomFocusGoals';
import Spinner from '../Loaders/Spinner';
import RingColorPicker from '../ColorPicker/RingColorPicker';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ProjectsTickTickSection from './ProjectsTickTickSection';
import Accordion from '../Accordion/Accordion';
import useWindowSize from '../../hooks/useWindowSize';
import type { Ring } from '../../types/api';

/**
 * Filters out same-day inactive periods (where startDate === endDate).
 * These occur when a ring is paused and unpaused on the same day,
 * resulting in 0 days of actual inactivity.
 */
const cleanupSameDayInactivePeriods = (
	periods: Array<{ startDate: string; endDate: string | null }>
): Array<{ startDate: string; endDate: string | null }> => {
	return periods.filter(period => period.startDate !== period.endDate);
};

const FocusHoursGoalPageSettingsSection = () => {
	const {
		userSettings,
		editUserSettings,
		focusHoursGoalPageSettings: { rings, activeRings, currentRing, selectedRingId, showMultiRingViewForOneActiveRing },
		handleUpdateRingSetting,
		handleSetSelectedRing,
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();
	const { width } = useWindowSize();
	const truncateLength = (width ?? 0) >= 576 ? 20 : 15;

	// Extract properties from currentRing
	const showStreakCount = currentRing?.showStreakCount ?? true;
	const goalDays = currentRing?.goalDays ?? 7;
	const goalSeconds = currentRing?.goalSeconds ?? 3600;
	const showGoalDays = currentRing?.showGoalDays ?? true;
	const selectedDaysOfWeek = currentRing?.selectedDaysOfWeek ?? {
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: true,
		sunday: true,
	};
	const restDays = currentRing?.restDays ?? {};
	const customDailyFocusGoal = currentRing?.customDailyFocusGoal ?? {};

	// Extract Combined Rings Settings
	const combinedRingsSettings = userSettings?.pages?.focusHoursGoal?.combinedRingsSettings || {
		showStreakCount: true,
		showGoalDays: true,
		goalDays: 7
	};

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { bgColor } = chosenColorObj;

	const [isRestDaysModalOpen, setIsRestDaysModalOpen] = useState(false);
	const [isCustomGoalsModalOpen, setIsCustomGoalsModalOpen] = useState(false);
	const [ringName, setRingName] = useState(currentRing?.name || '');
	const [isUpdatingRingName, setIsUpdatingRingName] = useState(false);
	const [isTogglingRingStatus, setIsTogglingRingStatus] = useState(false);
	const [ringNameError, setRingNameError] = useState('');

	// Ref to store the debounce timer
	const debounceTimerRef = useRef(null);

	// Update ringName when currentRing changes
	useEffect(() => {
		setRingName(currentRing?.name || '');
		setRingNameError(''); // Clear error when switching rings
	}, [currentRing]);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	// Validation function for ring name
	const getRingNameErrorMessage = (name: string) => {
		if (!name || name.trim().length === 0) {
			return 'Ring name cannot be empty';
		}
		return '';
	};

	// Early return if no current ring - show loading spinner
	if (!currentRing) {
		return (
			<div className="flex items-center justify-center py-8">
				<Spinner />
			</div>
		);
	}

	const handleCheckboxClick = (showValue: boolean, userSettingProperty: string) => {
		const newShowValue = !showValue;
		handleUpdateRingSetting(selectedRingId, userSettingProperty, newShowValue);
	};

	const handleCombinedCheckboxClick = (showValue: boolean, propertyName: string) => {
		const newShowValue = !showValue;
		handleUpdateUserSettingForPage(
			'focusHoursGoal',
			'combinedRingsSettings',
			{
				...combinedRingsSettings,
				[propertyName]: newShowValue
			}
		);
	};

	const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
	const dayLabels: Record<typeof daysOfWeek[number], string> = {
		monday: 'Mon',
		tuesday: 'Tue',
		wednesday: 'Wed',
		thursday: 'Thu',
		friday: 'Fri',
		saturday: 'Sat',
		sunday: 'Sun',
	};

	const handleDayToggle = (day: string) => {
		const newSelectedDays = {
			...selectedDaysOfWeek,
			[day]: !selectedDaysOfWeek[day],
		};
		handleUpdateRingSetting(selectedRingId, 'selectedDaysOfWeek', newSelectedDays);
	};

	// Get today's date in YYYY-MM-DD format
	const getTodayDateKey = () => {
		const today = new Date();
		return today.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD
	};

	const todayDateKey = getTodayDateKey();
	const isTodayRestDay = restDays?.[todayDateKey] ?? false;

	// Toggle today as a rest day
	const handleToggleTodayRestDay = () => {
		const newRestDays = {
			...restDays,
			[todayDateKey]: !isTodayRestDay,
		};
		handleUpdateRingSetting(selectedRingId, 'restDays', newRestDays);
	};

	// Check if today has a custom focus goal
	const hasCustomGoalForToday = customDailyFocusGoal?.[todayDateKey] !== undefined;

	// Toggle custom focus goal for today
	const handleToggleCustomGoalForToday = () => {
		const newCustomDailyFocusGoal = { ...customDailyFocusGoal };

		if (hasCustomGoalForToday) {
			// Remove today's custom goal
			delete newCustomDailyFocusGoal[todayDateKey];
		} else {
			// Add today's custom goal with default value
			newCustomDailyFocusGoal[todayDateKey] = goalSeconds;
		}

		handleUpdateRingSetting(selectedRingId, 'customDailyFocusGoal', newCustomDailyFocusGoal);
	};

	// Check if this is the only active ring (prevent disabling)
	const isOnlyActiveRing = () => {
		return activeRings.length === 1 && currentRing.isActive;
	};

	// Toggle ring active/paused status
	const handleToggleRingActive = async () => {
		if (isOnlyActiveRing()) return;

		setIsTogglingRingStatus(true);
		const newIsActive = !currentRing.isActive;

		// Update inactivePeriods array
		const inactivePeriods = [...(currentRing.inactivePeriods || [])];
		const today = new Date().toISOString().split('T')[0];

		if (!newIsActive) {
			// Pausing ring - add new inactive period
			inactivePeriods.push({
				startDate: today,
				endDate: null
			});
		} else {
			// Reactivating ring - close last inactive period
			if (inactivePeriods.length > 0) {
				const lastPeriod = inactivePeriods[inactivePeriods.length - 1];
				if (lastPeriod.endDate === null) {
					lastPeriod.endDate = today;
				}
			}
		}

		// Clean up same-day periods (pause/unpause on same day = 0 days inactive)
		const cleanedInactivePeriods = cleanupSameDayInactivePeriods(inactivePeriods);

		// Update both isActive and inactivePeriods
		await handleUpdateRingSetting(selectedRingId, 'inactivePeriods', cleanedInactivePeriods);
		await handleUpdateRingSetting(selectedRingId, 'isActive', newIsActive);

		setIsTogglingRingStatus(false);
	};

	// Handle ring name change with debouncing
	const handleRingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newName = e.target.value;

		// Update local state immediately for smooth UX
		setRingName(newName);

		// Clear existing timer
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Set new timer to update ring name after 1 second
		debounceTimerRef.current = setTimeout(async () => {
			// Validate ring name
			const errorMessage = getRingNameErrorMessage(newName);

			if (errorMessage) {
				setRingNameError(errorMessage);
				return; // Prevent API call
			}

			setRingNameError(''); // Clear any previous errors

			if (newName !== currentRing.name) {
				setIsUpdatingRingName(true);
				await handleUpdateRingSetting(selectedRingId, 'name', newName);
				setIsUpdatingRingName(false);
			}
		}, 1000) as unknown as null;
	};

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Ring Settings</h3>
						<Icon
							name="nest_thermostat_gen_3"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
				setIsOpenForParent={undefined}
				isChildDropdownOpen={false}
				showArrowNextToText={undefined}
				customClasses={undefined}
				customToggleOpen={undefined}
				preventOpen={false}
			>
				<div className="mb-4 bg-color-gray-700 rounded-lg">
					<div className="space-y-2">
						{rings.map((ring: Ring) => {
							const ringColor = ring.useThemeColor ? chosenColorObj.hexColor : (ring.color || chosenColorObj.hexColor);

							return (
								<button
									key={ring.id}
									onClick={() => handleSetSelectedRing(ring.id)}
									className={classNames(
										'px-3 py-2 rounded-full text-[14px] transition-colors flex items-center gap-2',
										selectedRingId === ring.id
											? `${bgColor} ${chosenColorObj.hover.bgColorHalfOpacity} text-white font-semibold`
											: 'bg-color-gray-600 text-color-gray-25 hover:bg-color-gray-200'
									)}
								>
									{(ring.color || ring.useThemeColor) && (
										<div style={{ width: '20px', height: '20px' }}>
											<CircularProgressbar
												value={100}
												strokeWidth={12}
												styles={buildStyles({
													pathColor: ringColor,
													trailColor: ringColor
												})}
											/>
										</div>
									)}
									<span>{truncateText(ring.name, truncateLength)} {!ring.isActive && (
										<span className="text-color-gray-100">(Paused)</span>
									)}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Ring Status Toggle */}
				<div className="mb-4">
						<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Ring Status</h4>
						<div className="flex items-center gap-3">
							<button
								onClick={handleToggleRingActive}
								disabled={isOnlyActiveRing() || isTogglingRingStatus}
								className={classNames(
									'px-4 py-2 rounded-full text-[14px] font-medium transition-colors flex items-center gap-2',
									currentRing.isActive
										? 'bg-green-600 hover:bg-green-700 text-white'
										: 'bg-color-gray-600 hover:bg-color-gray-200 text-white',
									(isOnlyActiveRing() || isTogglingRingStatus) && 'opacity-50 cursor-not-allowed'
								)}
							>
								<span>{currentRing.isActive ? 'Active' : 'Paused'}</span>
							</button>
							{isTogglingRingStatus && <Spinner size="sm" />}
							{isOnlyActiveRing() && (
								<p className="text-[12px] text-orange-400">
									At least one ring must remain active
								</p>
							)}
						</div>
					</div>

				{/* Ring Name Input */}
				<div className="mb-4 px-1">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Ring Name</h4>
					<div className="relative">
						<input
							type="text"
							value={ringName}
							onChange={handleRingNameChange}
							className="w-full px-3 py-2 bg-color-gray-600 rounded-lg text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter ring name..."
						/>
						{isUpdatingRingName && (
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
								<Spinner size="sm" />
							</div>
						)}
					</div>
					{ringNameError && <div className="text-[14px] text-red-500 mt-1 ml-1">{ringNameError}</div>}
				</div>

				{/* Ring Appearance Section */}
				<div className="mb-4 px-1">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">
						Ring Color
					</h4>
					<RingColorPicker
						color={currentRing.color}
						useThemeColor={currentRing.useThemeColor || false}
						onColorChange={(newColor) =>
							handleUpdateRingSetting(selectedRingId, 'color', newColor)
						}
						onUseThemeColorChange={(useThemeColor) =>
							handleUpdateRingSetting(selectedRingId, 'useThemeColor', useThemeColor)
						}
					/>
				</div>

				{/* Today Section */}
				<div className="mb-4">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Today</h4>
					<CheckboxOther
						{...{
							name: 'Mark Today as Rest Day',
							showValue: isTodayRestDay,
							handleCheckboxClick: handleToggleTodayRestDay,
						}}
					/>

					{/* Custom Focus Goal for Today */}
					<div>
						<CheckboxOther
							{...{
								name: 'Use Custom Focus Goal for Today',
								showValue: hasCustomGoalForToday,
								handleCheckboxClick: handleToggleCustomGoalForToday,
							}}
						/>
						{hasCustomGoalForToday && (
							<div className="mt-2">
								<GoalSecondsInput
									key={`custom-goal-${selectedRingId}-${todayDateKey}`}
									defaultValue={customDailyFocusGoal[todayDateKey]}
									customDateKey={todayDateKey}
									ringId={selectedRingId}
									handleUpdateRingSetting={handleUpdateRingSetting}
									customDailyFocusGoal={customDailyFocusGoal}
								/>
							</div>
						)}
					</div>
				</div>

				{/* General Section */}
				<div className="mb-4">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">General</h4>
					<CheckboxOther
						{...{
							name: 'Show Streak Count',
							showValue: showStreakCount,
							handleCheckboxClick: () => handleCheckboxClick(showStreakCount, 'showStreakCount'),
						}}
					/>
					<CheckboxOther
						{...{
							name: 'Show Goal Days',
							showValue: showGoalDays,
							handleCheckboxClick: () => handleCheckboxClick(showGoalDays, 'showGoalDays'),
						}}
					/>
					<button
						onClick={() => setIsRestDaysModalOpen(true)}
						className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-color-gray-600 hover:bg-color-gray-500 rounded-lg transition-colors text-[14px]"
					>
						<Icon name="calendar_month" fill={1} customClass="!text-[18px]" />
						<span>View All Rest Days</span>
					</button>
					<button
						onClick={() => setIsCustomGoalsModalOpen(true)}
						className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-color-gray-600 hover:bg-color-gray-500 rounded-lg transition-colors text-[14px]"
					>
						<Icon name="tune" fill={1} customClass="!text-[18px]" />
						<span>View All Custom Focus Goal Days</span>
					</button>
				</div>

				{/* Streak Goal Section */}
				<div className="mb-4">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Streak Goal</h4>
					<InputNumUserSettings
						key={`goal-days-${selectedRingId}`}
						defaultValue={goalDays}
						userSettings={userSettings!}
						editUserSettings={editUserSettings}
						minNum={1}
						maxNum={36524}
						name="Goal Days"
						page="focus-hours-goal-page"
						inputMaxWidth="w-[70px]"
						ringId={selectedRingId}
						handleUpdateRingSetting={handleUpdateRingSetting}
					/>
				</div>

				{/* Daily Focus Goal Section */}
				<div className="mb-4">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Daily Focus Goal</h4>
					<GoalSecondsInput
						key={`goal-seconds-${selectedRingId}`}
						defaultValue={goalSeconds}
						ringId={selectedRingId}
						handleUpdateRingSetting={handleUpdateRingSetting}
					/>
				</div>

				{/* Streak Days Section */}
				<div className="mb-4">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-1">Streak Days</h4>
					<p className="text-[14px] text-color-gray-50 mt-0 mb-2">
						Select days that can break your streak. Unselected days are "freebie" days.
					</p>
					<div className="flex gap-2 flex-wrap">
						{daysOfWeek.map((day) => (
							<button
								key={day}
								onClick={() => handleDayToggle(day)}
								className={classNames(
									'px-2 py-1 rounded-full text-sm transition-colors',
									selectedDaysOfWeek[day]
										? `${bgColor} text-white`
										: 'bg-color-gray-300 text-color-gray-50 hover:bg-color-gray-200'
								)}
							>
								{dayLabels[day]}
							</button>
						))}
					</div>
				</div>

				<div className="mb-4">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-1">Filtered Projects</h4>
					<p className="text-[14px] text-color-gray-50 mt-0 mb-2">
						Select projects to count towards your focus hours for this ring. Only time tracked in selected projects will contribute to your daily goal.
					</p>
					<ProjectsTickTickSection page="focus-hours-goal" />
				</div>

				<ModalRestDays
					isOpen={isRestDaysModalOpen}
					onClose={() => setIsRestDaysModalOpen(false)}
					restDays={restDays}
				/>
				<ModalCustomFocusGoals
					isOpen={isCustomGoalsModalOpen}
					onClose={() => setIsCustomGoalsModalOpen(false)}
					customDailyFocusGoal={customDailyFocusGoal}
				/>
			</Accordion>

			<hr className="border-color-gray-200 mb-4" />

			{/* Combined Rings Settings Accordion */}
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Combined Rings Settings</h3>
						<Icon
							name="groups"
							fill={1}
							customClass={'text-color-gray-50 !text-[20px] cursor-pointer'}
						/>
						<Icon
							name="nest_thermostat_gen_3"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
				setIsOpenForParent={undefined}
				isChildDropdownOpen={false}
				showArrowNextToText={undefined}
				customClasses={undefined}
				customToggleOpen={undefined}
				preventOpen={false}
			>
				{/* General Section */}
				<div className="mb-4">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">General</h4>
					<CheckboxOther
						{...{
							name: 'Show Streak Count',
							showValue: combinedRingsSettings.showStreakCount,
							handleCheckboxClick: () => handleCombinedCheckboxClick(combinedRingsSettings.showStreakCount, 'showStreakCount'),
						}}
					/>
					<CheckboxOther
						{...{
							name: 'Show Goal Days',
							showValue: combinedRingsSettings.showGoalDays,
							handleCheckboxClick: () => handleCombinedCheckboxClick(combinedRingsSettings.showGoalDays, 'showGoalDays'),
						}}
					/>
				</div>

				{/* Streak Goal Section */}
				<div className="mb-4">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Streak Goal</h4>
					<InputNumUserSettings
						key="combined-goal-days"
						defaultValue={combinedRingsSettings.goalDays}
						userSettings={userSettings!}
						editUserSettings={editUserSettings}
						minNum={1}
						maxNum={36524}
						name="Goal Days"
						page="focus-hours-goal-page"
						inputMaxWidth="w-[70px]"
						pageLevel={true}
						pageProperty="combinedRingsSettings"
						currentPageValue={combinedRingsSettings}
						handleUpdateUserSettingForPage={handleUpdateUserSettingForPage}
					/>
				</div>
			</Accordion>

			<hr className="border-color-gray-200 mt-2 mb-4" />

			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Page Settings</h3>
						<Icon
							name="settings"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
				setIsOpenForParent={undefined}
				isChildDropdownOpen={false}
				showArrowNextToText={undefined}
				customClasses={undefined}
				customToggleOpen={undefined}
				preventOpen={false}
			>
				<CheckboxOther
					{...{
						name: 'Show Multi-Ring View for One Active Ring',
						showValue: showMultiRingViewForOneActiveRing,
						handleCheckboxClick: () => handleUpdateUserSettingForPage('focusHoursGoal', 'showMultiRingViewForOneActiveRing', !showMultiRingViewForOneActiveRing),
					}}
				/>
			</Accordion>
		</div>
	);
};

export default FocusHoursGoalPageSettingsSection;
