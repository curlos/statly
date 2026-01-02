import { useEffect, useState, useRef } from 'react';
import Accordion from '../Accordion/Accordion';
import FormPickDateRange from '../FormPickDateRange';
import Icon from '../Icon';
import { useSearchParamsContext } from '../../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay, getAllDaysInRange } from '../../utils/date.utils';
import GeneralSelectButtonAndDropdown from '../../pages/stats/StatsPage/GeneralSelectButtonAndDropdown';
import DateRangePicker from '../../pages/stats/StatsPage/FocusSection/DateRangePicker';
import { useThemeContext } from '../../contexts/useThemeContext';
import classNames from 'classnames';
import { usePageContext } from 'vike-react/usePageContext';
import Tooltip from '../Tooltip';

type IntervalOption = 'Day' | 'Week' | 'Month' | 'Year' | 'All' | 'Custom';

const DateRangeSection = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const startDateFromUrl = searchParams.get('start-date');
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const intervalFromUrl = searchParams.get('date-interval') || 'All';
	const yearAgnosticFromUrl = searchParams.get('year-agnostic') === 'true';
	const [isDropdownOpenForParent, setIsDropdownOpenForParent] = useState<boolean>(false);

	const [startDate, setStartDate] = useState<Date>(startDateFromUrl ? new Date(startDateFromUrl) : new Date());
	const [endDate, setEndDate] = useState<Date>(new Date(endDateFromUrl));
	const selectedIntervalOptions: IntervalOption[] = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
	const [selectedInterval, setSelectedInterval] = useState<string>(intervalFromUrl);
	const [selectedDates, setSelectedDates] = useState<Date[]>([startDate]);
	const [isInitialMount, setIsInitialMount] = useState<boolean>(true);
	const prevIntervalRef = useRef<string>(intervalFromUrl);

	useEffect(() => {
		// When switching TO Custom, populate start/end dates from selectedDates
		const previousInterval = prevIntervalRef.current;
		const switchingToCustom = previousInterval !== 'Custom' && selectedInterval === 'Custom';

		if (switchingToCustom && selectedDates.length > 0) {
			const newStartDate = selectedDates[0];
			const newEndDate = selectedDates[selectedDates.length - 1];
			// Update start/end dates immediately for Custom interval
			setStartDate(newStartDate);
			setEndDate(newEndDate);
			// Directly update selectedDates to the full range to avoid timing issues
			setSelectedDates(getAllDaysInRange(newStartDate, newEndDate));
		}

		prevIntervalRef.current = selectedInterval;

		// Update URL params
		if (isInitialMount) {
			setIsInitialMount(false);
			return;
		}

		const newStartDate =
			selectedInterval === 'All'
				? ''
				: getFormattedShortMonthDay(selectedDates[0] ? selectedDates[0] : new Date());
		const newEndDate =
			selectedInterval === 'All'
				? ''
				: getFormattedShortMonthDay(
						selectedDates[selectedDates.length - 1] ? selectedDates[selectedDates.length - 1] : new Date()
					);
		const newInterval = selectedInterval === 'All' ? '' : selectedInterval;

		// Clear year-agnostic when switching to 'All' or 'Year' intervals
		const shouldClearYearAgnostic = selectedInterval === 'All' || selectedInterval === 'Year';

		const params: Record<string, string> = {
			'start-date': newStartDate,
			'end-date': newEndDate,
			'date-interval': newInterval,
			page: '',
		};

		if (shouldClearYearAgnostic) {
			params['year-agnostic'] = '';
		}

		updateQueryParams(params);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedDates, selectedInterval]);

	// Compute the correct dates to display in FormPickDateRange
	// For Custom mode, read from URL to get the actual current values (handles form edits)
	// For other modes switching TO Custom, use selectedDates for immediate population
	const pageContext = usePageContext();
	const urlSearchParams = pageContext.urlParsed.search || {};

	const displayStartDate = selectedInterval === 'Custom' && urlSearchParams['start-date']
		? new Date(urlSearchParams['start-date'])
		: (selectedInterval === 'Custom' && selectedDates.length > 0 ? selectedDates[0] : startDate);

	const displayEndDate = selectedInterval === 'Custom' && urlSearchParams['end-date']
		? new Date(urlSearchParams['end-date'])
		: (selectedInterval === 'Custom' && selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : endDate);

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Date Range</h3>
						<Icon
							name="date_range"
							fill={0}
							customClass={`${chosenColorObj.textColor} !text-[20px] hover:text-white cursor-pointer`}
						/>
					</div>
				}
				openByDefault={true}
				isChildDropdownOpen={true}
			>
				<div className="flex items-center gap-4 mb-3">
					<div>
						<GeneralSelectButtonAndDropdown
							selected={selectedInterval}
							setSelected={setSelectedInterval}
							selectedOptions={selectedIntervalOptions}
							isDropdownOpenForParent={isDropdownOpenForParent}
							setIsDropdownOpenForParent={setIsDropdownOpenForParent}
						/>
					</div>

					<div className="flex-1">
						<div className={selectedInterval === 'All' || selectedInterval === 'Custom' ? 'hidden' : ''}>
							<DateRangePicker
								selectedDates={selectedDates}
								setSelectedDates={setSelectedDates}
								selectedInterval={selectedInterval}
								startDate={startDate}
								endDate={endDate}
							/>
						</div>
					</div>
				</div>

				{selectedInterval === 'Custom' && (
					<FormPickDateRange
						{...{
							startDate: displayStartDate,
							setStartDate,
							endDate: displayEndDate,
							setEndDate,
							confirmBeforeUpdating: false,
							onUpdateStartOrEndDate: (newStartDate, newEndDate) => {
								if (newStartDate) {
									setStartDate(newStartDate);
								} else if (newEndDate) {
									setEndDate(newEndDate);
								}
							},
							isDropdownCalendarOpenForParent: isDropdownOpenForParent,
							setIsDropdownCalendarOpenForParent: setIsDropdownOpenForParent,
							showTime: true,
						}}
					/>
				)}

				{selectedInterval !== 'All' && selectedInterval !== 'Year' && (
					<div
						className="flex items-center gap-1 mt-3 cursor-pointer"
						onClick={() => {
							updateQueryParams({ 'year-agnostic': yearAgnosticFromUrl ? '' : 'true', page: '' });
						}}
					>
						<Icon
							name={yearAgnosticFromUrl ? 'check_box' : 'check_box_outline_blank'}
							fill={1}
							customClass={classNames(
								'!text-[22px]',
								chosenColorObj.textColor,
								nextLightestColorObj?.hover.textColor
							)}
						/>
						<div className="flex-1 flex items-center gap-2">
						<span>Year-Agnostic</span>
						<Tooltip
							content="When unchecked, filters by exact dates (e.g., only Dec 25, 2025). When checked, filters by month and day across all years (e.g., every Dec 25 regardless of year)."
							position="bottom"
							className="!w-[280px]"
						>
							<div className="mt-1">
								<Icon
									name="help_outline"
									fill={0}
									customClass="!text-[18px] text-color-gray-100 hover:text-white cursor-help"
								/>
							</div>
						</Tooltip>
					</div>
					</div>
				)}
			</Accordion>
		</div>
	);
};

export default DateRangeSection;
