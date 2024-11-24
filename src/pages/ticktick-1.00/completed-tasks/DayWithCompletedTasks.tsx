import Icon from '../../../components/Icon';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import Accordion from '../../../components/Accordion/Accordion';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useGetTodoistAllTasksQuery } from '../../../services/resources/oldFocusAppsApi';

const DayWithCompletedTasks = ({ dateWithCompletedTasks, isLastItemForTheDay = false }) => {
	const { updateQueryParams } = useSearchParamsContext();

	const {
		completedTasksPageSettings: { groupedTasksCollapsedByDefault },
	} = useUserSettingsContext();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById, ancestorTasksById } = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistAllTasksById } = useGetTodoistAllTasksQuery();
	const { todoistAllTasksById, todoistAncestorTasksById } = fetchedTodoistAllTasksById || {};

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor } = chosenColorObj;

	const { dateStr, completedTasksForDay } = dateWithCompletedTasks;

	const getGroupedSubtasksAndParentTasks = () => {
		const groupedSubtasksByParentTask = {};
		const parentTasksArr = [];
		const parentTasksObj = {};

		completedTasksForDay.forEach((task) => {
			const { itemParentTaskId, parent_id } = task;

			const parentId = itemParentTaskId || parent_id || task.parentId;

			if (parentId) {
				if (!groupedSubtasksByParentTask[parentId]) {
					groupedSubtasksByParentTask[parentId] = [];
				}

				groupedSubtasksByParentTask[parentId].push(task);
			} else {
				// Sometimes it's possible for a parent task to appear more than once (not entirely sure how though) so need to check if it's already been pushed to the array first.
				if (!parentTasksObj[task.id]) {
					parentTasksArr.push(task);
					parentTasksObj[task.id] = true;
				}
			}
		});

		// New Grouping Logic

		const tasksWithParentId = {};

		completedTasksForDay.forEach((task) => {
			const groupTask = task.itemParentTaskId
				? tasksById[task.itemParentTaskId]
				: tasksById[task.id] || todoistAllTasksById[task.id];

			console.log(groupTask);
			console.log(task);
			console.log(tasksById);

			const groupTaskBreadcrumbsTickTick =
				groupTask && ancestorTasksById[groupTask.id] && Object.keys(ancestorTasksById[groupTask.id]);

			const groupTaskBreadcrumbsTodoist =
				groupTask &&
				todoistAncestorTasksById[groupTask.id] &&
				Object.keys(todoistAncestorTasksById[groupTask.id]);

			let groupTaskBreadcrumbs = groupTaskBreadcrumbsTickTick || groupTaskBreadcrumbsTodoist;

			console.log(groupTaskBreadcrumbsTickTick);

			if (groupTaskBreadcrumbs) {
				groupTaskBreadcrumbs = task.itemParentTaskId
					? [task.itemParentTaskId, ...groupTaskBreadcrumbs]
					: groupTaskBreadcrumbs;

				groupTaskBreadcrumbs.forEach((taskId) => {
					const task = tasksById[taskId] || todoistAllTasksById[taskId];
					const taskParent = task.parentId || task['parent_id'] || task.itemParentTaskId;

					if (taskParent) {
						tasksWithParentId[task.id] = taskParent;
					} else {
						tasksWithParentId[task.id] = null;
					}
				});
			} else {
				const taskParent = task.parentId || task['parent_id'] || task.itemParentTaskId;

				if (taskParent) {
					tasksWithParentId[task.id] = taskParent;
				} else {
					tasksWithParentId[task.id] = null;
				}
			}
		});

		const tasksWithNoParent = Object.keys(tasksWithParentId).filter((currentTaskId) => {
			return !tasksWithParentId[currentTaskId];
		});

		console.log(tasksWithParentId);
		console.log(tasksWithNoParent);

		// const tasksWithNoParent = [];
		// const tasksWithParent = [];

		// const finalGroupedTasks = {};

		// Object.keys(groupedSubtasksByParentTask).forEach((groupTaskId) => {
		// 	const groupTask = todoistAllTasksById[groupTaskId];

		// 	// console.log(groupTask);

		// 	const groupTaskBreadcrumbsTickTick =
		// 		groupTask && ancestorTasksById[groupTask.id] && Object.keys(ancestorTasksById[groupTask.id]);

		// 	const groupTaskBreadcrumbsTodoist =
		// 		groupTask &&
		// 		todoistAncestorTasksById[groupTask.id] &&
		// 		Object.keys(todoistAncestorTasksById[groupTask.id]);

		// 	let groupTaskBreadcrumbs = groupTaskBreadcrumbsTickTick || groupTaskBreadcrumbsTodoist;

		// 	console.log(groupTaskBreadcrumbs);

		// 	if (groupTaskBreadcrumbs) {
		// 		groupTaskBreadcrumbs = [groupTask.id, ...groupTaskBreadcrumbs];

		// 		console.log(groupTaskBreadcrumbs);

		// 		for (let i = groupTaskBreadcrumbs.length - 1; i >= 0; i--) {
		// 			const taskId = groupTaskBreadcrumbs[i];
		// 			const task = todoistAllTasksById[taskId];

		// 			if (!finalGroupedTasks[taskId] && !task.parent_id) {
		// 				finalGroupedTasks[taskId] = {};
		// 			}

		// 			const prevTaskId = groupTaskBreadcrumbs[i + 1];

		// 			if (prevTaskId) {
		// 				finalGroupedTasks[prevTaskId][taskId] = {};
		// 			}
		// 		}
		// 	}
		// });

		return {
			groupedSubtasksByParentTask,
			parentTasks: parentTasksArr,
			tasksWithParentId,
			tasksWithNoParent,
		};
	};

	const { groupedSubtasksByParentTask, parentTasks, tasksWithParentId, tasksWithNoParent } =
		getGroupedSubtasksAndParentTasks();

	const updateTaskIdQueryParam = (taskId) => {
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

	const oneLevelTasks = {};

	Object.entries(tasksWithParentId).forEach(([currentTaskId, parentTaskId]) => {
		if (parentTaskId) {
			if (!oneLevelTasks[parentTaskId]) {
				oneLevelTasks[parentTaskId] = [];
			}

			oneLevelTasks[parentTaskId].push(currentTaskId);
		}
	});

	console.log(tasksWithParentId);
	console.log(oneLevelTasks);

	const renderDirectCompletedSubtasks = (directCompletedSubtasks) => {
		return (
			<ul className="">
				{directCompletedSubtasks?.length > 0 &&
					directCompletedSubtasks.map((subtask) => (
						<li className="flex items-start gap-1">
							<Icon
								name={subtask.status === -1 ? 'disabled_by_default' : 'check_box'}
								customClass={classNames('!text-[20px] text-white mt-[2px]')}
							/>
							<span>{subtask.content || subtask.title}</span>
						</li>
					))}
			</ul>
		);
	};

	const renderNestedTasks = (parentTaskId) => {
		const parentTask = todoistAllTasksById[parentTaskId] || tasksById[parentTaskId];

		// oneLevelTasks[parentTaskId] &&
		// 	oneLevelTasks[parentTaskId].sort((a, b) => {
		// 		const taskA = todoistAllTasksById[a];
		// 		const taskB = todoistAllTasksById[b];
		// 		return taskA['child_order'] - taskB['child_order'];
		// 	});

		const directCompletedSubtasks = groupedSubtasksByParentTask[parentTask.id];

		return (
			<ul className="text-[16px]">
				<Accordion
					title={
						<li key={parentTask.id} className="underline cursor-pointer font-bold text-[18px]">
							{parentTask.content || parentTask.title}
						</li>
					}
					openByDefault={!groupedTasksCollapsedByDefault}
					showArrowNextToText={true}
				>
					{renderDirectCompletedSubtasks(directCompletedSubtasks)}

					<ul className="pl-6">
						{oneLevelTasks[parentTaskId] &&
							oneLevelTasks[parentTaskId].map((taskId) => {
								const task = tasksById[taskId] || todoistAllTasksById[taskId];

								if (oneLevelTasks[taskId] && oneLevelTasks[taskId].length > 0) {
									return renderNestedTasks(taskId);
								}

								const directCompletedSubtasks = groupedSubtasksByParentTask[taskId];

								return (
									<>
										<Accordion
											title={
												<li
													key={task.id}
													className="underline cursor-pointer font-bold text-[18px] mt-1"
												>
													{task.content || task.title}
												</li>
											}
											openByDefault={!groupedTasksCollapsedByDefault}
											showArrowNextToText={true}
										>
											{renderDirectCompletedSubtasks(directCompletedSubtasks)}
										</Accordion>
									</>
								);
							})}
					</ul>
				</Accordion>
			</ul>
		);
	};

	console.log(tasksWithNoParent);

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
					<Accordion
						title={
							<div
								className="text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer hover:text-blue-500 hover:underline"
								onClick={(e) => {
									e.stopPropagation();
									const newDayUrl = getFormattedShortMonthDay(new Date(dateStr));
									updateQueryParams({ 'start-date': newDayUrl, 'end-date': newDayUrl, page: '' });
								}}
							>
								<span>{dateStr}</span>
								<span> ({completedTasksForDay.length})</span>
							</div>
						}
						openByDefault={true}
					>
						<div className="mb-5">
							{parentTasks && parentTasks.length > 0 && (
								<Accordion
									title={<div className="underline font-bold text-[18px]">Tasks With No Parent</div>}
									openByDefault={true}
									showArrowNextToText={true}
								>
									<div className="space-y-1">
										{parentTasks.map((task) => (
											<CompletedTask
												key={dateStr + task.id}
												task={task}
												isFullTask={true}
												updateTaskIdQueryParam={updateTaskIdQueryParam}
											/>
										))}
									</div>
								</Accordion>
							)}
						</div>

						<div className="space-y-5">
							{tasksWithNoParent.map((taskId) => {
								return <div>{renderNestedTasks(taskId)}</div>;
							})}

							{/* {tasksById &&
								ancestorTasksById &&
								todoistAncestorTasksById &&
								Object.keys(groupedSubtasksByParentTask).map((parentTaskId, i) => {
									const completedSubtasks = groupedSubtasksByParentTask[parentTaskId];
									const parentTask =
										(tasksById && tasksById[parentTaskId]) ||
										(todoistAllTasksById && todoistAllTasksById[parentTaskId]);
									const parentTaskTitle = parentTask?.title || parentTask?.content || parentTaskId;

									const parentTaskBreadcrumbsTickTick =
										parentTask &&
										ancestorTasksById[parentTask.id] &&
										Object.keys(ancestorTasksById[parentTask.id]);

									const parentTaskBreadcrumbsTodoist =
										parentTask &&
										todoistAncestorTasksById[parentTask.id] &&
										Object.keys(todoistAncestorTasksById[parentTask.id]);

									const parentTaskBreadcrumbs =
										parentTaskBreadcrumbsTickTick || parentTaskBreadcrumbsTodoist;

									return (
										<Accordion
											key={dateStr + parentTaskId + i}
											title={
												<div className="text-[18px]">
													<span
														className="underline font-bold hover:text-blue-500"
														onClick={() => {
															updateTaskIdQueryParam(parentTaskId);
														}}
													>
														{parentTaskTitle}
													</span>

													{parentTaskBreadcrumbs?.length > 0 && (
														<span className="ml-1 text-color-gray-25">
															-{' '}
															{parentTaskBreadcrumbs.map((taskId, index) => {
																const taskObj =
																	tasksById[taskId] || todoistAllTasksById[taskId];

																const title = taskObj.title || taskObj.content;

																return (
																	<span
																		key={`breadcrumbs-${dateStr}-${taskObj.id}-${index}`}
																	>
																		<span
																			className="hover:text-blue-500 hover:underline"
																			onClick={() => {
																				updateTaskIdQueryParam(taskObj.id);
																			}}
																		>
																			{title}
																		</span>
																		{index !== parentTaskBreadcrumbs.length - 1 && (
																			<span>{' > '}</span>
																		)}
																	</span>
																);
															})}
														</span>
													)}
												</div>
											}
											openByDefault={!groupedTasksCollapsedByDefault}
											showArrowNextToText={true}
										>
											<div className="space-y-1">
												{completedSubtasks.map((task, i) => (
													<CompletedTask key={dateStr + task.id + i} task={task} />
												))}
											</div>
										</Accordion>
									);
								})} */}
						</div>
					</Accordion>
				</div>
			</div>
		</div>
	);
};

const CompletedTask = ({ task, isFullTask, updateTaskIdQueryParam }) => (
	<div className="flex items-start gap-1">
		<Icon
			name={task.status === -1 ? 'disabled_by_default' : 'check_box'}
			customClass={classNames('!text-[20px] text-white')}
		/>
		<div
			className={classNames('mt-[-2px]', isFullTask && 'hover:underline cursor-pointer')}
			onClick={() => {
				if (!isFullTask) {
					return;
				}

				updateTaskIdQueryParam(task.id);
			}}
		>
			{task.title || task.content}
		</div>
	</div>
);

export default DayWithCompletedTasks;
