const ChosenMedal = ({ chosenMedal, maxHeight, chosenMedalRef }) => {
	if (!chosenMedal || Object.keys(chosenMedal).length === 0) {
		return null;
	}

	const { name, intervalsEarned, interval } = chosenMedal;

	const timesEarned = !intervalsEarned ? 0 : intervalsEarned.length;

	const getIntervalText = () => {
		switch (interval) {
			case 'daily':
				return 'day';
			case 'weekly':
				return 'week';
			case 'monthly':
				return 'month';
			case 'yearly':
				return 'year';
		}
	};

	const getIntervalsEarnedText = () => {
		switch (interval) {
			case 'daily':
				return 'Days';
			case 'weekly':
				return 'Weeks';
			case 'monthly':
				return 'Months';
			case 'yearly':
				return 'Years';
		}
	};

	const imgSrc =
		chosenMedal.requiredDuration !== undefined
			? '/Brusilovs_Star.webp'
			: '/Eternal_Order_of_the_Gladiator_Medal.webp';

	return (
		<div
			ref={chosenMedalRef}
			className="flex justify-center mt-5 overflow-auto gray-scrollbar"
			style={{ maxHeight }}
		>
			<div>
				<div className="flex justify-center mb-2">
					<img src={imgSrc} />
				</div>
				<div>
					<div className="text-[24px] md:text-[26px] font-bold bg-color-gray-200 px-2 sticky">
						{chosenMedal.name}
					</div>
					<div className="mt-2 space-y-1">
						<div className="text-[18px]">
							<span className="font-bold">Description: </span>
							{name} in a {getIntervalText()}
						</div>
						<div className="text-[18px]">
							<span className="font-bold">Times Earned: </span>
							{timesEarned.toLocaleString()}
						</div>
						{intervalsEarned && intervalsEarned.length > 0 && (
							<div className="text-[18px]">
								<span className="font-bold underline">{getIntervalsEarnedText()} Earned: </span>
								<ul className="pb-3">
									{intervalsEarned
										.toSorted((a, b) => {
											if (chosenMedal.interval !== 'weekly') {
												return new Date(b) - new Date(a);
											}

											// If it's weekly, split the strings into two since weekly shows both the start and end period. Grab the start period date and sort it by that.
											const startDateA = a.split(' - ')[0].trim();
											const startDateB = b.split(' - ')[0].trim();

											return new Date(startDateB) - new Date(startDateA);
										})
										?.map((interval) => {
											return (
												<li key={interval} className="list-disc ml-5">
													{interval}
												</li>
											);
										})}
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenMedal;
