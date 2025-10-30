/**
 * Calculates the padding angle for a pie chart based on the number of data slices.
 * Reduces padding when there are many slices to prevent excessive gaps.
 */
export function getPieChartPaddingAngle(dataLength: number): number {
	// Reduce padding when there are many slices to prevent excessive gaps
	if (dataLength > 700) {
		return 0.01;
	} else if (dataLength > 300) {
		return 0.2;
	} else if (dataLength > 100) {
		return 0.25;
	} else if (dataLength > 25) {
		return 0.5;
	} else if (dataLength > 10) {
		return 1;
	}

	return 2;
}
