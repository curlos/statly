import { createSlice } from '@reduxjs/toolkit';

type SyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface SyncState {
	showFirstSyncModal: boolean;
	syncStatus: {
		projects: SyncStatus;
		projectGroups: SyncStatus;
		tasks: SyncStatus;
		focusRecords: SyncStatus;
	};
}

const initialState: SyncState = {
	showFirstSyncModal: false,
	syncStatus: {
		projects: 'idle',
		projectGroups: 'idle',
		tasks: 'idle',
		focusRecords: 'idle',
	},
};

const syncSlice = createSlice({
	name: 'sync',
	initialState,
	reducers: {
		setShowFirstSyncModal: (state, action) => {
			state.showFirstSyncModal = action.payload;
		},
		setSyncStatus: (state, action) => {
			const { syncType, status } = action.payload;
			state.syncStatus[syncType as keyof typeof state.syncStatus] = status;
		},
		resetSyncStatus: (state) => {
			state.syncStatus = {
				projects: 'idle',
				projectGroups: 'idle',
				tasks: 'idle',
				focusRecords: 'idle',
			};
		},
	},
});

export const { setShowFirstSyncModal, setSyncStatus, resetSyncStatus } = syncSlice.actions;

// Selectors
export const selectShowFirstSyncModal = (state: any) => state.sync.showFirstSyncModal;
export const selectSyncStatus = (state: any) => state.sync.syncStatus;
export const selectIsSyncing = (state: any) => {
	const syncStatus = state.sync.syncStatus;
	return (
		syncStatus.projects === 'loading' ||
		syncStatus.projectGroups === 'loading' ||
		syncStatus.tasks === 'loading' ||
		syncStatus.focusRecords === 'loading'
	);
};

export default syncSlice.reducer;
