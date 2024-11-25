import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import { useStatsContext } from '../../../contexts/useStatsContext';
import { getFocusDurationFromArray } from '../../../utils/focus-apps/focusRecords.utils';
import { DEFAULT_DAILY_FOCUS_HOURS_MEDALS } from '../../../utils/constants.utils';
import { useThemeContext } from '../../../contexts/useThemeContext';
import classNames from 'classnames';

const Page = () => {
	const { focusRecordsGroupedByDate } = useStatsContext();

	const [focusDurationByDate, setFocusDurationByDate] = useState({});
	const [dailyFocusHoursMedals, setDailyFocusHoursMedals] = useState(DEFAULT_DAILY_FOCUS_HOURS_MEDALS);

	const [chosenMedal, setChosenMedal] = useState(DEFAULT_DAILY_FOCUS_HOURS_MEDALS[0]);

	useEffect(() => {
		if (!focusRecordsGroupedByDate) {
			return;
		}

		const newFocusDurationByDate = {};
		const newDailyFocusHoursMedals = JSON.parse(JSON.stringify(DEFAULT_DAILY_FOCUS_HOURS_MEDALS));

		Object.entries(focusRecordsGroupedByDate).forEach(([dateKey, focusRecords]) => {
			newFocusDurationByDate[dateKey] = getFocusDurationFromArray(focusRecords);
		});

		Object.entries(newFocusDurationByDate).forEach(([dateKey, focusDurationForDay]) => {
			newDailyFocusHoursMedals.forEach((dailyFocusHourMedal) => {
				const { requiredDuration } = dailyFocusHourMedal;

				if (focusDurationForDay >= requiredDuration) {
					dailyFocusHourMedal.timesEarned += 1;
				}
			});
		});

		console.log(newDailyFocusHoursMedals);

		setFocusDurationByDate(newFocusDurationByDate);
		setDailyFocusHoursMedals(newDailyFocusHoursMedals);
	}, [focusRecordsGroupedByDate]);

	return (
		<div>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<Navbar />

				<div className="container text-[28px] font-bold">Medals</div>

				<div className="grid grid-cols-12 container">
					<div className="col-span-8 grid grid-cols-4 gap-2 max-h-[700px] overflow-auto gray-scrollbar">
						{focusDurationByDate &&
							Object.keys(focusDurationByDate).length > 0 &&
							dailyFocusHoursMedals.map((dailyFocusMedal) => {
								return <MedalCard {...{ medal: dailyFocusMedal, chosenMedal, setChosenMedal }} />;
							})}
					</div>

					<div className="col-span-4">
						<div className="flex justify-center mt-5">
							<div>
								<div className="flex justify-center">
									<img src="/Backfire_Medal_IW.webp" />
								</div>
								<div>
									<div className="text-[26px] font-bold bg-color-gray-200 px-2">
										{chosenMedal.name}
									</div>
									<div className="text-[18px]">
										<span className="font-bold">Times Earned: </span>
										{chosenMedal.timesEarned.toLocaleString()}
									</div>
									<div className="text-[18px]">
										<span className="font-bold">Description: </span>
										{chosenMedal.name} in a day
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const MedalCard = ({ medal, chosenMedal, setChosenMedal }) => {
	const { name = 'Focus 5 Hours', imageSrc = '/Backfire_Medal_IW.webp', timesEarned = 'x361' } = medal;

	const { chosenColorObj } = useThemeContext();

	return (
		<div
			className={classNames(
				'bg-color-gray-600 border cursor-pointer',
				chosenColorObj.hover.borderColor,
				chosenMedal.name === name ? chosenColorObj.borderColor : 'border-[transparent]'
			)}
			onClick={() => setChosenMedal(medal)}
		>
			<div className="bg-color-gray-150 border-l-[5px] border-white pl-1 font-semibold">{name}</div>
			<img src={imageSrc} className="w-[200px]" />
			<div className="flex justify-end px-2 text-[18px] font-bold">x{timesEarned.toLocaleString()}</div>
		</div>
	);
};

export default Page;
