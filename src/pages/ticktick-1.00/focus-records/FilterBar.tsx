import Icon from '../../../components/Icon';
import AppliedFilterItemList from './AppliedFilterItemList';
import { useFilterFocusRecords } from './useFilterFocusRecords';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { getFormattedDuration } from '../../../utils/focus-apps/helpers.utils';
import { useUserSettingsContext } from './useUserSettingsContext';
import { getFocusDurationFromArray } from '../../../utils/focus-apps/focusRecords.utils';

const FilterBar = ({
	defaultFocusRecords,
	filteredFocusRecords,
	setFilteredFocusRecords,
	setSortByOptions,
	showFilterSidebar,
	setShowFilterSidebar,
	DEFAULT_SORT_BY_OPTIONS,
	stickyRef,
	isFilterBarSticky,
}) => {
	const { searchParams } = useSearchParamsContext();
	const taskIdToFilterBy = searchParams.get('task-id');

	const { showTotalFocusDuration, filterOutUnrelatedTasksWhenTaskIdIsApplied } = useUserSettingsContext();

	useFilterFocusRecords({
		taskIdToFilterBy,
		setFilteredFocusRecords,
		defaultFocusRecords,
		setSortByOptions,
		DEFAULT_SORT_BY_OPTIONS,
	});

	const filterByTaskId = filterOutUnrelatedTasksWhenTaskIdIsApplied ? taskIdToFilterBy : false;
	const totalFocusDuration = getFocusDurationFromArray(filteredFocusRecords, true, filterByTaskId);

	return (
		<div ref={stickyRef} className="bg-color-gray-700 sticky top-0 z-[1] pt-2">
			<div className="flex justify-between items-center pb-5 container">
				<div className="flex justify-between items-center gap-3 w-full">
					<h2 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
						Focus Records ({(filteredFocusRecords?.length || 0).toLocaleString()})
						{showTotalFocusDuration && ` - ${getFormattedDuration(totalFocusDuration, false)}`}
					</h2>

					<div className="text-[16px] cursor-pointer">
						<div
							className="flex items-center gap-2 rounded-3xl border border-color-gray-200 px-4 py-1"
							onClick={() => setShowFilterSidebar(!showFilterSidebar)}
						>
							<div className="hidden sm:block">Filter & Sort</div>
							<Icon
								name="page_info"
								fill={0}
								customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
							/>
						</div>
					</div>
				</div>
			</div>

			{!isFilterBarSticky && (
				<div className="container">
					<AppliedFilterItemList />
				</div>
			)}
		</div>
	);
};

export default FilterBar;
