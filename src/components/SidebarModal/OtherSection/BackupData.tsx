import JSZip from 'jszip';
import FileSaver from 'file-saver';
import classNames from 'classnames';
import { useState } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { tasksApi } from '../../../services/resources/tasksApi';
import { focusRecordsApi } from '../../../services/resources/focusRecordsApi';
import { projectsApi } from '../../../services/resources/projectsApi';
import Icon from '../../Icon';
import Spinner from '../../Loaders/Spinner';
import { getFormattedDateAndTimeForFileName } from '../../../utils/date.utils';

const BackupData = () => {
	// RTK Query - Lazy queries that only trigger on button click
	const [triggerGetAllTasks, { isLoading: isLoadingGetAllTasks }] =
		tasksApi.useLazyGetAllTasksQuery();

	const [triggerGetAllFocusRecords, { isLoading: isLoadingGetAllFocusRecords }] =
		focusRecordsApi.useLazyGetAllFocusRecordsQuery();

	const [triggerGetProjects, { isLoading: isLoadingGetDocumentsProjects }] =
		projectsApi.useLazyGetProjectsQuery();

	const [triggerGetProjectGroups, { isLoading: isLoadingGetDocumentsProjectGroups }] =
		projectsApi.useLazyGetProjectGroupsQuery();

	const { chosenColorObj } = useThemeContext();
	const [status, setStatus] = useState('none');

	// Helper function to fetch all pages in parallel
	const fetchAllPages = async (
		triggerQuery: any,
		limit = 5000
	): Promise<any[]> => {
		// Fetch first page to get total count
		const { data: firstPageResponse } = await triggerQuery({ page: 1, limit });

		if (!firstPageResponse) {
			return [];
		}

		// If response is not paginated (old format), return as-is
		if (!firstPageResponse.totalPages) {
			return firstPageResponse;
		}

		const { data: firstPageData, totalPages } = firstPageResponse;

		// If only one page, return the data
		if (totalPages === 1) {
			return firstPageData;
		}

		// Fetch remaining pages in parallel
		const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
		const remainingPagesPromises = remainingPages.map((page) =>
			triggerQuery({ page, limit })
		);

		const remainingPagesResponses = await Promise.all(remainingPagesPromises);

		// Combine all pages
		const allData = [
			firstPageData,
			...remainingPagesResponses.map((response: any) => response.data?.data || []),
		].flat();

		return allData;
	};

	const zip = new JSZip();

	// Helper function to chunk array into groups of 1000
	const chunkArray = (arr: any[], chunkSize = 1000) => {
		const chunks: any[][] = [];
		for (let i = 0; i < arr.length; i += chunkSize) {
			chunks.push(arr.slice(i, i + chunkSize));
		}
		return chunks;
	};

	const downloadZipFolderOfImportantData = (
		allTasks: any,
		allFocusRecords: any,
		projects: any,
		projectGroups: any
	) => {
		const importantApiResponsesArr = [
			// ALL TASKS
			{
				folderName: 'tasks',
				fileName: 'tasks',
				apiEndpointName: '/tasks/all',
				response: allTasks,
			},

			// ALL FOCUS RECORDS
			{
				folderName: 'focus-records',
				fileName: 'focus-records',
				apiEndpointName: '/focus-records/all',
				response: allFocusRecords,
			},

			// PROJECTS
			{
				folderName: 'projects',
				fileName: 'projects',
				apiEndpointName: '/projects',
				response: projects,
			},

			// PROJECT GROUPS
			{
				folderName: 'project-groups',
				fileName: 'project-groups',
				apiEndpointName: '/projects/project-groups',
				response: projectGroups,
			},
		];

		// Adjust date to local timezone to fix zip file timestamp display
		const localDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);

		for (const data of importantApiResponsesArr) {
			// Create folder first with correct timestamp by adding a directory entry
			zip.file(`${data.folderName}/`, null, {
				dir: true,
				date: localDate
			});

			// All responses are now arrays, so we can directly chunk them
			const arrayToChunk = data.response;

			// Chunk the array into groups of 1000
			const chunks = chunkArray(arrayToChunk, 1000);

			chunks.forEach((chunk, index) => {
				const fileContent = {
					fileName: data.fileName,
					apiEndpointName: data.apiEndpointName,
					chunkInfo: {
						chunkNumber: index + 1,
						totalChunks: chunks.length,
						itemsInChunk: chunk.length,
						totalItems: arrayToChunk.length,
					},
					response: chunk,
				};

				// Use folder path directly in file() to set folder timestamp correctly
				zip.file(
					`${data.folderName}/${data.fileName}_${index + 1}.json`,
					JSON.stringify(fileContent, null, 4),
					{ date: localDate }
				);
			});
		}

		zip.generateAsync({ type: 'blob' }).then((blob) => {
			FileSaver.saveAs(blob, `Backup_Tasks_FocusRecords_Projects_${getFormattedDateAndTimeForFileName()}.zip`);
		});
	};

	const isLoadingAny =
		isLoadingGetAllTasks ||
		isLoadingGetAllFocusRecords ||
		isLoadingGetDocumentsProjects ||
		isLoadingGetDocumentsProjectGroups;

	return (
		<div>
			<div
				className={classNames('flex items-center gap-2 my-2 cursor-pointer', chosenColorObj.hover.textColor)}
				onClick={async () => {
					if (isLoadingAny) {
						return;
					}

					setStatus('backing up');

					try {
						// Fetch all paginated data in parallel
						const [allTasks, allFocusRecords, projects, projectGroups] = await Promise.all([
							fetchAllPages(triggerGetAllTasks),
							fetchAllPages(triggerGetAllFocusRecords),
							triggerGetProjects({ fullData: true }).then((res: any) => res.data?.projects || []),
							triggerGetProjectGroups({ fullData: true }).then((res: any) => res.data?.projectGroups || []),
						]);

						// Let the UI update before doing heavy work
						setTimeout(() => {
							downloadZipFolderOfImportantData(
								allTasks,
								allFocusRecords,
								projects,
								projectGroups
							);
							setStatus('done');

							setTimeout(() => {
								setStatus('none');
							}, 1000);
						}, 0);
					} catch (error) {
						console.error('Error fetching backup data:', error);
						setStatus('none');
					}
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
				<div>Backup Focus Records, Tasks, Projects, and Project Groups</div>
			</div>
		</div>
	);
};

export default BackupData;
