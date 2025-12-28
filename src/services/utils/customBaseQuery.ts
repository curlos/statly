import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logoutUser } from '../../slices/userSlice';

interface RootState {
	user: {
		token?: string | null;
		isLoggedIn?: boolean | null;
	};
}

interface ViteImportMeta {
	readonly env: {
		readonly VITE_SERVER_URL: string;
	};
}

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = new Set([
	'/users/register',
	'/users/login',
]);

const isPublicEndpoint = (url: string): boolean => {
	// Extract pathname (remove query params if present)
	const pathname = url.split('?')[0];
	// Normalize by ensuring leading slash
	const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
	return PUBLIC_ENDPOINTS.has(normalizedPath);
};

export const createAuthenticatedBaseQuery = (): BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> => {
	// Create the base query instance
	const baseQuery = fetchBaseQuery({
		baseUrl: (import.meta as unknown as ViteImportMeta).env.VITE_SERVER_URL,
		prepareHeaders: (headers, { getState }) => {
			const state = getState() as RootState;
			const token = state.user.token;
			if (token) {
				headers.set('authorization', `Bearer ${token}`);
			}
			return headers;
		},
	});

	// Return wrapper that checks authentication
	return async (args, api, extraOptions) => {
		const state = api.getState() as RootState;
		const token = state.user.token;

		// Extract URL from args
		const url = typeof args === 'string' ? args : args.url;

		if (isPublicEndpoint(url)) {
			return await baseQuery(args, api, extraOptions);
		}

		// Allow if: public endpoint OR has token
		if (token) {
			const result = await baseQuery(args, api, extraOptions);

			// Check for 401 Unauthorized response (expired/invalid token)
			if (result.error && result.error.status === 401) {
				const errorData = result.error.data as { message?: string } | undefined;
				const signedOutOfTickTickAccount = errorData?.message === "user_not_sign_on"

				if (!signedOutOfTickTickAccount) {
					// Dispatch logout action to clear Redux state
					api.dispatch(logoutUser());

					// Clear localStorage and sessionStorage
					localStorage.clear();
					sessionStorage.clear();

					// Redirect to login page
					window.location.href = '/login';

					// Return custom error to prevent error modal from showing
					return {
						error: {
							status: 'CUSTOM_ERROR',
							error: 'Session expired',
							data: {
								message: 'Your session has expired. Please log in again.',
							},
						} as FetchBaseQueryError,
					};	
				}
			}

			return result;
		}

		// Return custom error for unauthenticated requests to protected endpoints
		return {
			error: {
				status: 'CUSTOM_ERROR',
				error: 'Authentication required',
				data: {
					message: 'User is not logged in. Request skipped.',
				},
			} as FetchBaseQueryError,
		};
	};
};
