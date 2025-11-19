// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import modalReducer from '../slices/modalSlice';
import userReducer from '../slices/userSlice';
import syncReducer from '../slices/syncSlice';
import sentimentAnalysisReducer from '../slices/sentimentAnalysisSlice';
import importProgressReducer from '../slices/importProgressSlice';
import { baseAPI } from '../services/api';

// Create and configure the store
const store = configureStore({
	reducer: {
		modals: modalReducer,
		user: userReducer,
		sync: syncReducer,
		sentimentAnalysis: sentimentAnalysisReducer,
		importProgress: importProgressReducer,
		[baseAPI.reducerPath]: baseAPI.reducer, // RTK Query reducer for users
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware), // Add middleware for both APIs
});

export default store;
