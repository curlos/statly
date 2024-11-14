import { useState } from 'react';
import Icon from '../../../components/Icon';
import AppliedFilterItemList from './AppliedFilterItemList';
import ModalFilterSidebar from './ModalFilterSidebar/ModalFilterSidebar';
import { useFilterFocusRecords } from './useFilterFocusRecords';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';

const FilterBar = ({
	groupBy,
	searchTextFromUrl,
	defaultFocusRecords,
	filteredFocusRecords,
	setFilteredFocusRecords,
	showCompletedTasks,
	setShowCompletedTasks,
}) => {
	const { searchParams } = useSearchParamsContext();
	const taskIdToFilterBy = searchParams.get('task-id');

	const GROUP_BY_OPTIONS = ['Date', 'Task', 'Project', 'No Group'];
	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	const [sortByOptions, setSortByOptions] = useState(DEFAULT_SORT_BY_OPTIONS);
	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

	useFilterFocusRecords({
		taskIdToFilterBy,
		setFilteredFocusRecords,
		defaultFocusRecords,
		setSortByOptions,
		DEFAULT_SORT_BY_OPTIONS,
	});

	return (
		<div>
			<div className="flex justify-between items-center pb-5 container">
				<div className="flex justify-between items-center gap-3 w-full">
					<h2 className="font-bold text-[18px] sm:text-[20px] md:text-[24px]">
						Focus Records ({(filteredFocusRecords?.length || 0).toLocaleString()})
					</h2>

					<div className="text-[16px] cursor-pointer">
						<div
							className="flex items-center gap-2 rounded-3xl border border-color-gray-200 px-4 py-1"
							onClick={() => setShowFilterSidebar(true)}
						>
							<div>Filter</div>
							<Icon
								name="page_info"
								fill={0}
								customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
							/>
						</div>
					</div>
				</div>
			</div>

			<AppliedFilterItemList
				{...{
					groupBy,
					taskIdToFilterBy,
				}}
			/>

			<ModalFilterSidebar
				{...{
					isOpen: showFilterSidebar,
					setIsOpen: setShowFilterSidebar,
					searchTextFromUrl,
					groupBy,
					sortByOptions,
					GROUP_BY_OPTIONS,
					showCompletedTasks,
					setShowCompletedTasks,
				}}
			/>
		</div>
	);
};

export default FilterBar;
