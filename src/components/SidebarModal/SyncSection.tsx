import { useEffect, useCallback } from 'react';
import Icon from '../Icon';
import { useGetSyncMetadataQuery, useSyncTasksMutation } from '../../services/resources/documentsTasksApi';
import { formatDistanceToNow } from 'date-fns';

interface SyncMetadata {
	lastSyncTime: string;
	tasksUpdated?: number;
}

const SyncSection = () => {
	const { data: syncMetadata, refetch } = useGetSyncMetadataQuery(undefined);
	const [syncTasks, { isLoading: isSyncing }] = useSyncTasksMutation();

	const handleSync = useCallback(async () => {
		if (isSyncing) return;

		try {
			await syncTasks(undefined).unwrap();
			refetch();
		} catch (error) {
			console.error('Sync failed:', error);
		}
	}, [isSyncing, syncTasks, refetch]);

	useEffect(() => {
		const hasAutoSynced = sessionStorage.getItem('automatic-sync-tasks');

		if (!hasAutoSynced && !isSyncing) {
			handleSync();
			sessionStorage.setItem('automatic-sync-tasks', 'true');
		}
	}, [handleSync, isSyncing]);

	const formatLastSyncTime = (lastSyncTime: string) => {
		if (!lastSyncTime) return 'Never';
		return formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true });
	};

	return (
		<div>
			<div className="flex items-center gap-2 mb-3">
				<h3 className="text-[20px] font-bold">Sync</h3>
				<Icon name="sync" fill={1} customClass={'text-color-gray-50 !text-[20px]'} />
			</div>

			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<div className="font-semibold">Tasks</div>
					{syncMetadata ? (
						<div className="text-sm text-color-gray-100">
							Last sync: {formatLastSyncTime((syncMetadata as SyncMetadata).lastSyncTime)}
						</div>
					) : (
						<div className="text-sm text-color-gray-100">No sync data available</div>
					)}
				</div>

				<button
					onClick={handleSync}
					disabled={isSyncing}
					className="flex items-center gap-2 px-3 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Icon
						name="sync"
						fill={1}
						customClass={`!text-[20px] ${isSyncing ? 'animate-spin' : ''}`}
					/>
					<span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
				</button>
			</div>
		</div>
	);
};

export default SyncSection;
