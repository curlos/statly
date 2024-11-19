import Icon from '../../../../components/Icon';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import Accordion from '../../../../components/Accordion/Accordion';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { getCommaSeparatedObj } from '../../../../utils/focus-apps/helpers.utils';

const ShowRecordsFromFocusAppSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const focusAppsFromUrl = searchParams.get('focus-apps');
	const focusAppsByName = getCommaSeparatedObj(focusAppsFromUrl);

	const focusApps = [
		{
			id: 'TickTick',
			name: 'TickTick',
		},
		{
			id: 'session-app',
			name: 'Session',
		},
		{
			id: 'be-focused-app',
			name: 'BeFocused',
		},
		{
			id: 'forest-app',
			name: 'Forest',
		},
		{
			id: 'tide-ios-app',
			name: 'Tide',
		},
	];

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Show Records From Focus App</h3>
						<Icon
							name="app_blocking"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
			>
				{Object.values(focusApps).map((focusApp) => {
					return (
						<CheckboxMultiSelectForUrl
							key={focusApp.id}
							{...{
								chosenColorObj,
								nextLightestColorObj,
								commaSeparatedObj: focusAppsByName,
								updateQueryParams,
								urlQueryParamName: 'focus-apps',
								checkboxId: focusApp.id,
								checkboxName: focusApp.name,
							}}
						/>
					);
				})}
			</Accordion>
		</div>
	);
};

export default ShowRecordsFromFocusAppSection;
