import classNames from 'classnames';
import Icon from '../../components/Icon';
import { useThemeContext } from '../../contexts/useThemeContext';
import { getFormattedShortMonthDay } from '../../utils/date.utils';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useEffect, useState } from 'react';
import {
	useGetSessionAppFocusRecordsQuery,
} from '../../services/resources/oldFocusAppsApi';
import { FOCUS_APPS, TO_DO_LIST_APPS } from '../../utils/constants/constants.utils';
import { useDaysWithCompletedTasksQuery } from '../completed-tasks/useDaysWithCompletedTasksQuery';
import { useGetProjectsQuery } from '../../services/resources/documentsProjectsApi';

const AppliedFilterItemList = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();

	// For All
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const taskIdToFilterBy = searchParams.get('task-id');
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';

	// TickTick
	const projectsFromUrl = searchParams.get('projects') || '';

	// Todoist
	const projectsTodoistFromUrl = searchParams.get('projects-todoist') || '';

	// Session (Focus Records Page)
	const categoriesFromUrl = searchParams.get('categories') || '';

	// TickTick & Todoist (Completed Tasks Page)
	const toDoListAppsFromUrl = searchParams.get('to-do-list-apps');

	const [projectNamesStr, setProjectNamesStr] = useState(
		projectsFromUrl ? getStrInBulletPointsMD(projectsFromUrl.split(',')) : ''
	);
	const [projectTodoistNamesStr, setProjectTodoistNamesStr] = useState(
		projectsFromUrl ? getStrInBulletPointsMD(projectsTodoistFromUrl.split(',')) : ''
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

	const { ancestorTasksById, isLoading: isLoadingDaysWithCompletedTasks } = useDaysWithCompletedTasksQuery();

	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	// RTK Query - Session App - Focus Records
	// TODO:
	// const { data: fetchedSessionFocusRecords, isLoading: isLoadingGetSessionFocusRecords } =
	// 	useGetSessionAppFocusRecordsQuery();
	// const { sessionCategoriesById } = fetchedSessionFocusRecords || {};

	useEffect(() => {
		const isResourceLoading =
			isLoadingDaysWithCompletedTasks ||
			isLoadingGetProjects
			// isLoadingGetSessionFocusRecords;

		if (isResourceLoading) {
			return;
		}

		const newProjectNamesStr = getUrlNamesStr(projectsFromUrl, projectsById, 'name');
		// TODO:
		// const newCategoryNamesStr = getUrlNamesStr(categoriesFromUrl, sessionCategoriesById, 'title');
		const newFocusAppNamesStr = getUrlNamesStr(focusAppsFromUrl, FOCUS_APPS, 'name');
		const newToDoListAppNamesStr = getUrlNamesStr(toDoListAppsFromUrl, TO_DO_LIST_APPS, 'name');
		const newProjectTodoistNamesStr = getUrlNamesStr(projectsTodoistFromUrl, projectsById, 'name');

		setProjectNamesStr(newProjectNamesStr);
		// TODO:
		// setCategoryNamesStr(newCategoryNamesStr);
		setFocusAppNamesStr(newFocusAppNamesStr);
		setToDoListAppNamesStr(newToDoListAppNamesStr);
		setProjectTodoistNamesStr(newProjectTodoistNamesStr);
	}, [
		projectsFromUrl,
		categoriesFromUrl,
		focusAppsFromUrl,
		toDoListAppsFromUrl,
		projectsTodoistFromUrl,
		isLoadingDaysWithCompletedTasks,
		isLoadingGetProjects,
		// isLoadingGetSessionFocusRecords,
		// sessionCategoriesById,
	]);

	const getUrlNamesStr = (commaSeparatedStr, obj, entityPropToGetValue) => {
		const commaSeparatedArr = commaSeparatedStr ? commaSeparatedStr.split(',') : [];
		const namesArr = [];

		commaSeparatedArr.forEach((key) => {
			const name = obj[key][entityPropToGetValue];
			namesArr.push(name);
		});

		return namesArr.join(', ');
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
		if (taskIdToFilterBy && ancestorTasksById) {
			return (
				ancestorTasksById[taskIdToFilterBy]?.title || taskIdToFilterBy
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
			updateQueryParams({ 'start-date': '', 'end-date': '', 'date-interval': '', page: '' });
		},
	};

	const projectsTickTickFilter = {
		name: 'Projects (TickTick)',
		value: projectNamesStr,
		handleRemove: () => {
			updateQueryParams({ projects: '', page: '' });
		},
	};

	const projectsTodoistFilter = {
		name: 'Projects (Todoist)',
		value: projectTodoistNamesStr,
		handleRemove: () => {
			updateQueryParams({ 'projects-todoist': '', page: '' });
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
		projectsTickTickFilter,
		categoriesFilter,
		focusAppFilter,
		toDoListAppFilter,
		projectsTodoistFilter,
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
