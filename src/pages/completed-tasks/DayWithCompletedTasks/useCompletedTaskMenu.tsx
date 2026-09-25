import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useBulkDeleteTasksMutation } from '../../../services/resources/deleteApi';
import { serializeTaskToMarkdown } from '../../../utils/completedTasks.utils';
import { Task } from '../../../types/models';
import { AncestorTask } from '../../../types/api';
import { showToast } from '../../../slices/toastSlice';

interface UseCompletedTaskMenuParams {
	task: Task | AncestorTask;
}

export const useCompletedTaskMenu = ({ task }: UseCompletedTaskMenuParams) => {
	const dispatch = useDispatch();

	// Context menu state (right-click)
	const [contextMenuVisible, setContextMenuVisible] = useState(false);
	const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

	// Delete modal state
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [bulkDeleteTasks, { isLoading: isDeleting }] = useBulkDeleteTasksMutation();

	// Context menu handler
	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setContextMenuPosition({ x: e.clientX, y: e.clientY });
		setContextMenuVisible(true);
	};

	// Copy task title to clipboard
	const handleCopyTask = async () => {
		const markdown = serializeTaskToMarkdown(task);
		await navigator.clipboard.writeText(markdown);
		dispatch(showToast('Task copied to clipboard'));
	};

	// Delete single task using bulk endpoint
	const handleDelete = async () => {
		try {
			await bulkDeleteTasks([task.id]).unwrap();
			setDeleteModalOpen(false);
			dispatch(showToast('Task deleted'));
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	};

	// Menu items configuration
	const menuItems = [
		{
			icon: 'content_copy',
			label: 'Copy Task',
			onClick: handleCopyTask,
		},
		{
			icon: 'delete',
			label: 'Delete Task',
			onClick: () => setDeleteModalOpen(true),
			isDanger: true,
		},
	];

	return {
		contextMenuVisible,
		setContextMenuVisible,
		contextMenuPosition,
		handleContextMenu,
		deleteModalOpen,
		setDeleteModalOpen,
		isDeleting,
		handleDelete,
		menuItems,
	};
};
