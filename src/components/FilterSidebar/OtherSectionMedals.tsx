import Icon from '../Icon';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import { useState } from 'react';
import GeneralSelectButtonAndDropdown from '../../pages/stats/StatsPage/GeneralSelectButtonAndDropdown';
import FormPickDateRange from '../FormPickDateRange';

const OtherSectionMedals = () => {
	const {
		medalsPageSettings: { defaultMedalInterval, customMedalStartDate },
		handleUpdateUserSettingForPage,
	} = useUserSettingsContext();

	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
	const [isDropdownOpenForParent, setIsDropdownOpenForParent] = useState(false);
	const [startDate, setStartDate] = useState(customMedalStartDate && customMedalStartDate !== '' ? new Date(customMedalStartDate) : new Date());

	const handleIntervalChange = (newInterval) => {
		handleUpdateUserSettingForPage('medals', 'defaultMedalInterval', newInterval);
	};

	const handleCustomStartDateChange = (newStartDate) => {
		if (newStartDate) {
			setStartDate(newStartDate);
			handleUpdateUserSettingForPage('medals', 'customMedalStartDate', newStartDate.toISOString());
		}
	};

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1">
						<h3 className="text-[16px] font-bold">Other</h3>
						<Icon
							name="other_admission"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
				isChildDropdownOpen={isDropdownOpenForParent}
			>
				<h4 className="text-[16px] font-normal mb-2">Default Medal Interval</h4>
				<div className="flex">
					<div>
						<GeneralSelectButtonAndDropdown
							selected={defaultMedalInterval}
							setSelected={handleIntervalChange}
							selectedOptions={selectedIntervalOptions}
							isDropdownOpenForParent={isDropdownOpenForParent}
							setIsDropdownOpenForParent={setIsDropdownOpenForParent}
						/>
					</div>
				</div>

				{defaultMedalInterval === 'Custom' && (
					<div className="mt-3">
						<h4 className="text-[14px] font-bold">Custom Start Date</h4>
						<p className="text-[14px] text-color-gray-50 mt-1 mb-2">Medals from this date to today</p>
						<FormPickDateRange
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={new Date()}
							setEndDate={() => {}}
							confirmBeforeUpdating={false}
							onUpdateStartOrEndDate={handleCustomStartDateChange}
							isDropdownCalendarOpenForParent={isDropdownOpenForParent}
							setIsDropdownCalendarOpenForParent={setIsDropdownOpenForParent}
							hideEndDate={true}
						/>
					</div>
				)}
			</Accordion>
		</div>
	);
};

export default OtherSectionMedals;
