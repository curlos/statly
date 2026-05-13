import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store/store';

interface ToastState {
	isVisible: boolean;
	message: string;
}

const initialState: ToastState = {
	isVisible: false,
	message: '',
};

const toastSlice = createSlice({
	name: 'toast',
	initialState,
	reducers: {
		showToast: (state, action: PayloadAction<string>) => {
			state.isVisible = true;
			state.message = action.payload;
		},
		hideToast: (state) => {
			state.isVisible = false;
			state.message = '';
		},
	},
});

export const { showToast, hideToast } = toastSlice.actions;

export const selectToast = (state: RootState) => state.toast;

export default toastSlice.reducer;
