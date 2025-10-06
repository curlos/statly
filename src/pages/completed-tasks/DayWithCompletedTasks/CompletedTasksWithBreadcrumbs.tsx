import Accordion from '../../../components/Accordion/Accordion';
import CompletedTask from './CompletedTask';

const CompletedTasksWithBreadcrumbs = ({
	ancestorTasksById,
	groupedSubtasksByParentTask,
	dateStr,
	updateTaskIdQueryParam,
	groupedTasksCollapsedByDefault,
}) => {
	return (
		ancestorTasksById &&
		Object.keys(groupedSubtasksByParentTask).map((parentTaskId, i) => {
			const completedSubtasks = groupedSubtasksByParentTask[parentTaskId];
			const parentTask =
				ancestorTasksById && ancestorTasksById[parentTaskId];
			const parentTaskTitle = parentTask?.title || parentTaskId;
			const parentTaskBreadcrumbs = parentTask?.ancestorIds

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
										const taskObj = ancestorTasksById[taskId];
										const title = taskObj.title;

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
