import { useFocusRecordsQuery } from "../useFocusRecordsQuery";
import TaskProjectName from "./TaskProjectName";
import type { FocusRecordTask } from "../../../types/models";
import classNames from "classnames";
import { useUserSettingsContext } from "../useUserSettingsContext";

interface TaskTitleWithBreadcrumbsProps {
    task: FocusRecordTask;
    buildTaskUrl: (taskId?: string) => string;
    headerStyling: string;
    dateStr: string;
    cardTextColor?: string;
}

const TaskTitleWithBreadcrumbs: React.FC<TaskTitleWithBreadcrumbsProps> = ({ task, buildTaskUrl, headerStyling, dateStr, cardTextColor }) => {
    const {
            focusRecordsPageSettings: { customDisplay },
        } = useUserSettingsContext();
    const { ancestorTasksById, isLoading } = useFocusRecordsQuery();

    if (isLoading) {
        return (
            <h3 className={headerStyling.replace('cursor-pointer', '')}>
                <a
                    href={buildTaskUrl(task.taskId)}
                    className="hover:text-blue-500 hover:underline font-bold text-left"
                >
                    {task?.title}
                </a>
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
            <a
                href={buildTaskUrl(parentTaskId)}
                className="hover:underline font-bold hover:text-blue-500 text-left"
                style={customDisplay.useTextColor ? { color: cardTextColor } : {}}
            >
                {parentTaskTitle}
            </a>

            {parentTaskBreadcrumbs?.length > 0 && (
                <span className={classNames("ml-1", customDisplay.useTextColor ? "" : "text-color-gray-25")} style={{ color: customDisplay.useTextColor ? cardTextColor : '' }}>
                    -{' '}
                    {parentTaskBreadcrumbs.map((taskId: string, index: number) => {
                        const taskObj = ancestorTasksById?.[taskId];
                        const title = taskObj?.title || taskId;

                        return (
                            <span key={`breadcrumbs-${taskObj?.id || taskId}-${index}-${dateStr}`}>
                                <a
                                    href={buildTaskUrl(taskObj?.id || taskId)}
                                    className="hover:text-blue-500 hover:underline"
                                >
                                    {title}
                                </a>
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