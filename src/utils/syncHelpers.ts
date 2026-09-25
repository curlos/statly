interface SyncMetadataItem {
	_id: string;
	userId: string;
	syncType: string;
	lastSyncTime: string;
	__v: number;
	tasksUpdated?: number;
}

export interface SyncMetadata {
	[key: string]: SyncMetadataItem;
}

/**
 * Helper function to check if all core TickTick sync metadata exist.
 * A first-time sync is needed if any of the 4 core TickTick sync types
 * are missing or haven't been synced yet.
 */
export const isFirstTimeTickTickSync = (syncMetadata: SyncMetadata | undefined): boolean => {
	// No metadata means the fetch failed or hasn't loaded (a real first-time user gets `{}`), so don't assume first sync.
	if (!syncMetadata) return false;

	const requiredSyncTypes = [
		'tickTickTasks',
		'tickTickProjects',
		'tickTickProjectGroups',
		'tickTickFocusRecords'
	];

	// Check if all required sync types exist and have a lastSyncTime
	return !requiredSyncTypes.every(syncType =>
		syncMetadata[syncType] && syncMetadata[syncType].lastSyncTime
	);
};
