import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import classNames from 'classnames';
import { useState } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import {
	useGetTodoistAllTasksQuery,
	useGetTodoistAllProjectsQuery,
	useGetSessionAppFocusRecordsQuery,
	useGetBeFocusedAppFocusRecordsQuery,
	useGetForestAppFocusRecordsQuery,
	useGetTideAppFocusRecordsQuery,
} from '../../../services/resources/oldFocusAppsApi';
import {
	useGetAllTasksQuery,
	useGetAllProjectsQuery,
	useGetPomoAndStopwatchFocusRecordsQuery,
	useGetAllTagsQuery,
} from '../../../services/resources/ticktickOneApi';
import Icon from '../../Icon';
import Spinner from '../../Loaders/Spinner';
import { getFormattedDateAndTimeForFileName } from '../../../utils/date.utils';

const BackupData = () => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks, isLoading: isLoadingGetTasks } = useGetAllTasksQuery();

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistTasks, isLoading: isLoadingGetTodoistTasks } = useGetTodoistAllTasksQuery();

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();

	// RTK Query - Todoist - Projects
	const { data: fetchedTodoistAllProjects, isLoading: isLoadingGetTodoistProjects } = useGetTodoistAllProjectsQuery();

	// FOCUS RECORDS FROM ALL APPS
	// RTK Query - TickTick 1.0 - Focus Records
	const { data: fetchedFocusRecordsTickTick, isLoading: isLoadingGetFocusRecords } =
		useGetPomoAndStopwatchFocusRecordsQuery();

	// RTK Query - Session App - Focus Records
	const { data: fetchedFocusRecordsSession, isLoading: isLoadingGetSessionFocusRecords } =
		useGetSessionAppFocusRecordsQuery();

	// RTK Query - BeFocused App - Focus Records
	const { data: fetchedFocusRecordsBeFocused, isLoading: isLoadingGetBeFocusedAppFocusRecords } =
		useGetBeFocusedAppFocusRecordsQuery();

	// RTK Query - Forest App - Focus Records
	const { data: fetchedFocusRecordsForest, isLoading: isLoadingGetForestAppFocusRecords } =
		useGetForestAppFocusRecordsQuery();

	// RTK Query - Tide App - Focus Records
	const { data: fetchedFocusRecordsTide, isLoading: isLoadingGetTideFocusRecords } = useGetTideAppFocusRecordsQuery();

	// RTK Query - TickTick 1.0 - Tags
	const { data: fetchedTags, isLoading: isLoadingGetTags } = useGetAllTagsQuery();

	const { chosenColorObj } = useThemeContext();
	const [status, setStatus] = useState('none');

	const zip = new JSZip();

	const downloadZipFolderOfImportantData = () => {
		const importantApiResponsesArr = [
			// TASKS
			{
				fileName: 'ticktick-tasks',
				apiEndpointName: '/ticktick/tasks',
				response: fetchedTasks.tasks,
			},
			{
				fileName: 'todoist-tasks',
				apiEndpointName: '/old-focus-apps/todoist-all-tasks',
				response: fetchedTodoistTasks.todoistAllTasks,
			},

			// PROJECTS
			{
				fileName: 'ticktick-projects',
				apiEndpointName: '/ticktick/projects',
				response: fetchedProjects.projects,
			},
			{
				fileName: 'todoist-projects',
				apiEndpointName: '/old-focus-apps/todoist-all-projects',
				response: fetchedTodoistAllProjects.todoistAllProjects,
			},

			// FOCUS RECORDS
			{
				fileName: 'ticktick-focus-records',
				apiEndpointName: '/ticktick/focus-records',
				response: fetchedFocusRecordsTickTick.focusRecords,
			},
			{
				fileName: 'session-app-focus-records',
				apiEndpointName: '/old-focus-apps/focus-records/session-app?no-breaks=true',
				response: fetchedFocusRecordsSession.sessionFocusRecords,
			},
			{
				fileName: 'be-focused-app-focus-records',
				apiEndpointName: '/old-focus-apps/focus-records/be-focused-app',
				response: fetchedFocusRecordsBeFocused.beFocusedAppFocusRecords,
			},
			{
				fileName: 'forest-app-focus-records',
				apiEndpointName: '/old-focus-apps/focus-records/forest-app?before-session-app=true',
				response: fetchedFocusRecordsForest.forestAppFocusRecords,
			},
			{
				fileName: 'tide-app-focus-records',
				apiEndpointName: '/old-focus-apps/focus-records/tide-app',
				response: fetchedFocusRecordsTide.tideAppFocusRecords,
			},

			// TAGS
			{
				fileName: 'ticktick-tags',
				apiEndpointName: '/ticktick/tags',
				response: fetchedTags.tags,
			},
		];

		for (const data of importantApiResponsesArr) {
			zip.file(`${data.fileName}.json`, JSON.stringify(data, null, 4));
		}

		zip.generateAsync({ type: 'blob' }).then((blob) => {
			saveAs(blob, `Backup_Tasks_FocusRecords_Tags_${getFormattedDateAndTimeForFileName()}.zip`);
		});
	};

	const isLoadingAnyMisc =
		isLoadingGetTasks ||
		isLoadingGetTodoistTasks ||
		isLoadingGetProjects ||
		isLoadingGetTodoistProjects ||
		isLoadingGetTags;
	const isLoadingGetAnyFocusRecords =
		isLoadingGetFocusRecords ||
		isLoadingGetSessionFocusRecords ||
		isLoadingGetBeFocusedAppFocusRecords ||
		isLoadingGetForestAppFocusRecords ||
		isLoadingGetTideFocusRecords;

	return (
		<div>
			<div
				className={classNames('flex items-center gap-2 my-2 cursor-pointer', chosenColorObj.hover.textColor)}
				onClick={() => {
					if (isLoadingAnyMisc || isLoadingGetAnyFocusRecords) {
						return;
					}

					setStatus('backing up');

					// Let the UI update before doing heavy work
					setTimeout(() => {
						downloadZipFolderOfImportantData();
						setStatus('done');

						setTimeout(() => {
							setStatus('none');
						}, 1000);
					}, 0);
				}}
			>
				{status === 'backing up' ? (
					<Spinner />
				) : (
					<Icon
						name={status === 'none' ? 'download' : 'check'}
						fill={0}
						customClass={classNames(
							'!text-[20px] cursor-pointer rounded-lg bg-color-gray-300 p-[6px]',
							status === 'none'
								? `'text-color-gray-50' ${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
								: 'text-emerald-500'
						)}
					/>
				)}
				<div>Backup Focus Records, Tasks, and Tags</div>
			</div>
		</div>
	);
};

export default BackupData;
