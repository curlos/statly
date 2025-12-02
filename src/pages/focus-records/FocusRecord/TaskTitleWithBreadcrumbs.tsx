import { useFocusRecordsQuery } from "../useFocusRecordsQuery";
import TaskProjectName from "./TaskProjectName";

const TaskTitleWithBreadcrumbs = ({ task, updateTaskIdQueryParam, headerStyling, dateStr }) => {
    const { ancestorTasksById, isLoading } = useFocusRecordsQuery();

    if (isLoading) {
        return (
            <h3 onClick={() => updateTaskIdQueryParam(task.id || task.taskId)} className={headerStyling}>
                {task?.title}
            </h3>
        );
    }

    const parentTask = ancestorTasksById[task.taskId] || task;
    const parentTaskTitle = parentTask?.title || task.title || parentTask?.id;

    // Only checking TickTick because Todoist does not have Focus Records.
    const parentTaskBreadcrumbsTickTick = parentTask?.ancestorIds;
    const parentTaskBreadcrumbs = parentTaskBreadcrumbsTickTick?.filter((ancestorId) => ancestorId !== task.taskId) || [];

    return (
        <div className="text-[22px] cursor-pointer">
            <span
                className="hover:underline font-bold hover:text-blue-500"
                onClick={() => {
                    updateTaskIdQueryParam(parentTask.id || task.taskId);
                }}
            >
                {parentTaskTitle}
            </span>

            {parentTaskBreadcrumbs?.length > 0 && (
                <span className="ml-1 text-color-gray-25">
                    -{' '}
                    {parentTaskBreadcrumbs.map((taskId, index) => {
                        const taskObj = ancestorTasksById[taskId];
                        const title = taskObj?.title || taskObj?.content || taskId;

                        return (
                            <span key={`breadcrumbs-${taskObj?.id || taskId}-${index}-${dateStr}`}>
                                <span
                                    className="hover:text-blue-500 hover:underline"
                                    onClick={() => {
                                        updateTaskIdQueryParam(taskObj?.id || taskId);
                                    }}
                                >
                                    {title}
                                </span>
                                {index !== parentTaskBreadcrumbs.length - 1 && <span>{' > '}</span>}
                            </span>
                        );
                    })}
                </span>
            )}

            <TaskProjectName {...{ taskId: (parentTask?.id || task.taskId), task }} />
        </div>
    );
};

export default TaskTitleWithBreadcrumbs