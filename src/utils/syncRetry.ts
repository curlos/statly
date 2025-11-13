/**
 * Executes a sync operation with automatic retry on 409 Conflict errors
 * Uses exponential backoff: 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s
 *
 * @param syncOperation - The async function that performs the sync
 * @param maxRetries - Maximum number of retry attempts (default: 8)
 * @returns The result of the sync operation
 */
export async function syncWithRetry<T>(
	syncOperation: () => Promise<T>,
	maxRetries: number = 8
): Promise<T> {
	let attempt = 0;

	while (attempt <= maxRetries) {
		try {
			const result = await syncOperation();
			return result;
		} catch (error: any) {
			// Check if it's a 409 Conflict (sync already in progress)
			if (error?.status === 409 && attempt < maxRetries) {
				attempt++;
				// Exponential backoff: 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s
				const delayMs = Math.min(Math.pow(2, attempt) * 1000, 256000);
				console.log(`Sync in progress, retrying in ${delayMs / 1000}s (attempt ${attempt}/${maxRetries})...`);
				await new Promise(resolve => setTimeout(resolve, delayMs));
			} else {
				// Not a 409 or max retries reached
				throw error;
			}
		}
	}

	// This should never be reached, but TypeScript needs it
	throw new Error('Max retries exceeded');
}
