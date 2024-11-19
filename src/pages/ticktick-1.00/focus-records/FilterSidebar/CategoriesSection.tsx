import Icon from '../../../../components/Icon';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import Accordion from '../../../../components/Accordion/Accordion';
import Spinner from '../../../../components/Loaders/Spinner';
import { getCommaSeparatedObj } from '../../../../utils/focus-apps/helpers.utils';
import { useGetSessionAppFocusRecordsQuery } from '../../../../services/resources/oldFocusAppsApi';
import CheckboxProject from './CheckboxProject';

/**
 * @description Displays all of the "Categories" from "Session App" to check or uncheck whether we should filter by a category.
 */
const CategoriesSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const categoriesFromUrl = searchParams.get('categories');

	// RTK Query - Session App - Focus Records
	const { data: fetchedSessionFocusRecords, isLoading: isLoadingGetSessionFocusRecords } =
		useGetSessionAppFocusRecordsQuery();
	const { sessionCategoriesById } = fetchedSessionFocusRecords || {};

	const categoriesFromUrlById = getCommaSeparatedObj(categoriesFromUrl);
	const sessionCategories = sessionCategoriesById && Object.values(sessionCategoriesById);

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Categories (Session App)</h3>
						<Icon
							name="construction"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
						{isLoadingGetSessionFocusRecords && <Spinner />}
					</div>
				}
				openByDefault={true}
			>
				<div>
					<div className="space-y-2">
						{sessionCategories?.map((category) => {
							return (
								<CheckboxProject
									key={category.id}
									{...{
										project: category,
										chosenColorObj,
										nextLightestColorObj,
										projectsFromUrlById: categoriesFromUrlById,
										updateQueryParams,
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
