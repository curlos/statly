import { useState } from 'react';
import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputNumUserSettings from './InputNumUserSettings';
import GoalSecondsInput from './GoalSecondsInput';
import { useGetUserSettingsQuery, useEditUserSettingsMutation } from '../../services/resources/userSettingsApi';
import { useThemeContext } from '../../contexts/useThemeContext';
import classNames from 'classnames';
import ModalRestDays from '../Modal/ModalRestDays';
import ModalCustomFocusGoals from '../Modal/ModalCustomFocusGoals';

const FocusHoursGoalPageSettingsSection = () => {
	const {
		focusHoursGoalPageSettings: { showStreakCount, goalDays, goalSeconds, showGoalDays, selectedDaysOfWeek, restDays, customDailyFocusGoal },
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { bgColor } = chosenColorObj;

	const [isRestDaysModalOpen, setIsRestDaysModalOpen] = useState(false);
	const [isCustomGoalsModalOpen, setIsCustomGoalsModalOpen] = useState(false);

	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	const handleCheckboxClick = (showValue, userSettingProperty) => {
		const newShowValue = !showValue;
		handleUpdateUserSettingForPage('focusHoursGoal', userSettingProperty, newShowValue);
	};

	const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	const dayLabels = {
		monday: 'Mon',
		tuesday: 'Tue',
		wednesday: 'Wed',
		thursday: 'Thu',
		friday: 'Fri',
		saturday: 'Sat',
		sunday: 'Sun',
	};

	const handleDayToggle = (day) => {
		const newSelectedDays = {
			...selectedDaysOfWeek,
			[day]: !selectedDaysOfWeek[day],
		};
		handleUpdateUserSettingForPage('focusHoursGoal', 'selectedDaysOfWeek', newSelectedDays);
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
		handleUpdateUserSettingForPage('focusHoursGoal', 'restDays', newRestDays);
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

		handleUpdateUserSettingForPage('focusHoursGoal', 'customDailyFocusGoal', newCustomDailyFocusGoal);
	};

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Ring Settings</h3>
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
					<div className="mt-3">
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
									{...{
										defaultValue: customDailyFocusGoal[todayDateKey],
										userSettings,
										editUserSettings,
										customDateKey: todayDateKey,
									}}
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
						{...{
							defaultValue: goalDays,
							userSettings,
							editUserSettings,
							minNum: 1,
							maxNum: 36524,
							name: 'Goal Days',
							page: 'focus-hours-goal-page',
							inputMaxWidth: 'w-[70px]',
						}}
					/>
				</div>

				{/* Daily Focus Goal Section */}
				<div className="mb-4">
					<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Daily Focus Goal</h4>
					<GoalSecondsInput
						{...{
							defaultValue: goalSeconds,
							userSettings,
							editUserSettings,
						}}
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
			</Accordion>

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
		</div>
	);
};

export default FocusHoursGoalPageSettingsSection;
