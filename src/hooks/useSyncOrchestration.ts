import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	useSyncTickTickProjectsMutation,
	useSyncTickTickProjectGroupsMutation,
	useSyncTickTickTasksMutation,
	useSyncTickTickFocusRecordsMutation,
} from '../services/resources/documentsSyncApi';
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
			// Phase 1: Projects + Project Groups (parallel)
			dispatch(setSyncStatus({ syncType: 'projects', status: 'loading' }));
			dispatch(setSyncStatus({ syncType: 'projectGroups', status: 'loading' }));

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
			]);

			// Phase 2: Tasks (sequential - must complete)
			dispatch(setSyncStatus({ syncType: 'tasks', status: 'loading' }));
			await syncWithRetry(() => syncTasks(undefined).unwrap());
			dispatch(setSyncStatus({ syncType: 'tasks', status: 'success' }));

			// Phase 3: Focus Records (sequential - depends on tasks)
			dispatch(setSyncStatus({ syncType: 'focusRecords', status: 'loading' }));
			await syncWithRetry(() => syncFocusRecords(undefined).unwrap());
			dispatch(setSyncStatus({ syncType: 'focusRecords', status: 'success' }));
		} catch (error) {
			console.error('Sync failed:', error);
			throw error;
		}
	}, [dispatch, syncProjects, syncProjectGroups, syncTasks, syncFocusRecords]);

	return { syncTickTickData, isSyncing };
};
