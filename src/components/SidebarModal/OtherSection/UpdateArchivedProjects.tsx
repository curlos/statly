import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { useSyncTasksFromArchivedProjectsMutation } from '../../../services/resources/syncApi';
import { useGetProjectsQuery } from '../../../services/resources/projectsApi';
import Accordion from '../../Accordion/Accordion';
import Icon from '../../Icon';
import Spinner from '../../Loaders/Spinner';
import type { Project } from '../../../types/models';

const UpdateArchivedProjects = () => {
	const { chosenColorObj } = useThemeContext();
	const [updateStatus, setUpdateStatus] = useState('none');
	const [checkedArchivedProjects, setCheckedArchivedProjects] = useState<Record<string, boolean>>({});

	const [syncTasksFromArchivedProjects] = useSyncTasksFromArchivedProjectsMutation();

	const handleClick = async () => {
		const checkedArchivedProjectIds = Object.keys(checkedArchivedProjects).filter(
			(projectId) => checkedArchivedProjects[projectId]
		);

		const payload = {
			archivedProjectIds: checkedArchivedProjectIds,
		};

		setUpdateStatus('loading');

		try {
			await syncTasksFromArchivedProjects(payload).unwrap();

			// Let the UI update before doing heavy work
			setTimeout(() => {
				setUpdateStatus('done');

				setTimeout(() => {
					setUpdateStatus('none');
				}, 3000);
			}, 0);
		} catch (error) {
			// Error already shown by middleware, just reset loading state
			setUpdateStatus('none');
		}
	};

	return (
		<div>
			<span role="status" aria-live="polite" className="sr-only">{updateStatus === 'done' ? 'Update complete' : ''}</span>
			<button
				type="button"
				disabled={updateStatus === 'loading'}
				aria-busy={updateStatus === 'loading'}
				className={classNames('flex items-center gap-2 my-2 w-full text-left disabled:opacity-50 disabled:cursor-not-allowed', chosenColorObj.hover.textColor)}
				onClick={handleClick}
			>
				{updateStatus === 'loading' ? (
					<Spinner />
				) : (
					<Icon
						name={updateStatus === 'none' ? 'update' : 'check'}
						fill={0}
						customClass={classNames(
							'!text-[20px] rounded-lg bg-color-gray-300 p-[6px]',
							updateStatus === 'none'
								? `'text-color-gray-50' ${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
								: 'text-emerald-500'
						)}
					/>
				)}

				<span>Update Active and Completed Tasks from Archived Projects (TickTick)</span>
			</button>

			<div className="mt-4 pl-14">
				<ArchivedProjectsCheckboxList {...{ checkedArchivedProjects, setCheckedArchivedProjects }} />
			</div>
		</div>
	);
};

interface ArchivedProjectsCheckboxListProps {
	checkedArchivedProjects: Record<string, boolean>;
	setCheckedArchivedProjects: (projects: Record<string, boolean>) => void;
}

const ArchivedProjectsCheckboxList: React.FC<ArchivedProjectsCheckboxListProps> = ({ checkedArchivedProjects, setCheckedArchivedProjects }) => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	// RTK Query - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetProjectsQuery();
	const { projectsTickTick } = fetchedProjects || {};

	const [sortedArchivedProjects, setSortedArchivedProjects] = useState<Project[]>([]);

	const selectedAll = sortedArchivedProjects.every((project) => checkedArchivedProjects[project.id]);

	useEffect(() => {
		if (isLoadingGetProjects || !projectsTickTick) {
			return;
		}

		const archivedProjects = projectsTickTick.filter((project) => project.closed);
		const sortedArchivedProjects = archivedProjects.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
		setSortedArchivedProjects(sortedArchivedProjects);
	}, [projectsTickTick, isLoadingGetProjects]);

	const toggleSelectAllArchivedProjects = () => {
		const newCheckedArchivedProjects: Record<string, boolean> = {};

		if (selectedAll) {
			sortedArchivedProjects.map((project) => {
				newCheckedArchivedProjects[project.id] = false;
			});
		} else {
			sortedArchivedProjects.map((project) => {
				newCheckedArchivedProjects[project.id] = true;
			});
		}

		setCheckedArchivedProjects(newCheckedArchivedProjects);
	};

	return (
		<Accordion
			title={
				<div className="flex items-center gap-1 mb-2">
					<h3 className="text-[16px] font-bold">Archived Projects (TickTick)</h3>
					<Icon
						name="construction"
						fill={0}
						customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
					/>
					{isLoadingGetProjects && <Spinner />}
				</div>
			}
			openByDefault={false}
		>
			<div>
				<label
					className={classNames(
						'inline-flex items-center gap-1 mb-2 cursor-pointer rounded has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white has-[:focus-visible]:ring-inset',
						(nextLightestColorObj || chosenColorObj).hover.textColor
					)}
				>
					<input
						type="checkbox"
						checked={selectedAll}
						onChange={toggleSelectAllArchivedProjects}
						className="sr-only"
					/>
					<span aria-hidden="true"
						className={`relative w-11 h-6 rounded-full transition-colors ${selectedAll ? chosenColorObj.bgColor : 'bg-color-gray-300'}`}
					>
						<span
							className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white border border-gray-300 rounded-full transition-transform ${selectedAll ? 'translate-x-full' : ''}`}
						/>
					</span>
					<span className="ml-2">Select All</span>
				</label>

				{sortedArchivedProjects.map((project) => (
					<CheckboxArchivedProject
						key={project.id}
						{...{ project, checkedArchivedProjects, setCheckedArchivedProjects }}
					/>
				))}
			</div>
		</Accordion>
	);
};

interface CheckboxArchivedProjectProps {
	project: Project;
	checkedArchivedProjects: Record<string, boolean>;
	setCheckedArchivedProjects: (projects: Record<string, boolean>) => void;
}

const CheckboxArchivedProject: React.FC<CheckboxArchivedProjectProps> = ({ project, checkedArchivedProjects, setCheckedArchivedProjects }) => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const isChecked = checkedArchivedProjects[project.id];

	return (
		<label className="relative flex items-center gap-1 cursor-pointer rounded has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white has-[:focus-visible]:ring-inset">
			<input
				type="checkbox"
				className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
				checked={!!isChecked}
				onChange={() => setCheckedArchivedProjects({ ...checkedArchivedProjects, [project.id]: !isChecked })}
			/>
			<span aria-hidden="true" className="leading-[0]">
				<Icon
					name={isChecked ? 'check_box' : 'check_box_outline_blank'}
					fill={1}
					customClass={classNames('!text-[22px]', chosenColorObj.textColor, (nextLightestColorObj || chosenColorObj).hover.textColor)}
				/>
			</span>
			<span className="flex-1 flex justify-between items-center gap-1">
				<span>{project.name}</span>
				{project?.color && (
					<span aria-hidden="true">
						<span className="block w-[10px] h-[10px] rounded-full mr-[4px]" style={{ backgroundColor: project.color }} />
					</span>
				)}
			</span>
		</label>
	);
};

export default UpdateArchivedProjects;
