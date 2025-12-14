import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../contexts/useThemeContext';
import Accordion from '../Accordion/Accordion';
import Spinner from '../Loaders/Spinner';
import { getCommaSeparatedObj } from '../../utils/helpers.utils';
import { useGetProjectsQuery } from '../../services/resources/projectsApi';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';

/**
 * @description Displays all of the "Categories" from "Session App" to check or uncheck whether we should filter by a category.
 */
const CategoriesSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const categoriesFromUrl = searchParams.get('categories');

	// RTK Query - Session Projects
	const { data: fetchedProjects, isLoading: isLoadingGetProjects } = useGetProjectsQuery();
	const { projectsSession } = fetchedProjects || {};

	const categoriesFromUrlById = getCommaSeparatedObj(categoriesFromUrl);
	const sessionCategories = projectsSession

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Categories (Session App)</h3>
						<Icon
							name="construction"
							fill={0}
							customClass={`${chosenColorObj.textColor} !text-[20px] hover:text-white cursor-pointer`}
						/>
						{isLoadingGetProjects && <Spinner />}
					</div>
				}
				openByDefault={true}
			>
				<div>
					<div className="space-y-2">
						{sessionCategories?.map((category) => {
							return (
								<CheckboxMultiSelectForUrl
									key={category.id}
									{...{
										project: category,
										chosenColorObj,
										nextLightestColorObj,
										commaSeparatedObj: categoriesFromUrlById,
										updateQueryParams,
										urlQueryParamName: 'categories',
									}}
								/>
							);
						})}
					</div>
				</div>
			</Accordion>
		</div>
	);
};

export default CategoriesSection;
