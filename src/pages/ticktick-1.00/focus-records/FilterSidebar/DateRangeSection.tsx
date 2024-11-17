import { useState } from 'react';
import Accordion from '../../../../components/Accordion/Accordion';
import FormPickDateRange from '../../../../components/FormPickDateRange';
import Icon from '../../../../components/Icon';
import { useSearchParamsContext } from '../../../../contexts/useSearchParamsContext';
import { getFormattedShortMonthDay } from '../../../../utils/date.utils';

const DateRangeSection = () => {
	const { searchParams, updateQueryParams } = useSearchParamsContext();
	const startDateFromUrl = searchParams.get('start-date') || 'Nov 2, 2020';
	const endDateFromUrl = searchParams.get('end-date') || getFormattedShortMonthDay(new Date());
	const [isDropdownCalendarOpenForParent, setIsDropdownCalendarOpenForParent] = useState(false);

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Date Range</h3>
						<Icon
							name="diversity_2"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
				isChildDropdownOpen={isDropdownCalendarOpenForParent}
			>
				<FormPickDateRange
					{...{
						startDate: new Date(startDateFromUrl),
						setStartDate: (value) => {
							updateQueryParams({ 'start-date': value, page: '' });
						},
						endDate: new Date(endDateFromUrl),
						setEndDate: (value) => {
							updateQueryParams({ 'end-date': value, page: '' });
						},
						confirmBeforeUpdating: false,
						onUpdateStartOrEndDate: (newStartDate, newEndDate) => {
							if (newStartDate) {
								updateQueryParams({
									'start-date': getFormattedShortMonthDay(newStartDate),
									page: '',
								});
							} else if (newEndDate) {
								updateQueryParams({ 'end-date': getFormattedShortMonthDay(newEndDate), page: '' });
							}
						},
						isDropdownCalendarOpenForParent,
						setIsDropdownCalendarOpenForParent,
						showTime: true,
					}}
				/>
			</Accordion>
		</div>
	);
};

export default DateRangeSection;
