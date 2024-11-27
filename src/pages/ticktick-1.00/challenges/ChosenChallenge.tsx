const ChosenChallenge = ({ chosenChallenge, maxHeight, chosenChallengeRef }) => {
	if (!chosenChallenge || Object.keys(chosenChallenge).length === 0) {
		return null;
	}

	const { name, completedDate } = chosenChallenge;

	const imgSrc =
		chosenChallenge.requiredDuration !== undefined
			? 'https://i.imgur.com/6xLKg5k.jpeg'
			: 'https://i.imgur.com/x084PtQ.png';

	return (
		<div
			ref={chosenChallengeRef}
			className="flex justify-center mt-5 overflow-auto gray-scrollbar"
			style={{ maxHeight }}
		>
			<div>
				<div className="flex justify-center mb-2">
					<img src={imgSrc} />
				</div>
				<div>
					<div className="text-[20px] md:text-[24px] font-bold bg-color-gray-200 px-2 sticky">{name}</div>
					<div className="mt-2 space-y-1">
						<div className="text-[16px] md:text-[18px]">
							<span className="font-bold">Description: </span>
							{name} in total
						</div>
						<div className="text-[16px] md:text-[18px]">
							<span className="font-bold">Completion Date: </span>
							{completedDate ? completedDate : 'N/A'}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenChallenge;
