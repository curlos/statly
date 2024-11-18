import classNames from 'classnames';
import Icon from '../../../components/Icon';
import { useGetAllProjectsQuery, useGetAllTasksQuery } from '../../../services/resources/ticktickOneApi';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { getFormattedShortMonthDay } from '../../../utils/date.utils';
import { useSearchParamsContext } from '../../../contexts/useSearchParamsContext';
import { useEffect, useState } from 'react';
import { useGetSessionFocusRecordsQuery } from '../../../services/resources/oldFocusAppsApi';

const AppliedFilterItemList = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const sortBy = searchParams.get('sort-by') || 'Newest';
	const searchTextFromUrl = searchParams.get('search') || '';
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const projectsFromUrl = searchParams.get('projects') || '';
	const categoriesFromUrl = searchParams.get('categories') || '';
	const taskIdToFilterBy = searchParams.get('task-id');

	const [projectNamesStr, setProjectNamesStr] = useState(
		projectsFromUrl ? getStrInBulletPointsMD(projectsFromUrl.split(',')) : ''
	);
	const [categoryNamesStr, setCategoryNamesStr] = useState(
		categoriesFromUrl ? getStrInBulletPointsMD(categoriesFromUrl.split(',')) : ''
	);

	// RTK Query - TickTick 1.0 - Tasks
	const { data: fetchedTasks } = useGetAllTasksQuery();
	const { tasksById } = fetchedTasks || {};

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	const { projectsById } = fetchedProjects || {};

	// RTK Query - Session App - Focus Records
	const { data: fetchedSessionFocusRecords, isLoading: isLoadingGetSessionFocusRecords } =
		useGetSessionFocusRecordsQuery();
	const { sessionCategoriesById } = fetchedSessionFocusRecords || {};

	useEffect(() => {
		if (isLoadingGetProjects) {
			return;
		}

		const newProjectNamesStr = getProjectNamesStr();
		const newCategoryNamesStr = getCategoryNamesStr();

		setProjectNamesStr(newProjectNamesStr);
		setCategoryNamesStr(newCategoryNamesStr);
	}, [isLoadingGetProjects, projectsFromUrl, isLoadingGetSessionFocusRecords, categoriesFromUrl]);

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

	const taskIdFilter = {
		name: `Task`,
		value:
			taskIdToFilterBy && tasksById && tasksById[taskIdToFilterBy]?.title
				? tasksById[taskIdToFilterBy]?.title
				: taskIdToFilterBy,
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

	const singleSelectFilters = [
		taskIdFilter,
		dateRangeFilter,
		sortByFilter,
		searchTextFilter,
		projectsFilter,
		categoriesFilter,
	];
	const firstDayToTodayString = `${getFormattedShortMonthDay(new Date('November 2, 2020'))} - ${getFormattedShortMonthDay(new Date())}`;

	const nonDefaultFilterList = singleSelectFilters.filter((focusRecordsFilter) => {
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
