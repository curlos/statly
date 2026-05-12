import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useEffect, useState } from 'react';
import Accordion from '../Accordion/Accordion';
import Spinner from '../Loaders/Spinner';
import { getCommaSeparatedObj } from '../../utils/helpers.utils';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';
import { useGetProjectsQuery } from '../../services/resources/projectsApi';
import type { ProjectTodoist } from '../../types/models';

/**
 * @description Displays all of the ungrouped, grouped, and archived projects. All of the projects present here have a checkbox that can be clicked to filter the list of focus records by the selected projects.
 */
const ProjectsTodoistSection = () => {
	// RTK Query - Todoist - Projects
	const { data: fetchedProjects, isLoading } = useGetProjectsQuery();
	const { projectsTodoist } = fetchedProjects || {};

	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const projectsTodoistFromUrl = searchParams.get('projects-todoist');

	const projectsTodoistFromUrlById = getCommaSeparatedObj(projectsTodoistFromUrl ?? undefined);

	const [activeProjects, setActiveProjects] = useState<ProjectTodoist[]>([]);
	const [archivedProjects, setArchivedProjects] = useState<ProjectTodoist[]>([]);

	useEffect(() => {
		if (!projectsTodoist) {
			return;
		}

		const newActiveProjects: ProjectTodoist[] = [];
		const newArchivedProjects: ProjectTodoist[] = [];

		for (const project of projectsTodoist) {
			const { isInboxProject, isArchived } = project as ProjectTodoist;

			if (!isInboxProject && isArchived) {
				newArchivedProjects.push(project as ProjectTodoist);
			} else {
				newActiveProjects.push(project as ProjectTodoist);
			}
		}

		setActiveProjects(newActiveProjects.toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0)));
		setArchivedProjects(newArchivedProjects.toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0)));
	}, [projectsTodoist]);

	const [isOpenForParent, setIsOpenForParent] = useState(false);

	const isFromQLinkAccount = (project: ProjectTodoist) => {
		// TODO: This needs to be refactored potentially? Or maybe not since I won't allow users to see anything but TickTick data...
		// Checks both the "sync" and "api/v1" ids for the "Inbox" and "Address" projects, the only two projects I actively used on my Q Link account.
		return (
			project.id === '2289588215' ||
			project.id === '2295853642' ||
			project.id == '6Hhh3pxXG5JF3gjc' ||
			project.id == '6JVxw766pXHWcXgv'
		);
	};

	if (!isLoading && (!projectsTodoist || projectsTodoist.length === 0)) {
		return null
	}

	return (
		<div>
			<hr aria-hidden="true" className="border-color-gray-100 my-4" />
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Projects (Todoist)</h3>
						<Icon
							name="construction"
							fill={0}
							customClass={`${chosenColorObj.textColor} !text-[20px] hover:text-white cursor-pointer`}
						/>
						{isLoading && <Spinner />}
					</div>
				}
				openByDefault={true}
			>
				<div>
					<div>
						{activeProjects.map((project) => (
							<CheckboxMultiSelectForUrl
								key={project.id}
								project={project}
								chosenColorObj={chosenColorObj}
								nextLightestColorObj={nextLightestColorObj}
								commaSeparatedObj={projectsTodoistFromUrlById}
								updateQueryParams={updateQueryParams}
								urlQueryParamName={'projects-todoist'}
								nameParentheses={isFromQLinkAccount(project) ? ' (Q Link)' : ''}
							/>
						))}

						{archivedProjects?.length > 0 && (
							<Accordion
								title={
									<div className="flex items-center gap-1">
										<Icon
											name={isOpenForParent ? 'folder_open' : 'folder'}
											fill={0}
											customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
										/>
										<Icon
											name={'folder_off'}
											fill={0}
											customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
										/>
										<div>Archived</div>
									</div>
								}
								setIsOpenForParent={setIsOpenForParent}
							>
								<div className="pl-4">
									{archivedProjects.map((project) => (
										<CheckboxMultiSelectForUrl
											key={project.id}
											project={project}
											chosenColorObj={chosenColorObj}
											nextLightestColorObj={nextLightestColorObj}
											commaSeparatedObj={projectsTodoistFromUrlById}
											updateQueryParams={updateQueryParams}
											urlQueryParamName={'projects-todoist'}
											nameParentheses={isFromQLinkAccount(project) ? ' (Q Link)' : ''}
										/>
									))}
								</div>
							</Accordion>
						)}
					</div>
				</div>
			</Accordion>
		</div>
	);
};

export default ProjectsTodoistSection;
