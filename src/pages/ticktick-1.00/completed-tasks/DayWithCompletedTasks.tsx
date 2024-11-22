import Icon from '../../../components/Icon';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useGetTodoistAllCompletedTasksQuery } from '../../../services/resources/oldFocusAppsApi';
import Accordion from '../../../components/Accordion/Accordion';

const DayWithCompletedTasks = ({ dateWithCompletedTasks, isLastItemForTheDay = false }) => {
	const { updateQueryParams } = useSearchParamsContext();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { completedTasksGroupedByDate } = fetchedTasks || {};

	// RTK Query - Todoist - All Completed Tasks
	const { data: fetchedTodoistAllCompletedTasks } = useGetTodoistAllCompletedTasksQuery();
	const { todoistCompletedTasksGroupedByDate } = fetchedTodoistAllCompletedTasks || {};

	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor } = chosenColorObj;

	console.log(dateWithCompletedTasks);

	const { dateStr, completedTasksForDay } = dateWithCompletedTasks;

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
							<div className="text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer hover:text-blue-500 hover:underline">
								<span>{dateStr}</span>
								<span> ({completedTasksForDay.length})</span>
							</div>
						}
						openByDefault={true}
					>
						<div className="space-y-1">
							{completedTasksForDay.map((task) => {
								return (
									<div className="flex items-start gap-1">
										<Icon name="check_box" customClass={classNames('!text-[20px] text-white')} />
										<div className="mt-[-2px]">{task.title}</div>
									</div>
								);
							})}
						</div>
					</Accordion>
				</div>
			</div>
		</div>
	);
};

export default DayWithCompletedTasks;
