import { getFormattedDuration } from '../../utils/helpers.utils';
import { STATLY_LOGO_PATHS, STATLY_LOGO_SIZE } from '../../utils/statlyLogo';
import type { ShareBar, ShareSlice } from './forestShare';

export type ShareView = 'forest' | 'projects' | 'time';

export interface ShareCardData {
	rangeLabel: string;
	totalSeconds: number;
	treeCount: number;
	slices: ShareSlice[];
	bars: ShareBar[];
}

const WIDTH = 1080;
const FOREST_VIEW_HEIGHT = 1080;
const CHART_VIEW_HEIGHT = 1450;
const MARGIN = 65;
const FONT_FAMILY = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const BACKGROUND = '#f4f4f4';
const TEXT_MUTED = '#8e8e8e';
const TEXT_STRONG = '#5f5f5f';
const PANEL_BORDER = '#c9c9c9';
const GRID_LINE = '#dcdcdc';
const BAR_COLOR = '#7fb5a3';

const getFont = (weight: number, size: number) => `${weight} ${size}px ${FONT_FAMILY}`;

// Shortens text with "..." until it fits the width
const fitText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
	if (context.measureText(text).width <= maxWidth) return text;

	let shortened = text;
	while (shortened.length > 1 && context.measureText(`${shortened}...`).width > maxWidth)
		shortened = shortened.slice(0, -1);
	return `${shortened.trimEnd()}...`;
};

const drawRoundedRect = (
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radii: number | number[]
) => {
	context.beginPath();
	if (context.roundRect) context.roundRect(x, y, width, height, radii);
	else context.rect(x, y, width, height);
};

// A small pine tree icon next to the tree count
const drawTreeIcon = (context: CanvasRenderingContext2D, x: number, y: number, size: number) => {
	context.fillStyle = TEXT_MUTED;
	context.beginPath();
	context.moveTo(x, y - size);
	context.lineTo(x + size * 0.55, y - size * 0.25);
	context.lineTo(x - size * 0.55, y - size * 0.25);
	context.closePath();
	context.moveTo(x, y - size * 0.6);
	context.lineTo(x + size * 0.7, y + size * 0.25);
	context.lineTo(x - size * 0.7, y + size * 0.25);
	context.closePath();
	context.fill();
	context.fillRect(x - size * 0.08, y + size * 0.25, size * 0.16, size * 0.3);
};

const drawHeader = (context: CanvasRenderingContext2D, data: ShareCardData) => {
	const treeText = `${data.treeCount.toLocaleString()} ${data.treeCount === 1 ? 'tree' : 'trees'}`;
	context.textBaseline = 'alphabetic';

	context.font = getFont(600, 34);
	const treeTextWidth = context.measureText(treeText).width;
	context.textAlign = 'right';
	context.fillStyle = TEXT_MUTED;
	context.fillText(treeText, WIDTH - MARGIN, 92);
	drawTreeIcon(context, WIDTH - MARGIN - treeTextWidth - 28, 84, 20);

	// The date range shrinks until it fits beside the tree count
	const maxRangeWidth = WIDTH - MARGIN * 2 - treeTextWidth - 90;
	let rangeSize = 50;
	context.font = getFont(700, rangeSize);
	while (context.measureText(data.rangeLabel).width > maxRangeWidth && rangeSize > 26) {
		rangeSize -= 2;
		context.font = getFont(700, rangeSize);
	}
	context.textAlign = 'left';
	context.fillText(data.rangeLabel, MARGIN, 95);

	// "Total Focused Time" on one line, sharing a baseline with the big total. The total shrinks if it ever gets too wide to fit beside the label.
	const labelText = 'Total Focused Time';
	const totalText = getFormattedDuration(data.totalSeconds, false);
	const totalBaseline = 215;

	context.font = getFont(400, 30);
	const labelWidth = context.measureText(labelText).width;
	context.textAlign = 'left';
	context.fillText(labelText, MARGIN, totalBaseline);

	let totalSize = 92;
	context.font = getFont(300, totalSize);
	while (context.measureText(totalText).width > WIDTH - MARGIN * 2 - labelWidth - 40 && totalSize > 40) {
		totalSize -= 4;
		context.font = getFont(300, totalSize);
	}
	context.textAlign = 'right';
	context.fillText(totalText, WIDTH - MARGIN, totalBaseline);
};

