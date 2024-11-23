import Icon from '../Icon';
import useHandleError from '../../hooks/useHandleError';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/ticktick-1.00/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputNumUserSettings from './InputNumUserSettings';

const OtherSectionFocusRecords = () => {
	const {
		completedTasksPageSettings: {
			filterOutUnrelatedTasksWhenTaskIdIsApplied,
			groupedTasksCollapsedByDefault,
			maxDaysPerPage,
		},
	} = useUserSettingsContext();

	const handleError = useHandleError();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	const handleCheckboxClick = (showValue, userSettingProperty) => {
		const newShowValue = !showValue;

		const restOfCompletedTasksPageKeysAndVals = userSettings?.tickTickOne?.pages?.completedTasks;

		handleError(async () => {
			const payload = {
				tickTickOne: {
					pages: {
						completedTasks: {
							...restOfCompletedTasksPageKeysAndVals,
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

						{/* Input - Max Focus Records Per Page */}
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
