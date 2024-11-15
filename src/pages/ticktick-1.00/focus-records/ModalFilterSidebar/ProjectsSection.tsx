import classNames from 'classnames';
import Icon from '../../../../components/Icon';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useGetAllProjectGroupsQuery, useGetAllProjectsQuery } from '../../../../services/resources/ticktickOneApi';
import { useEffect, useState } from 'react';
import Accordion from '../../../../components/Accordion/Accordion';

/**
 * @description Displays all of the ungrouped, grouped, and archived projects. All of the projects present here have a checkbox that can be clicked to filter the list of focus records by the selected projects.
 */
const ProjectsSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const projectsFromUrl = searchParams.get('projects');

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	const { projects } = fetchedProjects || {};

	// RTK Query - TickTick 1.0 - Project Groups
	const { data: fetchedProjectGroups, isLoading: isLoadingGetProjectGroups } = useGetAllProjectGroupsQuery();
	const { projectGroupsById } = fetchedProjectGroups || {};

	const [groupedProjectsByGroupId, setGroupedProjectsByGroupId] = useState([]);
	const [sortedProjectGroups, setSortedProjectGroups] = useState([]);
	const [sortedUngroupedProjects, setSortedUngroupedProjects] = useState([]);
	const [sortedArchivedProjects, setSortedArchivedProjects] = useState([]);

	/**
	 * @description Transforms the URL string of the "projects" query param into an object with the project ids as the keys.
	 * @param {String} projectsFromUrl - The comma separated string of the "projects" query params.
	 * @returns {Object} - Example: {
	 * 	"66d0578f619d91029a6856ff": true,
	 * 	"6546186da378914a9ef06b12": false,
	 * ...
	 * }
	 */
	const getProjectsFromUrlById = (projectsFromUrl) => {
		if (!projectsFromUrl) {
			return {};
		}

		const projectIdsArr = projectsFromUrl.split(',');
		const projectsFromUrlById = {};

		for (let projectId of projectIdsArr) {
			projectsFromUrlById[projectId] = true;
		}

		return projectsFromUrlById;
	};

	const projectsFromUrlById = getProjectsFromUrlById(projectsFromUrl);

	useEffect(() => {
		if (isLoadingGetProjects || isLoadingGetProjectGroups) {
			return;
		}

		// Go through all of the user's projects and separate them into 3 groups: Grouped, Ungrouped, and Archived projects.
		const { groupedProjects, ungroupedProjects, archivedProjects } = projects.reduce(
			(acc, project) => {
				if (project.closed) {
					acc.archivedProjects.push(project);
				} else if (project.groupId) {
					acc.groupedProjects.push(project);
				} else {
					acc.ungroupedProjects.push(project);
				}
				return acc;
			},
			{ groupedProjects: [], ungroupedProjects: [], archivedProjects: [] }
		);

		const groupedProjectsByGroupId = {};

		// Go through each project that is has a valid "groupId" and push it into the array of projects for that specific Project Group. Will look something like "{ "66d0578f619d91029a6856ff": [{"name": "GUNPLA", ...}]}"".
		groupedProjects.forEach((groupedProject) => {
			const { groupId } = groupedProject;

			if (!groupedProjectsByGroupId[groupId]) {
				groupedProjectsByGroupId[groupId] = [];
			}

			groupedProjectsByGroupId[groupId].push(groupedProject);
		});

		const projectGroups = Object.keys(groupedProjectsByGroupId).map((groupId) => projectGroupsById[groupId]);

		// Sort all the grouped projects within the specifc Project Group project's array.
		Object.keys(groupedProjectsByGroupId).forEach((groupId) => {
			groupedProjectsByGroupId[groupId].sort((a, b) => a.sortOrder - b.sortOrder);
		});

		// "Project Groups" are different from "Projects". They are the "folders" that contain other projects within them. However, just like "Projects", they have a "sortOrder" property that determines the order it should appear in.
		const sortedProjectGroups = projectGroups.sort((a, b) => a.sortOrder - b.sortOrder);

		const sortedArchivedProjects = archivedProjects.sort((a, b) => a.sortOrder - b.sortOrder);
		const sortedUngroupedProjects = ungroupedProjects.sort((a, b) => a.sortOrder - b.sortOrder);

		setSortedProjectGroups(sortedProjectGroups);
		setGroupedProjectsByGroupId(groupedProjectsByGroupId);
		setSortedArchivedProjects(sortedArchivedProjects);
		setSortedUngroupedProjects(sortedUngroupedProjects);
	}, [projects, projectGroupsById]);

	// This is the combined array of the "Project Groups" and the ungrouped Projects. It's necessary for them to be a combined array because it's possible on TickTick 1.0 for them to be mixed together. You could have a "Project Group" between two ungrouped "Projects". So, to be as accurate as possible, they both need to be in the same array.
	// Archived Projects don't need to be here as they're technically not an actual Project Group in TickTick 1.0 and are the lowest priority since they're not active anymore.
	const sortedProjectsAndGroups = sortedUngroupedProjects &&
		sortedProjectGroups && [...sortedUngroupedProjects, ...sortedProjectGroups];

	sortedProjectsAndGroups?.sort((a, b) => a.sortOrder - b.sortOrder);

	return (
		<div>
			<div className="flex items-center gap-1 mb-3">
				<h3 className="text-[16px] font-bold">Projects</h3>
				<Icon
					name="construction"
					fill={0}
					customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
				/>
			</div>

			<div>
				<div className="space-y-2">
					{/* Project Groups with their Projects AND Ungrouped Projects */}
					{sortedProjectsAndGroups?.map((projectOrProjectGroup) => {
						const { id } = projectOrProjectGroup;
						const isProjectGroup = groupedProjectsByGroupId[id];

						if (isProjectGroup) {
							const projectGroup = projectOrProjectGroup;
							return (
								<ProjectGroupWithProjects
									key={projectGroup.id}
									{...{
										projectGroup,
										groupedProjectsByGroupId,
										projectGroupsById,
										chosenColorObj,
										nextLightestColorObj,
										projectsFromUrlById,
										updateQueryParams,
									}}
								/>
							);
						}

						const project = projectOrProjectGroup;

						return (
							<CheckboxProject
								key={project.id}
								{...{
									project,
									chosenColorObj,
									nextLightestColorObj,
									projectsFromUrlById,
									updateQueryParams,
								}}
							/>
						);
					})}

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
				<div>
					{groupedProjects?.map((project) => (
						<CheckboxProject
							key={project.id}
							{...{
								project,
								chosenColorObj,
								nextLightestColorObj,
								projectsFromUrlById,
								updateQueryParams,
							}}
						/>
					))}
				</div>
			</Accordion>
		</div>
	);
};

