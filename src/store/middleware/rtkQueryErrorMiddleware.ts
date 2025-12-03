import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { setModalState } from '../../slices/modalSlice';

export const rtkQueryErrorMiddleware: Middleware = (api) => (next) => (action) => {
	// Check if the action is a rejected RTK Query action
	if (isRejectedWithValue(action)) {
		const error = action.payload;

		const errorDetails = {
			status: error?.status,
			data: error?.data,
			message: error?.data?.message || error?.error || 'An error occurred',
		};

		// Dispatch modal state to show error
		api.dispatch(
			setModalState({
				modalId: 'ModalErrorMessenger',
				isOpen: true,
				props: { error: errorDetails },
			})
		);
	}

	return next(action);
};
