import classNames from 'classnames';
import Icon from '../../../components/Icon';
import FocusRecordContextMenu from '../../../components/FocusRecordContextMenu';
import ModalConfirmDelete from '../../../components/Modal/ModalConfirmDelete';
import { useCompletedTaskMenu } from './useCompletedTaskMenu';
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

	// Custom hook for menu logic
	const {
		contextMenuVisible,
		setContextMenuVisible,
		contextMenuPosition,
		handleContextMenu,
		deleteModalOpen,
		setDeleteModalOpen,
		isDeleting,
		handleDelete,
		menuItems,
	} = useCompletedTaskMenu({ task });

	return (
		<div onContextMenu={handleContextMenu}>
			<div className="flex items-start gap-1">
				<Icon
					name={statusIsWillNotDo ? 'disabled_by_default' : 'check_box'}
					customClass={classNames('!text-[20px] text-white')}
				/>
				<div
					className={classNames('mt-[-2px] flex-1', isFullTask && 'hover:underline cursor-pointer')}
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

			{/* Context Menu (right-click) */}
			<FocusRecordContextMenu
				isVisible={contextMenuVisible}
				position={contextMenuPosition}
				menuItems={menuItems}
				onClose={() => setContextMenuVisible(false)}
			/>

			{/* Delete Confirmation Modal */}
			<ModalConfirmDelete
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDelete}
				title="Delete Task"
				counts={{ tasks: 1 }}
				isDeleting={isDeleting}
				showCounts={false}
			/>
		</div>
	);
};

export default CompletedTask;
