import Icon from '../../../../components/Icon';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import Accordion from '../../../../components/Accordion/Accordion';
import { getFormattedShortMonthDay } from '../../../../utils/date.utils';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';
import { useGetTodoistAllTasksQuery } from '../../../../services/resources/oldFocusAppsApi';
import CompletedTasksWithBreadcrumbs from './CompletedTasksWithBreadcrumbs';
import CompletedTask from './CompletedTask';

const DayWithCompletedTasks = ({ dateWithCompletedTasks, isLastItemForTheDay = false }) => {
	const { updateQueryParams } = useSearchParamsContext();

	const {
		completedTasksPageSettings: { groupedTasksCollapsedByDefault, showIndentedTasks },
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

			const groupTaskBreadcrumbsTickTick =
				groupTask && ancestorTasksById[groupTask.id] && Object.keys(ancestorTasksById[groupTask.id]);

			const groupTaskBreadcrumbsTodoist =
				groupTask &&
				todoistAncestorTasksById[groupTask.id] &&
				Object.keys(todoistAncestorTasksById[groupTask.id]);

			let groupTaskBreadcrumbs = groupTaskBreadcrumbsTickTick || groupTaskBreadcrumbsTodoist;

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

	const renderDirectCompletedSubtasks = (directCompletedSubtasks) => {
		return (
			<ul className="">
				{directCompletedSubtasks?.length > 0 &&
					directCompletedSubtasks.map((subtask, index) => (
						<li key={subtask.id + index + dateStr} className="flex items-start gap-1">
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
							oneLevelTasks[parentTaskId].map((taskId, index) => {
								const task = tasksById[taskId] || todoistAllTasksById[taskId];

								if (oneLevelTasks[taskId] && oneLevelTasks[taskId].length > 0) {
									return renderNestedTasks(taskId);
								}

								const directCompletedSubtasks = groupedSubtasksByParentTask[taskId];

								return (
									<Accordion
										key={taskId + index + dateStr}
										title={
											<li
												key={task.id}
												className="underline cursor-pointer font-bold text-[18px] mt-1"
											>
												{task.content || task.title}
											</li>
										}
										openByDefault={true}
										showArrowNextToText={true}
									>
										{renderDirectCompletedSubtasks(directCompletedSubtasks)}
									</Accordion>
								);
							})}
					</ul>
				</Accordion>
			</ul>
		);
	};

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
							{showIndentedTasks ? (
								tasksWithNoParent.map((taskId) => {
									return <div>{renderNestedTasks(taskId)}</div>;
								})
							) : (
								<CompletedTasksWithBreadcrumbs
									{...{
										tasksById,
										ancestorTasksById,
										todoistAncestorTasksById,
										groupedSubtasksByParentTask,
										todoistAllTasksById,
										dateStr,
										updateTaskIdQueryParam,
										groupedTasksCollapsedByDefault,
									}}
								/>
							)}
						</div>
					</Accordion>
				</div>
			</div>
		</div>
	);
};

export default DayWithCompletedTasks;
