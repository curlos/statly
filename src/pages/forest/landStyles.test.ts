import { describe, expect, it } from '@jest/globals';
import {
	LAND_OPTIONS,
	LAND_STYLES,
	getAutoLandForDate,
	getHolidayForDate,
	getSeasonForDate,
	isSouthernHemisphereTimeZone,
} from './landStyles';

describe('getSeasonForDate', () => {
	it('uses northern-hemisphere seasons', () => {
		expect(getSeasonForDate(new Date(2026, 0, 10))).toBe('winter');
		expect(getSeasonForDate(new Date(2026, 3, 20))).toBe('spring');
		expect(getSeasonForDate(new Date(2026, 6, 4))).toBe('summer');
		expect(getSeasonForDate(new Date(2026, 9, 5))).toBe('autumn');
		expect(getSeasonForDate(new Date(2026, 11, 31))).toBe('winter');
	});
});

describe('southern hemisphere', () => {
	it('flips the seasons, so December is summer and July is winter', () => {
		expect(getSeasonForDate(new Date(2026, 11, 15), true)).toBe('summer');
		expect(getSeasonForDate(new Date(2026, 6, 4), true)).toBe('winter');
		expect(getSeasonForDate(new Date(2026, 3, 20), true)).toBe('autumn');
		expect(getSeasonForDate(new Date(2026, 9, 5), true)).toBe('spring');
	});

	it('leaves the northern seasons alone by default', () => {
		expect(getSeasonForDate(new Date(2026, 11, 15))).toBe('winter');
		expect(getSeasonForDate(new Date(2026, 11, 15), false)).toBe('winter');
	});

	it('recognizes southern time zones, and not northern ones', () => {
		[
			'Australia/Sydney',
			'Australia/Perth',
			'Pacific/Auckland',
			'America/Sao_Paulo',
			'America/Argentina/Buenos_Aires',
			'Africa/Johannesburg',
			'America/Santiago',
		].forEach((zone) => {
			expect(isSouthernHemisphereTimeZone(zone)).toBe(true);
		});
		['America/New_York', 'Europe/London', 'Asia/Tokyo', 'America/Bogota', 'Africa/Nairobi', 'UTC', ''].forEach(
			(zone) => {
				expect(isSouthernHemisphereTimeZone(zone)).toBe(false);
			}
		);
	});

	it('still uses the holiday by date, so Christmas is Christmas in summer too', () => {
		expect(getAutoLandForDate(new Date(2026, 11, 25), true)).toBe('christmas');
		expect(getAutoLandForDate(new Date(2026, 0, 10), true)).toBe('summer');
	});
});

describe('getHolidayForDate', () => {
	it('picks Halloween for the second half of October only', () => {
		expect(getHolidayForDate(new Date(2026, 9, 14))).toBeNull();
		expect(getHolidayForDate(new Date(2026, 9, 15))).toBe('halloween');
		expect(getHolidayForDate(new Date(2026, 9, 31))).toBe('halloween');
	});

	it('picks Thanksgiving for the week around the fourth Thursday of November', () => {
		// Thanksgiving 2026 is Thursday, November 26
		expect(getHolidayForDate(new Date(2026, 10, 18))).toBeNull();
		expect(getHolidayForDate(new Date(2026, 10, 19))).toBe('thanksgiving');
		expect(getHolidayForDate(new Date(2026, 10, 26))).toBe('thanksgiving');
		expect(getHolidayForDate(new Date(2026, 10, 29))).toBe('thanksgiving');
		expect(getHolidayForDate(new Date(2026, 10, 30))).toBeNull();
	});

	it('picks Christmas for all of December, even when Thanksgiving week runs into it', () => {
		expect(getHolidayForDate(new Date(2026, 11, 1))).toBe('christmas');
		expect(getHolidayForDate(new Date(2026, 11, 25))).toBe('christmas');
		// Thanksgiving 2024 fell on November 28, so its week reaches the end of the month
		expect(getHolidayForDate(new Date(2024, 10, 28))).toBe('thanksgiving');
	});

	it("picks St. Patrick's for the week up to March 17", () => {
		expect(getHolidayForDate(new Date(2026, 2, 9))).toBeNull();
		expect(getHolidayForDate(new Date(2026, 2, 10))).toBe("st. patrick's");
		expect(getHolidayForDate(new Date(2026, 2, 17))).toBe("st. patrick's");
		expect(getHolidayForDate(new Date(2026, 2, 18))).toBeNull();
	});

	it('picks Easter for the week leading up to Easter Sunday, which moves each year', () => {
		// Easter 2026 is April 5, and Easter 2027 is March 28
		expect(getHolidayForDate(new Date(2026, 2, 28))).toBeNull();
		expect(getHolidayForDate(new Date(2026, 2, 29))).toBe('easter');
		expect(getHolidayForDate(new Date(2026, 3, 5))).toBe('easter');
		expect(getHolidayForDate(new Date(2026, 3, 6))).toBeNull();
		expect(getHolidayForDate(new Date(2027, 2, 28))).toBe('easter');
	});
});

describe('getAutoLandForDate', () => {
	it('falls back to the season when there is no holiday', () => {
		expect(getAutoLandForDate(new Date(2026, 0, 10))).toBe('winter');
		expect(getAutoLandForDate(new Date(2026, 6, 4))).toBe('summer');
	});

	it('uses the holiday when there is one', () => {
		expect(getAutoLandForDate(new Date(2026, 9, 31))).toBe('halloween');
	});
});

describe('LAND_OPTIONS', () => {
	it('has a style for every option except the automatic ones', () => {
		LAND_OPTIONS.filter((option) => !['Auto', 'Seasons'].includes(option)).forEach((option) => {
			expect(LAND_STYLES[option.toLowerCase() as keyof typeof LAND_STYLES]).toBeDefined();
		});
	});
});
