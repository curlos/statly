import { useState, useEffect, useRef } from 'react';
import { debounce, secondsToHoursAndMinutes } from '../../utils/helpers.utils';
import CustomInput from '../CustomInput';
import Spinner from '../Loaders/Spinner';

const GoalSecondsInput = ({ defaultValue, customDateKey = null, ringId, handleUpdateRingSetting, customDailyFocusGoal = {} }: {
	defaultValue: number;
	customDateKey?: string | null;
	ringId: string;
	handleUpdateRingSetting: (ringId: string, property: string, value: number | Record<string, number>) => Promise<void>;
	customDailyFocusGoal?: Record<string, number>;
}) => {
	const { hours: defaultHours, minutes: defaultMinutes } = secondsToHoursAndMinutes(defaultValue);

	const [hours, setHours] = useState<number | string>(defaultHours);
	const [minutes, setMinutes] = useState<number | string>(defaultMinutes);
	const [errorMessage, setErrorMessage] = useState('');
	const [apiRequestLoading, setApiRequestLoading] = useState(false);
	const isFirstRender = useRef(true);

	const getErrorMessage = () => {
		if (hours === '' || minutes === '') {
			return 'Invalid input.';
		} else if (isNaN(Number(hours)) || isNaN(Number(minutes))) {
			return 'Input must be a number.';
		} else if (Number(hours) < 0 || Number(minutes) < 0) {
			return 'Values must be positive.';
		} else if (Number(hours) > 23) {
			return 'Hours must be less than or equal to 23.';
		} else if (Number(minutes) > 59) {
			return 'Minutes must be less than or equal to 59.';
		}

		return '';
	};

	const handleDebouncedUpdate = debounce(async () => {
		// Convert hours and minutes to seconds
		const newGoalSeconds = (Number(hours) * 3600) + (Number(minutes) * 60);

		// Don't send API call if value hasn't changed from default
		if (newGoalSeconds === defaultValue) {
			return;
		}

		const errorMessage = getErrorMessage();
		const isThereAnError = errorMessage;

		if (isThereAnError) {
			setErrorMessage(errorMessage);
			return;
		}

		setErrorMessage('');

		setApiRequestLoading(true);

		if (customDateKey) {
			// Update custom daily focus goal for the ring
			// Merge with existing customDailyFocusGoal
			await handleUpdateRingSetting(ringId, 'customDailyFocusGoal', {
				...customDailyFocusGoal,
				[customDateKey]: newGoalSeconds,
			});
		} else {
			// Update default goalSeconds for the ring
			await handleUpdateRingSetting(ringId, 'goalSeconds', newGoalSeconds);
		}

		setApiRequestLoading(false);
	}, 1000);

	useEffect(() => {
		// Skip API call on mount - only run when hours/minutes actually change
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		handleDebouncedUpdate();

		return () => {
			handleDebouncedUpdate.cancel();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hours, minutes]);

	return (
		<div>
			<div role="group" aria-label="Duration" className="flex gap-2 mt-1 mb-1 ml-1 items-center">
				<div className="flex items-center gap-2">
					<div className="max-w-[50px]">
						<CustomInput value={hours} setValue={setHours} type="number" min={0} max={23} ariaLabel="Hours" />
					</div>
					<div aria-hidden="true">hours</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="max-w-[50px]">
						<CustomInput value={minutes} setValue={setMinutes} type="number" min={0} max={59} ariaLabel="Minutes" />
					</div>
					<div aria-hidden="true">minutes</div>
				</div>
				{apiRequestLoading && <Spinner />}
			</div>
			<div role="alert" aria-live="polite" className="text-[14px] text-red-500">
				{errorMessage}
			</div>
		</div>
	);
};

export default GoalSecondsInput;
