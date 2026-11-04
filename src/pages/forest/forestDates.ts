// How the forest page's date range is kept in the URL. It uses the same query params as the Focus Records page: date-interval, start-date and end-date, with dates worded like "Oct 26, 2026".
// Today's date is the default, so it has no params at all.

export type ForestInterval = 'Day' | 'Week' | 'Month' | 'Year' | 'All' | 'Custom';

export interface ForestDateRange {
	interval: string;
	dates: Date[];
}

interface DateParams {
	interval?: string | null;
	start?: string | null;
	end?: string | null;
}

const INTERVALS: string[] = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
// A hand-edited URL can't make the page build more days than this
const MAX_DAYS = 7400;

const formatDate = (date: Date) =>
	date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Noon keeps a date on the right day when clocks change
const atNoon = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);

const parseDate = (text?: string | null) => {
	if (!text) return null;

	const date = new Date(text);
	return Number.isNaN(date.getTime()) ? null : atNoon(date);
};

const getDaysInRange = (first: Date, last: Date) => {
	const days: Date[] = [];
	for (
		let day = atNoon(first);
		day.getTime() <= last.getTime() && days.length < MAX_DAYS;
		day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1, 12)
	) {
		days.push(day);
	}
	return days;
};

// The interval and days the page should show for the URL's params. Anything missing or invalid becomes today.
export const parseDateRangeParams = ({ interval, start, end }: DateParams, today: Date): ForestDateRange => {
	const fallback = { interval: 'Day', dates: [atNoon(today)] };

	if (interval === 'All') return { interval: 'All', dates: fallback.dates };

	const startDate = parseDate(start);
	if (!startDate) return fallback;

	const endDate = parseDate(end) ?? startDate;
	const [first, last] = startDate.getTime() <= endDate.getTime() ? [startDate, endDate] : [endDate, startDate];
	// Dates with no interval, like from a link, are a custom range.
	const validInterval = interval && INTERVALS.includes(interval) ? interval : 'Custom';

	return { interval: validInterval, dates: validInterval === 'Day' ? [first] : getDaysInRange(first, last) };
};

// The params to put in the URL for an interval and its days. Empty strings mean the param should be removed.
export const buildDateRangeParams = (interval: string, dates: Date[], today: Date) => {
	const none = { 'date-interval': '', 'start-date': '', 'end-date': '' };
	const first = dates[0] ?? today;
	const last = dates[dates.length - 1] ?? today;

	if (interval === 'All') return { ...none, 'date-interval': 'All' };
	if (interval === 'Day' && dates.length <= 1 && formatDate(first) === formatDate(today)) return none;

	return { 'date-interval': interval, 'start-date': formatDate(first), 'end-date': formatDate(last) };
};

// A short text for an interval and its days, to tell whether two ranges are the same
export const getDateRangeKey = (interval: string, dates: Date[]) => {
	if (interval === 'All') return 'All';

	const first = dates[0];
	const last = dates[dates.length - 1];
	return `${interval}|${first ? formatDate(first) : ''}|${last ? formatDate(last) : ''}`;
};
