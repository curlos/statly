import { MAX_SHOWN_FOCUS_RECORDS } from '../../../utils/constants.utils';
import { getFocusDuration } from '../../../utils/helpers.utils';
import FilterSidebar from './FilterSidebar/FilterSidebar';
import ModalFilterSidebar from './FilterSidebar/ModalFilterSidebar';
import FocusRecord from './FocusRecord';

const FocusRecordList = ({
	filteredFocusRecords,
	isLoadingGetFocusRecords,
	sortBy,
	currentPage,
	showCompletedTasks,
	setShowCompletedTasks,
	showTotalFocusDuration,
	setShowTotalFocusDuration,
	sortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
}) => {
	/**
	 * @description Sorts the focus records by the selected sorting option and also only shows X amount of focus records per page based on the MAX number that is set.
	 */
	const getShownFocusRecords = () => {
		const endIndex = currentPage * MAX_SHOWN_FOCUS_RECORDS;
		const startIndex = endIndex - MAX_SHOWN_FOCUS_RECORDS;

		const noSearchText = sortBy !== 'Most Relevant';

		const sortedFocusRecords = noSearchText
			? filteredFocusRecords?.toSorted((focusRecordOne, focusRecordTwo) => {
					if (sortBy === 'Newest' || sortBy === 'Oldest') {
						const startTimeOne = new Date(focusRecordOne.startTime);
						const startTimeTwo = new Date(focusRecordTwo.startTime);

						if (sortBy === 'Newest') {
							return startTimeTwo - startTimeOne;
						} else if (sortBy === 'Oldest') {
							return startTimeOne - startTimeTwo;
						}
					} else if (sortBy.startsWith('Focus Hours')) {
						const durationOne = getFocusDuration(focusRecordOne);
						const durationTwo = getFocusDuration(focusRecordTwo);

						if (sortBy === 'Focus Hours: Most-Least') {
							return durationTwo - durationOne;
						} else if (sortBy === 'Focus Hours: Least-Most') {
							return durationOne - durationTwo;
						}
					}
				})
			: filteredFocusRecords;

		return sortedFocusRecords?.slice(startIndex, endIndex);
	};

	const shownFocusRecords = getShownFocusRecords();

	return (
		<>
			{isLoadingGetFocusRecords || !filteredFocusRecords ? (
				<div className="flex w-full h-full bg-color-gray-700 flex items-center justify-center">
					<div>
						<img src="/cod-bo3-icons/Unstoppable_Medal_BO3.webp" className="h-[200px] animate-pulse" />
					</div>
				</div>
			) : (
				<>
					<div className="grid grid-cols-8">
						<div className={showFilterSidebar ? 'col-span-6' : 'col-span-8'}>
							{filteredFocusRecords.length === 0 ? (
								<div>No Focus Records</div>
							) : (
								<div className="space-y-3">
									{shownFocusRecords.map((focusRecord, index) => {
										const isLastItem = index === shownFocusRecords.length - 1;
										const focusRecordKey = focusRecord.id;

										return (
											<FocusRecord
												key={focusRecordKey}
												focusRecord={focusRecord}
												isLastItemForTheDay={isLastItem}
												showCompletedTasks={showCompletedTasks}
											/>
										);
									})}
								</div>
							)}
						</div>
						{showFilterSidebar && (
							<div className="hidden lg:block col-span-2">
								<FilterSidebar
									{...{
										setIsOpen: setShowFilterSidebar,
										showCompletedTasks,
										setShowCompletedTasks,
										showTotalFocusDuration,
										setShowTotalFocusDuration,
										sortByOptions,
										isForModal: false,
									}}
								/>
							</div>
						)}

						<div className="lg:hidden">
							<ModalFilterSidebar
								{...{
									isOpen: showFilterSidebar,
									setIsOpen: setShowFilterSidebar,
									sortByOptions,
									showCompletedTasks,
									setShowCompletedTasks,
									showTotalFocusDuration,
									setShowTotalFocusDuration,
								}}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default FocusRecordList;
