/**
 * Helper function to check if all core TickTick sync metadata exist.
 * A first-time sync is needed if any of the 4 core TickTick sync types
 * are missing or haven't been synced yet.
 */
export const isFirstTimeTickTickSync = (syncMetadata: any): boolean => {
	if (!syncMetadata) return true;

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
