import { useMemo, useState } from 'react';
import classNames from 'classnames';
import Fuse from 'fuse.js';
import Modal from './Modal';
import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import { DEFAULT_TREE, TREE_NAMES, getAssignedTree, getTreeDisplayName, getTreeImageSrc } from '../../pages/forest/forestTrees';
import { useGetProjectGroupsQuery, useGetProjectsQuery } from '../../services/resources/projectsApi';
import { useEditUserSettingsMutation } from '../../services/resources/userSettingsApi';
import type { Project, ProjectGroup, ProjectTickTick } from '../../types/models';

interface ModalForestTreesProps {
	isOpen: boolean;
	onClose: () => void;
}

const bySortOrder = (a: { sortOrder?: number }, b: { sortOrder?: number }) => (a.sortOrder || 0) - (b.sortOrder || 0);

// Fuzzy enough to forgive a typo, but not so loose that "palm" finds everything
const SEARCH_OPTIONS = { keys: ['name'], threshold: 0.35, ignoreLocation: true };

interface SearchBoxProps {
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange, placeholder }) => (
	<div role="search" className="flex items-center gap-1 p-1 px-2 border border-color-gray-100 rounded-full">
		<Icon name="search" fill={0} customClass="text-color-gray-50 !text-[20px]" />
		<input
			type="search"
			aria-label={placeholder}
			placeholder={placeholder}
			value={value}
			onChange={(event) => onChange(event.target.value)}
			className="text-[16px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none p-1"
		/>
	</div>
);

