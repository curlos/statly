import classNames from 'classnames';
import { useRef, useState } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useImportBackupDataMutation } from '../../../services/resources/documentsImportApi';
import { baseAPI } from '../../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../Icon';
import CustomRadioButton from '../../CustomRadioButton';
import ModalImportProgress from '../../Modal/ModalImportProgress';
import Spinner from '../../Loaders/Spinner';
import {
	selectImportBatches,
	selectIsImporting,
	setBatches,
	updateBatch,
	setModalOpen,
	resetImport,
	BatchStatus,
} from '../../../slices/importProgressSlice';

const ImportData = () => {
	const { chosenColorObj } = useThemeContext();
	const dispatch = useDispatch();
	const [selectionMode, setSelectionMode] = useState<'files' | 'folder'>('files');
	const batches = useSelector(selectImportBatches);
	const isImporting = useSelector(selectIsImporting);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const folderInputRef = useRef<HTMLInputElement>(null);

	// Keep file batches in component state, not Redux
	const fileBatchesRef = useRef<File[][]>([]);

	const [importBackupData] = useImportBackupDataMutation();

	const processBatches = async (batchesToProcess: BatchStatus[]) => {
		// Process all batches in parallel
		const batchPromises = batchesToProcess.map(async (_, i) => {
			// Update status to 'importing'
			dispatch(updateBatch({ index: i, batch: { status: 'importing' } }));

			try {
				// Get the actual files from the ref
				const files = fileBatchesRef.current[i];
				const result = await importBackupData(files).unwrap();

				// Update status to 'success' with result
				dispatch(updateBatch({ index: i, batch: { status: 'success', result } }));
			} catch (error) {
				console.error('Error importing backup data:', error);

				// Extract error message from API response
				let errorMessage = 'Failed to import this batch';
				if (error && typeof error === 'object') {
					if ('data' in error) {
						const errorData = error.data;
						if (errorData && typeof errorData === 'object' && 'message' in errorData) {
							errorMessage = String(errorData.message);
						}
					}
				}

				// Update status to 'error' with message
				dispatch(updateBatch({ index: i, batch: { status: 'error', errorMessage } }));
			}
		});

		await Promise.allSettled(batchPromises);

		// Invalidate cache tags after all batches complete
		dispatch(
			baseAPI.util.invalidateTags([
				'OverviewStats',
				'SyncMetadata',
				'DocumentCounts',
				'Project',
				'ProjectGroup',
				'DayWithCompletedTasks',
				'ExportDayWithCompletedTasks',
				'AllTasks',
				'TasksMedal',
				'TasksChallenge',
				'TasksStats',
				'FocusRecord',
				'ExportFocusRecord',
				'AllFocusRecords',
				'FocusMedal',
				'FocusChallenge',
				'FocusStats',
			])
		);
	};

	const handleFileSelection = async (files: FileList | null) => {
		if (!files || files.length === 0) {
			return;
		}

		// If already importing, just show the modal and don't start new import
		if (isImporting) {
			dispatch(setModalOpen(true));
			return;
		}

		// Reset previous import state before starting new import
		dispatch(resetImport());

		try {
			// Convert FileList to File array
			const fileArray = Array.from(files);

			// Filter to only JSON files
			const jsonFiles = fileArray.filter((file) => file.name.endsWith('.json'));

			if (jsonFiles.length === 0) {
				alert('No JSON files found. Please select JSON backup files.');
				return;
			}

			// File count limits
			const MAX_FILES = 50;

			// Hard cap: Block imports over 50 files
			if (jsonFiles.length > MAX_FILES) {
				alert(
					`You cannot import more than ${MAX_FILES} files at once. You selected ${jsonFiles.length} files.\n\nPlease split your import into multiple uploads.`
				);
				return;
			}

			// Batch files by total size (~4MB limit per request)
			const MAX_BATCH_SIZE_BYTES = 4 * 1024 * 1024; // 4MB
			const fileBatches: File[][] = [];
			let currentBatch: File[] = [];
			let currentBatchSize = 0;

			for (const file of jsonFiles) {
				const fileSize = file.size;

				// Check if individual file exceeds limit
				if (fileSize > MAX_BATCH_SIZE_BYTES) {
					const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
					alert(
						`File "${file.name}" is too large (${fileSizeMB}MB).\n\nIndividual files must be 4MB or less. Please split or reduce the file size.`
					);
					return;
				}

				// If adding this file would exceed limit, start new batch
				if (currentBatchSize + fileSize > MAX_BATCH_SIZE_BYTES && currentBatch.length > 0) {
					fileBatches.push(currentBatch);
					currentBatch = [];
					currentBatchSize = 0;
				}

				currentBatch.push(file);
				currentBatchSize += fileSize;
			}

			// Push remaining files
			if (currentBatch.length > 0) {
				fileBatches.push(currentBatch);
			}

			// Store file batches in ref
			fileBatchesRef.current = fileBatches;

			// Initialize batch statuses with metadata only - all start as 'idle'
			const initialBatches: BatchStatus[] = fileBatches.map((files, index) => ({
				batchIndex: index,
				fileNames: files.map((f) => f.name),
				status: 'idle',
			}));

			dispatch(setBatches(initialBatches));
			dispatch(setModalOpen(true));

			// Process all batches immediately
			await processBatches(initialBatches);
		} catch (error) {
			console.error('Error importing backup data:', error);
			const errorMessage =
				error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'error' in error.data
					? String(error.data.error)
					: 'An error occurred importing backup data.';
			alert(errorMessage);
		}
	};

	const handleImportClick = () => {
		// Reset input value to allow re-importing the same files
		if (selectionMode === 'files' && fileInputRef.current) {
			fileInputRef.current.value = '';
			fileInputRef.current.click();
		} else if (folderInputRef.current) {
			folderInputRef.current.value = '';
			folderInputRef.current.click();
		}
	};

	return (
		<>
			<div className="space-y-2">
				{/* Main Import Button */}
				<div
					className={classNames(
						'flex items-center gap-2 my-2',
						isImporting ? 'cursor-not-allowed opacity-50' : `cursor-pointer ${chosenColorObj.hover.textColor}`
					)}
					onClick={isImporting ? undefined : handleImportClick}
				>
					{isImporting ? (
						<div className="rounded-lg bg-color-gray-300 p-[6px]">
							<Spinner size="sm" />
						</div>
					) : (
						<Icon
							name="upload"
							fill={0}
							customClass={classNames(
								'!text-[20px] cursor-pointer rounded-lg bg-color-gray-300 p-[6px]',
								`'text-color-gray-50' ${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
							)}
						/>
					)}
					<div>Import Focus Records, Tasks, Projects, and Project Groups</div>
				</div>

				{/* View Progress button - only show while importing */}
				{isImporting && batches.length > 0 && (
					<div
						className={classNames('flex items-center gap-2 ml-9 my-2 cursor-pointer', chosenColorObj.hover.textColor)}
						onClick={() => dispatch(setModalOpen(true))}
					>
						<Icon
							name="visibility"
							fill={0}
							customClass={classNames(
								'!text-[20px] cursor-pointer rounded-lg bg-color-gray-600 p-[6px]',
								`'text-color-gray-50' ${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
							)}
						/>
						<div>View Import Progress</div>
					</div>
				)}

				{/* Radio Button Options */}
				<div className="ml-9 space-y-2">
					<CustomRadioButton
						label="Select Files"
						name="selectionMode"
						checked={selectionMode === 'files'}
						onChange={() => setSelectionMode('files')}
						customLabelClass=""
						customOuterCircleClasses={classNames('!w-[20px] !h-[20px]')}
						customInnerCircleClasses={classNames('!w-[10px] !h-[10px]')}
						customOuterCircleBorderColorClasses={chosenColorObj.borderColor}
						customInnerCircleBgColorClasses={chosenColorObj.bgColor}
					/>
					<CustomRadioButton
						label="Select Folder"
						name="selectionMode"
						checked={selectionMode === 'folder'}
						onChange={() => setSelectionMode('folder')}
						customLabelClass=""
						customOuterCircleClasses={classNames('!w-[20px] !h-[20px]')}
						customInnerCircleClasses={classNames('!w-[10px] !h-[10px]')}
						customOuterCircleBorderColorClasses={chosenColorObj.borderColor}
						customInnerCircleBgColorClasses={chosenColorObj.bgColor}
					/>
				</div>

				{/* Hidden file input for selecting individual files */}
				<input
					ref={fileInputRef}
					type="file"
					accept=".json"
					multiple
					style={{ display: 'none' }}
					onChange={(e) => handleFileSelection(e.target.files)}
				/>

				{/* Hidden file input for selecting folders */}
				<input
					ref={folderInputRef}
					type="file"
					accept=".json"
					// @ts-expect-error - webkitdirectory is not in TypeScript types but supported by browsers
					webkitdirectory="true"
					multiple
					style={{ display: 'none' }}
					onChange={(e) => handleFileSelection(e.target.files)}
				/>
			</div>

			{/* Import Progress Modal */}
			<ModalImportProgress />
		</>
	);
};

export default ImportData;
