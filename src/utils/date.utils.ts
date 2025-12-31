export const setTimeOnDateString = (dateString: string | Date, timeString?: string) => {
	// Parse the existing date string to get a Date object
	const date = new Date(dateString);

	// Function to check if the date is in DST for Eastern Time
	const isDST = (date: Date) => {
		const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
		const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
		return date.getTimezoneOffset() < Math.max(jan, jul);
	};

	if (timeString) {
		// Extract hours and minutes from the time string (formatted as "HH:mm AM/PM")
		const [time, period] = timeString.split(' ');
		const [hoursStr, minutesStr] = time.split(':');
		let hours = parseInt(hoursStr);
		const minutes = parseInt(minutesStr);

		// Convert 12-hour format to 24-hour if necessary
		if (period === 'PM' && hours !== 12) {
			hours += 12;
		} else if (period === 'AM' && hours === 12) {
			hours = 0;
		}

		// Set the desired time on the existing date object
		date.setHours(hours, minutes, 0, 0);
	} else {
		// Determine if DST is in effect for the date
		const dstActive = isDST(date);
		const utcOffset = dstActive ? 4 : 5; // DST: UTC-4, otherwise UTC-5

		// Set time to 12:00 AM EST/EDT, adjusted for DST
		date.setUTCHours(0 + utcOffset, 0, 0, 0); // Sets to 12:00 AM EST
	}

	return date;
};

export const getTimeString = (dateToUse?: Date) => {
	const date = dateToUse || new Date();
	let hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';

	// Convert hours from 24-hour time to 12-hour time
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'

	// Minutes should be two digits
	const minutesStr = minutes < 10 ? '0' + minutes : minutes;

	// Format the time in AM/PM notation
	return `${hours}:${minutesStr} ${ampm}`;
};

export const formatDateTime = (dateTimeStr: string | Date) => {
	const date = new Date(dateTimeStr);

	// Extracting hours and minutes for the time without leading zeros
	const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
	const time = date.toLocaleTimeString('en-US', optionsTime);

	// Extracting the day and month for the date
	const optionsDate: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
	const day = date.toLocaleDateString('en-US', optionsDate);

	return { time, day };
};

export function areDatesEqual(date1: Date | null, date2: Date | null) {
	if (!date1 || !date2) {
		return false;
	}

	const datesEqual =
		date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear();

	return datesEqual;
}

export const formatCheckedInDayDate = (inputDate: Date) => {
	return inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const getFormattedLongDay = (inputDate: Date) => {
	return inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const getFormattedShortMonthDay = (inputDate: Date) => {
	return inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getCalendarMonth = (year: number, month: number, weeksInCalendar: number = 6) => {
	const calendar = [];
	// Create date at noon to avoid timezone issues
	const firstDayOfMonth = new Date(year, month, 1, 12, 0, 0);
	const dayOfWeek = firstDayOfMonth.getDay();
	const startDayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

	// Calculate the starting date (Monday of the first week)
	const startDate = firstDayOfMonth.getDate() - startDayOffset;

	for (let week = 0; week < weeksInCalendar; week++) {
		const days = [];
		for (let i = 0; i < 7; i++) {
			// 7 days per week - create each date at noon
			const dayNumber = startDate + (week * 7) + i;
			const newDate = new Date(year, month, dayNumber, 12, 0, 0);
			days.push(newDate);
		}
		calendar.push(days);
	}

	return calendar;
};

// TODO: Add a second, optional parameter in this function so that we can get X amount of days instead of only the surrounding week.
export const getAllDaysInWeekFromDate = (date: Date) => {
	const result: Date[] = [];
	const dayOfWeek = date.getDay(); // Get day of the week (0 is Sunday, 1 is Monday, etc.)
	const start = new Date(date); // Copy date to avoid mutating the original date

	// Adjust start date to the previous Monday
	start.setDate(start.getDate() - ((dayOfWeek + 6) % 7));

	// Loop for 7 days from the start date to get the full week
	for (let i = 0; i < 7; i++) {
		const day = new Date(start);
		day.setDate(day.getDate() + i);
		result.push(day);
	}

	return result;
};

export const getAllDaysInMonthFromDate = (date: Date) => {
	const result: Date[] = [];
	const year = date.getFullYear(); // Get the year of the date
	const month = date.getMonth(); // Get the month of the date (0-indexed)

	// Calculate the number of days in the month
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// Loop through all days of the month
	for (let day = 1; day <= daysInMonth; day++) {
		result.push(new Date(year, month, day));
	}

	return result;
};

export const getAllDaysInYearFromDate = (date: Date) => {
	const result: Date[] = [];
	const year = date.getFullYear(); // Get the year of the date

	// Loop through all months of the year
	for (let month = 0; month < 12; month++) {
		// Calculate the number of days in the month
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		// Loop through all days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			result.push(new Date(year, month, day));
		}
	}

	return result;
};

/**
 * Generates all dates between two dates inclusively.
 * @param {Date} startDate - The start date of the range.
 * @param {Date} endDate - The end date of the range.
 * @returns {Date[]} An array of all dates between the start and end date.
 */
export const getAllDaysInRange = (startDate: Date, endDate: Date) => {
	const dates = [];
	// Normalize to noon to avoid timezone issues
	const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 12, 0, 0);
	const normalizedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 12, 0, 0);

	while (currentDate <= normalizedEndDate) {
		dates.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
};

export const getAllDatesInYear = (year: number) => {
	const startDate = new Date(year, 0, 1); // January 1st (month is 0-indexed)
	const endDate = new Date(year, 11, 31); // December 31st
	const dates = [];

	for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
		dates.push(new Date(date)); // Add a new Date object to the array
	}

	return dates;
};

