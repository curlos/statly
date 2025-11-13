import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Icon from './Icon';
import { useGetSyncMetadataQuery, useSyncAllMutation } from '../services/resources/documentsSyncApi';
import { formatDistanceToNow } from 'date-fns';
import Tooltip from './Tooltip';
import { setShowFirstSyncModal, setIsSyncing } from '../slices/syncSlice';
import { isFirstTimeTickTickSync } from '../utils/syncHelpers';
import { syncWithRetry } from '../utils/syncRetry';

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
	tickTickTasks?: SyncMetadata;
	tickTickProjects?: SyncMetadata;
	tickTickProjectGroups?: SyncMetadata;
	tickTickFocusRecords?: SyncMetadata;
}

const SyncButton = ({ showText = true, customClass = '', showTooltip = false }: SyncButtonProps) => {
	const dispatch = useDispatch();
	const { data: syncMetadata, isLoading: isLoadingMetadata, refetch } = useGetSyncMetadataQuery(undefined);
	const [syncAll, { isLoading: isSyncing }] = useSyncAllMutation({
		fixedCacheKey: 'shared-sync-all',
	});

	// Update Redux state when RTK Query sync state changes
	useEffect(() => {
		dispatch(setIsSyncing(isSyncing));
	}, [isSyncing, dispatch]);

	const handleSync = useCallback(async () => {
		if (isSyncing || isLoadingMetadata) return;

		// Check if this is the first sync by verifying all core TickTick sync metadata exist
		const needsFirstSync = isFirstTimeTickTickSync(syncMetadata);

		if (needsFirstSync) {
			dispatch(setShowFirstSyncModal(true));
		}

		try {
			await syncWithRetry(() => syncAll(undefined).unwrap());
			refetch();

			// Hide modal after sync completes for first-time sync
			if (needsFirstSync) {
				setTimeout(() => {
					dispatch(setShowFirstSyncModal(false));
				}, 2000); // Keep modal visible for 2s after completion
			}
		} catch (error) {
			console.error('Sync failed:', error);
			dispatch(setShowFirstSyncModal(false));
		}
	}, [isSyncing, isLoadingMetadata, syncAll, refetch, syncMetadata, dispatch]);

	const getTooltipContent = () => {
		if (!syncMetadata) return 'No sync data available';
		const syncMetadataByType = syncMetadata as SyncMetadataByType;

		const formatSync = (metadata?: SyncMetadata) => {
			if (!metadata?.lastSyncTime) return 'Never';
			return formatDistanceToNow(new Date(metadata.lastSyncTime), { addSuffix: true });
		};

		return (
			<div className="space-y-1">
				<div><span className="font-bold">Focus Records:</span> {formatSync(syncMetadataByType?.tickTickFocusRecords)}</div>
				<div><span className="font-bold">Tasks:</span> {formatSync(syncMetadataByType?.tickTickTasks)}</div>
				<div><span className="font-bold">Projects:</span> {formatSync(syncMetadataByType?.tickTickProjects)}</div>
				<div><span className="font-bold">Project Groups:</span> {formatSync(syncMetadataByType?.tickTickProjectGroups)}</div>
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
