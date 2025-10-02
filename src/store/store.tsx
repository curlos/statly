// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../slices/modalSlice';
import userReducer from '../slices/userSlice';
import { baseAPI } from '../services/api';

// Create and configure the store
const store = configureStore({
	reducer: {
		modals: modalReducer,
		user: userReducer,
		[baseAPI.reducerPath]: baseAPI.reducer, // RTK Query reducer for users
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware), // Add middleware for both APIs
});

export default store;