export const getDailyHourBlocks = () => {
	const hourBlocks: Record<string, { from: string; to: string; seconds: number }> = {};

	// Loop over each hour of the day
	for (let hour = 0; hour < 24; hour++) {
		// Format the hour to "HH:00" format
		const fromHour = `${hour.toString().padStart(2, '0')}:00`;
		const toHour = `${(hour + 1).toString().padStart(2, '0')}:00`;

		// Initialize each block with from, to, and seconds set to 0
		hourBlocks[fromHour] = {
			from: fromHour,
			to: toHour,
			seconds: 0,
		};
	}

	return hourBlocks;
};

export const convertTo12HourFormat = (hour24: string) => {
	// Convert the hour string to an integer
	const hour = parseInt(hour24.substring(0, 2), 10);

	// Determine AM or PM suffix
	const suffix = hour >= 12 ? 'PM' : 'AM';

	// Convert 24-hour time to 12-hour format
	const hour12 = hour % 12 === 0 ? 12 : hour % 12;

	// Return formatted string
	return `${hour12}:00 ${suffix}`;
};

export const getAllMonths = (date: Date) => {
    const months: Date[] = [];
    const year = date.getFullYear(); // Extract the year from the date
    const day = date.getDate(); // Extract the day from the date

    for (let month = 0; month < 12; month++) {
        // Handle cases where the day does not exist in the month by using the last day of the month
        const testDate = new Date(year, month + 1, 0); // Gets the last day of this month
        const finalDay = day > testDate.getDate() ? testDate.getDate() : day; // Use the smaller of the provided day or the last day of the month

        months.push(new Date(year, month, finalDay)); // Create the date with the final day
    }
    return months;
};

export const getFormattedDateAndTimeForFileName = () => {
	const now = new Date();

	const formattedDate = now.toLocaleDateString('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	})
	.replace(/,?/g, '')        // Remove commas
	.replace(/\s+/g, '_');     // Replace spaces with underscores

	const formattedTime = now.toLocaleTimeString('en-US', {
	hour: 'numeric',
	minute: '2-digit',
	hour12: true
	})
	.replace(':', '_')         // e.g. "2:44 PM" -> "2_44PM"
	.replace(/\s/g, '');       // Remove space before AM/PM

	return `${formattedDate}_${formattedTime}`
}

/**
 * Convert selected dates array to start/end date strings for API queries
 * @param selectedDates Array of dates from the date range picker
 * @returns Object with startDate and endDate as ISO strings (YYYY-MM-DD)
 */
export const getDateRangeFromSelectedDates = (selectedDates: Date[]) => {
	if (!selectedDates || selectedDates.length === 0) {
		return { startDate: null, endDate: null };
	}

	const startDate = selectedDates[0];
	const endDate = selectedDates[selectedDates.length - 1];

	return {
		startDate: getFormattedLongDay(startDate),
		endDate: getFormattedLongDay(endDate)
	};
};

// Helper function to format date as YYYY-MM-DD to match API format
export const formatDateAsAPIKey = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

// Helper function to format date string without timezone conversion
export const formatDateWithoutTimezone = (dateString: string): string => {
	// Parse YYYY-MM-DD format directly without timezone conversion
	const [year, month, day] = dateString.split('-').map(Number);
	const date = new Date(year, month - 1, day); // Month is 0-indexed
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};

export const parseDateRange = (rangeType: string, rangeValue: string) => {
  const parseMonthYear = (str: string) => {
    const [monthName, year] = str.split(" ");
    const month = new Date(`${monthName} 1, ${year}`).getMonth();
    return { month, year: parseInt(year) };
  };

  const parseWeek = (str: string) => {
    const [startStr, endStr] = str.split(" - ");
    return [new Date(startStr), new Date(endStr)];
  };

  switch (rangeType.toLowerCase()) {
    case "day": {
      const date = new Date(rangeValue);
      return { startDate: date, endDate: date };
    }

    case "week": {
      const [start, end] = parseWeek(rangeValue);
      return { startDate: start, endDate: end };
    }

    case "month": {
      const { month, year } = parseMonthYear(rangeValue);
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0); // last day of the month
      return { startDate, endDate };
    }

    case "year": {
      const year = parseInt(rangeValue);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      return { startDate, endDate };
    }

    default:
      throw new Error("Unsupported range type: " + rangeType);
  }
}

