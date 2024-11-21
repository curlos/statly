import classNames from 'classnames';
import Icon from '../Icon';
import useHandleError from '../../hooks/useHandleError';
import { useThemeContext } from '../../contexts/useThemeContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../services/resources/userSettingsApi';
import Accordion from '../Accordion/Accordion';
import { useUserSettingsContext } from '../../pages/ticktick-1.00/focus-records/useUserSettingsContext';
import CustomInput from '../CustomInput';
import { debounce } from '../../utils/focus-apps/helpers.utils';
import { useEffect, useState } from 'react';
import Spinner from '../Loaders/Spinner';

const OtherSection = () => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();
	const {
		showCompletedTasks,
		showFocusNotes,
		showTotalFocusDuration,
		maxFocusRecordsPerPage,
		setMaxFocusRecordsPerPage,
		filterOutUnrelatedTasksWhenTaskIdIsApplied,
	} = useUserSettingsContext();

	const handleError = useHandleError();

	// RTK Query - User Settings
	const { data: fetchedUserSettings, isLoading: isLoadingGetUserSettings } = useGetUserSettingsQuery();
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings] = useEditUserSettingsMutation();

	return (
		<div>
			<Accordion
				title={
					<div className="flex items-center gap-1 mb-3">
						<h3 className="text-[16px] font-bold">Other</h3>
						<Icon
							name="diversity_2"
							fill={0}
							customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
						/>
					</div>
				}
				openByDefault={true}
			>
				{/* Checkbox - Show Completed Tasks */}
				{!isLoadingGetUserSettings && (
					<CheckboxOther
						{...{
							userSettings,
							userSettingProperty: 'showCompletedTasks',
							name: 'Show Completed Tasks',
							showValue: showCompletedTasks,
							handleError,
							editUserSettings,
							chosenColorObj,
							nextLightestColorObj,
						}}
					/>
				)}

				{/* Checkbox - Show Completed Tasks */}
				{!isLoadingGetUserSettings && (
					<CheckboxOther
						{...{
							userSettings,
							userSettingProperty: 'showFocusNotes',
							name: 'Show Focus Notes',
							showValue: showFocusNotes,
							handleError,
							editUserSettings,
							chosenColorObj,
							nextLightestColorObj,
						}}
					/>
				)}

				{/* Checkbox - Show Total Focus Records Duration */}
				{!isLoadingGetUserSettings && (
					<CheckboxOther
						{...{
							userSettings,
							userSettingProperty: 'showTotalFocusDuration',
							name: 'Show Total Focus Records Duration',
							showValue: showTotalFocusDuration,
							handleError,
							editUserSettings,
							chosenColorObj,
							nextLightestColorObj,
						}}
					/>
				)}

				{/* Checkbox - Filter Out Unrelated Tasks When Task ID Is Applied */}
				{!isLoadingGetUserSettings && (
					<CheckboxOther
						{...{
							userSettings,
							userSettingProperty: 'filterOutUnrelatedTasksWhenTaskIdIsApplied',
							name: 'Filter Out Unrelated Tasks When Task ID Is Applied',
							showValue: filterOutUnrelatedTasksWhenTaskIdIsApplied,
							handleError,
							editUserSettings,
							chosenColorObj,
							nextLightestColorObj,
						}}
					/>
				)}

				{/* Input - Max Focus Records Per Page */}
				{!isLoadingGetUserSettings && (
					<InputMaxFocusRecordsPerPage
						{...{
							maxFocusRecordsPerPage,
							setMaxFocusRecordsPerPage,
							handleError,
							userSettings,
							editUserSettings,
						}}
					/>
				)}
			</Accordion>
		</div>
	);
};

const InputMaxFocusRecordsPerPage = ({
	maxFocusRecordsPerPage,
	setMaxFocusRecordsPerPage,
	handleError,
	userSettings,
	editUserSettings,
}) => {
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

		setMaxFocusRecordsPerPage(localMaxFocusRecordsPerPage);

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

const CheckboxOther = ({
	userSettings,
	userSettingProperty,
	name,
	showValue,
	handleError,
	editUserSettings,
	chosenColorObj,
	nextLightestColorObj,
}) => {
	return (
		<div
			className="flex gap-1 cursor-pointer"
			onClick={() => {
				const newShowValue = !showValue;

				const restOfFocusRecordsKeysAndVals = userSettings?.tickTickOne?.pages?.focusRecords;

				handleError(async () => {
					const payload = {
						tickTickOne: {
							pages: {
								focusRecords: {
									...restOfFocusRecordsKeysAndVals,
									[userSettingProperty]: newShowValue,
								},
							},
						},
					};

					await editUserSettings(payload).unwrap();
				});
			}}
		>
			<Icon
				name={showValue ? 'check_box' : 'check_box_outline_blank'}
				fill={1}
				customClass={classNames('!text-[22px]', chosenColorObj.textColor, nextLightestColorObj.hover.textColor)}
			/>
			<div>{name}</div>
		</div>
	);
};

export default OtherSection;
