import { useSharedQueryParams } from '../../../hooks/useSharedQueryParams';
import { useUserSettingsContext } from '../../../pages/focus-records/useUserSettingsContext';
import { getFormattedDateAndTimeForFileName, getFormattedLongDay, formatDateTime } from '../../../utils/date.utils';
import { getFormattedDuration } from '../../../utils/focus-apps/helpers.utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { baseAPI } from '../../../services/api';
import { useDispatch } from 'react-redux';
import { getAppliedFiltersMarkdown } from './getAppliedFiltersMarkdown';
import { useGetProjectsQuery } from '../../../services/resources/documentsProjectsApi';
import { EMOTIONS } from '../../../utils/constants/constants.utils';

const useExportFocusRecords = () => {
	const dispatch = useDispatch();
	const { queryParams, urlValues } = useSharedQueryParams();
	const userSettings = useUserSettingsContext();
	const taskIdIncludeFocusRecordsFromSubtasks = userSettings?.focusRecordsPageSettings?.taskIdIncludeFocusRecordsFromSubtasks ?? true;
	const onlyExportTasksWithNoParent = userSettings?.focusRecordsPageSettings?.onlyExportTasksWithNoParent ?? true;
	const showFocusRecordEmotions = userSettings?.focusRecordsPageSettings?.showFocusRecordEmotions ?? true;
	const showEmotionCount = userSettings?.focusRecordsPageSettings?.showEmotionCount ?? false;
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	const serializeFocusRecordToMarkdown = (record: any) => {
		const { startTime, endTime, duration, tasks, completedTasks, note, emotions } = record;

		const startTimeObj = formatDateTime(startTime);
		const endTimeObj = formatDateTime(endTime);

		// Check if focus record crosses midnight
		const startDate = new Date(startTime);
		const endDate = new Date(endTime);
		const crossesMidnight = getFormattedLongDay(startDate) !== getFormattedLongDay(endDate);

		// Build date string with both dates if crosses midnight
		let dateStr = getFormattedLongDay(startDate);
		if (crossesMidnight) {
			dateStr += ` - ${getFormattedLongDay(endDate)}`;
		}
		dateStr += ` - ${startTimeObj.time} - ${endTimeObj.time} (${getFormattedDuration(duration, false)})`;

		const lines: string[] = [];

		// Date and duration
		lines.push(`### 📅 ${dateStr}`);

		// Tasks
		if (tasks && tasks.length > 0) {
			tasks.forEach((task: any) => {
				const taskStartTimeObj = formatDateTime(task.startTime);
				const taskEndTimeObj = formatDateTime(task.endTime);
				const taskTimeRange = `${taskStartTimeObj.time} - ${taskEndTimeObj.time}`;

				lines.push(`📝 ${task.title}: ${taskTimeRange}`);
			});
		}

		// Notes
		if (note) {
			lines.push(note.trim());
		}

		// Completed tasks
		if (completedTasks && completedTasks.length > 0) {
			lines.push(''); // Add blank line for separation
			lines.push(`###### ✅ Completed Tasks`);
			completedTasks.forEach((task: any) => {
				lines.push(`- [x] ${task.title}`);
			});
		}

		// Emotions
		if (showFocusRecordEmotions) {
			if (emotions && emotions.length > 0) {
				lines.push(''); // Add blank line for separation
				lines.push(`###### ❤️ Emotions`);
				emotions.forEach((emotionObj: any) => {
					const emotionData = EMOTIONS[emotionObj.emotion as keyof typeof EMOTIONS];
					const emoji = emotionData?.emoji || '';
					const emotionName = emotionData?.name || emotionObj.emotion.toUpperCase();
					const formattedScore = (emotionObj.score * 100).toFixed(0);
					lines.push(`- ${emoji} ${emotionName} - ${formattedScore}%`);
				});
			} else {
				const noneEmoji = EMOTIONS.none?.emoji || '⚫';
				lines.push(''); // Add blank line for separation
				lines.push(`###### ❤️ Emotions`);
				lines.push(`- ${noneEmoji} NONE`);
			}
		}

		return lines.join('\n');
	};

	const getFocusRecordsMarkdown = (focusRecords: any[], customTitle: string | null, totalDuration: number, emotionCounts?: Record<string, number>) => {
		const allFocusRecordsMarkdown: string[] = [];

		// Add title as H1 at the beginning
		const titleInfo = customTitle || `Focus Records (${focusRecords.length.toLocaleString()}) - ${getFormattedDuration(totalDuration, false)}`;
		allFocusRecordsMarkdown.push(`# ${titleInfo}\n`);

		// Add applied filters section (always shows, displays "None" if no filters)
		const appliedFiltersMarkdown = getAppliedFiltersMarkdown({ ...urlValues, projectsById });
		allFocusRecordsMarkdown.push(appliedFiltersMarkdown);

		// Add emotion counts if showEmotionCount is true and emotionCounts exist
		if (showEmotionCount && emotionCounts && Object.keys(emotionCounts).length > 0) {
			allFocusRecordsMarkdown.push('### Emotion Counts\n');

			// Sort emotions by count (descending) and then by name
			const sortedEmotions = Object.entries(emotionCounts).sort((a, b) => {
				if (b[1] !== a[1]) {
					return b[1] - a[1]; // Sort by count descending
				}
				return a[0].localeCompare(b[0]); // Then by name alphabetically
			});

			sortedEmotions.forEach(([emotion, count]) => {
				const emotionKey = emotion as keyof typeof EMOTIONS;
				const emotionData = EMOTIONS[emotionKey];
				const emoji = emotionData?.emoji || '';
				const emotionName = emotionData?.name || emotion.toUpperCase();
				allFocusRecordsMarkdown.push(`- ${emoji} ${emotionName} - ${count.toLocaleString()}x`);
			});

			allFocusRecordsMarkdown.push('');
		}

		// Add separator
		allFocusRecordsMarkdown.push('---\n');

		for (let i = 0; i < focusRecords.length; i++) {
			const focusRecord = focusRecords[i];
			const focusRecordMarkdown = serializeFocusRecordToMarkdown(focusRecord);
			allFocusRecordsMarkdown.push(focusRecordMarkdown);

			// Add separator between records (but not after the last one)
			if (i !== focusRecords.length - 1) {
				allFocusRecordsMarkdown.push('---\n');
			}
		}

		const finalMarkdown = allFocusRecordsMarkdown.join('\n');
		return finalMarkdown;
	};

	const handleCopyToClipboard = async () => {
		// Trigger the export query manually
		const result = await dispatch(
			baseAPI.endpoints.getFocusRecordsExport.initiate({
				...queryParams,
				'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': 'none',
			})
		);

		if (result.data) {
			const { records, totalDuration, emotionCounts } = result.data;
			const finalMarkdown = getFocusRecordsMarkdown(records, null, totalDuration, emotionCounts);

			// Copy to clipboard
			navigator.clipboard.writeText(finalMarkdown);
		}
	};

	const downloadSingleMarkdownFile = async () => {
		// Trigger the export query manually
		const result = await dispatch(
			baseAPI.endpoints.getFocusRecordsExport.initiate({
				...queryParams,
				'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': 'none',
			})
		);

		if (result.data) {
			const { records, totalDuration, emotionCounts } = result.data;
			const finalMarkdown = getFocusRecordsMarkdown(records, null, totalDuration, emotionCounts);

			// Download as single markdown file
			const blob = new Blob([finalMarkdown], { type: 'text/markdown;charset=utf-8' });
			saveAs(blob, 'focus_records.md');
		}
	};

	const downloadZipFolderOfGroupedFocusRecords = async (groupType: 'project' | 'task' | 'emotion') => {
		// Trigger the export query manually
		const result = await dispatch(
			baseAPI.endpoints.getFocusRecordsExport.initiate({
				...queryParams,
				'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': groupType,
			})
		);

		if (!result.data) {
			return;
		}

		const { grouped } = result.data;
		const zip = new JSZip();

		// Convert grouped object to array and sort by totalDuration (descending)
		const sortedGroups = Object.values(grouped)
			.map((groupData: any) => ({
				records: groupData.records,
				totalDuration: groupData.totalDuration,
				groupName: groupData.groupName,
				emotionCounts: groupData.emotionCounts,
			}))
			.sort((a, b) => b.totalDuration - a.totalDuration);

		// Calculate padding width based on total number of groups
		const totalGroups = sortedGroups.length;
		const paddingWidth = String(totalGroups).length;

		// Add files to ZIP
		sortedGroups.forEach(({ records, totalDuration, groupName, emotionCounts: groupEmotionCounts }, index) => {
			const formattedDuration = getFormattedDuration(totalDuration, false);
			const paddedIndex = String(index + 1).padStart(paddingWidth, '0');

			// For emotion grouping, add emoji to the group name
			let displayName = groupName;
			if (groupType === 'emotion') {
				const emotionKey = groupName.toLowerCase() as keyof typeof EMOTIONS;
				const emotionData = EMOTIONS[emotionKey];
				if (emotionData) {
					displayName = `${emotionData.emoji}_${groupName}`;
				}
			}

			// Title used in the markdown content
			const customTitle = `${displayName} - Focus Records (${records.length.toLocaleString()}) - ${formattedDuration}`;
			const markdown = getFocusRecordsMarkdown(records, customTitle, totalDuration, groupEmotionCounts);

			// Filename for the markdown file - sanitize forward slashes to prevent folder creation
			const sanitizedName = `${paddedIndex}_${displayName}_${formattedDuration}`.replace(/[\/\\?%*:|"<>]/g, '-');
			zip.file(`${sanitizedName}_.md`, markdown);
		});

		// Wait for ZIP generation to complete before saving
		await zip.generateAsync({ type: 'blob' }).then((blob) => {
			saveAs(blob, `FocusRecords_${getFormattedDateAndTimeForFileName()}.zip`);
		});
	};

	return { handleCopyToClipboard, downloadSingleMarkdownFile, downloadZipFolderOfGroupedFocusRecords };
};

export default useExportFocusRecords;
