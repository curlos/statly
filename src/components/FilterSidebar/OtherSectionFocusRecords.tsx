import Icon from '../Icon';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputNumUserSettings from './InputNumUserSettings';
import MedalImage from './MedalImage';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import CustomCardDisplay from './CustomCardDisplay';

const OtherSectionFocusRecords = () => {
	const {
		focusRecordsPageSettings: {
			showFocusNotes,
			showTotalFocusDuration,
			showCompletedTasks,
			showTaskAncestors,
			showTaskProjectName,
			taskIdIncludeFocusRecordsFromSubtasks,
			maxFocusRecordsPerPage,
			filterOutUnrelatedTasksWhenTaskIdIsApplied,
			showMedals,
			showFocusRecordEmotions,
			showEmotionCount,
		},
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();
	const { searchParams, updateQueryParams } = useSearchParamsContext();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	// Get crosses-midnight from query params (defaults to false)
	const crossesMidnight = searchParams.get('crosses-midnight') === 'true';

	const handleCheckboxClick = (showValue: boolean, userSettingProperty: string) => {
		const newShowValue = !showValue;
		handleUpdateUserSettingForPage('focusRecords', userSettingProperty, newShowValue);
	};

	const handleCrossesMidnightToggle = () => {
		updateQueryParams({ 'crosses-midnight': crossesMidnight ? '' : 'true' });
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
				{!isLoadingGetUserSettings && (
					<>
						{/* Notes Section */}
						<div className="mb-4">
							<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Notes</h4>
							<CheckboxOther
								{...{
									name: 'Show Focus Notes',
									showValue: showFocusNotes,
									handleCheckboxClick: () => handleCheckboxClick(showFocusNotes, 'showFocusNotes'),
								}}
							/>

							<CheckboxOther
								{...{
									name: 'Show Focus Record Emotions',
									showValue: showFocusRecordEmotions,
									handleCheckboxClick: () => handleCheckboxClick(showFocusRecordEmotions, 'showFocusRecordEmotions'),
								}}
							/>

							<CheckboxOther
								{...{
									name: 'Show Emotion Count',
									showValue: showEmotionCount,
									handleCheckboxClick: () => handleCheckboxClick(showEmotionCount, 'showEmotionCount'),
								}}
							/>
						</div>

						{/* Tasks Section */}
						<div className="mb-4">
							<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">Tasks</h4>
							<CheckboxOther
								{...{
									name: 'Show Completed Tasks',
									showValue: showCompletedTasks,
									handleCheckboxClick: () =>
										handleCheckboxClick(showCompletedTasks, 'showCompletedTasks'),
								}}
							/>

							<CheckboxOther
								{...{
									name: 'Show Task Ancestors',
									showValue: showTaskAncestors,
									handleCheckboxClick: () => handleCheckboxClick(showTaskAncestors, 'showTaskAncestors'),
								}}
							/>

							<CheckboxOther
								{...{
									name: 'Show Task Project',
									showValue: showTaskProjectName,
									handleCheckboxClick: () =>
										handleCheckboxClick(showTaskProjectName, 'showTaskProjectName'),
								}}
							/>

							<CheckboxOther
								{...{
									name: 'Task ID: Include Focus Records From Subtasks',
									showValue: taskIdIncludeFocusRecordsFromSubtasks,
									handleCheckboxClick: () =>
										handleCheckboxClick(
											taskIdIncludeFocusRecordsFromSubtasks,
											'taskIdIncludeFocusRecordsFromSubtasks'
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
						</div>

						{/* General Section */}
						<div className="mb-4">
							<h4 className="text-[14px] font-semibold text-color-gray-100 mb-2">General</h4>
							<CheckboxOther
								{...{
									name: 'Show Total Focus Records Time',
									showValue: showTotalFocusDuration,
									handleCheckboxClick: () =>
										handleCheckboxClick(showTotalFocusDuration, 'showTotalFocusDuration'),
								}}
							/>

							<CheckboxOther
								{...{
									name: 'Show Medals',
									showValue: showMedals,
									handleCheckboxClick: () => handleCheckboxClick(showMedals, 'showMedals'),
								}}
							/>

							{showMedals && (
								<div className="pl-10">
									<MedalImage />
								</div>
							)}

							<CheckboxOther
								{...{
									name: 'Crosses Midnight',
									showValue: crossesMidnight,
									handleCheckboxClick: handleCrossesMidnightToggle,
								}}
							/>

							{/* Input - Max Focus Records Per Page */}
							<InputNumUserSettings
								{...{
									defaultValue: maxFocusRecordsPerPage,
									userSettings: userSettings!,
									editUserSettings,
									minNum: 5,
									maxNum: 100,
									name: 'Max Focus Records Per Page',
									page: 'focus-records-page',
								}}
							/>
						</div>

						<CustomCardDisplay />
					</>
				)}
			</Accordion>
		</div>
	);
};

export default OtherSectionFocusRecords;
