import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	useSyncTickTickProjectsMutation,
	useSyncTickTickProjectGroupsMutation,
	useSyncTickTickTasksMutation,
	useSyncTickTickFocusRecordsMutation,
} from '../services/resources/syncApi';
import { setSyncStatus, resetSyncStatus, selectIsSyncing } from '../slices/syncSlice';
import { syncWithRetry } from '../utils/syncRetry';

export const useSyncOrchestration = () => {
	const dispatch = useDispatch();
	const isSyncing = useSelector(selectIsSyncing);
	const [syncProjects] = useSyncTickTickProjectsMutation();
	const [syncProjectGroups] = useSyncTickTickProjectGroupsMutation();
	const [syncTasks] = useSyncTickTickTasksMutation();
	const [syncFocusRecords] = useSyncTickTickFocusRecordsMutation();

	const syncTickTickData = useCallback(async () => {
		// Reset all sync statuses to idle
		dispatch(resetSyncStatus());

		try {
			// Phase 1: Projects + Project Groups + Focus Records (parallel)
			dispatch(setSyncStatus({ syncType: 'projects', status: 'loading' }));
			dispatch(setSyncStatus({ syncType: 'projectGroups', status: 'loading' }));
			dispatch(setSyncStatus({ syncType: 'focusRecords', status: 'loading' }));

			await Promise.all([
				syncWithRetry(() => syncProjects(undefined).unwrap())
					.then(() => {
						dispatch(setSyncStatus({ syncType: 'projects', status: 'success' }));
					})
					.catch((error) => {
						dispatch(setSyncStatus({ syncType: 'projects', status: 'error' }));
						throw error;
					}),
				syncWithRetry(() => syncProjectGroups(undefined).unwrap())
					.then(() => {
						dispatch(setSyncStatus({ syncType: 'projectGroups', status: 'success' }));
					})
					.catch((error) => {
						dispatch(setSyncStatus({ syncType: 'projectGroups', status: 'error' }));
						throw error;
					}),
				syncWithRetry(() => syncFocusRecords(undefined).unwrap())
					.then(() => {
						dispatch(setSyncStatus({ syncType: 'focusRecords', status: 'success' }));
					})
					.catch((error) => {
						dispatch(setSyncStatus({ syncType: 'focusRecords', status: 'error' }));
						throw error;
					}),
			]);

			// Phase 2: Tasks (sequential - updates focus records after completion)
			dispatch(setSyncStatus({ syncType: 'tasks', status: 'loading' }));
			await syncWithRetry(() => syncTasks(undefined).unwrap());
			dispatch(setSyncStatus({ syncType: 'tasks', status: 'success' }));
		} catch (error) {
			console.error('Sync failed:', error);
			throw error;
		}
	}, [dispatch, syncProjects, syncProjectGroups, syncTasks, syncFocusRecords]);

	return { syncTickTickData, isSyncing };
};
