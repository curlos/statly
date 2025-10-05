import { useCallback } from 'react';
import Icon from './Icon';
import { useGetSyncMetadataQuery, useSyncTasksMutation } from '../services/resources/documentsTasksApi';
import { formatDistanceToNow } from 'date-fns';
import Tooltip from './Tooltip';

interface SyncButtonProps {
	showText?: boolean;
	customClass?: string;
	showTooltip?: boolean;
}

interface SyncMetadata {
	lastSyncTime: string;
	tasksUpdated?: number;
}

const SyncButton = ({ showText = true, customClass = '', showTooltip = false }: SyncButtonProps) => {
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

	const getTooltipText = () => {
		if (!syncMetadata) return 'No sync data available';
		const lastSyncTime = (syncMetadata as SyncMetadata).lastSyncTime;
		if (!lastSyncTime) return 'Never synced';
		return `Last sync: ${formatDistanceToNow(new Date(lastSyncTime), { addSuffix: true })}`;
	};

	const buttonContent = (
		<button
			onClick={handleSync}
			disabled={isSyncing}
			className={customClass || 'flex items-center gap-2 px-3 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed'}
		>
			<Icon
				name="sync"
				fill={1}
				customClass={`!text-[20px] ${isSyncing ? 'animate-spin' : ''}`}
			/>
			{showText && <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>}
		</button>
	);

	return showTooltip ? (
		<Tooltip content={getTooltipText()}>
			{buttonContent}
		</Tooltip>
	) : (
		buttonContent
	);
};

export default SyncButton;
