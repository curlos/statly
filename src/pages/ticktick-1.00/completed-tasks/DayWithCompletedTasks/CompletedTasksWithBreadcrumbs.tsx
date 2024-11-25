import Accordion from '../../../../components/Accordion/Accordion';
import CompletedTask from './CompletedTask';

const CompletedTasksWithBreadcrumbs = ({
	tasksById,
	ancestorTasksById,
	todoistAncestorTasksById,
	groupedSubtasksByParentTask,
	todoistAllTasksById,
	dateStr,
	updateTaskIdQueryParam,
	groupedTasksCollapsedByDefault,
}) => {
	return (
		tasksById &&
		ancestorTasksById &&
		todoistAncestorTasksById &&
		Object.keys(groupedSubtasksByParentTask).map((parentTaskId, i) => {
			const completedSubtasks = groupedSubtasksByParentTask[parentTaskId];
			const parentTask =
				(tasksById && tasksById[parentTaskId]) || (todoistAllTasksById && todoistAllTasksById[parentTaskId]);
			const parentTaskTitle = parentTask?.title || parentTask?.content || parentTaskId;

			const parentTaskBreadcrumbsTickTick =
				parentTask && ancestorTasksById[parentTask.id] && Object.keys(ancestorTasksById[parentTask.id]);

			const parentTaskBreadcrumbsTodoist =
				parentTask &&
				todoistAncestorTasksById[parentTask.id] &&
				Object.keys(todoistAncestorTasksById[parentTask.id]);

			const parentTaskBreadcrumbs = parentTaskBreadcrumbsTickTick || parentTaskBreadcrumbsTodoist;

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
										const taskObj = tasksById[taskId] || todoistAllTasksById[taskId];

										const title = taskObj.title || taskObj.content;

										return (
											<span key={`breadcrumbs-${dateStr}-${taskObj.id}-${index}`}>
												<span
													className="hover:text-blue-500 hover:underline"
													onClick={() => {
														updateTaskIdQueryParam(taskObj.id);
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
		})
	);
};

export default CompletedTasksWithBreadcrumbs;