/**
 * Checks if a given date falls within the current year
 * @param date - The date to check
 * @returns boolean - true if the date is in the current year
 */
export const isCurrentYear = (date: Date): boolean => {
	const now = new Date();
	return date.getFullYear() === now.getFullYear();
};

/**
 * Checks if a given date falls within the current month and year
 * @param date - The date to check
 * @returns boolean - true if the date is in the current month
 */
export const isCurrentMonth = (date: Date): boolean => {
	const now = new Date();
	return (
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth()
	);
};

/**
 * Checks if a given date falls within the current week (Monday-Sunday)
 * Uses the same week calculation logic as getAllDaysInWeekFromDate
 * @param date - The date to check
 * @returns boolean - true if the date is in the current week
 */
export const isCurrentWeek = (date: Date): boolean => {
	const now = new Date();
	const currentWeekDays = getAllDaysInWeekFromDate(now);

	// Normalize dates to midnight for comparison
	const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	return currentWeekDays.some(weekDay => {
		const normalizedWeekDay = new Date(
			weekDay.getFullYear(),
			weekDay.getMonth(),
			weekDay.getDate()
		);
		return normalizedWeekDay.getTime() === normalizedDate.getTime();
	});
};

/**
 * Checks if a given date is today
 * @param date - The date to check
 * @returns boolean - true if the date is today
 */
export const isCurrentDay = (date: Date): boolean => {
	const now = new Date();
	return (
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate()
	);
};

/**
 * Gets the first day of the month for a given date
 * @param date - The date to get the first day for
 * @returns Date - First day of the month at noon
 */
export const getFirstDayOfMonth = (date: Date): Date => {
	return new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
};

/**
 * Gets the first day of the year for a given date
 * @param date - The date to get the first day for
 * @returns Date - First day of the year (January 1st) at noon
 */
export const getFirstDayOfYear = (date: Date): Date => {
	return new Date(date.getFullYear(), 0, 1, 12, 0, 0);
};

/**
 * Gets the first day (Monday) of the week for a given date
 * @param date - The date to get the first day for
 * @returns Date - Monday of the week containing the date
 */
export const getFirstDayOfWeek = (date: Date): Date => {
	const dayOfWeek = date.getDay();
	const start = new Date(date);
	// Adjust to Monday (same logic as getAllDaysInWeekFromDate)
	start.setDate(start.getDate() - ((dayOfWeek + 6) % 7));
	return start;
};

/**
 * Determines the smart date to use when changing intervals
 * If the current period represents "now" (current year/month/week/day),
 * navigate to the current date at the new granularity.
 * Otherwise, navigate to the start of the selected period.
 *
 * @param currentDate - The currently selected date
 * @param fromInterval - The interval we're switching from
 * @param toInterval - The interval we're switching to
 * @returns Date - The date to use for the new interval
 */
export const getSmartDateForIntervalChange = (
	currentDate: Date,
	fromInterval: string,
	toInterval: string
): Date => {
	const now = new Date();

	// Helper to check if we should use "current" date
	const shouldUseCurrentDate = (): boolean => {
		switch (fromInterval) {
			case 'Year':
				return isCurrentYear(currentDate);
			case 'Month':
				return isCurrentMonth(currentDate);
			case 'Week':
				return isCurrentWeek(currentDate);
			case 'Day':
				return isCurrentDay(currentDate);
			case 'All':
			case 'Custom':
				return true; // Always use current when coming from All/Custom
			default:
				return false;
		}
	};

	// If current period is "now", return today's date
	if (shouldUseCurrentDate()) {
		return now;
	}

	// Otherwise, return the start of the period at the new granularity
	switch (toInterval) {
		case 'Day':
			// When going to Day, use the first day of the previous period
			if (fromInterval === 'Week') {
				return getFirstDayOfWeek(currentDate);
			} else if (fromInterval === 'Month') {
				return getFirstDayOfMonth(currentDate);
			} else if (fromInterval === 'Year') {
				return getFirstDayOfYear(currentDate);
			}
			return currentDate;

		case 'Week':
			// When going to Week, use the first week of the previous period
			if (fromInterval === 'Month') {
				return getFirstDayOfMonth(currentDate);
			} else if (fromInterval === 'Year') {
				return getFirstDayOfYear(currentDate);
			}
			return currentDate;

		case 'Month':
			// When going to Month, use the first month of the previous period
			if (fromInterval === 'Year') {
				return getFirstDayOfYear(currentDate);
			}
			return currentDate;

		case 'Year':
		case 'All':
		case 'Custom':
			return currentDate;

		default:
			return currentDate;
	}
};