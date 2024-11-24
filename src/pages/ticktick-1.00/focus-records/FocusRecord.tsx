import ReactMarkdown from 'react-markdown';
import {
	formatDateTime,
	getFormattedLongDay,
	getFormattedShortMonthDay,
	isTimeBetween,
} from '../../../utils/date.utils';
import Icon from '../../../components/Icon';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from './useUserSettingsContext';
import { getAllCompletedTasksDuringFocusRecord, getFocusDuration } from '../../../utils/focus-apps/focusRecords.utils';
import { getFormattedDuration } from '../../../utils/focus-apps/helpers.utils';
import { getFocusRecordFocusApp, getFocusRecordProperty } from '../../../utils/focus-apps/multiFocusApps.utils';
import { useGetTodoistAllTasksQuery } from '../../../services/resources/oldFocusAppsApi';

const FocusRecord = ({ focusRecord, showSubtaskTime = true, isLastItemForTheDay = false, focusDuration }) => {
	const { updateQueryParams } = useSearchParamsContext();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { completedTasksGroupedByDate } = fetchedTasks || {};

	// RTK Query - Todoist - All Completed Tasks
	const { data: fetchedTodoistAllCompletedTasks } = useGetTodoistAllTasksQuery();
	const { todoistCompletedTasksGroupedByDate } = fetchedTodoistAllCompletedTasks || {};

	const startTime = getFocusRecordProperty(focusRecord, 'startTime');
	const endTime = getFocusRecordProperty(focusRecord, 'endTime');
	const focusNote = getFocusRecordProperty(focusRecord, 'note');

	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);
	const duration = focusDuration ? focusDuration : getFocusDuration({ focusRecord });

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor } = chosenColorObj;

	const {
		focusRecordsPageSettings: { showCompletedTasks, showFocusNotes },
	} = useUserSettingsContext();

	const completedTasksDuringFocusSession = getAllCompletedTasksDuringFocusRecord({
		completedTasksGroupedByDate,
		todoistCompletedTasksGroupedByDate,
		focusRecord,
	});
	const thereAreCompletedTasks = completedTasksDuringFocusSession && completedTasksDuringFocusSession.length > 0;

	return (
		<div className="relative m-0 list-none last:mb-[4px] w-full" style={{ minHeight: '54px' }}>
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
								updateQueryParams({ 'start-date': newDayUrl, 'end-date': newDayUrl, page: '' });
							}}
						>
							{getFormattedLongDay(new Date(startTime))}
						</span>{' '}
						- {startTimeObj.time} - {endTimeObj.time} ({getFormattedDuration(duration, false)})
					</div>

					<div className="sm:hidden text-gray-200">
						<div
							className="font-bold hover:underline cursor-pointer"
							onClick={() => {
								const newDayUrl = getFormattedShortMonthDay(new Date(startTime));
								updateQueryParams({ 'start-date': newDayUrl, 'end-date': newDayUrl, page: '' });
							}}
						>
							{getFormattedShortMonthDay(new Date(startTime))}
						</div>
						<div>
							{startTimeObj.time} - {endTimeObj.time} ({getFormattedDuration(duration, false)})
						</div>
					</div>

					<FocusRecordTasks focusRecord={focusRecord} showSubtaskTime={showSubtaskTime} />

					{showFocusNotes && (
						<div
							className={classNames(
								'text-color-gray-100 text-white text-[15px] break-words react-markdown'
							)}
						>
							<ReactMarkdown>{focusNote}</ReactMarkdown>
						</div>
					)}

					{showCompletedTasks && thereAreCompletedTasks && (
						<>
							<h4 className="text-[16px] font-bold underline mt-4">Completed Tasks</h4>

							<ul>
								{completedTasksDuringFocusSession.map((completedTask, index) => {
									return (
										<li
											key={`${focusRecord.id} ${completedTask.id} ${index}`}
											className="flex items-start gap-1"
										>
											<Icon
												name="check_box"
												customClass={classNames('!text-[20px] text-white mt-[2px]')}
											/>
											<span>{completedTask.title || completedTask.content}</span>
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

const FocusRecordTasks = ({ focusRecord, showSubtaskTime }) => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const taskIdFromUrl = searchParams.get('task-id');
	const {
		focusRecordsPageSettings: { filterOutUnrelatedTasksWhenTaskIdIsApplied },
	} = useUserSettingsContext();

	const headerWrapperStyling = 'mt-2 md:mt-0 sm:flex justify-between items-center';
	const headerStyling =
		'text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer hover:text-blue-500 hover:underline';

	const updateTaskIdQueryParam = (task?: object) => {
		let taskId = '';

		const focusApp = getFocusRecordFocusApp(focusRecord);

		if (focusApp === 'TickTick') {
			if (!task || !task.taskId) {
				return;
			}

			taskId = task.taskId;
		} else {
			taskId = getFocusRecordProperty(focusRecord, 'taskId');
		}

		updateQueryParams({
			'task-id': taskId,
			'sort-by': '',
			search: '',
			'start-date': '',
			'end-date': '',
			projects: '',
			page: '',
		});
	};

	const getTickTickFocusRecordTask = () => {
		return focusRecord.tasks.map((task) => {
			const { startTime, endTime, taskId } = task;

			if (filterOutUnrelatedTasksWhenTaskIdIsApplied && taskIdFromUrl && (!taskId || taskId !== taskIdFromUrl)) {
				return null;
			}

			const startTimeObj = formatDateTime(startTime);
			const endTimeObj = formatDateTime(endTime);

			return (
				<div key={`${taskId} - ${startTime}`} className={headerWrapperStyling}>
					<h3 onClick={() => updateTaskIdQueryParam(task)} className={headerStyling}>
						{task?.title}
					</h3>

					{showSubtaskTime && (
						<div className="sm:ml-3 text-white">
							{startTimeObj.time} - {endTimeObj.time}
						</div>
					)}
				</div>
			);
		});
	};

	const getOtherAppsFocusRecordTask = () => {
		const startTime = getFocusRecordProperty(focusRecord, 'startTime');
		const endTime = getFocusRecordProperty(focusRecord, 'endTime');

		const startTimeObj = formatDateTime(startTime);
		const endTimeObj = formatDateTime(endTime);

		const focusRecordTitle = getFocusRecordProperty(focusRecord, 'displayTitle');

		return (
			<div key={`${startTimeObj.time} - ${endTimeObj.time}`} className={headerWrapperStyling}>
				<h3 onClick={() => updateTaskIdQueryParam()} className={headerStyling}>
					{focusRecordTitle}
				</h3>

				{showSubtaskTime && (
					<div className="sm:ml-3 text-white">
						{startTimeObj.time} - {endTimeObj.time}
					</div>
				)}
			</div>
		);
	};

	const getFocusRecordTask = () => {
		const focusApp = getFocusRecordFocusApp(focusRecord);

		switch (focusApp) {
			case 'TickTick':
				return getTickTickFocusRecordTask();
			default:
				return getOtherAppsFocusRecordTask();
		}
	};

	return getFocusRecordTask();
};

export default FocusRecord;
