import { getFocusDuration } from '../../utils/focus-apps/focusRecords.utils';
import { getFocusRecordProperty } from '../../utils/focus-apps/multiFocusApps.utils';
import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import FocusRecord from './FocusRecord';
import FocusRecordSkeleton from './FocusRecordSkeleton';
import { useUserSettingsContext } from './useUserSettingsContext';

const FocusRecordList = ({
	isFetching,
	focusRecords,
	sortBy,
	currentPage,
	sortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
}) => {
	const {
		focusRecordsPageSettings: { maxFocusRecordsPerPage },
	} = useUserSettingsContext();

	/**
	 * @description Sorts the focus records by the selected sorting option and also only shows X amount of focus records per page based on the MAX number that is set.
	 */
	// const getShownFocusRecords = () => {
	// 	const endIndex = currentPage * maxFocusRecordsPerPage;
	// 	const startIndex = endIndex - maxFocusRecordsPerPage;

	// 	const noSearchText = sortBy !== 'Most Relevant';

	// 	const sortedFocusRecords = noSearchText
	// 		? focusRecords?.toSorted((focusRecordOne, focusRecordTwo) => {
	// 				const startTimeOneProperty = getFocusRecordProperty(focusRecordOne, 'startTime');
	// 				const startTimeTwoProperty = getFocusRecordProperty(focusRecordTwo, 'startTime');

	// 				if (sortBy === 'Newest' || sortBy === 'Oldest') {
	// 					const focusRecordOneStartTime = startTimeOneProperty;
	// 					const focusRecordTwoStartTime = startTimeTwoProperty;

	// 					const startTimeOne = new Date(focusRecordOneStartTime);
	// 					const startTimeTwo = new Date(focusRecordTwoStartTime);

	// 					if (sortBy === 'Newest') {
	// 						return startTimeTwo - startTimeOne;
	// 					} else if (sortBy === 'Oldest') {
	// 						return startTimeOne - startTimeTwo;
	// 					}
	// 				} else if (sortBy.startsWith('Focus Hours')) {
	// 					const durationOne = getFocusDuration({ focusRecord: focusRecordOne });
	// 					const durationTwo = getFocusDuration({ focusRecord: focusRecordTwo });

	// 					if (sortBy === 'Focus Hours: Most-Least') {
	// 						return durationTwo - durationOne;
	// 					} else if (sortBy === 'Focus Hours: Least-Most') {
	// 						return durationOne - durationTwo;
	// 					}
	// 				}
	// 			})
	// 		: focusRecords;

	// 	return sortedFocusRecords?.slice(startIndex, endIndex);
	// };

	// const shownFocusRecords = getShownFocusRecords();
	const numberOfFocusRecordsForSkeleton = maxFocusRecordsPerPage || 50;

	console.log(focusRecords)

	return (
		<div>
			{isFetching || !focusRecords ? (
				<div className="space-y-3">
					{Array.from({ length: numberOfFocusRecordsForSkeleton }).map((_, index) => (
						<FocusRecordSkeleton key={index} isLastItem={index === numberOfFocusRecordsForSkeleton - 1} />
					))}
				</div>
			) : (
				<>
					<div>
						{focusRecords.length === 0 ? (
							<div className="container">No Focus Records</div>
						) : (
							<div className="space-y-3">
								{focusRecords.map((focusRecord, index) => {
									const isLastItem = index === focusRecords.length - 1;

									const focusRecordKey = getFocusRecordProperty(focusRecord, 'key');

									return (
										<FocusRecord
											key={focusRecordKey}
											focusRecord={focusRecord}
											isLastItemForTheDay={isLastItem}
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
					page: 'focus-records-page',
				}}
			/>
		</div>
	);
};

export default FocusRecordList;
