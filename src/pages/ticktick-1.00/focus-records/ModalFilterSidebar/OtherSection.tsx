import classNames from 'classnames';
import Icon from '../../../../components/Icon';
import useHandleError from '../../../../hooks/useHandleError';
import { useThemeContext } from '../../../../contexts/useThemeContext';
import { useEditUserSettingsMutation } from '../../../../services/resources/userSettingsApi';

const OtherSection = ({ showCompletedTasks, setShowCompletedTasks }) => {
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
			<div className="flex items-center gap-1">
				<Icon
					name={showCompletedTasks ? 'check_box' : 'check_box_outline_blank'}
					fill={1}
					customClass={classNames(
						'!text-[22px] cursor-pointer',
						chosenColorObj.textColor,
						nextLightestColorObj.hover.textColor
					)}
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
				/>
				<div>Show Completed Tasks</div>
			</div>
		</div>
	);
};

export default OtherSection;
