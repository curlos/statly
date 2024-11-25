import Icon from '../../../../components/Icon';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import Accordion from '../../../../components/Accordion/Accordion';
import { getFormattedShortMonthDay } from '../../../../utils/date.utils';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';
import { useGetTodoistAllTasksQuery } from '../../../../services/resources/oldFocusAppsApi';
import CompletedTasksWithBreadcrumbs from './CompletedTasksWithBreadcrumbs';
import CompletedTask from './CompletedTask';
import NestedCompletedTasks from './NestedCompletedTasks';
import { getGroupedSubtasksAndParentTasks } from './getGroupedSubtasksAndParentTasks.util';

const DayWithCompletedTasks = ({ dateWithCompletedTasks, isLastItemForTheDay = false }) => {
	const { updateQueryParams } = useSearchParamsContext();

	const {
		completedTasksPageSettings: { groupedTasksCollapsedByDefault, showIndentedTasks },
	} = useUserSettingsContext();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById, ancestorTasksById } = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistAllTasksById } = useGetTodoistAllTasksQuery();
	const { todoistAllTasksById, todoistAncestorTasksById } = fetchedTodoistAllTasksById || {};

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor } = chosenColorObj;

	const { dateStr, completedTasksForDay } = dateWithCompletedTasks;

	const { groupedSubtasksByParentTask, parentTasks, tasksWithParentId, tasksWithNoParent } =
		getGroupedSubtasksAndParentTasks({
			completedTasksForDay,
			tasksById,
			todoistAllTasksById,
			ancestorTasksById,
			todoistAncestorTasksById,
		});

	const updateTaskIdQueryParam = (taskId) => {
		updateQueryParams({
			'task-id': taskId,
			'sort-by': '',
			search: '',
			'start-date': '',
			'end-date': '',
			projects: '',
			page: '',
		});
	};

	return (
		<div className="relative m-0 list-none last:mb-[4px] w-full" style={{ minHeight: '54px' }}>
			<div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
				<Icon name="timer" customClass={classNames('!text-[20px]', textColor)} />
			</div>

			{!isLastItemForTheDay && (
				<div
					className={classNames(
						'absolute top-[28px] left-[11px] h-full border-solid border-l-[1px]',
						borderColor
					)}
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div className="relative m-0 ml-[25px] sm:ml-[40px] break-words" style={{ marginTop: 'unset' }}>
				{!isLastItemForTheDay && (
					<div
						className={classNames(
							'absolute left-[-18px] sm:left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600',
							borderColor
						)}
						style={{ top: '34px' }}
					></div>
				)}

				<div className={classNames(bgColorHalfOpacity, 'p-2 rounded-lg w-[95%] sm:w-full')}>
					<Accordion
						title={
							<div
								className="text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer hover:text-blue-500 hover:underline"
								onClick={(e) => {
									e.stopPropagation();
									const newDayUrl = getFormattedShortMonthDay(new Date(dateStr));
									updateQueryParams({ 'start-date': newDayUrl, 'end-date': newDayUrl, page: '' });
								}}
							>
								<span>{dateStr}</span>
								<span> ({completedTasksForDay.length})</span>
							</div>
						}
						openByDefault={true}
					>
						<div className="mb-5">
							{parentTasks && parentTasks.length > 0 && (
								<Accordion
									title={<div className="underline font-bold text-[18px]">Tasks With No Parent</div>}
									openByDefault={true}
									showArrowNextToText={true}
								>
									<div className="space-y-1">
										{parentTasks.map((task) => (
											<CompletedTask
												key={dateStr + task.id}
												task={task}
												isFullTask={true}
												updateTaskIdQueryParam={updateTaskIdQueryParam}
											/>
										))}
									</div>
								</Accordion>
							)}
						</div>

						<div className="space-y-5">
							{showIndentedTasks ? (
								<NestedCompletedTasks
									{...{
										tasksWithNoParent,
										tasksWithParentId,
										todoistAllTasksById,
										groupedSubtasksByParentTask,
										tasksById,
										groupedTasksCollapsedByDefault,
										dateStr,
									}}
								/>
							) : (
								<CompletedTasksWithBreadcrumbs
									{...{
										tasksById,
										ancestorTasksById,
										todoistAncestorTasksById,
										groupedSubtasksByParentTask,
										todoistAllTasksById,
										dateStr,
										updateTaskIdQueryParam,
										groupedTasksCollapsedByDefault,
									}}
								/>
							)}
						</div>
					</Accordion>
				</div>
			</div>
		</div>
	);
};

export default DayWithCompletedTasks;
