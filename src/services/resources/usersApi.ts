import { loginUserSuccess } from '../../slices/userSlice';
import { baseAPI } from '../api';

export const usersApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getLoggedInUser: builder.query({
			query: () => '/users/logged-in',
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
					dispatch(loginUserSuccess(data)); // Update user slice state on successful login
				} catch (error) {
					console.error('Registration failed:', error);
				}
			},
			invalidatesTags: ['User'],
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
					dispatch(loginUserSuccess(data)); // Update user slice state on successful login
				} catch (error) {
					console.error('Login failed:', error);
				}
			},
			invalidatesTags: (result, error) => (error ? [] : ['Task', 'Project', 'FocusRecord']),
		}),
	}),
});

export const { useGetLoggedInUserQuery, useRegisterUserMutation, useLoginUserMutation } = usersApi;
