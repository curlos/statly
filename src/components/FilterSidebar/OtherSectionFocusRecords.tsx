import Icon from '../Icon';
import useHandleError from '../../hooks/useHandleError';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/ticktick-1.00/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputMaxFocusRecordsPerPage from './InputMaxFocusRecordsPerPage';

const OtherSectionFocusRecords = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const {
		focusRecordsPageSettings: {
			showCompletedTasks,
			showFocusNotes,
			showTotalFocusDuration,
			maxFocusRecordsPerPage,
			filterOutUnrelatedTasksWhenTaskIdIsApplied,
		},
	} = useUserSettingsContext();

	const handleError = useHandleError();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Other</h3>
						<Icon
							name="other_admission"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
			>
				{!isLoadingGetUserSettings && (
					<>
						{/* Checkbox - Show Completed Tasks */}
						<CheckboxOther
							{...{
								userSettings,
								userSettingProperty: 'showCompletedTasks',
								name: 'Show Completed Tasks',
								showValue: showCompletedTasks,
								handleError,
								editUserSettings,
								chosenColorObj,
								nextLightestColorObj,
							}}
						/>

						{/* Checkbox - Show Completed Tasks */}
						<CheckboxOther
							{...{
								userSettings,
								userSettingProperty: 'showFocusNotes',
								name: 'Show Focus Notes',
								showValue: showFocusNotes,
								handleError,
								editUserSettings,
								chosenColorObj,
								nextLightestColorObj,
							}}
						/>

						{/* Checkbox - Show Total Focus Records Duration */}
						<CheckboxOther
							{...{
								userSettings,
								userSettingProperty: 'showTotalFocusDuration',
								name: 'Show Total Focus Records Duration',
								showValue: showTotalFocusDuration,
								handleError,
								editUserSettings,
								chosenColorObj,
								nextLightestColorObj,
							}}
						/>

						{/* Checkbox - Filter Out Unrelated Tasks When Task ID Is Applied */}
						<CheckboxOther
							{...{
								userSettings,
								userSettingProperty: 'filterOutUnrelatedTasksWhenTaskIdIsApplied',
								name: 'Filter Out Unrelated Tasks When Task ID Is Applied',
								showValue: filterOutUnrelatedTasksWhenTaskIdIsApplied,
								handleError,
								editUserSettings,
								chosenColorObj,
								nextLightestColorObj,
							}}
						/>

						{/* Input - Max Focus Records Per Page */}
						<InputMaxFocusRecordsPerPage
							{...{
								maxFocusRecordsPerPage,
								handleError,
								userSettings,
								editUserSettings,
							}}
						/>
					</>
				)}
			</Accordion>
		</div>
	);
};

export default OtherSectionFocusRecords;
