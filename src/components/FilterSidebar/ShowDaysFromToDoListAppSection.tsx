import Icon from '../Icon';
import { useThemeContext } from '../../contexts/useThemeContext';
import Accordion from '../Accordion/Accordion';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { getCommaSeparatedObj } from '../../utils/focus-apps/helpers.utils';
import { TO_DO_LIST_APPS } from '../../utils/constants/constants.utils';

const ShowDaysFromToDoListAppSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const toDoListAppsFromUrl = searchParams.get('to-do-list-apps');
	const toDoListAppsByName = getCommaSeparatedObj(toDoListAppsFromUrl);

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Show Days From To-Do List App</h3>
						<Icon
							name="app_blocking"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
			>
				{Object.values(TO_DO_LIST_APPS).map((toDoListApp) => {
					return (
						<CheckboxMultiSelectForUrl
							key={toDoListApp.id}
							{...{
								chosenColorObj,
								nextLightestColorObj,
								commaSeparatedObj: toDoListAppsByName,
								updateQueryParams,
								urlQueryParamName: 'to-do-list-apps',
								checkboxId: toDoListApp.id,
								checkboxName: toDoListApp.name,
							}}
						/>
					);
				})}
			</Accordion>
		</div>
	);
};

export default ShowDaysFromToDoListAppSection;
