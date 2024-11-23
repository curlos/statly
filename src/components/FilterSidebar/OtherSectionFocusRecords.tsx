import Icon from '../Icon';
import useHandleError from '../../hooks/useHandleError';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/ticktick-1.00/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputMaxFocusRecordsPerPage from './InputMaxFocusRecordsPerPage';

const OtherSectionFocusRecords = () => {
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

	const handleCheckboxClick = (showValue, userSettingProperty) => {
		const newShowValue = !showValue;

		const restOfFocusRecordsKeysAndVals = userSettings?.tickTickOne?.pages?.focusRecords;

		handleError(async () => {
			const payload = {
				tickTickOne: {
					pages: {
						focusRecords: {
							...restOfFocusRecordsKeysAndVals,
							[userSettingProperty]: newShowValue,
						},
					},
				},
			};

			await editUserSettings(payload).unwrap();
		});
	};

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
								name: 'Show Focus Notes',
								showValue: showFocusNotes,
								handleCheckboxClick: () => handleCheckboxClick(showFocusNotes, 'showFocusNotes'),
							}}
						/>

						<CheckboxOther
							{...{
								name: 'Show Total Focus Records Duration',
								showValue: showTotalFocusDuration,
								handleCheckboxClick: () =>
									handleCheckboxClick(showTotalFocusDuration, 'showTotalFocusDuration'),
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
