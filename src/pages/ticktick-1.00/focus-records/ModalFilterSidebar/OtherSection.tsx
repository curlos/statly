import classNames from 'classnames';
import Icon from '../../../../components/Icon';
import useHandleError from '../../../../hooks/useHandleError';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useEditUserSettingsMutation } from '../../../../services/resources/userSettingsApi';

const OtherSection = ({
	showCompletedTasks,
	setShowCompletedTasks,
	showTotalFocusDuration,
	setShowTotalFocusDuration,
}) => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	const handleError = useHandleError();

	// RTK Query - User Settings
	const [editUserSettings] = useEditUserSettingsMutation();

	return (
		<div>
			<div className="flex items-center gap-1 mb-3">
				<h3 className="text-[16px] font-bold">Other</h3>
				<Icon
					name="diversity_2"
					fill={0}
					customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
				/>
			</div>
			<div
				className="flex items-center gap-1 cursor-pointer"
				onClick={() => {
					const newShowCompletedTasks = !showCompletedTasks;
					setShowCompletedTasks(newShowCompletedTasks);

					handleError(async () => {
						const payload = {
							tickTickOne: {
								pages: {
									focusRecords: {
										showCompletedTasks: newShowCompletedTasks,
									},
								},
							},
						};

						await editUserSettings(payload).unwrap();
					});
				}}
			>
				<Icon
					name={showCompletedTasks ? 'check_box' : 'check_box_outline_blank'}
					fill={1}
					customClass={classNames(
						'!text-[22px]',
						chosenColorObj.textColor,
						nextLightestColorObj.hover.textColor
					)}
				/>
				<div>Show Completed Tasks</div>
			</div>

			{/* TODO: Probably come back and refactor this into a component to be reused by both Show Completed Tasks and Show Total Focus Duration. */}
			<div
				className="flex items-center gap-1 cursor-pointer"
				onClick={() => {
					const newShowTotalFocusDuration = !showTotalFocusDuration;
					setShowTotalFocusDuration(newShowTotalFocusDuration);

					handleError(async () => {
						const payload = {
							tickTickOne: {
								pages: {
									focusRecords: {
										showTotalFocusDuration: newShowTotalFocusDuration,
									},
								},
							},
						};

						await editUserSettings(payload).unwrap();
					});
				}}
			>
				<Icon
					name={showTotalFocusDuration ? 'check_box' : 'check_box_outline_blank'}
					fill={1}
					customClass={classNames(
						'!text-[22px]',
						chosenColorObj.textColor,
						nextLightestColorObj.hover.textColor
					)}
				/>
				<div>Show Total Focus Records Duration</div>
			</div>
		</div>
	);
};

export default OtherSection;
