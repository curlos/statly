import { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import TimelineChart from './TimelineChart';

const TimelineCard = () => {
	const [selectedDates, setSelectedDates] = useState([new Date()]);

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[380px] sm:h-[350px]">
			<div className="flex flex-col sm:flex-row justify-between sm:items-center">
				<h3 className="font-bold text-[16px]">Timeline</h3>

				<DateRangePicker
					selectedDates={selectedDates}
					setSelectedDates={setSelectedDates}
					selectedInterval={'Week'}
				/>
			</div>

			<div className="mt-[-10px]">
				<TimelineChart {...{ selectedDates }} />
			</div>
		</div>
	);
};

export default TimelineCard;
