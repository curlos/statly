interface TodaysActionReportProps {
	todayFocusDuration: number;
}

const TodaysActionReport = ({ todayFocusDuration }: TodaysActionReportProps) => {

	const medals = [
		{
			name: 'Focus 7h+',
			requiredDuration: 25200,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/462_VDC3XrD.webp',
		},
		{
			name: 'Focus 6h',
			requiredDuration: 21600,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007844/Statly/black-ops-2-killstreak-medals/killstreaks/461_q3kMqll.webp',
		},
		{
			name: 'Focus 5h',
			requiredDuration: 18000,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/460_tFa0En4.webp',
		},
		{
			name: 'Focus 4h',
			requiredDuration: 14400,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/459_AcWOa0g.webp',
		},
		{
			name: 'Focus 3h',
			requiredDuration: 10800,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/458_H5znivp.webp',
		},
		{
			name: 'Focus 2h',
			requiredDuration: 7200,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/457_hsZCur7.webp',
		},
		{
			name: 'Focus 1h',
			requiredDuration: 3600,
			imgSrc: 'https://res.cloudinary.com/dvsuz3v37/image/upload/v1762007843/Statly/black-ops-2-killstreak-medals/killstreaks/456_59UYHck.webp',
		},
	];

	// Check if any medals have been earned
	const earnedMedals = medals.filter((medal) => todayFocusDuration >= medal.requiredDuration);
	const hasEarnedMedals = earnedMedals.length > 0;

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[350px]">
			<h3 className="font-bold text-[16px]">Today's Action Report</h3>

			<div className="flex-1 flex flex-col justify-center gap-7 overflow-auto gray-scrollbar">
				{!hasEarnedMedals ? (
					<div className="flex items-center justify-center h-full text-center text-color-gray-100">
						<p>No medals earned yet today. Keep focusing to unlock your first medal!</p>
					</div>
				) : (
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
				)}
			</div>
		</div>
	);
};

export default TodaysActionReport;
