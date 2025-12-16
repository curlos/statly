// src/features/modals/modalSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
	isOpen: boolean;
	props: Record<string, unknown>;
}

interface ModalsState {
	modals: Record<string, ModalState>;
}

const DEFAULT_MODAL_STATE: ModalState = {
	isOpen: false,
	props: {},
};

const MODAL_IDS: string[] = [
	'ModalErrorMessenger',
	'ModalSidebar',
];

const initialState: ModalsState = {
	modals: MODAL_IDS.reduce((acc, modalId) => {
		acc[modalId] = { ...DEFAULT_MODAL_STATE };
		return acc;
	}, {} as Record<string, ModalState>),
};

interface SetModalStatePayload {
	modalId: string;
	isOpen?: boolean;
	props?: Record<string, unknown>;
}

const modalSlice = createSlice({
	name: 'modals',
	initialState,
	reducers: {
		setModalState: (state, action: PayloadAction<SetModalStatePayload>) => {
			const { modalId, isOpen, props } = action.payload;
			state.modals[modalId].isOpen = isOpen ? isOpen : DEFAULT_MODAL_STATE.isOpen;
			state.modals[modalId].props = props ? props : DEFAULT_MODAL_STATE.props;
		},
		resetModals: (state) => {
			state.modals = MODAL_IDS.reduce((acc, modalId) => {
				acc[modalId] = { ...DEFAULT_MODAL_STATE };
				return acc;
			}, {} as Record<string, ModalState>);
		},
	},
});

export const { setModalState, resetModals } = modalSlice.actions;

export default modalSlice.reducer;
