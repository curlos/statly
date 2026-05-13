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
					<div className="flex items-center gap-1">
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
				showArrowNextToText={undefined}
				customClasses={undefined}
				customToggleOpen={undefined}
				preventOpen={false}
			>
				<div className="px-1">
					{/* Copy Focus Records to Clipboard */}
					<FocusRecordsExporter
						text="Copy Focus Records to Clipboard"
						icon="content_copy"
						action="handleCopyToClipboard"
					/>

					{/* Download Focus Records (Single File) */}
					<FocusRecordsExporter
						text="Export Focus Records"
						icon="download"
						action="downloadSingleMarkdownFile"
					/>

					{/* Export Focus Records by Project */}
					<FocusRecordsExporter
						text="Export Focus Records by Project"
						icon="download"
						action="downloadZipFolderOfGroupedFocusRecords"
						params={['project']}
					/>

					{/* Export Focus Records by Task */}
					<FocusRecordsExporter
						text="Export Focus Records by Task"
						icon="download"
						action="downloadZipFolderOfGroupedFocusRecords"
						params={['task']}
					/>
				</div>

				<div className="pl-9">
					<CheckboxOther
						name="Only Export Tasks With No Parent"
						showValue={onlyExportTasksWithNoParent}
						handleCheckboxClick={() =>
							handleCheckboxClick(onlyExportTasksWithNoParent, 'onlyExportTasksWithNoParent')
						}
					/>
				</div>

				<div className="px-1">
					{/* Export Focus Records by Emotion */}
					<FocusRecordsExporter
						text="Export Focus Records by Emotion"
						icon="download"
						action="downloadZipFolderOfGroupedFocusRecords"
						params={['emotion']}
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

	const actionFunctions = {
		handleCopyToClipboard: handleCopyToClipboard,
		downloadSingleMarkdownFile: downloadSingleMarkdownFile,
		downloadZipFolderOfGroupedFocusRecords: downloadZipFolderOfGroupedFocusRecords,
	} as Record<string, (...args: unknown[]) => Promise<void>>;

	const statusLabel = copiedToClipboardStatus === 'copying' ? 'Loading' : copiedToClipboardStatus === 'done' ? 'Done' : '';

	return (
		<button
			type="button"
			disabled={copiedToClipboardStatus === 'copying'}
			aria-busy={copiedToClipboardStatus === 'copying'}
			className={classNames('flex items-center gap-2 my-2 cursor-pointer disabled:cursor-not-allowed', chosenColorObj.hover.textColor)}
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
			<span>{text}</span>
			{statusLabel && <span className="sr-only" aria-live="polite">{statusLabel}</span>}
		</button>
	);
};

export default ExportBackupSectionFocusRecords;
