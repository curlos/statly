import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useEffect, useState } from 'react';
import Accordion from '../Accordion/Accordion';
import Spinner from '../Loaders/Spinner';
import { getCommaSeparatedObj } from '../../utils/focus-apps/helpers.utils';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';
import { useGetProjectsQuery } from '../../services/resources/documentsProjectsApi';

/**
 * @description Displays all of the ungrouped, grouped, and archived projects. All of the projects present here have a checkbox that can be clicked to filter the list of focus records by the selected projects.
 */
const ProjectsTodoistSection = () => {
	// RTK Query - Todoist - Projects
	const { data: fetchedProjects } = useGetProjectsQuery();
	const { projectsTodoist } = fetchedProjects || {};

	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const projectsTodoistFromUrl = searchParams.get('projects-todoist');

	const projectsTodoistFromUrlById = getCommaSeparatedObj(projectsTodoistFromUrl);

	const [activeProjects, setActiveProjects] = useState([]);
	const [archivedProjects, setArchivedProjects] = useState([]);

	useEffect(() => {
		if (!projectsTodoist) {
			return;
		}

		const newActiveProjects = [];
		const newArchivedProjects = [];

		for (let project of projectsTodoist) {
			const { isInboxProject, isArchived } = project;

			if (!isInboxProject && isArchived) {
				newArchivedProjects.push(project);
			} else {
				newActiveProjects.push(project);
			}
		}

		setActiveProjects(newActiveProjects.toSorted((a, b) => a.order - b.order));
		setArchivedProjects(newArchivedProjects.toSorted((a, b) => a.order - b.order));
	}, [projectsTodoist]);

	const [isOpenForParent, setIsOpenForParent] = useState(false);

	const isFromQLinkAccount = (project) => {
		// Checks both the "sync" and "api/v1" ids for the "Inbox" and "Address" projects, the only two projects I actively used on my Q Link account.
		return (
			project.id === '2289588215' ||
			project.id === '2295853642' ||
			project.id == '6Hhh3pxXG5JF3gjc' ||
			project.id == '6JVxw766pXHWcXgv'
		);
	};

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Projects (Todoist)</h3>
						<Icon
							name="construction"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
						{/* Assume the user always has at least one project. I suppose it'd be possible for there to be 0 projects but this works better for me personally. */}
						{activeProjects.length === 0 || (archivedProjects.length === 0 && <Spinner />)}
					</div>
				}
				openByDefault={true}
			>
				<div>
					<div className="space-y-2">
						{activeProjects.map((project) => (
							<CheckboxMultiSelectForUrl
								key={project.id}
								{...{
									project,
									chosenColorObj,
									nextLightestColorObj,
									commaSeparatedObj: projectsTodoistFromUrlById,
									updateQueryParams,
									urlQueryParamName: 'projects-todoist',
									nameParentheses: isFromQLinkAccount(project) ? ' (Q Link)' : '',
								}}
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
											{...{
												project,
												chosenColorObj,
												nextLightestColorObj,
												commaSeparatedObj: projectsTodoistFromUrlById,
												updateQueryParams,
												urlQueryParamName: 'projects-todoist',
												// Not technically needed here since I have no archived projects from my Q Link account but keeping it for the sake of consistency. Could definitely be removed and nothing would change.
												nameParentheses: isFromQLinkAccount(project) ? ' (Q Link)' : '',
											}}
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
