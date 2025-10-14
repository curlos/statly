import { getFocusRecordProperty } from '../../utils/focus-apps/multiFocusApps.utils';
import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import FocusRecord from './FocusRecord';
import FocusRecordSkeleton from './FocusRecordSkeleton';
import { useUserSettingsContext } from './useUserSettingsContext';

const FocusRecordList = ({
	isFetching,
	focusRecords,
	sortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
}) => {
	const {
		focusRecordsPageSettings: { maxFocusRecordsPerPage },
	} = useUserSettingsContext();
	
	const numberOfFocusRecordsForSkeleton = maxFocusRecordsPerPage || 50;

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
