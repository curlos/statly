import Icon from '../Icon';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useState } from 'react';
import GeneralSelectButtonAndDropdown from '../../pages/stats/StatsPage/GeneralSelectButtonAndDropdown';
import FormPickDateRange from '../FormPickDateRange';
import { useEditUserSettingsMutation } from '../../services/resources/userSettingsApi';
import Tooltip from '../Tooltip';

const DefaultDateRangeInterval = () => {
	const {
		defaultDateRangeInterval,
		defaultCustomStartDate,
	} = useUserSettingsContext();

	const { chosenColorObj } = useThemeContext();

	const [editUserSettings] = useEditUserSettingsMutation();

	const selectedIntervalOptions = ['Day', 'Week', 'Month', 'Year', 'All', 'Custom'];
	const [isDropdownOpenForParent, setIsDropdownOpenForParent] = useState(false);
	const [startDate, setStartDate] = useState(defaultCustomStartDate && defaultCustomStartDate !== '' ? new Date(defaultCustomStartDate) : new Date());

	const handleIntervalChange = (newInterval: string) => {
		const payload = {
			defaultDateRangeInterval: newInterval,
		};
		editUserSettings(payload).unwrap();
	};

	const handleCustomStartDateChange = (newStartDate: Date | null) => {
		if (newStartDate) {
			setStartDate(newStartDate);

			const payload = {
				defaultCustomStartDate: newStartDate.toISOString(),
			};
			editUserSettings(payload).unwrap();
		}
	};

	return (
		<div>
			<div className="flex items-center gap-1 mb-3">
				<h2 className="text-[20px] font-bold">Default Date Range Interval</h2>
				<Icon
					name="date_range"
					fill={0}
					customClass={`!text-[20px] cursor-pointer ${chosenColorObj.textColor}`}
				/>
				<Tooltip
					content="Automatically filters data across all pages by your chosen time range (Day, Week, Month, Year, All, or Custom). For example, selecting 'Year' shows only this year's data on every page, keeping stats relevant and focused."
					position="top"
					className="!w-[200px]"
				>
					<Icon
						name="help_outline"
						fill={0}
						customClass="!text-[18px] text-color-gray-100 hover:text-white cursor-help mt-[7px]"
					/>
				</Tooltip>
			</div>
			<div className="flex">
				<div>
					<GeneralSelectButtonAndDropdown
						selected={defaultDateRangeInterval}
						setSelected={handleIntervalChange}
						selectedOptions={selectedIntervalOptions}
						isDropdownOpenForParent={isDropdownOpenForParent}
						setIsDropdownOpenForParent={setIsDropdownOpenForParent}
					/>
				</div>
			</div>

			{defaultDateRangeInterval === 'Custom' && (
				<div className="mt-3">
					<h3 className="text-[14px] font-bold">Custom Start Date</h3>
					<p className="text-[14px] text-color-gray-50 mt-1 mb-2">Data from this date to today</p>
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
		</div>
	);
};

export default DefaultDateRangeInterval;
