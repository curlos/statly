import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';

export interface BatchStatus {
	batchIndex: number;
	fileNames: string[];
	status: 'idle' | 'importing' | 'success' | 'error';
	errorMessage?: string;
	result?: {
		summary: {
			totalCreated: number;
			totalModified: number;
			totalMatched: number;
			totalFailed: number;
		};
		details: {
			focusRecords: { created: number; modified: number; matched: number; failed: number };
			tasks: { created: number; modified: number; matched: number; failed: number };
			projects: { created: number; modified: number; matched: number; failed: number };
			projectGroups: { created: number; modified: number; matched: number; failed: number };
		};
	};
}

interface ImportProgressState {
	batches: BatchStatus[];
	isModalOpen: boolean;
	isCancelled: boolean;
}

const initialState: ImportProgressState = {
	batches: [],
	isModalOpen: false,
	isCancelled: false,
};

const importProgressSlice = createSlice({
	name: 'importProgress',
	initialState,
	reducers: {
		setBatches: (state, action: PayloadAction<BatchStatus[]>) => {
			state.batches = action.payload;
			state.isCancelled = false;
		},
		updateBatch: (state, action: PayloadAction<{ index: number; batch: Partial<BatchStatus> }>) => {
			const { index, batch } = action.payload;
			if (state.batches[index]) {
				state.batches[index] = { ...state.batches[index], ...batch };
			}
		},
		setModalOpen: (state, action: PayloadAction<boolean>) => {
			state.isModalOpen = action.payload;
		},
		resetImport: (state) => {
			state.batches = [];
			state.isModalOpen = false;
			state.isCancelled = false;
		},
	},
});

export const { setBatches, updateBatch, setModalOpen, resetImport } = importProgressSlice.actions;

// Selectors
export const selectImportBatches = (state: RootState) => state.importProgress.batches;
export const selectImportModalOpen = (state: RootState) => state.importProgress.isModalOpen;
export const selectImportCancelled = (state: RootState) => state.importProgress.isCancelled;
export const selectIsImporting = (state: RootState) => {
	const batches = state.importProgress.batches;
	return batches.some((batch) => batch.status === 'importing' || batch.status === 'idle');
};

export default importProgressSlice.reducer;
