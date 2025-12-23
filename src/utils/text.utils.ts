/**
 * Checks if text should use break-all CSS property based on longest word length.
 * This is useful for handling text with URLs or other long unbreakable strings
 * that could break UI layouts.
 *
 * @param text - The text to analyze
 * @param maxWordLength - Maximum word length threshold (default: 26 characters)
 * @returns true if the longest word exceeds the threshold
 */
export const shouldBreakAllText = (text: string | undefined | null, maxWordLength = 26): boolean => {
	if (!text) return false;

	const longestWord = text.split(/\s+/).reduce((longest, word) =>
		word.length > longest.length ? word : longest, ''
	);

	return longestWord.length > maxWordLength;
};

/**
 * Truncates text to a specified length and adds ellipsis if truncated.
 *
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation (default: 15)
 * @returns The truncated text with '...' appended if it was truncated
 */
export const truncateText = (text: string, maxLength = 15): string => {
	if (!text || text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
};
