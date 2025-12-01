import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import DayWithCompletedTasks from './DayWithCompletedTasks/DayWithCompletedTasks';
import DayWithCompletedTasksSkeleton from './DayWithCompletedTasks/DayWithCompletedTasksSkeleton';
import Icon from '../../components/Icon';

const CompletedTaskList = ({
	daysWithCompletedTasks,
	ancestorTasksById,
	isFetching,
	sortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
}) => {
	const {
		completedTasksPageSettings: { maxDaysPerPage },
	} = useUserSettingsContext();

	const numberOfDaysForSkeleton = maxDaysPerPage || 7
	
	return (
		<div>
			{isFetching || !daysWithCompletedTasks ? (
				<div className="space-y-3">
					{Array.from({ length: numberOfDaysForSkeleton }).map((_, index) => (
						<DayWithCompletedTasksSkeleton key={index} isLastItem={index === numberOfDaysForSkeleton - 1} />
					))}
				</div>
			) : (
				<>
					<div>
						{daysWithCompletedTasks.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
								<Icon name="task_alt" customClass="!text-[40px]" />
								<p className="text-lg font-bold">No Completed Tasks</p>
								<p className="mt-1">Sync or import completed tasks from TickTick to see them here</p>
							</div>
						) : (
							<div className="space-y-3">
								{daysWithCompletedTasks.map((dateWithCompletedTasks, index) => {
									const isLastItem = index === daysWithCompletedTasks.length - 1;

									return (
										<DayWithCompletedTasks
											key={dateWithCompletedTasks.dateStr}
											dateWithCompletedTasks={dateWithCompletedTasks}
											isLastItemForTheDay={isLastItem}
											ancestorTasksById={ancestorTasksById}
										/>
									);
								})}
							</div>
						)}
					</div>
				</>
			)}

			<ModalFilterSidebar
				{...{
					isOpen: showFilterSidebar,
					setIsOpen: setShowFilterSidebar,
					sortByOptions,
					page: 'completed-tasks-page'
				}}
			/>
		</div>
	);
};

export default CompletedTaskList;
