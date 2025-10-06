import { useEffect, useRef } from 'react';
import { useSyncAllMutation, useGetSyncMetadataQuery } from '../services/resources/documentsSyncApi';

export const useAutoSync = () => {
	const { refetch } = useGetSyncMetadataQuery(undefined);
	const [syncAll, { isLoading: isSyncing }] = useSyncAllMutation({
		fixedCacheKey: 'shared-sync-all',
	});
	const hasTriggeredSync = useRef(false);

	useEffect(() => {
		const hasAutoSynced = sessionStorage.getItem('automatic-sync-all');

		if (!hasAutoSynced && !isSyncing && !hasTriggeredSync.current) {
			hasTriggeredSync.current = true;

			const performSync = async () => {
				try {
					await syncAll(undefined).unwrap();
					refetch();
					sessionStorage.setItem('automatic-sync-all', 'true');
				} catch (error) {
					console.error('Auto sync failed:', error);
					hasTriggeredSync.current = false; // Reset on error so it can retry
				}
			};

			performSync();
		}
	}, [syncAll, isSyncing, refetch]);
};
