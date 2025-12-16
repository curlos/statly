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

		// Extract endpoint name from action metadata
		const endpointName = meta?.arg?.endpointName || 'Unknown endpoint';

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
