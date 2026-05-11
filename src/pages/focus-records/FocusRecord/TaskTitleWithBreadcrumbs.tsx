import { useFocusRecordsQuery } from "../useFocusRecordsQuery";
import TaskProjectName from "./TaskProjectName";
import type { FocusRecordTask } from "../../../types/models";
import classNames from "classnames";
import { useUserSettingsContext } from "../useUserSettingsContext";

interface TaskTitleWithBreadcrumbsProps {
    task: FocusRecordTask;
    updateTaskIdQueryParam: (taskId?: string) => void;
    headerStyling: string;
    dateStr: string;
    cardTextColor?: string;
}

const TaskTitleWithBreadcrumbs: React.FC<TaskTitleWithBreadcrumbsProps> = ({ task, updateTaskIdQueryParam, headerStyling, dateStr, cardTextColor }) => {
    const {
            focusRecordsPageSettings: { customDisplay },
        } = useUserSettingsContext();
    const { ancestorTasksById, isLoading } = useFocusRecordsQuery();

    if (isLoading) {
        return (
            <h3 className={headerStyling.replace('cursor-pointer', '')}>
                <button
                    type="button"
                    className="hover:text-blue-500 hover:underline font-bold bg-transparent border-0 p-0 cursor-pointer text-left"
                    onClick={() => updateTaskIdQueryParam(task.taskId)}
                >
                    {task?.title}
                </button>
            </h3>
        );
    }

    const parentTask = ancestorTasksById?.[task.taskId] || task;
    const parentTaskId = 'id' in parentTask ? parentTask.id : parentTask.taskId;
    const parentTaskTitle = parentTask?.title || task.title || parentTaskId;

    // Only checking TickTick because Todoist does not have Focus Records.
    const parentTaskBreadcrumbsTickTick = 'ancestorIds' in parentTask ? parentTask.ancestorIds : undefined;
    const parentTaskBreadcrumbs = parentTaskBreadcrumbsTickTick?.filter((ancestorId: string) => ancestorId !== task.taskId) || [];

    return (
        <div className="text-[22px]">
            <button
                type="button"
                className="hover:underline font-bold hover:text-blue-500 bg-transparent border-0 p-0 cursor-pointer text-left"
                onClick={() => {
                    updateTaskIdQueryParam(parentTaskId);
                }}
                style={customDisplay.useTextColor ? { color: cardTextColor } : {}}
            >
                {parentTaskTitle}
            </button>

            {parentTaskBreadcrumbs?.length > 0 && (
                <span className={classNames("ml-1", customDisplay.useTextColor ? "" : "text-color-gray-25")} style={{ color: customDisplay.useTextColor ? cardTextColor : '' }}>
                    -{' '}
                    {parentTaskBreadcrumbs.map((taskId: string, index: number) => {
                        const taskObj = ancestorTasksById?.[taskId];
                        const title = taskObj?.title || taskId;

                        return (
                            <span key={`breadcrumbs-${taskObj?.id || taskId}-${index}-${dateStr}`}>
                                <button
                                    type="button"
                                    className="hover:text-blue-500 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                                    onClick={() => {
                                        updateTaskIdQueryParam(taskObj?.id || taskId);
                                    }}
                                >
                                    {title}
                                </button>
                                {index !== parentTaskBreadcrumbs.length - 1 && <span>{' > '}</span>}
                            </span>
                        );
                    })}
                </span>
            )}

            <TaskProjectName {...{ taskId: parentTaskId, task, cardTextColor }} />
        </div>
    );
};

export default TaskTitleWithBreadcrumbs