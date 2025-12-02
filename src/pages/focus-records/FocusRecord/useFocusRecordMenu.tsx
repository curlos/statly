import { useState, useRef } from 'react';
import { useDeleteFocusRecordMutation } from '../../../services/resources/deleteApi';
import { serializeFocusRecordToMarkdown } from '../../../utils/focus-apps/focusRecords.utils';
import { useFocusRecordsQuery } from '../useFocusRecordsQuery';
import { useGetProjectsQuery } from '../../../services/resources/documentsProjectsApi';

interface UseFocusRecordMenuParams {
	focusRecord: any;
	completedTasksDuringFocusSession: any[];
	showFocusRecordEmotions: boolean;
}

export const useFocusRecordMenu = ({
	focusRecord,
	completedTasksDuringFocusSession,
	showFocusRecordEmotions
}: UseFocusRecordMenuParams) => {
	// Get ancestor tasks for breadcrumbs
    const { ancestorTasksById } = useFocusRecordsQuery();

    // Get projects for project names
    const { data: fetchedProjects } = useGetProjectsQuery();
    const { projectsById } = fetchedProjects || {};

	// Context menu state
	const [contextMenuVisible, setContextMenuVisible] = useState(false);
	const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deleteFocusRecord, { isLoading: isDeleting }] = useDeleteFocusRecordMutation();

	// Dropdown state
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownOpenMobile, setDropdownOpenMobile] = useState(false);
	const dropdownToggleRef = useRef<HTMLDivElement>(null);
	const dropdownToggleRefMobile = useRef<HTMLDivElement>(null);

	// Context menu handlers
	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		setDropdownOpen(false); // Close dropdown when context menu opens
		setDropdownOpenMobile(false);
		setContextMenuPosition({ x: e.clientX, y: e.clientY });
		setContextMenuVisible(true);
	};

	const handleCopyNote = () => {
		if (focusRecord?.note) {
			navigator.clipboard.writeText(focusRecord?.note);
		}
	};

	const handleCopyCompletedTasks = () => {
		if (completedTasksDuringFocusSession.length > 0) {
			const tasksText = completedTasksDuringFocusSession
				.map((task: any) => `- [x] ${task.title}`)
				.join('\n');
			navigator.clipboard.writeText(tasksText);
		}
	};

	const handleCopyFocusRecord = () => {
		const markdown = serializeFocusRecordToMarkdown(focusRecord, showFocusRecordEmotions, ancestorTasksById, projectsById);
		navigator.clipboard.writeText(markdown);
	};

	const handleDelete = async () => {
		try {
			await deleteFocusRecord(focusRecord.id).unwrap();
			setDeleteModalOpen(false);
		} catch (error) {
			console.error('Error deleting focus record:', error);
		}
	};

	const thereAreCompletedTasks = completedTasksDuringFocusSession && completedTasksDuringFocusSession.length > 0;

	const menuItems = [
		{
			icon: 'content_copy',
			label: 'Copy Note',
			onClick: handleCopyNote,
			disabled: !focusRecord?.note || focusRecord?.note.trim() === '',
		},
		{
			icon: 'content_copy',
			label: 'Copy Completed Tasks',
			onClick: handleCopyCompletedTasks,
			disabled: !thereAreCompletedTasks,
		},
		{
			icon: 'content_copy',
			label: 'Copy Focus Record',
			onClick: handleCopyFocusRecord,
		},
		{
			icon: 'delete',
			label: 'Delete Record',
			onClick: () => setDeleteModalOpen(true),
			isDanger: true,
		},
	];

	return {
		// Context menu
		contextMenuVisible,
		setContextMenuVisible,
		contextMenuPosition,
		handleContextMenu,

		// Dropdown
		dropdownOpen,
		setDropdownOpen,
		dropdownToggleRef,
		dropdownOpenMobile,
		setDropdownOpenMobile,
		dropdownToggleRefMobile,

		// Delete modal
		deleteModalOpen,
		setDeleteModalOpen,
		isDeleting,
		handleDelete,

		// Menu configuration
		menuItems,
	};
};
