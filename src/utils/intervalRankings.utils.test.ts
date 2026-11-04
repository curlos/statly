import { describe, expect, it } from '@jest/globals';
import { formatRankingDate, getRankingDateRange } from './intervalRankings.utils';

// Local y/m/d of a date, so the checks don't depend on the machine's timezone
const ymd = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()];

describe('formatRankingDate', () => {
	it('formats days', () => {
		expect(formatRankingDate('2024-01-04', 'day')).toBe('Jan 4, 2024');
	});

	it('keeps the first of the month on the right day (no UTC shift)', () => {
		expect(formatRankingDate('2024-03-01', 'day')).toBe('Mar 1, 2024');
	});

	it('formats weeks as Monday to Sunday', () => {
		expect(formatRankingDate('February 22, 2021', 'week')).toBe('Feb 22, 2021 - Feb 28, 2021');
	});

	it('formats weeks that span two months', () => {
		expect(formatRankingDate('January 29, 2024', 'week')).toBe('Jan 29, 2024 - Feb 4, 2024');
	});

	it('formats weeks that span two years', () => {
		expect(formatRankingDate('December 30, 2024', 'week')).toBe('Dec 30, 2024 - Jan 5, 2025');
	});

	it('leaves months and years as they are', () => {
		expect(formatRankingDate('January 2024', 'month')).toBe('January 2024');
		expect(formatRankingDate('2024', 'year')).toBe('2024');
	});
});

describe('getRankingDateRange', () => {
	it('is a single day for days', () => {
		const { startDate, endDate } = getRankingDateRange('2024-03-01', 'day');
		expect(ymd(startDate)).toEqual([2024, 3, 1]);
		expect(ymd(endDate)).toEqual([2024, 3, 1]);
	});

	it('is Monday to Sunday for weeks, across a month change', () => {
		const { startDate, endDate } = getRankingDateRange('January 29, 2024', 'week');
		expect(ymd(startDate)).toEqual([2024, 1, 29]);
		expect(ymd(endDate)).toEqual([2024, 2, 4]);
	});

	it('is the whole month for months, including leap years', () => {
		const { startDate, endDate } = getRankingDateRange('February 2024', 'month');
		expect(ymd(startDate)).toEqual([2024, 2, 1]);
		expect(ymd(endDate)).toEqual([2024, 2, 29]);
	});

	it('is the whole year for years', () => {
		const { startDate, endDate } = getRankingDateRange('2023', 'year');
		expect(ymd(startDate)).toEqual([2023, 1, 1]);
		expect(ymd(endDate)).toEqual([2023, 12, 31]);
	});
});
