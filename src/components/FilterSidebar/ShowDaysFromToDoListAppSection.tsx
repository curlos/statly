import Icon from '../Icon';
import { useThemeContext } from '../../contexts/useThemeContext';
import Accordion from '../Accordion/Accordion';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { getCommaSeparatedObj } from '../../utils/helpers.utils';
import { TO_DO_LIST_APPS } from '../../utils/constants/constants.utils';
import { useGetSourceCountsQuery } from '../../services/resources/statsApi';

const ShowDaysFromToDoListAppSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const toDoListAppsFromUrl = searchParams.get('to-do-list-apps');
	const toDoListAppsByName = getCommaSeparatedObj(toDoListAppsFromUrl ?? undefined);
	const { data: sourceCounts } = useGetSourceCountsQuery();

	// Filter to only show apps with data
	const toDoListAppsWithData = Object.values(TO_DO_LIST_APPS).filter(
		(toDoListApp) => (sourceCounts?.[toDoListApp.source] ?? 0) > 0
	);

	// Don't render section if no apps have data
	if (toDoListAppsWithData.length === 0) {
		return null;
	}

	return (
		<div>
			<hr className="border-color-gray-200 my-4" />
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Show Days From To-Do List App</h3>
						<Icon
							name="check_box"
							fill={0}
							customClass={`${chosenColorObj.textColor} !text-[20px] hover:text-white cursor-pointer`}
						/>
					</div>
				}
				openByDefault={true}
			>
				{toDoListAppsWithData.map((toDoListApp) => {
					return (
						<CheckboxMultiSelectForUrl
							key={toDoListApp.id}
							chosenColorObj={chosenColorObj}
							nextLightestColorObj={nextLightestColorObj}
							commaSeparatedObj={toDoListAppsByName}
							updateQueryParams={updateQueryParams}
							urlQueryParamName={'to-do-list-apps'}
							checkboxId={toDoListApp.id}
							checkboxName={toDoListApp.name}
						/>
					);
				})}
			</Accordion>
		</div>
	);
};

export default ShowDaysFromToDoListAppSection;
