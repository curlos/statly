import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useGetAllProjectGroupsQuery, useGetAllProjectsQuery } from '../../services/resources/ticktickOneApi';
import { useEffect, useState } from 'react';
import Accordion from '../Accordion/Accordion';
import Spinner from '../Loaders/Spinner';
import { getCommaSeparatedObj } from '../../utils/focus-apps/helpers.utils';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';

/**
 * @description Displays all of the ungrouped, grouped, and archived projects. All of the projects present here have a checkbox that can be clicked to filter the list of focus records by the selected projects.
 */
const ProjectsTodoistSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const projectsFromUrl = searchParams.get('projects-todoist');

	const projectsFromUrlById = getCommaSeparatedObj(projectsFromUrl);

	useEffect(() => {
		if (isLoadingGetProjects || isLoadingGetProjectGroups) {
			return;
		}
	}, [projects, projectGroupsById]);

	// This is the combined array of the "Project Groups" and the ungrouped Projects. It's necessary for them to be a combined array because it's possible on TickTick 1.0 for them to be mixed together. You could have a "Project Group" between two ungrouped "Projects". So, to be as accurate as possible, they both need to be in the same array.
	// Archived Projects don't need to be here as they're technically not an actual Project Group in TickTick 1.0 and are the lowest priority since they're not active anymore.
	const sortedProjectsAndGroups = sortedUngroupedProjects &&
		sortedProjectGroups && [...sortedUngroupedProjects, ...sortedProjectGroups];

	sortedProjectsAndGroups?.sort((a, b) => a.sortOrder - b.sortOrder);

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
						{(!sortedProjectsAndGroups || sortedProjectsAndGroups.length === 0) && <Spinner />}
					</div>
				}
				openByDefault={true}
			>
				<div>
					<div className="space-y-2">
						{/* Archived Projects */}
						<ProjectGroupWithProjects
							{...{
								isArchivedGroup: true,
								archivedProjects: sortedArchivedProjects,
								chosenColorObj,
								nextLightestColorObj,
								projectsFromUrlById,
								updateQueryParams,
							}}
						/>
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
