import { getFormattedLongDay, formatDateTime } from './date.utils';
import { getFormattedDuration } from './helpers.utils';
import { EMOTIONS } from './constants/constants.utils';

const sourceToAppName: Record<string, string> = {
	'FocusRecordSession': 'Session',
	'FocusRecordBeFocused': 'Be Focused',
	'FocusRecordForest': 'Forest',
	'FocusRecordTide': 'Tide'
};

/**
 * @description Serializes a focus record to markdown format
 * Used for copying focus records to clipboard and exporting them
 * @param record - The focus record to serialize
 * @param showFocusRecordEmotions - Whether to include emotions in the output
 * @param ancestorTasksById - Optional map of task IDs to task objects for getting ancestors
 * @param projectsById - Optional map of project IDs to project objects for getting project names
 */
export const serializeFocusRecordToMarkdown = (
	record: any,
	showFocusRecordEmotions: boolean = true,
	ancestorTasksById?: Record<string, any>,
	projectsById?: Record<string, any>
) => {
	const { startTime, endTime, duration, tasks, completedTasks, note, emotions, source } = record;

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

			// Format task title with ancestors if available
			let taskTitle = task.title;
			const projectName = sourceToAppName[source] || projectsById?.[task?.projectId]?.name

			if (ancestorTasksById && task.taskId) {
				const parentTask = ancestorTasksById[task.taskId];
				if (parentTask) {
					const parentTaskTitle = parentTask.title || parentTask.content || task.title;
					const ancestorIds = parentTask.ancestorIds?.filter((id: string) => id !== task.taskId) || [];

					// Build breadcrumb trail
					const breadcrumbs = ancestorIds.map((ancestorId: string) => {
						const ancestorTask = ancestorTasksById[ancestorId];
						return ancestorTask?.title || ancestorTask?.content || ancestorId;
					});

					// Format: **MainTask** > Ancestor1 > Ancestor2
					if (breadcrumbs.length > 0) {
						taskTitle = `**${parentTaskTitle}** > ${breadcrumbs.join(' > ')}`;
					} else {
						taskTitle = `**${parentTaskTitle}**`;
					}
				}
			}

			// Add project name if available
			const projectSuffix = projectName ? ` - (${projectName})` : '';
			lines.push(`📝 ${taskTitle}${projectSuffix}: ${taskTimeRange}`);
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