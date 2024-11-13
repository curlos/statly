import classNames from 'classnames';
import Icon from '../../../components/Icon';
import { useUpdateQueryParams } from '../../../hooks/useUpdateQueryParams';
import { useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';

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
			// TODO: Add query param update once I fix the grouping bugs.
		},
	};

	const sortByFilter = {
		name: `Sort By`,
		value: sortedBy,
		handleRemove: () => {
			setSortedBy('Newest');
			updateQueryParams({ sortBy: 'Newest' });
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
		<div className="container flex flex-wrap pb-4 gap-3">
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
