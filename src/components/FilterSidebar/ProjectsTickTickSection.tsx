import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useGetProjectsQuery, useGetProjectGroupsQuery } from '../../services/resources/projectsApi';
import { useEffect, useState } from 'react';
import Accordion from '../Accordion/Accordion';
import Spinner from '../Loaders/Spinner';
import { getCommaSeparatedObj } from '../../utils/helpers.utils';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';
import CheckboxOther from './CheckboxOther';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import AppliedFilterItem from './AppliedFilterItem';
import type { ProjectTickTick, ProjectGroup } from '../../types/models';
import type { ColorVariant } from '../../utils/TAILWIND_COLORS/TAILWIND_COLORS_OBJ';

interface ProjectsTickTickSectionProps {
	page: string;
}

/**
 * @description Displays all of the ungrouped, grouped, and archived projects. All of the projects present here have a checkbox that can be clicked to filter the list of focus records by the selected projects.
 */
const ProjectsTickTickSection: React.FC<ProjectsTickTickSectionProps> = ({ page }) => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const projectsFromUrl = searchParams.get('projects');

	const {
		focusHoursGoalPageSettings: { currentRing, selectedRingId },
		handleUpdateRingSetting,
	} = useUserSettingsContext();

	const filteredProjects = currentRing?.projects ?? {};

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetProjectsQuery();
	const { projectsTickTick, projectsById } = fetchedProjects || {};

	// RTK Query - TickTick 1.0 - Project Groups
	const { data: fetchedProjectGroups, isLoading: isLoadingGetProjectGroups } = useGetProjectGroupsQuery();
	const { projectGroupsById } = fetchedProjectGroups || {};

	// RTK Query - User Settings
	const { data: fetchedUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};

	const [editUserSettings] = useEditUserSettingsMutation();

	const [groupedProjectsByGroupId, setGroupedProjectsByGroupId] = useState<Record<string, ProjectTickTick[]>>({});
	const [sortedProjectGroups, setSortedProjectGroups] = useState<ProjectGroup[]>([]);
	const [sortedUngroupedProjects, setSortedUngroupedProjects] = useState<ProjectTickTick[]>([]);
	const [sortedArchivedProjects, setSortedArchivedProjects] = useState<ProjectTickTick[]>([]);

	const projectsFromUrlById = getCommaSeparatedObj(projectsFromUrl ?? undefined);

	useEffect(() => {
		if (isLoadingGetProjects || isLoadingGetProjectGroups) {
			return;
		}

		// Go through all of the user's projects and separate them into 3 groups: Grouped, Ungrouped, and Archived projects.
		const { groupedProjects, ungroupedProjects, archivedProjects } = (projectsTickTick || []).reduce(
			(acc, project) => {
				const tickTickProject = project as ProjectTickTick;
				if (tickTickProject.closed) {
					acc.archivedProjects.push(tickTickProject);
				} else if (tickTickProject.groupId && tickTickProject.groupId !== 'NONE' && projectGroupsById?.[tickTickProject.groupId]) {
					acc.groupedProjects.push(tickTickProject);
				} else {
					acc.ungroupedProjects.push(tickTickProject);
				}
				return acc;
			},
			{ groupedProjects: [] as ProjectTickTick[], ungroupedProjects: [] as ProjectTickTick[], archivedProjects: [] as ProjectTickTick[] }
		);

		const groupedProjectsByGroupId: Record<string, ProjectTickTick[]> = {};

		// Go through each project that is has a valid "groupId" and push it into the array of projects for that specific Project Group. Will look something like "{ "66d0578f619d91029a6856ff": [{"name": "GUNPLA", ...}]}"".
		groupedProjects.forEach((groupedProject) => {
			const { groupId } = groupedProject;

			if (!groupId) return;

			if (!groupedProjectsByGroupId[groupId]) {
				groupedProjectsByGroupId[groupId] = [];
			}

			groupedProjectsByGroupId[groupId].push(groupedProject);
		});

		const projectGroups = Object.keys(groupedProjectsByGroupId).map((groupId) => projectGroupsById?.[groupId]).filter(Boolean) as ProjectGroup[];

		// Sort all the grouped projects within the specifc Project Group project's array.
		Object.keys(groupedProjectsByGroupId).forEach((groupId) => {
			groupedProjectsByGroupId[groupId].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
		});

		// "Project Groups" are different from "Projects". They are the "folders" that contain other projects within them. However, just like "Projects", they have a "sortOrder" property that determines the order it should appear in.
		const sortedProjectGroups = projectGroups.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

		const sortedArchivedProjects = archivedProjects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
		const sortedUngroupedProjects = ungroupedProjects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

		setSortedProjectGroups(sortedProjectGroups);
		setGroupedProjectsByGroupId(groupedProjectsByGroupId);
		setSortedArchivedProjects(sortedArchivedProjects);
		setSortedUngroupedProjects(sortedUngroupedProjects);
	}, [projectsTickTick, projectGroupsById, isLoadingGetProjects, isLoadingGetProjectGroups]);

	// This is the combined array of the "Project Groups" and the ungrouped Projects. It's necessary for them to be a combined array because it's possible on TickTick 1.0 for them to be mixed together. You could have a "Project Group" between two ungrouped "Projects". So, to be as accurate as possible, they both need to be in the same array.
	// Archived Projects don't need to be here as they're technically not an actual Project Group in TickTick 1.0 and are the lowest priority since they're not active anymore.
	const sortedProjectsAndGroups: (ProjectTickTick | ProjectGroup)[] = sortedUngroupedProjects &&
		sortedProjectGroups ? [...sortedUngroupedProjects, ...sortedProjectGroups] : [];

	sortedProjectsAndGroups?.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

	const handleCheckboxClick = async (userSettingProperty: string, newValue: Record<string, boolean>) => {
		// If a ring is selected, update ring-specific settings
		if (currentRing && selectedRingId) {
			await handleUpdateRingSetting(selectedRingId, userSettingProperty, newValue);
			return;
		}

		// Otherwise, use global update (existing logic for backward compatibility)
		const restOfPagesKeysAndVals = userSettings?.pages;
		const restOfFocusHoursGoalsKeysAndVals = userSettings?.pages?.focusHoursGoal;

		const payload = {
			pages: {
				...restOfPagesKeysAndVals,
				focusHoursGoal: {
					...restOfFocusHoursGoalsKeysAndVals,
					[userSettingProperty]: newValue,
				},
			},
		};

		await editUserSettings(payload);
	};

	// Get list of selected project IDs from user settings
	const getSelectedProjectIds = (): string[] => {
		if (!filteredProjects || typeof filteredProjects !== 'object') {
			return [];
		}
		return Object.entries(filteredProjects)
			.filter(([, isSelected]) => isSelected === true)
			.map(([projectId]) => projectId);
	};

	// Get comma-separated project names for display
	const getSelectedProjectsDisplay = (): string => {
		const selectedIds = getSelectedProjectIds();
		if (!projectsById || selectedIds.length === 0) return '';

		const projectNames = selectedIds
			.map(id => projectsById[id]?.name || id)
			.filter(Boolean); // Remove undefined entries

		return projectNames.join(', ');
	};

	// Clear all selected projects
	const handleClearAllProjects = async () => {
		// Set all projects to false
		const clearedProjects: Record<string, boolean> = {};
		if (filteredProjects) {
			Object.keys(filteredProjects).forEach(projectId => {
				clearedProjects[projectId] = false;
			});
		}

		await handleCheckboxClick('projects', clearedProjects);
	};

	const isLoading = isLoadingGetProjects || isLoadingGetProjectGroups

	if (!isLoading && sortedProjectsAndGroups.length === 0 && sortedArchivedProjects.length === 0) {
		return null
	}

	return (
		<div>
			{page === 'focus-time-goal' ? (
				<div>
					<h4 className="text-[14px] font-semibold text-color-gray-25 mb-1">Filtered Projects</h4>
					<p className="text-[14px] text-color-gray-50 mt-0 mb-2">
						Select projects to count towards your focus hours for this ring. Only time tracked in selected projects will contribute to your daily goal.
					</p>
				</div>
			) : (
				<hr aria-hidden="true" className="border-color-gray-100 my-4" />
			)}

			{/* Selected Projects Display - Only for focus-time-goal page */}
			{page === 'focus-time-goal' && getSelectedProjectIds().length > 0 && (
				<div className="mb-3">
					<AppliedFilterItem
						name="Projects (TickTick)"
						value={getSelectedProjectsDisplay()}
						onRemove={handleClearAllProjects}
					/>
				</div>
			)}

			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Projects (TickTick)</h3>
						<Icon
							name="construction"
							fill={0}
							customClass={`${chosenColorObj.textColor} !text-[20px] hover:text-white cursor-pointer`}
						/>
						{/* Assume the user always has at least one project. I suppose it'd be possible for there to be 0 projects but this works better for me personally. */}
						{isLoading && <Spinner />}
					</div>
				}
				openByDefault={true}
			>
				<div>
					<div>
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
											page,
											filteredProjects,
											handleCheckboxClick,
										}}
									/>
								);
							}

							const project = projectOrProjectGroup as ProjectTickTick;

							if (page == 'focus-time-goal') {
								const showValue = filteredProjects?.[project.id] ?? false;

								return (
									<CheckboxOther
										key={project.id}
										name={project.name}
										showValue={showValue}
										handleCheckboxClick={() =>
											handleCheckboxClick('projects', {
												...filteredProjects,
												[project.id]: !showValue,
											})
										}
										project={project}
									/>
								);
							}

							return (
								<CheckboxMultiSelectForUrl
									key={project.id}
									project={project}
									chosenColorObj={chosenColorObj}
									nextLightestColorObj={nextLightestColorObj || chosenColorObj}
									commaSeparatedObj={projectsFromUrlById}
									updateQueryParams={updateQueryParams as () => void}
									urlQueryParamName="projects"
								/>
							);
						})}

						{/* Archived Projects */}
						{sortedArchivedProjects?.length > 0 && (
							<ProjectGroupWithProjects
								{...{
									isArchivedGroup: true,
									archivedProjects: sortedArchivedProjects,
									chosenColorObj,
									nextLightestColorObj,
									projectsFromUrlById,
									updateQueryParams,
									page,
									filteredProjects,
									handleCheckboxClick,
								}}
							/>
						)}
					</div>
				</div>
			</Accordion>
		</div>
	);
};