const drawFooter = (context: CanvasRenderingContext2D, height: number) => {
	// The logo, then the name beside it, in the same gray as the rest of the card
	const logoSize = 54;
	const logoTop = height - 55 - logoSize + 8;
	context.save();
	context.translate(MARGIN, logoTop);
	context.scale(logoSize / STATLY_LOGO_SIZE, logoSize / STATLY_LOGO_SIZE);
	context.fillStyle = TEXT_MUTED;
	STATLY_LOGO_PATHS.forEach((path) => context.fill(new Path2D(path)));
	context.restore();

	context.textAlign = 'left';
	context.textBaseline = 'alphabetic';
	context.font = getFont(700, 40);
	context.fillStyle = TEXT_MUTED;
	context.fillText('Statly', MARGIN + logoSize + 16, height - 55);
};

const drawProjectChart = (context: CanvasRenderingContext2D, slices: ShareSlice[], panelTop: number) => {
	const total = slices.reduce((sum, slice) => sum + slice.seconds, 0);
	const centerX = 255;
	const centerY = panelTop + 275;
	const outerRadius = 165;
	const innerRadius = 112;

	let startAngle = -Math.PI / 2;
	slices.forEach((slice) => {
		const sweep = (slice.seconds / total) * Math.PI * 2;
		context.beginPath();
		context.arc(centerX, centerY, outerRadius, startAngle, startAngle + sweep);
		context.arc(centerX, centerY, innerRadius, startAngle + sweep, startAngle, true);
		context.closePath();
		context.fillStyle = slice.color;
		context.fill();
		context.lineWidth = 4;
		context.strokeStyle = BACKGROUND;
		context.stroke();

		if (slice.percent >= 6) {
			const middleAngle = startAngle + sweep / 2;
			const labelRadius = (outerRadius + innerRadius) / 2;
			context.fillStyle = '#ffffff';
			context.font = getFont(600, 17);
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.fillText(
				`${slice.percent}%`,
				centerX + Math.cos(middleAngle) * labelRadius,
				centerY + Math.sin(middleAngle) * labelRadius
			);
		}
		startAngle += sweep;
	});

	context.fillStyle = TEXT_MUTED;
	context.font = getFont(400, 22);
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText('Project', centerX, centerY - 14);
	context.fillText('Distribution', centerX, centerY + 14);

	// The legend's columns are sized from the text itself, so long times like "1,795h14m" never run into the percentage beside them.
	const nameLeft = 505;
	const hoursRight = 1000;
	const columnGap = 32;
	context.font = getFont(400, 26);
	const hoursTexts = slices.map((slice) => getFormattedDuration(slice.seconds, false));
	const widestHours = Math.max(...hoursTexts.map((text) => context.measureText(text).width));
	const widestPercent = Math.max(...slices.map((slice) => context.measureText(`${slice.percent}%`).width));
	const percentRight = hoursRight - widestHours - columnGap;
	const nameMaxWidth = percentRight - widestPercent - columnGap - nameLeft;

	context.textBaseline = 'alphabetic';
	slices.forEach((slice, index) => {
		const rowY = panelTop + 100 + index * 52;
		context.fillStyle = slice.color;
		context.beginPath();
		context.arc(470, rowY - 8, 13, 0, Math.PI * 2);
		context.fill();

		context.fillStyle = TEXT_STRONG;
		context.textAlign = 'left';
		context.fillText(fitText(context, slice.name, nameMaxWidth), nameLeft, rowY);

		context.fillStyle = TEXT_MUTED;
		context.textAlign = 'right';
		context.fillText(`${slice.percent}%`, percentRight, rowY);
		context.fillText(hoursTexts[index], hoursRight, rowY);
	});
};

