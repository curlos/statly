import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getFormattedLongDay } from '../../../../utils/date.utils';
import { useGetFocusStatsQuery } from '../../../../services/resources/documentsStatsApi';
import { useStatsQueryParams } from '../../../../hooks/useStatsQueryParams';

const TodaysActionReport = () => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor } = chosenColorObj;

	// Get today's date
	const today = new Date();
	const todayDateKey = getFormattedLongDay(today);

	// Build query params for today's focus stats
	const todayFocusQueryParams = useStatsQueryParams({
		'group-by': 'day',
		'interval-start-date': todayDateKey,
		'interval-end-date': todayDateKey,
	});

	// Fetch today's focus stats
	const { data: todayFocusStats } = useGetFocusStatsQuery(todayFocusQueryParams);

	// Extract today's focus duration
	const todayFocusData = todayFocusStats?.byDay?.[0] || { duration: 0 };
	const todayFocusDuration = todayFocusData.duration;

	const medals = [
		{
			name: 'Focus 7 Hours Or More',
			requiredDuration: 25200,
			imgSrc: 'https://i.imgur.com/VDC3XrD.png',
		},
		{
			name: 'Focus 6 Hours',
			requiredDuration: 21600,
			imgSrc: 'https://i.imgur.com/q3kMqll.png',
		},
		{
			name: 'Focus 5 Hours',
			requiredDuration: 18000,
			imgSrc: 'https://i.imgur.com/tFa0En4.png',
		},
		{
			name: 'Focus 4 Hours',
			requiredDuration: 14400,
			imgSrc: 'https://i.imgur.com/AcWOa0g.png',
		},
		{
			name: 'Focus 3 Hours',
			requiredDuration: 10800,
			imgSrc: 'https://i.imgur.com/H5znivp.png',
		},
		{
			name: 'Focus 2 Hours',
			requiredDuration: 7200,
			imgSrc: 'https://i.imgur.com/hsZCur7.png',
		},
		{
			name: 'Focus 1 Hour',
			requiredDuration: 3600,
			imgSrc: 'https://i.imgur.com/59UYHck.png',
		},
	];

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<h3 className="font-bold text-[16px]">Today's Action Report</h3>

			<div className="flex-1 flex flex-col justify-center gap-7 overflow-auto gray-scrollbar">
				<div className="flex flex-wrap justify-center w-full h-full text-[14px] sm:text-[16px]">
					{medals.map((medal) => {
						const { name, requiredDuration, imgSrc } = medal;

						if (todayFocusDuration < requiredDuration) {
							return null;
						}

						return (
							<div key={name}>
								<img src={imgSrc} className="w-[150px]" />
								<div className="text-center font-semibold text-[18px]">x1</div>
								<div className="text-center font-semibold">{name}</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default TodaysActionReport;
