import { useEffect, useRef } from 'react';
import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import FocusRecord from './FocusRecord/FocusRecord';
import FocusRecordSkeleton from './FocusRecordSkeleton';
import { useUserSettingsContext } from './useUserSettingsContext';
import Icon from '../../components/Icon';
import EmotionCountDisplay from './EmotionCountDisplay';
import SyncButton from '../../components/SyncButton';
import { useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import type { FocusRecord as FocusRecordType } from '../../types/models';

interface FocusRecordListProps {
	isFetching: boolean;
	focusRecords: FocusRecordType[];
	emotionCounts: Record<string, number>;
	showEmotionCount: boolean;
	sortByOptions: string[];
	showFilterSidebar: boolean;
	setShowFilterSidebar: (show: boolean) => void;
}

const FocusRecordList: React.FC<FocusRecordListProps> = ({
	isFetching,
	focusRecords,
	emotionCounts,
	showEmotionCount,
	sortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
}) => {
	const dispatch = useDispatch();
	const pendingFocusIdRef = useRef<string | null>(null);

	// When focusRecords changes (after a delete + refetch), focus the stored sibling
	useEffect(() => {
		if (!pendingFocusIdRef.current) return;
		const id = pendingFocusIdRef.current;
		pendingFocusIdRef.current = null;
		document.querySelector<HTMLElement>(
			`[data-focus-record-id="${id}"] button[aria-haspopup="menu"]`
		)?.focus();
	}, [focusRecords]);

	const { data: fetchedUserSettings } = useGetUserSettingsQuery(undefined);
	const { userSettings } = fetchedUserSettings || {};
	const hasCookie = userSettings?.tickTickCookieSet || false;

	const {
		focusRecordsPageSettings: { maxFocusRecordsPerPage },
	} = useUserSettingsContext();

	const numberOfFocusRecordsForSkeleton = maxFocusRecordsPerPage || 50;

	const handleOpenSidebar = () => {
		dispatch(setModalState({ modalId: 'ModalSidebar', isOpen: true }));
	};

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
							<div className="container flex flex-col items-center justify-center py-12 text-color-gray-25">
								<Icon name="timer" customClass="!text-[40px]" />
								<p className="text-lg font-bold">No Focus Records</p>
								<p className="mt-1">Sync or import focus records from TickTick to see them here</p>

								{/* Show sync button or add cookie button */}
								<div className="mt-4">
									{hasCookie ? (
										<SyncButton showText={true} customClass="flex items-center gap-2 px-3 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed" />
									) : (
										<button
											onClick={handleOpenSidebar}
											className="flex items-center gap-2 px-4 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded-full text-white font-semibold"
										>
											<Icon name="cookie" fill={1} customClass="!text-[20px]" />
											<span>Add TickTick Cookie & Sync</span>
										</button>
									)}
								</div>
							</div>
						) : (
							<div className="space-y-3">
								{focusRecords.map((focusRecord, index) => {
									const isLastItem = index === focusRecords.length - 1;

									return (
										<FocusRecord
											key={focusRecord.id}
											focusRecord={focusRecord}
											isLastItemForTheDay={isLastItem}
											pendingFocusIdRef={pendingFocusIdRef}
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
