// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../slices/modalSlice';
import userReducer from '../slices/userSlice';
import syncReducer from '../slices/syncSlice';
import sentimentAnalysisReducer from '../slices/sentimentAnalysisSlice';
import importProgressReducer from '../slices/importProgressSlice';
import toastReducer from '../slices/toastSlice';
import { baseAPI } from '../services/api';
import { rtkQueryErrorMiddleware } from './middleware/rtkQueryErrorMiddleware';

// Create and configure the store
const store = configureStore({
	reducer: {
		modals: modalReducer,
		user: userReducer,
		sync: syncReducer,
		sentimentAnalysis: sentimentAnalysisReducer,
		importProgress: importProgressReducer,
		toast: toastReducer,
		[baseAPI.reducerPath]: baseAPI.reducer, // RTK Query reducer for users
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseAPI.middleware).concat(rtkQueryErrorMiddleware), // Add middleware for RTK Query and error handling
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
