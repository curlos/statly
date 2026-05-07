import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import { useUserSettingsContext } from '../focus-records/useUserSettingsContext';
import DayWithCompletedTasks from './DayWithCompletedTasks/DayWithCompletedTasks';
import DayWithCompletedTasksSkeleton from './DayWithCompletedTasks/DayWithCompletedTasksSkeleton';
import Icon from '../../components/Icon';
import SyncButton from '../../components/SyncButton';
import { useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import type { DayWithCompletedTasks as DayWithCompletedTasksType, AncestorTask } from '../../types/api';

interface CompletedTaskListProps {
	daysWithCompletedTasks: DayWithCompletedTasksType[];
	ancestorTasksById: Record<string, AncestorTask>;
	isFetching: boolean;
	sortByOptions: string[];
	showFilterSidebar: boolean;
	setShowFilterSidebar: (show: boolean) => void;
}

const CompletedTaskList: React.FC<CompletedTaskListProps> = ({
	daysWithCompletedTasks,
	ancestorTasksById,
	isFetching,
	sortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
}) => {
	const dispatch = useDispatch();
	const { data: fetchedUserSettings } = useGetUserSettingsQuery(undefined);
	const { userSettings } = fetchedUserSettings || {};
	const hasCookie = userSettings?.tickTickCookieSet || false;

	const {
		completedTasksPageSettings: { maxDaysPerPage },
	} = useUserSettingsContext();

	const numberOfDaysForSkeleton = maxDaysPerPage || 7;

	const handleOpenSidebar = () => {
		dispatch(setModalState({ modalId: 'ModalSidebar', isOpen: true }));
	};
	
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
							<div className="flex flex-col items-center justify-center py-12 text-color-gray-25">
								<Icon name="task_alt" customClass="!text-[40px]" />
								<p className="text-lg font-bold">No Completed Tasks</p>
								<p className="mt-1">Sync or import completed tasks from TickTick to see them here</p>

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
