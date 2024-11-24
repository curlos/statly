import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useGetAllProjectGroupsQuery, useGetAllProjectsQuery } from '../../services/resources/ticktickOneApi';
import { useEffect, useState } from 'react';
import Accordion from '../Accordion/Accordion';
import Spinner from '../Loaders/Spinner';
import { getCommaSeparatedObj } from '../../utils/focus-apps/helpers.utils';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';
import { useGetTodoistAllProjectsQuery } from '../../services/resources/oldFocusAppsApi';

/**
 * @description Displays all of the ungrouped, grouped, and archived projects. All of the projects present here have a checkbox that can be clicked to filter the list of focus records by the selected projects.
 */
const ProjectsTodoistSection = () => {
	// RTK Query - Todoist - Projects
	const { data: fetchedTodoistAllProjects } = useGetTodoistAllProjectsQuery();
	const { todoistAllProjects } = fetchedTodoistAllProjects || {};

	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const projectsTodoistFromUrl = searchParams.get('projects-todoist');

	const projectsTodoistFromUrlById = getCommaSeparatedObj(projectsTodoistFromUrl);

	const [activeProjects, setActiveProjects] = useState([]);
	const [archivedProjects, setArchivedProjects] = useState([]);

	useEffect(() => {
		if (!todoistAllProjects) {
			return;
		}

		const newActiveProjects = [];
		const newArchivedProjects = [];

		for (let project of todoistAllProjects) {
			const { is_inbox_project, is_archived } = project;

			if (!is_inbox_project && is_archived) {
				newArchivedProjects.push(project);
			} else {
				newActiveProjects.push(project);
			}
		}

		setActiveProjects(newActiveProjects.toSorted((a, b) => a.order - b.order));
		setArchivedProjects(newArchivedProjects.toSorted((a, b) => a.order - b.order));
	}, [todoistAllProjects]);

	const [isOpenForParent, setIsOpenForParent] = useState(false);

	const isFromQLinkAccount = (project) => {
		return project.id === '2289588215' || project.id === '2295853642';
	};

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Projects (Todoist)</h3>
						<Icon
							name="construction"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
						{/* Assume the user always has at least one project. I suppose it'd be possible for there to be 0 projects but this works better for me personally. */}
						{activeProjects.length === 0 || (archivedProjects.length === 0 && <Spinner />)}
					</div>
				}
				openByDefault={true}
			>
				<div>
					<div className="space-y-2">
						{activeProjects.map((project) => (
							<CheckboxMultiSelectForUrl
								key={project.id}
								{...{
									project,
									chosenColorObj,
									nextLightestColorObj,
									commaSeparatedObj: projectsTodoistFromUrlById,
									updateQueryParams,
									urlQueryParamName: 'projects-todoist',
									nameParentheses: isFromQLinkAccount(project) ? ' (Q Link)' : '',
								}}
							/>
						))}

						<Accordion
							title={
								<div className="flex items-center gap-1">
									<Icon
										name={isOpenForParent ? 'folder_open' : 'folder'}
										fill={0}
										customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
									/>
									<Icon
										name={'folder_off'}
										fill={0}
										customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
									/>
									<div>Archived</div>
								</div>
							}
							setIsOpenForParent={setIsOpenForParent}
						>
							<div className="pl-4">
								{archivedProjects.map((project) => (
									<CheckboxMultiSelectForUrl
										key={project.id}
										{...{
											project,
											chosenColorObj,
											nextLightestColorObj,
											commaSeparatedObj: projectsTodoistFromUrlById,
											updateQueryParams,
											urlQueryParamName: 'projects-todoist',
											// Not technically needed here since I have no archived projects from my Q Link account but keeping it for the sake of consistency. Could definitely be removed and nothing would change.
											nameParentheses: isFromQLinkAccount(project) ? ' (Q Link)' : '',
										}}
									/>
								))}
							</div>
						</Accordion>
					</div>
				</div>
			</Accordion>
		</div>
	);
};

/**
 * @description A collapsible Accordion that will contain a "Project Group" and the list of projects under that speciifc "Project Group".
 */
const ProjectGroupWithProjects = ({
	isArchivedGroup,
	archivedProjects,
	projectGroup,
	groupedProjectsByGroupId,
	projectGroupsById,
	chosenColorObj,
	nextLightestColorObj,
	projectsFromUrlById,
	updateQueryParams,
}) => {
	const { id } = isArchivedGroup ? 'Archived' : projectGroup;
	const groupedProjects = isArchivedGroup ? archivedProjects : groupedProjectsByGroupId[id];
	const groupName = isArchivedGroup ? 'Archived' : projectGroupsById[id].name;

	// This was needed so that I know the state and can show a closing or opening folder icon depending on whether the Accordion is open or not.
	const [isOpenForParent, setIsOpenForParent] = useState(false);

	return (
		<div key={id}>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<Icon
							name={isOpenForParent ? 'folder_open' : 'folder'}
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
						{isArchivedGroup && (
							<Icon
								name={'folder_off'}
								fill={0}
								customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
							/>
						)}
						<div>{groupName}</div>
					</div>
				}
				setIsOpenForParent={setIsOpenForParent}
			>
				<div className="pl-4">
					{groupedProjects?.map((project) => (
						<CheckboxMultiSelectForUrl
							key={project.id}
							{...{
								project,
								chosenColorObj,
								nextLightestColorObj,
								commaSeparatedObj: projectsFromUrlById,
								updateQueryParams,
								urlQueryParamName: 'projects',
							}}
						/>
					))}
				</div>
			</Accordion>
		</div>
	);
};

export default ProjectsTodoistSection;
