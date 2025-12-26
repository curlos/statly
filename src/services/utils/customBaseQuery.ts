import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

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
	return PUBLIC_ENDPOINTS.has(pathname);
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

		// Allow if: public endpoint OR has token
		if (isPublicEndpoint(url) || token) {
			return baseQuery(args, api, extraOptions);
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
