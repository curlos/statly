import classNames from 'classnames';
import Icon from '../../../components/Icon';
import { useGetAllProjectsQuery, useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useEffect, useState } from 'react';
import {
	useGetSessionAppFocusRecordsQuery,
	useGetTodoistAllTasksQuery,
} from '../../../services/resources/oldFocusAppsApi';
import { FOCUS_APPS, TO_DO_LIST_APPS } from '../../../utils/constants.utils';

const AppliedFilterItemList = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';
	const categoriesFromUrl = searchParams.get('categories') || '';
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';
	const toDoListAppsFromUrl = searchParams.get('to-do-list-apps');
	const taskIdToFilterBy = searchParams.get('task-id');

	const [projectNamesStr, setProjectNamesStr] = useState(
		projectsFromUrl ? getStrInBulletPointsMD(projectsFromUrl.split(',')) : ''
	);
	const [categoryNamesStr, setCategoryNamesStr] = useState(
		categoriesFromUrl ? getStrInBulletPointsMD(categoriesFromUrl.split(',')) : ''
	);
	const [focusAppNamesStr, setFocusAppNamesStr] = useState(
		focusAppsFromUrl ? getStrInBulletPointsMD(focusAppsFromUrl.split(',')) : ''
	);
	const [toDoListAppNamesStr, setToDoListAppNamesStr] = useState(
		toDoListAppsFromUrl ? getStrInBulletPointsMD(toDoListAppsFromUrl.split(',')) : ''
	);

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - Todoist - Tasks
	const { data: fetchedTodoistAllTasksById } = useGetTodoistAllTasksQuery();
	const { todoistAllTasksById } = fetchedTodoistAllTasksById || {};

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	// RTK Query - Session App - Focus Records
	const { data: fetchedSessionFocusRecords, isLoading: isLoadingGetSessionFocusRecords } =
		useGetSessionAppFocusRecordsQuery();
	const { sessionCategoriesById } = fetchedSessionFocusRecords || {};

	useEffect(() => {
		if (isLoadingGetProjects) {
			return;
		}

		const newProjectNamesStr = getProjectNamesStr();
		const newCategoryNamesStr = getCategoryNamesStr();
		const newFocusAppNamesStr = getFocusAppNamesStr();
		const newToDoListAppNamesStr = getToDoListAppNamesStr();

		setProjectNamesStr(newProjectNamesStr);
		setCategoryNamesStr(newCategoryNamesStr);
		setFocusAppNamesStr(newFocusAppNamesStr);
		setToDoListAppNamesStr(newToDoListAppNamesStr);
	}, [
		isLoadingGetProjects,
		projectsFromUrl,
		isLoadingGetSessionFocusRecords,
		categoriesFromUrl,
		focusAppsFromUrl,
		toDoListAppsFromUrl,
	]);

	const getProjectNamesStr = () => {
		const projectIdsFromUrlArr = projectsFromUrl ? projectsFromUrl.split(',') : [];
		const projectNamesArr = [];

		projectIdsFromUrlArr.forEach((projectId) => {
			const { name } = projectsById[projectId];
			projectNamesArr.push(name);
		});

		return projectNamesArr.join(', ');
	};

	const getCategoryNamesStr = () => {
		const categoryIdsFromUrlArr = categoriesFromUrl ? categoriesFromUrl.split(',') : [];
		const categoryNamesArr = [];

		categoryIdsFromUrlArr.forEach((categoryId) => {
			const { title } = sessionCategoriesById[categoryId];
			categoryNamesArr.push(title);
		});

		return categoryNamesArr.join(', ');
	};

	const getFocusAppNamesStr = () => {
		const focusAppsFromUrlArr = focusAppsFromUrl ? focusAppsFromUrl.split(',') : [];
		const focusAppsNamesArr = [];

		focusAppsFromUrlArr.forEach((id) => {
			const { name } = FOCUS_APPS[id];
			focusAppsNamesArr.push(name);
		});

		return focusAppsNamesArr.join(', ');
	};

	const getToDoListAppNamesStr = () => {
		const toDoListAppsFromUrlArr = toDoListAppsFromUrl ? toDoListAppsFromUrl.split(',') : [];
		const toDoListAppsNamesArr = [];

		toDoListAppsFromUrlArr.forEach((id) => {
			const { name } = TO_DO_LIST_APPS[id];
			toDoListAppsNamesArr.push(name);
		});

		return toDoListAppsNamesArr.join(', ');
	};

	const sortByFilter = {
		name: `Sort By`,
		value: sortBy,
		handleRemove: () => {
			updateQueryParams({ 'sort-by': '', page: '' });
		},
	};

	const searchTextFilter = {
		name: `Search Text`,
		value: searchTextFromUrl,
		handleRemove: () => {
			updateQueryParams({ search: '', 'sort-by': '', page: '' });
		},
	};

	const getTaskTitle = () => {
		if (taskIdToFilterBy && tasksById && todoistAllTasksById) {
			return (
				tasksById[taskIdToFilterBy]?.title || todoistAllTasksById[taskIdToFilterBy]?.content || taskIdToFilterBy
			);
		}
	};

	const taskIdFilter = {
		name: `Task`,
		value: getTaskTitle(),
		handleRemove: () => {
			updateQueryParams({ 'task-id': '', page: '' });
		},
	};

	const dateRangeFilter = {
		name: `Date Range`,
		value: `${startDateFromUrl} - ${endDateFromUrl}`,
		handleRemove: () => {
			updateQueryParams({ 'start-date': '', 'end-date': '', page: '' });
		},
	};

	const projectsFilter = {
		name: 'Projects (TickTick)',
		value: projectNamesStr,
		handleRemove: () => {
			updateQueryParams({ projects: '', page: '' });
		},
	};

	const categoriesFilter = {
		name: 'Categories (Session App)',
		value: categoryNamesStr,
		handleRemove: () => {
			updateQueryParams({ categories: '', page: '' });
		},
	};

	const focusAppFilter = {
		name: 'Focus Apps',
		value: focusAppNamesStr,
		handleRemove: () => {
			updateQueryParams({ 'focus-apps': '', page: '' });
		},
	};

	const toDoListAppFilter = {
		name: 'To-Do List Apps',
		value: toDoListAppNamesStr,
		handleRemove: () => {
			updateQueryParams({ 'to-do-list-apps': '', page: '' });
		},
	};

	const allFilters = [
		taskIdFilter,
		dateRangeFilter,
		sortByFilter,
		searchTextFilter,
		projectsFilter,
		categoriesFilter,
		focusAppFilter,
		toDoListAppFilter,
	];
	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('November 2, 2020'))} - ${getFormattedShortMonthDay(new Date())}`;

	const nonDefaultFilterList = allFilters.filter((focusRecordsFilter) => {
		const { name, value } = focusRecordsFilter;

		const isDefaultFilter = !value || value === 'Newest' || firstDayToTodayString === value;
		return !isDefaultFilter;
	});

	const atLeastOneSelectedProject = projectsFromUrl;
	const atLeastOneSelectedCategory = categoriesFromUrl;

	if (nonDefaultFilterList.length === 0 && !atLeastOneSelectedProject && !atLeastOneSelectedCategory) {
		return null;
	}

	return (
		<div>
			{nonDefaultFilterList && nonDefaultFilterList.length > 0 && (
				<div className="flex flex-wrap gap-3">
					{nonDefaultFilterList.map((nonDefaultFilter) => {
						const { name, value, handleRemove } = nonDefaultFilter;
						return <AppliedFilterItem key={name + value} {...{ name, value, handleRemove }} />;
					})}
				</div>
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

const getStrInBulletPointsMD = (strArr) => {
	return strArr
		.map((item, index) => {
			// Append a newline if the item is not the last in the array
			return `- ${item}${index < strArr.length - 1 ? '\n' : ''}`;
		})
		.join('');
};

export default AppliedFilterItemList;
