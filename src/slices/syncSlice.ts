import { createSlice } from '@reduxjs/toolkit';

interface SyncState {
	showFirstSyncModal: boolean;
	isSyncing: boolean;
}

const initialState: SyncState = {
	showFirstSyncModal: false,
	isSyncing: false,
};

const syncSlice = createSlice({
	name: 'sync',
	initialState,
	reducers: {
		setShowFirstSyncModal: (state, action) => {
			state.showFirstSyncModal = action.payload;
		},
		setIsSyncing: (state, action) => {
			state.isSyncing = action.payload;
		},
	},
});

export const { setShowFirstSyncModal, setIsSyncing } = syncSlice.actions;

// Selectors
export const selectShowFirstSyncModal = (state: any) => state.sync.showFirstSyncModal;
export const selectIsSyncing = (state: any) => state.sync.isSyncing;

export default syncSlice.reducer;
