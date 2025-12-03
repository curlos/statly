import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Icon from '../../components/Icon';
import { getFormattedDuration } from '../../utils/focus-apps/helpers.utils';
import { useState } from 'react';
import classNames from 'classnames';
import {
	getStreaksInfo,
	getFocusDataForDayInfo,
	getFilteredProjectsWithNames,
	getGoalSeconds,
	getStreakGoalDays,
} from '../../utils/focus.utils';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';

const defaultFocusData = {
	goalSeconds: getGoalSeconds(new Date()),
	totalFocusDurationForDay: 0,
	percentageOfFocusedGoalHours: 0,
};

const DailyHoursFocusGoal = ({ type = 'large' }) => {
	// const { data: fetchedFocusRecords } = useGetPomoAndStopwatchFocusRecordsQuery();
	// const { focusRecords, focusRecordsByDate } = fetchedFocusRecords || {};

	// // RTK Query - TickTick 1.0 - Projects
	// const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	// const { projectsById } = fetchedProjects || {};

	// // RTK Query - TickTick 1.0 - Tasks
	// const { data: fetchedTasks, isLoading: isLoadingGetTasks, error: errorGetTasks } = useGetAllTasksQuery();
	// const { tasksById } = fetchedTasks || {};

	const {
		focusHoursGoalPageSettings: { filteredProjects },
	} = useUserSettingsContext();

	// const streaksInfo =
	// 	focusRecords &&
	// 	projectsById &&
	// 	tasksById &&
	// 	filteredProjects &&
	// 	getStreaksInfo(focusRecords, getFilteredProjectsWithNames(filteredProjects, projectsById), tasksById);
	// const focusDataForTodayInfo =
	// 	focusRecordsByDate &&
	// 	projectsById &&
	// 	tasksById &&
	// 	filteredProjects &&
	// 	getFocusDataForDayInfo(
	// 		focusRecordsByDate,
	// 		new Date(),
	// 		getFilteredProjectsWithNames(filteredProjects, projectsById),
	// 		tasksById
	// 	);
	// const { goalSeconds, totalFocusDurationForDay, percentageOfFocusedGoalHours } =
	// 	focusDataForTodayInfo || defaultFocusData;

	// const [isModalHabitDetailsOpen, setIsModalHabitDetailsOpen] = useState(false);

	// const completedGoalForTheDay = percentageOfFocusedGoalHours >= 100;

	// const isLargeType = type === 'large';

	// const themeContext = useThemeContext();
	// const { chosenColorObj } = themeContext;

	return (
		<div>
			Placeholder. Must be replaced in the future.
		</div>
		// <div className={classNames(isLargeType ? 'w-[350px]' : 'w-[250px]')}>
		// 	<div
		// 		className="flex justify-end items-center text-orange-500 cursor-pointer"
		// 		onClick={() => setIsModalHabitDetailsOpen(true)}
		// 	>
		// 		<Icon
		// 			name="local_fire_department"
		// 			customClass={classNames(isLargeType ? '!text-[32px]' : '!text-[28px]')}
		// 		/>
		// 		<span className={classNames(isLargeType ? '!text-[20px]' : '!text-[18px]')}>
		// 			<span className={classNames(isLargeType ? '!text-[36px]' : '!text-[28px]', 'font-bold')}>
		// 				{streaksInfo?.currentStreak?.days || 0}
		// 			</span>
		// 			<span className="text-[24px]">/{getStreakGoalDays()}</span>
		// 		</span>
		// 	</div>
		// 	<CircularProgressbarWithChildren
		// 		value={percentageOfFocusedGoalHours}
		// 		strokeWidth={4}
		// 		styles={buildStyles({
		// 			textColor: '#4772F9',
		// 			pathColor: chosenColorObj.hexColor, // Red when overtime, otherwise original color
		// 			trailColor: '#3d3c3c',
		// 		})}
		// 		counterClockwise={false}
		// 	>
		// 		<div
		// 			className="text-white text-[40px] flex justify-center gap-4 w-[100%] select-none mb-[-10px]"
		// 			onMouseOver={() => {}}
		// 		>
		// 			<div
		// 				data-cy="timer-display"
		// 				className={classNames('text-center', isLargeType ? 'text-[32px]' : 'text-[24px]')}
		// 			>
		// 				<div className="mt-3">
		// 					<span className={classNames(isLargeType ? 'text-[48px]' : 'text-[36px]', 'font-[600]')}>
		// 						{getFormattedDuration(totalFocusDurationForDay, false)}
		// 					</span>
		// 					<span className="">/</span>
		// 					<span>{getFormattedDuration(goalSeconds, false)}</span>
		// 				</div>

		// 				<div
		// 					className={classNames(
		// 						isLargeType ? 'text-[22px]' : 'text-[20px]',
		// 						'mt-[-5px] text-color-gray-100'
		// 					)}
		// 				>
		// 					{Number(percentageOfFocusedGoalHours).toFixed(2)}%
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</CircularProgressbarWithChildren>
		// </div>
	);
};

export default DailyHoursFocusGoal;
