import { getFocusRecordProperty } from '../../utils/focus-apps/multiFocusApps.utils';
import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import FocusRecord from './FocusRecord/FocusRecord';
import FocusRecordSkeleton from './FocusRecordSkeleton';
import { useUserSettingsContext } from './useUserSettingsContext';
import Icon from '../../components/Icon';
import EmotionCountDisplay from './EmotionCountDisplay';

const FocusRecordList = ({
	isFetching,
	focusRecords,
	emotionCounts,
	showEmotionCount,
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
			{showEmotionCount && emotionCounts && <EmotionCountDisplay emotionCounts={emotionCounts} />}

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
							<div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
								<Icon name="timer" customClass="!text-[40px]" />
								<p className="text-lg font-bold">No Focus Records</p>
								<p className="mt-1">Sync or import focus records from TickTick to see them here</p>
							</div>
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
