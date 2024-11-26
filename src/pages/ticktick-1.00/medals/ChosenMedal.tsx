const ChosenMedal = ({ chosenMedal }) => {
	const getIntervalText = () => {
		if (location.pathname.includes('daily')) {
			return 'day';
		} else if (location.pathname.includes('weekly')) {
			return 'week';
		} else if (location.pathname.includes('monthly')) {
			return 'month';
		} else if (location.pathname.includes('yearly')) {
			return 'year';
		}
	};

	return (
		<div className="flex justify-center mt-5">
			<div>
				<div className="flex justify-center">
					<img src="/Backfire_Medal_IW.webp" />
				</div>
				<div>
					<div className="text-[26px] font-bold bg-color-gray-200 px-2">{chosenMedal.name}</div>
					<div className="text-[18px]">
						<span className="font-bold">Times Earned: </span>
						{chosenMedal.timesEarned.toLocaleString()}
					</div>
					<div className="text-[18px]">
						<span className="font-bold">Description: </span>
						{chosenMedal.name} in a {getIntervalText()}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenMedal;
