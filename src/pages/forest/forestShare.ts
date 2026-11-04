// The numbers behind the share card: the date range label, the pie slices and the bars.

export interface ShareBar {
	label: string;
	seconds: number;
}

export interface ShareSlice {
	name: string;
	color: string;
	seconds: number;
	percent: number;
}

interface TreeRow {
	startTime: string;
	seconds: number;
}

interface ProjectRow {
	name: string;
	color?: string;
	seconds: number;
}

type BucketUnit = 'hour' | 'day' | 'month' | 'year';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const OTHER_COLOR = '#9a9a9a';
const FALLBACK_COLORS = [
	'#7fcfd6',
	'#e57b63',
	'#9a8bdc',
	'#6fb7e8',
	'#f2a65a',
	'#8fc66b',
	'#d68fb8',
	'#c9b458',
	'#7aa7a1',
];

const formatLongDay = (date: Date) =>
	date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// The same way the date picker words it: a day, a week or custom range, a month, a year, or all time.
export const getRangeLabel = (interval: string, dates: Date[]) => {
	const first = dates[0];
	const last = dates[dates.length - 1];

	if (interval === 'All' || !first) return 'All Time';
	if (interval === 'Month') return first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
	if (interval === 'Year') return String(first.getFullYear());

	return formatLongDay(first) === formatLongDay(last)
		? formatLongDay(first)
		: `${formatLongDay(first)} – ${formatLongDay(last)}`;
};

const floorTo = (unit: BucketUnit, date: Date) => {
	if (unit === 'hour') return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
	if (unit === 'day') return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	if (unit === 'month') return new Date(date.getFullYear(), date.getMonth(), 1);
	return new Date(date.getFullYear(), 0, 1);
};

const getNext = (unit: BucketUnit, date: Date) => {
	if (unit === 'hour') return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1);
	if (unit === 'day') return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
	if (unit === 'month') return new Date(date.getFullYear(), date.getMonth() + 1, 1);
	return new Date(date.getFullYear() + 1, 0, 1);
};

const getKey = (unit: BucketUnit, date: Date) => {
	const parts = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()];
	return parts.slice(0, { year: 1, month: 2, day: 3, hour: 4 }[unit]).join('-');
};

const getHourLabel = (hour: number) => {
	if (hour === 0) return '12a';
	if (hour === 12) return '12p';
	return hour < 12 ? `${hour}a` : `${hour - 12}p`;
};

// Labels are left blank on some bars so they don't crowd each other.
const getLabel = (unit: BucketUnit, date: Date, bucketCount: number) => {
	if (unit === 'hour') return date.getHours() % 3 === 0 ? getHourLabel(date.getHours()) : '';
	if (unit === 'month') return date.toLocaleDateString('en-US', { month: 'short' });
	if (unit === 'year') return String(date.getFullYear());
	if (bucketCount <= 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
	return date.getDate() === 1 || date.getDate() % 5 === 0 ? String(date.getDate()) : '';
};

// Focus time per hour (a day), per day (a week, month or short range), per month (a year) or per year (all time), whichever fits the range.
export const getBars = (rows: TreeRow[], interval: string, dates: Date[]): ShareBar[] => {
	const useRows = interval === 'All' || dates.length === 0;
	if (useRows && rows.length === 0) return [];

	const times = rows.map((row) => new Date(row.startTime).getTime());
	const start = useRows ? new Date(times.reduce((lowest, time) => Math.min(lowest, time), Infinity)) : dates[0];
	const end = useRows
		? new Date(times.reduce((highest, time) => Math.max(highest, time), -Infinity))
		: dates[dates.length - 1];

	const dayCount = Math.round((floorTo('day', end).getTime() - floorTo('day', start).getTime()) / DAY_IN_MS) + 1;
	const unit: BucketUnit =
		interval === 'Day'
			? 'hour'
			: interval === 'Week' || interval === 'Month'
				? 'day'
				: interval === 'Year'
					? 'month'
					: dayCount <= 31
						? 'day'
						: dayCount <= 400
							? 'month'
							: 'year';

	const firstBucket = unit === 'hour' ? floorTo('day', start) : floorTo(unit, start);
	const lastBucket =
		unit === 'hour'
			? new Date(firstBucket.getFullYear(), firstBucket.getMonth(), firstBucket.getDate(), 23)
			: floorTo(unit, end);

	const buckets: { key: string; date: Date; seconds: number }[] = [];
	for (let cursor = firstBucket; cursor.getTime() <= lastBucket.getTime(); cursor = getNext(unit, cursor)) {
		buckets.push({ key: getKey(unit, cursor), date: cursor, seconds: 0 });
	}

	const bucketsByKey = new Map(buckets.map((bucket) => [bucket.key, bucket]));
	rows.forEach((row) => {
		const bucket = bucketsByKey.get(getKey(unit, new Date(row.startTime)));
		if (bucket) bucket.seconds += row.seconds;
	});

	return buckets.map(({ date, seconds }) => ({ label: getLabel(unit, date, buckets.length), seconds }));
};

// The biggest projects as pie slices, with everything past the limit lumped into "Other".
export const getSlices = (projects: ProjectRow[], maxSlices = 9): ShareSlice[] => {
	const total = projects.reduce((sum, project) => sum + project.seconds, 0);
	if (total === 0) return [];

	const sorted = [...projects].sort((a, b) => b.seconds - a.seconds);
	const shown = sorted.length > maxSlices ? sorted.slice(0, maxSlices - 1) : sorted;
	const otherSeconds = sorted.slice(shown.length).reduce((sum, project) => sum + project.seconds, 0);

	const slices = shown.map((project, index) => ({
		name: project.name,
		color: project.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
		seconds: project.seconds,
	}));
	if (otherSeconds > 0) slices.push({ name: 'Other', color: OTHER_COLOR, seconds: otherSeconds });

	return slices.map((slice) => ({ ...slice, percent: Math.round((slice.seconds / total) * 100) }));
};
