interface MedalItemProps {
	name: string;
	imgSrc: string;
	isEarned: boolean;
}

const MedalItem = ({ name, imgSrc, isEarned }: MedalItemProps) => {
	return (
		<div key={name} className={`text-center ${!isEarned && 'opacity-30'}`}>
			<div className="flex justify-center">
				<img src={imgSrc} className="w-[125px]" />
			</div>
			<div className="text-center font-semibold text-[18px]">x1</div>
			<div className="text-center">{name}</div>
		</div>
	);
};

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

	// Separate medals into earned and unearned
	const earnedMedals = medals.filter((medal) => todayFocusDuration >= medal.requiredDuration);
	const unearnedMedals = medals.filter((medal) => todayFocusDuration < medal.requiredDuration);

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col min-h-[350px]">
			<h3 className="font-bold text-[16px]">Today's Action Report</h3>

			<div className="flex-1 flex flex-col justify-center gap-7 overflow-auto gray-scrollbar">
				<div className="grid grid-cols-3 text-[14px] sm:text-[16px] gap-2 mt-2">
					{earnedMedals.map((medal) => (
						<MedalItem key={medal.name} name={medal.name} imgSrc={medal.imgSrc} isEarned={true} />
					))}

					{unearnedMedals.map((medal) => (
						<MedalItem key={medal.name} name={medal.name} imgSrc={medal.imgSrc} isEarned={false} />
					))}
				</div>
			</div>
		</div>
	);
};

export default TodaysActionReport;
