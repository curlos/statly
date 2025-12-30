import { useMemo } from "react";
import { getFormattedShortMonthDay, getAllDaysInWeekFromDate } from "../utils/date.utils";
import { useUserSettingsContext } from "../pages/focus-records/useUserSettingsContext";

const useGetDefaultDateRangeIntervalDates = () => {
	// Get medal settings
	const {
		defaultDateRangeInterval,
		defaultCustomStartDate,
		isLoadingGetUserSettings,
	} = useUserSettingsContext();

	const defaultMedalDates = useMemo(() => {
		if (isLoadingGetUserSettings) {
			return { startDate: '', endDate: '', dateInterval: '' };
		}

		const today = new Date();
		let startDate = '';
		let endDate = '';

		switch (defaultDateRangeInterval) {
			case 'Day':
				startDate = getFormattedShortMonthDay(today);
				endDate = getFormattedShortMonthDay(today);
				break;
			case 'Week': {
				const weekDates = getAllDaysInWeekFromDate(today);
				// Week: Monday to Sunday
				startDate = getFormattedShortMonthDay(weekDates[0]);
				endDate = getFormattedShortMonthDay(weekDates[6]);
				break;
			}
			case 'Month': {
				const year = today.getFullYear();
				const month = today.getMonth();
				// Month: First day to last day (at noon to avoid timezone issues)
				const firstDay = new Date(year, month, 1, 12, 0, 0);
				const lastDay = new Date(year, month + 1, 0, 12, 0, 0);
				startDate = getFormattedShortMonthDay(firstDay);
				endDate = getFormattedShortMonthDay(lastDay);
				break;
			}
			case 'Year': {
				const year = today.getFullYear();
				// Year: Jan 1 to Dec 31 (at noon to avoid timezone issues)
				const firstDay = new Date(year, 0, 1, 12, 0, 0);
				const lastDay = new Date(year, 11, 31, 12, 0, 0);
				startDate = getFormattedShortMonthDay(firstDay);
				endDate = getFormattedShortMonthDay(lastDay);
				break;
			}
			case 'Custom':
				if (defaultCustomStartDate && defaultCustomStartDate !== '') {
					startDate = getFormattedShortMonthDay(new Date(defaultCustomStartDate));
				}
				endDate = getFormattedShortMonthDay(today);
				break;
			case 'All':
			default:
				startDate = 'Jan 1, 1900';
				endDate = getFormattedShortMonthDay(today);
				break;
		}

		return { startDate, endDate, dateInterval: defaultDateRangeInterval };
	}, [isLoadingGetUserSettings, defaultDateRangeInterval, defaultCustomStartDate]);

	return defaultMedalDates;
}

export default useGetDefaultDateRangeIntervalDates