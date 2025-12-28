import Accordion from '../Accordion/Accordion';
import CheckboxMultiSelectForUrl from './CheckboxMultiSelectForUrl';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { useThemeContext } from '../../contexts/useThemeContext';
import { getCommaSeparatedObj } from '../../utils/helpers.utils';

const GENERAL_FILTERS = {
	WITH_NOTES: { id: 'with-notes', name: 'With Notes' },
	WITHOUT_NOTES: { id: 'without-notes', name: 'Without Notes' },
	POMODORO_MODE: { id: 'pomodoro-mode', name: 'Pomodoro Mode' },
	STOPWATCH_MODE: { id: 'stopwatch-mode', name: 'Stopwatch Mode' },
	CROSSES_MIDNIGHT: { id: 'crosses-midnight', name: 'Crosses Midnight' }
};

const GeneralFocusRecordsFilters = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const { searchParams, updateQueryParams } = useSearchParamsContext();

	const generalFromUrl = searchParams.get('general');
	const generalFiltersById = getCommaSeparatedObj(generalFromUrl ?? undefined);

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">General</h3>
					</div>
				}
				openByDefault={true}
				setIsOpenForParent={undefined}
				isChildDropdownOpen={false}
				showArrowNextToText={undefined}
				customClasses={undefined}
				customToggleOpen={undefined}
				preventOpen={false}
			>
				{Object.values(GENERAL_FILTERS).map((filter) => (
					<CheckboxMultiSelectForUrl
						key={filter.id}
						chosenColorObj={chosenColorObj}
						nextLightestColorObj={nextLightestColorObj}
						commaSeparatedObj={generalFiltersById}
						updateQueryParams={updateQueryParams}
						urlQueryParamName="general"
						checkboxId={filter.id}
						checkboxName={filter.name}
					/>
				))}
			</Accordion>
		</div>
	);
};

export default GeneralFocusRecordsFilters;
