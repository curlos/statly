import Icon from '../Icon';
import { useState } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import Accordion from '../Accordion/Accordion';
import Spinner from '../Loaders/Spinner';
import CheckboxOther from './CheckboxOther';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import useExportFocusRecords from './hooks/useExportFocusRecords';

const ExportBackupSectionFocusRecords = () => {
	const {
		focusRecordsPageSettings: {
			onlyExportTasksWithNoParent,
		},
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	const handleCheckboxClick = (showValue: boolean, userSettingProperty: string) => {
		const newShowValue = !showValue;
		handleUpdateUserSettingForPage('focusRecords', userSettingProperty, newShowValue);
	};

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Export & Backup</h3>
						<Icon
							name="backup"
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
				{/* Copy Focus Records To Clipboard */}
				<FocusRecordsExporter
					text="Copy Focus Records To Clipboard"
					icon="content_copy"
					action="handleCopyToClipboard"
				/>

				{/* Download Focus Records (Single File) */}
				<FocusRecordsExporter
					text="Export Focus Records"
					icon="download"
					action="downloadSingleMarkdownFile"
				/>

				{/* Export Focus Records By Project */}
				<FocusRecordsExporter
					text="Export Focus Records By Project"
					icon="download"
					action="downloadZipFolderOfGroupedFocusRecords"
					params={['project']}
				/>

				{/* Export Focus Records By Task */}
				<FocusRecordsExporter
					text="Export Focus Records By Task"
					icon="download"
					action="downloadZipFolderOfGroupedFocusRecords"
					params={['task']}
				/>

				<div className="pl-9">
					<CheckboxOther
						name="Only Export Tasks With No Parent"
						showValue={onlyExportTasksWithNoParent}
						handleCheckboxClick={() =>
							handleCheckboxClick(onlyExportTasksWithNoParent, 'onlyExportTasksWithNoParent')
						}
					/>
				</div>
			</Accordion>
		</div>
	);
};

interface FocusRecordsExporterProps {
	text: string;
	icon: string;
	action: string;
	params?: string[];
}

const FocusRecordsExporter: React.FC<FocusRecordsExporterProps> = ({ text, icon, action, params = [] }) => {
	const { chosenColorObj } = useThemeContext();

	const [copiedToClipboardStatus, setCopiedToClipboardStatus] = useState('none');
	const { handleCopyToClipboard, downloadSingleMarkdownFile, downloadZipFolderOfGroupedFocusRecords } = useExportFocusRecords();

	const actionFunctions: Record<string, (...args: any[]) => Promise<void>> = {
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

export default ExportBackupSectionFocusRecords;
