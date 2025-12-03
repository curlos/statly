import { useState, useEffect } from 'react';
import { debounce } from '../../utils/focus-apps/helpers.utils';
import CustomInput from '../CustomInput';
import Spinner from '../Loaders/Spinner';

const InputNumUserSettings = ({
	defaultValue,
	userSettings,
	editUserSettings,
	minNum,
	maxNum,
	name,
	page,
}) => {
	const [localValue, setLocalValue] = useState(defaultValue);
	const [errorMessage, setErrorMessage] = useState('');
	const [apiRequestLoading, setApiRequestLoading] = useState(false);

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
			const restOfFocusRecordsKeysAndVals = userSettings?.tickTickOne?.pages?.focusRecords;
			const currentMaxFocusRecordsPerPage = restOfFocusRecordsKeysAndVals?.maxFocusRecordsPerPage;

			if (currentMaxFocusRecordsPerPage === localValue) {
				return;
			}

			const restOfPagesKeysAndVals = userSettings?.tickTickOne?.pages;

			payload = {
				tickTickOne: {
					pages: {
						...restOfPagesKeysAndVals,
						focusRecords: {
							...restOfFocusRecordsKeysAndVals,
							maxFocusRecordsPerPage: localValue,
						},
					},
				},
			};
		} else if (page === 'completed-tasks-page') {
			const restOfCompletedTasksPageKeysAndVals = userSettings?.tickTickOne?.pages?.completedTasks;
			const currentMaxDaysPerPage = restOfCompletedTasksPageKeysAndVals?.maxDaysPerPage;

			if (currentMaxDaysPerPage === localValue) {
				return;
			}

			const restOfPagesKeysAndVals = userSettings?.tickTickOne?.pages;

			payload = {
				tickTickOne: {
					pages: {
						...restOfPagesKeysAndVals,
						completedTasks: {
							...restOfCompletedTasksPageKeysAndVals,
							maxDaysPerPage: localValue,
						},
					},
				},
			};
		}

		return payload;
	};

	const handleDebouncedUpdate = debounce(async () => {
		const errorMessage = getErrorMessage();
		const isThereAnError = errorMessage;

		if (isThereAnError) {
			setErrorMessage(errorMessage);
			return;
		}

		setErrorMessage('');

		if (page === 'focus-records-page' || page === 'completed-tasks-page') {
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
		handleDebouncedUpdate();

		return () => {
			handleDebouncedUpdate.cancel();
		};
	}, [localValue]);

	return (
		<div>
			<div className="flex gap-2 mt-1 mb-1 ml-1">
				<div className="max-w-[50px]">
					<CustomInput value={localValue} setValue={setLocalValue} type="number" min={5} max={100} />
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
