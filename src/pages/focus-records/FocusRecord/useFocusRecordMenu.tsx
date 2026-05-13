import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDeleteFocusRecordMutation } from '../../../services/resources/deleteApi';
import { serializeFocusRecordToMarkdown } from '../../../utils/focusRecords.utils';
import { useFocusRecordsQuery } from '../useFocusRecordsQuery';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import { showToast } from '../../../slices/toastSlice';
import type { FocusRecord, Task, Project } from '../../../types/models';

interface UseFocusRecordMenuParams {
	focusRecord: FocusRecord;
	completedTasksDuringFocusSession: Task[];
	showFocusRecordEmotions: boolean;
	pendingFocusIdRef?: React.MutableRefObject<string | null>;
}

export const useFocusRecordMenu = ({
	focusRecord,
	completedTasksDuringFocusSession,
	showFocusRecordEmotions,
	pendingFocusIdRef,
}: UseFocusRecordMenuParams) => {
	// Get ancestor tasks for breadcrumbs
    const { ancestorTasksById } = useFocusRecordsQuery();

    // Get projects for project names
    const { data: fetchedProjects } = useGetProjectsQuery();
    const { projectsById } = fetchedProjects || {};

	const dispatch = useDispatch();

	const articleRef = useRef<HTMLElement>(null);

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
			navigator.clipboard.writeText(focusRecord.note);
			dispatch(showToast('Note copied to clipboard'));
		}
	};

	const handleCopyCompletedTasks = () => {
		if (completedTasksDuringFocusSession.length > 0) {
			const tasksText = completedTasksDuringFocusSession
				.map((task) => `- [x] ${task.title}`)
				.join('\n');
			navigator.clipboard.writeText(tasksText);
			dispatch(showToast('Completed tasks copied to clipboard'));
		}
	};

	const handleCopyFocusRecord = () => {
		const markdown = serializeFocusRecordToMarkdown(focusRecord, showFocusRecordEmotions, ancestorTasksById as Record<string, Task> | undefined, projectsById as Record<string, Project> | undefined);
		navigator.clipboard.writeText(markdown);
		dispatch(showToast('Focus record copied to clipboard'));
	};

	const handleDelete = async () => {
		// Store sibling's ID in the list's ref so FocusRecordList can focus it after refetch
		const el = articleRef.current;
		if (el?.parentElement && pendingFocusIdRef) {
			const siblings = Array.from(el.parentElement.querySelectorAll<HTMLElement>('[data-focus-record-id]'));
			const idx = siblings.indexOf(el);
			const sibling = siblings[idx + 1] ?? siblings[idx - 1] ?? null;
			pendingFocusIdRef.current = sibling?.getAttribute('data-focus-record-id') ?? null;
		}

		try {
			await deleteFocusRecord(focusRecord.id).unwrap();
			setDeleteModalOpen(false);
			dispatch(showToast('Focus record deleted'));
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
		// Article ref for post-delete focus management
		articleRef,

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
