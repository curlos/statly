import { useState, useEffect, useRef } from 'react';
import { debounce } from '../../utils/helpers.utils';
import CustomInput from '../CustomInput';
import Spinner from '../Loaders/Spinner';
import type { UserSettings } from '../../types/api';

const InputNumUserSettings = ({
	defaultValue,
	userSettings,
	editUserSettings,
	minNum = 5,
	maxNum = 100,
	name,
	page,
	inputMaxWidth = 'w-[50px]',
	ringId = null,
	handleUpdateRingSetting = null,
	pageLevel = false,
	pageProperty = undefined,
	currentPageValue = undefined,
	handleUpdateUserSettingForPage = undefined,
}: {
	defaultValue: number;
	userSettings: UserSettings;
	editUserSettings: (payload: Partial<UserSettings>) => Promise<unknown>;
	minNum?: number;
	maxNum?: number;
	name: string;
	page: string;
	inputMaxWidth?: string;
	ringId?: string | null;
	handleUpdateRingSetting?: ((ringId: string, property: string, value: number) => Promise<void>) | null;
	pageLevel?: boolean;
	pageProperty?: string;
	currentPageValue?: Record<string, unknown>;
	handleUpdateUserSettingForPage?: (page: string, property: string, value: unknown) => Promise<void>;
}) => {
	const [localValue, setLocalValue] = useState(defaultValue);
	const [errorMessage, setErrorMessage] = useState('');
	const [apiRequestLoading, setApiRequestLoading] = useState(false);
	const isFirstRender = useRef(true);

	const getErrorMessage = () => {
		if (!localValue) {
			return 'Invalid input.';
		} else if (isNaN(localValue)) {
			return 'Input must be a number.';
		} else if (Number(localValue) < minNum) {
			return `Number must be greater than or equal to ${minNum}.`;
		} else if (Number(localValue) > maxNum) {
			return `Number must be less than or equal to ${maxNum}.`;
		}

		return '';
	};

	const getPayload = () => {
		let payload = null;

		if (page === 'focus-records-page') {
			const restOfFocusRecordsKeysAndVals = userSettings?.pages?.focusRecords;
			const currentMaxFocusRecordsPerPage = restOfFocusRecordsKeysAndVals?.maxFocusRecordsPerPage;

			if (currentMaxFocusRecordsPerPage === localValue) {
				return;
			}

			const restOfPagesKeysAndVals = userSettings?.pages;

			payload = {
				pages: {
					...restOfPagesKeysAndVals,
					focusRecords: {
						...restOfFocusRecordsKeysAndVals,
						maxFocusRecordsPerPage: localValue,
					},
				},
			};
		} else if (page === 'completed-tasks-page') {
			const restOfCompletedTasksPageKeysAndVals = userSettings?.pages?.completedTasks;
			const currentMaxDaysPerPage = restOfCompletedTasksPageKeysAndVals?.maxDaysPerPage;

			if (currentMaxDaysPerPage === localValue) {
				return;
			}

			const restOfPagesKeysAndVals = userSettings?.pages;

			payload = {
				pages: {
					...restOfPagesKeysAndVals,
					completedTasks: {
						...restOfCompletedTasksPageKeysAndVals,
						maxDaysPerPage: localValue,
					},
				},
			};
		} else if (page === 'focus-hours-goal-page') {
			// This case is now handled by ring-specific updates via handleUpdateRingSetting
			// No need to update user settings directly for focus-hours-goal-page
			return;
		}

		return payload;
	};

	const handleDebouncedUpdate = debounce(async () => {
		// Don't send API call if value hasn't changed from default
		if (localValue === defaultValue) {
			return;
		}

		const errorMessage = getErrorMessage();
		const isThereAnError = errorMessage;

		if (isThereAnError) {
			setErrorMessage(errorMessage);
			return;
		}

		setErrorMessage('');

		// If page-level update for combined settings
		if (pageLevel && page === 'focus-hours-goal-page' && pageProperty && handleUpdateUserSettingForPage && currentPageValue) {
			setApiRequestLoading(true);
			await handleUpdateUserSettingForPage(
				'focusHoursGoal',
				pageProperty,
				{
					...currentPageValue,
					goalDays: localValue
				}
			);
			setApiRequestLoading(false);
			return;
		}

		// If ring-specific update is provided for focus-hours-goal-page
		if (page === 'focus-hours-goal-page' && ringId && handleUpdateRingSetting) {
			setApiRequestLoading(true);
			await handleUpdateRingSetting(ringId, 'goalDays', localValue);
			setApiRequestLoading(false);
			return;
		}

		if (page === 'focus-records-page' || page === 'completed-tasks-page' || page === 'focus-hours-goal-page') {
			const payload = getPayload();

			if (!payload) {
				return;
			}

			setApiRequestLoading(true);
			await editUserSettings(payload);
			setApiRequestLoading(false);
		}
	}, 1000);

	useEffect(() => {
		// Skip API call on mount - only run when localValue actually changes
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		handleDebouncedUpdate();

		return () => {
			handleDebouncedUpdate.cancel();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [localValue]);

	return (
		<div>
			<div className="flex gap-2 mt-1 mb-1 ml-1">
				<div>
					<CustomInput
						value={localValue}
						setValue={setLocalValue as React.Dispatch<React.SetStateAction<string | number>>}
						type="number"
						min={minNum}
						max={maxNum}
						customClasses={inputMaxWidth}
					/>
				</div>
				<div className="flex items-center gap-1">
					<div>{name}</div>
					{apiRequestLoading && <Spinner />}
				</div>
			</div>
			{errorMessage && <div className="text-[14px] text-red-500">{errorMessage}</div>}
		</div>
	);
};

export default InputNumUserSettings;
