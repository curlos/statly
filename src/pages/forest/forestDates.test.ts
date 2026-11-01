import { describe, expect, it } from '@jest/globals';
import { buildDateRangeParams, getDateRangeKey, parseDateRangeParams } from './forestDates';

const today = new Date(2026, 10, 1, 9, 30);
const noParams = { 'date-interval': '', 'start-date': '', 'end-date': '' };

describe('parseDateRangeParams', () => {
	it('is today when there are no params', () => {
		const range = parseDateRangeParams({}, today);
		expect(range.interval).toBe('Day');
		expect(range.dates).toHaveLength(1);
		expect(getDateRangeKey(range.interval, range.dates)).toBe('Day|Nov 1, 2026|Nov 1, 2026');
	});

	it('reads a day, a week, a month and a year', () => {
		expect(getDateRangeKey(...(Object.values(parseDateRangeParams({ interval: 'Day', start: 'Oct 5, 2026', end: 'Oct 5, 2026' }, today)) as [string, Date[]]))).toBe('Day|Oct 5, 2026|Oct 5, 2026');

		const week = parseDateRangeParams({ interval: 'Week', start: 'Oct 26, 2026', end: 'Nov 1, 2026' }, today);
		expect(week.interval).toBe('Week');
		expect(week.dates).toHaveLength(7);

		expect(parseDateRangeParams({ interval: 'Month', start: 'Oct 1, 2026', end: 'Oct 31, 2026' }, today).dates).toHaveLength(31);
		expect(parseDateRangeParams({ interval: 'Year', start: 'Jan 1, 2025', end: 'Dec 31, 2025' }, today).dates).toHaveLength(365);
	});

	it('reads all time with no dates', () => {
		expect(parseDateRangeParams({ interval: 'All' }, today).interval).toBe('All');
	});

	it('keeps a custom range exactly, and a day range to its first day', () => {
		const custom = parseDateRangeParams({ interval: 'Custom', start: 'Sep 3, 2026', end: 'Sep 20, 2026' }, today);
		expect(custom.dates).toHaveLength(18);
		expect(parseDateRangeParams({ interval: 'Day', start: 'Oct 5, 2026', end: 'Oct 9, 2026' }, today).dates).toHaveLength(1);
	});

	it('treats dates with no interval as a custom range', () => {
		expect(parseDateRangeParams({ start: 'Oct 1, 2026', end: 'Oct 3, 2026' }, today).interval).toBe('Custom');
		expect(parseDateRangeParams({ interval: 'Fortnight', start: 'Oct 1, 2026', end: 'Oct 3, 2026' }, today).interval).toBe('Custom');
	});

	it('uses the start date alone when there is no end, and puts reversed dates in order', () => {
		expect(parseDateRangeParams({ interval: 'Custom', start: 'Oct 1, 2026' }, today).dates).toHaveLength(1);
		expect(parseDateRangeParams({ interval: 'Custom', start: 'Oct 3, 2026', end: 'Oct 1, 2026' }, today).dates).toHaveLength(3);
	});

	it('falls back to today for dates that are not dates, and caps a huge range', () => {
		expect(parseDateRangeParams({ interval: 'Week', start: 'not a date' }, today).interval).toBe('Day');
		expect(parseDateRangeParams({ interval: 'Custom', start: 'Jan 1, 1900', end: 'Dec 31, 2100' }, today).dates.length).toBeLessThanOrEqual(7400);
	});
});

describe('buildDateRangeParams', () => {
	it('has no params for today, which is the default', () => {
		expect(buildDateRangeParams('Day', [new Date(2026, 10, 1, 12)], today)).toEqual(noParams);
	});

	it('writes every other interval', () => {
		expect(buildDateRangeParams('Day', [new Date(2026, 9, 31, 12)], today)).toEqual({ 'date-interval': 'Day', 'start-date': 'Oct 31, 2026', 'end-date': 'Oct 31, 2026' });
		expect(buildDateRangeParams('Week', [new Date(2026, 9, 26), new Date(2026, 10, 1)], today)).toEqual({ 'date-interval': 'Week', 'start-date': 'Oct 26, 2026', 'end-date': 'Nov 1, 2026' });
		expect(buildDateRangeParams('All', [], today)).toEqual({ ...noParams, 'date-interval': 'All' });
	});

	it('reads back what it wrote', () => {
		const dates = parseDateRangeParams({ interval: 'Month', start: 'Oct 1, 2026', end: 'Oct 31, 2026' }, today).dates;
		const params = buildDateRangeParams('Month', dates, today);
		const range = parseDateRangeParams({ interval: params['date-interval'], start: params['start-date'], end: params['end-date'] }, today);
		expect(getDateRangeKey(range.interval, range.dates)).toBe(getDateRangeKey('Month', dates));
	});
});

describe('getDateRangeKey', () => {
	it('ignores the days for all time, and tells different ranges apart', () => {
		expect(getDateRangeKey('All', [new Date(2026, 1, 1)])).toBe(getDateRangeKey('All', []));
		expect(getDateRangeKey('Week', [new Date(2026, 9, 26), new Date(2026, 10, 1)])).not.toBe(getDateRangeKey('Week', [new Date(2026, 9, 19), new Date(2026, 9, 25)]));
	});
});
