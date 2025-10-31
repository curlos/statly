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
