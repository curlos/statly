import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import DayWithCompletedTasks from './DayWithCompletedTasks/DayWithCompletedTasks';

const CompletedTaskList = ({
	daysWithCompletedTasks,
	ancestorTasksById,
	allCompletedTasksAreHere,
	sortBy,
	currentPage,
	sortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
}) => {
	const {
		completedTasksPageSettings: { maxDaysPerPage },
	} = useUserSettingsContext();

	/**
	 * @description Sorts the focus records by the selected sorting option and also only shows X amount of focus records per page based on the MAX number that is set.
	 */
	// const getShownCompletedTasks = () => {
	// 	const endIndex = currentPage * maxDaysPerPage;
	// 	const startIndex = endIndex - maxDaysPerPage;

	// 	const noSearchText = sortBy !== 'Most Relevant';

	// 	const sortedDatesWithCompletedTasks = noSearchText
	// 		? filteredDaysWithCompletedTasks?.toSorted((dateWithCompletedTaskOne, dateWithCompletedTaskTwo) => {
	// 				if (sortBy === 'Newest' || sortBy === 'Oldest') {
	// 					const dateOne = new Date(dateWithCompletedTaskOne.dateStr);
	// 					const dateTwo = new Date(dateWithCompletedTaskTwo.dateStr);

	// 					if (sortBy === 'Newest') {
	// 						return dateTwo - dateOne;
	// 					} else if (sortBy === 'Oldest') {
	// 						return dateOne - dateTwo;
	// 					}
	// 				} else if (sortBy.startsWith('Completed Tasks')) {
	// 					const dateWithCompletedTaskOneLength = dateWithCompletedTaskOne.completedTasksForDay.length;
	// 					const dateWithCompletedTaskTwoLength = dateWithCompletedTaskTwo.completedTasksForDay.length;

	// 					if (sortBy === 'Completed Tasks: Most-Least') {
	// 						return dateWithCompletedTaskTwoLength - dateWithCompletedTaskOneLength;
	// 					} else if (sortBy === 'Completed Tasks: Least-Most') {
	// 						return dateWithCompletedTaskOneLength - dateWithCompletedTaskTwoLength;
	// 					}
	// 				}
	// 			})
	// 		: filteredDaysWithCompletedTasks;

	// 	return sortedDatesWithCompletedTasks?.slice(startIndex, endIndex);
	// };

	// const shownCompletedTasks = getShownCompletedTasks();

	const themeContext = useThemeContext();
	const { selectedLoaderCardImage } = themeContext;

	return (
		<div>
			{!allCompletedTasksAreHere || !daysWithCompletedTasks ? (
				<div className="flex w-full h-full bg-color-gray-700 flex items-center justify-center">
					<div>
						<img src={selectedLoaderCardImage} className="h-[175px] animate-pulse" />
					</div>
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
					<ModalFilterSidebar
						{...{
							isOpen: showFilterSidebar,
							setIsOpen: setShowFilterSidebar,
							sortByOptions,
							page: 'completed-tasks-page',
						}}
					/>
				</>
			)}
		</div>
	);
};

export default CompletedTaskList;
