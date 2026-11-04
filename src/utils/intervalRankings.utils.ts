import { parseDateRange } from './date.utils';

export type RankingInterval = 'day' | 'week' | 'month' | 'year';

// Parses a backend day ("2024-01-04") or week ("January 01, 2024") label as a local date.
const parseLocalDate = (date: string, interval: 'day' | 'week') => {
	if (interval === 'day') {
		const [year, month, day] = date.split('-').map(Number);
		return new Date(year, month - 1, day);
	}
	return new Date(date);
};

const formatShortDate = (date: Date) =>
	date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Returns the first and last day covered by a backend interval label.
export const getRankingDateRange = (date: string, interval: RankingInterval) => {
	switch (interval) {
		case 'day': {
			const day = parseLocalDate(date, 'day');
			return { startDate: day, endDate: day };
		}
		case 'week': {
			const startDate = parseLocalDate(date, 'week');
			const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);
			return { startDate, endDate };
		}
		default:
			return parseDateRange(interval, date);
	}
};

// Turns a backend interval label into display text (e.g. "Jan 4, 2024" or "Jan 1, 2024 - Jan 7, 2024").
export const formatRankingDate = (date: string, interval: RankingInterval) => {
	switch (interval) {
		case 'day':
			return formatShortDate(parseLocalDate(date, 'day'));
		case 'week': {
			const { startDate, endDate } = getRankingDateRange(date, 'week');
			return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`;
		}
		default:
			return date;
	}
};
