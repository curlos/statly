import classNames from "classnames";
import { useState } from "react";
import Accordion from "../../../../../components/Accordion/Accordion";
import { getFormattedDuration } from "../../../../../utils/helpers.utils";
import ProgressBar from "../ProgressBar";
import { shouldBreakAllText } from "../../../../../utils/text.utils";
import Spinner from "../../../../../components/Loaders/Spinner";
import type { Project } from "../../../../../types/models";
import type { AncestorTask } from "../../../../../types/api";
import type { ProgressBarItemData, AggregationResults, GroupedTaskById } from "../../../../../types/stats";

interface NestedProgressBarsProps {
    data: ProgressBarItemData[];
    dataByTasks?: ProgressBarItemData[];
    dataType: string;
    focusDurationForInterval: number;
    fromModal: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    sortBy: string;
    projectsById: Record<string, Project>;
    sessionCategoriesById?: Record<string, Project>;
    ancestorTasksById: Record<string, AncestorTask>;
    metricType?: 'duration' | 'count';
    aggregationResults: AggregationResults;
    intervalStartDate: string;
    intervalEndDate: string;
    emotionId?: string;
}

const NestedProgressBars: React.FC<NestedProgressBarsProps> = ({
    data,
    dataByTasks,
    dataType,
    focusDurationForInterval,
    fromModal,
    setIsModalOpen,
    sortBy,
    projectsById,
    sessionCategoriesById,
    ancestorTasksById,
    metricType = 'duration',
    aggregationResults,
    intervalStartDate,
    intervalEndDate,
    emotionId
}) => {
    const groupedTasksCollapsedByDefault = useState(false);

    const isFocusDuration = metricType === 'duration';
    const metricKey = isFocusDuration ? 'duration' : 'count';

    if (!data || !ancestorTasksById || (dataType === 'Project' && !dataByTasks)) {
        return (
            <div className="flex justify-center items-center p-8">
                <Spinner size="lg" />
            </div>
        );
    }

    const dataToUse = dataType === 'Project' && dataByTasks ? dataByTasks : data;

    const taskIds = dataToUse?.map((dataObj) => dataObj.id);

    if (!taskIds) {
        return;
    }

    const {
        totalMetricOnParentTask,
        tasksWithNoParent,
        groupedTasksInfo,
        groupedTasksById,
        virtualAncestorsById,
        parentDirectChildrenTaskIdsByParentId,
        progressBarDataById
    } = aggregationResults;

    const otherFocusRecordTaskIds: string[] = [];
    taskIds.forEach((id) => {
        if (!ancestorTasksById[id] && !groupedTasksById[id] && !virtualAncestorsById[id]) {
            otherFocusRecordTaskIds.push(id);
        }
    });
    
    const renderDirectTasks = (taskId: string, parentTaskId: string, parentTaskIdAndChildrenTaskIds: string[], projectColor: string) => {
        // Need to investigate but progressBarDataById should be used here because it somehow gives me the duration and percentage of hte direct tasks. Maybe it's because out of all of the totals, this one is the most pure and just gives me the duration or count for each task directly.
        const item = progressBarDataById[taskId];

        if (!item) {
            return null;
        }

        const shouldBreakAll = shouldBreakAllText(item?.name);
        const formattedMetric = isFocusDuration
        ? getFormattedDuration(item?.[metricType], false)
        : `${item?.[metricType]?.toLocaleString() || 0} task${totalMetricOnParentTask[parentTaskId].value !== 1 ? 's' : ''}`;

        const renderProgressBar = () => (
            <li className="flex items-start gap-1 mb-6">
                <ProgressBar item={item} projectsById={projectsById} sessionCategoriesById={sessionCategoriesById || {}} metricType={metricType} ancestorTasksById={ancestorTasksById} intervalStartDate={intervalStartDate} intervalEndDate={intervalEndDate} emotionId={emotionId} />
            </li>
        )

        // If this is a direct task (such as YouTube Bookmark Extension's direct focus task with 46h59m), then it will just show one progress bar when the Accordion is oepned. This is rendered inside the Accordion where the "renderDirectTasks" function is called.
        if (parentTaskIdAndChildrenTaskIds.length === 1) {
            return <div key={taskId}>{renderProgressBar()}</div>
        }

        return (
                <Accordion
                key={taskId}
                title={
                    <li className="text-[18px] cursor-pointer font-normal hover:underline break-words w-full">
                        <span
                            className="w-2 h-2 rounded-full flex-shrink-0 inline-block"
                            style={{ backgroundColor: projectColor }}
                        />
                        {" "}
                        <span className="hover:underline">
                            <span className={classNames({ 'break-all': shouldBreakAll })}>{`${parentTaskId === taskId ? 'Direct Parent Task: ' : ''}${item.name}`} </span>
                            {" "}
                            <span className="text-color-gray-25">
                                ({formattedMetric},{' '}
                                {item?.percentage}%)
                            </span>
                        </span>

                    </li>
                }
                openByDefault={!groupedTasksCollapsedByDefault}
                showArrowNextToText={true}
                customToggleOpen={() => {
                    if (!fromModal) {
                        setIsModalOpen(true);
                    }
                }}
                preventOpen={!fromModal}
            >

                <ul className="space-y-4 pl-6 mb-6">
                    {renderProgressBar()}
                </ul>
            </Accordion>
        );
    }

    const renderNestedTasks = (parentTaskId: string) => {
        // Check if this is a grouped task (daily habit)
        const isGroupedTask = groupedTasksInfo && groupedTasksInfo[parentTaskId];

        // Check if this is a virtual focus app task
        const isVirtualTask = virtualAncestorsById?.[parentTaskId];

        const parentTask = isGroupedTask
            ? groupedTasksById[parentTaskId]
            : (virtualAncestorsById?.[parentTaskId] || ancestorTasksById[parentTaskId]);

        const formattedMetric = isFocusDuration
            ? getFormattedDuration(totalMetricOnParentTask[parentTaskId].value, false)
            : `${totalMetricOnParentTask[parentTaskId].value?.toLocaleString() || 0} task${totalMetricOnParentTask[parentTaskId].value !== 1 ? 's' : ''}`;

        // For grouped tasks or virtual tasks, show a simple accordion with just one progress bar inside
        if (isGroupedTask || isVirtualTask) {
            const groupedItem = progressBarDataById[parentTaskId];
            const projectColor = isVirtualTask
                ? (parentTask?.projectId && projectsById?.[parentTask.projectId]?.color) || (parentTask as GroupedTaskById).color || '#808080'
                : (groupedTasksInfo[parentTaskId]?.color || '#808080')

            const shouldBreakAll = shouldBreakAllText(groupedItem?.name);

            return (
                <ul key={parentTaskId} className="text-[16px] w-full">
                    <Accordion
                        title={
                            <li className="text-[18px] cursor-pointer font-normal hover:underline break-words w-full">
                                <span
                                    className="w-2 h-2 rounded-full flex-shrink-0 inline-block"
                                    style={{ backgroundColor: projectColor }}
                                />
                                {" "}
                                <span className="hover:underline">
                                    <span className={classNames({ 'break-all': shouldBreakAll })}>{groupedItem.name} </span>
                                    {" "}
                                    <span className="text-color-gray-25">
                                        ({formattedMetric},{' '}
                                        {totalMetricOnParentTask[parentTaskId].percentage}%)
                                    </span>
                                </span>

                            </li>
                        }
                        openByDefault={!groupedTasksCollapsedByDefault}
                        showArrowNextToText={true}
                        customToggleOpen={() => {
                            if (!fromModal) {
                                setIsModalOpen(true);
                            }
                        }}
                        preventOpen={!fromModal}
                    >
                        <ul className="space-y-4 pl-6 mb-6">
                            <li className="flex items-start gap-1">
                                <ProgressBar
                                    item={groupedItem}
                                    projectsById={projectsById}
                                    sessionCategoriesById={sessionCategoriesById || {}}
                                    metricType={metricType}
                                    ancestorTasksById={ancestorTasksById}
                                    intervalStartDate={intervalStartDate}
                                    intervalEndDate={intervalEndDate}
                                    emotionId={emotionId}
                                />
                            </li>
                        </ul>
                    </Accordion>
                </ul>
            );
        }

        const projectColor = (projectsById && parentTask?.projectId && projectsById[parentTask.projectId]?.color) || '#808080'
        const taskName = (parentTask as GroupedTaskById).title || (parentTask as GroupedTaskById).content;
        const shouldBreakAll = shouldBreakAllText(taskName);
        const parentTaskIdAndChildrenTaskIds = [...(parentDirectChildrenTaskIdsByParentId[parentTaskId] || []), parentTaskId]
        let tasksToRender = parentTaskIdAndChildrenTaskIds

        if (metricType === 'count') {
            const directTaskIdsToGroup: string[] = []
            const taskIdsWithChildren: string[] = []

            parentTaskIdAndChildrenTaskIds?.map((taskId: string) => {
                const isTaskWithChildren = parentDirectChildrenTaskIdsByParentId[taskId] && parentDirectChildrenTaskIdsByParentId[taskId].length > 0
                
                if (isTaskWithChildren && taskId !== parentTaskId) {
                    // In this case, this task has children who could either have children or direct completed tasks.
                    taskIdsWithChildren.push(taskId)
                } else {
                    if (progressBarDataById[taskId]) {
                        // In this case, it must be a direct completed task (either a subtask/item or the parentTask itself being completed).
                        directTaskIdsToGroup.push(taskId)
                    }
                }
            })

            // Calculate total count from all direct children
            const totalCount = directTaskIdsToGroup?.length || 0;

            if (totalCount > 0) {
                // Calculate percentage
                const percentage = Number(((totalCount / focusDurationForInterval) * 100).toFixed(2));

                const groupId = `grouped-direct-tasks-${parentTaskId}`

                // Create consolidated item
                const parentTaskName = (parentTask as GroupedTaskById).title || (parentTask as GroupedTaskById).content;
                const parentTaskColor = (parentTask as GroupedTaskById).color;
                const groupedDirectChildTasks: ProgressBarItemData = {
                    id: parentTaskId,
                    projectId: parentTask.projectId,
                    name: `Direct Child Tasks: ${parentTaskName}`,
                    count: totalCount,
                    percentage: percentage,
                    color: parentTaskColor || '#808080',
                    type: 'task' as const,
                    isGroupedDirectTasksForCount: true
                };
                
                progressBarDataById[groupId] = groupedDirectChildTasks
                taskIdsWithChildren.push(groupId)
                tasksToRender = taskIdsWithChildren
            }
        }

        return (
            <ul key={parentTaskId} className="text-[16px] w-full">
                <Accordion
                    title={
                        <li className="text-[18px] cursor-pointer font-normal break-words w-full">
                            <span
                                className="w-2 h-2 rounded-full flex-shrink-0 inline-block"
                                style={{ backgroundColor: projectColor }}
                            />
                            {" "}
                            <span className="hover:underline">
                                <span className={classNames({ 'break-all': shouldBreakAll })}>{taskName}</span>
                                {" "}
                                <span className="text-color-gray-25">
                                    ({formattedMetric},{' '}
                                    {totalMetricOnParentTask[parentTaskId].percentage}%)
                                </span>
                            </span>
                        </li>
                    }
                    openByDefault={!groupedTasksCollapsedByDefault}
                    showArrowNextToText={true}
                    customToggleOpen={() => {
                        if (!fromModal) {
                            setIsModalOpen(true);
                        }
                    }}
                    preventOpen={!fromModal}
                >
                    <ul className="pl-6">
                        {tasksToRender
                                ?.sort((taskIdOne: string, taskIdTwo: string) => {
                                    // If it's the direct task of the parent displayed, then we need to grab the data from "progressBarDataById" because this'll tell us the actual value of the parent task itself, not the value of the children combined and passed up to the parent. Otherwise, for everyone else, you either use that combined child value (duration/count) or the pure progressBarDataById value on itself.
                                    const valueOne = (taskIdOne === parentTaskId ? progressBarDataById[taskIdOne]?.[metricType] : totalMetricOnParentTask[taskIdOne]?.value || progressBarDataById[taskIdOne]?.[metricType]) as number || 0;

                                    const valueTwo = (taskIdTwo === parentTaskId ? progressBarDataById[taskIdTwo]?.[metricType] : totalMetricOnParentTask[taskIdTwo]?.value || progressBarDataById[taskIdTwo]?.[metricType]) as number || 0;

                                    return valueTwo - valueOne; // Sort from highest to lowest
                                })
                                ?.map((taskId: string) => {
                                    const isTaskWithChildren = parentDirectChildrenTaskIdsByParentId[taskId] &&
                                        parentDirectChildrenTaskIdsByParentId[taskId].length > 0

                                    if (isTaskWithChildren) {
                                        // For the direct parent task, it needs to be rendered with either an Accordion + one progress bar OR as null if there's no direct parent task in progressBarDataById.
                                        if (taskId === parentTaskId) {
                                            return renderDirectTasks(taskId, parentTaskId, tasksToRender, projectColor)
                                        }

                                        // Otherwise, if it's a task with children that isn't the parent, we need to recursively render the nested tasks.
                                        return <div key={taskId}>{renderNestedTasks(taskId)}</div>;
                                    } else {
                                        // if the task doesn't have children, then we can just render it with an Accordion + one progress bar if it's in progressBarDataById. The reason we don't just render the progressBar directly and have an accordion wrapped around it first is because I need to match the rest of the nested accordions.
                                        return renderDirectTasks(taskId, parentTaskId, tasksToRender, projectColor)
                                    }
                            })}
                    </ul>
                </Accordion>
            </ul>
        );
    };

    const sortedTasksWithNoParent = tasksWithNoParent.sort((taskIdOne: string, taskIdTwo: string) => {
        const valueOne = totalMetricOnParentTask[taskIdOne].value;
        const valueTwo = totalMetricOnParentTask[taskIdTwo].value;

        if (sortBy === 'Focus Hours: Most-Least' || sortBy === 'Tasks: Most-Least') {
            return valueTwo - valueOne;
        }

        return valueOne - valueTwo;
    });

    const maxTasksWithNoParent = fromModal ? sortedTasksWithNoParent.length : 4;

    if (dataType === 'Project') {
        const groupedProjectsAndTasks: Record<string, string[]> = {};

        for (const taskId of [...sortedTasksWithNoParent, ...otherFocusRecordTaskIds]) {
            const task = ancestorTasksById[taskId] || virtualAncestorsById[taskId] || groupedTasksById[taskId];

            if (!task) {
                continue;
            }

            const projectId = task.projectId;

            if (!projectId) {
                continue;
            }

            if (!groupedProjectsAndTasks[projectId]) {
                groupedProjectsAndTasks[projectId] = [];
            }

            groupedProjectsAndTasks[projectId].push(taskId);
        }

        const sortedProjects = [...data].sort((projectOne, projectTwo) => {
            const valueOne = projectOne[metricKey] as number || 0;
            const valueTwo = projectTwo[metricKey] as number || 0;

            if (sortBy === 'Focus Hours: Most-Least' || sortBy === 'Tasks: Most-Least') {
                return valueTwo - valueOne;
            }

            return valueOne - valueTwo;
        });

        const maxProjects = fromModal ? sortedProjects.length : 5;

        return (
            <div>
                {sortedProjects.slice(0, maxProjects)?.map((project: ProgressBarItemData) => {
                    const projectMetricValue = project[metricKey] as number || 0;
                    const projectFormattedMetric = isFocusDuration
                        ? getFormattedDuration(projectMetricValue, false)
                        : `${projectMetricValue.toLocaleString()} task${projectMetricValue !== 1 ? 's' : ''}`;

                    const shouldBreakAllProject = shouldBreakAllText(project.name);

                    return (
                        <ul key={project.id} className="w-full">
                            <Accordion
                                title={
                                    <li className="text-[18px] cursor-pointer font-normal hover:underline break-words w-full">

                                        <span
                                            className="w-2 h-2 rounded-full flex-shrink-0 inline-block"
                                            style={{ backgroundColor: project.color }}
                                        />
                                        {" "}
                                        <span className="hover:underline">
                                            <span className={classNames({ 'break-all': shouldBreakAllProject })}>{project.name}</span>
                                            {" "}
                                            <span className="text-color-gray-25">
                                                ({projectFormattedMetric}, {project.percentage}%)
                                            </span>
                                        </span>
                                    </li>
                                }
                                openByDefault={!groupedTasksCollapsedByDefault}
                                showArrowNextToText={true}
                                customToggleOpen={() => {
                                    if (!fromModal) {
                                        setIsModalOpen(true);
                                    }
                                }}
                                preventOpen={!fromModal}
                            >
                                <div className="pl-6">
                                    {groupedProjectsAndTasks[project.id]?.map((taskId: string, index: number) => {
                                        return <div key={taskId + index}>{renderNestedTasks(taskId)}</div>;
                                    })}
                                </div>
                            </Accordion>
                        </ul>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={classNames('w-full', !fromModal && 'overflow-auto max-h-[230px]')}>
            {sortedTasksWithNoParent.slice(0, maxTasksWithNoParent)?.map((taskId: string, index: number) => {
                return <div key={taskId + index} className="w-full">{renderNestedTasks(taskId)}</div>;
            })}
        </div>
    );
};

export default NestedProgressBars