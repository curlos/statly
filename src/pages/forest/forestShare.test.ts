import { describe, expect, it } from '@jest/globals';
import { getBars, getRangeLabel, getSlices } from './forestShare';

const row = (date: Date, seconds: number) => ({ startTime: date.toISOString(), seconds });
const daysFrom = (start: Date, count: number) =>
	Array.from(
		{ length: count },
		(_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index, 12)
	);

describe('getRangeLabel', () => {
	it('words each interval like the date picker does', () => {
		expect(getRangeLabel('Day', [new Date(2026, 9, 1, 12)])).toBe('October 1, 2026');
		expect(getRangeLabel('Week', daysFrom(new Date(2026, 8, 28), 7))).toBe('September 28, 2026 – October 4, 2026');
		expect(getRangeLabel('Month', daysFrom(new Date(2026, 9, 1), 31))).toBe('October 2026');
		expect(getRangeLabel('Year', daysFrom(new Date(2026, 0, 1), 365))).toBe('2026');
		expect(getRangeLabel('All', [])).toBe('All Time');
	});

	it('shows a custom range of one day as just that day', () => {
		expect(getRangeLabel('Custom', [new Date(2026, 9, 5, 12)])).toBe('October 5, 2026');
		expect(getRangeLabel('Custom', daysFrom(new Date(2026, 9, 5), 3))).toBe('October 5, 2026 – October 7, 2026');
	});
});

describe('getBars', () => {
	it('gives a day 24 hourly bars, with a label on every third hour', () => {
		const bars = getBars([row(new Date(2026, 9, 1, 14, 30), 1800), row(new Date(2026, 9, 1, 14, 50), 600)], 'Day', [
			new Date(2026, 9, 1, 12),
		]);
		expect(bars).toHaveLength(24);
		expect(bars[14].seconds).toBe(2400);
		expect(bars.map((bar) => bar.label).filter(Boolean)).toEqual([
			'12a',
			'3a',
			'6a',
			'9a',
			'12p',
			'3p',
			'6p',
			'9p',
		]);
	});

	it('gives a week 7 daily bars named by weekday', () => {
		const bars = getBars([row(new Date(2026, 9, 28, 9), 3600)], 'Week', daysFrom(new Date(2026, 9, 26), 7));
		expect(bars.map((bar) => bar.label)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
		expect(bars[2].seconds).toBe(3600);
	});

	it('gives a month one bar per day, with only some day numbers shown', () => {
		const bars = getBars([row(new Date(2026, 9, 31, 9), 900)], 'Month', daysFrom(new Date(2026, 9, 1), 31));
		expect(bars).toHaveLength(31);
		expect(bars[30].seconds).toBe(900);
		expect(bars.filter((bar) => bar.label).map((bar) => bar.label)).toEqual([
			'1',
			'5',
			'10',
			'15',
			'20',
			'25',
			'30',
		]);
	});

	it('gives a year 12 monthly bars', () => {
		const bars = getBars(
			[row(new Date(2026, 2, 3, 9), 1000), row(new Date(2026, 2, 20, 9), 500)],
			'Year',
			daysFrom(new Date(2026, 0, 1), 365)
		);
		expect(bars.map((bar) => bar.label)).toEqual([
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		]);
		expect(bars[2].seconds).toBe(1500);
	});

	it('gives all time one bar per year, including years with no focus', () => {
		const bars = getBars([row(new Date(2024, 5, 1, 9), 600), row(new Date(2026, 1, 1, 9), 300)], 'All', []);
		expect(bars).toEqual([
			{ label: '2024', seconds: 600 },
			{ label: '2025', seconds: 0 },
			{ label: '2026', seconds: 300 },
		]);
	});

	it('picks daily bars for a short custom range and monthly bars for a longer one', () => {
		expect(getBars([], 'Custom', daysFrom(new Date(2026, 9, 1), 20))).toHaveLength(20);
		expect(getBars([], 'Custom', daysFrom(new Date(2026, 0, 15), 120)).map((bar) => bar.label)).toEqual([
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
		]);
	});

	it('has no bars for all time when there is nothing to show', () => {
		expect(getBars([], 'All', [])).toEqual([]);
	});
});

describe('getSlices', () => {
	it('shows each project with its share of the time, biggest first', () => {
		const slices = getSlices([
			{ name: 'Small', color: '#111111', seconds: 100 },
			{ name: 'Big', color: '#222222', seconds: 300 },
		]);
		expect(slices.map((slice) => [slice.name, slice.percent])).toEqual([
			['Big', 75],
			['Small', 25],
		]);
	});

	it('lumps the smallest projects into Other when there are too many', () => {
		const projects = Array.from({ length: 12 }, (_, index) => ({
			name: `Project ${index}`,
			color: '#123456',
			seconds: (12 - index) * 100,
		}));
		const slices = getSlices(projects, 5);
		expect(slices).toHaveLength(5);
		expect(slices[4].name).toBe('Other');
		expect(slices[4].seconds).toBe(projects.slice(4).reduce((sum, project) => sum + project.seconds, 0));
	});

	it('gives a color to projects that have none', () => {
		expect(getSlices([{ name: 'No Color', seconds: 10 }])[0].color).toMatch(/^#/);
	});

	it('has no slices when there is no focus time', () => {
		expect(getSlices([])).toEqual([]);
		expect(getSlices([{ name: 'Empty', seconds: 0 }])).toEqual([]);
	});
});
