import classNames from 'classnames';
import Icon from '../../../../components/Icon';
import useHandleError from '../../../../hooks/useHandleError';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useEditUserSettingsMutation, useGetUserSettingsQuery } from '../../../../services/resources/userSettingsApi';
import Accordion from '../../../../components/Accordion/Accordion';

const OtherSection = ({
	showCompletedTasks,
	setShowCompletedTasks,
	showFocusNotes,
	setShowFocusNotes,
	showTotalFocusDuration,
	setShowTotalFocusDuration,
}) => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

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
							setShowValue: setShowCompletedTasks,
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
							setShowValue: setShowFocusNotes,
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
							setShowValue: setShowTotalFocusDuration,
							handleError,
							editUserSettings,
							chosenColorObj,
							nextLightestColorObj,
						}}
					/>
				)}
			</Accordion>
		</div>
	);
};

const CheckboxOther = ({
	userSettings,
	userSettingProperty,
	name,
	showValue,
	setShowValue,
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
				setShowValue(newShowValue);

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
