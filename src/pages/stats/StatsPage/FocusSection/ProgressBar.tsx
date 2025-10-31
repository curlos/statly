import classNames from 'classnames';
import { navigate } from 'vike/client/router';
import { getFormattedDuration } from '../../../../utils/focus-apps/helpers.utils';
import { usePageContext } from 'vike-react/usePageContext';
import { shouldBreakAllText } from '../../../../utils/text.utils';

const ProgressBar = ({ item, projectsById, sessionCategoriesById, metricType = 'duration', ancestorTasksById, intervalStartDate, intervalEndDate }) => {
	const pageContext = usePageContext();
	const searchParams = new URLSearchParams(pageContext.urlParsed.search);

	const isFocusDuration = metricType === 'duration';
	const isCompletedTasks = metricType === 'count';

	const handleGoToPage = () => {
		const { id } = item;

		switch (item.type) {
			case 'task':
				searchParams.set('task-id', id);
				break;
			case 'project':
				// If the project is from TickTick.
				if (projectsById[id]) {
					searchParams.set('projects', id);
					// If the project is a category from "Session App".
				} else if (sessionCategoriesById[id]) {
					searchParams.set('categories', id);
					// If the project is one of the focus apps that don't have separate projects (Forest, Tide, and BeFocused).
				} else if (id === 'forest-app' || id === 'tide-ios-app' || id === 'be-focused-app') {
					searchParams.set('focus-apps', id);
				}

				break;
		}

		// Add interval date params if they exist (for two-tier filtering)
		if (intervalStartDate) {
			searchParams.set('interval-start-date', intervalStartDate);
		}
		if (intervalEndDate) {
			searchParams.set('interval-end-date', intervalEndDate);
		}

		const queryString = searchParams.toString();
		const targetPage = isCompletedTasks ? '/completed-tasks' : '/focus-records';
		navigate(targetPage + (queryString ? `?${queryString}` : ''));
	};

	const formattedMetric = isFocusDuration
		? getFormattedDuration(item.duration, false)
		: `${item.count?.toLocaleString() || 0} task${item.count !== 1 ? 's' : ''}`;

	const color = item.type === 'task' ? (projectsById[item?.projectId]?.color || item.color || '#808080') : (item.color || '#808080')

	let topMostAncestorTaskName = null
	let projectName = null

	// For "Stats - Focus", the tasks that are displayed can be unclear since it could be a task like "BUILD" which is the task's name BUT I need more context like "BUILD - MG JUSTICE (GUNPLA)" which'll tell me which GUNPLA this "BUILD" task is for.
	if (item.type === 'task' && ancestorTasksById) {
		const fullTask = ancestorTasksById[item.id]
		const topMostAncestorTaskId = fullTask?.ancestorIds[fullTask.ancestorIds.length - 1]
		const fullTopMostAncestorTask = ancestorTasksById[topMostAncestorTaskId]

		if (topMostAncestorTaskId !== item.id) {
			topMostAncestorTaskName = fullTopMostAncestorTask?.title
		}

		const taskProject = projectsById[item.projectId]
		projectName = taskProject?.name
	}

	const shouldBreakAll = shouldBreakAllText(item.name);

	// If no projectName, it's from a non-TickTick/Session app - use the app name
	if (!projectName && item.value !== 'No Data') {
		const sourceToAppName: Record<string, string> = {
			'FocusRecordSession': 'Session',
			'FocusRecordBeFocused': 'Be Focused',
			'FocusRecordForest': 'Forest',
			'FocusRecordTide': 'Tide'
		};
		projectName = sourceToAppName[item?.projectId] || null;
	}

	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-1 w-full">
				<div>
					<div
						className={classNames(
							'text-[14px] md:text-[16px] lg:text-[14px] xl:text-[16px]',
							'cursor-pointer hover:underline',
							{ 'break-all': shouldBreakAll }
						)}
						onClick={handleGoToPage}
					>
						{item.name}
					</div>

					<div className="text-color-gray-100">
						{topMostAncestorTaskName && <span>{topMostAncestorTaskName}{" - "}</span>}
						{projectName && (topMostAncestorTaskName ? <span>({projectName})</span> : (<span>{projectName}</span>))}
					</div>
				</div>

				<div className="text-[14px] md:text-[16px] lg:text-[14px] xl:text-[16px] text-[#8C8C8C] text-nowrap">
					{formattedMetric} • {item.percentage}%
				</div>
			</div>
			<div key={item.id} className="rounded-full dark:bg-[#232323]">
				<div
					className={`text-xs font-medium text-blue-100 text-center p-[3px] leading-none rounded-full`}
					style={{ width: `${item.percentage}%`, backgroundColor: color }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;