interface ProjectGroupWithProjectsProps {
	isArchivedGroup?: boolean;
	archivedProjects?: ProjectTickTick[];
	projectGroup?: ProjectGroup;
	groupedProjectsByGroupId?: Record<string, ProjectTickTick[]>;
	projectGroupsById?: Record<string, ProjectGroup>;
	chosenColorObj: ColorVariant;
	nextLightestColorObj: ColorVariant | null;
	projectsFromUrlById: Record<string, boolean>;
	updateQueryParams: (newParams: Record<string, string>, customNewUrl?: string) => void;
	page: string;
	filteredProjects?: Record<string, boolean>;
	handleCheckboxClick: (property: string, value: Record<string, boolean>) => Promise<void>;
}

/**
 * @description A collapsible Accordion that will contain a "Project Group" and the list of projects under that speciifc "Project Group".
 */
const ProjectGroupWithProjects: React.FC<ProjectGroupWithProjectsProps> = ({
	isArchivedGroup,
	archivedProjects,
	projectGroup,
	groupedProjectsByGroupId,
	projectGroupsById,
	chosenColorObj,
	nextLightestColorObj,
	projectsFromUrlById,
	updateQueryParams,
	page,
	filteredProjects,
	handleCheckboxClick,
}) => {
	const id = isArchivedGroup ? 'Archived' : projectGroup?.id || '';
	const groupedProjects = isArchivedGroup ? archivedProjects : groupedProjectsByGroupId?.[id];
	const groupName = isArchivedGroup ? 'Archived' : projectGroupsById?.[id]?.name || '';

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
					{groupedProjects?.map((project) => {
						if (page == 'focus-time-goal') {
							const showValue = filteredProjects?.[project.id] ?? false;

							return (
								<CheckboxOther
									key={project.id}
									name={project.name}
									showValue={showValue}
									handleCheckboxClick={() =>
										handleCheckboxClick('projects', {
											...filteredProjects,
											[project.id]: !showValue,
										})
									}
									project={project}
								/>
							);
						}

						return (
							<CheckboxMultiSelectForUrl
								key={project.id}
								project={project}
								chosenColorObj={chosenColorObj}
								nextLightestColorObj={nextLightestColorObj || chosenColorObj}
								commaSeparatedObj={projectsFromUrlById}
								updateQueryParams={updateQueryParams as () => void}
								urlQueryParamName="projects"
							/>
						);
					})}
				</div>
			</Accordion>
		</div>
	);
};

export default ProjectsTickTickSection;
