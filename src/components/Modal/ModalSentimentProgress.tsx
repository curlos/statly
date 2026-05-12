import { useThemeContext } from '../../contexts/useThemeContext';
import Modal from './Modal';
import Icon from '../Icon';
import Spinner from '../Loaders/Spinner';
import Accordion from '../Accordion/Accordion';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	selectSentimentChunks,
	selectSentimentModalOpen,
	selectIsAnalyzing,
	setModalOpen,
	cancelAnalysis,
} from '../../slices/sentimentAnalysisSlice';

export interface ChunkStatus {
	chunkIndex: number;
	recordCount: number;
	startRecord: number; // e.g., 1, 251, 501
	endRecord: number;   // e.g., 250, 500, 750
	status: 'idle' | 'analyzing' | 'success' | 'error';
	errorMessage?: string;
	result?: {
		analyzed: number;
		failed: number;
	};
}

const ModalSentimentProgress: React.FC = () => {
	const dispatch = useDispatch();
	const chunks = useSelector(selectSentimentChunks);
	const isOpen = useSelector(selectSentimentModalOpen);
	const isAnalyzing = useSelector(selectIsAnalyzing);
	const { chosenColorObj } = useThemeContext();
	const chunkRefs = useRef<(HTMLDivElement | null)[]>([]);

	// Calculate total records processed
	const totalRecords = chunks.reduce((sum, chunk) => sum + chunk.recordCount, 0);
	const processedRecords = chunks
		.filter((chunk) => chunk.status === 'success' || (chunk.status === 'error' && chunk.errorMessage !== 'Cancelled by user'))
		.reduce((sum, chunk) => sum + chunk.recordCount, 0);

	// Auto-scroll to the chunk that is currently being analyzed
	useEffect(() => {
		const analyzingChunkIndex = chunks.findIndex((chunk) => chunk.status === 'analyzing');

		if (analyzingChunkIndex !== -1 && chunkRefs.current[analyzingChunkIndex]) {
			chunkRefs.current[analyzingChunkIndex]?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [chunks]);

	const handleClose = () => {
		dispatch(setModalOpen(false));
	};

	const handleCancel = () => {
		if (
			confirm(
				'Are you sure you want to cancel?\n\nThe currently running batch cannot be stopped and will complete. Only remaining batches will be cancelled.'
			)
		) {
			dispatch(cancelAnalysis());
		}
	};

	const getChunkStatusDisplay = (status: string) => {
		switch (status) {
			case 'idle':
				return { icon: 'schedule', color: '#9ca3af', showSpinner: false, label: 'Idle' };
			case 'analyzing':
				return { icon: 'favorite', color: chosenColorObj.hexColor, showSpinner: true, label: 'Analyzing' };
			case 'success':
				return { icon: 'check_circle', color: '#4ade80', showSpinner: false, label: 'Complete' };
			case 'error':
				return { icon: 'error', color: '#ef4444', showSpinner: false, label: 'Error' };
			default:
				return { icon: 'schedule', color: '#9ca3af', showSpinner: false, label: 'Idle' };
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} customClasses="!w-[700px]" ariaLabelledBy="sentiment-modal-title">
			<div className="bg-color-gray-650 rounded-lg p-6 shadow-xl relative">
				{/* Close button */}
				<button
					onClick={handleClose}
					aria-label="Close"
					className="absolute top-4 right-4 text-color-gray-50 hover:text-white transition-colors"
				>
					<Icon name="close" fill={1} customClass="!text-[24px]" />
				</button>

				{/* Title */}
				<h3 id="sentiment-modal-title" className="text-xl font-bold mb-2 text-white">Analyze Focus Record Note Emotions</h3>

				{/* Description */}
				<p className="text-color-gray-50 mt-0 mb-4">
					This process uses AI to accurately analyze the emotions in each focus record's note. Please be patient as this may take a few minutes.
				</p>

				{/* Progress counter */}
				<div aria-live="polite" className="text-color-gray-50 mb-4 flex items-center gap-2">
					<span>
						{processedRecords.toLocaleString()}/{totalRecords.toLocaleString()} focus records updated
					</span>
					{isAnalyzing ? (
						<Spinner size="sm" />
					) : (
						<Icon name="check_circle" fill={1} customClass="!text-[20px] mt-[-3px] text-emerald-500" />
					)}
				</div>

				{/* Cancel button - show only while analyzing */}
				{isAnalyzing && (
					<div className="mb-4">
						<button
							onClick={handleCancel}
							className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold transition-colors"
						>
							Cancel Remaining Analysis
						</button>
					</div>
				)}

				{/* Chunk list with scrollbar */}
				<div className="space-y-4 max-h-[500px] overflow-auto pr-2">
					{chunks.map((chunk, index) => {
						const statusDisplay = getChunkStatusDisplay(chunk.status);

						return (
							<div
								key={chunk.chunkIndex}
								ref={(el) => (chunkRefs.current[index] = el)}
								className="bg-color-gray-700 rounded-lg p-3"
							>
								<Accordion
									title={
										<div className="w-full pr-2 flex items-center justify-between">
											<div>
												<h4 className="font-bold text-[18px]" style={{ color: statusDisplay.color }}>
													Records {chunk.startRecord.toLocaleString()} to {chunk.endRecord.toLocaleString()}
												</h4>
												{/* Summary results - only show after chunk completes */}
												{chunk.result && chunk.status === 'success' && (
													<div className="text-color-gray-50 mt-1">
														{chunk.result.analyzed.toLocaleString()} focus records updated
														{chunk.result.failed > 0 &&
															`, ${chunk.result.failed.toLocaleString()} failed`}
													</div>
												)}
												{chunk.status === 'error' && (
													<div className="text-red-500 mt-1">
														{chunk.errorMessage || 'Failed to update emotions'}
													</div>
												)}
											</div>
											<div aria-live="polite" className="flex items-center gap-2">
												<span className="sr-only">{statusDisplay.label}</span>
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
									{/* Record count */}
									<div className="mb-3 mt-2">
										<div className="text-color-gray-50 mb-1">
											<span className="font-bold">Total Focus Records:</span> {chunk.recordCount.toLocaleString()}
										</div>
									</div>

									{/* Results - only show after chunk completes */}
									{chunk.result && chunk.status === 'success' && (
										<div className="mt-3 pt-3 border-t border-color-gray-600">
											<div className="text-color-gray-50 mb-2 font-bold">Results:</div>
											<ul className="pl-2 space-y-1 text-color-gray-50 list-disc list-inside">
												<li>
													<span className="font-semibold">Updated:</span>{' '}
													{chunk.result.analyzed.toLocaleString()} focus records
												</li>
												<li>
													<span className="font-semibold">Failed:</span>{' '}
													{chunk.result.failed.toLocaleString()} focus records
												</li>
											</ul>
										</div>
									)}

									{/* Error message */}
									{chunk.status === 'error' && (
										<div className="mt-3 pt-3 border-t border-color-gray-600">
											<div className="text-red-500">
												{chunk.errorMessage || 'Failed to update emotions for these records'}
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

export default ModalSentimentProgress;
