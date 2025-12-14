import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Icon from './Icon';
import { useGetSyncMetadataQuery } from '../services/resources/syncApi';
import { intlFormatDistance } from 'date-fns';
import Tooltip from './Tooltip';
import { setShowFirstSyncModal } from '../slices/syncSlice';
import { isFirstTimeTickTickSync } from '../utils/syncHelpers';
import { useSyncOrchestration } from '../hooks/useSyncOrchestration';
import { useSyncStatusHelpers } from '../hooks/useSyncStatusHelpers';
import { useGetUserSettingsQuery } from '../services/resources/userSettingsApi';

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
	const { data: syncMetadata, isLoading: isLoadingMetadata } = useGetSyncMetadataQuery(undefined);
	const { syncTickTickData, isSyncing } = useSyncOrchestration();
	const { getStatusIcon } = useSyncStatusHelpers();
	const { data: fetchedUserSettings } = useGetUserSettingsQuery(undefined);
	const { userSettings } = fetchedUserSettings || {};

	const handleSync = useCallback(async () => {
		if (isSyncing || isLoadingMetadata) return;

		// Check if this is the first sync by verifying all core TickTick sync metadata exist
		const needsFirstSync = isFirstTimeTickTickSync(syncMetadata);
		const hasCookie = !!userSettings?.tickTickCookie;

		// Only show first sync modal if cookie is set
		if (needsFirstSync && hasCookie) {
			dispatch(setShowFirstSyncModal(true));
		}

		await syncTickTickData();

		// Hide modal after sync completes for first-time sync
		if (needsFirstSync && hasCookie) {
			setTimeout(() => {
				dispatch(setShowFirstSyncModal(false));
			}, 2000); // Keep modal visible for 2s after completion
		}
	}, [isSyncing, isLoadingMetadata, syncTickTickData, syncMetadata, dispatch, userSettings]);

	const getTooltipContent = () => {
		if (!syncMetadata) return 'No sync data available';
		const syncMetadataByType = syncMetadata as SyncMetadataByType;

		const formatSync = (metadata?: SyncMetadata) => {
			if (!metadata?.lastSyncTime) return 'Never';
			return intlFormatDistance(new Date(metadata.lastSyncTime), new Date());
		};

		const syncItems = [
			{ label: 'Focus Records', key: 'focusRecords' as const, metadata: syncMetadataByType?.tickTickFocusRecords },
			{ label: 'Tasks', key: 'tasks' as const, metadata: syncMetadataByType?.tickTickTasks },
			{ label: 'Projects', key: 'projects' as const, metadata: syncMetadataByType?.tickTickProjects },
			{ label: 'Project Groups', key: 'projectGroups' as const, metadata: syncMetadataByType?.tickTickProjectGroups }
		];

		return (
			<div className="space-y-2 text-[14px]">
				<div className="font-bold text-[16px] mb-2">Sync TickTick Data</div>
				{syncItems.map((item) => {
					const statusIcon = getStatusIcon(item.key);
					return (
						<div key={item.key} className="flex items-center justify-between gap-3">
							<span className="font-bold">{item.label}:</span>
							<div className="flex items-center gap-2">
								<span className="text-color-gray-50">{formatSync(item.metadata)}</span>
								{statusIcon && (
									<div style={{ color: statusIcon.color }}>
										<Icon
											name={statusIcon.name}
											fill={1}
											customClass={`!text-[20px] mt-[5px] mb-[-5px] ${statusIcon.spin ? 'animate-spin' : ''}`}
										/>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	const buttonContent = (
		<button
			onClick={handleSync}
			disabled={isSyncing || !syncMetadata}
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
