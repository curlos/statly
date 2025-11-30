import { baseAPI } from '../services/api';
import { logoutUser } from '../slices/userSlice';
import { resetModals } from '../slices/modalSlice';
import { resetSyncStatus } from '../slices/syncSlice';
import { resetAnalysis } from '../slices/sentimentAnalysisSlice';
import { resetImport } from '../slices/importProgressSlice';

/**
 * Handles complete logout process:
 * - Clears all localStorage items
 * - Clears all sessionStorage
 * - Resets RTK Query cache
 * - Resets all Redux slices
 */
export const handleLogout = (dispatch: any) => {
	// Clear all localStorage and sessionStorage items
	localStorage.clear();
	sessionStorage.clear();

	// Reset RTK Query cache
	dispatch(baseAPI.util.resetApiState());

	// Reset all Redux slices
	dispatch(resetModals());
	dispatch(resetSyncStatus());
	dispatch(resetAnalysis());
	dispatch(resetImport());

	// Dispatch logout - the Wrapper will handle navigation and keep providers mounted during transition
	dispatch(logoutUser());
};
