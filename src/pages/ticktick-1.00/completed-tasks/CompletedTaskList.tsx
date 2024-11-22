import { getFocusRecordProperty } from '../../../utils/focus-apps/multiFocusApps.utils';
import ModalFilterSidebar from '../../../components/FilterSidebar/ModalFilterSidebar';
import { useFilterCompletedTasks } from './useFilterCompletedTasks';
import CompletedTasksByDay from './CompletedTasksByDay';

const CompletedTaskList = ({
	filteredCompletedTasksByDay,
	allCompletedTasksAreHere,
	sortBy,
	currentPage,
	sortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
}) => {
	// TODO: Add a "maxDaysPerPage" property in the user settings for the Completed Tasks page.
	// const { maxFocusRecordsPerPage } = useUserSettingsContext();
	const maxDaysPerPage = 10;

	/**
	 * @description Sorts the focus records by the selected sorting option and also only shows X amount of focus records per page based on the MAX number that is set.
	 */
	const getShownCompletedTasks = () => {
		const endIndex = currentPage * maxDaysPerPage;
		const startIndex = endIndex - maxDaysPerPage;

		const noSearchText = sortBy !== 'Most Relevant';

		// const sortedFocusRecords = noSearchText
		// 	? filteredCompletedTasksByDay?.toSorted((focusRecordOne, focusRecordTwo) => {
		// 			const startTimeOneProperty = getFocusRecordProperty(focusRecordOne, 'startTime');
		// 			const startTimeTwoProperty = getFocusRecordProperty(focusRecordTwo, 'startTime');

		// 			if (sortBy === 'Newest' || sortBy === 'Oldest') {
		// 				const focusRecordOneStartTime = startTimeOneProperty;
		// 				const focusRecordTwoStartTime = startTimeTwoProperty;

		// 				const startTimeOne = new Date(focusRecordOneStartTime);
		// 				const startTimeTwo = new Date(focusRecordTwoStartTime);

		// 				if (sortBy === 'Newest') {
		// 					return startTimeTwo - startTimeOne;
		// 				} else if (sortBy === 'Oldest') {
		// 					return startTimeOne - startTimeTwo;
		// 				}
		// 			} else if (sortBy.startsWith('Focus Hours')) {
		// 				const durationOne = getFocusDuration({ focusRecord: focusRecordOne });
		// 				const durationTwo = getFocusDuration({ focusRecord: focusRecordTwo });

		// 				if (sortBy === 'Focus Hours: Most-Least') {
		// 					return durationTwo - durationOne;
		// 				} else if (sortBy === 'Focus Hours: Least-Most') {
		// 					return durationOne - durationTwo;
		// 				}
		// 			}
		// 		})
		// 	: filteredCompletedTasksByDay;

		return filteredCompletedTasksByDay?.slice(startIndex, endIndex);
	};

	const shownCompletedTasks = getShownCompletedTasks();

	console.log(filteredCompletedTasksByDay);

	return (
		<div>
			{!allCompletedTasksAreHere || !filteredCompletedTasksByDay ? (
				<div className="flex w-full h-full bg-color-gray-700 flex items-center justify-center">
					<div>
						<img src="https://i.imgur.com/tFa0En4.png" className="h-[175px] animate-pulse" />
					</div>
				</div>
			) : (
				<>
					<div>
						{filteredCompletedTasksByDay.length === 0 ? (
							<div>No Focus Records</div>
						) : (
							<div className="space-y-3">
								{shownCompletedTasks.map((dateWithCompletedTasks, index) => {
									const isLastItem = index === shownCompletedTasks.length - 1;

									return (
										<CompletedTasksByDay
											key={dateWithCompletedTasks.dateStr}
											dateWithCompletedTasks={dateWithCompletedTasks}
											isLastItemForTheDay={isLastItem}
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
						}}
					/>
				</>
			)}
		</div>
	);
};

export default CompletedTaskList;
