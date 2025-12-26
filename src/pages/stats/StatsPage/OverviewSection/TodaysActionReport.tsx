interface TodaysActionReportProps {
	todayFocusDuration: number;
}

const TodaysActionReport = ({ todayFocusDuration }: TodaysActionReportProps) => {

	const medals = [
		{
			name: 'Focus 6h+',
			requiredDuration: 21600,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1766765715/Statly/ticktick-badges/perserverance/VI.png',
		},
		{
			name: 'Focus 5h',
			requiredDuration: 18000,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1766765715/Statly/ticktick-badges/perserverance/V.png',
		},
		{
			name: 'Focus 4h',
			requiredDuration: 14400,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1766765553/Statly/ticktick-badges/perserverance/IV.png',
		},
		{
			name: 'Focus 3h',
			requiredDuration: 10800,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1766765552/Statly/ticktick-badges/perserverance/III.png',
		},
		{
			name: 'Focus 2h',
			requiredDuration: 7200,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1766768308/II_wnswlk.png',
		},
		{
			name: 'Focus 1h',
			requiredDuration: 3600,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1766765552/Statly/ticktick-badges/perserverance/I.png',
		},
	];

	// Check if any medals have been earned
	const earnedMedals = medals.filter((medal) => todayFocusDuration >= medal.requiredDuration);
	const hasEarnedMedals = earnedMedals.length > 0;

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col min-h-[350px]">
			<h3 className="font-bold text-[16px]">Today's Action Report</h3>

			<div className="flex-1 flex flex-col justify-center gap-7 overflow-auto gray-scrollbar">
				{!hasEarnedMedals ? (
					<div className="flex items-center justify-center h-full text-center text-color-gray-100">
						<p>No medals earned yet today. Keep focusing to unlock your first medal!</p>
					</div>
				) : (
					<div className="grid grid-cols-3 text-[14px] sm:text-[16px] gap-2 mt-2">
						{medals.map((medal) => {
							const { name, requiredDuration, imgSrc } = medal;

							if (todayFocusDuration < requiredDuration) {
								return null;
							}

							return (
								<div key={name} className="text-center">
									<div className="flex justify-center">
										<img src={imgSrc} className="w-[125px]" />
									</div>
									<div className="text-center font-semibold text-[18px]">x1</div>
									<div className="text-center">{name}</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default TodaysActionReport;
