import { loginUserSuccess } from '../../slices/userSlice';
import { baseAPI } from '../api';
import { invalidateOnSuccess } from '../utils/rtkHelpers';

export const usersApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getLoggedInUser: builder.query({
			query: () => '/users/logged-in-user',
			providesTags: ['User'],
		}),
		registerUser: builder.mutation({
			query: (userDetails) => ({
				url: '/users/register',
				method: 'POST',
				body: userDetails,
			}),
			transformResponse: (response, meta, arg) => {
				return response;
			},
			// Handle side effects or update the cache after successful registration
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
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
		loginUser: builder.mutation({
			query: (credentials) => ({
				url: '/users/login',
				method: 'POST',
				body: credentials,
			}),
			transformResponse: (response, meta, arg) => {
				return response;
			},
			onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
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
		updateUserProfile: builder.mutation({
			query: (formData) => ({
				url: '/users/update-profile',
				method: 'PUT',
				body: formData,
			}),
			invalidatesTags: invalidateOnSuccess(['User'] as const),
		}),
		updateUserPassword: builder.mutation({
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