/**
 * @description Checkbox that will update the query params in the URL to either add or remove a project from the "projects" query params.
 */
const CheckboxProject = ({ project, chosenColorObj, nextLightestColorObj, projectsFromUrlById, updateQueryParams }) => {
	const isChecked = projectsFromUrlById[project.id];

	const { id, name, color } = project;

	return (
		<div
			className="flex items-center gap-1 cursor-pointer px-2"
			onClick={() => {
				if (isChecked) {
					projectsFromUrlById[id] = false;
				} else {
					projectsFromUrlById[id] = true;
				}

				const commaSeparatedSelectedProjects = getCommaSeparatedSelectedProjects(projectsFromUrlById);
				updateQueryParams({ projects: commaSeparatedSelectedProjects });
			}}
		>
			<Icon
				name={isChecked ? 'check_box' : 'check_box_outline_blank'}
				fill={1}
				customClass={classNames('!text-[22px]', chosenColorObj.textColor, nextLightestColorObj.hover.textColor)}
			/>
			<div className="flex-1 flex justify-between items-center gap-1">
				<div>{name}</div>
				{color && (
					<div>
						<div className="w-[10px] h-[10px] rounded-full mr-[4px]" style={{ backgroundColor: color }} />
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * @description Using "projectsFromUrlById", this will check all of the project ids that are checked and will create a comma separated string from this passed-in object. Mostly meant to update the query params of "projects" with this string.
 * @returns {String}
 */
const getCommaSeparatedSelectedProjects = (projectsFromUrlById) => {
	const selectedProjectsArr = [];

	for (let projectId of Object.keys(projectsFromUrlById)) {
		const isChecked = projectsFromUrlById[projectId];

		if (isChecked) {
			selectedProjectsArr.push(projectId);
		}
	}

	return selectedProjectsArr.join(',');
};

export default ProjectsSection;
