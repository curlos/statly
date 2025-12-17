import { logoutUser } from '../slices/userSlice';
import { resetModals } from '../slices/modalSlice';
import { resetSyncStatus } from '../slices/syncSlice';
import { resetAnalysis } from '../slices/sentimentAnalysisSlice';
import { resetImport } from '../slices/importProgressSlice';
import type { AppDispatch } from '../types/redux';

/**
 * Handles complete logout process:
 * - Clears user state from Redux (removes token)
 * - Resets all Redux slices
 * - Clears all localStorage and sessionStorage
 * - Reloads the page to ensure complete state cleanup
 */
export const handleLogout = (dispatch: AppDispatch) => {
	// 1. Clear the user state/token from Redux
	dispatch(logoutUser());

	// 2. Reset all Redux slices
	dispatch(resetModals());
	dispatch(resetSyncStatus());
	dispatch(resetAnalysis());
	dispatch(resetImport());

	// 3. Clear all localStorage and sessionStorage items
	localStorage.clear();
	sessionStorage.clear();

	// 4. Reload the page to ensure complete cleanup of all state
	// This prevents any cached data from persisting between user sessions
	window.location.href = '/login';
};
