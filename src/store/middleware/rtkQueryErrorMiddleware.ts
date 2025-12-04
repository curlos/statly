import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { setModalState } from '../../slices/modalSlice';

export const rtkQueryErrorMiddleware: Middleware = (api) => (next) => (action) => {
	// Check if the action is a rejected RTK Query action
	if (isRejectedWithValue(action)) {
		const error = action.payload;

		// Extract endpoint name from action metadata
		const endpointName = action.meta?.arg?.endpointName || 'Unknown endpoint';

		const errorDetails = {
			status: error?.status,
			data: error?.data,
			message: error?.data?.message || error?.error || 'An error occurred',
			endpoint: endpointName,
		};

		console.log(`[RTK Query Error] Endpoint: ${endpointName}`, errorDetails);

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
