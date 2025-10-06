import { useEffect, useRef } from 'react';
import { useSyncTasksMutation, useGetSyncMetadataQuery } from '../services/resources/documentsSyncApi';

export const useAutoSync = () => {
	const { refetch } = useGetSyncMetadataQuery(undefined);
	const [syncTasks, { isLoading: isSyncing }] = useSyncTasksMutation({
		fixedCacheKey: 'shared-sync-tasks',
	});
	const hasTriggeredSync = useRef(false);

	useEffect(() => {
		const hasAutoSynced = sessionStorage.getItem('automatic-sync-tasks');

		if (!hasAutoSynced && !isSyncing && !hasTriggeredSync.current) {
			hasTriggeredSync.current = true;

			const performSync = async () => {
				try {
					await syncTasks(undefined).unwrap();
					refetch();
					sessionStorage.setItem('automatic-sync-tasks', 'true');
				} catch (error) {
					console.error('Auto sync failed:', error);
					hasTriggeredSync.current = false; // Reset on error so it can retry
				}
			};

			performSync();
		}
	}, [syncTasks, isSyncing, refetch]);
};
