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

// Public endpoints that shouldn't trigger logout on 401
const PUBLIC_ENDPOINT_NAMES = new Set(['loginUser', 'registerUser']);

export const rtkQueryErrorMiddleware: Middleware = (api) => (next) => (action) => {
	// Check if the action is a rejected RTK Query action
	if (isRejectedWithValue(action)) {
		const error = action.payload as RTKQueryError;
		const meta = action.meta as RTKQueryActionMeta;

		// Skip modal for authentication errors (expected behavior when user is not logged in)
		if (error?.status === 'CUSTOM_ERROR') {
			return next(action);
		}

		// Extract endpoint name to check if it's a public endpoint
		const endpointName = meta?.arg?.endpointName;

		// Handle 401 Unauthorized - token expired or invalid (backup handler)
		// Only trigger logout/redirect for protected endpoints, not public ones like login
		if (error?.status === 401 && endpointName && !PUBLIC_ENDPOINT_NAMES.has(endpointName)) {
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

		// Get endpoint name for error logging (with fallback)
		const endpointNameForLogging = endpointName || 'Unknown endpoint';

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
