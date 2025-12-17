/**
 * Helper to conditionally invalidate RTK Query tags only on successful mutations.
 * Prevents cache invalidation when mutations fail, avoiding unnecessary refetches.
 *
 * @param tags - Array of tag names to invalidate on success
 * @returns Function that returns tags on success, empty array on error
 *
 * @example
 * // Instead of:
 * invalidatesTags: ['User', 'UserSettings']
 *
 * // Use:
 * invalidatesTags: invalidateOnSuccess(['User', 'UserSettings'])
 */
export const invalidateOnSuccess = <T extends string>(tags: readonly T[]) => {
	return (_result: unknown, error: unknown) => {
		if (error) {
			return [] as const;  // Don't invalidate on error
		}
		return tags;
	};
};
