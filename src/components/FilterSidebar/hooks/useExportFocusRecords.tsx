import { useSharedQueryParams } from '../../../hooks/useSharedQueryParams';
import { useUserSettingsContext } from '../../../pages/focus-records/useUserSettingsContext';
import { getFormattedDateAndTimeForFileName } from '../../../utils/date.utils';
import { serializeFocusRecordToMarkdown } from '../../../utils/focusRecords.utils';
import { getFormattedDuration } from '../../../utils/helpers.utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { focusRecordsApi } from '../../../services/resources/focusRecordsApi';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../types/redux';
import { getAppliedFiltersMarkdown } from './getAppliedFiltersMarkdown';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import { EMOTIONS } from '../../../utils/constants/constants.utils';
import type { FocusRecord } from '../../../types/models';

interface FocusRecordsExportData {
	records: FocusRecord[];
	totalDuration: number;
	emotionCounts?: Record<string, number>;
	noteStats?: { totalCharacters: number; totalWords: number };
	grouped?: Record<string, {
		records: FocusRecord[];
		totalDuration: number;
		groupName: string;
		emotionCounts?: Record<string, number>;
	}>;
}

const useExportFocusRecords = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { queryParams, urlValues } = useSharedQueryParams();
	const userSettings = useUserSettingsContext();
	const taskIdIncludeFocusRecordsFromSubtasks = userSettings?.focusRecordsPageSettings?.taskIdIncludeFocusRecordsFromSubtasks ?? true;
	const onlyExportTasksWithNoParent = userSettings?.focusRecordsPageSettings?.onlyExportTasksWithNoParent ?? true;
	const showFocusRecordEmotions = userSettings?.focusRecordsPageSettings?.showFocusRecordEmotions ?? true;
	const showEmotionCount = userSettings?.focusRecordsPageSettings?.showEmotionCount ?? false;
	const showNoteStats = userSettings?.focusRecordsPageSettings?.showNoteStats ?? false;
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};


	const getFocusRecordsMarkdown = (focusRecords: FocusRecord[], customTitle: string | null, totalDuration: number, emotionCounts?: Record<string, number>, noteStats?: { totalCharacters: number; totalWords: number }) => {
		const allFocusRecordsMarkdown: string[] = [];

		// Add title as H1 at the beginning
		const titleInfo = customTitle || `Focus Records (${focusRecords.length.toLocaleString()}) - ${getFormattedDuration(totalDuration, false)}`;
		allFocusRecordsMarkdown.push(`# ${titleInfo}\n`);

		// Add note stats if showNoteStats is true and noteStats exist
		if (showNoteStats && noteStats && (noteStats.totalCharacters > 0 || noteStats.totalWords > 0)) {
			allFocusRecordsMarkdown.push('### Notes\n');
			allFocusRecordsMarkdown.push(`- ${noteStats.totalCharacters.toLocaleString()} characters`);
			allFocusRecordsMarkdown.push(`- ${noteStats.totalWords.toLocaleString()} words\n`);
		}

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
			// Note: ancestorTasksById and projectsById are not needed here because the export API
			// already returns records with formatted task titles that include ancestors and projects
			const focusRecordMarkdown = serializeFocusRecordToMarkdown(focusRecord, showFocusRecordEmotions);
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
			focusRecordsApi.endpoints.getFocusRecordsExport.initiate({
				...queryParams,
				'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': 'none',
			})
		);

		if (result.data) {
			const data = result.data as FocusRecordsExportData;
			const { records, totalDuration, emotionCounts, noteStats } = data;
			const finalMarkdown = getFocusRecordsMarkdown(records, null, totalDuration, emotionCounts, noteStats);

			// Copy to clipboard
			navigator.clipboard.writeText(finalMarkdown);
		}
	};

	const downloadSingleMarkdownFile = async () => {
		// Trigger the export query manually
		const result = await dispatch(
			focusRecordsApi.endpoints.getFocusRecordsExport.initiate({
				...queryParams,
				'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': 'none',
			})
		);

		if (result.data) {
			const data = result.data as FocusRecordsExportData;
			const { records, totalDuration, emotionCounts, noteStats } = data;
			const finalMarkdown = getFocusRecordsMarkdown(records, null, totalDuration, emotionCounts, noteStats);

			// Download as single markdown file
			const blob = new Blob([finalMarkdown], { type: 'text/markdown;charset=utf-8' });
			saveAs(blob, 'focus_records.md');
		}
	};

	const downloadZipFolderOfGroupedFocusRecords = async (groupType: 'project' | 'task' | 'emotion') => {
		// Trigger the export query manually
		const result = await dispatch(
			focusRecordsApi.endpoints.getFocusRecordsExport.initiate({
				...queryParams,
				'task-id-include-focus-records-from-subtasks': taskIdIncludeFocusRecordsFromSubtasks,
				'only-export-tasks-with-no-parent': onlyExportTasksWithNoParent,
				'group-by': groupType,
			})
		);

		if (!result.data) {
			return;
		}

		const data = result.data as FocusRecordsExportData;
		const { grouped } = data;
		const zip = new JSZip();

		if (!grouped) {
			return;
		}

		// Convert grouped object to array and sort by totalDuration (descending)
		const sortedGroups = Object.values(grouped)
			.map((groupData) => ({
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

			// Calculate note stats for this group if showNoteStats is enabled
			let groupNoteStats = undefined;
			if (showNoteStats) {
				let totalCharacters = 0;
				let totalWords = 0;
				records.forEach(record => {
					if (record.note) {
						totalCharacters += record.note.length;
						const trimmedNote = record.note.trim();
						if (trimmedNote) {
							totalWords += trimmedNote.split(' ').length;
						}
					}
				});
				groupNoteStats = { totalCharacters, totalWords };
			}

			// Title used in the markdown content
			const customTitle = `${displayName} - Focus Records (${records.length.toLocaleString()}) - ${formattedDuration}`;
			const markdown = getFocusRecordsMarkdown(records, customTitle, totalDuration, groupEmotionCounts, groupNoteStats);

			// Filename for the markdown file - sanitize forward slashes to prevent folder creation
			const sanitizedName = `${paddedIndex}_${displayName}_${formattedDuration}`.replace(/[/\\?%*:|"<>]/g, '-');
			// Adjust date to local timezone to fix zip file timestamp display
			const localDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
			zip.file(`${sanitizedName}_.md`, markdown, { date: localDate });
		});

		// Wait for ZIP generation to complete before saving
		await zip.generateAsync({ type: 'blob' }).then((blob) => {
			saveAs(blob, `FocusRecords_${getFormattedDateAndTimeForFileName()}.zip`);
		});
	};

	return { handleCopyToClipboard, downloadSingleMarkdownFile, downloadZipFolderOfGroupedFocusRecords };
};

export default useExportFocusRecords;
