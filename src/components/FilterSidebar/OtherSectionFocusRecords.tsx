import Icon from '../Icon';
import useHandleError from '../../hooks/useHandleError';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import CheckboxOther from './CheckboxOther';
import InputNumUserSettings from './InputNumUserSettings';
import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useState } from 'react';
// import useExportFocusRecords from './hooks/useExportFocusRecords';
import Spinner from '../Loaders/Spinner';
import MedalImage from './MedalImage';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import useExportFocusRecords from './hooks/useExportFocusRecords';

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
			onlyExportTasksWithNoParent,
			showMedals,
		},
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	const handleError = useHandleError();
	const { searchParams, updateQueryParams } = useSearchParamsContext();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	// Get crosses-midnight from query params (defaults to false)
	const crossesMidnight = searchParams.get('crosses-midnight') === 'true';

	const handleCheckboxClick = (showValue, userSettingProperty) => {
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
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Other</h3>
						<Icon
							name="other_admission"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] cursor-pointer'}
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

						{/* Copy Focus Records To Clipboard */}
						<FocusRecordsExporter
							{...{
								text: 'Copy Focus Records To Clipboard',
								icon: 'content_copy',
								action: 'handleCopyToClipboard',
							}}
						/>

						{/* Download Focus Records (Single File) */}
						<FocusRecordsExporter
							{...{
								text: 'Export Focus Records',
								icon: 'download',
								action: 'downloadSingleMarkdownFile',
							}}
						/>

						{/* Export Focus Records By Project */}
						<FocusRecordsExporter
							{...{
								text: 'Export Focus Records By Project',
								icon: 'download',
								action: 'downloadZipFolderOfGroupedFocusRecords',
								params: ['project'],
							}}
						/>

						{/* Export Focus Records By Task */}
						<FocusRecordsExporter
							{...{
								text: 'Export Focus Records By Task',
								icon: 'download',
								action: 'downloadZipFolderOfGroupedFocusRecords',
								params: ['task'],
							}}
						/>

						<div className="pl-9">
							<CheckboxOther
								{...{
									name: 'Only Export Tasks With No Parent',
									showValue: onlyExportTasksWithNoParent,
									handleCheckboxClick: () =>
										handleCheckboxClick(onlyExportTasksWithNoParent, 'onlyExportTasksWithNoParent'),
								}}
							/>
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

const FocusRecordsExporter = ({ text, icon, action, params = [] }) => {
	const { chosenColorObj } = useThemeContext();

	const [copiedToClipboardStatus, setCopiedToClipboardStatus] = useState('none');
	const { handleCopyToClipboard, downloadSingleMarkdownFile, downloadZipFolderOfGroupedFocusRecords } = useExportFocusRecords();

	const actionFunctions = {
		handleCopyToClipboard: handleCopyToClipboard,
		downloadSingleMarkdownFile: downloadSingleMarkdownFile,
		downloadZipFolderOfGroupedFocusRecords: downloadZipFolderOfGroupedFocusRecords,
	};

	return (
		<div
			className={classNames('flex items-center gap-2 my-2 cursor-pointer', chosenColorObj.hover.textColor)}
			onClick={() => {
				setCopiedToClipboardStatus('copying');

				// Let the UI update before doing heavy work
				setTimeout(async () => {
					const actionFunction = actionFunctions[action];
					await actionFunction(...params);

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
