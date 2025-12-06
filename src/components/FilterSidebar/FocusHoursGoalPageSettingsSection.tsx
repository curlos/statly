import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';

const FocusHoursGoalPageSettingsSection = () => {
	const {
		focusHoursGoalPageSettings: { showStreakCount },
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

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
				<CheckboxOther
					{...{
						name: 'Show Streak Count',
						showValue: showStreakCount,
						handleCheckboxClick: () => handleCheckboxClick(showStreakCount, 'showStreakCount'),
					}}
				/>
			</Accordion>
		</div>
	);
};

export default FocusHoursGoalPageSettingsSection;
