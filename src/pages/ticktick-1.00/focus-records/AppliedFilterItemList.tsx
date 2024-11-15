import classNames from 'classnames';
import Icon from '../../../components/Icon';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';

const AppliedFilterItemList = ({ taskIdToFilterBy }) => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const groupBy = searchParams.get('group-by');
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	const groupByFilter = {
		name: `Group By`,
		value: groupBy,
		handleRemove: () => {
			updateQueryParams({ 'group-by': '' });
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
		value: searchTextFromUrl,
		handleRemove: () => {
			updateQueryParams({ search: '' });
		},
	};

	const taskIdFilter = {
		name: `Task`,
		value:
			taskIdToFilterBy && tasksById && tasksById[taskIdToFilterBy]?.title
				? tasksById[taskIdToFilterBy]?.title
				: taskIdToFilterBy,
		handleRemove: () => {
			updateQueryParams({ 'task-id': '' });
		},
	};

	const dateRangeFilter = {
		name: `Date Range`,
		value: `${startDateFromUrl} - ${endDateFromUrl}`,
		handleRemove: () => {
			updateQueryParams({ 'start-date': '', 'end-date': '' });
		},
	};

	const allFilters = [taskIdFilter, groupByFilter, sortByFilter, searchTextFilter, dateRangeFilter];
	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('November 2, 2020'))} - ${getFormattedShortMonthDay(new Date())}`;

	const nonDefaultFilterList = allFilters.filter((focusRecordsFilter) => {
		const { value } = focusRecordsFilter;
		const isDefaultFilter = !value || value === 'Newest' || firstDayToTodayString === value;
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
