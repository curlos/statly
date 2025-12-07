import Icon from '../Icon';
import { useThemeContext } from '../../contexts/useThemeContext';
import Accordion from '../Accordion/Accordion';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { getCommaSeparatedObj } from '../../utils/focus-apps/helpers.utils';
import { FOCUS_APPS } from '../../utils/constants/constants.utils';

const ShowRecordsFromFocusAppSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const focusAppsFromUrl = searchParams.get('focus-apps');
	const focusAppsByName = getCommaSeparatedObj(focusAppsFromUrl);

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Show Records From Focus App</h3>
						<Icon
							name="timer"
							fill={0}
							customClass={`${chosenColorObj.textColor} !text-[20px] hover:text-white cursor-pointer`}
						/>
					</div>
				}
				openByDefault={true}
			>
				{Object.values(FOCUS_APPS).map((focusApp) => {
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
