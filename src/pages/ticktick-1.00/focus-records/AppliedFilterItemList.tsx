import classNames from 'classnames';
import Icon from '../../../components/Icon';
import { useGetAllProjectsQuery, useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AppliedFilterItemList = ({ taskIdToFilterBy }) => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const groupBy = searchParams.get('group-by');
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';

	const [projectNamesStr, setProjectNamesStr] = useState('projectsFromUrl');

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	useEffect(() => {
		if (isLoadingGetProjects) {
			return;
		}

		console.log(projectsById);

		const projectIdsFromUrlArr = projectsFromUrl.split(',');
		const projectNamesArr = [];

		projectIdsFromUrlArr.forEach((projectId) => {
			const { name } = projectsById[projectId];
			projectNamesArr.push(name);
		});

		const newProjectNamesStr = projectNamesArr
			.map((projectName, index) => {
				// Append a newline if the item is not the last in the array
				return `- ${projectName}${index < projectNamesArr.length - 1 ? '\n' : ''}`;
			})
			.join('');

		setProjectNamesStr(newProjectNamesStr);
	}, [isLoadingGetProjects, projectsById, projectsFromUrl]);

	const getProjectFilterValue = () => {
		return (
			<div className="break-words react-markdown">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{projectNamesStr}</ReactMarkdown>
			</div>
		);
	};

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

	const projectsFilter = {
		name: 'Projects',
		value: getProjectFilterValue(),
		handleRemove: () => {
			updateQueryParams({ projects: '' });
		},
	};

	const allFilters = [taskIdFilter, dateRangeFilter, groupByFilter, sortByFilter, searchTextFilter, projectsFilter];
	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('November 2, 2020'))} - ${getFormattedShortMonthDay(new Date())}`;

	const nonDefaultFilterList = allFilters.filter((focusRecordsFilter) => {
		const { name, value } = focusRecordsFilter;

		if (name === 'Projects') {
			return null;
		}

		const isDefaultFilter = !value || value === 'Newest' || firstDayToTodayString === value;
		return !isDefaultFilter;
	});

	if (nonDefaultFilterList.length === 0) {
		return null;
	}

	const {
		name: projectFilterName,
		value: projectFilterValue,
		handleRemove: projectFilterHandleRemove,
	} = projectsFilter;
	const atLeastOneSelectedProject = projectsFromUrl;

	return (
		<div className="container pb-4">
			<div className="flex flex-wrap pb-4 gap-3">
				{nonDefaultFilterList.map((nonDefaultFilter) => {
					const { name, value, handleRemove } = nonDefaultFilter;
					return <AppliedFilterItem key={name + value} {...{ name, value, handleRemove }} />;
				})}
			</div>

			{atLeastOneSelectedProject && (
				<AppliedFilterItem
					key={projectFilterName + projectFilterValue}
					{...{ name: projectFilterName, value: projectFilterValue, handleRemove: projectFilterHandleRemove }}
				/>
			)}
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
					<span className="text-wrap break-all">{value}</span>
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
