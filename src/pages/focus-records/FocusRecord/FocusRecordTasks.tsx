import { useSearchParamsContext } from "../../../contexts/useSearchParamsContext";
import { formatDateTime } from "../../../utils/date.utils";
import { useUserSettingsContext } from "../useUserSettingsContext";
import TaskProjectName from "./TaskProjectName";
import TaskTitleWithBreadcrumbs from "./TaskTitleWithBreadcrumbs";
import type { FocusRecord, FocusRecordTask } from "../../../types/models";

interface FocusRecordTasksProps {
	focusRecord: FocusRecord;
}

const FocusRecordTasks: React.FC<FocusRecordTasksProps> = ({ focusRecord }) => {
	const { updateQueryParams } = useSearchParamsContext();
	const {
		focusRecordsPageSettings: {
			showTaskAncestors,
		},
	} = useUserSettingsContext();

	const headerWrapperStyling = 'mt-2 md:mt-0 sm:flex justify-between';
	const headerStyling =
		'text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer hover:text-blue-500 hover:underline';

	const updateTaskIdQueryParam = (taskId?: string) => {
		updateQueryParams({
			'task-id': taskId || '',
			'sort-by': '',
			search: '',
			'start-date': '',
			'end-date': '',
			projects: '',
			page: '',
		});
	};

	const getTaskTitle = (task: FocusRecordTask, dateStr: string) => {
		if (showTaskAncestors) {
			return <TaskTitleWithBreadcrumbs {...{ task, updateTaskIdQueryParam, headerStyling, dateStr }} />;
		}

		const taskId = task.taskId;

		return (
			<h3 className="text-[18px] md:text-[22px] md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer">
				<span onClick={() => updateTaskIdQueryParam(taskId)} className="hover:text-blue-500 hover:underline font-bold">
					{task?.title}
				</span>
				<TaskProjectName {...{ taskId: taskId }} />
			</h3>
		);
	};

	return focusRecord.tasks?.map((task: FocusRecordTask, index: number) => {
		const { startTime, endTime, taskId } = task;

		const startTimeObj = formatDateTime(startTime);
		const endTimeObj = formatDateTime(endTime);

		return (
			<div key={`${taskId} - ${startTime} - ${endTime} - ${index}`} className={headerWrapperStyling}>
				{getTaskTitle(
					task,
					`${startTimeObj.day + ' ' + startTimeObj.time} - ${endTimeObj.day + ' ' + endTimeObj.time}`
				)}

				<div className="sm:ml-3 text-white min-w-[150px] flex justify-end md:mt-[6px]">
					{startTimeObj.time} - {endTimeObj.time}
				</div>
			</div>
		);
	});
};

export default FocusRecordTasks