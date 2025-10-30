import classNames from "classnames";
import { useState } from "react";
import Accordion from "../../../../../components/Accordion/Accordion";
import { getFormattedDuration } from "../../../../../utils/focus-apps/helpers.utils";
import ProgressBar from "../ProgressBar";
import { shouldBreakAllText } from "../../../../../utils/text.utils";

const NestedProgressBars = ({
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
    intervalEndDate
}) => {
    const groupedTasksCollapsedByDefault = useState(false);

    const isFocusDuration = metricType === 'duration';
    const metricKey = isFocusDuration ? 'duration' : 'count';

    if (!data || !ancestorTasksById || (dataType === 'Project' && !dataByTasks)) {
        return <div>Loading...</div>;
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
        groupedSubtasksByParentTask,
        parentDirectChildrenTaskIdsByParentId,
        progressBarDataById
    } = aggregationResults;

    const otherFocusRecordTaskIds: string[] = [];
    taskIds.forEach((id) => {
        if (!ancestorTasksById[id] && !groupedTasksById[id] && !virtualAncestorsById[id]) {
            otherFocusRecordTaskIds.push(id);
        }
    });

    /**
     * @description
     * @param directCompletedSubtasks
     * @param parentTask
     */
    const renderDirectFocusTasks = (directFocusTasks, parentTask) => {
        // For count metric (CompletionStatsCard), consolidate all direct children into one bar
        if (metricType === 'count') {
            // Calculate total count from all direct children
            const totalCount = directFocusTasks?.length || 0;

            // Calculate percentage
            const percentage = Number(((totalCount / focusDurationForInterval) * 100).toFixed(2));

            // Create consolidated item
            const consolidatedItem = {
                id: parentTask.id,
                name: `Direct Child Tasks: ${parentTask.title || parentTask.content}`,
                count: totalCount,
                percentage: percentage,
                color: parentTask.color || '#808080',
                type: 'task'
            };

            return (
                <ul className="space-y-4 pl-6 mb-6">
                    <li className="flex items-start gap-1">
                        <ProgressBar item={consolidatedItem} projectsById={projectsById} sessionCategoriesById={sessionCategoriesById} metricType={metricType} ancestorTasksById={ancestorTasksById} intervalStartDate={intervalStartDate} intervalEndDate={intervalEndDate} />
                    </li>
                </ul>
            );
        }

        // For duration metric (DetailsCard), show individual tasks as before
        const sortedDirectFocusTasks = [...directFocusTasks].sort((subtaskOne, subtaskTwo) => {
            const itemOne = progressBarDataById[subtaskOne.id];
            const itemTwo = progressBarDataById[subtaskTwo.id];

            const metricValueOne = itemOne?.[metricKey] || 0;
            const metricValueTwo = itemTwo?.[metricKey] || 0;

            return metricValueTwo - metricValueOne; // Sort from highest to lowest
        });

        return (
            <ul className="space-y-4 pl-6 mb-6">
                {sortedDirectFocusTasks?.map((subtask) => {
                    const item = progressBarDataById[subtask.id];

                    if (!item) {
                        return null;
                    }

                    return (
                        <li key={subtask.id} className="flex items-start gap-1">
                            <ProgressBar item={item} projectsById={projectsById} sessionCategoriesById={sessionCategoriesById} metricType={metricType} ancestorTasksById={ancestorTasksById} intervalStartDate={intervalStartDate} intervalEndDate={intervalEndDate} />
                        </li>
                    );
                })}
            </ul>
        );
    };

    const renderNestedTasks = (parentTaskId) => {
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
                ? (projectsById?.[parentTask?.projectId]?.color || parentTask?.color || '#808080')
                : (groupedTasksInfo[parentTaskId]?.color || '#808080')

            const shouldBreakAll = shouldBreakAllText(groupedItem?.name);

            return (
                <ul key={parentTaskId} className="text-[16px] w-full">
                    <Accordion
                        title={
                            <li className="text-[18px] cursor-pointer font-bold hover:underline break-words w-full">
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
                                    sessionCategoriesById={sessionCategoriesById}
                                    metricType={metricType}
                                    ancestorTasksById={ancestorTasksById}
                                    intervalStartDate={intervalStartDate}
                                    intervalEndDate={intervalEndDate}
                                />
                            </li>
                        </ul>
                    </Accordion>
                </ul>
            );
        }

        // Regular parent task with potential children
        const directParentChildFocusTasks = groupedSubtasksByParentTask[parentTask.id];
        const projectColor = (projectsById && projectsById[parentTask?.projectId] && projectsById[parentTask?.projectId]?.color) || '#808080'

        const shouldBreakAllParentTask = shouldBreakAllText(parentTask.title || parentTask.content);

        return (
            <ul key={parentTaskId} className="text-[16px] w-full">
                <Accordion
                    title={
                        <li className="text-[18px] cursor-pointer font-bold break-words w-full">
                            <span
                                className="w-2 h-2 rounded-full flex-shrink-0 inline-block"
                                style={{ backgroundColor: projectColor }}
                            />
                            {" "}
                            <span className="hover:underline">
                                <span className={classNames({ 'break-all': shouldBreakAllParentTask })}>{parentTask.title || parentTask.content}</span>
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
                    {directParentChildFocusTasks?.length > 0 && renderDirectFocusTasks(directParentChildFocusTasks, parentTask)}

                    <ul className="pl-6">
                        {parentDirectChildrenTaskIdsByParentId[parentTaskId] &&
                            parentDirectChildrenTaskIdsByParentId[parentTaskId]
                                .sort((taskIdOne, taskIdTwo) => {
                                    const valueOne = totalMetricOnParentTask[taskIdOne]?.value || 0;
                                    const valueTwo = totalMetricOnParentTask[taskIdTwo]?.value || 0;
                                    return valueTwo - valueOne; // Sort from highest to lowest
                                })
                                ?.map((taskId) => {
                                if (
                                    parentDirectChildrenTaskIdsByParentId[taskId] &&
                                    parentDirectChildrenTaskIdsByParentId[taskId].length > 0
                                ) {
                                    return <div key={taskId}>{renderNestedTasks(taskId)}</div>;
                                }
                            })}
                    </ul>
                </Accordion>
            </ul>
        );
    };

    const sortedTasksWithNoParent = tasksWithNoParent.sort((taskIdOne, taskIdTwo) => {
        const valueOne = totalMetricOnParentTask[taskIdOne].value;
        const valueTwo = totalMetricOnParentTask[taskIdTwo].value;

        if (sortBy === 'Focus Hours: Most-Least' || sortBy === 'Tasks: Most-Least') {
            return valueTwo - valueOne;
        }

        return valueOne - valueTwo;
    });

    const maxTasksWithNoParent = fromModal ? sortedTasksWithNoParent.length : 4;
    

    if (dataType === 'Project') {
        const groupedProjectsAndTasks = {};

        for (const taskId of [...sortedTasksWithNoParent, ...otherFocusRecordTaskIds]) {
            const task = ancestorTasksById[taskId] || virtualAncestorsById[taskId];

            if (!task) {
                continue;
            }
            
            const projectId = task['projectId'] || task['v2_project_id'] || task['project_id'];

            if (!groupedProjectsAndTasks[projectId]) {
                groupedProjectsAndTasks[projectId] = [];
            }

            groupedProjectsAndTasks[projectId].push(taskId);
        }

        const sortedProjects = [...data].sort((projectOne, projectTwo) => {
            if (sortBy === 'Focus Hours: Most-Least' || sortBy === 'Tasks: Most-Least') {
                return projectTwo[metricKey] - projectOne[metricKey];
            }

            return projectOne[metricKey] - projectTwo[metricKey];
        });

        const maxProjects = fromModal ? sortedProjects.length : 5;

        return (
            <div>
                {sortedProjects.slice(0, maxProjects)?.map((project) => {
                    const projectFormattedMetric = isFocusDuration
                        ? getFormattedDuration(project[metricKey], false)
                        : `${project[metricKey]?.toLocaleString() || 0} task${project[metricKey] !== 1 ? 's' : ''}`;

                    const shouldBreakAllProject = shouldBreakAllText(project.name);

                    return (
                        <ul key={project.id} className="w-full">
                            <Accordion
                                title={
                                    <li className="text-[18px] cursor-pointer font-bold hover:underline break-words w-full">

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
                                    {groupedProjectsAndTasks[project.id]?.map((taskId, index) => {
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
            {sortedTasksWithNoParent.slice(0, maxTasksWithNoParent)?.map((taskId, index) => {
                return <div key={taskId + index} className="w-full">{renderNestedTasks(taskId)}</div>;
            })}
        </div>
    );
};

export default NestedProgressBars