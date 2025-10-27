import classNames from 'classnames';
import { useState, useEffect } from 'react';
import Icon from '../../../../components/Icon';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useStatsContext } from '../../../../contexts/useStatsContext';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import {
	getAllDaysInWeekFromDate,
	getAllDaysInMonthFromDate,
	getAllDaysInYearFromDate,
} from '../../../../utils/date.utils';

const OverviewCard = () => {
	const {
		allCompletedTasks,
		getCompletedTasksFromSelectedDates,
		filteredDaysWithCompletedTasks,
		total: { numOfCompletedTasks },
	} = useStatsContext() || {};
	const [numOfCompletedTasksForInterval, setNumOfCompletedTasksForInterval] = useState(0);
	const [diffOfCompletedTasksFromPrevInterval, setDiffOfCompletedTasksFromPrevInterval] = useState({
		numDiff: 0,
		lessThanPrev: false,
	});

	const { searchParams } = useSearchParamsContext();

	const startDateFromUrl = searchParams.get('start-date') || 'Jan 1, 1900';
	const endDateFromUrl = searchParams.get('end-date') || '';
	const intervalFromUrl = searchParams.get('date-interval') || 'All';

	useEffect(() => {
		if (!filteredDaysWithCompletedTasks) {
			return;
		}

		if (!intervalFromUrl) {
			setNumOfCompletedTasksForInterval(allCompletedTasks.length);
		} else {
			const prevIntervalDates = getPrevIntervalDates();
			const prevIntervalCompletedTasks = getCompletedTasksFromSelectedDates(prevIntervalDates).length;
			const currIntervalCompletedTasks = numOfCompletedTasks;

			setNumOfCompletedTasksForInterval(currIntervalCompletedTasks);
			setDiffOfCompletedTasksFromPrevInterval({
				numDiff: Math.abs(currIntervalCompletedTasks - prevIntervalCompletedTasks),
				lessThanPrev: currIntervalCompletedTasks < prevIntervalCompletedTasks,
			});
		}
	}, [startDateFromUrl, endDateFromUrl, intervalFromUrl, filteredDaysWithCompletedTasks]);

	const getPrevIntervalDates = () => {
		const date = new Date(startDateFromUrl);

		switch (intervalFromUrl) {
			case 'Day':
				date.setDate(date.getDate() - 1);
				return [date];
			case 'Week':
				date.setDate(date.getDate() - 7);
				return getAllDaysInWeekFromDate(date);
			case 'Month':
				date.setMonth(date.getMonth() + -1);
				return getAllDaysInMonthFromDate(date);
			case 'Year':
				date.setFullYear(date.getFullYear() + -1);
				return getAllDaysInYearFromDate(date);
			default:
				return [];
		}
	};

	const getPrevIntervalName = () => {
		switch (intervalFromUrl) {
			case 'Day':
				return 'yesterday';
			case 'Week':
				return 'last week';
			case 'Month':
				return 'last month';
			case 'Year':
				return 'last year';
		}
	};

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	return (
		<div className="bg-color-gray-600 p-3 rounded-lg flex flex-col h-[280px]">
			<h3 className="font-bold text-[16px]">Overview</h3>

			<div className="flex-1 flex flex-col justify-center gap-7">
				<div className="grid grid-cols-1 w-full">
					<div className="flex flex-col items-center p-2">
						<div className={classNames(chosenColorObj.textColor, 'font-bold text-[24px]')}>
							{numOfCompletedTasks.toLocaleString()}
						</div>
						<div className="text-color-gray-100 font-medium">
							{numOfCompletedTasks > 1 ? 'Completed Tasks' : 'Completed Task'}
						</div>
						{intervalFromUrl !== 'All' && intervalFromUrl !== 'Custom' && (
							<div className="text-color-gray-100 flex items-center gap-1">
								<div>
									{diffOfCompletedTasksFromPrevInterval.numDiff} from {getPrevIntervalName()}
								</div>
								<Icon
									name={
										diffOfCompletedTasksFromPrevInterval.lessThanPrev
											? 'arrow_downward'
											: 'arrow_upward'
									}
									fill={1}
									customClass={classNames(
										'!text-[18px]',
										diffOfCompletedTasksFromPrevInterval.lessThanPrev
											? 'text-red-500'
											: 'text-emerald-500'
									)}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewCard;
