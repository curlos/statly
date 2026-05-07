import { loginUserSuccess } from '../../slices/userSlice';
import { baseAPI } from '../api';
import { invalidateOnSuccess } from '../utils/rtkHelpers';
import type { User } from '../../types/models';
import type { AuthResponse } from '../../types/api';

export const usersApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getLoggedInUser: builder.query<User, void>({
			query: () => '/users/logged-in-user',
			providesTags: ['User'],
		}),
		registerUser: builder.mutation<AuthResponse, { email: string; password: string; name?: string; colorMode?: string }>({
			query: (userDetails) => ({
				url: '/users/register',
				method: 'POST',
				body: userDetails,
			}),
			transformResponse: (response: AuthResponse) => {
				return response;
			},
			// Handle side effects or update the cache after successful registration
			onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled;
					// Update user slice state on successful registration
					dispatch(loginUserSuccess(data));
				} catch (error) {
					console.error('Registration failed:', error);
				}
			},
			invalidatesTags: invalidateOnSuccess(['User'] as const),
		}),
		loginUser: builder.mutation<AuthResponse, { email: string; password: string }>({
			query: (credentials) => ({
				url: '/users/login',
				method: 'POST',
				body: credentials,
			}),
			transformResponse: (response: AuthResponse) => {
				return response;
			},
			onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled;
					// Update user slice state on successful login
					dispatch(loginUserSuccess(data));
				} catch (error) {
					console.error('Login failed:', error);
				}
			},
			invalidatesTags: invalidateOnSuccess(['User'] as const),
		}),
		updateUserProfile: builder.mutation<User, FormData>({
			query: (formData) => ({
				url: '/users/update-profile',
				method: 'PUT',
				body: formData,
			}),
			invalidatesTags: invalidateOnSuccess(['User'] as const),
		}),
		updateUserPassword: builder.mutation<unknown, { currentPassword: string; newPassword: string }>({
			query: (credentials) => ({
				url: '/users/update-password',
				method: 'PUT',
				body: credentials,
			}),
		}),
	}),
});

export const {
	useGetLoggedInUserQuery,
	useRegisterUserMutation,
	useLoginUserMutation,
	useUpdateUserProfileMutation,
	useUpdateUserPasswordMutation,
} = usersApi;
