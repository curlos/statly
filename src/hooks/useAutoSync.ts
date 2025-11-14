import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useGetSyncMetadataQuery } from '../services/resources/documentsSyncApi';
import { setShowFirstSyncModal } from '../slices/syncSlice';
import { isFirstTimeTickTickSync } from '../utils/syncHelpers';
import { useSyncOrchestration } from './useSyncOrchestration';

export const useAutoSync = () => {
	const dispatch = useDispatch();
	const { data: syncMetadata, isLoading: isLoadingMetadata } = useGetSyncMetadataQuery(undefined);
	const { syncTickTickData, isSyncing } = useSyncOrchestration();
	const hasTriggeredSync = useRef(false);

	useEffect(() => {
		const hasAutoSynced = sessionStorage.getItem('automatic-sync-all');

		// Only proceed if we've finished loading the sync metadata
		if (!hasAutoSynced && !isSyncing && !hasTriggeredSync.current && !isLoadingMetadata) {
			// Check if this is the first sync by checking if all core TickTick sync metadata exist
			const needsFirstSync = isFirstTimeTickTickSync(syncMetadata);

			if (needsFirstSync) {
				dispatch(setShowFirstSyncModal(true));
			}

			hasTriggeredSync.current = true;

			const performSync = async () => {
				try {
					await syncTickTickData();
					sessionStorage.setItem('automatic-sync-all', 'true');

					// Hide modal after sync completes
					if (needsFirstSync) {
						setTimeout(() => {
							dispatch(setShowFirstSyncModal(false));
						}, 2000); // Keep modal visible for 2s after completion
					}
				} catch (error) {
					console.error('Auto sync failed:', error);
					hasTriggeredSync.current = false; // Reset on error so it can retry
					dispatch(setShowFirstSyncModal(false));
				}
			};

			performSync();
		}
	}, [syncTickTickData, isSyncing, syncMetadata, dispatch, isLoadingMetadata]);
};
