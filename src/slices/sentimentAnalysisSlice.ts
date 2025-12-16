import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';

export interface ChunkStatus {
	chunkIndex: number;
	recordCount: number;
	startRecord: number;
	endRecord: number;
	status: 'idle' | 'analyzing' | 'success' | 'error';
	errorMessage?: string;
	result?: {
		analyzed: number;
		failed: number;
	};
}

interface SentimentAnalysisState {
	chunks: ChunkStatus[];
	recordIds: string[];
	isModalOpen: boolean;
	isCancelled: boolean;
}

const initialState: SentimentAnalysisState = {
	chunks: [],
	recordIds: [],
	isModalOpen: false,
	isCancelled: false,
};

const sentimentAnalysisSlice = createSlice({
	name: 'sentimentAnalysis',
	initialState,
	reducers: {
		setChunks: (state, action: PayloadAction<{ chunks: ChunkStatus[]; recordIds: string[] }>) => {
			state.chunks = action.payload.chunks;
			state.recordIds = action.payload.recordIds;
			state.isCancelled = false;
		},
		updateChunk: (state, action: PayloadAction<{ index: number; chunk: Partial<ChunkStatus> }>) => {
			const { index, chunk } = action.payload;
			if (state.chunks[index]) {
				state.chunks[index] = { ...state.chunks[index], ...chunk };
			}
		},
		setModalOpen: (state, action: PayloadAction<boolean>) => {
			state.isModalOpen = action.payload;
		},
		cancelAnalysis: (state) => {
			state.isCancelled = true;
			// Mark only idle chunks as cancelled (let currently analyzing chunk complete)
			state.chunks = state.chunks.map((chunk) =>
				chunk.status === 'idle'
					? { ...chunk, status: 'error' as const, errorMessage: 'Cancelled by user' }
					: chunk
			);
		},
		resetAnalysis: (state) => {
			state.chunks = [];
			state.recordIds = [];
			state.isModalOpen = false;
			state.isCancelled = false;
		},
	},
});

export const { setChunks, updateChunk, setModalOpen, cancelAnalysis, resetAnalysis } = sentimentAnalysisSlice.actions;

// Selectors
export const selectSentimentChunks = (state: RootState) => state.sentimentAnalysis.chunks;
export const selectSentimentRecordIds = (state: RootState) => state.sentimentAnalysis.recordIds;
export const selectSentimentModalOpen = (state: RootState) => state.sentimentAnalysis.isModalOpen;
export const selectSentimentCancelled = (state: RootState) => state.sentimentAnalysis.isCancelled;
export const selectIsAnalyzing = (state: RootState) => {
	const chunks = state.sentimentAnalysis.chunks;
	return chunks.some((chunk) => chunk.status === 'analyzing' || chunk.status === 'idle');
};

export default sentimentAnalysisSlice.reducer;
