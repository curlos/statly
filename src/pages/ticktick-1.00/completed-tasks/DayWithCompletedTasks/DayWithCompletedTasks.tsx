import Icon from '../../../../components/Icon';
import LazyImage from '../../../../components/LazyImage';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import Accordion from '../../../../components/Accordion/Accordion';
import { getFormattedShortMonthDay } from '../../../../utils/date.utils';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';
import { useGetTodoistAllTasksQuery } from '../../../../services/resources/oldFocusAppsApi';
import CompletedTasksWithBreadcrumbs from './CompletedTasksWithBreadcrumbs';
import NestedCompletedTasks from './NestedCompletedTasks';
import {
	getGroupedSubtasksAndParentTasks,
	getTasksWithParentIdAndNoParent,
} from './getGroupedSubtasksAndParentTasks.util';
import { BATTLEFIELD_1_MEDALS_BY_URL, BATTLEFIELD_3_MEDALS_BY_URL } from '../../medals/medalsLinks';
import { getMedalImageClasses } from '../../../../utils/focus-apps/helpers.utils';

/**
 * @description This is a card that will show the Completed Tasks for a specific day.
 */
const DayWithCompletedTasks = ({ dateWithCompletedTasks, isLastItemForTheDay = false }) => {
	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById, ancestorTasksById } = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistAllTasksById } = useGetTodoistAllTasksQuery();
	const { todoistAllTasksById, todoistAncestorTasksById } = fetchedTodoistAllTasksById || {};

	// Context
	const { updateQueryParams } = useSearchParamsContext();
	const {
		completedTasksPageSettings: { groupedTasksCollapsedByDefault, showIndentedTasks },
		focusRecordsPageSettings: { showMedals, selectedMedalImage, medalImageSizePx },
	} = useUserSettingsContext();

	// Theme Context
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor } = chosenColorObj;

	const { dateStr, completedTasksForDay } = dateWithCompletedTasks;

	const { groupedSubtasksByParentTask, parentTasks } = getGroupedSubtasksAndParentTasks({
		completedTasksForDay,
	});

	const { tasksWithParentId, tasksWithNoParent } = getTasksWithParentIdAndNoParent({
		completedTasksForDay,
		tasksById,
		todoistAllTasksById,
		ancestorTasksById,
		todoistAncestorTasksById,
	});

	const updateTaskIdQueryParam = (taskId) => {
		// All the other query params must be cleared to show all of the tasks from the specific task id.
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

	const handleClickDay = (e) => {
		e.stopPropagation();
		const newDayUrl = getFormattedShortMonthDay(new Date(dateStr));
		updateQueryParams({ 'start-date': newDayUrl, 'end-date': newDayUrl, 'date-interval': 'Day', page: '' });
	};

	const isBattlefieldOneOrThreeMedal =
		BATTLEFIELD_1_MEDALS_BY_URL[selectedMedalImage] || BATTLEFIELD_3_MEDALS_BY_URL[selectedMedalImage];

	return (
		<div
			className={classNames(
				'm-0 list-none last:mb-[4px] w-full',
				showMedals ? 'flex' : 'relative',
				showMedals && !isBattlefieldOneOrThreeMedal ? 'gap-2' : ''
			)}
			style={{ minHeight: '54px' }}
		>
			{showMedals && (
				<LazyImage
					src={selectedMedalImage}
					alt="Medal image"
					className={getMedalImageClasses(medalImageSizePx, isBattlefieldOneOrThreeMedal)}
				/>
			)}

			{!showMedals && (
				<div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
					<Icon name="check_box" customClass={classNames('!text-[20px]', textColor)} />
				</div>
			)}

			{!isLastItemForTheDay && !showMedals && (
				<div
					className={classNames(
						'absolute top-[28px] left-[11px] h-full border-solid border-l-[1px]',
						borderColor
					)}
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div
				className={classNames(showMedals ? 'w-full' : 'ml-[25px] sm:ml-[40px]', 'relative m-0 break-words')}
				style={{ marginTop: 'unset' }}
			>
				{!isLastItemForTheDay && !showMedals && (
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
								onClick={handleClickDay}
							>
								<span>{dateStr}</span>
								<span> ({completedTasksForDay.length})</span>
							</div>
						}
						openByDefault={true}
					>
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
										updateTaskIdQueryParam,
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
