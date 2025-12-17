import classNames from 'classnames';
import Icon from '../../../components/Icon';
import type { Task } from '../../../types/models';
import type { AncestorTask } from '../../../types/api';

interface CompletedTaskProps {
	task: Task | AncestorTask;
	isFullTask: boolean;
	updateTaskIdQueryParam: (taskId: string) => void;
}

const CompletedTask: React.FC<CompletedTaskProps> = ({ task, isFullTask, updateTaskIdQueryParam }) => {
	// Really just for TickTick tasks, don't see anything like this for Todoist tasks. They seem to only have two statuses: "Complete" and "Not Complete".
	const statusIsWillNotDo = 'status' in task && task.status === -1;

	return (
		<div className="flex items-start gap-1">
			<Icon
				name={statusIsWillNotDo ? 'disabled_by_default' : 'check_box'}
				customClass={classNames('!text-[20px] text-white')}
			/>
			<div
				className={classNames('mt-[-2px]', isFullTask && 'hover:underline cursor-pointer')}
				onClick={() => {
					// "Full Tasks" would include all of the tasks from Todoist and all of the "non-item" tasks from TickTick. So, the only one tasks that would NOT be full tasks are the "items" which are only from TickTick and they are tasks that CANNOT have children.
					if (!isFullTask) {
						return;
					}

					updateTaskIdQueryParam(task.id);
				}}
			>
				{task.title}
			</div>
		</div>
	);
};

export default CompletedTask;
