import ReactMarkdown from 'react-markdown';
import {
	formatDateTime,
	getFormattedLongDay,
	getFormattedShortMonthDay,
	isTimeBetween,
} from '../../../utils/date.utils';
import Icon from '../../../components/Icon';
import classNames from 'classnames';
import { useGetAllProjectsQuery, useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from './useUserSettingsContext';
import { getAllCompletedTasksDuringFocusRecord, getFocusDuration } from '../../../utils/focus-apps/focusRecords.utils';
import { getFormattedDuration } from '../../../utils/focus-apps/helpers.utils';
import { getFocusRecordFocusApp, getFocusRecordProperty } from '../../../utils/focus-apps/multiFocusApps.utils';
import { useGetTodoistAllTasksQuery } from '../../../services/resources/oldFocusAppsApi';
import { findMatchingTaskOrAncestor } from '../../../utils/focus-apps/tasks.utils';
import { BATTLEFIELD_1_MEDALS_BY_URL, BATTLEFIELD_3_MEDALS_BY_URL } from '../medals/medalsLinks';

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
		focusRecordsPageSettings: {
			showCompletedTasks,
			showFocusNotes,
			showMedals,
			selectedMedalImage,
			medalImageSizePx,
		},
	} = useUserSettingsContext();

	const completedTasksDuringFocusSession = getAllCompletedTasksDuringFocusRecord({
		completedTasksGroupedByDate,
		todoistCompletedTasksGroupedByDate,
		focusRecord,
	});
	const thereAreCompletedTasks = completedTasksDuringFocusSession && completedTasksDuringFocusSession.length > 0;
	const isBattlefieldOneOrThreeMedal =
		BATTLEFIELD_1_MEDALS_BY_URL[selectedMedalImage] || BATTLEFIELD_3_MEDALS_BY_URL[selectedMedalImage];

	const getMedalImageClasses = () => {
		let medalImageClass = '';

		if (medalImageSizePx === 60) {
			medalImageClass = 'h-[60px] sm:ml-[-15px]';

			if (isBattlefieldOneOrThreeMedal) {
				medalImageClass += ' mr-[-5px]';
			}
		} else if (medalImageSizePx === 100) {
			medalImageClass = 'h-[100px] sm:ml-[-25px]';

			if (isBattlefieldOneOrThreeMedal) {
				medalImageClass += ' mr-[-10px]';
			}
		} else {
			medalImageClass = 'h-[150px] sm:ml-[-30px]';

			if (isBattlefieldOneOrThreeMedal) {
				medalImageClass += ' mr-[-15px]';
			}
		}

		return medalImageClass;
	};

	return (
		<div
			className={classNames(
				'm-0 list-none last:mb-[4px] w-full',
				showMedals ? 'flex' : 'relative',
				showMedals && !isBattlefieldOneOrThreeMedal ? 'gap-2' : ''
			)}
			style={{ minHeight: '54px' }}
		>
			{showMedals && <img src={selectedMedalImage} className={getMedalImageClasses()} />}

			{!showMedals && (
				<div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
					<Icon name="timer" customClass={classNames('!text-[20px]', textColor)} />
				</div>
			)}

			{!isLastItemForTheDay && !showMedals && (
				<div
					className={classNames(
						'absolute top-[28px] left-[11px] h-full border-solid border-l-[1px]',
						borderColor
					)}
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div
				className={classNames(!showMedals && 'ml-[25px] sm:ml-[40px]', 'relative m-0 break-words')}
				style={{ marginTop: 'unset' }}
			>
				{!isLastItemForTheDay && !showMedals && (
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
											<span className="break-words">
												{completedTask.title || completedTask.content}
											</span>
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
		focusRecordsPageSettings: {
			filterOutUnrelatedTasksWhenTaskIdIsApplied,
			showTaskAncestors,
			taskIdIncludeFocusRecordsFromSubtasks,
		},
	} = useUserSettingsContext();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { ancestorTasksById } = fetchedTasks || {};

	const headerWrapperStyling = 'mt-2 md:mt-0 sm:flex justify-between';
	const headerStyling =
		'text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer hover:text-blue-500 hover:underline';

	const updateTaskIdQueryParam = (task?: object) => {
		let taskId = '';

		const focusApp = getFocusRecordFocusApp(focusRecord);

		if (focusApp === 'TickTick') {
			if (!task) {
				return;
			}

			taskId = task.taskId || task.id;
		} else {
			taskId = getFocusRecordProperty(focusRecord, 'taskId');
		}

		if (!taskId) {
			return;
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
		const getTaskTitle = (task, dateStr) => {
			if (showTaskAncestors) {
				return <TaskTitleWithBreadcrumbs {...{ task, updateTaskIdQueryParam, headerStyling, dateStr }} />;
			}

			const taskId = task?.taskId || task.id;

			return (
				<h3 className="text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer">
					<span onClick={() => updateTaskIdQueryParam(task)} className="hover:text-blue-500 hover:underline">
						{task?.title}
					</span>
					<TaskProjectName {...{ taskId: taskId }} />
				</h3>
			);
		};

		return focusRecord.tasks.map((task, index) => {
			const { startTime, endTime, taskId } = task;
			const isNotDirectTask = taskId !== taskIdFromUrl;

			if (filterOutUnrelatedTasksWhenTaskIdIsApplied && taskIdFromUrl) {
				if (!taskId) {
					return null;
				}

				if (showTaskAncestors && taskIdIncludeFocusRecordsFromSubtasks) {
					if (!ancestorTasksById) {
						return null;
					}

					const foundMatchingTaskOrAncestor = findMatchingTaskOrAncestor(
						task,
						taskIdFromUrl,
						ancestorTasksById
					);

					if (!foundMatchingTaskOrAncestor) {
						return null;
					}
				} else if (isNotDirectTask) {
					return null;
				}
			}

			const startTimeObj = formatDateTime(startTime);
			const endTimeObj = formatDateTime(endTime);

			return (
				<div key={`${taskId} - ${startTime} - ${endTime} - ${index}`} className={headerWrapperStyling}>
					{getTaskTitle(
						task,
						`${startTimeObj.day + ' ' + startTimeObj.time} - ${endTimeObj.day + ' ' + endTimeObj.time}`
					)}

					{showSubtaskTime && (
						<div className="sm:ml-3 text-white min-w-[150px] flex justify-end md:mt-[6px]">
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

const TaskTitleWithBreadcrumbs = ({ task, updateTaskIdQueryParam, headerStyling, dateStr }) => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks } = useGetAllTasksQuery();
	const { tasksById, ancestorTasksById } = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistAllTasksById, isLoading: isLoadingGetTodoistAllTasks } = useGetTodoistAllTasksQuery();
	const { todoistAllTasksById } = fetchedTodoistAllTasksById || {};

	if (isLoadingGetTasks || isLoadingGetTodoistAllTasks) {
		return (
			<h3 onClick={() => updateTaskIdQueryParam(task)} className={headerStyling}>
				{task?.title}
			</h3>
		);
	}

	const parentTask = task;
	const parentTaskId = task.id || task.taskId;
	const parentTaskTitle = parentTask?.title || parentTask?.content || parentTaskId;

	// Only checking TickTick because Todoist does not have Focus Records.
	const parentTaskBreadcrumbsTickTick =
		parentTask && ancestorTasksById[parentTaskId] && Object.keys(ancestorTasksById[parentTaskId]);

	const parentTaskBreadcrumbs = parentTaskBreadcrumbsTickTick;

	return (
		<div className="text-[22px] cursor-pointer">
			<span
				className="hover:underline font-bold hover:text-blue-500"
				onClick={() => {
					updateTaskIdQueryParam(parentTask);
				}}
			>
				{parentTaskTitle}
			</span>

			{parentTaskBreadcrumbs?.length > 0 && (
				<span className="ml-1 text-color-gray-25">
					-{' '}
					{parentTaskBreadcrumbs.map((taskId, index) => {
						const taskObj = tasksById[taskId] || todoistAllTasksById[taskId];

						const title = taskObj.title || taskObj.content;

						return (
							<span key={`breadcrumbs-${taskObj.id}-${index}-${dateStr}`}>
								<span
									className="hover:text-blue-500 hover:underline"
									onClick={() => {
										updateTaskIdQueryParam(taskObj);
									}}
								>
									{title}
								</span>
								{index !== parentTaskBreadcrumbs.length - 1 && <span>{' > '}</span>}
							</span>
						);
					})}
				</span>
			)}

			<TaskProjectName {...{ taskId: parentTaskId, parentTask }} />
		</div>
	);
};

const TaskProjectName = ({ taskId }) => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects } = useGetAllProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const { updateQueryParams } = useSearchParamsContext();

	const {
		focusRecordsPageSettings: { showTaskProjectName },
	} = useUserSettingsContext();

	if (!showTaskProjectName || !taskId) {
		return null;
	}

	const fullTask = tasksById[taskId];
	const taskProject = fullTask?.projectId && projectsById[fullTask?.projectId];
	const taskProjectName = taskProject ? taskProject.name : '';

	return (
		<span className="text-color-gray-25">
			{' '}
			-{' '}
			<span
				className="hover:underline hover:text-blue-500"
				onClick={() => {
					updateQueryParams({
						projects: taskProject?.id,
						'task-id': '',
						'sort-by': '',
						search: '',
						'start-date': '',
						'end-date': '',
						page: '',
					});
				}}
			>
				({taskProjectName})
			</span>
		</span>
	);
};

export default FocusRecord;
