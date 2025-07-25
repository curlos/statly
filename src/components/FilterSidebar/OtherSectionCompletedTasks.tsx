import Icon from '../Icon';
import useHandleError from '../../hooks/useHandleError';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/ticktick-1.00/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputNumUserSettings from './InputNumUserSettings';
import Spinner from '../Loaders/Spinner';
import classNames from 'classnames';
import { useState } from 'react';
import { useThemeContext } from '../../contexts/useThemeContext';
import useExportCompletedTasks from './hooks/useExportCompletedTasks';

const OtherSectionFocusRecords = () => {
	const {
		completedTasksPageSettings: {
			filterOutUnrelatedTasksWhenTaskIdIsApplied,
			groupedTasksCollapsedByDefault,
			showIndentedTasks,
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
		const restOfPagesKeysAndVals = userSettings?.tickTickOne?.pages;

		handleError(async () => {
			const payload = {
				tickTickOne: {
					pages: {
						...restOfPagesKeysAndVals,
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

						<CheckboxOther
							{...{
								name: 'Show Indented Tasks',
								showValue: showIndentedTasks,
								handleCheckboxClick: () => handleCheckboxClick(showIndentedTasks, 'showIndentedTasks'),
							}}
						/>

						{/* Copy Focus Records To Clipboard */}
						<CompletedTasksExporter
							{...{
								text: 'Copy Completed Tasks To Clipboard',
								icon: 'content_copy',
								action: 'handleCopyToClipboard',
							}}
						/>

						{/* TODO: Export Focus Records By Project */}
						{/* <CompletedTasksExporter
							{...{
								text: 'Export Completed Tasks By Project',
								icon: 'download',
								action: 'downloadZipFolderOfGroupedFocusRecords',
								params: ['project'],
							}}
						/> */}

						{/* TODO: Export Focus Records By Task */}
						{/* <CompletedTasksExporter
							{...{
								text: 'Export Completed Tasks by Parent Task',
								icon: 'download',
								action: 'downloadZipFolderOfGroupedFocusRecords',
								params: ['task'],
							}}
						/> */}

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

const CompletedTasksExporter = ({ text, icon, action, params = [] }) => {
	const { chosenColorObj } = useThemeContext();

	const [copiedToClipboardStatus, setCopiedToClipboardStatus] = useState('none');
	const { handleCopyToClipboard, downloadZipFolderOfGroupedCompletedTasks } = useExportCompletedTasks();

	const actionFunctions = {
		handleCopyToClipboard: handleCopyToClipboard,
		downloadZipFolderOfGroupedFocusRecords: downloadZipFolderOfGroupedCompletedTasks,
	};

	return (
		<div
			className={classNames('flex items-center gap-2 my-2 cursor-pointer', chosenColorObj.hover.textColor)}
			onClick={() => {
				setCopiedToClipboardStatus('copying');

				// Let the UI update before doing heavy work
				setTimeout(() => {
					const actionFunction = actionFunctions[action];
					actionFunction(...params);

					setCopiedToClipboardStatus('done');

					setTimeout(() => {
						setCopiedToClipboardStatus('none');
					}, 1000);
				}, 0);
			}}
		>
			{copiedToClipboardStatus === 'copying' ? (
				<Spinner />
			) : (
				<Icon
					name={copiedToClipboardStatus === 'none' ? icon : 'check'}
					fill={0}
					customClass={classNames(
						'!text-[20px] cursor-pointer rounded-lg bg-color-gray-300 p-[6px]',
						copiedToClipboardStatus === 'none'
							? `'text-color-gray-50' ${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
							: 'text-emerald-500'
					)}
				/>
			)}
			<div>{text}</div>
		</div>
	);
};

export default OtherSectionFocusRecords;
