import { useEffect, useState } from 'react';
import Icon from '../../Icon';
import Spinner from '../../Loaders/Spinner';
import classNames from 'classnames';
import { useThemeContext } from '../../../contexts/useThemeContext';
import useHandleError from '../../../hooks/useHandleError';
import { useGetAllProjectsQuery } from '../../../services/resources/ticktickOneApi';
import Accordion from '../../Accordion/Accordion';

const OtherSection = () => {
	return (
		<div>
			<div className="flex items-center gap-1 mb-2">
				<h3 className="text-[20px] font-bold">Other</h3>
				<Icon name="other_admission" fill={1} customClass={'text-color-gray-50 !text-[20px]'} />
			</div>

			<UpdateArchivedProjects />
		</div>
	);
};

const UpdateArchivedProjects = () => {
	const [updateStatus, setUpdateStatus] = useState('none');
	const { chosenColorObj } = useThemeContext();

	return (
		<div>
			<div className={classNames('flex items-center gap-2 my-2 cursor-pointer', chosenColorObj.hover.textColor)}>
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

				<div>Get Active and Completed Tasks From Archived Projects (TickTick)</div>
			</div>

			<div className="mt-4">
				<ArchivedProjectsCheckboxList />
			</div>
		</div>
	);
};

const ArchivedProjectsCheckboxList = () => {
	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetAllProjectsQuery();
	const { projects } = fetchedProjects || {};

	const handleError = useHandleError();

	const [sortedArchivedProjects, setSortedArchivedProjects] = useState([]);
	const [checkedArchivedProjects, setCheckedArchivedProjects] = useState({});

	useEffect(() => {
		if (isLoadingGetProjects) {
			return;
		}

		const archivedProjects = projects.filter((project) => project.closed);
		const sortedArchivedProjects = archivedProjects.sort((a, b) => a.sortOrder - b.sortOrder);
		setSortedArchivedProjects(sortedArchivedProjects);
	}, [projects]);

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
				{sortedArchivedProjects.map((project) => (
					<CheckboxArchivedProject {...{ project, checkedArchivedProjects, setCheckedArchivedProjects }} />
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

export default OtherSection;
