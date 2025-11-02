import ReactMarkdown from 'react-markdown';
import { formatDateTime, getFormattedLongDay, getFormattedShortMonthDay } from '../../utils/date.utils';
import Icon from '../../components/Icon';
import LazyImage from '../../components/LazyImage';
import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useUserSettingsContext } from './useUserSettingsContext';
import { getFormattedDuration, getMedalImageClasses } from '../../utils/focus-apps/helpers.utils';
import { getFocusRecordFocusApp, getFocusRecordProperty } from '../../utils/focus-apps/multiFocusApps.utils';
import { BATTLEFIELD_1_MEDALS_BY_URL, BATTLEFIELD_3_MEDALS_BY_URL } from '../medals/medalsLinks';
import { useFocusRecordsQuery } from './useFocusRecordsQuery';
import { useGetProjectsQuery } from '../../services/resources/documentsProjectsApi';

const FocusRecord = ({ focusRecord, showSubtaskTime = true, isLastItemForTheDay = false }) => {
	const { updateQueryParams } = useSearchParamsContext();
	const { startTime, endTime, duration, note, crossesMidnight } = focusRecord
	const startTimeObj = formatDateTime(startTime);
	const endTimeObj = formatDateTime(endTime);

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
			showMedalGlow,
		},
	} = useUserSettingsContext();

	// Get completed tasks from API response
	const completedTasksDuringFocusSession = focusRecord.completedTasks || [];
	const thereAreCompletedTasks = completedTasksDuringFocusSession && completedTasksDuringFocusSession.length > 0;
	const isBattlefieldOneOrThreeMedal =
		BATTLEFIELD_1_MEDALS_BY_URL[selectedMedalImage] || BATTLEFIELD_3_MEDALS_BY_URL[selectedMedalImage];
	const urlRegex = /(https?:\/\/[^\s)]+)/g; // matches http/https URLs

	return (
		<div
			className={classNames(
				'm-0 list-none last:mb-[4px] w-full',
				showMedals ? 'flex' : 'relative',
				showMedals && !isBattlefieldOneOrThreeMedal ? 'gap-2' : ''
			)}
			style={{ minHeight: '54px' }}
		>
			{showMedals && (
				<LazyImage
					src={selectedMedalImage}
					alt="Medal image"
					className={getMedalImageClasses(medalImageSizePx, isBattlefieldOneOrThreeMedal, selectedMedalImage)}
					showGlow={showMedalGlow}
				/>
			)}

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
				className={classNames(showMedals ? 'w-full' : 'ml-[25px] sm:ml-[40px]', 'relative m-0 break-words')}
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
						</span>
						{crossesMidnight && (
							<>
								{' - '}
								<span
									className="font-bold hover:underline cursor-pointer"
									onClick={() => {
										const newDayUrl = getFormattedShortMonthDay(new Date(endTime));
										updateQueryParams({ 'start-date': newDayUrl, 'end-date': newDayUrl, page: '' });
									}}
								>
									{getFormattedLongDay(new Date(endTime))}
								</span>
							</>
						)}
						{' - '}
						{startTimeObj.time} - {endTimeObj.time} ({getFormattedDuration(duration, false)})
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
							{crossesMidnight && (
								<>
									{' - '}
									<span
										className="hover:underline cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											const newDayUrl = getFormattedShortMonthDay(new Date(endTime));
											updateQueryParams({ 'start-date': newDayUrl, 'end-date': newDayUrl, page: '' });
										}}
									>
										{getFormattedShortMonthDay(new Date(endTime))}
									</span>
								</>
							)}
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
							<ReactMarkdown>{note}</ReactMarkdown>
						</div>
					)}

					{showCompletedTasks && thereAreCompletedTasks && (
						<>
							<h4 className="text-[16px] font-bold underline mt-4">Completed Tasks</h4>

							<ul>
								{completedTasksDuringFocusSession.map((completedTask: any, index: number) => {
									const completedTaskText = completedTask.title;
									const containsUrl = completedTaskText?.match(urlRegex);

									return (
										<li
											key={`${focusRecord.id} ${completedTask._id} ${index}`}
											className="flex items-start gap-1"
										>
											<Icon
												name="check_box"
												customClass={classNames('!text-[20px] text-white mt-[2px]')}
											/>
											<span
												className={classNames(
													containsUrl
														? 'break-all md:break-normal md:break-words'
														: 'break-words'
												)}
											>
												{completedTaskText}
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
			// const isNotDirectTask = taskId !== taskIdFromUrl;

			// TODO: Come back to thsi and move the logic to the backend
			// if (filterOutUnrelatedTasksWhenTaskIdIsApplied && taskIdFromUrl) {
			// 	if (!taskId) {
			// 		return null;
			// 	}

			// 	if (showTaskAncestors && taskIdIncludeFocusRecordsFromSubtasks) {
			// 		if (!ancestorTasksById) {
			// 			return null;
			// 		}

			// 		const foundMatchingTaskOrAncestor = findMatchingTaskOrAncestor(
			// 			task,
			// 			taskIdFromUrl,
			// 			ancestorTasksById
			// 		);

			// 		if (!foundMatchingTaskOrAncestor) {
			// 			return null;
			// 		}
			// 	} else if (isNotDirectTask) {
			// 		return null;
			// 	}
			// }

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
	const { ancestorTasksById, isLoading } = useFocusRecordsQuery();

	if (isLoading) {
		return (
			<h3 onClick={() => updateTaskIdQueryParam(task)} className={headerStyling}>
				{task?.title}
			</h3>
		);
	}

	const parentTask = ancestorTasksById[task.taskId] || task;
	const parentTaskTitle = parentTask?.title || task.title || parentTask?.id;

	// Only checking TickTick because Todoist does not have Focus Records.
	const parentTaskBreadcrumbsTickTick = parentTask?.ancestorIds;
	const parentTaskBreadcrumbs = parentTaskBreadcrumbsTickTick?.filter((ancestorId) => ancestorId !== task.taskId) || [];

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
						const taskObj = ancestorTasksById[taskId];
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

			<TaskProjectName {...{ taskId: parentTask?.id || task.taskId, task }} />
		</div>
	);
};

const TaskProjectName = ({ taskId, task }) => {
	const { ancestorTasksById } = useFocusRecordsQuery();

	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById, projectsSessionById } = fetchedProjects || {};

	const { updateQueryParams } = useSearchParamsContext();

	const {
		focusRecordsPageSettings: { showTaskProjectName },
	} = useUserSettingsContext();

	if (!showTaskProjectName || !taskId) {
		return null;
	}

	const fullTask = ancestorTasksById[taskId] || task;
	const taskProject = projectsById && fullTask?.projectId && projectsById[fullTask?.projectId];
	const taskProjectName = taskProject ? taskProject.name : '';

	if (!taskProject) {
		return null
	}

	// Check if this project is a Session category
	const isSessionProject = projectsSessionById && taskProject?.id && projectsSessionById[taskProject.id];
	const projectQueryParam = isSessionProject ? 'categories' : 'projects';

	return (
		<span className="text-color-gray-25">
			{' '}
			-{' '}
			<span
				className="hover:underline hover:text-blue-500"
				onClick={() => {
					updateQueryParams({
						[projectQueryParam]: taskProject?.id,
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
