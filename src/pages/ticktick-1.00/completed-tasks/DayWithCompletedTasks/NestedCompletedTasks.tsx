import classNames from 'classnames';
import Accordion from '../../../../components/Accordion/Accordion';
import Icon from '../../../../components/Icon';

const NestedCompletedTasks = ({
	tasksWithNoParent,
	tasksWithParentId,
	todoistAllTasksById,
	groupedSubtasksByParentTask,
	tasksById,
	groupedTasksCollapsedByDefault,
	dateStr,
}) => {
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
		<>
			{tasksWithNoParent.map((taskId) => {
				return <div>{renderNestedTasks(taskId)}</div>;
			})}
		</>
	);
};

export default NestedCompletedTasks;
