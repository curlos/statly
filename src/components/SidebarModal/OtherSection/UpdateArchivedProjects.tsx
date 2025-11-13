import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import useHandleError from '../../../hooks/useHandleError';
import { useSyncTasksFromArchivedProjectsMutation } from '../../../services/resources/documentsSyncApi';
import { useGetProjectsQuery } from '../../../services/resources/documentsProjectsApi';
import Accordion from '../../Accordion/Accordion';
import Icon from '../../Icon';
import Spinner from '../../Loaders/Spinner';

const UpdateArchivedProjects = () => {
	const { chosenColorObj } = useThemeContext();
	const [updateStatus, setUpdateStatus] = useState('none');
	const [checkedArchivedProjects, setCheckedArchivedProjects] = useState({});

	const handleError = useHandleError();

	const [syncTasksFromArchivedProjects] = useSyncTasksFromArchivedProjectsMutation();

	const handleClick = () => {
		handleError(async () => {
			const checkedArchivedProjectIds = Object.keys(checkedArchivedProjects).filter(
				(projectId) => checkedArchivedProjects[projectId]
			);

			const payload = {
				archivedProjectIds: checkedArchivedProjectIds,
			};

			setUpdateStatus('loading');

			await syncTasksFromArchivedProjects(payload);

			// Let the UI update before doing heavy work
			setTimeout(() => {
				setUpdateStatus('done');

				setTimeout(() => {
					setUpdateStatus('none');
				}, 1000);
			}, 0);
		});
	};

	return (
		<div>
			<div
				className={classNames('flex items-center gap-2 my-2 cursor-pointer', chosenColorObj.hover.textColor)}
				onClick={handleClick}
			>
				{updateStatus === 'loading' ? (
					<Spinner />
				) : (
					<Icon
						name={updateStatus === 'none' ? 'update' : 'check'}
						fill={0}
						customClass={classNames(
							'!text-[20px] cursor-pointer rounded-lg bg-color-gray-300 p-[6px]',
							updateStatus === 'none'
								? `'text-color-gray-50' ${chosenColorObj.hover.textColor} ${chosenColorObj.hover.borderColor}`
								: 'text-emerald-500'
						)}
					/>
				)}

				<div>Update Active and Completed Tasks From Archived Projects (TickTick)</div>
			</div>

			<div className="mt-4 pl-14">
				<ArchivedProjectsCheckboxList {...{ checkedArchivedProjects, setCheckedArchivedProjects }} />
			</div>
		</div>
	);
};

const ArchivedProjectsCheckboxList = ({ checkedArchivedProjects, setCheckedArchivedProjects }) => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	// RTK Query - Documents - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetProjectsQuery();
	const { projectsTickTick } = fetchedProjects || {};

	const [sortedArchivedProjects, setSortedArchivedProjects] = useState([]);

	const selectedAll = sortedArchivedProjects.every((project) => checkedArchivedProjects[project.id]);

	useEffect(() => {
		if (isLoadingGetProjects || !projectsTickTick) {
			return;
		}

		const archivedProjects = projectsTickTick.filter((project) => project.closed);
		const sortedArchivedProjects = archivedProjects.sort((a, b) => a.sortOrder - b.sortOrder);
		setSortedArchivedProjects(sortedArchivedProjects);
	}, [projectsTickTick, isLoadingGetProjects]);

	const toggleSelectAllArchivedProjects = () => {
		const newCheckedArchivedProjects = {};

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
			<div className="space-y-2">
				<div
					className={classNames(
						'flex items-center gap-1 mb-2 cursor-pointer',
						nextLightestColorObj.hover.textColor
					)}
					onClick={toggleSelectAllArchivedProjects}
				>
					<label
						className="inline-flex items-center cursor-pointer"
						onChange={(e) => {
							e.stopPropagation();
						}}
					>
						<input
							type="checkbox"
							checked={selectedAll}
							onClick={(e) => e.stopPropagation()}
							onChange={() => {}}
							className="sr-only"
						/>
						<div
							className={`relative w-11 h-6 rounded-full transition-colors
                            ${selectedAll ? chosenColorObj.bgColor : 'bg-color-gray-300'}`}
						>
							<div
								className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white border border-gray-300 rounded-full transition-transform
                            ${selectedAll ? 'translate-x-full' : ''}`}
							></div>
						</div>
						<span className="ml-2">Select All</span>
					</label>
				</div>

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

const CheckboxArchivedProject = ({ project, checkedArchivedProjects, setCheckedArchivedProjects }) => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const isChecked = checkedArchivedProjects[project.id];

	return (
		<div
			className="flex items-center gap-1 cursor-pointer"
			onClick={() => {
				setCheckedArchivedProjects({
					...checkedArchivedProjects,
					[project.id]: !isChecked,
				});
			}}
		>
			<Icon
				name={isChecked ? 'check_box' : 'check_box_outline_blank'}
				fill={1}
				customClass={classNames('!text-[22px]', chosenColorObj.textColor, nextLightestColorObj.hover.textColor)}
			/>
			<div className="flex-1 flex justify-between items-center gap-1">
				<div>{project.name}</div>
				{project?.color && (
					<div>
						<div
							className="w-[10px] h-[10px] rounded-full mr-[4px]"
							style={{ backgroundColor: project?.color }}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default UpdateArchivedProjects;
