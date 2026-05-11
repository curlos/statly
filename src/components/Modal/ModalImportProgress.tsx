import { useEffect, useRef } from 'react';
import { useThemeContext } from '../../contexts/useThemeContext';
import Modal from './Modal';
import Icon from '../Icon';
import Spinner from '../Loaders/Spinner';
import Accordion from '../Accordion/Accordion';
import { useSelector, useDispatch } from 'react-redux';
import {
	selectImportBatches,
	selectImportModalOpen,
	selectIsImporting,
	setModalOpen,
} from '../../slices/importProgressSlice';


const ModalImportProgress: React.FC = () => {
	const dispatch = useDispatch();
	const batches = useSelector(selectImportBatches);
	const isOpen = useSelector(selectImportModalOpen);
	const isImporting = useSelector(selectIsImporting);
	const { chosenColorObj } = useThemeContext();

	// Calculate completed batches
	const completedBatches = batches.filter(
		(batch) => batch.status === 'success' || batch.status === 'error'
	).length;
	const totalBatches = batches.length;

	const headingRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		if (isOpen) headingRef.current?.focus();
	}, [isOpen]);

	const handleClose = () => {
		dispatch(setModalOpen(false));
	};

	const getBatchStatusDisplay = (status: string) => {
		switch (status) {
			case 'idle':
				return {
					icon: 'schedule',
					color: '#9ca3af',
					showSpinner: false,
				};
			case 'importing':
				return {
					icon: 'sync',
					color: chosenColorObj.hexColor,
					showSpinner: true,
				};
			case 'success':
				return {
					icon: 'check_circle',
					color: '#4ade80',
					showSpinner: false,
				};
			case 'error':
				return {
					icon: 'error',
					color: '#ef4444',
					showSpinner: false,
				};
			default:
				return {
					icon: 'schedule',
					color: '#9ca3af',
					showSpinner: false,
				};
		}
	};

	const formatCategoryResult = (
		name: string,
		data: { created: number; modified: number; matched: number; failed: number }
	) => {
		const parts: string[] = [];
		parts.push(`${data.created.toLocaleString()} created`);
		parts.push(`${data.modified.toLocaleString()} modified`);
		parts.push(`${data.matched.toLocaleString()} matched`);
		parts.push(`${data.failed.toLocaleString()} failed`);

		return (
			<>
				<span className="font-semibold">{name}:</span> {parts.join(', ')}
			</>
		);
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} customClasses="!w-[700px]">
			<div className="bg-color-gray-650 rounded-lg p-6 shadow-xl relative">
				{/* Close button */}
				<button
					onClick={handleClose}
					aria-label="Close import progress"
					className="absolute top-4 right-4 text-color-gray-100 hover:text-white transition-colors"
				>
					<Icon name="close" fill={1} customClass="!text-[24px]" />
				</button>

				{/* Title */}
				<h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold mb-2 text-white focus:outline-none">Import Files</h2>

				{/* Progress counter */}
				<div className="text-color-gray-100 mb-4 flex items-center gap-2">
					<span aria-live="polite" aria-atomic="true">
						Batches {completedBatches}/{totalBatches} Uploaded
					</span>
					{isImporting ? (
						<Spinner size="sm" />
					) : (
						completedBatches === totalBatches && (
							<Icon name="check_circle" fill={1} customClass="!text-[20px] mt-[-3px] text-emerald-500" />
						)
					)}
				</div>


				{/* Batch list with scrollbar */}
				<div className="space-y-4 max-h-[500px] overflow-auto pr-2">
					{batches.map((batch) => {
						const statusDisplay = getBatchStatusDisplay(batch.status);

						return (
							<div key={batch.batchIndex} className="bg-color-gray-700 rounded-lg p-3">
								<Accordion
									title={
										<div className="w-full pr-2 flex items-center justify-between">
											<div>
												<h3 className="font-bold text-[18px]" style={{ color: statusDisplay.color }}>
													Batch {batch.batchIndex + 1}
												</h3>
												{/* Summary results - only show after batch completes */}
												{batch.result && batch.status === 'success' && (
													<div className="text-color-gray-100 mt-1">
														{batch.result.summary.totalCreated.toLocaleString()} created,{' '}
														{batch.result.summary.totalModified.toLocaleString()} modified,{' '}
														{batch.result.summary.totalMatched.toLocaleString()} matched
														{batch.result.summary.totalFailed > 0 &&
															`, ${batch.result.summary.totalFailed.toLocaleString()} failed`}
													</div>
												)}
												{batch.status === 'error' && (
													<div className="text-red-500 mt-1">
														{batch.errorMessage || 'Failed to import'}
													</div>
												)}
											</div>
											<div className="flex items-center gap-2">
												{statusDisplay.showSpinner ? (
													<Spinner size="sm" />
												) : (
													<div style={{ color: statusDisplay.color }}>
														<Icon name={statusDisplay.icon} fill={1} customClass="!text-[20px] mt-[5px]" />
													</div>
												)}
											</div>
										</div>
									}
									openByDefault={false}
									showArrowNextToText={false}
									customClasses="!mb-0"
									setIsOpenForParent={undefined}
									isChildDropdownOpen={false}
									customToggleOpen={undefined}
									preventOpen={false}
								>
									{/* File list - always normal color */}
									<div className="mb-3 mt-2">
										<h3 className="text-color-gray-100 mb-1 font-bold">Files:</h3>
										<ul className="pl-4 space-y-1 list-disc list-inside">
											{batch.fileNames.map((fileName, idx) => (
												<li key={idx} className="text-color-gray-100">
													{fileName}
												</li>
											))}
										</ul>
									</div>

									{/* Results - only show after batch completes */}
									{batch.result && batch.status === 'success' && (
										<div className="mt-3 pt-3 border-t border-color-gray-600">
											<h3 className="text-color-gray-100 mb-2 font-bold">Results:</h3>
											<ul className="pl-4 space-y-1 list-disc list-inside text-color-gray-100">
												<li>{formatCategoryResult('Focus Records', batch.result.details.focusRecords)}</li>
												<li>{formatCategoryResult('Tasks', batch.result.details.tasks)}</li>
												<li>{formatCategoryResult('Projects', batch.result.details.projects)}</li>
												<li>{formatCategoryResult('Project Groups', batch.result.details.projectGroups)}</li>
												<li>{formatCategoryResult('User Settings', batch.result.details.userSettings)}</li>
												<li>{formatCategoryResult('Custom Images', batch.result.details.customImages)}</li>
												<li>{formatCategoryResult('Custom Image Folders', batch.result.details.customImageFolders)}</li>
											</ul>
										</div>
									)}

									{/* Error message */}
									{batch.status === 'error' && (
										<div className="mt-3 pt-3 border-t border-color-gray-600">
											<div className="text-red-500">
												{batch.errorMessage || 'Failed to import this batch'}
											</div>
										</div>
									)}
								</Accordion>
							</div>
						);
					})}
				</div>
			</div>
		</Modal>
	);
};

export default ModalImportProgress;
