import { useSearchParamsContext } from "../../../contexts/useSearchParamsContext";
import { useGetProjectsQuery } from "../../../services/resources/projectsApi";
import { useFocusRecordsQuery } from "../useFocusRecordsQuery";
import { useUserSettingsContext } from "../useUserSettingsContext";
import type { FocusRecordTask } from "../../../types/models";

interface TaskProjectNameProps {
    taskId: string;
    task?: FocusRecordTask;
}

const TaskProjectName: React.FC<TaskProjectNameProps> = ({ taskId, task }) => {
    const { ancestorTasksById } = useFocusRecordsQuery();

    const { data: fetchedProjects } = useGetProjectsQuery();
    const { projectsById, projectsSessionById } = fetchedProjects || {};

    const { updateQueryParams } = useSearchParamsContext();

    const {
        focusRecordsPageSettings: { showTaskProjectName },
    } = useUserSettingsContext();

    // Map special focus app source IDs to friendly names
    const sourceToAppName: Record<string, string> = {
        'FocusRecordSession': 'Session',
        'FocusRecordBeFocused': 'Be Focused',
        'FocusRecordForest': 'Forest',
        'FocusRecordTide': 'Tide'
    };

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
        <span className="text-color-gray-25">
            {' '}
            -{' '}
            <span
                className="hover:underline hover:text-blue-500"
                onClick={() => {
                    if (isMappedFocusApp && fullTask?.projectId) {
                        // Filter by focus app source using the mapped focus app ID
                        const focusAppId = sourceToFocusAppId[fullTask.projectId];
                        updateQueryParams({
                            'focus-apps': focusAppId,
                            ...resetQueryParams,
                        });
                    } else {
                        // Filter by project/category
                        updateQueryParams({
                            [projectQueryParam]: taskProject?.id || task?.projectId,
                            ...resetQueryParams,
                        });
                    }
                }}
            >
                ({taskProjectName})
            </span>
        </span>
    );
};

export default TaskProjectName