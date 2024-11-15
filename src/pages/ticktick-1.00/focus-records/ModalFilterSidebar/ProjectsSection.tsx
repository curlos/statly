import classNames from 'classnames';
import Icon from '../../../../components/Icon';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useGetAllProjectGroupsQuery, useGetAllProjectsQuery } from '../../../../services/resources/ticktickOneApi';
import { useEffect, useRef, useState } from 'react';
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
	const [ungroupedProjects, setUngroupedProjects] = useState([]);

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

		const { groupedProjects, ungroupedProjects } = projects.reduce(
			(acc, project) => {
				if (project.groupId) {
					acc.groupedProjects.push(project); // Add to groupedProjects if groupId exists
				} else {
					acc.ungroupedProjects.push(project); // Add to ungroupedProjects if no groupId
				}
				return acc;
			},
			{ groupedProjects: [], ungroupedProjects: [] }
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

		// Go through each list of projects in "groupedProjectsByGroupId" and sort them according to each other.
		Object.keys(groupedProjectsByGroupId).forEach((groupId) => {
			groupedProjectsByGroupId[groupId].sort((a, b) => a.sortOrder - b.sortOrder);
		});

		setSortedProjectGroups(sortedProjectGroups);
		setGroupedProjectsByGroupId(groupedProjectsByGroupId);
		setUngroupedProjects(ungroupedProjects);
	}, [projects, projectGroupsById]);

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
					{sortedProjectGroups.map((projectGroup) => (
						<ProjectGroupWithProjects
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
					))}
				</div>

				{/* {projects?.map((project) => (
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
				))} */}
			</div>
		</div>
	);
};

const ProjectGroupWithProjects = ({
	projectGroup,
	groupedProjectsByGroupId,
	projectGroupsById,
	chosenColorObj,
	nextLightestColorObj,
	projectsFromUrlById,
	updateQueryParams,
}) => {
	const { id } = projectGroup;
	const groupedProjects = groupedProjectsByGroupId[id];
	const groupName = projectGroupsById[id].name;
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

	return (
		<div
			className="flex items-center gap-1 cursor-pointer"
			onClick={() => {
				if (isChecked) {
					projectsFromUrlById[project.id] = false;
				} else {
					projectsFromUrlById[project.id] = true;
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
			<div>{project.name}</div>
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
