import Icon from '../../../components/Icon';
import LazyImage from '../../../components/LazyImage';
import classNames from 'classnames';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import Accordion from '../../../components/Accordion/Accordion';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { useUserSettingsContext } from '../../focus-records/useUserSettingsContext';
import CompletedTasksWithBreadcrumbs from './CompletedTasksWithBreadcrumbs';
import NestedCompletedTasks from './NestedCompletedTasks';
import {
	getGroupedSubtasksAndParentTasks,
	getTasksWithParentIdAndNoParent,
} from './getGroupedSubtasksAndParentTasks.util';
import { BATTLEFIELD_1_MEDALS_BY_URL, BATTLEFIELD_3_MEDALS_BY_URL } from '../../medals/medalsLinks';
import { getMedalImageClasses } from '../../../utils/helpers.utils';
import FocusRecordContextMenu from '../../../components/FocusRecordContextMenu';
import ModalConfirmDelete from '../../../components/Modal/ModalConfirmDelete';
import Dropdown from '../../../components/Dropdown/Dropdown';
import FocusRecordMenuItems from '../../../components/FocusRecordMenuItems';
import { useDayCardMenu } from './useDayCardMenu';
import type { DayWithCompletedTasks as DayWithCompletedTasksType, AncestorTask } from '../../../types/api';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';

interface DayWithCompletedTasksProps {
	dateWithCompletedTasks: DayWithCompletedTasksType;
	isLastItemForTheDay?: boolean;
	ancestorTasksById: Record<string, AncestorTask>;
}

/**
 * @description This is a card that will show the Completed Tasks for a specific day.
 */
