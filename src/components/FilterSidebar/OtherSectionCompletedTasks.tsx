import Icon from '../Icon';
import useHandleError from '../../hooks/useHandleError';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputNumUserSettings from './InputNumUserSettings';
import MedalImage from './MedalImage';

const OtherSectionFocusRecords = () => {
	const {
		completedTasksPageSettings: {
			taskIdIncludeCompletedTasksFromSubtasks,
			filterOutUnrelatedTasksWhenTaskIdIsApplied,
			groupedTasksCollapsedByDefault,
			showIndentedTasks,
			maxDaysPerPage,
		},
		focusRecordsPageSettings: { showMedals, selectedMedalImage },
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	const handleError = useHandleError();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	const handleCheckboxClick = (showValue, userSettingProperty) => {
		const newShowValue = !showValue;
		handleUpdateUserSettingForPage('completedTasks', userSettingProperty, newShowValue);
	};

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Page Settings</h3>
						<Icon
							name="settings"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
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
				{!isLoadingGetUserSettings && (
					<>
						<CheckboxOther
							{...{
								name: 'Task ID: Include Completed Tasks From Subtasks',
								showValue: taskIdIncludeCompletedTasksFromSubtasks,
								handleCheckboxClick: () =>
									handleCheckboxClick(
										taskIdIncludeCompletedTasksFromSubtasks,
										'taskIdIncludeCompletedTasksFromSubtasks'
									),
							}}
						/>

						<CheckboxOther
							{...{
								name: 'Filter Out Unrelated Tasks When Task ID Is Applied',
								showValue: filterOutUnrelatedTasksWhenTaskIdIsApplied,
								handleCheckboxClick: () =>
									handleCheckboxClick(
										filterOutUnrelatedTasksWhenTaskIdIsApplied,
										'filterOutUnrelatedTasksWhenTaskIdIsApplied'
									),
							}}
						/>

						<CheckboxOther
							{...{
								name: 'Grouped Tasks Collapsed By Default',
								showValue: groupedTasksCollapsedByDefault,
								handleCheckboxClick: () =>
									handleCheckboxClick(
										groupedTasksCollapsedByDefault,
										'groupedTasksCollapsedByDefault'
									),
							}}
						/>

						<CheckboxOther
							{...{
								name: 'Show Indented Tasks',
								showValue: showIndentedTasks,
								handleCheckboxClick: () => handleCheckboxClick(showIndentedTasks, 'showIndentedTasks'),
							}}
						/>

						<CheckboxOther
							{...{
								name: 'Show Medals',
								showValue: showMedals,
								handleCheckboxClick: () => {
									handleUpdateUserSettingForPage('focusRecords', 'showMedals', !showMedals);
								},
							}}
						/>

						{showMedals && (
							<div className="pl-10">
								<MedalImage />
							</div>
						)}

						{/* Input - Max Days Per Page */}
						<InputNumUserSettings
							{...{
								defaultValue: maxDaysPerPage,
								handleError,
								userSettings,
								editUserSettings,
								minNum: 7,
								maxNum: 14,
								name: 'Max Days Per Page',
								page: 'completed-tasks-page',
							}}
						/>
					</>
				)}
			</Accordion>
		</div>
	);
};

export default OtherSectionFocusRecords;
