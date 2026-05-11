import { useEffect, useState, useCallback } from 'react';
import Dropdown from '../Dropdown';
import classNames from 'classnames';
import InfiniteScrollSelector from '../../InfiniteScrollSelector';
import { useThemeContext } from '../../../contexts/useThemeContext';

interface DropdownTimeProps {
	toggleRef: React.RefObject<HTMLElement>;
	isVisible: boolean;
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	selectedTime: string;
	setSelectedTime: (time: string) => void;
	customClasses?: string;
}

const DropdownTime: React.FC<DropdownTimeProps> = ({ toggleRef, isVisible, setIsVisible, selectedTime, setSelectedTime, customClasses }) => {
	const defaultTime = extractTimeDetails(selectedTime);

	const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
	const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
	const periods = ['AM', 'PM'];

	const [selectedHour, setSelectedHour] = useState(defaultTime.hours);
	const [selectedMinute, setSelectedMinute] = useState(defaultTime.minutes);
	const [selectedPeriod, setSelectedPeriod] = useState(defaultTime.period);

	const handleTimeSelection = useCallback(() => {
		let time = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;

		if (!selectedHour || !selectedMinute || !selectedPeriod) {
			time = '';
		}

		setSelectedTime(time);
	}, [selectedHour, selectedMinute, selectedPeriod, setSelectedTime]);

	useEffect(() => {
		handleTimeSelection();
	}, [handleTimeSelection]);

	const { chosenColorObj } = useThemeContext();

	return (
		<Dropdown
			toggleRef={toggleRef}
			isVisible={isVisible}
			setIsVisible={setIsVisible}
			customClasses={classNames('ml-[-5px] shadow-2xl border border-color-gray-100 rounded-[4px]', customClasses)}
		>
			<div className="w-[260px] p-1">
				<div className="grid grid-cols-3">
					<InfiniteScrollSelector
						items={hours}
						unit="hour"
						selectedValue={selectedHour}
						setSelectedValue={setSelectedHour}
					/>
					<InfiniteScrollSelector
						items={minutes}
						unit="minute"
						selectedValue={selectedMinute}
						setSelectedValue={setSelectedMinute}
					/>
					<div className="flex flex-col">
						{periods.map((period) => (
							<button
								key={period}
								type="button"
								aria-pressed={selectedPeriod === period}
								className={classNames(
									'text-center py-2 rounded cursor-pointer w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
									selectedPeriod === period
										? chosenColorObj.bgColor
										: `bg-transparent ${chosenColorObj.hover.bgColorHalfOpacity}`
								)}
								onClick={() => setSelectedPeriod(period)}
							>
								{period}
							</button>
						))}
					</div>
				</div>
			</div>
		</Dropdown>
	);
};

export default DropdownTime;

const extractTimeDetails = (timeStr: string) => {
	if (!timeStr) {
		return {
			hours: '',
			minutes: '',
			period: '',
		};
	}

	const [time, period] = timeStr.split(' ');
	const [hours, minutes] = time.split(':');

	return {
		hours: String(hours),
		minutes: minutes ? String(minutes).padStart(2, '0') : '',
		period: period,
	};
};
