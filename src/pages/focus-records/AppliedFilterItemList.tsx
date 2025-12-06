import { getFormattedShortMonthDay } from '../../utils/date.utils';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useEffect, useState } from 'react';
import { FOCUS_APPS, TO_DO_LIST_APPS } from '../../utils/constants/constants.utils';
import { useDaysWithCompletedTasksQuery } from '../completed-tasks/useDaysWithCompletedTasksQuery';
import { useGetProjectsQuery } from '../../services/resources/documentsProjectsApi';
import { usePageContext } from 'vike-react/usePageContext';
import { useFocusRecordsQuery } from './useFocusRecordsQuery';
import AppliedFilterItem from '../../components/FilterSidebar/AppliedFilterItem';

const AppliedFilterItemList = () => {
	const pageContext = usePageContext();
	const isCompletedTasksPage = pageContext?.urlParsed?.pathname?.includes('/completed-tasks');
	const isFocusRecordsPage = pageContext?.urlParsed?.pathname?.includes('/focus-records');

	const { searchParams, updateQueryParams } = useSearchParamsContext();

	// For All
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Jan 1, 1900';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const intervalStartDateFromUrl = searchParams.get('interval-start-date') || '';
	const intervalEndDateFromUrl = searchParams.get('interval-end-date') || '';
	const taskIdToFilterBy = searchParams.get('task-id');
	const focusAppsFromUrl = searchParams.get('focus-apps') || '';

	// TickTick
	const projectsFromUrl = searchParams.get('projects') || '';

	// Todoist
	const projectsTodoistFromUrl = searchParams.get('projects-todoist') || '';

	// Session (Focus Records Page)
	const categoriesFromUrl = searchParams.get('categories') || '';
	const crossesMidnightFromUrl = searchParams.get('crosses-midnight') || '';
	const emotionsFromUrl = searchParams.get('emotions') || '';

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

	// Conditionally fetch based on current page
	const { ancestorTasksById: ancestorTasksByIdCompletedTasks, isLoading: isLoadingDaysWithCompletedTasks } = useDaysWithCompletedTasksQuery({ skip: !isCompletedTasksPage });
	const { ancestorTasksById: ancestorTasksByIdFocusRecords, isLoading: isLoadingFocusRecords } = useFocusRecordsQuery({ skip: !isFocusRecordsPage });

	// Use the appropriate ancestorTasksById based on current page
	const ancestorTasksById = isCompletedTasksPage ? ancestorTasksByIdCompletedTasks : ancestorTasksByIdFocusRecords;

	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	useEffect(() => {
		if (isLoadingGetProjects) {
			return;
		}

		if (isCompletedTasksPage && isLoadingDaysWithCompletedTasks) {
			return;
		}

		if (isFocusRecordsPage && isLoadingFocusRecords) {
			return
		}

		const newProjectNamesStr = getUrlNamesStr(projectsFromUrl, projectsById, 'name');
		const newCategoryNamesStr = getUrlNamesStr(categoriesFromUrl, projectsById, 'name');
		const newFocusAppNamesStr = getUrlNamesStr(focusAppsFromUrl, FOCUS_APPS, 'name');
		const newToDoListAppNamesStr = getUrlNamesStr(toDoListAppsFromUrl, TO_DO_LIST_APPS, 'name');
		const newProjectTodoistNamesStr = getUrlNamesStr(projectsTodoistFromUrl, projectsById, 'name');

		setProjectNamesStr(newProjectNamesStr);
		setCategoryNamesStr(newCategoryNamesStr);
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
		isLoadingFocusRecords,
		isLoadingGetProjects,
	]);

	const getUrlNamesStr = (commaSeparatedStr, obj, entityPropToGetValue) => {
		const commaSeparatedArr = commaSeparatedStr ? commaSeparatedStr.split(',') : [];
		const namesArr = [];

		commaSeparatedArr.forEach((key) => {
			const name = obj?.[key]?.[entityPropToGetValue] || key;
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

	const intervalDateRangeFilter = {
		name: `Interval Date Range`,
		value: intervalStartDateFromUrl && intervalEndDateFromUrl ? `${intervalStartDateFromUrl} - ${intervalEndDateFromUrl}` : '',
		handleRemove: () => {
			updateQueryParams({ 'interval-start-date': '', 'interval-end-date': '', page: '' });
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

	const crossesMidnightFilter = {
		name: 'Crosses Midnight',
		value: crossesMidnightFromUrl === 'true' ? 'True' : '',
		handleRemove: () => {
			updateQueryParams({ 'crosses-midnight': '', page: '' });
		},
	};

	const emotionsFilter = {
		name: 'Emotions',
		value: emotionsFromUrl ? emotionsFromUrl.split(',').map(e => e.toUpperCase()).join(', ') : '',
		handleRemove: () => {
			updateQueryParams({ emotions: '', page: '' });
		},
	};

	const allFilters = [
		taskIdFilter,
		dateRangeFilter,
		intervalDateRangeFilter,
		sortByFilter,
		searchTextFilter,
		projectsTickTickFilter,
		categoriesFilter,
		focusAppFilter,
		toDoListAppFilter,
		projectsTodoistFilter,
		crossesMidnightFilter,
		emotionsFilter,
	];
	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('Jan 1, 1900'))} - ${getFormattedShortMonthDay(new Date())}`;

	const nonDefaultFilterList = allFilters.filter((focusRecordsFilter) => {
		const { value } = focusRecordsFilter;

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
						return <AppliedFilterItem key={name + value} name={name} value={value} onRemove={handleRemove} />;
					})}
				</div>
			)}
		</div>
	);
};

export default AppliedFilterItemList;
