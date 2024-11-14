import ReactMarkdown from 'react-markdown';
import {
	formatDateTime,
	getFormattedLongDay,
	getFormattedShortMonthDay,
	isTimeBetween,
} from '../../../utils/date.utils';
import { getFocusDuration, getFormattedDuration } from '../../../utils/helpers.utils';
import Icon from '../../../components/Icon';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';

const FocusRecord = ({
	focusRecord,
	showSubtaskTime = true,
	isLastItemForTheDay = false,
	focusDuration,
	showCompletedTasks,
}) => {
	const { updateQueryParams } = useSearchParamsContext();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { completedTasksGroupedByDate } = fetchedTasks || {};

	const { note, startTime, endTime, tasks } = focusRecord;

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);
	const duration = focusDuration ? focusDuration : getFocusDuration(focusRecord);

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor } = chosenColorObj;

	const getAllCompletedTasksDuringFocusRecord = () => {
		if (!completedTasksGroupedByDate) {
			return [];
		}

		const startTimeDate = new Date(startTime);
		const endTimeDate = new Date(endTime);
		const startTimeKey = getFormattedLongDay(startTimeDate);
		const endTimeKey = getFormattedLongDay(endTimeDate);
		const startAndEndTimeHappenedOnSameDay = startTimeKey === endTimeKey;

		let completedTasksDuringFocusSession = [];

		const completedTasksInStartTimeDay = completedTasksGroupedByDate[startTimeKey];

		completedTasksDuringFocusSession = getCompletedTasksBetweenTimes(
			completedTasksInStartTimeDay,
			startTimeDate,
			endTimeDate
		);

		// I would think this scenario is very rare since I don't work at midnight anymore but basically if the start and end times were to happen on different days (September 13, 2024 11:05PM to September 14, 2024 1:12AM), then you need to grab the completed tasks for the end time's date as well.
		// TODO: Should be possible to actually test this when I bring over the focus records from 2021 and early 2022 since I did do a lot of work at midnight back then so the start and end time's would be different. Test this out after bringing over the records from back then.
		if (!startAndEndTimeHappenedOnSameDay) {
			const completedTasksInEndTimeDay = completedTasksGroupedByDate[endTimeKey];

			if (completedTasksInEndTimeDay) {
				completedTasksDuringFocusSession.push(
					...getCompletedTasksBetweenTimes(completedTasksInEndTimeDay, startTimeDate, endTimeDate)
				);
			}
		}

		return completedTasksDuringFocusSession;
	};

	const getCompletedTasksBetweenTimes = (completedTasksInTimeDay, startTimeDate, endTimeDate) => {
		if (!completedTasksInTimeDay) {
			return [];
		}

		return completedTasksInTimeDay.filter((completedTask) => {
			const { completedTime } = completedTask;
			const completedTimeDate = new Date(completedTime);

			// Passed in an offset of 10 minutes between the start and end times because often times, I don't actually complete a task during the literal focus record session but a little after it or maybe even before it. So, I feel like this would handle most of the completed task scenarios during a focus record.
			const completedDuringFocusSession = isTimeBetween(completedTimeDate, startTimeDate, endTimeDate, 10);

			return completedDuringFocusSession;
		});
	};

	const completedTasksDuringFocusSession = getAllCompletedTasksDuringFocusRecord();
	const thereAreCompletedTasks = completedTasksDuringFocusSession && completedTasksDuringFocusSession.length > 0;

	const updateTaskIdQueryParam = (task) => {
		if (!task || !task.taskId) {
			return;
		}

		const { taskId } = task;

		updateQueryParams({ 'task-id': taskId, search: '' });
	};

	return (
		<div className="relative m-0 list-none last:mb-[4px]" style={{ minHeight: '54px' }}>
			<div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
				<Icon name="timer" customClass={classNames('!text-[20px]', textColor)} />
			</div>

			{!isLastItemForTheDay && (
				<div
					className={classNames(
						'absolute top-[28px] left-[11px] h-full border-solid border-l-[1px]',
						borderColor
					)}
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div className="relative m-0 ml-[25px] sm:ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				{!isLastItemForTheDay && (
					<div
						className={classNames(
							'absolute left-[-18px] sm:left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600',
							borderColor
						)}
						style={{ top: '34px' }}
					></div>
				)}

				<div className={classNames(bgColorHalfOpacity, 'p-2 rounded-lg w-[95%] sm:w-full')}>
					<div className="hidden sm:block text-gray-200">
						<span
							className="font-bold hover:underline cursor-pointer"
							onClick={() => {
								const newDayUrl = getFormattedShortMonthDay(new Date(startTime));
								updateQueryParams({ 'start-date': newDayUrl, 'end-date': newDayUrl });
							}}
						>
							{getFormattedLongDay(new Date(startTime))}
						</span>{' '}
						- {startTimeObj.time} - {endTimeObj.time} ({getFormattedDuration(duration, false)})
					</div>

					<div className="sm:hidden text-gray-200">
						<div className="font-bold">{getFormattedShortMonthDay(new Date(startTime))}</div>
						<div>
							{startTimeObj.time} - {endTimeObj.time} ({getFormattedDuration(duration, false)})
						</div>
					</div>

					{tasks.map((task) => {
						const { startTime, endTime, taskId } = task;

						const startTimeObj = formatDateTime(startTime);
						const endTimeObj = formatDateTime(endTime);

						return (
							<div
								key={`${taskId} - ${startTime}`}
								className="mt-2 md:mt-0 sm:flex justify-between items-center"
							>
								<h3
									onClick={() => updateTaskIdQueryParam(task)}
									className="text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer hover:text-blue-500 hover:underline"
								>
									{task?.title}
								</h3>

								{showSubtaskTime && (
									<div className="sm:ml-3 text-white">
										{startTimeObj.time} - {endTimeObj.time}
									</div>
								)}
							</div>
						);
					})}

					<div
						className={classNames('text-color-gray-100 text-white text-[15px] break-words react-markdown')}
					>
						<ReactMarkdown>{note}</ReactMarkdown>
					</div>

					{showCompletedTasks && thereAreCompletedTasks && (
						<>
							<h4 className="text-[16px] font-bold underline mt-4">Completed Tasks</h4>

							<ul className="list-disc ml-[20px]">
								{completedTasksDuringFocusSession.map((completedTask, index) => {
									// console.log(completedTask);

									return (
										<li key={`${focusRecord.id} ${completedTask.id} ${index}`}>
											{completedTask.title}
										</li>
									);
								})}
							</ul>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default FocusRecord;
