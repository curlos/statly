export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type LandStyleName = Season | 'blossom' | 'sand' | 'lavender' | 'halloween' | 'christmas' | 'thanksgiving' | "st. patrick's" | 'easter' | 'beach';

export interface LandColors {
	top: string;
	topLight: string;
	line: string;
	turf: string;
	turfShade: string;
	layers: string[]; // Wall layers from top to bottom
	stone: string | null;
	speckles: string[];
	speckleShape: 'flower' | 'leaf' | 'snow';
	edge: 'blades' | 'lumps' | 'waves';
	decor?: 'christmas' | 'beach';
}

// Auto follows the holidays and falls back to the season. Seasons follows only the season.
export const LAND_OPTIONS = ['Auto', 'Seasons', 'Spring', 'Summer', 'Autumn', 'Winter', 'Blossom', 'Sand', 'Lavender', 'Halloween', 'Christmas', 'Thanksgiving', "St. Patrick's", 'Easter', 'Beach'];

export const LAND_STYLES: Record<LandStyleName, LandColors> = {
	spring: {
		top: '#a4dc4e',
		topLight: '#b4e65e',
		line: '#8fcb40',
		turf: '#96cf45',
		turfShade: '#74a834',
		layers: ['#6e4a2a', '#5e3f24', '#4d331d'],
		stone: '#54371f',
		speckles: ['#ffffff', '#ffd0e0', '#fff0a0'],
		speckleShape: 'flower',
		edge: 'blades',
	},
	summer: {
		top: '#7fcb45',
		topLight: '#90d652',
		line: '#6ab838',
		turf: '#72bd3e',
		turfShade: '#54962c',
		layers: ['#674527', '#573a21', '#47301b'],
		stone: '#4d331c',
		speckles: ['#ffffff', '#ffe36b', '#fff6c2'],
		speckleShape: 'flower',
		edge: 'blades',
	},
	autumn: {
		top: '#f0c76a',
		topLight: '#f6d687',
		line: '#dfb255',
		turf: '#dda544',
		turfShade: '#bd8430',
		layers: ['#6e4629', '#5d3a22', '#4c2f1b'],
		stone: '#533419',
		speckles: ['#e2703a', '#c44f25', '#f4b53f'],
		speckleShape: 'leaf',
		edge: 'blades',
	},
	winter: {
		top: '#f2f7fc',
		topLight: '#ffffff',
		line: '#dfeaf4',
		turf: '#eaf2fa',
		turfShade: '#c8dbec',
		layers: ['#9fb9d1', '#7f9dba', '#657f9c'],
		stone: null,
		speckles: ['#d5e5f3', '#ffffff', '#c6dbee'],
		speckleShape: 'snow',
		edge: 'lumps',
	},
	blossom: {
		top: '#fbc4d2',
		topLight: '#fdd5df',
		line: '#f6afc1',
		turf: '#f9a8bd',
		turfShade: '#ec7f9d',
		layers: ['#dd5f83', '#bd4670', '#96335c'],
		stone: null,
		speckles: ['#ffffff', '#fff0a0', '#e7c5ff'],
		speckleShape: 'flower',
		edge: 'lumps',
	},
	sand: {
		top: '#f9e7bd',
		topLight: '#fcf0d3',
		line: '#efd9a6',
		turf: '#f2d9a0',
		turfShade: '#dcbd7e',
		layers: ['#c79f63', '#ab8350', '#8d6a40'],
		stone: '#a98558',
		speckles: ['#fffaf0', '#e8c98c', '#f4b8a0'],
		speckleShape: 'snow',
		edge: 'lumps',
	},
	lavender: {
		top: '#d6c6f5',
		topLight: '#e2d6f9',
		line: '#c5b2ee',
		turf: '#bda6ea',
		turfShade: '#9a80d6',
		layers: ['#7d62bd', '#654ca1', '#4f3a85'],
		stone: null,
		speckles: ['#ffffff', '#ffe9a8', '#ffc6e4'],
		speckleShape: 'flower',
		edge: 'lumps',
	},
	halloween: {
		top: '#ee8f2f',
		topLight: '#f6a747',
		line: '#d9771f',
		turf: '#de741d',
		turfShade: '#9c4714',
		layers: ['#3b2a4a', '#2c1f38', '#1e1527'],
		stone: '#140d1c',
		speckles: ['#5b2d8c', '#1c1226', '#8fd14f'],
		speckleShape: 'leaf',
		edge: 'blades',
	},
	christmas: {
		top: '#2f8f4e',
		topLight: '#ffffff',
		line: '#267a41',
		turf: '#f4f9fd',
		turfShade: '#c9dfec',
		layers: ['#1f6b3b', '#185a31', '#124a27'],
		stone: null,
		speckles: ['#ffffff', '#ffffff', '#ffe27a'],
		speckleShape: 'snow',
		edge: 'lumps',
		decor: 'christmas',
	},
	thanksgiving: {
		top: '#c98a3f',
		topLight: '#d89c50',
		line: '#b57a33',
		turf: '#b56f2d',
		turfShade: '#8f5021',
		layers: ['#68401f', '#563319', '#442814'],
		stone: '#3c2311',
		speckles: ['#b63f1e', '#e6a02f', '#8a2f1a'],
		speckleShape: 'leaf',
		edge: 'blades',
	},
	"st. patrick's": {
		top: '#35b45b',
		topLight: '#49c56d',
		line: '#2a9d4d',
		turf: '#279a49',
		turfShade: '#187a36',
		layers: ['#6a4a26', '#573c1f', '#453018'],
		stone: '#3d2a14',
		speckles: ['#f5cc45', '#9ceb7d', '#ffffff'],
		speckleShape: 'flower',
		edge: 'blades',
	},
	easter: {
		top: '#d9f2d0',
		topLight: '#e8f9e1',
		line: '#c5e6ba',
		turf: '#bfe8b4',
		turfShade: '#f4b6cf',
		layers: ['#f7d4e4', '#d9c9f4', '#bfdcf5'],
		stone: null,
		speckles: ['#f49ac1', '#b79cf0', '#ffd96b', '#88cdf2'],
		speckleShape: 'flower',
		edge: 'lumps',
	},
	beach: {
		top: '#7fe3e0',
		topLight: '#fbeecb',
		line: '#ebd49c',
		turf: '#ffffff',
		turfShade: '#9be7e4',
		layers: ['#48cbd6', '#2aa3c2', '#1a7fa8'],
		stone: null,
		speckles: ['#fff8ea', '#f3a58f', '#e8c98c'],
		speckleShape: 'snow',
		edge: 'waves',
		decor: 'beach',
	},
};

