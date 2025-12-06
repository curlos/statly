import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputNumUserSettings from './InputNumUserSettings';
import GoalSecondsInput from './GoalSecondsInput';
import { useGetUserSettingsQuery, useEditUserSettingsMutation } from '../../services/resources/userSettingsApi';

const FocusHoursGoalPageSettingsSection = () => {
	const {
		focusHoursGoalPageSettings: { showStreakCount, goalDays, goalSeconds, showGoalDays },
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	const handleCheckboxClick = (showValue, userSettingProperty) => {
		const newShowValue = !showValue;
		handleUpdateUserSettingForPage('focusHoursGoal', userSettingProperty, newShowValue);
	};

	return (
		<div>
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
			</Accordion>
		</div>
	);
};

export default FocusHoursGoalPageSettingsSection;
