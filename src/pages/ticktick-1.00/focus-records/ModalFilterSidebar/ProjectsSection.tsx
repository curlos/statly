import classNames from 'classnames';
import Icon from '../../../../components/Icon';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useGetAllProjectGroupsQuery, useGetAllProjectsQuery } from '../../../../services/resources/ticktickOneApi';
import { useEffect, useState } from 'react';
import Accordion from '../../../../components/Accordion/Accordion';

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

		const { groupedProjects, ungroupedProjects, archivedProjects } = projects.reduce(
			(acc, project) => {
				if (project.closed) {
					acc.archivedProjects.push(project);
				} else if (project.groupId) {
					acc.groupedProjects.push(project); // Add to groupedProjects if groupId exists
				} else {
					acc.ungroupedProjects.push(project); // Add to ungroupedProjects if no groupId
				}
				return acc;
			},
			{ groupedProjects: [], ungroupedProjects: [], archivedProjects: [] }
		);

		const groupedProjectsByGroupId = {};

		groupedProjects.forEach((groupedProject) => {
			const { groupId } = groupedProject;

			if (!groupedProjectsByGroupId[groupId]) {
				groupedProjectsByGroupId[groupId] = [];
			}

			groupedProjectsByGroupId[groupId].push(groupedProject);
		});

		const projectGroups = Object.keys(groupedProjectsByGroupId).map((groupId) => projectGroupsById[groupId]);
		const sortedProjectGroups = projectGroups.sort((a, b) => a.sortOrder - b.sortOrder);

		const sortedArchivedProjects = archivedProjects.sort((a, b) => a.sortOrder - b.sortOrder);

		// Go through each list of projects in "groupedProjectsByGroupId" and sort them according to each other.
		Object.keys(groupedProjectsByGroupId).forEach((groupId) => {
			groupedProjectsByGroupId[groupId].sort((a, b) => a.sortOrder - b.sortOrder);
		});

		const sortedUngroupedProjects = ungroupedProjects.sort((a, b) => a.sortOrder - b.sortOrder);

		setSortedProjectGroups(sortedProjectGroups);
		setGroupedProjectsByGroupId(groupedProjectsByGroupId);
		setSortedArchivedProjects(sortedArchivedProjects);
		setSortedUngroupedProjects(sortedUngroupedProjects);
	}, [projects, projectGroupsById]);

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
				<div className="pl-3">
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

const CheckboxProject = ({ project, chosenColorObj, nextLightestColorObj, projectsFromUrlById, updateQueryParams }) => {
	const isChecked = projectsFromUrlById[project.id];

	const { id, name, color } = project;

	return (
		<div
			className="flex items-center gap-1 cursor-pointer"
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
						<div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: color }} />
					</div>
				)}
			</div>
		</div>
	);
};

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
