import JSZip from 'jszip';
import { useUserSettingsContext } from '../../../pages/focus-records/useUserSettingsContext';
import { saveAs } from 'file-saver';
import { getFormattedDateAndTimeForFileName } from '../../../utils/date.utils';
import { useSharedQueryParams } from '../../../hooks/useSharedQueryParams';
import { baseAPI } from '../../../services/api';
import { useDispatch } from 'react-redux';
import { getAppliedFiltersMarkdown } from './getAppliedFiltersMarkdown';
import { useGetProjectsQuery } from '../../../services/resources/documentsProjectsApi';

const useExportCompletedTasks = () => {
	const dispatch = useDispatch();
	const { queryParams, urlValues } = useSharedQueryParams();
	const userSettings = useUserSettingsContext();
	const taskIdIncludeCompletedTasksFromSubtasks = userSettings?.completedTasksPageSettings?.taskIdIncludeCompletedTasksFromSubtasks ?? true;
	const onlyExportTasksWithNoParent = userSettings?.completedTasksPageSettings?.onlyExportTasksWithNoParent ?? true;
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	function serializeDayWithCompletedTasks(dateStr, parentTasks, taskCount) {
		const lines = [];
		// Remove leading zero from day (e.g., "January 01, 2025" -> "January 1, 2025")
		const formattedDateStr = dateStr.replace(/\b0(\d),/, '$1,');
		lines.push(`### 📅 ${formattedDateStr} (${taskCount})\n`);

		parentTasks.forEach((parentTaskData, index) => {
			const { name, completedSubtasks } = parentTaskData;

			// Name already includes <b> tags from backend for the actual task name
			lines.push(`📝 ${name}`);

			completedSubtasks.forEach((task) => {
				lines.push(`- [x] ${task.title || task.content}`);
			});

			// Add an empty line after each task group, but no extra newline
			if (index !== parentTasks.length - 1) {
				lines.push('');
			}
		});

		return lines.join('\n');
	}

	const getCompletedTasksMarkdown = (days, customTitle, totalTasks) => {
		const allDaysWithCompletedTasksMarkdown = [];

		// Add title as H1 at the beginning
		const titleInfo = customTitle || `Completed Tasks (${totalTasks.toLocaleString()})`;
		allDaysWithCompletedTasksMarkdown.push(`# ${titleInfo}\n`);

		// Add applied filters section (always shows, displays "None" if no filters)
		const appliedFiltersMarkdown = getAppliedFiltersMarkdown({ ...urlValues, projectsById });
		allDaysWithCompletedTasksMarkdown.push(appliedFiltersMarkdown);

		for (let i = 0; i < days.length; i++) {
			const day = days[i];
			const dayMarkdown = serializeDayWithCompletedTasks(
				day.dateStr,
				day.parentTasks,
				day.taskCount
			);

			allDaysWithCompletedTasksMarkdown.push(dayMarkdown);

			// Add separator between days (but not after the last one)
			if (i !== days.length - 1) {
				allDaysWithCompletedTasksMarkdown.push('---\n');
			}
		}

		const finalMarkdown = allDaysWithCompletedTasksMarkdown.join('\n');
		return finalMarkdown;
	};

	const handleCopyToClipboard = async () => {
		// Trigger the export query manually
		const result = await dispatch(
			baseAPI.endpoints.getDaysWithCompletedTasksExport.initiate({
				...queryParams,
				'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': 'none',
			})
		);

		if (result.data) {
			const { days, totalTasks } = result.data;
			const finalMarkdown = getCompletedTasksMarkdown(days, null, totalTasks);

			// Copy to clipboard with error handling
			try {
				await navigator.clipboard.writeText(finalMarkdown);
				return { success: true };
			} catch (error) {
				console.error('Failed to copy to clipboard:', error);
				return { success: false, error };
			}
		}

		return { success: false, error: new Error('No data to copy') };
	};

	const downloadSingleMarkdownFile = async () => {
		// Trigger the export query manually
		const result = await dispatch(
			baseAPI.endpoints.getDaysWithCompletedTasksExport.initiate({
				...queryParams,
				'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': 'none',
			})
		);

		if (result.data) {
			const { days, totalTasks } = result.data;
			const finalMarkdown = getCompletedTasksMarkdown(days, null, totalTasks);

			// Download as single markdown file
			const blob = new Blob([finalMarkdown], { type: 'text/markdown;charset=utf-8' });
			saveAs(blob, 'completed_tasks.md');
		}
	};

	const downloadZipFolderOfGroupedCompletedTasks = async (groupType) => {
		// Trigger the export query manually
		const result = await dispatch(
			baseAPI.endpoints.getDaysWithCompletedTasksExport.initiate({
				...queryParams,
				'task-id-include-completed-tasks-from-subtasks': taskIdIncludeCompletedTasksFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': groupType,
			})
		);

		if (!result.data) {
			return;
		}

		const { grouped } = result.data;
		const zip = new JSZip();

		// Convert grouped object to array and sort by totalCompletedTasks (descending)
		const sortedGroups = Object.values(grouped)
			.map((groupData) => ({
				days: groupData.days,
				totalCompletedTasks: groupData.totalCompletedTasks,
				groupName: groupData.groupName,
			}))
			.sort((a, b) => b.totalCompletedTasks - a.totalCompletedTasks);

		// Calculate padding width based on total number of groups
		const totalGroups = sortedGroups.length;
		const paddingWidth = String(totalGroups).length;

		// Add files to ZIP
		sortedGroups.forEach(({ days, totalCompletedTasks, groupName }, index) => {
			const paddedIndex = String(index + 1).padStart(paddingWidth, '0');

			// Title used in the markdown content
			const customTitle = `${groupName} - Completed Tasks (${totalCompletedTasks.toLocaleString()})`;
			const markdown = getCompletedTasksMarkdown(days, customTitle, totalCompletedTasks);

			// Filename for the markdown file - sanitize forward slashes to prevent folder creation
			const sanitizedName = `${paddedIndex}_${groupName}_(${totalCompletedTasks.toLocaleString()})`.replace(/[\/\\?%*:|"<>]/g, '-');
			zip.file(`${sanitizedName}.md`, markdown);
		});

		// Wait for ZIP generation to complete before saving
		await zip.generateAsync({ type: 'blob' }).then((blob) => {
			saveAs(blob, `CompletedTasks_${getFormattedDateAndTimeForFileName()}.zip`);
		});
	};

	return { handleCopyToClipboard, downloadSingleMarkdownFile, downloadZipFolderOfGroupedCompletedTasks };
};

export default useExportCompletedTasks;
