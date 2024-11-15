import classNames from 'classnames';
import Icon from '../../../../components/Icon';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useGetAllProjectsQuery } from '../../../../services/resources/ticktickOneApi';

const ProjectsSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const projectsFromUrl = searchParams.get('projects');

	// RTK Query - TickTick 1.0 - Projects
	const { data: fetchedProjects } = useGetAllProjectsQuery();
	const { projects } = fetchedProjects || {};

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
				{projects?.map((project) => (
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
