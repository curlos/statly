import { getFocusRecordProperty } from "./focus-apps/multiFocusApps.utils";

export const setTimeOnDateString = (dateString, timeString) => {
	// Parse the existing date string to get a Date object
	const date = new Date(dateString);

	// Function to check if the date is in DST for Eastern Time
	const isDST = (date) => {
		const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
		const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
		return date.getTimezoneOffset() < Math.max(jan, jul);
	};

	if (timeString) {
		// Extract hours and minutes from the time string (formatted as "HH:mm AM/PM")
		const [time, period] = timeString.split(' ');
		let [hours, minutes] = time.split(':');
		hours = parseInt(hours);
		minutes = parseInt(minutes);

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

export const getTimeString = (dateToUse) => {
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

export const formatDateTime = (dateTimeStr) => {
	const date = new Date(dateTimeStr);

	// Extracting hours and minutes for the time without leading zeros
	const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
	const time = date.toLocaleTimeString('en-US', optionsTime);

	// Extracting the day and month for the date
	const optionsDate = { month: 'long', day: 'numeric' };
	const day = date.toLocaleDateString('en-US', optionsDate);

	return { time, day };
};

export const groupTasksByDate = (tasks) => {
	const grouped = {};

	tasks.forEach((task) => {
		const associatedTaskTime = getAssociatedTimeForTask(task);

		if (!associatedTaskTime) {
			return;
		}

		const taskTime = new Date(associatedTaskTime.value);
		const day = taskTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

		// Initialize the array if it does not already exist
		if (!grouped[day]) {
			grouped[day] = [];
		}

		// Push the current record into the correct day array
		grouped[day].push(task);
	});

	// Create an array from the grouped object and sort it by date
	const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
	const sortedGrouped = {};
	sortedKeys.forEach((key) => {
		sortedGrouped[key] = grouped[key];
	});

	return sortedGrouped;
};

export const getAssociatedTimeForTask = (task) => {
	if (task['completedTime']) {
		return {
			key: 'completedTime',
			value: task['completedTime'],
		};
	} else if (task['willNotDo']) {
		return {
			key: 'willNotDo',
			value: task['willNotDo'],
		};
	} else if (task['isDeleted']) {
		return {
			key: 'isDeleted',
			value: task['isDeleted'],
		};
	} else if (task['dueDate']) {
		return {
			key: 'dueDate',
			value: task['dueDate'],
		};
	}

	return null;
};

export const getLast7Days = () => {
	let result = [];

	for (let i = 0; i < 7; i++) {
		const date = new Date(); // Get today's date
		date.setDate(date.getDate() - i); // Subtract `i` days from today
		result.push(date); // Format the date as "YYYY-MM-DD" and add to the result array
	}

	return result.reverse(); // Reverse the array to start from 7 days ago to today
};

export const getLast7Weeks = () => {
	let result = [];

	for (let i = 0; i < 7; i++) {
		let week = [];
		for (let j = 0; j < 7; j++) {
			// Get each day of the week
			const date = new Date();
			date.setDate(date.getDate() - (i * 7 + j)); // Subtract `i * 7 + j` days to get each day of the week
			week.push(new Date(date)); // Add the date to the current week
		}
		result.push(week); // Add the week to the result array
	}

	return result.reverse(); // Reverse to start from 7 weeks ago to today
};

export const getLast7Months = () => {
	let result = [];

	for (let i = 0; i < 7; i++) {
		let month = [];
		const today = new Date();
		const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1); // Start at the 1st of the month

		// Loop through all days in the current month
		while (monthDate.getMonth() === (today.getMonth() - i + 12) % 12) {
			month.push(new Date(monthDate)); // Add the day to the current month array
			monthDate.setDate(monthDate.getDate() + 1); // Go to the next day
		}

		result.push(month); // Add the month to the result array
	}

	return result.reverse(); // Reverse to start from 7 months ago to this month
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

export const formatCheckedInDayDate = (inputDate) => {
	return inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const getFormattedLongDay = (inputDate) => {
	return inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const getFormattedShortMonthDay = (inputDate) => {
	return inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getCalendarMonth = (year, month, weeksInCalendar = 6) => {
	const calendar = [];
	const firstDayOfMonth = new Date(year, month, 1);
	const currentDay = new Date(firstDayOfMonth);
	const dayOfWeek = currentDay.getDay();
	currentDay.setDate(currentDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

	for (let week = 0; week < weeksInCalendar; week++) {
		const days = [];
		for (let i = 0; i < 7; i++) {
			// 7 days per week
			days.push(new Date(currentDay));
			currentDay.setDate(currentDay.getDate() + 1);
		}
		calendar.push(days);
	}

	return calendar;
};

// TODO: Add a second, optional parameter in this function so that we can get X amount of days instead of only the surrounding week.
export const getAllDaysInWeekFromDate = (date) => {
	let result = [];
	let dayOfWeek = date.getDay(); // Get day of the week (0 is Sunday, 1 is Monday, etc.)
	let start = new Date(date); // Copy date to avoid mutating the original date
	let end = new Date(date);

	// Adjust start date to the previous Monday
	start.setDate(start.getDate() - ((dayOfWeek + 6) % 7));

	// Loop for 7 days from the start date to get the full week
	for (let i = 0; i < 7; i++) {
		let day = new Date(start);
		day.setDate(day.getDate() + i);
		result.push(day);
	}

	return result;
};

export const getAllDaysInMonthFromDate = (date) => {
	let result = [];
	let year = date.getFullYear(); // Get the year of the date
	let month = date.getMonth(); // Get the month of the date (0-indexed)

	// Calculate the number of days in the month
	let daysInMonth = new Date(year, month + 1, 0).getDate();

	// Loop through all days of the month
	for (let day = 1; day <= daysInMonth; day++) {
		result.push(new Date(year, month, day));
	}

	return result;
};

export const getAllDaysInYearFromDate = (date) => {
	let result = [];
	let year = date.getFullYear(); // Get the year of the date

	// Loop through all months of the year
	for (let month = 0; month < 12; month++) {
		// Calculate the number of days in the month
		let daysInMonth = new Date(year, month + 1, 0).getDate();

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
export const getAllDaysInRange = (startDate, endDate) => {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
};

export const getAllDatesInYear = (year) => {
	const startDate = new Date(`${year}-01-02`); // Start of the year
	const endDate = new Date(`${year}-12-31`); // End of the year
	const dates = [];

	for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
		dates.push(new Date(date)); // Add a new Date object to the array
	}

	return dates;
};

export const sortArrayByProperty = (array, property, type = 'descending') => {
	// Create a deep copy of the array to avoid modifying the original
	const arrayCopy = array.map((item) => ({ ...item }));

	if (type === 'descending') {
		return arrayCopy.sort((a, b) => new Date(b[property]) - new Date(a[property]));
	}

	return arrayCopy.sort((a, b) => new Date(a[property]) - new Date(b[property]));
};

export const sortObjectByDateKeys = (data) => {
	// Create an array from the object keys and sort it based on the date
	const sortedKeys = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));

	// Create a new object with keys ordered by date
	const sortedObject = {};
	sortedKeys.forEach((key) => {
		sortedObject[key] = data[key];
	});

	return sortedObject;
};

export const isTimeBetween = (targetDate, startDate, endDate, offsetMinutes = 10) => {
	// Convert offset minutes to milliseconds
	const offsetMilliseconds = offsetMinutes * 60 * 1000;

	// Get the time in milliseconds since the epoch for each date
	const targetTime = targetDate.getTime();
	const startTime = startDate.getTime() - offsetMilliseconds; // Apply offset to start time
	const endTime = endDate.getTime() + offsetMilliseconds; // Apply offset to end time

	// Check if the target time in milliseconds is between the adjusted start and end times
	return targetTime >= startTime && targetTime <= endTime;
};

export const isDateBetween = (targetDate, startDate, endDate) => {
	// Remove the time part of each date
	const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
	const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

	// Check if the target date is between the start and end dates (inclusive)
	return target >= start && target <= end;
};

export const getTimeSince = (date) => {
	const now = new Date(); // Current date and time
	const past = new Date(date); // Convert the input date to a Date object
	if (isNaN(past.getTime())) {
		return 'Invalid date'; // Check if the input date is valid
	}

	const seconds = Math.floor((now - past) / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30); // Approximation
	const years = Math.floor(days / 365);

	return {
		seconds: seconds,
		minutes: minutes,
		hours: hours,
		days: days,
		months: months,
		years: years,
	};
};

export const getTimeInBlocks = (startTime, endTime) => {
	// Parse timestamps
	const start = new Date(startTime);
	const end = new Date(endTime);

	// Normalize the start time to the start of the hour
	const startHour = new Date(start);
	startHour.setMinutes(0, 0, 0);

	const results = [];

	// Loop over each hour block from startHour until end
	while (startHour <= end) {
		const nextHour = new Date(startHour);
		nextHour.setHours(nextHour.getHours() + 1);

		// Calculate the overlap of the current hour block with the [start, end] interval
		const overlapStart = startHour < start ? start : startHour;
		const overlapEnd = nextHour > end ? end : nextHour;

		// Calculate seconds in the current block, if any
		if (overlapStart < overlapEnd) {
			const duration = (overlapEnd - overlapStart) / 1000; // convert milliseconds to seconds
			results.push({
				from: `${startHour.getHours().toString().padStart(2, '0')}:00`,
				to: `${nextHour.getHours().toString().padStart(2, '0')}:00`,
				seconds: duration,
			});
		}

		// Move to the next hour block
		startHour.setHours(startHour.getHours() + 1);
	}

	return results;
};

export const getDailyHourBlocks = () => {
	const hourBlocks = {};

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

export const fillInHourBlocksWithSeconds = (focusRecords, newDailyHourBlocks) => {
	for (let focusRecord of focusRecords) {
		const { tasks } = focusRecord;
		
		// TickTick - Only use the "tasks" Focus Records
		if (tasks?.length > 0) {
			for (let task of tasks) {
				const { startTime, endTime } = task;
				const timeInBlocks = getTimeInBlocks(startTime, endTime);

				for (let timeBlock of timeInBlocks) {
					const { from, seconds } = timeBlock;

					newDailyHourBlocks[from].seconds += seconds;
				}
			}
		} else {
			// Handles: TickTick Focus Records without a task, Session App, Forest, Be Focused, Tide.
			const startTime = getFocusRecordProperty(focusRecord, 'startTime')
			const endTime = getFocusRecordProperty(focusRecord, 'endTime')

			const timeInBlocks = getTimeInBlocks(startTime, endTime);

			for (let timeBlock of timeInBlocks) {
				const { from, seconds } = timeBlock;

				newDailyHourBlocks[from].seconds += seconds;
			}
		}
	}
};

export const convertTo12HourFormat = (hour24) => {
	// Convert the hour string to an integer
	const hour = parseInt(hour24.substring(0, 2), 10);

	// Determine AM or PM suffix
	const suffix = hour >= 12 ? 'PM' : 'AM';

	// Convert 24-hour time to 12-hour format
	const hour12 = hour % 12 === 0 ? 12 : hour % 12;

	// Return formatted string
	return `${hour12}:00 ${suffix}`;
};

function getStartOfWeek(d) {
	const date = new Date(d);
	const day = date.getDay();
	const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
	return new Date(date.setDate(diff));
}

export const groupDatesByInterval = (dates, interval) => {
	const grouped = {};

	dates.forEach((dateObj) => {
		let key;
		const d = new Date(dateObj);

		switch (interval) {
			case 'Days':
				key = getFormattedShortMonthDay(d);
				break;
			case 'Weeks':
				key = getFormattedShortMonthDay(getStartOfWeek(d));
				break;
			case 'Months':
				key = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
				break;
			default:
				throw new Error('Invalid grouping option. Use "days", "weeks", or "months".');
		}

		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(dateObj);
	});

	return grouped;
};

export const getDateMapSinceDay = (startDateStr) => {
	const startDate = new Date(startDateStr);
	const currentDate = new Date();
	const oneDay = 1000 * 60 * 60 * 24; // milliseconds in a day
	const dateMap = {};

	for (let date = startDate; date <= currentDate; date = new Date(date.getTime() + oneDay)) {
		const dateString = date.toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		});
		dateMap[dateString] = 0;
	}

	return dateMap;
};

export const getDayString = (date) => {
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const dayOfWeek = daysOfWeek[date.getDay()];
	return dayOfWeek;
};

export const getAllMonths = (date) => {
    let months = [];
    const year = date.getFullYear(); // Extract the year from the date
    const day = date.getDate(); // Extract the day from the date

    for (let month = 0; month < 12; month++) {
        // Handle cases where the day does not exist in the month by using the last day of the month
        let testDate = new Date(year, month + 1, 0); // Gets the last day of this month
        let finalDay = day > testDate.getDate() ? testDate.getDate() : day; // Use the smaller of the provided day or the last day of the month
        
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