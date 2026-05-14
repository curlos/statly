import { useState, useEffect, useMemo, useRef } from 'react';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import {
	convertTo12HourFormat,
	getFormattedLongDay,
	getDailyHourBlocks,
} from '../../../../utils/date.utils';
import { getFormattedDuration } from '../../../../utils/helpers.utils';
import ReactApexChart from 'react-apexcharts';
import apexchart from 'apexcharts';
import type { FocusStatsResponse, FocusRecordDetail } from '../../../../types/api';
import { getHeatmapColors } from '../../../../utils/color.utils';

interface DailyHourBlock {
	seconds: number;
}

interface TimelineChartProps {
	selectedDates: Date[];
	statsData?: FocusStatsResponse;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ selectedDates, statsData }) => {
	const focusRecords = useMemo(() => statsData?.records || [], [statsData?.records]);

	// Create series in reverse order (12:00 AM at top, 11:00 PM at bottom)
	const DEFAULT_SERIES = useMemo(() => Array.from({ length: 24 }, (_, i) => {
		const startHour = convertTo12HourFormat(`${i.toString().padStart(2, '0')}:00`);
		return {
			name: startHour, // Y-axis label shows just start hour
			data: Array.from({ length: 7 }, () => 0),
		};
	}).reverse(), []);

	const [series, setSeries] = useState(DEFAULT_SERIES);
	const [tooltipPos, setTooltipPos] = useState<{ cellLeft: number; cellTop: number; cellRight: number; cellWidth: number; cellHeight: number; containerWidth: number; flipLeft: boolean; row: number; col: number; mode: 'mouse' | 'keyboard' } | null>(null);

	const containerRef = useRef<HTMLDivElement>(null);
	const kbRow = useRef(0); // i=0 → "11 PM" (bottom), i=23 → "12 AM" (top)
	const kbCol = useRef(0); // 0 = Mon … 6 = Sun
	const kbActive = useRef(false);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const ROWS = 24;
		const COLS = 7;

		const moveTo = (row: number, col: number) => {
			kbRow.current = row;
			kbCol.current = col;
			const cell = container.querySelector(`.apexcharts-heatmap-rect[i='${row}'][j='${col}']`);
			if (!cell) return;
			const r = cell.getBoundingClientRect();
			const cr = container.getBoundingClientRect();
			setTooltipPos(r.width > 0 && r.height > 0
				? { cellLeft: r.left - cr.left, cellTop: r.top - cr.top, cellRight: r.right - cr.left, cellWidth: r.width, cellHeight: r.height, containerWidth: cr.width, flipLeft: r.right + 180 > window.innerWidth, row, col, mode: 'keyboard' }
				: null);
		};

		const onFocusIn = (e: FocusEvent) => {
			if (e.target === container) {
				kbActive.current = true;
				moveTo(kbRow.current, kbCol.current);
			}
		};

		const onFocusOut = (e: FocusEvent) => {
			if (!container.contains(e.relatedTarget as Node)) {
				kbActive.current = false;
				setTooltipPos(null);
			}
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (!kbActive.current) return;
			let row = kbRow.current;
			let col = kbCol.current;
			switch (e.key) {
				case 'ArrowUp':    row = (row + 1) % ROWS; break; // higher i = visually up
				case 'ArrowDown':  row = (row - 1 + ROWS) % ROWS; break; // lower i = visually down
				case 'ArrowLeft':  col = Math.max(0, col - 1); break;
				case 'ArrowRight': col = Math.min(COLS - 1, col + 1); break;
				case 'Home': col = 0; break;
				case 'End':  col = COLS - 1; break;
				default: return;
			}
			e.preventDefault();
			e.stopPropagation(); // prevent ApexCharts' SVG listener from also handling this
			moveTo(row, col);
		};

		const onMouseMove = (e: MouseEvent) => {
			if (kbActive.current) return;
			const cell = (e.target as Element).closest?.('.apexcharts-heatmap-rect');
			if (!cell) { setTooltipPos(null); return; }
			const row = parseInt(cell.getAttribute('i') ?? '0');
			const col = parseInt(cell.getAttribute('j') ?? '0');
			const r = cell.getBoundingClientRect();
			const cr = container.getBoundingClientRect();
			if (r.width > 0 && r.height > 0) {
				setTooltipPos({ cellLeft: r.left - cr.left, cellTop: r.top - cr.top, cellRight: r.right - cr.left, cellWidth: r.width, cellHeight: r.height, containerWidth: cr.width, flipLeft: r.right + 180 > window.innerWidth, row, col, mode: 'mouse' });
			}
		};

		const onMouseLeave = () => {
			if (!kbActive.current) setTooltipPos(null);
		};

		container.addEventListener('focusin', onFocusIn);
		container.addEventListener('focusout', onFocusOut);
		container.addEventListener('keydown', onKeyDown, { capture: true });
		container.addEventListener('mousemove', onMouseMove);
		container.addEventListener('mouseleave', onMouseLeave);

		return () => {
			container.removeEventListener('focusin', onFocusIn);
			container.removeEventListener('focusout', onFocusOut);
			container.removeEventListener('keydown', onKeyDown, { capture: true });
			container.removeEventListener('mousemove', onMouseMove);
			container.removeEventListener('mouseleave', onMouseLeave);
		};
	}, []);

	const chartId = 'timeline';
	const { chosenColorObj, colorMode } = useThemeContext();

	const options = useMemo(() => {
		const getColorScaleRanges = () => {
			const colors = getHeatmapColors(chosenColorObj.hexColor, 6);
			return [
				{ from: 0, to: 0, color: colorMode === 'dark' ? '#2f2f2f' : '#E9E9E9', name: '0m' },
				{ from: 1, to: 600, color: colors[5], name: '0m-10m' },
				{ from: 601, to: 1200, color: colors[4], name: '10m-20m' },
				{ from: 1201, to: 1800, color: colors[3], name: '20m-30m' },
				{ from: 1801, to: 2400, color: colors[2], name: '30m-40m' },
				{ from: 2401, to: 3000, color: colors[1], name: '40m-50m' },
				{ from: 3001, to: 3600, color: colors[0], name: '50m-60m' },
			];
		};

		return {
			chart: {
				id: chartId,
				height: 250,
				type: 'heatmap',
				toolbar: {
					show: false,
				},
				background: 'transparent',
				accessibility: {
					enabled: false,
				},
			},
			plotOptions: {
				heatmap: {
					enableShades: false,
					useFillColorAsStroke: true,
					colorScale: {
						ranges: getColorScaleRanges(),
					},
				},
			},
			dataLabels: {
				enabled: false,
			},
			xaxis: {
				type: 'category',
				categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				labels: {
					style: {
						colors: colorMode === 'dark' ? '#FFFFFF' : '#1E1E1E',
					},
				},
				tooltip: {
					enabled: false,
				},
				axisTicks: {
					show: true,
				},
			},
			yaxis: {
				labels: {
					style: {
						colors: colorMode === 'dark' ? '#FFFFFF' : '#1E1E1E',
					},
				},
			},
			tooltip: {
				enabled: false,
			},
			legend: {
				show: false,
			},
		};
	}, [chosenColorObj.hexColor, colorMode]);

	const tooltipContent = useMemo(() => {
		if (!tooltipPos) return null;
		const { row, col } = tooltipPos;
		const s = series[row];
		if (!s) return null;
		const value = s.data[col] ?? 0;
		const hourLabel = s.name;
		const date = selectedDates[col];
		const formattedDate = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
		const hourMatch = hourLabel.match(/(\d+):00 (AM|PM)/);
		let timeRange = hourLabel;
		if (hourMatch) {
			const hour = parseInt(hourMatch[1]);
			const period = hourMatch[2];
			let nextHour: number;
			let nextPeriod: string;
			if (hour === 12) { nextHour = 1; nextPeriod = period; }
			else if (hour === 11) { nextHour = 12; nextPeriod = period === 'AM' ? 'PM' : 'AM'; }
			else { nextHour = hour + 1; nextPeriod = period; }
			timeRange = `${hourLabel} - ${nextHour}:00 ${nextPeriod}`;
		}
		return { value, timeRange, formattedDate };
	}, [tooltipPos, series, selectedDates]);

	useEffect(() => {
		if (focusRecords.length === 0) {
			// Reset to empty data when no records
			const emptySeries = DEFAULT_SERIES.map(s => ({ ...s, data: [...s.data] }));
			apexchart.exec(chartId, 'updateSeries', emptySeries);
			setSeries(emptySeries);
			return;
		}

		const newSeries = DEFAULT_SERIES.map(s => ({ ...s, data: [...s.data] }));

		// Group records by date - a record can span multiple days, so add it to all affected days
		const recordsByDate: Record<string, FocusRecordDetail[]> = {};
		focusRecords.forEach((record) => {
			const startTime = new Date(record.startTime);
			const endTime = new Date(record.endTime);

			// Iterate through all days this record spans
			const currentDate = new Date(startTime);
			currentDate.setHours(0, 0, 0, 0); // Start at beginning of start day

			const endDate = new Date(endTime);
			endDate.setHours(0, 0, 0, 0); // Get beginning of end day

			// Add record to each day it overlaps
			while (currentDate <= endDate) {
				const dateKey = getFormattedLongDay(currentDate);
				if (!recordsByDate[dateKey]) {
					recordsByDate[dateKey] = [];
				}
				recordsByDate[dateKey].push(record);

				// Move to next day
				currentDate.setDate(currentDate.getDate() + 1);
			}
		});

		// For all 7 days of the week, process each day
		for (let dayIndex = 0; dayIndex < selectedDates.length; dayIndex++) {
			const selectedDate = selectedDates[dayIndex];
			const dateKey = getFormattedLongDay(selectedDate);
			const recordsForTheDay = recordsByDate[dateKey] || [];

			// Create hour blocks for the day
			const newDailyHourBlocks = getDailyHourBlocks() as Record<string, DailyHourBlock>;

			// Fill hour blocks with durations from records
			recordsForTheDay.forEach((record) => {
				const startTime = new Date(record.startTime);
				const endTime = new Date(record.endTime);

				// Process each hour of the current day (0-23)
				for (let hour = 0; hour < 24; hour++) {
					const hourBlockKey = `${hour.toString().padStart(2, '0')}:00`;
					if (newDailyHourBlocks[hourBlockKey]) {
						// Create hour boundaries using the selected date (not the record's start date)
						const hourStart = new Date(selectedDate);
						hourStart.setHours(hour, 0, 0, 0);

						const hourEnd = new Date(selectedDate);
						hourEnd.setHours(hour + 1, 0, 0, 0);

						// Find the overlap between [startTime, endTime] and [hourStart, hourEnd]
						const overlapStart = startTime > hourStart ? startTime : hourStart;
						const overlapEnd = endTime < hourEnd ? endTime : hourEnd;

						// Calculate duration in seconds (will be 0 if no overlap)
						const overlapDuration = Math.max(0, (overlapEnd.getTime() - overlapStart.getTime()) / 1000);

						if (overlapDuration > 0) {
							newDailyHourBlocks[hourBlockKey].seconds += overlapDuration;
						}
					}
				}
			});

			// Update series data
			// Since series is reversed (12 AM at top), we need to reverse the index mapping
			Object.values(newDailyHourBlocks).forEach((dailyHourBlock, index: number) => {
				const reversedIndex = 23 - index; // Hour 0 -> index 23, Hour 23 -> index 0
				newSeries[reversedIndex].data[dayIndex] = (dailyHourBlock as DailyHourBlock).seconds;
			});
		}

		// Force re-render of heatmap
		apexchart.exec(chartId, 'updateSeries', newSeries);
		setSeries(newSeries);
	}, [focusRecords, selectedDates, DEFAULT_SERIES]);

	return (
		<div ref={containerRef} role="region" aria-label="Timeline heatmap" tabIndex={0} className="relative outline-none">
			<p className="sr-only">Heatmap chart showing focus session activity by hour of day across the selected date range. Each cell represents one hour on one day; darker colors indicate more focus time. Use arrow keys to navigate between cells, Home/End to jump to the first or last cell, and Enter or Space to see details.</p>
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{tooltipPos?.mode === 'keyboard' && tooltipContent
					? `${tooltipContent.formattedDate}, ${tooltipContent.timeRange}, ${getFormattedDuration(tooltipContent.value, false)}`
					: ''}
			</div>
			<ReactApexChart options={options as ApexCharts.ApexOptions} series={series} type="heatmap" height={310} />
			{tooltipPos?.mode === 'keyboard' && (
				<div style={{
					position: 'absolute',
					left: tooltipPos.cellLeft,
					top: tooltipPos.cellTop,
					width: tooltipPos.cellWidth,
					height: tooltipPos.cellHeight,
					outline: '2px solid white',
					outlineOffset: '-1px',
					zIndex: 9998,
					pointerEvents: 'none',
				}} />
			)}
			{tooltipPos && tooltipContent && (
				<div style={{
					position: 'absolute',
					...(tooltipPos.flipLeft
						? { right: tooltipPos.containerWidth - tooltipPos.cellLeft + 8 }
						: { left: tooltipPos.cellRight + 8 }),
					top: tooltipPos.cellTop,
					zIndex: 9999,
					pointerEvents: 'none',
					padding: '8px',
					background: 'black',
					borderRadius: '4px',
					color: chosenColorObj.hexColor,
					whiteSpace: 'nowrap',
				}}>
					<div style={{ marginBottom: '4px' }}>{tooltipContent.formattedDate}</div>
					<div style={{ marginBottom: '4px' }}>{tooltipContent.timeRange}</div>
					<div style={{ fontWeight: 'bold' }}>{getFormattedDuration(tooltipContent.value, false)}</div>
				</div>
			)}
		</div>
	);
};

export default TimelineChart;
