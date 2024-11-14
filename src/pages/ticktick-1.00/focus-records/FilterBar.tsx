import { useEffect, useState } from 'react';
import Icon from '../../../components/Icon';
import Fuse from 'fuse.js';
import { debounce } from '../../../utils/helpers.utils';
import { useUpdateQueryParams } from '../../../hooks/useUpdateQueryParams';
import { usePageContext } from 'vike-react/usePageContext';
import AppliedFilterItemList from './AppliedFilterItemList';
import ModalFilterSidebar from './ModalFilterSidebar/ModalFilterSidebar';

const FilterBar = ({
	groupedBy,
	setGroupedBy,
	sortedBy,
	setSortedBy,
	searchText,
	setSearchText,
	defaultSortedBy,
	defaultFocusRecords,
	filteredFocusRecords,
	setFilteredFocusRecords,
	focusRecordListRef,
	showCompletedTasks,
	setShowCompletedTasks,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}) => {
	const updateQueryParams = useUpdateQueryParams();
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;
	const queryParams = new URLSearchParams(location.search);
	const taskIdToFilterBy = queryParams.get('task-id');

	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	const [sortByOptions, setSortByOptions] = useState(DEFAULT_SORT_BY_OPTIONS);

	const GROUP_BY_OPTIONS = ['Date', 'Task', 'Project', 'No Group'];

	const fuse = new Fuse(defaultFocusRecords, {
		includeScore: true,
		isCaseSensitive: false,
		findAllMatches: false,
		threshold: 0.3, // Lower threshold for stricter matches
		location: 0,
		distance: 100, // Lower distance to prefer closer matches
		minMatchCharLength: 3, // Increase min match character length for longer matches
		keys: [
			{ name: 'tasks.title', weight: 1 },
			{ name: 'note', weight: 1 },
			{ name: 'tasks.projectName', weight: 0.5 },
		],
	});

	useEffect(() => {
		handleDebouncedSearch();

		return () => {
			handleDebouncedSearch.cancel();
		};
	}, [searchText, defaultFocusRecords]);

	useEffect(() => {
		focusRecordListRef.current.scrollTo(0, 0);
	}, [filteredFocusRecords, searchText, taskIdToFilterBy, groupedBy, sortedBy]);

	const filterBySearch = () => {
		let searchedItems;

		if (searchText.trim() === '') {
			// If searchText is empty, consider all focus records as the searched result.
			searchedItems = defaultFocusRecords.map((focusRecord) => ({ item: focusRecord }));
			setSortByOptions(DEFAULT_SORT_BY_OPTIONS);
			setSortedBy(defaultSortedBy);
		} else {
			// When searchText is not empty, perform the search using Fuse.js
			searchedItems = fuse.search(searchText);

			const mostRelevantSortByOption = 'Most Relevant';
			setSortByOptions([mostRelevantSortByOption, ...DEFAULT_SORT_BY_OPTIONS]);
			setSortedBy(mostRelevantSortByOption);
		}

		const searchedItemsFocusRecords = searchedItems.map((result) => result.item);
		setFilteredFocusRecords(searchedItemsFocusRecords);
		updateQueryParams({ search: searchText });
	};

	const handleDebouncedSearch = debounce(filterBySearch, 1000);

	const [showFilterSidebar, setShowFilterSidebar] = useState(false);

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
					groupedBy,
					setGroupedBy,
					sortedBy,
					setSortedBy,
					searchText,
					setSearchText,
					taskIdToFilterBy,
					startDate,
					setStartDate,
					endDate,
					setEndDate,
				}}
			/>

			<ModalFilterSidebar
				{...{
					isOpen: showFilterSidebar,
					setIsOpen: setShowFilterSidebar,
					searchText,
					setSearchText,
					sortedBy,
					setSortedBy,
					groupedBy,
					setGroupedBy,
					sortByOptions,
					GROUP_BY_OPTIONS,
					showCompletedTasks,
					setShowCompletedTasks,
					startDate,
					setStartDate,
					endDate,
					setEndDate,
				}}
			/>
		</div>
	);
};

export default FilterBar;