// Rounds the top of the chart up to a number that divides into even steps, like 0, 2, 4, 6, 8.
const getAxisSteps = (maxHours: number) => {
	const roughStep = Math.max(maxHours, 0.25) / 4;
	const magnitude = 10 ** Math.floor(Math.log10(roughStep));
	const normalized = roughStep / magnitude;
	const step =
		(normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 3 ? 3 : normalized <= 5 ? 5 : 10) * magnitude;
	return { step, top: Math.max(Math.ceil(maxHours / step), 1) * step };
};

const drawTimeChart = (context: CanvasRenderingContext2D, bars: ShareBar[], panelTop: number) => {
	const plotLeft = 175;
	const plotRight = 1000;
	const plotTop = panelTop + 110;
	const plotBottom = panelTop + 430;
	const plotHeight = plotBottom - plotTop;

	context.textBaseline = 'alphabetic';
	context.fillStyle = TEXT_MUTED;
	context.font = getFont(400, 26);
	context.textAlign = 'right';
	context.fillText('Focused Time Distribution', plotRight, panelTop + 55);
	context.textAlign = 'left';
	context.fillText('hours', 100, panelTop + 55);

	const maxHours = bars.reduce((highest, bar) => Math.max(highest, bar.seconds / 3600), 0);
	const { step, top } = getAxisSteps(maxHours);

	context.font = getFont(400, 24);
	for (let value = 0; value <= top + step / 100; value += step) {
		const y = plotBottom - (value / top) * plotHeight;
		context.strokeStyle = GRID_LINE;
		context.lineWidth = 2;
		context.beginPath();
		context.moveTo(plotLeft, y);
		context.lineTo(plotRight, y);
		context.stroke();

		context.fillStyle = TEXT_MUTED;
		context.textAlign = 'right';
		context.fillText(Number.isInteger(value) ? String(value) : value.toFixed(1), plotLeft - 20, y + 8);
	}

	const slotWidth = (plotRight - plotLeft) / Math.max(bars.length, 1);
	const barWidth = Math.min(slotWidth * 0.62, 70);
	bars.forEach((bar, index) => {
		const barHeight = bar.seconds > 0 ? Math.max((bar.seconds / 3600 / top) * plotHeight, 4) : 0;
		const x = plotLeft + slotWidth * index + (slotWidth - barWidth) / 2;

		if (barHeight > 0) {
			const radius = Math.min(barWidth / 2, 12);
			context.fillStyle = BAR_COLOR;
			drawRoundedRect(context, x, plotBottom - barHeight, barWidth, barHeight, [radius, radius, 0, 0]);
			context.fill();
		}

		if (bar.label) {
			context.fillStyle = TEXT_MUTED;
			context.textAlign = 'center';
			context.fillText(bar.label, x + barWidth / 2, plotBottom + 42);
		}
	});
};

// Draws one of the three share cards onto a new canvas: just the forest, the forest with a pie chart of projects, or the forest with a bar chart of time.
export const drawShareCard = (
	view: ShareView,
	data: ShareCardData,
	renderForest: (width: number, height: number) => HTMLCanvasElement
) => {
	const hasPanel = view !== 'forest';
	const height = hasPanel ? CHART_VIEW_HEIGHT : FOREST_VIEW_HEIGHT;
	const canvas = document.createElement('canvas');
	canvas.width = WIDTH;
	canvas.height = height;

	const context = canvas.getContext('2d')!;
	context.fillStyle = BACKGROUND;
	context.fillRect(0, 0, WIDTH, height);

	drawHeader(context, data);

	if (hasPanel) {
		const panelTop = 800;
		drawRoundedRect(context, MARGIN, panelTop, WIDTH - MARGIN * 2, 540, 60);
		context.strokeStyle = PANEL_BORDER;
		context.lineWidth = 3;
		context.stroke();

		context.drawImage(renderForest(1000, 560), 40, 235);
		if (view === 'projects') drawProjectChart(context, data.slices, panelTop);
		else drawTimeChart(context, data.bars, panelTop);
	} else {
		context.drawImage(renderForest(1000, 700), 40, 275);
	}

	drawFooter(context, height);
	return canvas;
};
