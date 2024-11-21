import { getFocusDuration } from '../../../utils/focus-apps/focusRecords.utils';
import { getFocusRecordProperty } from '../../../utils/focus-apps/multiFocusApps.utils';
import ModalFilterSidebar from '../../../components/FilterSidebar/ModalFilterSidebar';
import FocusRecord from './FocusRecord';
import { useUserSettingsContext } from './useUserSettingsContext';

const FocusRecordList = ({
	filteredFocusRecords,
	isLoadingGetFocusRecords,
	sortBy,
	currentPage,
	sortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
}) => {
	const { maxFocusRecordsPerPage } = useUserSettingsContext();

	/**
	 * @description Sorts the focus records by the selected sorting option and also only shows X amount of focus records per page based on the MAX number that is set.
	 */
	const getShownFocusRecords = () => {
		const endIndex = currentPage * maxFocusRecordsPerPage;
		const startIndex = endIndex - maxFocusRecordsPerPage;

		const noSearchText = sortBy !== 'Most Relevant';

		const sortedFocusRecords = noSearchText
			? filteredFocusRecords?.toSorted((focusRecordOne, focusRecordTwo) => {
					const startTimeOneProperty = getFocusRecordProperty(focusRecordOne, 'startTime');
					const startTimeTwoProperty = getFocusRecordProperty(focusRecordTwo, 'startTime');

					if (sortBy === 'Newest' || sortBy === 'Oldest') {
						const focusRecordOneStartTime = startTimeOneProperty;
						const focusRecordTwoStartTime = startTimeTwoProperty;

						const startTimeOne = new Date(focusRecordOneStartTime);
						const startTimeTwo = new Date(focusRecordTwoStartTime);

						if (sortBy === 'Newest') {
							return startTimeTwo - startTimeOne;
						} else if (sortBy === 'Oldest') {
							return startTimeOne - startTimeTwo;
						}
					} else if (sortBy.startsWith('Focus Hours')) {
						const durationOne = getFocusDuration({ focusRecord: focusRecordOne });
						const durationTwo = getFocusDuration({ focusRecord: focusRecordTwo });

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
		<div>
			{isLoadingGetFocusRecords || !filteredFocusRecords ? (
				<div className="flex w-full h-full bg-color-gray-700 flex items-center justify-center">
					<div>
						<img src="https://i.imgur.com/tFa0En4.png" className="h-[175px] animate-pulse" />
					</div>
				</div>
			) : (
				<>
					<div>
						{filteredFocusRecords.length === 0 ? (
							<div>No Focus Records</div>
						) : (
							<div className="space-y-3">
								{shownFocusRecords.map((focusRecord, index) => {
									const isLastItem = index === shownFocusRecords.length - 1;

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

export default FocusRecordList;
