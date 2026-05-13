import Icon from '../Icon';
import { useState } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import Accordion from '../Accordion/Accordion';
import Spinner from '../Loaders/Spinner';
import CheckboxOther from './CheckboxOther';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import useExportCompletedTasks from './hooks/useExportCompletedTasks';

const ExportBackupSectionCompletedTasks = () => {
	const {
		completedTasksPageSettings: {
			onlyExportTasksWithNoParent,
		},
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	const handleCheckboxClick = (showValue: boolean, userSettingProperty: string) => {
		const newShowValue = !showValue;
		handleUpdateUserSettingForPage('completedTasks', userSettingProperty, newShowValue);
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
					{/* Copy Completed Tasks to Clipboard */}
					<CompletedTasksExporter
						text="Copy Completed Tasks to Clipboard"
						icon="content_copy"
						action="handleCopyToClipboard"
					/>

					{/* Download Completed Tasks (Single File) */}
					<CompletedTasksExporter
						text="Export Completed Tasks"
						icon="download"
						action="downloadSingleMarkdownFile"
					/>

					{/* Export Completed Tasks by Project */}
					<CompletedTasksExporter
						text="Export Completed Tasks by Project"
						icon="download"
						action="downloadZipFolderOfGroupedCompletedTasks"
						params={['project']}
					/>

					{/* Export Completed Tasks by Task */}
					<CompletedTasksExporter
						text="Export Completed Tasks by Task"
						icon="download"
						action="downloadZipFolderOfGroupedCompletedTasks"
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
			</Accordion>
		</div>
	);
};

interface CompletedTasksExporterProps {
	text: string;
	icon: string;
	action: string;
	params?: string[];
}

const CompletedTasksExporter: React.FC<CompletedTasksExporterProps> = ({ text, icon, action, params = [] }) => {
	const { chosenColorObj } = useThemeContext();

	const [copiedToClipboardStatus, setCopiedToClipboardStatus] = useState('none');
	const { handleCopyToClipboard, downloadSingleMarkdownFile, downloadZipFolderOfGroupedCompletedTasks } = useExportCompletedTasks();

	const actionFunctions = {
		handleCopyToClipboard: handleCopyToClipboard,
		downloadSingleMarkdownFile: downloadSingleMarkdownFile,
		downloadZipFolderOfGroupedCompletedTasks: downloadZipFolderOfGroupedCompletedTasks,
	} as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>;

	const statusLabel = copiedToClipboardStatus === 'copying' ? 'Loading' : copiedToClipboardStatus === 'done' ? 'Done' : copiedToClipboardStatus === 'error' ? 'Error' : '';

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
					const result = await actionFunction(...params);

					// Handle clipboard-specific errors
					if (action === 'handleCopyToClipboard' && result && typeof result === 'object' && 'success' in result && !result.success) {
						setCopiedToClipboardStatus('error');
						console.error('Copy to clipboard failed:', 'error' in result ? result.error : 'Unknown error');
					} else {
						setCopiedToClipboardStatus('done');
					}

					setTimeout(() => {
						setCopiedToClipboardStatus('none');
					}, 2000);
				}, 0);
			}}
		>
			{copiedToClipboardStatus === 'copying' ? (
				<Spinner />
			) : (
				<Icon
					name={copiedToClipboardStatus === 'none' ? icon : copiedToClipboardStatus === 'error' ? 'error' : 'check'}
					fill={0}
					customClass={classNames(
						'!text-[20px] rounded-lg bg-color-gray-300 p-[6px]',
						copiedToClipboardStatus === 'none'
							? `'text-color-gray-50' ${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
							: copiedToClipboardStatus === 'error'
								? 'text-red-500'
								: 'text-emerald-500'
					)}
				/>
			)}
			<span>{text}</span>
			{statusLabel && <span className="sr-only" aria-live="polite">{statusLabel}</span>}
		</button>
	);
};

export default ExportBackupSectionCompletedTasks;
