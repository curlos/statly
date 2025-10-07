import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import DayWithCompletedTasks from './DayWithCompletedTasks/DayWithCompletedTasks';
import DayWithCompletedTasksSkeleton from './DayWithCompletedTasks/DayWithCompletedTasksSkeleton';

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
							<div>No Completed Tasks</div>
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
