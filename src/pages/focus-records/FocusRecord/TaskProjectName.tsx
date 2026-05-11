import { useSearchParamsContext } from "../../../contexts/useSearchParamsContext";
import { useGetProjectsQuery } from "../../../services/resources/projectsApi";
import { useFocusRecordsQuery } from "../useFocusRecordsQuery";
import { useUserSettingsContext } from "../useUserSettingsContext";
import type { FocusRecordTask } from "../../../types/models";
import { sourceToAppName } from "../../../utils/focusRecords.utils";

interface TaskProjectNameProps {
    taskId: string;
    task?: FocusRecordTask;
    cardTextColor?: string;
}

const TaskProjectName: React.FC<TaskProjectNameProps> = ({ taskId, task, cardTextColor }) => {
    const { ancestorTasksById } = useFocusRecordsQuery();

    const { data: fetchedProjects } = useGetProjectsQuery();
    const { projectsById, projectsSessionById } = fetchedProjects || {};

    const { updateQueryParams } = useSearchParamsContext();

    const {
        focusRecordsPageSettings: { showTaskProjectName, customDisplay },
    } = useUserSettingsContext();

    // Map source IDs to focus app filter IDs
    const sourceToFocusAppId: Record<string, string> = {
        'FocusRecordSession': 'session-app',
        'FocusRecordBeFocused': 'be-focused-app',
        'FocusRecordForest': 'forest-app',
        'FocusRecordTide': 'tide-ios-app'
    };

    if (!showTaskProjectName || !taskId) {
        return null;
    }

    const fullTask = ancestorTasksById?.[taskId] || task;
    const taskProject = (projectsById && fullTask?.projectId) ? projectsById[fullTask.projectId] : undefined;

    // Try to get the project name, or use source mapping as fallback
    let taskProjectName = taskProject ? taskProject.name : '';
    let isMappedFocusApp = false;

    if (!taskProject) {
        // Try to use the source mapping as fallback
        const mappedAppName = fullTask?.projectId && sourceToAppName[fullTask.projectId];

        if (mappedAppName) {
            taskProjectName = mappedAppName;
            isMappedFocusApp = true;
        } else if (task?.projectName) {
            taskProjectName = task?.projectName
        } else {
            return null
        }
    }

    // Check if this project is a Session category
    // TODO: If there are no projects, this will be mapped incorrectly. Frankly, I probably want to get rid of this separation between categories and projects anyways. So, merge these two together. Probably do the same thing for Todoist. This isn't usually an issue but if I sync only some data (like only Focus Records and no Tasks or Projects, it becomes an issue due to the incomplete data).
    const isSessionProject = taskProject && projectsSessionById?.[taskProject.id];
    const projectQueryParam = isSessionProject ? 'categories' : 'projects';

    // Shared query params to reset when filtering
    const resetQueryParams = {
        'task-id': '',
        'sort-by': '',
        search: '',
        'start-date': '',
        'end-date': '',
        page: '',
    };

    return (
        <span className={customDisplay.useTextColor ? "" : "text-color-gray-25"} style={{ color: customDisplay.useTextColor ? cardTextColor : '' }}>
            {' '}
            -{' '}
            <button
                type="button"
                className="hover:underline hover:text-blue-500 bg-transparent border-0 p-0"
                onClick={() => {
                    if (isMappedFocusApp && fullTask?.projectId) {
                        const focusAppId = sourceToFocusAppId[fullTask.projectId];
                        updateQueryParams({
                            'focus-apps': focusAppId,
                            ...resetQueryParams,
                        });
                    } else {
                        updateQueryParams({
                            [projectQueryParam]: taskProject?.id || task?.projectId,
                            ...resetQueryParams,
                        });
                    }
                }}
            >
                ({taskProjectName})
            </button>
        </span>
    );
};

export default TaskProjectName