// The date Easter Sunday falls on in a year (the Gregorian "anonymous" algorithm).
const getEasterSunday = (year: number) => {
	const a = year % 19;
	const b = Math.floor(year / 100);
	const c = year % 100;
	const d = Math.floor(b / 4);
	const e = b % 4;
	const f = Math.floor((b + 8) / 25);
	const g = Math.floor((b - f + 1) / 3);
	const h = (19 * a + b - d - g + 15) % 30;
	const i = Math.floor(c / 4);
	const k = c % 4;
	const l = (32 + 2 * e + 2 * i - h - k) % 7;
	const m = Math.floor((a + 11 * h + 22 * l) / 451);
	const month = Math.floor((h + l - 7 * m + 114) / 31);
	const day = ((h + l - 7 * m + 114) % 31) + 1;
	return new Date(year, month - 1, day);
};

// The fourth Thursday of November
const getThanksgiving = (year: number) => {
	const daysUntilFirstThursday = (4 - new Date(year, 10, 1).getDay() + 7) % 7;
	return new Date(year, 10, 1 + daysUntilFirstThursday + 21);
};

// The holiday land a date falls in, or null if it isn't near one.
export const getHolidayForDate = (date: Date): LandStyleName | null => {
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	const daysUntil = (holiday: Date) => Math.round((holiday.getTime() - new Date(year, month, day).getTime()) / (24 * 60 * 60 * 1000));

	if (month === 11) return 'christmas';
	if (month === 9 && day >= 15) return 'halloween';

	// From the week before Thanksgiving until the Sunday after
	const untilThanksgiving = daysUntil(getThanksgiving(year));
	if (untilThanksgiving >= -3 && untilThanksgiving <= 7) return 'thanksgiving';

	if (month === 2 && day >= 10 && day <= 17) return "st. patrick's";

	// The week leading up to Easter Sunday
	const untilEaster = daysUntil(getEasterSunday(year));
	if (untilEaster >= 0 && untilEaster <= 7) return 'easter';

	return null;
};

export const getAutoLandForDate = (date: Date, isSouthern = false): LandStyleName => getHolidayForDate(date) ?? getSeasonForDate(date, isSouthern);

// Time zones south of the equator, found by name since the browser can't say where it is. A zone that straddles the equator isn't listed, so those count as northern.
const SOUTHERN_TIME_ZONE_PREFIXES = ['Australia/', 'Antarctica/', 'America/Argentina/'];
const SOUTHERN_TIME_ZONES = new Set([
	'Pacific/Auckland', 'Pacific/Chatham', 'Pacific/Fiji', 'Pacific/Tahiti', 'Pacific/Noumea', 'Pacific/Port_Moresby', 'Pacific/Apia', 'Pacific/Tongatapu', 'Pacific/Norfolk', 'Pacific/Guadalcanal', 'Pacific/Efate', 'Pacific/Pago_Pago', 'Pacific/Rarotonga',
	'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Santiago', 'America/Montevideo', 'America/Asuncion', 'America/La_Paz', 'America/Lima', 'America/Campo_Grande', 'America/Cuiaba', 'America/Bahia', 'America/Fortaleza', 'America/Recife', 'America/Maceio', 'America/Manaus', 'America/Porto_Velho', 'America/Rio_Branco', 'America/Punta_Arenas',
	'Africa/Johannesburg', 'Africa/Maseru', 'Africa/Mbabane', 'Africa/Windhoek', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Lusaka', 'Africa/Maputo', 'Africa/Blantyre', 'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Dar_es_Salaam', 'Africa/Kigali', 'Africa/Bujumbura',
	'Indian/Antananarivo', 'Indian/Mauritius', 'Indian/Reunion', 'Indian/Comoro', 'Indian/Mayotte',
	'Asia/Jakarta', 'Asia/Makassar', 'Asia/Dili',
]);

export const isSouthernHemisphereTimeZone = (timeZone: string) =>
	SOUTHERN_TIME_ZONES.has(timeZone) || SOUTHERN_TIME_ZONE_PREFIXES.some((prefix) => timeZone.startsWith(prefix));

const OPPOSITE_SEASON: Record<Season, Season> = { spring: 'autumn', summer: 'winter', autumn: 'spring', winter: 'summer' };

// The season for a date. South of the equator the seasons are the other way around, so a December date is summer.
export const getSeasonForDate = (date: Date, isSouthern = false): Season => {
	const northernSeason = getNorthernSeason(date);
	return isSouthern ? OPPOSITE_SEASON[northernSeason] : northernSeason;
};

const getNorthernSeason = (date: Date): Season => {
	const month = date.getMonth();

	if (month >= 2 && month <= 4) return 'spring';
	if (month >= 5 && month <= 7) return 'summer';
	if (month >= 8 && month <= 10) return 'autumn';
	return 'winter';
};
