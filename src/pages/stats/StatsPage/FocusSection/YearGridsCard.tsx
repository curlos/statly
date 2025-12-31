import { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import CalendarHeatmap from './CalendarHeatmap';
import Spinner from '../../../../components/Loaders/Spinner';
import { getFormattedLongDay } from '../../../../utils/date.utils';
import { useGetFocusStatsQuery } from '../../../../services/resources/statsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';
import { useApplyDefaultDateRangeContext } from '../../../../contexts/useApplyDefaultDateRangeContext';

const YearGridsCard = () => {
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	// Get year's date range
	const year = selectedDates[0].getFullYear();
	const yearStart = new Date(year, 0, 1); // January 1st
	const yearEnd = new Date(year, 11, 31); // December 31st
	const yearStartDate = getFormattedLongDay(yearStart);
	const yearEndDate = getFormattedLongDay(yearEnd);

	// Build query params for API using custom hook
	const queryParams = useStatsQueryParams({
		'group-by': 'day',
		'interval-start-date': yearStartDate,
		'interval-end-date': yearEndDate,
	});

	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();

	// Fetch stats from API
	const { data: statsData, isLoading, isFetching } = useGetFocusStatsQuery(queryParams, {
		skip: shouldSkipQuery
	});

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col sm:h-[350px]">
			<div className="flex justify-between items-center mb-2">
				<div className="flex items-center gap-2">
					<h3 className="font-bold text-[16px]">Year Grids</h3>
					{(isLoading || isFetching) && <Spinner size="md" />}
				</div>

				<DateRangePicker
					selectedDates={selectedDates}
					setSelectedDates={setSelectedDates}
					selectedInterval={'Year'}
				/>
			</div>

			<CalendarHeatmap selectedDates={selectedDates} statsData={statsData} />
		</div>
	);
};

export default YearGridsCard;
