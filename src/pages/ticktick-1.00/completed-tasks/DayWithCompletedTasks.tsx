import Icon from '../../../components/Icon';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import Accordion from '../../../components/Accordion/Accordion';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import { useGetTodoistAllTasksByIdQuery } from '../../../services/resources/oldFocusAppsApi';

const DayWithCompletedTasks = ({ dateWithCompletedTasks, isLastItemForTheDay = false }) => {
	const { updateQueryParams } = useSearchParamsContext();

	const {
		completedTasksPageSettings: { groupedTasksCollapsedByDefault },
	} = useUserSettingsContext();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById, ancestorTasksById } = fetchedTasks || {};

	// RTK Query - Todoist - All Tasks By Id
	const { data: fetchedTodoistAllTasksById } = useGetTodoistAllTasksByIdQuery();
	const { todoistAllTasksById } = fetchedTodoistAllTasksById || {};

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

			const parentId = itemParentTaskId || parent_id;

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

		return {
			groupedSubtasksByParentTask,
			parentTasks: parentTasksArr,
		};
	};

	const { groupedSubtasksByParentTask, parentTasks } = getGroupedSubtasksAndParentTasks();

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

	console.log(parentTasks);

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
									title={<div className="underline font-bold text-[18px]">Parent Tasks</div>}
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
							{tasksById &&
								ancestorTasksById &&
								Object.keys(groupedSubtasksByParentTask).map((parentTaskId) => {
									const completedSubtasks = groupedSubtasksByParentTask[parentTaskId];
									const parentTask =
										(tasksById && tasksById[parentTaskId]) ||
										(todoistAllTasksById && todoistAllTasksById[parentTaskId]);
									const parentTaskTitle =
										parentTask?.title || parentTask?.item?.content || parentTaskId;

									console.log(parentTask);

									const parentTaskBreadcrumbs =
										parentTask &&
										ancestorTasksById[parentTask.id] &&
										Object.keys(ancestorTasksById[parentTask.id]);

									return (
										<Accordion
											key={dateStr + parentTaskId}
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
																const taskObj = tasksById[taskId];

																return (
																	<span key={`breadcrumbs-${dateStr}-${taskObj.id}`}>
																		<span
																			className="hover:text-blue-500 hover:underline"
																			onClick={() => {
																				updateTaskIdQueryParam(taskObj.id);
																			}}
																		>
																			{taskObj.title}
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
												{completedSubtasks.map((task) => (
													<CompletedTask key={dateStr + task.id} task={task} />
												))}
											</div>
										</Accordion>
									);
								})}
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