const ModalForestTrees: React.FC<ModalForestTreesProps> = ({ isOpen, onClose }) => {
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
	const [projectSearch, setProjectSearch] = useState('');
	const [treeSearch, setTreeSearch] = useState('');

	const { chosenColorObj } = useThemeContext();
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { forestPageSettings: { projectTrees } } = useUserSettingsContext();
	const [editUserSettings] = useEditUserSettingsMutation();

	const { data: fetchedProjectGroups } = useGetProjectGroupsQuery();

	// Same order as the filter sidebar: TickTick projects and folders mixed by sort order, then archived projects, then Session categories.
	const { projectsAndFolders, archivedProjects, sessionCategories } = useMemo(() => {
		const projectGroupsById = fetchedProjectGroups?.projectGroupsById;
		const tickTickProjects = (fetchedProjects?.projectsTickTick || []) as ProjectTickTick[];
		const projectsByFolderId: Record<string, ProjectTickTick[]> = {};
		const ungroupedProjects: ProjectTickTick[] = [];
		const closedProjects: ProjectTickTick[] = [];

		tickTickProjects.forEach((project) => {
			if (project.closed) {
				closedProjects.push(project);
			} else if (project.groupId && project.groupId !== 'NONE' && projectGroupsById?.[project.groupId]) {
				(projectsByFolderId[project.groupId] ||= []).push(project);
			} else {
				ungroupedProjects.push(project);
			}
		});

		const folders = Object.keys(projectsByFolderId).map((folderId) => ({
			folder: projectGroupsById![folderId] as ProjectGroup,
			projects: projectsByFolderId[folderId].sort(bySortOrder),
		}));

		return {
			projectsAndFolders: [
				...ungroupedProjects.map((project) => ({ sortOrder: project.sortOrder, project, folder: null, projects: [] })),
				...folders.map(({ folder, projects }) => ({ sortOrder: folder.sortOrder, project: null, folder, projects })),
			].sort(bySortOrder),
			archivedProjects: closedProjects.sort(bySortOrder),
			sessionCategories: fetchedProjects?.projectsSession || [],
		};
	}, [fetchedProjects, fetchedProjectGroups]);

	// A search finds projects inside folders too, so its results are one flat list. Null means nothing is being searched for.
	const projectResults = useMemo(() => {
		const query = projectSearch.trim();
		if (!query) return null;

		const allProjects: Project[] = [
			...projectsAndFolders.flatMap(({ project, projects }) => (project ? [project] : projects)),
			...archivedProjects,
			...sessionCategories,
		];
		return new Fuse(allProjects, SEARCH_OPTIONS).search(query).map(({ item }) => item);
	}, [projectSearch, projectsAndFolders, archivedProjects, sessionCategories]);

	const treeResults = useMemo(() => {
		const query = treeSearch.trim();
		if (!query) return TREE_NAMES;

		const trees = TREE_NAMES.map((treeName) => ({ treeName, name: getTreeDisplayName(treeName) }));
		return new Fuse(trees, SEARCH_OPTIONS).search(query).map(({ item }) => item.treeName);
	}, [treeSearch]);

	const selectProject = (projectId: string | null) => {
		setSelectedProjectId(projectId);
		setTreeSearch('');
	};

	const closeModal = () => {
		setProjectSearch('');
		selectProject(null);
		onClose();
	};

	const updateProjectTree = (projectId: string, treeName: string | null) => {
		const newProjectTrees = { ...projectTrees };

		if (treeName) {
			newProjectTrees[projectId] = treeName;
		} else {
			delete newProjectTrees[projectId];
		}

		editUserSettings({ 'pages.forest.projectTrees': newProjectTrees });
	};

	const renderProject = (project: Project) => {
		const isAssigned = !!projectTrees[project.id];
		const assignedTree = getAssignedTree(project.id, projectTrees);
		const isSelected = selectedProjectId === project.id;

		return (
			<li key={project.id}>
				<button
					type="button"
					aria-expanded={isSelected}
					className="w-full flex items-center gap-2 p-2 rounded-md bg-color-gray-300 cursor-pointer text-left"
					onClick={() => selectProject(isSelected ? null : project.id)}
				>
					<span aria-hidden="true" className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: project.color || 'transparent' }} />
					<span className="flex-1 min-w-0">
						<span className="block truncate">{project.name}</span>
						<span className="block truncate text-color-gray-50 text-[12px]">{isAssigned ? getTreeDisplayName(assignedTree) : 'Default'}</span>
					</span>
					<img src={getTreeImageSrc(assignedTree)} alt="" loading="lazy" className="w-8 h-8 object-contain" />
				</button>

				{isSelected && (
					<div className="p-2">
						<div className="mb-2">
							<SearchBox value={treeSearch} onChange={setTreeSearch} placeholder="Search trees, like maple or palm" />
						</div>

						{isAssigned && (
							<button
								type="button"
								className="mb-2 px-3 py-[2px] border border-color-gray-50 rounded-full text-color-gray-50 text-[14px] bg-transparent cursor-pointer"
								onClick={() => updateProjectTree(project.id, null)}
							>
								Reset to Default ({getTreeDisplayName(DEFAULT_TREE)})
							</button>
						)}

						<div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-[340px] overflow-y-scroll pr-1 always-visible-scrollbar">
							{treeResults.length === 0 && <p className="col-span-full m-0 p-2 text-color-gray-50">No trees match "{treeSearch.trim()}".</p>}
							{treeResults.map((treeName) => (
								<button
									key={treeName}
									type="button"
									aria-pressed={isAssigned && assignedTree === treeName}
									className={classNames(
										'flex flex-col items-center gap-1 p-1 rounded-md border bg-transparent cursor-pointer',
										isAssigned && assignedTree === treeName ? chosenColorObj.borderColor : 'border-transparent'
									)}
									onClick={() => updateProjectTree(project.id, treeName)}
								>
									<img src={getTreeImageSrc(treeName)} alt="" loading="lazy" className="w-16 h-16 object-contain" />
									<span className="text-[12px] text-center leading-tight">{getTreeDisplayName(treeName)}</span>
								</button>
							))}
						</div>
					</div>
				)}
			</li>
		);
	};

	const renderFolder = (name: string, iconName: string, projects: Project[]) => (
		<li key={name}>
			<Accordion
				title={
					<div className="flex items-center gap-1 py-1">
						<Icon name={iconName} fill={0} customClass="!text-[20px] text-color-gray-50" />
						<span>{name}</span>
					</div>
				}
				openByDefault={false}
			>
				<ul className="space-y-1 pl-3">{projects.map(renderProject)}</ul>
			</Accordion>
		</li>
	);

	return (
		<Modal isOpen={isOpen} onClose={closeModal} customClasses="!w-[720px]" ariaLabelledBy="modal-forest-trees-heading">
			<div className="bg-color-gray-600 rounded-lg p-4">
				<div className="flex justify-between items-center mb-3">
					<h2 id="modal-forest-trees-heading" className="font-bold text-[18px]">Assign Trees to Projects</h2>
					<button type="button" aria-label="Close" className="bg-transparent border-0 p-0 cursor-pointer" onClick={closeModal}>
						<Icon name="close" customClass="!text-[24px] text-color-gray-50" />
					</button>
				</div>

				<div className="mb-3">
					<SearchBox value={projectSearch} onChange={setProjectSearch} placeholder="Search projects" />
				</div>

				{projectResults ? (
					<>
						<p role="status" className="m-0 mb-2 text-color-gray-50">
							{projectResults.length === 0
								? `No projects match "${projectSearch.trim()}".`
								: `${projectResults.length} ${projectResults.length === 1 ? 'project' : 'projects'} found`}
						</p>
						<ul className="space-y-1">{projectResults.map(renderProject)}</ul>
					</>
				) : (
					<>
						<Accordion title={<h3 className="text-[16px] font-bold">Projects (TickTick)</h3>} openByDefault={true}>
							<ul className="space-y-1 mt-1">
								{projectsAndFolders.map(({ project, folder, projects }) =>
									project ? renderProject(project) : renderFolder(folder!.name, 'folder', projects)
								)}
								{archivedProjects.length > 0 && renderFolder('Archived', 'folder_off', archivedProjects)}
							</ul>
						</Accordion>

						{sessionCategories.length > 0 && (
							<>
								<hr aria-hidden="true" className="border-color-gray-100 my-4" />
								<Accordion title={<h3 className="text-[16px] font-bold">Categories (Session App)</h3>} openByDefault={true}>
									<ul className="space-y-1 mt-1">{sessionCategories.map(renderProject)}</ul>
								</Accordion>
							</>
						)}
					</>
				)}
			</div>
		</Modal>
	);
};

export default ModalForestTrees;
