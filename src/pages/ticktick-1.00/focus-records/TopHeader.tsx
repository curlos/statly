import { useEffect, useRef, useState } from 'react';
import useResizeObserver from '../../../hooks/useResizeObserver';
import DropdownGeneralSelect from '../../StatsPage/DropdownGeneralSelect';
import Icon from '../../../components/Icon';
import Fuse from 'fuse.js';
import { debounce } from '../../../utils/helpers.utils';
import { useUpdateQueryParams } from '../../../hooks/useUpdateQueryParams';
import { usePageContext } from 'vike-react/usePageContext';
import Spinner from '../../../components/Loaders/Spinner';
import classNames from 'classnames';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';

const TopHeader = ({
	topHeaderRef,
	setHeaderHeight,
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
}) => {
	const updateQueryParams = useUpdateQueryParams();
	const pageContext = usePageContext();
	const location = pageContext.urlParsed;
	const queryParams = new URLSearchParams(location.search);
	const taskIdToFilterBy = queryParams.get('taskId');

	const DEFAULT_SORT_BY_OPTIONS = ['Newest', 'Oldest', 'Focus Hours: Most-Least', 'Focus Hours: Least-Most'];
	const [sortByOptions, setSortByOptions] = useState(DEFAULT_SORT_BY_OPTIONS);

	const [isSearchLoading, setIsSearchLoading] = useState(false);

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
		focusRecordListRef?.current?.scrollTo(0, 0);
	}, [filteredFocusRecords]);

	const handleDebouncedSearch = debounce(() => {
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

		if (searchText.trim() === '' && taskIdToFilterBy) {
			return;
		}

		const searchedItemsFocusRecords = searchedItems.map((result) => result.item);
		console.log(searchedItemsFocusRecords);

		setFilteredFocusRecords(searchedItemsFocusRecords);
		updateQueryParams({ search: searchText });
	}, 1000);

	const dropdownGroupedByRef = useRef(null);
	const dropdownSortedByRef = useRef(null);
	const [isDropdownGroupedByVisible, setIsDropdownGroupedByVisible] = useState(false);
	const [isDropdownSortedByVisible, setIsDropdownSortedByVisible] = useState(false);

	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');

	return (
		<div ref={topHeaderRef}>
			<div className="flex justify-between items-center py-5 container">
				<h2 className="font-bold text-[24px]">Focus Records</h2>

				<div className="flex items-center gap-2">
					{/* TODO: Bring the "Group By" dropdown back and make the grouping work for the different sections as well as for sorting stuff. */}
					<div className="relative">
						<div
							className="flex gap-[2px] bg-color-gray-600 py-2 px-4 rounded-md cursor-pointer"
							onClick={() => setIsDropdownGroupedByVisible(!isDropdownGroupedByVisible)}
						>
							<div>
								<span className="text-color-gray-50">Group By: </span>
								{groupedBy}
							</div>
							<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
						</div>

						<DropdownGeneralSelect
							toggleRef={dropdownGroupedByRef}
							isVisible={isDropdownGroupedByVisible}
							setIsVisible={setIsDropdownGroupedByVisible}
							selected={groupedBy}
							setSelected={setGroupedBy}
							selectedOptions={['Date', 'Task', 'Project', 'No Group']}
						/>
					</div>

					<div className="relative">
						<div
							className="flex gap-[2px] bg-color-gray-600 py-2 px-4 rounded-md cursor-pointer"
							onClick={() => setIsDropdownSortedByVisible(!isDropdownGroupedByVisible)}
						>
							<div>
								<span className="text-color-gray-50">Sort By: </span>
								{sortedBy}
							</div>
							<Icon name="keyboard_arrow_down" customClass="!text-[18px] mt-[2px]" />
						</div>

						<DropdownGeneralSelect
							toggleRef={dropdownSortedByRef}
							isVisible={isDropdownSortedByVisible}
							setIsVisible={setIsDropdownSortedByVisible}
							selected={sortedBy}
							setSelected={(newSortedBy) => {
								setSortedBy(newSortedBy);
								updateQueryParams({ sortBy: newSortedBy });
							}}
							selectedOptions={sortByOptions}
						/>
					</div>

					<div className="flex items-center gap-1 p-1 px-2">
						{isSearchLoading ? (
							<Spinner />
						) : (
							<Icon
								name="search"
								fill={0}
								customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
							/>
						)}
						<input
							placeholder="Search"
							value={searchText}
							onChange={(e) => {
								setSearchText(e.target.value);
							}}
							className="text-[14px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
						/>
					</div>
				</div>
			</div>

			<AppliedFilterItemList
				{...{ groupedBy, setGroupedBy, sortedBy, setSortedBy, searchText, setSearchText, taskIdToFilterBy }}
			/>
		</div>
	);
};

const AppliedFilterItemList = ({
	groupedBy,
	setGroupedBy,
	sortedBy,
	setSortedBy,
	searchText,
	setSearchText,
	taskIdToFilterBy,
}) => {
	const updateQueryParams = useUpdateQueryParams();

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	const groupByFilter = {
		name: `Group By`,
		value: groupedBy,
		handleRemove: () => {
			setGroupedBy('No Group');
		},
	};

	const sortByFilter = {
		name: `Sort By`,
		value: sortedBy,
		handleRemove: () => {
			setSortedBy('Newest');
		},
	};

	const searchTextFilter = {
		name: `Search Text`,
		value: searchText,
		handleRemove: () => {
			setSearchText('');
		},
	};

	const taskIdFilter = {
		name: `Task`,
		value: taskIdToFilterBy && tasksById ? tasksById[taskIdToFilterBy]?.title : taskIdToFilterBy,
		handleRemove: () => {
			updateQueryParams({ taskId: '' });
		},
	};

	const allFilters = [groupByFilter, sortByFilter, searchTextFilter, taskIdFilter];
	const nonDefaultFilterList = allFilters.filter((focusRecordsFilter) => {
		const { value } = focusRecordsFilter;
		const isDefaultFilter = !value || value === 'No Group' || value === 'Newest';
		return !isDefaultFilter;
	});

	if (nonDefaultFilterList.length === 0) {
		return null;
	}

	return (
		<div className="container flex pb-2">
			{nonDefaultFilterList.map((nonDefaultFilter) => {
				const { name, value, handleRemove } = nonDefaultFilter;

				return <AppliedFilterItem key={name + value} {...{ name, value, handleRemove }} />;
			})}
		</div>
	);
};

const AppliedFilterItem = ({ name, value, handleRemove }) => {
	return (
		<div className="flex">
			<div className="px-2 py-1 text-[14px] text-white rounded-xl bg-emerald-600">
				<div className="overflow-hidden text-nowrap">
					<span className="font-bold">{name}: </span>
					<span>{value}</span>
				</div>
			</div>

			<div onClick={handleRemove} className={classNames('mt-[-12px] ml-[-10px]')}>
				<Icon
					name="close"
					fill={0}
					customClass={'text-black rounded-full !text-[14px] bg-white cursor-pointer p-[2px]'}
				/>
			</div>
		</div>
	);
};

export default TopHeader;
