import Icon from '../Icon';
import { useLazyGetFocusRecordsNeedingSentimentQuery, useAnalyzeNoteEmotionsMutation, focusRecordsApi } from '../../services/resources/focusRecordsApi';
import { useEffect, useRef } from 'react';
import ModalSentimentProgress from '../Modal/ModalSentimentProgress';
import { ChunkStatus } from '../../slices/sentimentAnalysisSlice';
import Tooltip from '../Tooltip';
import Spinner from '../Loaders/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import {
	selectSentimentChunks,
	selectIsAnalyzing,
	selectSentimentCancelled,
	setChunks,
	updateChunk,
	setModalOpen,
	resetAnalysis,
} from '../../slices/sentimentAnalysisSlice';

const CHUNK_SIZE = 50;

const AnalyzeNoteEmotions = () => {
	const dispatch = useDispatch();
	const chunks = useSelector(selectSentimentChunks);
	const isAnalyzingRedux = useSelector(selectIsAnalyzing);
	const isCancelled = useSelector(selectSentimentCancelled);

	// Use ref to store cancellation flag so checks always read current value
	const isCancelledRef = useRef(false);

	const [getFocusRecordsNeedingSentiment, { isLoading: isFetchingIds }] = useLazyGetFocusRecordsNeedingSentimentQuery();
	const [analyzeNoteEmotions] = useAnalyzeNoteEmotionsMutation();

	// Sync ref with Redux state
	useEffect(() => {
		isCancelledRef.current = isCancelled;
	}, [isCancelled]);

	const handleAnalyzeSentiment = async () => {
		// If already analyzing, just show the modal
		if (isAnalyzingRedux && chunks.length > 0) {
			dispatch(setModalOpen(true));
			return;
		}

		// Reset previous analysis state before starting new analysis
		dispatch(resetAnalysis());

		try {
			// Fetch all record IDs that need sentiment analysis
			const result = await getFocusRecordsNeedingSentiment();
			const data = result.data;

			if (!data || data.recordIds.length === 0) {
				alert('All focus records already have emotions');
				return;
			}

			const recordIds = data.recordIds;

			// Chunk the record IDs into batches of CHUNK_SIZE
			const chunkedIds: string[][] = [];
			for (let i = 0; i < recordIds.length; i += CHUNK_SIZE) {
				chunkedIds.push(recordIds.slice(i, i + CHUNK_SIZE));
			}

			// Initialize chunk status array
			const initialChunks: ChunkStatus[] = chunkedIds.map((chunk, index) => ({
				chunkIndex: index,
				recordCount: chunk.length,
				startRecord: index * CHUNK_SIZE + 1,
				endRecord: Math.min((index + 1) * CHUNK_SIZE, recordIds.length),
				status: 'idle',
			}));

			dispatch(setChunks({ chunks: initialChunks, recordIds: recordIds }));
			dispatch(setModalOpen(true));

			// Process chunks sequentially
			for (let i = 0; i < initialChunks.length; i++) {
				// Check if cancelled before starting this chunk
				if (isCancelledRef.current) {
					break;
				}

				// Update status to 'analyzing'
				dispatch(updateChunk({ index: i, chunk: { status: 'analyzing' } }));

				try {
					// Get the record IDs for this chunk from stored recordIds
					const chunkIds = recordIds.slice(initialChunks[i].startRecord - 1, initialChunks[i].endRecord);
					const analysisResult = await analyzeNoteEmotions(chunkIds).unwrap() as { analyzed: number; failed: number };

					// Update status to 'success' with result
					dispatch(
						updateChunk({
							index: i,
							chunk: {
								status: 'success',
								result: {
									analyzed: analysisResult.analyzed,
									failed: analysisResult.failed,
								},
							},
						})
					);
				} catch (error: unknown) {
					const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Failed to update emotions for these records';

					// Update status to 'error'
					dispatch(
						updateChunk({
							index: i,
							chunk: {
								status: 'error',
								errorMessage,
							},
						})
					);
				}
			}

			// Manually invalidate tags after all chunks complete (or after last chunk if cancelled)
			dispatch(focusRecordsApi.util.invalidateTags(['FocusRecord', 'ExportFocusRecord', 'AllFocusRecords', 'FocusMedal', 'FocusChallenge', 'FocusStats']));
		} catch (error) {
			console.error('Error updating focus record emotions:', error);
		}
	};

	const isLoading = isFetchingIds || isAnalyzingRedux;

	return (
		<>
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2">
					<button
						onClick={handleAnalyzeSentiment}
						disabled={isLoading}
						className="flex items-center gap-2 px-3 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed justify-center"
					>
						{isLoading ? (
							<Spinner size="sm" />
						) : (
							<Icon
								name="favorite"
								fill={1}
								customClass="!text-[20px]"
							/>
						)}
						<span>{isLoading ? 'Analyzing Note Emotions...' : 'Analyze Note Emotions'}</span>
					</button>
					<Tooltip
						content="AI analyzes the notes you've written for each focus session and automatically detects the emotions expressed. This helps you understand your emotional patterns while working."
						position="bottom"
						className="!w-[200px]"
					>
						<div className="mt-4">
							<Icon
								name="help_outline"
								fill={0}
								customClass="!text-[20px] text-color-gray-100 hover:text-white cursor-help"
							/>
						</div>
					</Tooltip>
				</div>

				{/* View Progress button - only show while analyzing */}
				{isAnalyzingRedux && (
					<div>
						<button
							onClick={() => dispatch(setModalOpen(true))}
							className="flex items-center gap-2 px-3 py-2 bg-color-gray-600 hover:bg-color-gray-500 rounded-full text-white font-semibold justify-center"
						>
							<Icon name="visibility" fill={0} customClass="!text-[20px]" />
							<span>View Progress</span>
						</button>
					</div>
				)}
			</div>

			<ModalSentimentProgress />
		</>
	);
};

export default AnalyzeNoteEmotions;
