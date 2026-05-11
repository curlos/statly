import classNames from 'classnames';
import { navigate } from 'vike/client/router';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { getFormattedDuration } from '../../../../utils/helpers.utils';
import { usePageContext } from 'vike-react/usePageContext';
import { shouldBreakAllText } from '../../../../utils/text.utils';
import type { ProgressBarItemData } from '../../../../types/stats';
import type { Project } from '../../../../types/models';
import type { AncestorTask } from '../../../../types/api';
import { sourceToAppName } from '../../../../utils/focusRecords.utils';

interface ProgressBarProps {
	item: ProgressBarItemData;
	projectsById: Record<string, Project>;
	sessionCategoriesById: Record<string, Project>;
	metricType?: 'duration' | 'count';
	ancestorTasksById: Record<string, AncestorTask>;
	intervalStartDate: string;
	intervalEndDate: string;
	emotionId?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ item, projectsById, sessionCategoriesById, metricType = 'duration', ancestorTasksById, intervalStartDate, intervalEndDate, emotionId }) => {
	const { colorMode } = useThemeContext();
	const pageContext = usePageContext();

	const isFocusDuration = metricType === 'duration';
	const isCompletedTasks = metricType === 'count';

	const getHref = (customItem?: { id: string; type: 'task' | 'project' | 'emotion' }) => {
		const params = new URLSearchParams(pageContext.urlParsed.search);
		const targetItem = customItem || item;
		const { id, type } = targetItem;

		switch (type) {
			case 'task':
				params.set('task-id', id);
				break;
			case 'project':
				if (sessionCategoriesById[id]) {
					params.set('categories', id);
					// If the project is one of the focus apps that don't have separate projects (Forest, Tide, and BeFocused).
				} else if (id === 'forest-app' || id === 'tide-ios-app' || id === 'be-focused-app') {
					params.set('focus-apps', id);
				} else {
					// If the project is from TickTick. This is used as a default for now but in the future, session's "categories" should also be categorized under this.
					params.set('projects', id);
				}
				break;
			case 'emotion':
				// Set the emotion filter (handles both regular emotions and no-emotions)
				params.set('emotions', id);
				break;
		}

		// Add emotion filter if viewing within an emotion group (nested view)
		if (emotionId) {
			params.set('emotions', emotionId);
		}

		// Add interval date params if they exist (for two-tier filtering)
		if (intervalStartDate) {
			params.set('interval-start-date', intervalStartDate);
		}
		if (intervalEndDate) {
			params.set('interval-end-date', intervalEndDate);
		}

		const queryString = params.toString();
		const targetPage = isCompletedTasks ? '/completed-tasks' : '/focus-records';
		return targetPage + (queryString ? `?${queryString}` : '');
	};

	const formattedMetric = isFocusDuration
		? getFormattedDuration(item.duration ?? 0, false)
		: `${item.count?.toLocaleString() || 0} task${item.count !== 1 ? 's' : ''}`;

	const color = item.type === 'task' ? (item.projectId && projectsById[item.projectId]?.color || item.color || '#808080') : (item.color || '#808080')

	let topMostAncestorTaskName = null
	let topMostAncestorTaskId: string | null = null
	let projectName = null
	let projectId: string | null | undefined = null

	// For "Stats - Focus", the tasks that are displayed can be unclear since it could be a task like "BUILD" which is the task's name BUT I need more context like "BUILD - MG JUSTICE (GUNPLA)" which'll tell me which GUNPLA this "BUILD" task is for.
	if (item.type === 'task' && ancestorTasksById && item.id) {
		const fullTask = ancestorTasksById[item.id]
		topMostAncestorTaskId = fullTask?.ancestorIds?.[fullTask.ancestorIds.length - 1]
		const fullTopMostAncestorTask = topMostAncestorTaskId ? ancestorTasksById[topMostAncestorTaskId] : undefined

		if (topMostAncestorTaskId !== item.id) {
			topMostAncestorTaskName = fullTopMostAncestorTask?.title
		}

		projectId = item.projectId
		const taskProject = projectId ? projectsById[projectId] : undefined
		projectName = taskProject?.name || projectId
	}

	const shouldBreakAll = shouldBreakAllText(item.name);

	// If no projectName, it's from a non-TickTick/Session app - use the app name
	if (!projectName && item.name !== 'No Data' || (projectName && projectName in sourceToAppName)) {
		projectName = item.projectId ? sourceToAppName[item.projectId] || null : null;
	}

	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-1 w-full">
				<div>
					<a
						href={getHref()}
						className={classNames(
							'text-[14px] md:text-[16px]',
							'cursor-pointer hover:underline text-left',
							{ 'break-all': shouldBreakAll }
						)}
						onClick={(e) => { e.preventDefault(); navigate(getHref()); }}
					>
						{item.name}
					</a>

					<div className="text-color-gray-25">
						{topMostAncestorTaskName && topMostAncestorTaskId && (
							<a
								href={getHref({ id: topMostAncestorTaskId, type: 'task' })}
								className="cursor-pointer hover:underline"
								onClick={(e) => { e.preventDefault(); navigate(getHref({ id: topMostAncestorTaskId, type: 'task' })); }}
							>
								{topMostAncestorTaskName}
							</a>
						)}
						{topMostAncestorTaskName && <span>{" - "}</span>}
						{projectName && topMostAncestorTaskName && <span>(</span>}
						{projectName && projectId && (
							<a
								href={getHref({ id: projectId, type: 'project' })}
								className="cursor-pointer hover:underline"
								onClick={(e) => { e.preventDefault(); navigate(getHref({ id: projectId, type: 'project' })); }}
							>
								{projectName}
							</a>
						)}
						{projectName && topMostAncestorTaskName && <span>)</span>}
					</div>
				</div>

				<div className="text-[14px] md:text-[16px] text-color-gray-25 text-nowrap">
					{formattedMetric} • {item.percentage}%
				</div>
			</div>
			<div key={item.id} className={classNames('rounded-full', colorMode === 'dark' ? 'bg-[#232323]' : 'bg-[rgb(187,187,187)]')}>
				<div
					className={`text-xs font-medium text-blue-100 text-center p-[3px] leading-none rounded-full`}
					style={{ width: `${item.percentage}%`, backgroundColor: color }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
