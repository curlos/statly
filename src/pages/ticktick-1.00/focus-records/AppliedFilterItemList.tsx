import classNames from 'classnames';
import Icon from '../../../components/Icon';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from './useThemeContext';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { useSearchParamsCustom } from '../../../hooks/useSearchParamsCustom';

const AppliedFilterItemList = ({
	groupedBy,
	setGroupedBy,
	searchText,
	setSearchText,
	taskIdToFilterBy,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
}) => {
	const { searchParams, updateQueryParams } = useSearchParamsCustom();
	const sortBy = searchParams.get('sort-by') || 'Newest';

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	const groupByFilter = {
		name: `Group By`,
		value: groupedBy,
		handleRemove: () => {
			setGroupedBy('No Group');
			// TODO: Add query param update once I fix the grouping bugs.
		},
	};

	const sortByFilter = {
		name: `Sort By`,
		value: sortBy,
		handleRemove: () => {
			updateQueryParams({ 'sort-by': '' });
		},
	};

	const searchTextFilter = {
		name: `Search Text`,
		value: searchText,
		handleRemove: () => {
			setSearchText('');
			updateQueryParams({ search: '' });
		},
	};

	const taskIdFilter = {
		name: `Task`,
		value: taskIdToFilterBy && tasksById ? tasksById[taskIdToFilterBy]?.title : taskIdToFilterBy,
		handleRemove: () => {
			updateQueryParams({ 'task-id': '' });
		},
	};

	const dateRangeFilter = {
		name: `Date Range`,
		value: `${getFormattedShortMonthDay(startDate)} - ${getFormattedShortMonthDay(endDate)}`,
		handleRemove: () => {
			setStartDate(new Date('November 2, 2020'));
			setEndDate(new Date());
			updateQueryParams({ 'start-date': '', 'end-date': '' });
		},
	};

	const allFilters = [taskIdFilter, groupByFilter, sortByFilter, searchTextFilter, dateRangeFilter];
	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('November 2, 2020'))} - ${getFormattedShortMonthDay(new Date())}`;

	const nonDefaultFilterList = allFilters.filter((focusRecordsFilter) => {
		const { value } = focusRecordsFilter;
		const isDefaultFilter = !value || value === 'No Group' || value === 'Newest' || firstDayToTodayString === value;
		return !isDefaultFilter;
	});

	if (nonDefaultFilterList.length === 0) {
		return null;
	}

	return (
		<div className="container flex flex-wrap pb-4 gap-3">
			{nonDefaultFilterList.map((nonDefaultFilter) => {
				const { name, value, handleRemove } = nonDefaultFilter;

				return <AppliedFilterItem key={name + value} {...{ name, value, handleRemove }} />;
			})}
		</div>
	);
};

const AppliedFilterItem = ({ name, value, handleRemove }) => {
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;
	const { bgColorHalfOpacity } = chosenColorObj;

	return (
		<div className="flex">
			<div className={classNames('px-2 py-1 text-[14px] text-white rounded-xl', bgColorHalfOpacity)}>
				<div className="overflow-hidden">
					<span className="font-bold">{name}: </span>
					<span>{value}</span>
				</div>
			</div>

			<div onClick={handleRemove} className={classNames('mt-[-9px] ml-[-10px]')}>
				<Icon
					name="close"
					fill={0}
					customClass={'text-black rounded-full !text-[14px] bg-white cursor-pointer p-[2px]'}
				/>
			</div>
		</div>
	);
};

export default AppliedFilterItemList;
