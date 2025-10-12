import { useCallback } from 'react';
import Icon from './Icon';
import { useGetSyncMetadataQuery, useSyncAllMutation } from '../services/resources/documentsSyncApi';
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

interface SyncMetadataByType {
	tasks?: SyncMetadata;
	projects?: SyncMetadata;
	project_groups?: SyncMetadata;
	'focus-records-ticktick'?: SyncMetadata;
}

const SyncButton = ({ showText = true, customClass = '', showTooltip = false }: SyncButtonProps) => {
	const { data: syncMetadata, refetch } = useGetSyncMetadataQuery(undefined);
	const [syncAll, { isLoading: isSyncing }] = useSyncAllMutation({
		fixedCacheKey: 'shared-sync-all',
	});

	const handleSync = useCallback(async () => {
		if (isSyncing) return;

		try {
			await syncAll(undefined).unwrap();
			refetch();
		} catch (error) {
			console.error('Sync failed:', error);
		}
	}, [isSyncing, syncAll, refetch]);

	const getTooltipContent = () => {
		if (!syncMetadata) return 'No sync data available';
		const syncMetadataByType = syncMetadata as SyncMetadataByType;

		const formatSync = (metadata?: SyncMetadata) => {
			if (!metadata?.lastSyncTime) return 'Never';
			return formatDistanceToNow(new Date(metadata.lastSyncTime), { addSuffix: true });
		};

		return (
			<div className="space-y-1">
				<div><span className="font-bold">Focus Records:</span> {formatSync(syncMetadataByType?.['focus-records-ticktick'])}</div>
				<div><span className="font-bold">Tasks:</span> {formatSync(syncMetadataByType?.tasks)}</div>
				<div><span className="font-bold">Projects:</span> {formatSync(syncMetadataByType?.projects)}</div>
				<div><span className="font-bold">Project Groups:</span> {formatSync(syncMetadataByType?.project_groups)}</div>
			</div>
		);
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
		<Tooltip content={getTooltipContent()} position="bottom">
			{buttonContent}
		</Tooltip>
	) : (
		buttonContent
	);
};

export default SyncButton;
