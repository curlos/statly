import { createSlice } from '@reduxjs/toolkit';
import { isFromServer } from '../utils/helpers.utils';
import type { RootState } from '../types/redux';
import type { User } from '../types/models';

interface UserState {
	user: User | null;
	token: string | null;
	isLoggedIn: boolean | null;
}

const initialState: UserState = {
	user: null,
	token: isFromServer() ? null : localStorage.getItem('token'),
	isLoggedIn: isFromServer() ? null : (localStorage.getItem('token') ? true : false),
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		loginUserSuccess(state, action) {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isLoggedIn = true;
			localStorage.setItem('token', action.payload.token);
		},
		logoutUser(state) {
			state.user = null;
			state.token = null;
			state.isLoggedIn = false;
		},
	},
});

// Selector to access the user object
export const selectUserToken = (state: RootState) => state.user.token;
export const selectUser = (state: RootState) => state.user.user;

export const { loginUserSuccess, logoutUser } = userSlice.actions;
export default userSlice.reducer;
