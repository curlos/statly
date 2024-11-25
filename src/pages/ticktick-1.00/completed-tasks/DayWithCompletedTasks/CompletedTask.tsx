import classNames from 'classnames';
import Icon from '../../../../components/Icon';

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

export default CompletedTask;
