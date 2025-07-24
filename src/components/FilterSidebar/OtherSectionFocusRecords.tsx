import Icon from '../Icon';
import useHandleError from '../../hooks/useHandleError';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/ticktick-1.00/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputNumUserSettings from './InputNumUserSettings';
import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useState } from 'react';
import useGetSterilizedFocusRecords from './hooks/useGetSterilizedFocusRecords';
import Spinner from '../Loaders/Spinner';

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
		},
	} = useUserSettingsContext();

	const handleError = useHandleError();

	const { chosenColorObj } = useThemeContext();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	const handleCheckboxClick = (showValue, userSettingProperty) => {
		const newShowValue = !showValue;

		const restOfFocusRecordsKeysAndVals = userSettings?.tickTickOne?.pages?.focusRecords;
		const restOfPagesKeysAndVals = userSettings?.tickTickOne?.pages;

		handleError(async () => {
			const payload = {
				tickTickOne: {
					pages: {
						...restOfPagesKeysAndVals,
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

	const [copiedToClipboardStatus, setCopiedToClipboardStatus] = useState('none');
	const { handleCopyToClipboard } = useGetSterilizedFocusRecords();

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
								name: 'Show Task Project Name',
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

						{/* Copy Focus Records To Clipboard */}
						<div
							className={classNames(
								'flex items-center gap-2 my-2 cursor-pointer',
								chosenColorObj.hover.textColor
							)}
							onClick={() => {
								setCopiedToClipboardStatus('copying');

								// Let the UI update before doing heavy work
								setTimeout(() => {
									handleCopyToClipboard();
									setCopiedToClipboardStatus('done');

									setTimeout(() => {
										setCopiedToClipboardStatus('none');
									}, 1000);
								}, 0);
							}}
						>
							{/* <Spinner /> */}

							{copiedToClipboardStatus === 'copying' ? (
								<Spinner />
							) : (
								<Icon
									name={copiedToClipboardStatus === 'none' ? 'content_copy' : 'check'}
									fill={0}
									customClass={classNames(
										'!text-[20px] cursor-pointer rounded-lg bg-color-gray-300 p-[6px]',
										copiedToClipboardStatus === 'none'
											? `'text-color-gray-50' ${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
											: 'text-emerald-500'
									)}
								/>
							)}
							<div>Copy Focus Records To Clipboard</div>
						</div>

						{/* Input - Max Focus Records Per Page */}
						<InputNumUserSettings
							{...{
								defaultValue: maxFocusRecordsPerPage,
								handleError,
								userSettings,
								editUserSettings,
								minNum: 5,
								maxNum: 100,
								name: 'Max Focus Records Per Page',
								page: 'focus-records-page',
							}}
						/>
					</>
				)}
			</Accordion>
		</div>
	);
};

export default OtherSectionFocusRecords;
