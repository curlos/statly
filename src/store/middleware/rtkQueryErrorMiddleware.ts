import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { setModalState } from '../../slices/modalSlice';
import { logoutUser } from '../../slices/userSlice';

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
		if (error?.status === 'CUSTOM_ERROR') {
			return next(action);
		}

		// Handle 401 Unauthorized - token expired or invalid (backup handler)
		if (error?.status === 401) {
			// Dispatch logout action to clear Redux state
			api.dispatch(logoutUser());

			// Clear localStorage and sessionStorage
			localStorage.clear();
			sessionStorage.clear();

			// Redirect to login page
			window.location.href = '/login';

			// Don't show error modal for 401
			return next(action);
		}

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
