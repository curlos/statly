import Icon from '../../../components/Icon';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import Accordion from '../../../components/Accordion/Accordion';

const DayWithCompletedTasks = ({ dateWithCompletedTasks, isLastItemForTheDay = false }) => {
	const { updateQueryParams } = useSearchParamsContext();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById, allTasksWithParents } = fetchedTasks || {};

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor } = chosenColorObj;

	const { dateStr, completedTasksForDay } = dateWithCompletedTasks;

	const getGroupedSubtasksAndParentTasks = () => {
		const groupedSubtasksByParentTask = {};
		const parentTasksArr = [];
		const parentTasksObj = {};

		completedTasksForDay.forEach((task) => {
			const { itemParentTaskId } = task;

			if (itemParentTaskId) {
				if (!groupedSubtasksByParentTask[itemParentTaskId]) {
					groupedSubtasksByParentTask[itemParentTaskId] = [];
				}

				groupedSubtasksByParentTask[itemParentTaskId].push(task);
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
							<div className="text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer hover:text-blue-500 hover:underline">
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
											<CompletedTask key={dateStr + task.id} title={task.title} />
										))}
									</div>
								</Accordion>
							)}
						</div>

						<div className="space-y-5">
							{tasksById &&
								allTasksWithParents &&
								Object.keys(groupedSubtasksByParentTask).map((parentTaskId) => {
									const completedSubtasks = groupedSubtasksByParentTask[parentTaskId];
									const parentTask = tasksById && tasksById[parentTaskId];
									const parentTaskTitle = parentTask?.title || parentTaskId;

									const parentTaskBreadcrumbs = parentTask && allTasksWithParents[parentTask.id];

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
											openByDefault={false}
											showArrowNextToText={true}
										>
											<div className="space-y-1">
												{completedSubtasks.map((task) => (
													<CompletedTask key={dateStr + task.id} title={task.title} />
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

const CompletedTask = ({ title }) => (
	<div className="flex items-start gap-1">
		<Icon name="check_box" customClass={classNames('!text-[20px] text-white')} />
		<div className="mt-[-2px]">{title}</div>
	</div>
);

export default DayWithCompletedTasks;
