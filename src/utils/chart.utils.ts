/**
 * Calculate stroke width based on data length for better chart visibility
 * @param dataLength - Number of data points in the chart
 * @returns Stroke width value
 */
export const getStrokeWidthByDataLength = (dataLength: number): number => {
	if (dataLength <= 50) return 3;
	if (dataLength <= 150) return 2;
	if (dataLength <= 400) return 1.5;
	if (dataLength <= 700) return 1;
	return 0.5;
};
