import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useBulkDeleteTasksMutation } from '../../../services/resources/deleteApi';
import { serializeNestedDay, serializeDayWithCompletedTasks } from '../../../utils/completedTasks.utils';
import { tasksApi } from '../../../services/resources/tasksApi';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import type { Task, Project } from '../../../types/models';
import type { AncestorTask } from '../../../types/api';

// API Response Types
interface ParentTaskData {
	name: string;
	completedSubtasks: Task[];
}

interface NestedTaskNode {
	parentDirectChildrenCompletedTasks?: Record<string, NestedTaskNode>;
	directCompletedSubtasks?: Task[];
}

interface DayData {
	taskCount: number;
	[key: string]: NestedTaskNode | number;
}

interface FlatExportResponse {
	days: Array<{ dateStr: string; parentTasks: ParentTaskData[]; taskCount: number }>;
	totalTasks: number;
}

interface NestedExportResponse {
	[dateStr: string]: DayData | Record<string, AncestorTask> | number;
	ancestorTasksById: Record<string, AncestorTask>;
	totalTasks: number;
}

interface UseDayCardMenuParams {
	dateStr: string;
	completedTasksForDay: Task[];
	showIndentedTasks: boolean;
	projectsById?: Record<string, Project>;
}

export const useDayCardMenu = ({
	dateStr,
	completedTasksForDay,
	showIndentedTasks,
	projectsById
}: UseDayCardMenuParams) => {
	const dispatch = useDispatch();
	const userSettings = useUserSettingsContext();
	const taskIdIncludeCompletedTasksFromSubtasks = userSettings?.completedTasksPageSettings?.taskIdIncludeCompletedTasksFromSubtasks ?? true;
	const onlyExportTasksWithNoParent = userSettings?.completedTasksPageSettings?.onlyExportTasksWithNoParent ?? true;

	// Context menu state (right-click)
	const [contextMenuVisible, setContextMenuVisible] = useState(false);
	const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

	// Dropdown state (three-dot menu)
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownToggleRef = useRef<HTMLDivElement>(null);

	// Delete modal state
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [bulkDeleteTasks, { isLoading: isDeleting }] = useBulkDeleteTasksMutation();

	// Context menu handler
	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDropdownOpen(false); // Close dropdown if open
		setContextMenuPosition({ x: e.clientX, y: e.clientY });
		setContextMenuVisible(true);
	};

	// Copy entire day card as markdown
	const handleCopyDayCard = async () => {
		try {
			const exportMode = showIndentedTasks ? 'nested' : 'flat';
			const formattedDate = getFormattedShortMonthDay(new Date(dateStr));

			// Make API call to get all tasks for this specific day
			const result: { data?: unknown } = await (dispatch as (arg: unknown) => Promise<{ data?: unknown }>)(
				tasksApi.endpoints.getDaysWithCompletedTasksExport.initiate({
					'start-date': formattedDate,
					'end-date': formattedDate,
					'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
					'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
					'group-by': 'none',
					'export-mode': exportMode,
				})
			);

			if (result.data) {
				let markdown = '';

				if (exportMode === 'nested') {
					const nestedData = result.data as unknown as NestedExportResponse;
					const fetchedAncestorTasksById = nestedData.ancestorTasksById || {};

					// Get the day data (filter out metadata)
					const dayEntry = Object.entries(nestedData)
						.find(([key]) => key !== 'ancestorTasksById' && key !== 'totalTasks');

					if (dayEntry) {
						const [, nestedTasks] = dayEntry;
						markdown = serializeNestedDay(
							dateStr,
							nestedTasks as Record<string, unknown>,
							fetchedAncestorTasksById,
							projectsById
						);
					}
				} else {
					// Flat mode
					const flatData = result.data as unknown as FlatExportResponse;
					const dayData = flatData.days[0]; // Should only be one day

					if (dayData) {
						markdown = serializeDayWithCompletedTasks(
							dayData.dateStr,
							dayData.parentTasks,
							dayData.taskCount
						);
					}
				}

				await navigator.clipboard.writeText(markdown);
			}
		} catch (error) {
			console.error('Error copying day card:', error);
		}
	};

	// Delete all tasks for this day using bulk endpoint
	const handleDeleteAllTasks = async () => {
		try {
			// Collect all task IDs from the day
			const taskIds = completedTasksForDay.map(task => task.id);
			await bulkDeleteTasks(taskIds).unwrap();
			setDeleteModalOpen(false);
		} catch (error) {
			console.error('Error deleting tasks:', error);
		}
	};

	// Menu items configuration (same for both context menu and dropdown)
	const menuItems = [
		{
			icon: 'content_copy',
			label: 'Copy Day Card',
			onClick: handleCopyDayCard,
		},
		{
			icon: 'delete',
			label: `Delete ${completedTasksForDay.length} Tasks`,
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

		// Dropdown (three-dot menu)
		dropdownOpen,
		setDropdownOpen,
		dropdownToggleRef,

		// Delete modal
		deleteModalOpen,
		setDeleteModalOpen,
		isDeleting,
		handleDelete: handleDeleteAllTasks,

		// Shared
		menuItems,
	};
};
