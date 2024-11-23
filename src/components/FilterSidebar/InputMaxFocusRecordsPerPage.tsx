import { useState, useEffect } from 'react';
import { debounce } from '../../utils/focus-apps/helpers.utils';
import CustomInput from '../CustomInput';
import Spinner from '../Loaders/Spinner';

const InputMaxFocusRecordsPerPage = ({ maxFocusRecordsPerPage, handleError, userSettings, editUserSettings }) => {
	const [localMaxFocusRecordsPerPage, setLocalMaxFocusRecordsPerPage] = useState(maxFocusRecordsPerPage);
	const [errorMessage, setErrorMessage] = useState('');
	const [apiRequestLoading, setApiRequestLoading] = useState(false);

	const getErrorMessage = () => {
		if (!localMaxFocusRecordsPerPage) {
			return 'Invalid input.';
		} else if (isNaN(localMaxFocusRecordsPerPage)) {
			return 'Input must be a number.';
		} else if (Number(localMaxFocusRecordsPerPage) < 5) {
			return 'Number must be greater than or equal to 5.';
		} else if (Number(localMaxFocusRecordsPerPage) > 100) {
			return 'Number must be less than or equal to 100.';
		}

		return '';
	};

	const handleDebouncedUpdate = debounce(() => {
		const errorMessage = getErrorMessage();
		const isThereAnError = errorMessage;

		if (isThereAnError) {
			setErrorMessage(errorMessage);
			return;
		}

		setErrorMessage('');

		const restOfFocusRecordsKeysAndVals = userSettings?.tickTickOne?.pages?.focusRecords;
		const currentMaxFocusRecordsPerPage = restOfFocusRecordsKeysAndVals?.maxFocusRecordsPerPage;

		if (currentMaxFocusRecordsPerPage === localMaxFocusRecordsPerPage) {
			return;
		}

		handleError(async () => {
			const payload = {
				tickTickOne: {
					pages: {
						focusRecords: {
							...restOfFocusRecordsKeysAndVals,
							maxFocusRecordsPerPage: localMaxFocusRecordsPerPage,
						},
					},
				},
			};

			setApiRequestLoading(true);
			await editUserSettings(payload).unwrap();
			setApiRequestLoading(false);
		});
	}, 1000);

	useEffect(() => {
		handleDebouncedUpdate();

		return () => {
			handleDebouncedUpdate.cancel();
		};
	}, [localMaxFocusRecordsPerPage]);

	return (
		<div>
			<div className="flex gap-2 mt-1 mb-1 ml-1">
				<div className="max-w-[50px]">
					<CustomInput
						value={localMaxFocusRecordsPerPage}
						setValue={setLocalMaxFocusRecordsPerPage}
						type="number"
						min={5}
						max={100}
					/>
				</div>
				<div className="flex items-center gap-1">
					<div>Max Focus Records Per Page</div>
					{apiRequestLoading && <Spinner />}
				</div>
			</div>
			{errorMessage && <div className="text-[14px] text-red-500">{errorMessage}</div>}
		</div>
	);
};

export default InputMaxFocusRecordsPerPage;
