import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { setModalState } from '../../slices/modalSlice';

interface RTKQueryError {
	status?: number | string;
	data?: {
		message?: string;
		[key: string]: unknown;
	};
	error?: string;
}

interface RTKQueryActionMeta {
	arg?: {
		endpointName?: string;
		[key: string]: unknown;
	};
	[key: string]: unknown;
}

export const rtkQueryErrorMiddleware: Middleware = (api) => (next) => (action) => {
	// Check if the action is a rejected RTK Query action
	if (isRejectedWithValue(action)) {
		const error = action.payload as RTKQueryError;
		const meta = action.meta as RTKQueryActionMeta;

		// Skip modal for authentication errors (expected behavior when user is not logged in)
		// These are handled by customBaseQuery
		if (error?.status === 'CUSTOM_ERROR') {
			return next(action);
		}

		// Get endpoint name for error logging (with fallback)
		const endpointNameForLogging = meta?.arg?.endpointName || 'Unknown endpoint';

		const errorDetails = {
			status: error?.status,
			data: error?.data,
			message: error?.data?.message || error?.error || 'An error occurred',
			endpoint: endpointNameForLogging,
		};

		console.log(`[RTK Query Error] Endpoint: ${endpointNameForLogging}`, errorDetails);

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