const DayWithCompletedTasks: React.FC<DayWithCompletedTasksProps> = ({ dateWithCompletedTasks, isLastItemForTheDay = false, ancestorTasksById }) => {

	// Context
	const { updateQueryParams } = useSearchParamsContext();
	const {
		completedTasksPageSettings: { groupedTasksCollapsedByDefault, showIndentedTasks },
		focusRecordsPageSettings: { showMedals, selectedMedalImage, medalImageSizePx, showMedalGlow },
	} = useUserSettingsContext();

	// Theme Context
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { textColor, bgColorHalfOpacity, borderColor } = chosenColorObj;

	const { dateStr, completedTasksForDay } = dateWithCompletedTasks;

	// Fetch projects for markdown serialization
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	// Custom hook for day card menu
	const {
		contextMenuVisible,
		setContextMenuVisible,
		contextMenuPosition,
		handleContextMenu,
		dropdownOpen,
		setDropdownOpen,
		dropdownToggleRef,
		deleteModalOpen,
		setDeleteModalOpen,
		isDeleting,
		handleDelete,
		menuItems,
	} = useDayCardMenu({
		dateStr,
		completedTasksForDay,
		showIndentedTasks,
		projectsById
	});

	const { groupedSubtasksByParentTask } = getGroupedSubtasksAndParentTasks({
		completedTasksForDay,
		ancestorTasksById
	});

	const { tasksWithParentId, tasksWithNoParent } = getTasksWithParentIdAndNoParent({
		completedTasksForDay,
		ancestorTasksById
	});

	const updateTaskIdQueryParam = (taskId: string) => {
		// All the other query params must be cleared to show all of the tasks from the specific task id.
		updateQueryParams({
			'task-id': taskId,
			'sort-by': '',
			search: '',
			'start-date': '',
			'end-date': '',
			projects: '',
			page: '',
		});
	};

	const handleClickDay = (e: React.MouseEvent) => {
		e.stopPropagation();
		const newDayUrl = getFormattedShortMonthDay(new Date(dateStr));
		updateQueryParams({ 'start-date': newDayUrl, 'end-date': newDayUrl, 'date-interval': 'Day', page: '' });
	};

	const isBattlefieldOneOrThreeMedal = !!(
		BATTLEFIELD_1_MEDALS_BY_URL[selectedMedalImage] || BATTLEFIELD_3_MEDALS_BY_URL[selectedMedalImage]
	);

	return (
		<div
			className={classNames(
				'm-0 list-none last:mb-[4px] w-full',
				showMedals ? 'flex' : 'relative',
				showMedals && !isBattlefieldOneOrThreeMedal ? 'gap-2' : ''
			)}
			style={{ minHeight: '54px' }}
		>
			{showMedals && (
				<LazyImage
					src={selectedMedalImage}
					alt="Medal image"
					className={getMedalImageClasses(medalImageSizePx, isBattlefieldOneOrThreeMedal, selectedMedalImage)}
					showGlow={showMedalGlow}
				/>
			)}

			{!showMedals && (
				<div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
					<Icon name="check_box" customClass={classNames('!text-[20px]', textColor)} />
				</div>
			)}

			{!isLastItemForTheDay && !showMedals && (
				<div
					className={classNames(
						'absolute top-[28px] left-[11px] h-full border-solid border-l-[1px]',
						borderColor
					)}
					style={{ height: 'calc(100% - 16px)' }}
				></div>
			)}

			<div
				className={classNames(showMedals ? 'w-full' : 'ml-[25px] sm:ml-[40px]', 'relative m-0 break-words')}
				style={{ marginTop: 'unset' }}
			>
				{!isLastItemForTheDay && !showMedals && (
					<div
						className={classNames(
							'absolute left-[-18px] sm:left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600',
							borderColor
						)}
						style={{ top: '34px' }}
					></div>
				)}

				<div
					className={classNames(bgColorHalfOpacity, 'p-2 rounded-lg w-[95%] sm:w-full relative')}
					onContextMenu={handleContextMenu}
				>
					{/* Three-dot dropdown menu (positioned outside Accordion button to avoid nested buttons) */}
					<div className="absolute top-[14px] right-[30px] z-10 flex-shrink-0" ref={dropdownToggleRef}>
						<Icon
							name="more_horiz"
							customClass="text-color-gray-50 !text-[20px] cursor-pointer hover:text-white transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								setContextMenuVisible(false);
								setDropdownOpen(!dropdownOpen);
							}}
						/>

						<Dropdown
							isVisible={dropdownOpen}
							setIsVisible={setDropdownOpen}
							toggleRef={dropdownToggleRef}
							customClasses="min-w-[200px] !text-[14px]"
						>
							<FocusRecordMenuItems
								menuItems={menuItems}
								onItemClick={() => setDropdownOpen(false)}
							/>
						</Dropdown>
					</div>

					<Accordion
						title={
							<div className="flex items-center justify-between w-full gap-2">
								<div
									className="text-[18px] md:text-[22px] font-bold truncate md:max-w-[500px] lg:max-w-[700px] xl:max-w-[900px] cursor-pointer hover:text-blue-500 hover:underline"
									onClick={handleClickDay}
								>
									<span>{dateStr.replace(/\b0(\d),/, '$1,')}</span>
									<span> ({completedTasksForDay.length})</span>
								</div>
							</div>
						}
						openByDefault={true}
					>
						<div className="space-y-5">
							{showIndentedTasks ? (
								<NestedCompletedTasks
									{...{
										tasksWithNoParent,
										tasksWithParentId,
										groupedSubtasksByParentTask,
										groupedTasksCollapsedByDefault,
										dateStr,
										updateTaskIdQueryParam,
										ancestorTasksById
									}}
								/>
							) : (
								<CompletedTasksWithBreadcrumbs
									{...{
										ancestorTasksById,
										groupedSubtasksByParentTask,
										dateStr,
										updateTaskIdQueryParam,
										groupedTasksCollapsedByDefault,
									}}
								/>
							)}
						</div>
					</Accordion>
				</div>
			</div>

			{/* Context Menu (right-click) */}
			<FocusRecordContextMenu
				isVisible={contextMenuVisible}
				position={contextMenuPosition}
				menuItems={menuItems}
				onClose={() => setContextMenuVisible(false)}
			/>

			{/* Delete Confirmation Modal */}
			<ModalConfirmDelete
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDelete}
				title={`Delete ${completedTasksForDay.length} Tasks`}
				counts={{ tasks: completedTasksForDay.length }}
				isDeleting={isDeleting}
				showCounts={true}
			/>
		</div>
	);
};

export default DayWithCompletedTasks;
